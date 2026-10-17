/**
 * AgriLink - API Client & Matching Engine
 * Endpoints:
 * - POST /add_farmer
 * - POST /add_industry
 * - GET /match
 *
 * Features:
 * - MOCK_MODE: browser-side match calculation & localStorage persistence
 * - Haversine distance with exact district coordinates lookup table
 * - Weighted 100-point matching score (Residue 30, Distance 30, Price 25, Quantity 15)
 * - Persistent bookings with 'Pending' status across reloads
 * - Load demo data & clear data controls
 */

const MOCK_MODE = true; // Set to false to connect to real backend server
const API_BASE = 'http://localhost:8000';

// ----------------------------------------------------------------------------
// 1. Geographic Data & District Coordinates (All 48 Districts in 8 States)
// ----------------------------------------------------------------------------
const LOCATION_DATA = {
  'Punjab': ['Amritsar', 'Bathinda', 'Jalandhar', 'Ludhiana', 'Patiala', 'Sangrur'],
  'Haryana': ['Ambala', 'Hisar', 'Karnal', 'Kurukshetra', 'Panipat', 'Sirsa'],
  'Uttar Pradesh': ['Aligarh', 'Bareilly', 'Lucknow', 'Meerut', 'Moradabad', 'Varanasi'],
  'Andhra Pradesh': ['East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Visakhapatnam', 'West Godavari'],
  'Telangana': ['Karimnagar', 'Khammam', 'Nalgonda', 'Nizamabad', 'Rangareddy', 'Warangal'],
  'Karnataka': ['Ballari', 'Belagavi', 'Davanagere', 'Mandya', 'Mysuru', 'Shivamogga'],
  'Tamil Nadu': ['Coimbatore', 'Erode', 'Madurai', 'Salem', 'Thanjavur', 'Tiruchirappalli'],
  'Kerala': ['Alappuzha', 'Ernakulam', 'Kottayam', 'Palakkad', 'Thrissur', 'Wayanad']
};

const DISTRICT_COORDINATES = {
  // Punjab
  'Amritsar': { lat: 31.6340, lon: 74.8723 },
  'Bathinda': { lat: 30.2110, lon: 74.9455 },
  'Jalandhar': { lat: 31.3260, lon: 75.5762 },
  'Ludhiana': { lat: 30.9010, lon: 75.8573 },
  'Patiala': { lat: 30.3398, lon: 76.3869 },
  'Sangrur': { lat: 30.2458, lon: 75.8421 },

  // Haryana
  'Ambala': { lat: 30.3782, lon: 76.7767 },
  'Hisar': { lat: 29.1492, lon: 75.7217 },
  'Karnal': { lat: 29.6857, lon: 76.9905 },
  'Kurukshetra': { lat: 29.9695, lon: 76.8783 },
  'Panipat': { lat: 29.3909, lon: 76.9635 },
  'Sirsa': { lat: 29.5349, lon: 75.0287 },

  // Uttar Pradesh
  'Aligarh': { lat: 27.8974, lon: 78.0880 },
  'Bareilly': { lat: 28.3670, lon: 79.4304 },
  'Lucknow': { lat: 26.8467, lon: 80.9462 },
  'Meerut': { lat: 28.9845, lon: 77.7064 },
  'Moradabad': { lat: 28.8386, lon: 78.7733 },
  'Varanasi': { lat: 25.3176, lon: 82.9739 },

  // Andhra Pradesh
  'East Godavari': { lat: 16.9891, lon: 82.2475 },
  'Guntur': { lat: 16.3067, lon: 80.4365 },
  'Krishna': { lat: 16.1809, lon: 81.1303 },
  'Kurnool': { lat: 15.8281, lon: 78.0373 },
  'Visakhapatnam': { lat: 17.6868, lon: 83.2185 },
  'West Godavari': { lat: 16.7107, lon: 81.0952 },

  // Telangana
  'Karimnagar': { lat: 18.4386, lon: 79.1288 },
  'Khammam': { lat: 17.2473, lon: 80.1514 },
  'Nalgonda': { lat: 17.0575, lon: 79.2684 },
  'Nizamabad': { lat: 18.6725, lon: 78.0941 },
  'Rangareddy': { lat: 17.3850, lon: 78.4867 },
  'Warangal': { lat: 17.9689, lon: 79.5941 },

  // Karnataka
  'Ballari': { lat: 15.1394, lon: 76.9214 },
  'Belagavi': { lat: 15.8497, lon: 74.4977 },
  'Davanagere': { lat: 14.4644, lon: 75.9218 },
  'Mandya': { lat: 12.5238, lon: 76.8967 },
  'Mysuru': { lat: 12.2958, lon: 76.6394 },
  'Shivamogga': { lat: 13.9299, lon: 75.5681 },

  // Tamil Nadu
  'Coimbatore': { lat: 11.0168, lon: 76.9558 },
  'Erode': { lat: 11.3410, lon: 77.7172 },
  'Madurai': { lat: 9.9252, lon: 78.1198 },
  'Salem': { lat: 11.6643, lon: 78.1460 },
  'Thanjavur': { lat: 10.7870, lon: 79.1378 },
  'Tiruchirappalli': { lat: 10.7905, lon: 78.7047 },

  // Kerala
  'Alappuzha': { lat: 9.4981, lon: 76.3388 },
  'Ernakulam': { lat: 9.9816, lon: 76.2999 },
  'Kottayam': { lat: 9.5916, lon: 76.5222 },
  'Palakkad': { lat: 10.7867, lon: 76.6548 },
  'Thrissur': { lat: 10.5276, lon: 76.2144 },
  'Wayanad': { lat: 11.6103, lon: 76.0827 }
};

