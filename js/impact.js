/**
 * AgriLink - Environmental & Economic Impact Controller (js/impact.js)
 * 
 * CONFIGURATION & ASSUMPTIONS:
 * All global conversion factors and economic parameters are centralized below.
 */

const CONFIG = {
  CO2_PER_TON_AVOIDED_KG: 1460,    // kg CO2 avoided per ton of residue diverted from open burning (editable assumption)
  KG_CO2_PER_TREE_PER_YEAR: 21,    // kg CO2 sequestered by one mature tree annually
  TONS_PER_CARBON_CREDIT: 1.0,    // 1 carbon credit = 1 tonne CO2e
  CREDIT_PRICE_INR: 800,          // Estimated trading price per carbon credit in INR
  PLATFORM_FEE_PERCENT: 2.0,      // Platform facilitation fee on residue trade value (2%)
  BROKERAGE_PERCENT: 10.0         // Platform commission on estimated carbon credit value (10%)
};

// State Variables
let currentEmissionFactor = CONFIG.CO2_PER_TON_AVOIDED_KG;
let currentMode = 'booked'; // 'booked' or 'potential'
let chartEarnings = null;
let chartIndustry = null;
let chartResidue = null;

document.addEventListener('DOMContentLoaded', () => {
  const t = window.AgriLinkI18n ? window.AgriLinkI18n.t : (k => k);

  // UI Elements
  const toggleBooked = document.getElementById('toggle-booked');
  const togglePotential = document.getElementById('toggle-potential');
  const modeNoticeEl = document.getElementById('impact-mode-notice');
  const sampleBadgeEl = document.getElementById('impact-sample-badge');
  const emptyStateEl = document.getElementById('impact-empty-state');
  const contentWrapEl = document.getElementById('impact-content-wrap');

  // Editable Assumption Elements
  const factorInput = document.getElementById('emission-factor-input');
  const btnResetFactor = document.getElementById('btn-reset-factor');

  // Summary Metric Card Value Elements
  const valEarnings = document.getElementById('val-earnings');
  const valResidue = document.getElementById('val-residue');
  const valCo2 = document.getElementById('val-co2');
  const valTrees = document.getElementById('val-trees');
  const valCredits = document.getElementById('val-credits');
  const valCreditValue = document.getElementById('val-credit-value');
  const valPlatformFee = document.getElementById('val-platform-fee');
  const valBrokerage = document.getElementById('val-brokerage');

  // Government View Elements
  const valGovtResidue = document.getElementById('val-govt-residue');
  const valGovtCo2 = document.getElementById('val-govt-co2');
  const valGovtDistricts = document.getElementById('val-govt-districts');
  const valGovtDistrictsList = document.getElementById('val-govt-districts-list');

  /**
   * Helper: Format numbers with Indian commas
   */
  function formatINR(num) {
    return Math.round(num).toLocaleString('en-IN');
  }

  function formatTons(num) {
    return (Math.round(num * 10) / 10).toLocaleString('en-IN');
  }

  /**
   * Helper: Translate residue key
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
   * Ingest and Deduplicate Data to Avoid Double-Counting
   */
  async function getAggregatedData() {
    const bookings = window.AgriLinkAPI ? window.AgriLinkAPI.getBookings() : {};
    let matchesResponse = window.AgriLinkAPI ? await window.AgriLinkAPI.getMatches() : { data: [] };
    const allMatches = (matchesResponse && matchesResponse.data) ? matchesResponse.data : [];

    // Check if demo data is in use
    const hasDemoMatches = allMatches.some(m => m.is_demo);
    const hasDemoBookings = Object.values(bookings).some(b => b.is_demo);
    const isSampleDataActive = hasDemoMatches || hasDemoBookings;

    if (sampleBadgeEl) {
      sampleBadgeEl.style.display = isSampleDataActive ? 'inline-flex' : 'none';
    }

    if (currentMode === 'booked') {
      // 1. Booked Deals Mode
      const bookingList = Object.entries(bookings).map(([id, b]) => ({ id, ...b }));
      if (bookingList.length === 0) {
        return { items: [], districts: [], isSample: isSampleDataActive };
      }

      // Collect unique districts across all booked deals (farmers and industries)
      const bookedDistrictsSet = new Set();

      // Avoid double counting: map by farmer to avoid multiple count if multiple deals exist
      const farmerDeals = new Map();
      bookingList.forEach(b => {
        // Look up corresponding match in allMatches if district info is missing
        const matchedRecord = allMatches.find(m => m.id === b.id) || 
                              allMatches.find(m => 
                                (m.farmer && (m.farmer.name === b.farmer_name || (b.farmer && m.farmer.name === b.farmer.name))) &&
                                (m.industry && (m.industry.industry_name === b.industry_name || (b.industry && m.industry.industry_name === b.industry.industry_name)))
                              );

        const farmerName = b.farmer_name || (b.farmer && b.farmer.name) || (matchedRecord && matchedRecord.farmer && matchedRecord.farmer.name) || 'Farmer';
        const fQty = parseFloat(b.quantity_tons || (b.farmer && b.farmer.quantity_tons) || (matchedRecord && matchedRecord.farmer && matchedRecord.farmer.quantity_tons) || 0);
        const iQty = parseFloat((b.industry && b.industry.quantity_tons) || (matchedRecord && matchedRecord.industry && matchedRecord.industry.quantity_tons) || fQty);
        // Traded tons = min(farmer quantity, industry quantity)
        const tradedTons = Math.min(fQty, iQty) || fQty;
        const price = parseFloat(b.price_per_ton || b.farmer_ask || (matchedRecord && matchedRecord.farmer_ask) || 0);

        const farmerDistrict = b.farmer_district || (b.farmer && b.farmer.district) || b.district || (matchedRecord && matchedRecord.farmer && matchedRecord.farmer.district) || '';
        const industryDistrict = b.industry_district || (b.industry && b.industry.district) || (matchedRecord && matchedRecord.industry && matchedRecord.industry.district) || '';
        const farmerState = b.farmer_state || (b.farmer && b.farmer.state) || b.state || (matchedRecord && matchedRecord.farmer && matchedRecord.farmer.state) || '';
        const industryState = b.industry_state || (b.industry && b.industry.state) || (matchedRecord && matchedRecord.industry && matchedRecord.industry.state) || '';

        // Safely record unique districts across farmers and industries in the booked deals
        if (farmerDistrict && typeof farmerDistrict === 'string' && farmerDistrict.trim()) {
          bookedDistrictsSet.add(farmerDistrict.trim());
        }
        if (industryDistrict && typeof industryDistrict === 'string' && industryDistrict.trim()) {
          bookedDistrictsSet.add(industryDistrict.trim());
        }

        if (!farmerDeals.has(farmerName)) {
          farmerDeals.set(farmerName, {
            farmer_name: farmerName,
            industry_name: b.industry_name || (b.industry && b.industry.industry_name) || (matchedRecord && matchedRecord.industry && matchedRecord.industry.industry_name) || 'Industry Buyer',
            residue_type: b.residue_type || (matchedRecord && matchedRecord.residue_type) || 'paddy_straw',
            traded_tons: tradedTons,
            price_per_ton: price,
            district_farmer: farmerDistrict,
            district_industry: industryDistrict,
            state_farmer: farmerState,
            state_industry: industryState
          });
        }
      });

      return { 
        items: Array.from(farmerDeals.values()), 
        districts: Array.from(bookedDistrictsSet),
        isSample: isSampleDataActive 
      };
    } else {
      // 2. Potential (from matches) Mode
      if (allMatches.length === 0) {
        return { items: [], districts: [], isSample: isSampleDataActive };
      }

      const potentialDistrictsSet = new Set();

      // Deduplicate: assign each farmer to their single best-scoring match only
      const farmerBestMatch = new Map();
      allMatches.forEach(m => {
        const farmerKey = m.farmer.id || m.farmer.name;
        if (!farmerBestMatch.has(farmerKey) || m.score > farmerBestMatch.get(farmerKey).score) {
          farmerBestMatch.set(farmerKey, m);
        }
      });

      const uniqueMatches = Array.from(farmerBestMatch.values());
      const items = uniqueMatches.map(m => {
        const tradedTons = Math.min(m.farmer.quantity_tons, m.industry.quantity_tons);
        const fDist = m.farmer.district || '';
        const iDist = m.industry.district || '';
        if (fDist && typeof fDist === 'string' && fDist.trim()) potentialDistrictsSet.add(fDist.trim());
        if (iDist && typeof iDist === 'string' && iDist.trim()) potentialDistrictsSet.add(iDist.trim());

        return {
          farmer_name: m.farmer.name,
          industry_name: m.industry.industry_name,
          residue_type: m.residue_type,
          traded_tons: tradedTons,
          price_per_ton: m.farmer_ask,
          district_farmer: fDist,
          district_industry: iDist
        };
      });

      return { 
        items, 
        districts: Array.from(potentialDistrictsSet),
        isSample: isSampleDataActive 
      };
    }
  }

  /**
   * Recalculate metrics and update DOM
   */
  async function updateImpactDashboard() {
    const { items, districts } = await getAggregatedData();

    // Toggle Empty State
    if (!items || items.length === 0) {
      if (emptyStateEl) emptyStateEl.style.display = 'flex';
      if (contentWrapEl) contentWrapEl.style.display = 'none';
      if (valGovtDistricts) valGovtDistricts.textContent = '0';
      if (valGovtDistrictsList) valGovtDistrictsList.textContent = '';
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = 'none';
    if (contentWrapEl) contentWrapEl.style.display = 'block';

    // 1. Compute Base Aggregates
    let totalFarmerEarnings = 0;
    let totalResidueDivertedTons = 0;
    const farmerEarningsMap = {};
    const industryDemandMap = {};
    const residueVolumeMap = {};

    items.forEach(item => {
      const tons = item.traded_tons || 0;
      const earnings = tons * (item.price_per_ton || 0);

      totalResidueDivertedTons += tons;
      totalFarmerEarnings += earnings;

      // Chart distributions
      farmerEarningsMap[item.farmer_name] = (farmerEarningsMap[item.farmer_name] || 0) + earnings;
      industryDemandMap[item.industry_name] = (industryDemandMap[item.industry_name] || 0) + tons;
      residueVolumeMap[item.residue_type] = (residueVolumeMap[item.residue_type] || 0) + tons;
    });

    // 2. Environmental & Carbon Calculations
    // CO2 avoided in kg = tons * emission factor (kg/ton)
    const co2AvoidedKg = totalResidueDivertedTons * currentEmissionFactor;
    const co2AvoidedTonnes = co2AvoidedKg / 1000;
    const treesEquivalent = Math.round(co2AvoidedKg / CONFIG.KG_CO2_PER_TREE_PER_YEAR);
    const carbonCredits = Math.round((co2AvoidedTonnes / CONFIG.TONS_PER_CARBON_CREDIT) * 10) / 10;
    const creditMarketValue = carbonCredits * CONFIG.CREDIT_PRICE_INR;
    const platformFee = totalFarmerEarnings * (CONFIG.PLATFORM_FEE_PERCENT / 100);
    const brokerageCommission = creditMarketValue * (CONFIG.BROKERAGE_PERCENT / 100);

    // 3. Render Metric Cards
    if (valEarnings) valEarnings.textContent = `₹${formatINR(totalFarmerEarnings)}`;
    if (valResidue) valResidue.textContent = `${formatTons(totalResidueDivertedTons)} t`;
    if (valCo2) valCo2.textContent = `${formatTons(co2AvoidedTonnes)} t`;
    if (valTrees) valTrees.textContent = formatINR(treesEquivalent);
    if (valCredits) valCredits.textContent = formatTons(carbonCredits);
    if (valCreditValue) valCreditValue.textContent = `₹${formatINR(creditMarketValue)}`;
    if (valPlatformFee) valPlatformFee.textContent = `₹${formatINR(platformFee)}`;
    if (valBrokerage) valBrokerage.textContent = `₹${formatINR(brokerageCommission)}`;

    // 4. Render Government View (Computed Numbers & District Names)
    const capitalize = window.AgriLinkAPI && window.AgriLinkAPI.formatPlace ? window.AgriLinkAPI.formatPlace : (s => s);
    const sortedDistricts = (districts || [])
      .map(d => capitalize(d))
      .filter(d => typeof d === 'string' && d.trim())
      .sort();
    if (valGovtResidue) valGovtResidue.textContent = formatTons(totalResidueDivertedTons);
    if (valGovtCo2) valGovtCo2.textContent = formatTons(co2AvoidedTonnes);
    if (valGovtDistricts) valGovtDistricts.textContent = sortedDistricts.length.toString();
    if (valGovtDistrictsList) {
      valGovtDistrictsList.textContent = sortedDistricts.length > 0 ? sortedDistricts.join(', ') : '';
    }

    // 5. Render / Update Charts
    renderCharts(farmerEarningsMap, industryDemandMap, residueVolumeMap);
  }

  /**
   * Render Chart.js Visualizations
   */
  function renderCharts(farmerEarningsMap, industryDemandMap, residueVolumeMap) {
    if (typeof Chart === 'undefined') {
      console.warn('AgriLink Impact: Chart.js is not loaded.');
      return;
    }

    // Set Global Chart Defaults
    Chart.defaults.font.family = "'Noto Sans', system-ui, -apple-system, sans-serif";
    Chart.defaults.color = '#182319';

    // 1. Chart: Earnings per Farmer (Bar)
    const ctxEarnings = document.getElementById('chart-farmer-earnings')?.getContext('2d');
    if (ctxEarnings) {
      if (chartEarnings) chartEarnings.destroy();

      const farmerNames = Object.keys(farmerEarningsMap);
      const farmerAmounts = Object.values(farmerEarningsMap);

      chartEarnings = new Chart(ctxEarnings, {
        type: 'bar',
        data: {
          labels: farmerNames,
          datasets: [{
            label: t('impact.chart_earnings_axis'),
            data: farmerAmounts,
            backgroundColor: 'rgba(45, 106, 53, 0.85)',
            borderColor: '#1B4323',
            borderWidth: 1.5,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ₹${formatINR(ctx.raw)}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (val) => `₹${formatINR(val)}`
              },
              grid: { color: 'rgba(0,0,0,0.06)' }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    }

    // 2. Chart: Matches per Industry / Biomass Demand (Bar)
    const ctxIndustry = document.getElementById('chart-industry-matches')?.getContext('2d');
    if (ctxIndustry) {
      if (chartIndustry) chartIndustry.destroy();

      const industryNames = Object.keys(industryDemandMap);
      const industryTons = Object.values(industryDemandMap);

      chartIndustry = new Chart(ctxIndustry, {
        type: 'bar',
        data: {
          labels: industryNames,
          datasets: [{
            label: t('impact.chart_industry_axis'),
            data: industryTons,
            backgroundColor: 'rgba(217, 119, 6, 0.85)',
            borderColor: '#B45309',
            borderWidth: 1.5,
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.raw} tons`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (val) => `${val} t`
              },
              grid: { color: 'rgba(0,0,0,0.06)' }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    }

    // 3. Chart: Residue Tons by Type (Doughnut)
    const ctxResidue = document.getElementById('chart-residue-distribution')?.getContext('2d');
    if (ctxResidue) {
      if (chartResidue) chartResidue.destroy();

      const residueRawKeys = Object.keys(residueVolumeMap);
      const residueLabels = residueRawKeys.map(k => formatResidue(k));
      const residueAmounts = Object.values(residueVolumeMap);

      chartResidue = new Chart(ctxResidue, {
        type: 'doughnut',
        data: {
          labels: residueLabels,
          datasets: [{
            data: residueAmounts,
            backgroundColor: [
              '#2D6A35', // Deep Leaf Green
              '#D97706', // Harvest Amber
              '#885434', // Soil Loam
              '#5DB16C', // Bright Foliage
              '#A86B43'  // Terracotta
            ],
            borderColor: '#FFFFFF',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 14,
                padding: 12
              }
            },
            tooltip: {
              callbacks: {
                label: (ctx) => ` ${ctx.label}: ${ctx.raw} tons`
              }
            }
          },
          cutout: '62%'
        }
      });
    }
  }

  /**
   * Set Active Mode (Booked vs Potential)
   */
  function setMode(mode) {
    currentMode = mode;
    if (toggleBooked && togglePotential) {
      toggleBooked.classList.toggle('active', mode === 'booked');
      togglePotential.classList.toggle('active', mode === 'potential');
      toggleBooked.setAttribute('aria-pressed', mode === 'booked' ? 'true' : 'false');
      togglePotential.setAttribute('aria-pressed', mode === 'potential' ? 'true' : 'false');
    }

    if (modeNoticeEl) {
      const noticeKey = mode === 'booked' ? 'impact.mode_notice_booked' : 'impact.mode_notice_potential';
      modeNoticeEl.textContent = t(noticeKey);
      modeNoticeEl.setAttribute('data-i18n', noticeKey);
    }

    updateImpactDashboard();
  }

  // Event Listeners for Mode Toggle
  if (toggleBooked) toggleBooked.addEventListener('click', () => setMode('booked'));
  if (togglePotential) togglePotential.addEventListener('click', () => setMode('potential'));

  // Event Listeners for Editable Assumption
  if (factorInput) {
    factorInput.value = currentEmissionFactor;
    factorInput.addEventListener('input', () => {
      const val = parseFloat(factorInput.value);
      if (!isNaN(val) && val > 0) {
        currentEmissionFactor = val;
        updateImpactDashboard();
      }
    });
  }

  if (btnResetFactor) {
    btnResetFactor.addEventListener('click', () => {
      currentEmissionFactor = CONFIG.CO2_PER_TON_AVOIDED_KG;
      if (factorInput) factorInput.value = currentEmissionFactor;
      updateImpactDashboard();
    });
  }

  // Re-render when language changes
  window.addEventListener('agrilink:languageChanged', () => {
    if (modeNoticeEl) {
      const noticeKey = currentMode === 'booked' ? 'impact.mode_notice_booked' : 'impact.mode_notice_potential';
      modeNoticeEl.textContent = t(noticeKey);
    }
    updateImpactDashboard();
  });

  // Re-render when data changes (e.g., demo loaded or cleared)
  window.addEventListener('agrilink:dataChanged', () => {
    updateImpactDashboard();
  });

  // Demo Controls
  const btnDemoMode = document.getElementById('btn-demo-mode');
  const btnResetDemo = document.getElementById('btn-reset-demo');

  if (btnDemoMode) {
    btnDemoMode.addEventListener('click', () => {
      if (window.AgriLinkAPI) {
        window.AgriLinkAPI.loadDemoData();
        updateImpactDashboard();
        if (typeof window.agriLinkToast === 'function') {
          window.agriLinkToast(t('demo.loaded_success'));
        }
      }
    });
  }

  if (btnResetDemo) {
    btnResetDemo.addEventListener('click', () => {
      if (window.AgriLinkAPI) {
        window.AgriLinkAPI.clearDemoData();
        updateImpactDashboard();
        if (typeof window.agriLinkToast === 'function') {
          window.agriLinkToast(t('demo.reset_success'));
        }
      }
    });
  }

  // Initial Execution
  setMode('booked');
});
