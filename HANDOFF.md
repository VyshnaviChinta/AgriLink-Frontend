# AgriLink - Frontend to Backend Handoff Specification

This document provides a comprehensive technical reference for backend engineers integrating with the AgriLink frontend client.

---

## 1. Architecture Overview

AgriLink is built as a pure, dependency-free vanilla web application (HTML5, CSS3, modern JavaScript ES2020) without bundlers or transpilers.

All network calls and matching engine logic are centralized in **[`js/api.js`](js/api.js)**. When `MOCK_MODE` is enabled, the frontend computes matches, aggregates clusters, and stores records in browser `localStorage`. When switched to `MOCK_MODE = false`, the frontend dispatches standard `fetch()` HTTP requests to the backend server configured at `API_BASE`.

---

## 2. Configuration & Location in `js/api.js`

The backend connection settings are declared at the very top of **[`js/api.js`](js/api.js#L16-L20)**:

```javascript
// js/api.js (Lines 16-20)
const MOCK_MODE = true; // Set to false to connect to real backend server
const API_BASE = 'http://localhost:8000';
const CLUSTER_RADIUS_KM = 50; // Radial distance (km) from pickup hub for farmer clusters
const TONS_PER_TRUCK = 10; // Nominal capacity per truck in metric tons
const MAX_BUYER_DISTANCE_KM = 300; // Maximum distance (km) from pickup hub for industrial buyers
```

These constants and API methods are exported to the global scope via `window.AgriLinkAPI`:

```javascript
// js/api.js (Lines 1172-1193)
window.AgriLinkAPI = {
  API_BASE,
  MOCK_MODE,
  CLUSTER_RADIUS_KM,
  TONS_PER_TRUCK,
  MAX_BUYER_DISTANCE_KM,
  addFarmer,
  addIndustry,
  getMatches,
  loadDemoData,
  clearDemoData,
  clearAllData,
  computeClusters,
  formatPlace,
  getBookings,
  saveBooking,
  LOCATION_DATA,
  DISTRICT_COORDINATES,
  calculateDistanceKm,
  populateStates,
  populateDistricts
};
```

---

## 3. Frontend API Calls Specification

The frontend makes exactly three HTTP API calls:

| Function | Method | Endpoint Path | Source Page | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `addFarmer(farmerData)` | `POST` | `/add_farmer` | `farmer.html` | Register crop residue listing |
| `addIndustry(industryData)` | `POST` | `/add_industry` | `industry.html` | Register industrial demand requirement |
| `getMatches()` | `GET` | `/match` | `matches.html`, `impact.html` | Retrieve ranked match pairs |

---

### 3.1 `POST /add_farmer`

Triggered when a farmer submits crop residue through the form on `farmer.html`.

- **HTTP Method**: `POST`
- **URL**: `${API_BASE}/add_farmer`
- **Request Headers**:
  ```http
  Content-Type: application/json
  Accept: application/json
  ```

#### Payload Field Names & Types

| Field Name | Type | Required | Description & Allowed Values |
| :--- | :--- | :--- | :--- |
| `name` | `string` | Yes | Farmer's full name (trimmed, 2-100 characters). E.g., `"Harpreet Singh"`. |
| `phone` | `string` | Yes | 10-digit Indian mobile number (regex: `^[6-9]\d{9}$`). E.g., `"9876543210"`. |
| `residue_type` | `string` | Yes | Enum: `"paddy_straw"`, `"wheat_straw"`, `"sugarcane_bagasse"`, `"maize_stalk"`, `"cotton_stalk"`. |
| `quantity_tons` | `number` | Yes | Float $\ge 1.0$, quantity available in metric tons. E.g., `25.0`. |
| `state` | `string` | Yes | One of 8 supported states: `"Punjab"`, `"Haryana"`, `"Uttar Pradesh"`, `"Andhra Pradesh"`, `"Telangana"`, `"Karnataka"`, `"Tamil Nadu"`, `"Kerala"`. |
| `district` | `string` | Yes | District name matching the selected state (from predefined coordinates list). E.g., `"Ludhiana"`. |
| `village` | `string` | Yes | Village / Town / Tehsil name (trimmed). E.g., `"Khanna"`. |
| `price_per_ton` | `number` | Yes | Minimum expected asking price in INR per ton (float $\ge 100$). E.g., `2100.0`. |

#### Example Request Payload
```json
{
  "name": "Harpreet Singh",
  "phone": "9876543210",
  "residue_type": "paddy_straw",
  "quantity_tons": 25.0,
  "state": "Punjab",
  "district": "Ludhiana",
  "village": "Khanna",
  "price_per_ton": 2100.0
}
```

#### Expected Success Response Shape
- **Status Code**: `200 OK` or `201 Created`
- **Body**: JSON object containing either the created record directly or wrapped in `data`:
```json
{
  "success": true,
  "data": {
    "id": "farmer_1729158400000",
    "name": "Harpreet Singh",
    "phone": "9876543210",
    "residue_type": "paddy_straw",
    "quantity_tons": 25.0,
    "state": "Punjab",
    "district": "Ludhiana",
    "village": "Khanna",
    "price_per_ton": 2100.0,
    "created_at": "2026-10-17T09:00:00.000Z"
  }
}
```

#### Frontend Error Handling
- If HTTP status is not 2xx: Frontend displays a localized server error alert (`error.general`).
- If network connection fails: Frontend catches the exception and displays `"Unable to connect to the server. Please ensure the backend is running."` (`error.server_unreachable`).

---

### 3.2 `POST /add_industry`

Triggered when an enterprise buyer submits a biomass sourcing requirement on `industry.html`.

- **HTTP Method**: `POST`
- **URL**: `${API_BASE}/add_industry`
- **Request Headers**:
  ```http
  Content-Type: application/json
  Accept: application/json
  ```

#### Payload Field Names & Types

| Field Name | Type | Required | Description & Allowed Values |
| :--- | :--- | :--- | :--- |
| `industry_name` | `string` | Yes | Company or facility name (trimmed). E.g., `"Punjab Bio-Energy Pvt Ltd"`. |
| `contact_phone` | `string` | Yes | 10-digit Indian contact phone (regex: `^[6-9]\d{9}$`). E.g., `"9812345678"`. |
| `industry_type` | `string` | Yes | Sector enum: `"biofuel"`, `"paper_mill"`, `"compost"`, `"packaging"`. |
| `residue_type` | `string` | Yes | Target crop residue enum: `"paddy_straw"`, `"wheat_straw"`, `"sugarcane_bagasse"`, `"maize_stalk"`, `"cotton_stalk"`, or `"any"`. |
| `quantity_tons` | `number` | Yes | Procurement capacity in metric tons (float $\ge 1.0$). E.g., `500.0`. |
| `state` | `string` | Yes | State name. E.g., `"Punjab"`. |
| `district` | `string` | Yes | District name. E.g., `"Patiala"`. |
| `price_per_ton` | `number` | Yes | Maximum offered purchase budget in INR per ton (float $\ge 100$). E.g., `2350.0`. |

#### Example Request Payload
```json
{
  "industry_name": "Punjab Bio-Energy Pvt Ltd",
  "contact_phone": "9812345678",
  "industry_type": "biofuel",
  "residue_type": "paddy_straw",
  "quantity_tons": 500.0,
  "state": "Punjab",
  "district": "Patiala",
  "price_per_ton": 2350.0
}
```

#### Expected Success Response Shape
- **Status Code**: `200 OK` or `201 Created`
- **Body**: JSON object containing either the created record directly or wrapped in `data`:
```json
{
  "success": true,
  "data": {
    "id": "industry_1729158400000",
    "industry_name": "Punjab Bio-Energy Pvt Ltd",
    "contact_phone": "9812345678",
    "industry_type": "biofuel",
    "residue_type": "paddy_straw",
    "quantity_tons": 500.0,
    "state": "Punjab",
    "district": "Patiala",
    "price_per_ton": 2350.0,
    "created_at": "2026-10-17T09:00:00.000Z"
  }
}
```

---

### 3.3 `GET /match`

Triggered on `matches.html` on initial page load, and by `impact.html` to compute environmental and economic metrics.

- **HTTP Method**: `GET`
- **URL**: `${API_BASE}/match`
- **Request Headers**:
  ```http
  Accept: application/json
  ```
- **Query Parameters**: None required by default. The backend computes matches against currently active farmer listings and industry requirements.

---

## 4. `/match` Response Format Expected by the Matches Page

The Matches page controller ([`js/matches.js`](js/matches.js)) renders matches into a responsive table (desktop), cards (mobile), filter/sort dropdowns, an interactive score breakdown modal, and a booking logistics panel.

The backend endpoint `GET /match` must return an HTTP `200 OK` with a JSON payload where the match list is either:
1. Returned as a root JSON array `[...]`, or
2. Wrapped in `{ "success": true, "data": [...] }` or `{ "matches": [...] }`.

### 4.1 Schema of Each Match Object in the Array

```typescript
interface MatchItem {
  id: string;                      // Unique match ID (e.g. "match_farmer_1_industry_1_paddy_straw")
  residue_type: string;            // Crop residue type (e.g. "paddy_straw")
  distance_km: number;             // Road/Haversine distance between farmer and industry district (in km)
  farmer_ask: number;              // Farmer asking price per ton in INR
  industry_offer: number;          // Industry offering price per ton in INR
  price_gap: number;               // industry_offer - farmer_ask (in INR, must be >= 0)
  score: number;                   // Composite match score (integer, 0 to 100)
  is_demo?: boolean;               // Optional flag; if true, displays "Sample data" translated badge

  farmer: {
    id?: string;                   // Farmer identifier
    name: string;                  // Farmer full name
    phone: string;                 // Farmer phone number
    village: string;               // Village name
    district: string;              // District name
    state: string;                 // State name
    quantity_tons: number;         // Available residue in metric tons
    price_per_ton: number;         // Asking price per ton
    residue_type: string;          // Residue type
    is_demo?: boolean;
  };

  industry: {
    id?: string;                   // Industry identifier
    industry_name: string;         // Company name
    industry_type: string;         // Sector: "biofuel" | "paper_mill" | "compost" | "packaging"
    district: string;              // District name
    state: string;                 // State name
    quantity_tons: number;         // Required quantity in tons
    price_per_ton: number;         // Purchase budget per ton
    residue_type: string;          // "paddy_straw" | "wheat_straw" | ... | "any"
    is_demo?: boolean;
  };

  breakdown: {
    residue: number;               // Residue compatibility score (0 - 30)
    distance: number;              // Proximity score (0 - 30)
    price: number;                 // Economic score (0 - 25)
    quantity: number;              // Volume coverage score (0 - 15)
    total: number;                 // Sum of categories (0 - 100)
    distance_km: number;           // Distance in km (displayed in breakdown modal)
    price_gap: number;             // Price gap in INR (displayed in breakdown modal)
    qty_coverage_pct: number;      // Coverage percentage (e.g. 5 for 25t / 500t)
  };
}
```

### 4.2 Complete Example `/match` JSON Response
```json
[
  {
    "id": "match_farmer_1_industry_1_paddy_straw",
    "residue_type": "paddy_straw",
    "distance_km": 80,
    "farmer_ask": 2100,
    "industry_offer": 2350,
    "price_gap": 250,
    "score": 87,
    "is_demo": false,
    "farmer": {
      "id": "farmer_1",
      "name": "Harpreet Singh",
      "phone": "9876543210",
      "village": "Khanna",
      "district": "Ludhiana",
      "state": "Punjab",
      "quantity_tons": 25,
      "price_per_ton": 2100,
      "residue_type": "paddy_straw"
    },
    "industry": {
      "id": "industry_1",
      "industry_name": "BioGreen Energy Tech",
      "industry_type": "biofuel",
      "district": "Patiala",
      "state": "Punjab",
      "quantity_tons": 500,
      "price_per_ton": 2350,
      "residue_type": "paddy_straw"
    },
    "breakdown": {
      "residue": 30,
      "distance": 25,
      "price": 25,
      "quantity": 7,
      "total": 87,
      "distance_km": 80,
      "price_gap": 250,
      "qty_coverage_pct": 5
    }
  }
]
```

### 4.3 100-Point Matching Engine Algorithm Specification

For consistency between client-side simulation and backend calculations, the engine implements this exact scoring model:

1. **Hard Constraints (Filtering Rules)**:
   - **Residue Compatibility**: `industry.residue_type === 'any' || farmer.residue_type === industry.residue_type`. If incompatible, the match is discarded.
   - **Price Compatibility**: `farmer.price_per_ton <= industry.price_per_ton`. If the farmer's ask exceeds the buyer's budget, the match is discarded.

2. **Scoring Breakdown**:
   - **Residue Score (Max 30 pts)**:
     - Exact residue match: `30 pts`
     - Industry accepts `'any'`: `28 pts`
   - **Distance Score (Max 30 pts)**:
     - Formula: $\max(0, \min(30, \text{round}(30 \times (1 - \min(\text{distance\_km}, 500) / 500))))$
     - At $0\text{ km} \rightarrow 30\text{ pts}$; at $250\text{ km} \rightarrow 15\text{ pts}$; $\ge 500\text{ km} \rightarrow 0\text{ pts}$.
   - **Price Score (Max 25 pts)**:
     - Base score: `15 pts`
     - Bonus: Up to `10 pts` scaled by $\frac{\text{price\_gap}}{\text{industry\_offer}} / 0.25$
     - Formula: $15 + \min(10, \text{round}(10 \times \min(1.0, (\text{price\_gap} / \text{industry\_offer}) / 0.25)))$
   - **Quantity Coverage Score (Max 15 pts)**:
     - Ratio: $\min(1.0, \frac{\text{farmer\_tons}}{\text{industry\_tons}})$
     - Formula: $\max(5, \min(15, \text{round}(15 \times \text{ratio})))$
     - Provides a minimum baseline of `5 pts` so smallholders are not penalized to zero.
   - **Total Score**: Sum of the 4 components, capped at `100 pts`. Default sort order is descending by `score`.

---

## 5. How to Switch to the Real Backend

Follow these steps to transition from browser simulation to the live backend:

1. **Update `js/api.js`**:
   - Change line 16 from `const MOCK_MODE = true;` to:
     ```javascript
     const MOCK_MODE = false;
     ```
   - Verify line 17 points to your backend server:
     ```javascript
     const API_BASE = 'http://localhost:8000'; // or 'https://api.yourdomain.com'
     ```

2. **Configure CORS on the Backend**:
   Because the frontend executes in the browser, your backend must permit Cross-Origin requests. Ensure your backend returns the following headers on all endpoints and handles `OPTIONS` preflight requests:
   ```http
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Methods: GET, POST, OPTIONS
   Access-Control-Allow-Headers: Content-Type, Accept
   ```

3. **Verify Endpoint Contracts**:
   Ensure your backend server routes match:
   - `POST /add_farmer`
   - `POST /add_industry`
   - `GET /match`

4. **Test Graceful Fallbacks**:
   When the backend server is stopped, submitting a form on `farmer.html` or `industry.html` should cleanly trigger the frontend's toast/alert: `"Unable to connect to the server. Please ensure the backend is running."`

---

## 6. How to Run the Site Locally

The site requires a standard HTTP server so that modern browser security policies (CORS, modules, localStorage) operate as expected.

> [!IMPORTANT]
> The default `API_BASE` is configured for **`http://localhost:8000`**. Run your frontend on port **`8080`**, **`3000`**, or **`5500`** to avoid port collisions with your backend service.

### Option A: Python 3 Built-in Server (Recommended)
Open a terminal in the project root directory (`c:\Users\vyshn\Downloads\AgriLink`):
```bash
# Using standard Python
python -m http.server 8080

# Or using the Windows Python launcher
py -3 -m http.server 8080
```
Then navigate to **`http://localhost:8080`** in any web browser.

### Option B: Node.js / NPX
From the project root:
```bash
npx serve . -p 8080
# or
npx http-server -p 8080
```

### Option C: VS Code Live Server
1. Open the project folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and click **"Open with Live Server"**.

---

## 7. Site Navigation & Available Pages

| Page Path | Navigation Name | Description |
| :--- | :--- | :--- |
| [`index.html`](index.html) | **Home** | Landing page, circular economy overview, impact metrics, and role selector |
| [`farmer.html`](farmer.html) | **Farmer Portal** | Crop residue listing form with state/district selectors and price validation |
| [`industry.html`](industry.html) | **Industry Portal** | Industrial procurement form with sector selection and demand parameters |
| [`matches.html`](matches.html) | **Matches** | Match engine results, score breakdowns, deal logistics panel, and booking simulation |
| [`clusters.html`](clusters.html) | **Clusters** | Smart Collection Network grouping farmers within 50 km into collective hubs |
| [`impact.html`](impact.html) | **Impact** | Environmental & economic dashboard, interactive charts, and carbon credit metrics |

All pages share synchronized multi-language localization supporting **English (en)**, **Hindi (hi)**, **Telugu (te)**, **Kannada (kn)**, **Tamil (ta)**, and **Malayalam (ml)** via [`js/i18n.js`](js/i18n.js).
