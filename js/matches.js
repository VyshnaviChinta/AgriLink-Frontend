/**
 * AgriLink - Matches Portal Controller (js/matches.js)
 * Manages:
 * - Empty state initial display until submissions or demo data loaded
 * - Filter & sorting controls (Residue, State, Max Price, Sort criteria)
 * - Score breakdown interactive modal/popover
 * - Deal & Logistics panel with status stepper and persistence across reloads
 * - Mock payment (Demo only) section
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
  const btnDemoMode = document.getElementById('btn-demo-mode');
  const btnResetDemo = document.getElementById('btn-reset-demo');

  // Modals
  const bookingModal = document.getElementById('booking-modal');
  const bookingModalTitle = document.getElementById('booking-modal-title');
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
   * Capitalize Places Helper
   */
  function capitalize(str) {
    if (window.AgriLinkAPI && window.AgriLinkAPI.formatPlace) {
      return window.AgriLinkAPI.formatPlace(str);
    }
    if (!str) return '';
    return String(str).charAt(0).toUpperCase() + String(str).slice(1).toLowerCase();
  }

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
    try {
      currentMatches = await window.AgriLinkAPI.getMatches();
      renderFilteredMatches();
    } catch (err) {
      console.error('Failed to load matches:', err);
    }
  }

  /**
   * Filter and sort current matches list
   */
  function getFilteredAndSortedMatches() {
    const residueVal = filterResidue ? filterResidue.value : '';
    const stateVal = filterState ? filterState.value : '';
    const maxPriceVal = filterMaxPrice ? parseFloat(filterMaxPrice.value) : NaN;
    const sortBy = sortMatches ? sortMatches.value : 'score';

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
   * Get Deal Status Label & Badge HTML
   */
  function getDealStatusBadge(booking, matchId) {
    if (!booking) {
      return `<button class="btn-book" data-match-id="${matchId}" data-i18n="matches.book_btn">${t('matches.book_btn')}</button>`;
    }
    const step = booking.status_step || 'pending';
    if (step === 'picked_up') {
      return `
        <button class="badge-status available btn-deal-logistics" data-match-id="${matchId}" title="View Logistics Details">
          <span>${t('logistics.step_picked_up')}</span>
          <span>✅</span>
        </button>
      `;
    }
    if (step === 'confirmed') {
      return `
        <button class="badge-status btn-deal-logistics" style="background:#E0F2FE; color:#0369A1; border:1.5px solid #0284C7; cursor:pointer;" data-match-id="${matchId}" title="View Logistics Details">
          <span>${t('logistics.step_confirmed')}</span>
          <span>🚚</span>
        </button>
      `;
    }
    // pending
    return `
      <button class="badge-status pending btn-deal-logistics" data-match-id="${matchId}" title="View Logistics Details">
        <span>${t('logistics.step_pending')}</span>
        <span>📋</span>
      </button>
    `;
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
      const booking = bookings[m.id];
      const demoBadgeHtml = m.is_demo
        ? `<span class="badge-sample" data-i18n="matches.sample_data">${t('matches.sample_data')}</span>`
        : '';
      const scoreClass = getScoreClass(m.score);
      const actionHtml = getDealStatusBadge(booking, m.id);

      tableHtml += `
        <tr>
          <!-- Farmer -->
          <td>
            <div class="entity-cell">
              <span class="entity-name">${escapeHtml(capitalize(m.farmer.name))} ${demoBadgeHtml}</span>
              <span class="entity-sub">${escapeHtml(capitalize(m.farmer.village))}, ${escapeHtml(capitalize(m.farmer.district))}, ${escapeHtml(capitalize(m.farmer.state))}</span>
              <span class="entity-sub" style="font-size:0.75rem; color:var(--earth-700);">📞 ${escapeHtml(m.farmer.phone)}</span>
            </div>
          </td>

          <!-- Industry Buyer & Type -->
          <td>
            <div class="entity-cell">
              <span class="entity-name">${escapeHtml(capitalize(m.industry.industry_name))}</span>
              <span class="entity-sub">
                <span class="badge-km" style="background:#E0F2FE; color:#0369A1; border-color:#BAE6FD;">
                  ${formatIndustryType(m.industry.industry_type)}
                </span>
                &bull; ${escapeHtml(capitalize(m.industry.district))}, ${escapeHtml(capitalize(m.industry.state))}
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
      const booking = bookings[m.id];
      const demoBadgeHtml = m.is_demo
        ? `<span class="badge-sample" data-i18n="matches.sample_data">${t('matches.sample_data')}</span>`
        : '';
      const scoreClass = getScoreClass(m.score);
      const actionHtml = getDealStatusBadge(booking, m.id);

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

          <!-- Entities Overview -->
          <div class="match-parties">
            <div class="match-party">
              <span class="party-label" data-i18n="matches.col_farmer">${t('matches.col_farmer')}</span>
              <span class="party-name">${escapeHtml(capitalize(m.farmer.name))}</span>
              <span class="party-loc">${escapeHtml(capitalize(m.farmer.village))}, ${escapeHtml(capitalize(m.farmer.district))}</span>
              <span class="party-price">Ask: ₹${m.farmer_ask.toLocaleString('en-IN')}/t</span>
            </div>

            <div class="match-arrow">&rarr;</div>

            <div class="match-party">
              <span class="party-label" data-i18n="matches.col_industry">${t('matches.col_industry')}</span>
              <span class="party-name">${escapeHtml(capitalize(m.industry.industry_name))}</span>
              <span class="party-loc">${formatIndustryType(m.industry.industry_type)} &bull; ${escapeHtml(capitalize(m.industry.district))}</span>
              <span class="party-price" style="color:var(--amber-700);">Offer: ₹${m.industry_offer.toLocaleString('en-IN')}/t</span>
            </div>
          </div>

          <!-- Metrics Row -->
          <div class="match-metrics-row">
            <div>
              <span class="metric-sub" data-i18n="matches.col_qty">${t('matches.col_qty')}</span>
              <strong>${m.farmer.quantity_tons} tons</strong>
            </div>
            <div>
              <span class="metric-sub" data-i18n="matches.col_gap">${t('matches.col_gap')}</span>
              <span class="badge-gap">+₹${m.price_gap.toLocaleString('en-IN')}</span>
            </div>
            <div style="text-align:right;">
              ${actionHtml}
            </div>
          </div>
        </div>
      `;
    });

    if (matchesCardsList) matchesCardsList.innerHTML = cardsHtml;

    // Attach Click Handlers
    attachTableAndCardListeners();
  }

  /**
   * Attach Interactive Event Listeners
   */
  function attachTableAndCardListeners() {
    // Score triggers
    document.querySelectorAll('.btn-score-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const matchId = btn.getAttribute('data-match-id');
        openScoreModal(matchId);
      });
    });

    // Booking triggers
    document.querySelectorAll('.btn-book, .btn-deal-logistics').forEach(btn => {
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
        <h4 style="font-size:1.1rem; color:var(--green-900);">${escapeHtml(capitalize(match.farmer.name))} &harr; ${escapeHtml(capitalize(match.industry.industry_name))}</h4>
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
   * Open Booking / Deal & Logistics Modal
   */
  function openBookingModal(matchId) {
    const match = currentMatches.find(m => m.id === matchId);
    if (!match || !bookingModal || !bookingSummary) return;

    pendingBookingMatch = match;
    const bookings = window.AgriLinkAPI ? window.AgriLinkAPI.getBookings() : {};
    const existing = bookings[matchId];

    const todayDate = new Date().toISOString().split('T')[0];
    const defaultDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const trucksCount = existing ? (existing.estimated_trucks || Math.ceil(match.farmer.quantity_tons / 10)) : Math.ceil(match.farmer.quantity_tons / 10);
    const pickupDistrict = existing ? (existing.pickup_district || capitalize(match.farmer.district)) : capitalize(match.farmer.district);
    const pickupDate = existing ? (existing.pickup_date || defaultDate) : defaultDate;
    const statusStep = existing ? (existing.status_step || 'pending') : 'pending';

    if (!existing) {
      // Unbooked Proposal Modal
      if (bookingModalTitle) bookingModalTitle.textContent = t('matches.modal_title');
      if (btnConfirmBooking) btnConfirmBooking.style.display = 'inline-flex';
      if (btnCancelBooking) btnCancelBooking.textContent = t('matches.modal_cancel');

      bookingSummary.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:0.5rem;">
          <div><strong>${t('matches.col_farmer')}:</strong> ${escapeHtml(capitalize(match.farmer.name))} (${escapeHtml(capitalize(match.farmer.village))}, ${escapeHtml(capitalize(match.farmer.district))}, ${escapeHtml(capitalize(match.farmer.state))})</div>
          <div><strong>${t('matches.col_industry')}:</strong> ${escapeHtml(capitalize(match.industry.industry_name))} (${formatIndustryType(match.industry.industry_type)} - ${escapeHtml(capitalize(match.industry.district))}, ${escapeHtml(capitalize(match.industry.state))})</div>
          <div><strong>${t('matches.col_residue')}:</strong> ${formatResidue(match.residue_type)}</div>
          <div><strong>${t('matches.col_qty')}:</strong> ${match.farmer.quantity_tons} tons</div>
          <div><strong>Agreed Baseline Price:</strong> ₹${match.farmer_ask} / ton (Industry budget: ₹${match.industry_offer})</div>
          <div><strong>${t('matches.col_distance')}:</strong> ${match.distance_km} km</div>
        </div>
      `;
    } else {
      // Booked Deal & Logistics Modal
      if (bookingModalTitle) bookingModalTitle.textContent = t('logistics.title');
      if (btnConfirmBooking) btnConfirmBooking.style.display = 'none';
      if (btnCancelBooking) btnCancelBooking.textContent = 'Close';

      const isPending = statusStep === 'pending';
      const isConfirmed = statusStep === 'confirmed';
      const isPickedUp = statusStep === 'picked_up';

      bookingSummary.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          <div>
            <strong>${escapeHtml(capitalize(match.farmer.name))}</strong> &harr; <strong>${escapeHtml(capitalize(match.industry.industry_name))}</strong>
            <div style="font-size:0.85rem; color:var(--text-muted);">${formatResidue(match.residue_type)} &bull; ${match.farmer.quantity_tons} tons &bull; ₹${match.farmer_ask}/t</div>
          </div>

          <!-- Status Progression Stepper -->
          <div class="logistics-panel">
            <span class="logistics-label" data-i18n="logistics.status_label">${t('logistics.status_label')}</span>
            <div class="logistics-stepper">
              <span class="logistics-step ${isPending ? 'active' : 'completed'}" data-i18n="logistics.step_pending">
                ${t('logistics.step_pending')}
              </span>
              <span class="logistics-step ${isConfirmed ? 'active' : (isPickedUp ? 'completed' : '')}" data-i18n="logistics.step_confirmed">
                ${t('logistics.step_confirmed')}
              </span>
              <span class="logistics-step ${isPickedUp ? 'active completed' : ''}" data-i18n="logistics.step_picked_up">
                ${t('logistics.step_picked_up')}
              </span>
            </div>

            <div style="margin-top:0.75rem;">
              ${!isPickedUp ? `
                <button type="button" id="btn-advance-status" class="btn btn-secondary btn-sm" style="width:100%; justify-content:center;">
                  <span>⏩</span>
                  <span data-i18n="logistics.advance_status">${t('logistics.advance_status')}</span>
                  (${isPending ? t('logistics.step_confirmed') : t('logistics.step_picked_up')})
                </button>
              ` : `
                <div style="text-align:center; font-weight:700; color:var(--green-800); font-size:0.9rem;">
                  ✅ Stubble Picked Up & Transferred
                </div>
              `}
            </div>
          </div>

          <!-- Logistics Details Grid -->
          <div class="logistics-panel">
            <h4 class="logistics-title">
              <span>🚚</span>
              <span data-i18n="logistics.title">${t('logistics.title')}</span>
            </h4>
            <div class="logistics-grid">
              <div class="logistics-field">
                <span class="logistics-label" data-i18n="logistics.pickup_district">${t('logistics.pickup_district')}</span>
                <span class="logistics-val">${escapeHtml(pickupDistrict)}</span>
              </div>
              <div class="logistics-field">
                <span class="logistics-label" data-i18n="logistics.estimated_trucks">${t('logistics.estimated_trucks')}</span>
                <span class="logistics-val">${trucksCount} ${t('logistics.trucks_unit')}</span>
              </div>
              <div class="logistics-field" style="grid-column: 1 / -1;">
                <label for="logistics-pickup-date" class="logistics-label" data-i18n="logistics.pickup_date">${t('logistics.pickup_date')}</label>
                <input 
                  type="date" 
                  id="logistics-pickup-date" 
                  class="logistics-date-input" 
                  min="${todayDate}" 
                  value="${pickupDate}"
                >
              </div>
            </div>
          </div>

          <!-- Mock Payment Section -->
          <div class="mock-payment-card">
            <div class="mock-payment-header">
              <span>💳</span>
              <span data-i18n="logistics.mock_payment">${t('logistics.mock_payment')}</span>
            </div>
            <p class="mock-payment-note" data-i18n="logistics.payment_note">
              ${t('logistics.payment_note')}
            </p>
          </div>
        </div>
      `;

      // Date change listener
      const dateInput = document.getElementById('logistics-pickup-date');
      if (dateInput) {
        dateInput.addEventListener('change', (e) => {
          existing.pickup_date = e.target.value;
          window.AgriLinkAPI.saveBooking(matchId, existing);
          showToast('Pickup date updated!');
        });
      }

      // Advance Status button listener
      const advanceBtn = document.getElementById('btn-advance-status');
      if (advanceBtn) {
        advanceBtn.addEventListener('click', () => {
          if (existing.status_step === 'pending') {
            existing.status_step = 'confirmed';
          } else if (existing.status_step === 'confirmed') {
            existing.status_step = 'picked_up';
          }
          window.AgriLinkAPI.saveBooking(matchId, existing);
          renderFilteredMatches();
          openBookingModal(matchId);
          showToast('Deal status updated!');
        });
      }
    }

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

      const todayDate = new Date().toISOString().split('T')[0];
      const defaultDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const trucksCount = Math.ceil(pendingBookingMatch.farmer.quantity_tons / (window.AgriLinkAPI.TONS_PER_TRUCK || 10));

      const bookingData = {
        farmer_name: pendingBookingMatch.farmer.name,
        industry_name: pendingBookingMatch.industry.industry_name,
        residue_type: pendingBookingMatch.residue_type,
        quantity_tons: pendingBookingMatch.farmer.quantity_tons,
        price_per_ton: pendingBookingMatch.farmer_ask,
        farmer_state: pendingBookingMatch.farmer.state || '',
        farmer_district: capitalize(pendingBookingMatch.farmer.district || ''),
        industry_state: pendingBookingMatch.industry.state || '',
        industry_district: capitalize(pendingBookingMatch.industry.district || ''),
        farmer: pendingBookingMatch.farmer,
        industry: pendingBookingMatch.industry,
        is_demo: Boolean(pendingBookingMatch.is_demo),
        status_step: 'pending',
        pickup_date: defaultDate,
        pickup_district: capitalize(pendingBookingMatch.farmer.district || ''),
        estimated_trucks: trucksCount
      };

      window.AgriLinkAPI.saveBooking(pendingBookingMatch.id, bookingData);
      renderFilteredMatches();
      // Transition modal to show logistics details immediately
      openBookingModal(pendingBookingMatch.id);
      showToast('Booking confirmed! Logistics details active.');
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
      showToast(t('demo.loaded_success'));
    });
  }

  if (btnDemoMode) {
    btnDemoMode.addEventListener('click', () => {
      if (!window.AgriLinkAPI) return;
      window.AgriLinkAPI.loadDemoData();
      loadMatches();
      showToast(t('demo.loaded_success'));
    });
  }

  if (btnResetDemo) {
    btnResetDemo.addEventListener('click', () => {
      if (!window.AgriLinkAPI) return;
      window.AgriLinkAPI.clearDemoData();
      loadMatches();
      showToast(t('demo.reset_success'));
    });
  }

  if (btnClearData) {
    btnClearData.addEventListener('click', () => {
      if (!window.AgriLinkAPI) return;
      if (confirm('Are you sure you want to clear all submissions and demo data?')) {
        window.AgriLinkAPI.clearAllData();
        loadMatches();
        showToast('All data cleared.');
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
