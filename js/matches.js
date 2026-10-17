/**
 * AgriLink - Matches Portal Controller (js/matches.js)
 * Manages:
 * - Empty state initial display until submissions or demo data loaded
 * - Filter & sorting controls (Residue, State, Max Price, Sort criteria)
 * - Score breakdown interactive modal/popover
 * - Booking confirmation modal with localStorage persistence
 * - Real-time re-rendering on language change
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const matchesTableBody = document.getElementById('matches-table-body');
  const matchesCardsList = document.getElementById('matches-cards-list');
  const emptyStateEl = document.getElementById('matches-empty-state');
  const matchesContentWrap = document.getElementById('matches-content-wrap');
  const matchesCountBadge = document.getElementById('matches-count-badge');

  // Control Elements
  const filterResidue = document.getElementById('filter-residue');
  const filterState = document.getElementById('filter-state');
  const filterMaxPrice = document.getElementById('filter-max-price');
  const sortMatches = document.getElementById('sort-matches');
  const btnLoadDemo = document.getElementById('btn-load-demo');
  const btnClearData = document.getElementById('btn-clear-data');

  // Modals
  const bookingModal = document.getElementById('booking-modal');
  const bookingSummary = document.getElementById('booking-summary');
  const btnConfirmBooking = document.getElementById('btn-confirm-booking');
  const btnCancelBooking = document.getElementById('btn-cancel-booking');
  const btnCloseBookingModal = document.getElementById('btn-close-booking-modal');

  const scoreModal = document.getElementById('score-modal');
  const scoreBreakdownContent = document.getElementById('score-breakdown-content');
  const btnCloseScoreModal = document.getElementById('btn-close-score-modal');

  let currentMatches = [];
  let pendingBookingMatch = null;

  const t = window.AgriLinkI18n ? window.AgriLinkI18n.t : (k => k);

  /**
   * Format Residue Display Label
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
    return t(map[type] || type);
  }

  /**
   * Format Industry Type Display Label
   */
  function formatIndustryType(type) {
    const map = {
      'biofuel': 'industry_type.biofuel',
      'paper_mill': 'industry_type.paper_mill',
      'compost': 'industry_type.compost',
      'packaging': 'industry_type.packaging'
    };
    return t(map[type] || type);
  }

  /**
   * Get Score Badge CSS Class
   */
  function getScoreClass(score) {
    if (score >= 80) return 'high';
    if (score >= 65) return 'med';
    return 'low';
  }

  /**
   * Populate State Filter Dropdown
   */
  function populateStateFilter() {
    if (!filterState || !window.AgriLinkAPI) return;
    const currentVal = filterState.value;
    const states = Object.keys(window.AgriLinkAPI.LOCATION_DATA || {});
    
    let html = `<option value="" data-i18n="matches.all_states">${t('matches.all_states')}</option>`;
    states.forEach(state => {
      const selected = state === currentVal ? 'selected' : '';
      html += `<option value="${state}" ${selected}>${state}</option>`;
    });
    filterState.innerHTML = html;
  }

  /**
   * Fetch and render matches
   */
  async function loadMatches() {
    if (!window.AgriLinkAPI) return;
    const response = await window.AgriLinkAPI.getMatches();

    if (response && response.success) {
      currentMatches = response.data || [];
    } else {
      currentMatches = [];
    }

    renderFilteredMatches();
  }

  /**
   * Filter and sort current matches list
   */
  function getFilteredAndSortedMatches() {
    const residueVal = filterResidue?.value || '';
    const stateVal = filterState?.value || '';
    const maxPriceVal = parseFloat(filterMaxPrice?.value);
    const sortBy = sortMatches?.value || 'score';

    return currentMatches.filter(m => {
      // Residue filter
      if (residueVal && m.residue_type !== residueVal && m.industry.residue_type !== 'any') {
        return false;
      }
      // State filter (farmer or industry state)
      if (stateVal && m.farmer.state !== stateVal && m.industry.state !== stateVal) {
        return false;
      }
      // Max price filter
      if (!isNaN(maxPriceVal) && maxPriceVal > 0 && m.farmer_ask > maxPriceVal) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distance_km - b.distance_km;
      }
      if (sortBy === 'price') {
        return a.farmer_ask - b.farmer_ask;
      }
      // Default: score descending
      return b.score - a.score;
    });
  }

  /**
   * Render matches into Table (Desktop) and Cards (Mobile)
   */
  function renderFilteredMatches() {
    const filtered = getFilteredAndSortedMatches();
    const bookings = window.AgriLinkAPI ? window.AgriLinkAPI.getBookings() : {};

    // Update count indicator
    if (matchesCountBadge) {
      matchesCountBadge.textContent = `${filtered.length} ${t('matches.count')}`;
    }

    // Toggle Empty State
    if (filtered.length === 0) {
      if (emptyStateEl) emptyStateEl.style.display = 'flex';
      if (matchesContentWrap) matchesContentWrap.style.display = 'none';
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = 'none';
    if (matchesContentWrap) matchesContentWrap.style.display = 'block';

    // 1. Render Desktop Table Rows
    let tableHtml = '';
    filtered.forEach(m => {
      const isBooked = Boolean(bookings[m.id]);
      const demoBadgeHtml = m.is_demo
        ? `<span class="badge-sample" data-i18n="matches.sample_data">${t('matches.sample_data')}</span>`
        : '';
      const scoreClass = getScoreClass(m.score);

      const actionHtml = isBooked
        ? `<span class="badge-status pending" data-i18n="status.pending">${t('status.pending')}</span>`
        : `<button class="btn-book" data-match-id="${m.id}" data-i18n="matches.book_btn">${t('matches.book_btn')}</button>`;

      tableHtml += `
        <tr>
          <!-- Farmer -->
          <td>
            <div class="entity-cell">
              <span class="entity-name">${escapeHtml(m.farmer.name)} ${demoBadgeHtml}</span>
              <span class="entity-sub">${escapeHtml(m.farmer.village)}, ${escapeHtml(m.farmer.district)}, ${escapeHtml(m.farmer.state)}</span>
              <span class="entity-sub" style="font-size:0.75rem; color:var(--earth-700);">📞 ${escapeHtml(m.farmer.phone)}</span>
            </div>
          </td>

          <!-- Industry Buyer & Type -->
          <td>
            <div class="entity-cell">
              <span class="entity-name">${escapeHtml(m.industry.industry_name)}</span>
              <span class="entity-sub">
                <span class="badge-km" style="background:#E0F2FE; color:#0369A1; border-color:#BAE6FD;">
                  ${formatIndustryType(m.industry.industry_type)}
                </span>
                &bull; ${escapeHtml(m.industry.district)}, ${escapeHtml(m.industry.state)}
              </span>
            </div>
          </td>

          <!-- Residue -->
          <td>
            <span class="badge-km" style="background:var(--green-100); color:var(--green-900); border-color:rgba(45,106,53,0.3);">
              ${formatResidue(m.residue_type)}
            </span>
          </td>

          <!-- Quantity -->
          <td>
            <strong>${m.farmer.quantity_tons}t</strong>
            <span style="font-size:0.8rem; color:var(--text-muted);"> / ${m.industry.quantity_tons}t</span>
          </td>

          <!-- Distance -->
          <td>
            <span class="badge-km">📍 ${m.distance_km} km</span>
          </td>

          <!-- Farmer Ask & Industry Offer -->
          <td><strong>₹${m.farmer_ask.toLocaleString('en-IN')}</strong></td>
          <td><span style="color:var(--amber-700); font-weight:700;">₹${m.industry_offer.toLocaleString('en-IN')}</span></td>

          <!-- Price Margin -->
          <td>
            <span class="badge-gap">+₹${m.price_gap.toLocaleString('en-IN')}</span>
          </td>

          <!-- Match Score -->
          <td>
            <button class="badge-score ${scoreClass} btn-score-trigger" data-match-id="${m.id}" title="${t('matches.score_tap_hint')}">
              <span>${m.score}</span>/100
              <span class="badge-score-icon">ℹ️</span>
            </button>
          </td>

          <!-- Booking Action -->
          <td>
            ${actionHtml}
          </td>
        </tr>
      `;
    });

    if (matchesTableBody) matchesTableBody.innerHTML = tableHtml;

    // 2. Render Mobile Cards
    let cardsHtml = '';
    filtered.forEach(m => {
      const isBooked = Boolean(bookings[m.id]);
      const demoBadgeHtml = m.is_demo
        ? `<span class="badge-sample" data-i18n="matches.sample_data">${t('matches.sample_data')}</span>`
        : '';
      const scoreClass = getScoreClass(m.score);

      const actionHtml = isBooked
        ? `<span class="badge-status pending" data-i18n="status.pending">${t('status.pending')}</span>`
        : `<button class="btn-book" data-match-id="${m.id}" data-i18n="matches.book_btn">${t('matches.book_btn')}</button>`;

      cardsHtml += `
        <div class="match-card">
          <div class="match-card-header">
            <div style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
              <span class="badge-km" style="background:var(--green-100); color:var(--green-900); font-size:0.85rem;">
                🌾 ${formatResidue(m.residue_type)}
              </span>
              <span class="badge-km">📍 ${m.distance_km} km</span>
              ${demoBadgeHtml}
            </div>

            <!-- Score Badge -->
            <button class="badge-score ${scoreClass} btn-score-trigger" data-match-id="${m.id}" title="${t('matches.score_tap_hint')}">
              <span>${m.score}</span>/100
              <span class="badge-score-icon">ℹ️</span>
            </button>
          </div>

          <!-- Parties Grid -->
          <div class="match-parties">
            <div class="party-box">
              <span class="party-role" data-i18n="matches.col_farmer">${t('matches.col_farmer')}</span>
              <span class="party-name">${escapeHtml(m.farmer.name)}</span>
              <span class="party-meta">${escapeHtml(m.farmer.village)}, ${escapeHtml(m.farmer.district)}</span>
              <span class="party-meta" style="font-weight:600; color:var(--green-800);">Supply: ${m.farmer.quantity_tons} tons &bull; ₹${m.farmer_ask}/t</span>
            </div>

            <div class="party-box" style="border-top: 1px dashed var(--border-light); padding-top: 0.5rem;">
              <span class="party-role" data-i18n="matches.col_industry">${t('matches.col_industry')}</span>
              <span class="party-name">${escapeHtml(m.industry.industry_name)}</span>
              <span class="party-meta">
                <strong style="color:var(--amber-700);">${formatIndustryType(m.industry.industry_type)}</strong> &bull; ${escapeHtml(m.industry.district)}
              </span>
              <span class="party-meta" style="font-weight:600; color:var(--amber-700);">Offer: ₹${m.industry_offer}/t &bull; Gap: +₹${m.price_gap}/t</span>
            </div>
          </div>

          <!-- Action Footer -->
          <div class="match-card-actions">
            <div>
              <span style="font-size:0.8rem; color:var(--text-muted);">Margin:</span>
              <span class="badge-gap" style="font-size:0.88rem;">+₹${m.price_gap}/t</span>
            </div>
            <div>
              ${actionHtml}
            </div>
          </div>
        </div>
      `;
    });

    if (matchesCardsList) matchesCardsList.innerHTML = cardsHtml;

    // Attach Event Listeners to Buttons
    attachCardListeners();
  }

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
   * Attach listeners to interactive elements in table and cards
   */
  function attachCardListeners() {
    // Score breakdown triggers
    document.querySelectorAll('.btn-score-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const matchId = btn.getAttribute('data-match-id');
        openScoreModal(matchId);
      });
    });

    // Booking triggers
    document.querySelectorAll('.btn-book').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const matchId = btn.getAttribute('data-match-id');
        openBookingModal(matchId);
      });
    });
  }

  /**
   * Open Score Breakdown Modal
   */
  function openScoreModal(matchId) {
    const match = currentMatches.find(m => m.id === matchId);
    if (!match || !scoreModal || !scoreBreakdownContent) return;

    const b = match.breakdown;
    scoreBreakdownContent.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <h4 style="font-size:1.1rem; color:var(--green-900);">${escapeHtml(match.farmer.name)} &harr; ${escapeHtml(match.industry.industry_name)}</h4>
        <p style="font-size:0.85rem; color:var(--text-muted);">${formatResidue(match.residue_type)} &bull; ${match.distance_km} km &bull; ₹${match.farmer_ask} ask / ₹${match.industry_offer} offer</p>
      </div>

      <div class="breakdown-list">
        <!-- Residue Match -->
        <div class="breakdown-item">
          <div class="breakdown-row">
            <span data-i18n="matches.score_residue">${t('matches.score_residue')}</span>
            <span><strong>${b.residue}</strong> / 30 pts</span>
          </div>
          <div class="breakdown-bar-bg">
            <div class="breakdown-bar-fill" style="width: ${(b.residue / 30) * 100}%;"></div>
          </div>
        </div>

        <!-- Distance Score -->
        <div class="breakdown-item">
          <div class="breakdown-row">
            <span data-i18n="matches.score_distance">${t('matches.score_distance')}</span>
            <span><strong>${b.distance}</strong> / 30 pts (${b.distance_km} km)</span>
          </div>
          <div class="breakdown-bar-bg">
            <div class="breakdown-bar-fill" style="width: ${(b.distance / 30) * 100}%;"></div>
          </div>
        </div>

        <!-- Price Score -->
        <div class="breakdown-item">
          <div class="breakdown-row">
            <span data-i18n="matches.score_price">${t('matches.score_price')}</span>
            <span><strong>${b.price}</strong> / 25 pts (+₹${b.price_gap}/t)</span>
          </div>
          <div class="breakdown-bar-bg">
            <div class="breakdown-bar-fill" style="width: ${(b.price / 25) * 100}%;"></div>
          </div>
        </div>

        <!-- Quantity Coverage -->
        <div class="breakdown-item">
          <div class="breakdown-row">
            <span data-i18n="matches.score_quantity">${t('matches.score_quantity')}</span>
            <span><strong>${b.quantity}</strong> / 15 pts (${b.qty_coverage_pct}% coverage)</span>
          </div>
          <div class="breakdown-bar-bg">
            <div class="breakdown-bar-fill" style="width: ${(b.quantity / 15) * 100}%;"></div>
          </div>
        </div>
      </div>

      <div style="background:var(--green-50); border:1.5px solid var(--green-600); border-radius:var(--radius-md); padding:0.85rem 1rem; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:800; color:var(--green-900);" data-i18n="matches.score_total">${t('matches.score_total')}</span>
        <span style="font-size:1.35rem; font-weight:800; color:var(--green-800);">${b.total} / 100</span>
      </div>
    `;

    scoreModal.classList.add('open');
  }

  function closeScoreModal() {
    if (scoreModal) scoreModal.classList.remove('open');
  }

  /**
   * Open Booking Confirmation Modal
   */
  function openBookingModal(matchId) {
    const match = currentMatches.find(m => m.id === matchId);
    if (!match || !bookingModal || !bookingSummary) return;

    pendingBookingMatch = match;
    bookingSummary.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:0.5rem;">
        <div><strong>${t('matches.col_farmer')}:</strong> ${escapeHtml(match.farmer.name)} (${escapeHtml(match.farmer.village)}, ${escapeHtml(match.farmer.district)}, ${escapeHtml(match.farmer.state)})</div>
        <div><strong>${t('matches.col_industry')}:</strong> ${escapeHtml(match.industry.industry_name)} (${formatIndustryType(match.industry.industry_type)} - ${escapeHtml(match.industry.district)}, ${escapeHtml(match.industry.state)})</div>
        <div><strong>${t('matches.col_residue')}:</strong> ${formatResidue(match.residue_type)}</div>
        <div><strong>${t('matches.col_qty')}:</strong> ${match.farmer.quantity_tons} tons</div>
        <div><strong>Agreed Baseline Price:</strong> ₹${match.farmer_ask} / ton (Industry budget: ₹${match.industry_offer})</div>
        <div><strong>${t('matches.col_distance')}:</strong> ${match.distance_km} km</div>
      </div>
    `;

    bookingModal.classList.add('open');
  }

  function closeBookingModal() {
    if (bookingModal) bookingModal.classList.remove('open');
    pendingBookingMatch = null;
  }

  // Confirm Booking button click
  if (btnConfirmBooking) {
    btnConfirmBooking.addEventListener('click', () => {
      if (!pendingBookingMatch || !window.AgriLinkAPI) return;

      window.AgriLinkAPI.saveBooking(pendingBookingMatch.id, {
        farmer_name: pendingBookingMatch.farmer.name,
        industry_name: pendingBookingMatch.industry.industry_name,
        residue_type: pendingBookingMatch.residue_type,
        quantity_tons: pendingBookingMatch.farmer.quantity_tons,
        price_per_ton: pendingBookingMatch.farmer_ask,
        farmer_state: pendingBookingMatch.farmer.state || '',
        farmer_district: pendingBookingMatch.farmer.district || '',
        industry_state: pendingBookingMatch.industry.state || '',
        industry_district: pendingBookingMatch.industry.district || '',
        farmer: pendingBookingMatch.farmer,
        industry: pendingBookingMatch.industry,
        is_demo: Boolean(pendingBookingMatch.is_demo)
      });

      closeBookingModal();
      renderFilteredMatches();
    });
  }

  // Cancel & Close booking modal
  if (btnCancelBooking) btnCancelBooking.addEventListener('click', closeBookingModal);
  if (btnCloseBookingModal) btnCloseBookingModal.addEventListener('click', closeBookingModal);
  if (btnCloseScoreModal) btnCloseScoreModal.addEventListener('click', closeScoreModal);

  // Close modals on outside overlay click
  window.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeBookingModal();
    if (e.target === scoreModal) closeScoreModal();
  });

  // Action Buttons: Load Demo Data & Clear Data
  if (btnLoadDemo) {
    btnLoadDemo.addEventListener('click', () => {
      if (!window.AgriLinkAPI) return;
      window.AgriLinkAPI.loadDemoData();
      loadMatches();
    });
  }

  if (btnClearData) {
    btnClearData.addEventListener('click', () => {
      if (!window.AgriLinkAPI) return;
      if (confirm('Are you sure you want to clear all submissions and demo data?')) {
        window.AgriLinkAPI.clearAllData();
        loadMatches();
      }
    });
  }

  // Filter Listeners
  if (filterResidue) filterResidue.addEventListener('change', renderFilteredMatches);
  if (filterState) filterState.addEventListener('change', renderFilteredMatches);
  if (filterMaxPrice) filterMaxPrice.addEventListener('input', renderFilteredMatches);
  if (sortMatches) sortMatches.addEventListener('change', renderFilteredMatches);

  // Re-render on language changed
  window.addEventListener('agrilink:languageChanged', () => {
    populateStateFilter();
    renderFilteredMatches();
  });

  // Initialize
  populateStateFilter();
  loadMatches();
});
