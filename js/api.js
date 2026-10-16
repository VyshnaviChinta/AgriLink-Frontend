/**
 * AgriLink - API Client & Form Handling
 * Features:
 * - MOCK_MODE: saves to localStorage for serverless demo
 * - Backend fetch to API_BASE (http://localhost:8000)
 * - Safe error handling with localized user-facing alerts & console debug logging
 * - Snake_case payloads for seamless backend alignment
 * - State & District cascading dropdown management
 * - Client-side validation with localized inline error states
 */

const MOCK_MODE = true; // Set to false to connect to real backend server
const API_BASE = 'http://localhost:8000';

// ----------------------------------------------------------------------------
// 1. Geographic Data (Standardized English Names for Backend Consistency)
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

// ----------------------------------------------------------------------------
// 2. Core API Submission Functions
// ----------------------------------------------------------------------------

/**
 * Submit Farmer Crop Residue Listing
 * Payload fields: name, phone, residue_type, quantity_tons, state, district, village, price_per_ton
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
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const existing = JSON.parse(localStorage.getItem('agrilink_farmer_submissions') || '[]');
      const record = {
        id: 'farmer_' + Date.now(),
        ...payload,
        created_at: new Date().toISOString()
      };
      existing.push(record);
      localStorage.setItem('agrilink_farmer_submissions', JSON.stringify(existing));
      console.log('[AgriLink MOCK_MODE] Saved farmer listing to localStorage:', record);
      return { success: true, data: record, mock: true };
    } catch (err) {
      console.error('[AgriLink MOCK_MODE] LocalStorage write failed:', err);
      return { success: false, error: 'storage_error' };
    }
  }

  // Real Backend Network Call
  try {
    const response = await fetch(`${API_BASE}/api/farmers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(`[AgriLink API] Backend returned HTTP ${response.status} from ${API_BASE}/api/farmers`);
      return { success: false, error: 'server_error', status: response.status };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    // Technical detail logged only to console; no localhost exposed to user
    console.error(`[AgriLink API] Connection failed to ${API_BASE}/api/farmers:`, err);
    return { success: false, error: 'server_unreachable' };
  }
}

/**
 * Submit Industry Biomass Sourcing Requirement
 * Payload fields: industry_name, contact_phone, industry_type, residue_type, quantity_tons, state, district, price_per_ton
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
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const existing = JSON.parse(localStorage.getItem('agrilink_industry_submissions') || '[]');
      const record = {
        id: 'industry_' + Date.now(),
        ...payload,
        created_at: new Date().toISOString()
      };
      existing.push(record);
      localStorage.setItem('agrilink_industry_submissions', JSON.stringify(existing));
      console.log('[AgriLink MOCK_MODE] Saved industry requirement to localStorage:', record);
      return { success: true, data: record, mock: true };
    } catch (err) {
      console.error('[AgriLink MOCK_MODE] LocalStorage write failed:', err);
      return { success: false, error: 'storage_error' };
    }
  }

  // Real Backend Network Call
  try {
    const response = await fetch(`${API_BASE}/api/industries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error(`[AgriLink API] Backend returned HTTP ${response.status} from ${API_BASE}/api/industries`);
      return { success: false, error: 'server_error', status: response.status };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    console.error(`[AgriLink API] Connection failed to ${API_BASE}/api/industries:`, err);
    return { success: false, error: 'server_unreachable' };
  }
}

// ----------------------------------------------------------------------------
// 3. Dynamic State & District Dropdown Helpers
// ----------------------------------------------------------------------------

/**
 * Populate State Dropdown with English option values and localized labels
 */
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

/**
 * Populate District Dropdown based on chosen State
 */
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
// 4. Form Validation & Submission Wiring
// ----------------------------------------------------------------------------

function setFieldError(fieldId, errorKey) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(`error-${fieldId}`);
  if (input) {
    input.classList.add('is-invalid');
  }
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
  if (input) {
    input.classList.remove('is-invalid');
  }
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

  const iconSvg = type === 'success'
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

/**
 * Initialize Farmer Form Logic
 */
function initFarmerForm() {
  const form = document.getElementById('farmer-form');
  if (!form) return;

  const stateSelect = document.getElementById('farmer-state');
  const districtSelect = document.getElementById('farmer-district');
  const alertEl = document.getElementById('farmer-alert');
  const submitBtn = document.getElementById('farmer-submit-btn');

  // Populate States
  populateStates(stateSelect);
  populateDistricts(districtSelect, '');

  stateSelect.addEventListener('change', () => {
    clearFieldError('farmer-state');
    populateDistricts(districtSelect, stateSelect.value);
  });

  districtSelect.addEventListener('change', () => {
    clearFieldError('farmer-district');
  });

  // Re-sync states when language changes
  window.addEventListener('agrilink:languageChanged', () => {
    const savedState = stateSelect.value;
    const savedDistrict = districtSelect.value;
    populateStates(stateSelect);
    if (savedState) {
      stateSelect.value = savedState;
      populateDistricts(districtSelect, savedState, savedDistrict);
    }
  });

  // Clear validation on input
  ['farmer-name', 'farmer-phone', 'farmer-residue', 'farmer-qty', 'farmer-village', 'farmer-price'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => clearFieldError(id));
      el.addEventListener('change', () => clearFieldError(id));
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors(form);
    hideAlert(alertEl);

    // Read form values
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

    // Loading State
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
      const errKey = result.error === 'server_unreachable' ? 'error.server_unreachable' : 'error.general';
      showAlert(alertEl, 'error', errKey);
    }
  });
}

/**
 * Initialize Industry Form Logic
 */
function initIndustryForm() {
  const form = document.getElementById('industry-form');
  if (!form) return;

  const stateSelect = document.getElementById('industry-state');
  const districtSelect = document.getElementById('industry-district');
  const alertEl = document.getElementById('industry-alert');
  const submitBtn = document.getElementById('industry-submit-btn');

  // Populate States
  populateStates(stateSelect);
  populateDistricts(districtSelect, '');

  stateSelect.addEventListener('change', () => {
    clearFieldError('industry-state');
    populateDistricts(districtSelect, stateSelect.value);
  });

  districtSelect.addEventListener('change', () => {
    clearFieldError('industry-district');
  });

  // Re-sync states when language changes
  window.addEventListener('agrilink:languageChanged', () => {
    const savedState = stateSelect.value;
    const savedDistrict = districtSelect.value;
    populateStates(stateSelect);
    if (savedState) {
      stateSelect.value = savedState;
      populateDistricts(districtSelect, savedState, savedDistrict);
    }
  });

  // Clear validation on input
  ['industry-name', 'industry-phone', 'industry-type', 'industry-residue', 'industry-qty', 'industry-price'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => clearFieldError(id));
      el.addEventListener('change', () => clearFieldError(id));
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors(form);
    hideAlert(alertEl);

    // Read form values
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

    // Loading State
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
      const errKey = result.error === 'server_unreachable' ? 'error.server_unreachable' : 'error.general';
      showAlert(alertEl, 'error', errKey);
    }
  });
}

// Auto-initialize based on active page
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
  LOCATION_DATA,
  populateStates,
  populateDistricts
};