// ----------------------------------------------------------------------------
// 2. Haversine Distance Calculation (km)
// ----------------------------------------------------------------------------
function calculateDistanceKm(district1, district2) {
  if (!district1 || !district2) return 150;
  if (district1.toLowerCase().trim() === district2.toLowerCase().trim()) {
    return 15; // Intra-district transport default
  }

  const coord1 = DISTRICT_COORDINATES[district1];
  const coord2 = DISTRICT_COORDINATES[district2];
  if (!coord1 || !coord2) return 150; // Fallback estimate

  const R = 6371; // Earth radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const dLon = (coord2.lon - coord1.lon) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * (Math.PI / 180)) *
      Math.cos(coord2.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(10, Math.round(R * c));
}

// ----------------------------------------------------------------------------
// 3. Demo Dataset (Loaded only when user clicks "Load demo data")
// ----------------------------------------------------------------------------
const DEMO_FARMERS = [
  {
    id: 'demo_f1',
    name: 'Gurpreet Singh',
    phone: '9876543210',
    residue_type: 'paddy_straw',
    quantity_tons: 35,
    state: 'Punjab',
    district: 'Ludhiana',
    village: 'Raikot',
    price_per_ton: 2100,
    is_demo: true
  },
  {
    id: 'demo_f2',
    name: 'Harinder Dhillon',
    phone: '9812345678',
    residue_type: 'wheat_straw',
    quantity_tons: 50,
    state: 'Haryana',
    district: 'Karnal',
    village: 'Nilokheri',
    price_per_ton: 2400,
    is_demo: true
  },
  {
    id: 'demo_f3',
    name: 'Rajesh Verma',
    phone: '9823456789',
    residue_type: 'sugarcane_bagasse',
    quantity_tons: 80,
    state: 'Uttar Pradesh',
    district: 'Meerut',
    village: 'Mawana',
    price_per_ton: 1950,
    is_demo: true
  }
];

const DEMO_INDUSTRIES = [
  {
    id: 'demo_i1',
    industry_name: 'BioGreen Energy Tech',
    contact_phone: '9898765432',
    industry_type: 'biofuel',
    residue_type: 'paddy_straw',
    quantity_tons: 150,
    state: 'Punjab',
    district: 'Patiala',
    price_per_ton: 2350,
    is_demo: true
  },
  {
    id: 'demo_i2',
    industry_name: 'Haryana EcoPaper Mills',
    contact_phone: '9871234567',
    industry_type: 'paper_mill',
    residue_type: 'any',
    quantity_tons: 200,
    state: 'Haryana',
    district: 'Panipat',
    price_per_ton: 2600,
    is_demo: true
  }
];

// ----------------------------------------------------------------------------
// 4. Client-side Matching Algorithm
// ----------------------------------------------------------------------------
function computeMatchDetails(farmer, industry) {
  // Rule 1: Residue Compatibility
  const isResidueMatch =
    industry.residue_type === 'any' ||
    farmer.residue_type === industry.residue_type;

  if (!isResidueMatch) return null;

  // Rule 2: Price Compatibility (farmer ask <= industry offer)
  if (farmer.price_per_ton > industry.price_per_ton) return null;

  // 1. Residue Score (30 pts max)
  const residueScore = industry.residue_type === farmer.residue_type ? 30 : 28;

  // 2. Distance Score (30 pts max)
  const distanceKm = calculateDistanceKm(farmer.district, industry.district);
  const distanceScore = Math.max(
    0,
    Math.min(30, Math.round(30 * (1 - Math.min(distanceKm, 500) / 500)))
  );

  // 3. Price Score (25 pts max: 15 base + up to 10 scaled by price_gap / industry_price)
  const priceGap = Math.max(0, industry.price_per_ton - farmer.price_per_ton);
  const priceRatio = industry.price_per_ton > 0 ? priceGap / industry.price_per_ton : 0;
  const priceBonus = Math.min(10, Math.round(10 * Math.min(1.0, priceRatio / 0.25)));
  const priceScore = Math.min(25, 15 + priceBonus);

  // 4. Quantity Coverage Score (15 pts max)
  const qtyCoverageRatio =
    industry.quantity_tons > 0
      ? Math.min(1.0, farmer.quantity_tons / industry.quantity_tons)
      : 1.0;
  const quantityScore = Math.max(
    5,
    Math.min(15, Math.round(15 * qtyCoverageRatio))
  );

  const totalScore = Math.min(
    100,
    residueScore + distanceScore + priceScore + quantityScore
  );

  const matchId = `match_${farmer.id || farmer.name}_${industry.id || industry.industry_name}_${farmer.residue_type}`.replace(
    /\s+/g,
    '_'
  );

  return {
    id: matchId,
    farmer: { ...farmer },
    industry: { ...industry },
    residue_type: farmer.residue_type,
    distance_km: distanceKm,
    farmer_ask: farmer.price_per_ton,
    industry_offer: industry.price_per_ton,
    price_gap: priceGap,
    is_demo: Boolean(farmer.is_demo || industry.is_demo),
    score: totalScore,
    breakdown: {
      residue: residueScore,
      distance: distanceScore,
      price: priceScore,
      quantity: quantityScore,
      total: totalScore,
      distance_km: distanceKm,
      price_gap: priceGap,
      qty_coverage_pct: Math.round(qtyCoverageRatio * 100)
    }
  };
}

/**
 * Compute matches in browser from localStorage submissions
 * Starts EMPTY until submissions exist or demo data is loaded.
 */
function computeMockMatches() {
  const farmers = JSON.parse(
    localStorage.getItem('agrilink_farmer_submissions') || '[]'
  );
  const industries = JSON.parse(
    localStorage.getItem('agrilink_industry_submissions') || '[]'
  );

  if (farmers.length === 0 || industries.length === 0) {
    return [];
  }

  const matches = [];
  farmers.forEach(farmer => {
    industries.forEach(industry => {
      const match = computeMatchDetails(farmer, industry);
      if (match) {
        matches.push(match);
      }
    });
  });

  // Default sort by highest match score
  matches.sort((a, b) => b.score - a.score);
  return matches;
}

// ----------------------------------------------------------------------------
// 5. Bookings Management (LocalStorage Persistence)
// ----------------------------------------------------------------------------
function getBookings() {
  try {
    return JSON.parse(localStorage.getItem('agrilink_bookings') || '{}');
  } catch (e) {
    return {};
  }
}

function saveBooking(matchId, details) {
  const bookings = getBookings();
  bookings[matchId] = {
    status: 'pending',
    booked_at: new Date().toISOString(),
    ...details
  };
  localStorage.setItem('agrilink_bookings', JSON.stringify(bookings));
  console.log('[AgriLink] Booking persisted in localStorage:', matchId, bookings[matchId]);
  return bookings[matchId];
}

// ----------------------------------------------------------------------------
// 6. Core API Functions (TASK 1: POST /add_farmer, POST /add_industry, GET /match)
// ----------------------------------------------------------------------------

/**
 * Submit Farmer Crop Residue Listing
 * Endpoint: POST /add_farmer
 */
async function addFarmer(farmerData) {
  const payload = {
    name: String(farmerData.name || '').trim(),
    phone: String(farmerData.phone || '').trim(),
    residue_type: String(farmerData.residue_type || ''),
    quantity_tons: parseFloat(farmerData.quantity_tons) || 0,
    state: String(farmerData.state || ''),
    district: String(farmerData.district || ''),
    village: String(farmerData.village || '').trim(),
    price_per_ton: parseFloat(farmerData.price_per_ton) || 0
  };

  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 600));
    try {
      const existing = JSON.parse(
        localStorage.getItem('agrilink_farmer_submissions') || '[]'
      );
      const record = {
        id: 'farmer_' + Date.now(),
        ...payload,
        created_at: new Date().toISOString()
      };
      existing.push(record);
      localStorage.setItem('agrilink_farmer_submissions', JSON.stringify(existing));
      console.log('[AgriLink MOCK_MODE] Saved farmer submission:', record);
      return { success: true, data: record, mock: true };
    } catch (err) {
      console.error('[AgriLink MOCK_MODE] Storage error:', err);
      return { success: false, error: 'storage_error' };
    }
  }

  // Real Backend Network Call: POST /add_farmer
  try {
    const response = await fetch(`${API_BASE}/add_farmer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(`[AgriLink API] Backend returned HTTP ${response.status} from ${API_BASE}/add_farmer`);
      return { success: false, error: 'server_error', status: response.status };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    console.error(`[AgriLink API] Connection failed to ${API_BASE}/add_farmer:`, err);
    return { success: false, error: 'server_unreachable' };
  }
}

/**
 * Submit Industry Biomass Sourcing Requirement
 * Endpoint: POST /add_industry
 */
async function addIndustry(industryData) {
  const payload = {
    industry_name: String(industryData.industry_name || '').trim(),
    contact_phone: String(industryData.contact_phone || '').trim(),
    industry_type: String(industryData.industry_type || ''),
    residue_type: String(industryData.residue_type || ''),
    quantity_tons: parseFloat(industryData.quantity_tons) || 0,
    state: String(industryData.state || ''),
    district: String(industryData.district || ''),
    price_per_ton: parseFloat(industryData.price_per_ton) || 0
  };

  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 600));
    try {
      const existing = JSON.parse(
        localStorage.getItem('agrilink_industry_submissions') || '[]'
      );
      const record = {
        id: 'industry_' + Date.now(),
        ...payload,
        created_at: new Date().toISOString()
      };
      existing.push(record);
      localStorage.setItem('agrilink_industry_submissions', JSON.stringify(existing));
      console.log('[AgriLink MOCK_MODE] Saved industry submission:', record);
      return { success: true, data: record, mock: true };
    } catch (err) {
      console.error('[AgriLink MOCK_MODE] Storage error:', err);
      return { success: false, error: 'storage_error' };
    }
  }

  // Real Backend Network Call: POST /add_industry
  try {
    const response = await fetch(`${API_BASE}/add_industry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(`[AgriLink API] Backend returned HTTP ${response.status} from ${API_BASE}/add_industry`);
      return { success: false, error: 'server_error', status: response.status };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    console.error(`[AgriLink API] Connection failed to ${API_BASE}/add_industry:`, err);
    return { success: false, error: 'server_unreachable' };
  }
}

