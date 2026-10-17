/**
 * AgriLink - Smart Collection Network Controller (js/clusters.js)
 * Manages:
 * - Radial clustering display (within CLUSTER_RADIUS_KM = 50 km)
 * - Industry selection within MAX_BUYER_DISTANCE_KM = 300 km of pickup hub
 * - Match score ranking and tie-breaking (prefer closest distance)
 * - Multi-language translation via AgriLinkI18n with real-time re-rendering
 * - Industry type displayed as translated text (not as place name)
 * - Unclustered farmers notice & empty state handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // Reference MAX_BUYER_DISTANCE_KM from AgriLinkAPI (declared in js/api.js)
  const MAX_BUYER_DISTANCE_KM = (window.AgriLinkAPI && window.AgriLinkAPI.MAX_BUYER_DISTANCE_KM) || 300;

  const clustersList = document.getElementById('clusters-list');
  const clustersContentWrap = document.getElementById('clusters-content-wrap');
  const emptyStateEl = document.getElementById('clusters-empty-state');
  const unclusteredNoticeEl = document.getElementById('unclustered-notice');
  const unclusteredNoticeText = document.getElementById('unclustered-notice-text');

  const btnClusterLoadDemo = document.getElementById('btn-cluster-load-demo');
  const btnDemoMode = document.getElementById('btn-demo-mode');
  const btnResetDemo = document.getElementById('btn-reset-demo');

  /**
   * Safe Translation Helper (delegates to window.AgriLinkI18n with parameter interpolation)
   */
  function t(key, params) {
    if (window.AgriLinkI18n && typeof window.AgriLinkI18n.t === 'function') {
      return window.AgriLinkI18n.t(key, params);
    }
    return key;
  }

  /**
   * Safe HTML Escaping
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Residue Name Translation
   */
  function formatResidue(type) {
    const map = {
      'paddy_straw': 'residue.paddy_straw',
      'wheat_straw': 'residue.wheat_straw',
      'sugarcane_bagasse': 'residue.sugarcane_bagasse',
      'maize_stalk': 'residue.maize_stalk',
      'cotton_stalk': 'residue.cotton_stalk',
      'any': 'residue.any'
    };
    const key = map[type];
    return key ? t(key) : type;
  }

  /**
   * Industry Type Translation (rendered as translated text, never formatted as place name)
   */
  function formatIndustryType(type) {
    const map = {
      'biofuel': 'industry_type.biofuel',
      'paper_mill': 'industry_type.paper_mill',
      'compost': 'industry_type.compost',
      'packaging': 'industry_type.packaging'
    };
    const key = map[type];
    return key ? t(key) : type;
  }

  /**
   * Capitalize Place Names (districts, villages, states)
   */
  function capitalize(str) {
    if (window.AgriLinkAPI && window.AgriLinkAPI.formatPlace) {
      return window.AgriLinkAPI.formatPlace(str);
    }
    if (!str) return '';
    return String(str).charAt(0).toUpperCase() + String(str).slice(1).toLowerCase();
  }

  /**
   * Show Toast Notification
   */
  function showToast(message) {
    let toast = document.getElementById('agrilink-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'agrilink-toast';
      toast.className = 'agrilink-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3200);
  }

  /**
   * Industry Selection for Cluster:
   * Considers only industries within MAX_BUYER_DISTANCE_KM (300 km) of pickup hub.
   * Requires:
   *  1. Residue match or 'any'
   *  2. Offered price >= highest farmer ask in the cluster
   *  3. Distance <= MAX_BUYER_DISTANCE_KM
   * Among qualifying industries, picks the one with best match score,
   * tie-breaking on closest distance.
   */
  function selectBestIndustry(cluster, industries, maxDistance = MAX_BUYER_DISTANCE_KM) {
    if (!industries || !industries.length) return null;

    const hubDistrict = cluster.pickup_hub_district_raw || cluster.pickup_hub_district;
    const maxAsk = cluster.max_farmer_ask || 0;
    const totalTons = cluster.total_tons || 0;
    const residueType = cluster.residue_type;

    let bestIndustry = null;
    let bestScore = -1;
    let bestDist = Infinity;

    industries.forEach(ind => {
      // 1. Residue match: specific match or 'any'
      const isResidueMatch = ind.residue_type === 'any' || ind.residue_type === residueType;
      if (!isResidueMatch) return;

      // 2. Offer price must be >= highest farmer ask in the cluster
      const indPrice = parseFloat(ind.price_per_ton) || 0;
      if (indPrice < maxAsk) return;

      // 3. Distance from pickup hub <= maxDistance
      const distToHub = window.AgriLinkAPI && window.AgriLinkAPI.calculateDistanceKm
        ? window.AgriLinkAPI.calculateDistanceKm(hubDistrict, ind.district)
        : 150;
      if (distToHub > maxDistance) return;

      // Compute standard 100-point matching score
      // Residue (30)
      const residueScore = ind.residue_type === residueType ? 30 : 28;
      // Distance (30)
      const distanceScore = Math.max(0, Math.min(30, Math.round(30 * (1 - Math.min(distToHub, 500) / 500))));
      // Price (25: 15 base + up to 10 scaled)
      const priceGap = Math.max(0, indPrice - maxAsk);
      const priceRatio = indPrice > 0 ? priceGap / indPrice : 0;
      const priceBonus = Math.min(10, Math.round(10 * Math.min(1.0, priceRatio / 0.25)));
      const priceScore = Math.min(25, 15 + priceBonus);
      // Quantity (15)
      const indDemand = parseFloat(ind.quantity_tons) || 0;
      const qtyRatio = indDemand > 0 ? Math.min(1.0, totalTons / indDemand) : 1.0;
      const quantityScore = Math.max(5, Math.min(15, Math.round(15 * qtyRatio)));

      const totalScore = residueScore + distanceScore + priceScore + quantityScore;

      // Tie-breaking: pick best match score, preferring closest distance on ties
      let isBetter = false;
      if (totalScore > bestScore) {
        isBetter = true;
      } else if (totalScore === bestScore && distToHub < bestDist) {
        isBetter = true;
      }

      if (isBetter) {
        bestScore = totalScore;
        bestDist = distToHub;
        const coveragePct = indDemand > 0 ? Math.min(100, Math.round((totalTons / indDemand) * 100)) : 100;
        const isPartial = indDemand > 0 && totalTons < indDemand;

        bestIndustry = {
          id: ind.id,
          industry_name: ind.industry_name,
          industry_type: ind.industry_type,
          district: ind.district,
          state: ind.state,
          demand_tons: indDemand,
          distance_km: distToHub,
          offered_price: indPrice,
          score: totalScore,
          coverage_percent: coveragePct,
          is_partial: isPartial,
          price_compatible: true
        };
      }
    });

    return bestIndustry;
  }

  /**
   * Main Render Function
   */
  function renderClusters() {
    if (!window.AgriLinkAPI || !clustersList) return;

    const radius = window.AgriLinkAPI.CLUSTER_RADIUS_KM || 50;
    const clusters = window.AgriLinkAPI.computeClusters(radius, MAX_BUYER_DISTANCE_KM);
    const unclusteredCount = clusters.unclustered_count || 0;

    // Load industries for client-side selection verification
    const industries = JSON.parse(
      localStorage.getItem('agrilink_industry_submissions') || '[]'
    );

    // Re-evaluate industry matching using MAX_BUYER_DISTANCE_KM
    clusters.forEach(c => {
      c.best_industry = selectBestIndustry(c, industries, MAX_BUYER_DISTANCE_KM);
    });

    // Handle Unclustered Farmers Notice
    if (unclusteredNoticeEl && unclusteredNoticeText) {
      if (unclusteredCount > 0) {
        unclusteredNoticeText.textContent = t('clusters.unclustered_note', { count: unclusteredCount });
        unclusteredNoticeEl.style.display = 'flex';
      } else {
        unclusteredNoticeEl.style.display = 'none';
      }
    }

    // Handle Empty State
    if (clusters.length === 0) {
      if (clustersContentWrap) clustersContentWrap.style.display = 'none';
      if (emptyStateEl) emptyStateEl.style.display = 'flex';
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = 'none';
    if (clustersContentWrap) clustersContentWrap.style.display = 'block';

    // Build Cards HTML
    let html = '';
    clusters.forEach(c => {
      const best = c.best_industry;
      const trucksUnit = t('clusters.trucks_unit') || `${c.estimated_trucks} trucks`;

      html += `
        <article class="cluster-card">
          <!-- Cluster Card Header -->
          <div class="cluster-card-header">
            <div class="cluster-header-main">
              <span class="residue-tag ${escapeHtml(c.residue_type)}">
                ${escapeHtml(formatResidue(c.residue_type))}
              </span>
              <span class="cluster-volume-badge">
                <strong>${c.total_tons} t</strong>
                <span class="cluster-volume-sub">${escapeHtml(t('clusters.total_volume'))}</span>
              </span>
            </div>
            <div class="cluster-trucks-pill" title="${escapeHtml(trucksUnit)}">
              <span class="truck-icon">🚛</span>
              <strong>${c.estimated_trucks}</strong>
              <span class="truck-label">${escapeHtml(t('clusters.trucks_count', { count: c.estimated_trucks }))}</span>
            </div>
          </div>

          <!-- Pickup Hub Section -->
          <div class="cluster-hub-banner">
            <div class="hub-icon-wrap">📍</div>
            <div class="hub-info-wrap">
              <span class="hub-label">${escapeHtml(t('clusters.pickup_point'))}</span>
              <strong class="hub-location">${escapeHtml(capitalize(c.pickup_hub_district))}</strong>
              <span class="hub-details">${escapeHtml(capitalize(c.pickup_hub_farmer))} (${escapeHtml(capitalize(c.pickup_hub_village))})</span>
            </div>
          </div>

          <!-- Member Farmers List -->
          <div class="cluster-members-section">
            <div class="cluster-section-title">
              <span>${escapeHtml(t('clusters.members_title'))}</span>
              <span class="members-count-badge">${c.member_count}</span>
            </div>
            <ul class="cluster-member-list">
              ${c.members.map(m => `
                <li class="cluster-member-item ${m.is_hub ? 'is-hub' : ''}">
                  <div class="member-primary">
                    <span class="member-name">${escapeHtml(capitalize(m.name))}</span>
                    <span class="member-location">${escapeHtml(capitalize(m.village))}, ${escapeHtml(capitalize(m.district))}</span>
                  </div>
                  <div class="member-stats">
                    <span class="member-tons">${m.quantity_tons} t</span>
                    <span class="member-price">₹${m.price_per_ton}/t</span>
                    ${m.is_hub 
                      ? `<span class="member-dist-badge hub">${escapeHtml(t('clusters.hub_center'))}</span>`
                      : `<span class="member-dist-badge">${m.distance_from_hub} km ${escapeHtml(t('clusters.from_hub'))}</span>`
                    }
                  </div>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Best Matching Industry Section -->
          <div class="cluster-industry-section">
            <div class="cluster-section-title">
              ${escapeHtml(t('clusters.best_industry'))}
            </div>

            ${best ? `
              <div class="cluster-industry-card">
                <div class="cluster-ind-header">
                  <div>
                    <h4 class="cluster-ind-name">${escapeHtml(capitalize(best.industry_name))}</h4>
                    <span class="cluster-ind-type">${escapeHtml(formatIndustryType(best.industry_type))}</span>
                  </div>
                  <div class="cluster-ind-dist-badge">
                    ${best.distance_km} km
                  </div>
                </div>

                <div class="cluster-ind-meta">
                  <div class="cluster-ind-metric">
                    <span class="ind-metric-label">${escapeHtml(capitalize(best.district))}, ${escapeHtml(capitalize(best.state))}</span>
                  </div>
                  <div class="cluster-ind-metric">
                    <span class="ind-offer-label">${escapeHtml(t('clusters.industry_offer'))}:</span>
                    <strong class="ind-offer-price">₹${best.offered_price} / t</strong>
                  </div>
                </div>

                <div class="cluster-demand-coverage">
                  <div class="coverage-chip">
                    ${escapeHtml(t('clusters.covers_demand', { pct: best.coverage_percent }))}
                  </div>
                  <span class="coverage-sub">(${c.total_tons} t / ${best.demand_tons} t)</span>
                </div>
              </div>
            ` : `
              <div class="cluster-no-industry">
                <span class="no-ind-icon">⚠️</span>
                <span>${escapeHtml(t('clusters.no_industry'))}</span>
              </div>
            `}
          </div>
        </article>
      `;
    });

    clustersList.innerHTML = html;
  }

  // Handle "Load demo data" from empty state
  if (btnClusterLoadDemo) {
    btnClusterLoadDemo.addEventListener('click', () => {
      if (!window.AgriLinkAPI) return;
      window.AgriLinkAPI.loadDemoData();
      renderClusters();
      showToast(t('demo.loaded_success'));
    });
  }

  // Demo Mode load button
  if (btnDemoMode) {
    btnDemoMode.addEventListener('click', () => {
      if (!window.AgriLinkAPI) return;
      window.AgriLinkAPI.loadDemoData();
      renderClusters();
      showToast(t('demo.loaded_success'));
    });
  }

  // Reset Demo button (removes only demo records, preserves user form entries)
  if (btnResetDemo) {
    btnResetDemo.addEventListener('click', () => {
      if (!window.AgriLinkAPI) return;
      window.AgriLinkAPI.clearDemoData();
      renderClusters();
      showToast(t('demo.reset_success'));
    });
  }

  // Re-render when language changes
  window.addEventListener('agrilink:languageChanged', () => {
    renderClusters();
  });

  // Re-render when data changes
  window.addEventListener('agrilink:dataChanged', () => {
    renderClusters();
  });

  // Initial render
  renderClusters();
});