/**
 * Retrieve Matches
 * Endpoint: GET /match
 */
async function getMatches() {
  if (MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const matches = computeMockMatches();
    console.log(`[AgriLink MOCK_MODE] Computed ${matches.length} matches from localStorage`);
    return { success: true, data: matches, mock: true };
  }

  // Real Backend Network Call: GET /match
  try {
    const response = await fetch(`${API_BASE}/match`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      console.error(`[AgriLink API] Backend returned HTTP ${response.status} from ${API_BASE}/match`);
      return { success: false, error: 'server_error', status: response.status };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    console.error(`[AgriLink API] Connection failed to ${API_BASE}/match:`, err);
    return { success: false, error: 'server_unreachable' };
  }
}

/**
 * Load Demo Data into LocalStorage (Used on matches.html)
 */
function loadDemoData() {
  const currentFarmers = JSON.parse(
    localStorage.getItem('agrilink_farmer_submissions') || '[]'
  );
  const currentIndustries = JSON.parse(
    localStorage.getItem('agrilink_industry_submissions') || '[]'
  );

  // Avoid duplicates
  const farmerIds = new Set(currentFarmers.map(f => f.id));
  DEMO_FARMERS.forEach(demoF => {
    if (!farmerIds.has(demoF.id)) {
      currentFarmers.push(demoF);
    }
  });

  const industryIds = new Set(currentIndustries.map(i => i.id));
  DEMO_INDUSTRIES.forEach(demoI => {
    if (!industryIds.has(demoI.id)) {
      currentIndustries.push(demoI);
    }
  });

  localStorage.setItem('agrilink_farmer_submissions', JSON.stringify(currentFarmers));
  localStorage.setItem('agrilink_industry_submissions', JSON.stringify(currentIndustries));
  console.log('[AgriLink Demo] Loaded demo dataset successfully');
}

/**
 * Clear All Data from LocalStorage
 */
function clearAllData() {
  localStorage.removeItem('agrilink_farmer_submissions');
  localStorage.removeItem('agrilink_industry_submissions');
  localStorage.removeItem('agrilink_bookings');
  console.log('[AgriLink Data] All submissions and bookings cleared from localStorage');
}

// ----------------------------------------------------------------------------
// 7. Dynamic State & District Dropdown Helpers
// ----------------------------------------------------------------------------
function populateStates(stateSelect) {
  if (!stateSelect) return;
  const currentVal = stateSelect.value;
  const t = window.AgriLinkI18n ? window.AgriLinkI18n.t : (k => k);

  const stateKeys = {
    'Punjab': 'state.punjab',
    'Haryana': 'state.haryana',
    'Uttar Pradesh': 'state.uttar_pradesh',
    'Andhra Pradesh': 'state.andhra_pradesh',
    'Telangana': 'state.telangana',
    'Karnataka': 'state.karnataka',
    'Tamil Nadu': 'state.tamil_nadu',
    'Kerala': 'state.kerala'
  };

  let html = `<option value="" data-i18n="state.select">${t('state.select')}</option>`;
  Object.keys(LOCATION_DATA).forEach(state => {
    const i18nKey = stateKeys[state] || state;
    const label = t(i18nKey) || state;
    const selected = (state === currentVal) ? 'selected' : '';
    html += `<option value="${state}" data-i18n="${i18nKey}" ${selected}>${label}</option>`;
  });

  stateSelect.innerHTML = html;
  if (currentVal && LOCATION_DATA[currentVal]) {
    stateSelect.value = currentVal;
  }
}

function populateDistricts(districtSelect, selectedState, preselectDistrict = '') {
  if (!districtSelect) return;
  const t = window.AgriLinkI18n ? window.AgriLinkI18n.t : (k => k);

  if (!selectedState || !LOCATION_DATA[selectedState]) {
    districtSelect.innerHTML = `<option value="" data-i18n="district.select_state_first">${t('district.select_state_first')}</option>`;
    districtSelect.disabled = true;
    return;
  }

  districtSelect.disabled = false;
  let html = `<option value="" data-i18n="district.select">${t('district.select')}</option>`;
  LOCATION_DATA[selectedState].forEach(district => {
    const selected = (district === preselectDistrict) ? 'selected' : '';
    html += `<option value="${district}" ${selected}>${district}</option>`;
  });

  districtSelect.innerHTML = html;
  if (preselectDistrict) {
    districtSelect.value = preselectDistrict;
  }
}

// ----------------------------------------------------------------------------
// 8. Form Validation & Submission Wiring (farmer.html & industry.html)
// ----------------------------------------------------------------------------
function setFieldError(fieldId, errorKey) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (input) input.classList.add('is-invalid');
  if (errorEl) {
    const t = window.AgriLinkI18n ? window.AgriLinkI18n.t : (k => k);
    errorEl.textContent = errorKey ? t(errorKey) : '';
    errorEl.setAttribute('data-i18n', errorKey || '');
    errorEl.classList.add('active');
  }
}

function clearFieldError(fieldId) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (input) input.classList.remove('is-invalid');
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.removeAttribute('data-i18n');
    errorEl.classList.remove('active');
  }
}

function clearAllErrors(form) {
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  form.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.removeAttribute('data-i18n');
    el.classList.remove('active');
  });
}

function showAlert(alertEl, type, messageKey) {
  if (!alertEl) return;
  const t = window.AgriLinkI18n ? window.AgriLinkI18n.t : (k => k);
  alertEl.className = `form-alert alert-${type}`;

  const iconSvg =
    type === 'success'
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  alertEl.innerHTML = `
    ${iconSvg}
    <div style="flex-grow: 1;">
      <span data-i18n="${messageKey}">${t(messageKey)}</span>
    </div>
  `;
  alertEl.style.display = 'flex';
  alertEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideAlert(alertEl) {
  if (alertEl) {
    alertEl.style.display = 'none';
    alertEl.innerHTML = '';
  }
}

function initFarmerForm() {
  const form = document.getElementById('farmer-form');
  if (!form) return;

  const stateSelect = document.getElementById('farmer-state');
  const districtSelect = document.getElementById('farmer-district');
  const alertEl = document.getElementById('farmer-alert');
  const submitBtn = document.getElementById('farmer-submit-btn');

  populateStates(stateSelect);
  populateDistricts(districtSelect, '');

  stateSelect.addEventListener('change', () => {
    clearFieldError('farmer-state');
    populateDistricts(districtSelect, stateSelect.value);
  });

  districtSelect.addEventListener('change', () => {
    clearFieldError('farmer-district');
  });

  window.addEventListener('agrilink:languageChanged', () => {
    const savedState = stateSelect.value;
    const savedDistrict = districtSelect.value;
    populateStates(stateSelect);
    if (savedState) {
      stateSelect.value = savedState;
      populateDistricts(districtSelect, savedState, savedDistrict);
    }
  });

  ['farmer-name', 'farmer-phone', 'farmer-residue', 'farmer-qty', 'farmer-village', 'farmer-price'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => clearFieldError(id));
      el.addEventListener('change', () => clearFieldError(id));
    }
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearAllErrors(form);
    hideAlert(alertEl);

    const nameVal = (document.getElementById('farmer-name')?.value || '').trim();
    const phoneVal = (document.getElementById('farmer-phone')?.value || '').trim();
    const residueVal = document.getElementById('farmer-residue')?.value || '';
    const qtyVal = parseFloat(document.getElementById('farmer-qty')?.value);
    const stateVal = stateSelect.value;
    const districtVal = districtSelect.value;
    const villageVal = (document.getElementById('farmer-village')?.value || '').trim();
    const priceVal = parseFloat(document.getElementById('farmer-price')?.value);

    let hasError = false;

    if (!nameVal) {
      setFieldError('farmer-name', 'error.required');
      hasError = true;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneVal) {
      setFieldError('farmer-phone', 'error.required');
      hasError = true;
    } else if (!phoneRegex.test(phoneVal)) {
      setFieldError('farmer-phone', 'error.phone_invalid');
      hasError = true;
    }

    if (!residueVal) {
      setFieldError('farmer-residue', 'error.select_option');
      hasError = true;
    }

    if (isNaN(qtyVal) || qtyVal <= 0) {
      setFieldError('farmer-qty', 'error.number_positive');
      hasError = true;
    }

    if (!stateVal) {
      setFieldError('farmer-state', 'error.select_option');
      hasError = true;
    }

    if (!districtVal) {
      setFieldError('farmer-district', 'error.select_option');
      hasError = true;
    }

    if (!villageVal) {
      setFieldError('farmer-village', 'error.required');
      hasError = true;
    }

    if (isNaN(priceVal) || priceVal <= 0) {
      setFieldError('farmer-price', 'error.price_positive');
      hasError = true;
    }

    if (hasError) return;

    const t = window.AgriLinkI18n ? window.AgriLinkI18n.t : (k => k);
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    const btnTextEl = submitBtn.querySelector('.btn-text');
    if (btnTextEl) btnTextEl.textContent = t('form.submitting');

    const result = await addFarmer({
      name: nameVal,
      phone: phoneVal,
      residue_type: residueVal,
      quantity_tons: qtyVal,
      state: stateVal,
      district: districtVal,
      village: villageVal,
      price_per_ton: priceVal
    });

    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    if (btnTextEl) btnTextEl.textContent = t('form.submit_farmer');

    if (result.success) {
      showAlert(alertEl, 'success', 'form.success_farmer');
      form.reset();
      populateDistricts(districtSelect, '');
    } else {
      const errKey =
        result.error === 'server_unreachable' ? 'error.server_unreachable' : 'error.general';
      showAlert(alertEl, 'error', errKey);
    }
  });
}

function initIndustryForm() {
  const form = document.getElementById('industry-form');
  if (!form) return;

  const stateSelect = document.getElementById('industry-state');
  const districtSelect = document.getElementById('industry-district');
  const alertEl = document.getElementById('industry-alert');
  const submitBtn = document.getElementById('industry-submit-btn');

  populateStates(stateSelect);
  populateDistricts(districtSelect, '');

  stateSelect.addEventListener('change', () => {
    clearFieldError('industry-state');
    populateDistricts(districtSelect, stateSelect.value);
  });

  districtSelect.addEventListener('change', () => {
    clearFieldError('industry-district');
  });

  window.addEventListener('agrilink:languageChanged', () => {
    const savedState = stateSelect.value;
    const savedDistrict = districtSelect.value;
    populateStates(stateSelect);
    if (savedState) {
      stateSelect.value = savedState;
      populateDistricts(districtSelect, savedState, savedDistrict);
    }
  });

  ['industry-name', 'industry-phone', 'industry-type', 'industry-residue', 'industry-qty', 'industry-price'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => clearFieldError(id));
      el.addEventListener('change', () => clearFieldError(id));
    }
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearAllErrors(form);
    hideAlert(alertEl);

    const nameVal = (document.getElementById('industry-name')?.value || '').trim();
    const phoneVal = (document.getElementById('industry-phone')?.value || '').trim();
    const typeVal = document.getElementById('industry-type')?.value || '';
    const residueVal = document.getElementById('industry-residue')?.value || '';
    const qtyVal = parseFloat(document.getElementById('industry-qty')?.value);
    const stateVal = stateSelect.value;
    const districtVal = districtSelect.value;
    const priceVal = parseFloat(document.getElementById('industry-price')?.value);

    let hasError = false;

    if (!nameVal) {
      setFieldError('industry-name', 'error.required');
      hasError = true;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneVal) {
      setFieldError('industry-phone', 'error.required');
      hasError = true;
    } else if (!phoneRegex.test(phoneVal)) {
      setFieldError('industry-phone', 'error.phone_invalid');
      hasError = true;
    }

    if (!typeVal) {
      setFieldError('industry-type', 'error.select_option');
      hasError = true;
    }

    if (!residueVal) {
      setFieldError('industry-residue', 'error.select_option');
      hasError = true;
    }

    if (isNaN(qtyVal) || qtyVal <= 0) {
      setFieldError('industry-qty', 'error.number_positive');
      hasError = true;
    }

    if (!stateVal) {
      setFieldError('industry-state', 'error.select_option');
      hasError = true;
    }

    if (!districtVal) {
      setFieldError('industry-district', 'error.select_option');
      hasError = true;
    }

    if (isNaN(priceVal) || priceVal <= 0) {
      setFieldError('industry-price', 'error.price_positive');
      hasError = true;
    }

    if (hasError) return;

    const t = window.AgriLinkI18n ? window.AgriLinkI18n.t : (k => k);
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    const btnTextEl = submitBtn.querySelector('.btn-text');
    if (btnTextEl) btnTextEl.textContent = t('form.submitting');

    const result = await addIndustry({
      industry_name: nameVal,
      contact_phone: phoneVal,
      industry_type: typeVal,
      residue_type: residueVal,
      quantity_tons: qtyVal,
      state: stateVal,
      district: districtVal,
      price_per_ton: priceVal
    });

    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    if (btnTextEl) btnTextEl.textContent = t('form.submit_industry');

    if (result.success) {
      showAlert(alertEl, 'success', 'form.success_industry');
      form.reset();
      populateDistricts(districtSelect, '');
    } else {
      const errKey =
        result.error === 'server_unreachable' ? 'error.server_unreachable' : 'error.general';
      showAlert(alertEl, 'error', errKey);
    }
  });
}

// Auto-initialize form handlers
document.addEventListener('DOMContentLoaded', () => {
  initFarmerForm();
  initIndustryForm();
});

// Expose global API
window.AgriLinkAPI = {
  API_BASE,
  MOCK_MODE,
  addFarmer,
  addIndustry,
  getMatches,
  loadDemoData,
  clearAllData,
  getBookings,
  saveBooking,
  LOCATION_DATA,
  DISTRICT_COORDINATES,
  calculateDistanceKm,
  populateStates,
  populateDistricts
};
