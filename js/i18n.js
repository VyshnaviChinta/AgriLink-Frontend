/**
 * AgriLink - Internationalization (i18n) Engine
 * Supported Languages: English (en), हिन्दी (hi), తెలుగు (te), ಕನ್ನಡ (kn), தமிழ் (ta), മലയാളം (ml)
 * Features:
 * - LocalStorage persistence
 * - English fallback for any missing translation key
 * - Attribute bindings: data-i18n, data-i18n-placeholder, data-i18n-aria-label, data-i18n-title
 * - Dynamic document lang and custom event emission
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'agrilink_lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED_LANGUAGES = ['en', 'hi', 'te', 'kn', 'ta', 'ml'];

  const translations = {
    // ========================================================================
    // 1. English (Default & Fallback)
    // ========================================================================
    en: {
      'nav.brand': 'AgriLink',
      'nav.tagline_short': 'From Smoke to Sustainability',
      'nav.home': 'Home',
      'nav.how_it_works': 'How It Works',
      'nav.farmer_portal': 'Farmer Portal',
      'nav.industry_portal': 'Industry Portal',
      'nav.matches': 'Matches',
      'nav.impact': 'Impact',
      'nav.select_lang': 'Language',

      'hero.badge': 'Circular Biomass Initiative',
      'hero.tagline': 'From Smoke to Sustainability',
      'hero.description': 'Empowering farmers to turn crop residue into guaranteed income and clean industrial energy. Stop stubble burning, enrich our soil, and ensure clean air for all.',
      'hero.btn_farmer_tag': 'For Farmers',
      'hero.btn_farmer_title': 'I am a Farmer',
      'hero.btn_farmer_sub': 'Sell Crop Residue & Earn',
      'hero.btn_industry_tag': 'For Enterprises',
      'hero.btn_industry_title': 'I am an Industry',
      'hero.btn_industry_sub': 'Procure Green Biomass & Pellets',
      'hero.trust_free': '100% Free for Farmers',
      'hero.trust_pickup': 'Direct Industry Matching',
      'hero.trust_payment': 'Transparent Fair Pricing',

      'metrics.tonnes_val': '150,000+',
      'metrics.tonnes_label': 'Tonnes Stubble Repurposed',
      'metrics.tonnes_sub': 'Averted open field fire emissions',
      'metrics.payout_val': '₹14.8 Cr',
      'metrics.payout_label': 'Direct Farmer Earnings',
      'metrics.payout_sub': 'Generated from residue sales',
      'metrics.co2_val': '210,000',
      'metrics.co2_label': 'Tonnes CO₂ Offset',
      'metrics.co2_sub': 'Equivalent to millions of clean breaths',

      'workflow.tag': 'The Circular Solution',
      'workflow.title': 'How AgriLink Works',
      'workflow.desc': 'A seamless digital bridge from crop harvesting to sustainable industrial energy.',
      'workflow.step1_title': '1. Farmer Lists Stubble',
      'workflow.step1_desc': 'Farmers register their crop residue (paddy, wheat, sugarcane, etc.) with location and expected price.',
      'workflow.step2_title': '2. Smart Buyer Matching',
      'workflow.step2_desc': 'AgriLink matches the listing with local industries seeking biomass, ensuring optimum pricing and minimal transit distance.',
      'workflow.step3_title': '3. Clean Industrial Conversion',
      'workflow.step3_desc': 'Residue is converted into bio-pellets, bio-CNG, paper pulp, and sustainable power replacing fossil coal.',

      'portals.farmer_badge': 'Growers & Producers',
      'portals.farmer_title': 'Farmer Benefits',
      'portals.farmer_desc': 'Eliminate the cost of field clearing, avoid pollution fines, and earn predictable supplementary revenue per acre.',
      'portals.farmer_f1': 'Zero listing fee: Connect directly with verified buyers',
      'portals.farmer_f2': 'Transparent market pricing per ton set by you',
      'portals.farmer_f3': 'Preserves soil organic carbon and micro-nutrients',
      'portals.farmer_cta': 'Go to Farmer Portal',

      'portals.industry_badge': 'Commercial & Bio-Energy',
      'portals.industry_title': 'Industry Sourcing',
      'portals.industry_desc': 'Reliable bio-feedstock supply chains for thermal plants, bio-refineries, and eco-packaging manufacturers.',
      'portals.industry_f1': 'District-level sourcing tailored to your plant location',
      'portals.industry_f2': 'Direct contact with local farmer clusters and aggregators',
      'portals.industry_f3': 'Verified ESG compliance & Scope-1 carbon credits',
      'portals.industry_cta': 'Go to Industry Portal',

      'footer.mission': 'AgriLink connects farmers with green industries to eliminate stubble burning and create sustainable biomass supply chains.',
      'footer.quick_links': 'Quick Portals',
      'footer.resources': 'Platform',
      'footer.about_us': 'About Us',
      'footer.contact': 'Kisan Helpline (Toll-Free)',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service',
      'footer.rights': 'All rights reserved. Transforming agricultural smoke into sustainable energy.',

      // Farmer Portal Page & Form
      'farmer_page.badge': 'Farmer Marketplace',
      'farmer_page.title': 'List Your Crop Residue',
      'farmer_page.subtitle': 'Connect directly with verified industrial buyers. Set your expected price per ton and sell agricultural biomass without burning.',
      'farmer_page.notice': 'AgriLink connects farmers directly with industries seeking agricultural biomass. We do not charge listing fees.',
      'farmer_page.card_title': '🌾 Crop Residue Listing Form',
      'farmer_page.card_sub': 'Provide your harvest details and location to connect with matched buyers in your district.',

      // Industry Portal Page & Form
      'industry_page.badge': 'Industry Procurement',
      'industry_page.title': 'Procure Sustainable Biomass',
      'industry_page.subtitle': 'Source crop residue directly from farmers in your target districts for biofuels, paper mills, compost, and packaging.',
      'industry_page.notice': 'AgriLink matches industrial buyers with local farmers producing agricultural crop residue.',
      'industry_page.card_title': '🏭 Biomass Sourcing Requirement Form',
      'industry_page.card_sub': 'Specify your volume requirement, residue type, and preferred sourcing district.',

      // Form Field Labels
      'form.name': 'Full Name',
      'form.phone': 'Phone Number (10 digits)',
      'form.residue_type': 'Residue Type',
      'form.quantity_tons': 'Quantity (Tons)',
      'form.state': 'State',
      'form.district': 'District',
      'form.village': 'Village',
      'form.expected_price': 'Expected Price / Ton (₹)',

      'form.industry_name': 'Industry / Company Name',
      'form.contact_phone': 'Contact Phone (10 digits)',
      'form.industry_type': 'Industry Type',
      'form.required_residue': 'Required Residue Type',
      'form.quantity_needed': 'Quantity Needed (Tons)',
      'form.preferred_state': 'Preferred State',
      'form.preferred_district': 'Preferred District',
      'form.offered_price': 'Offered Price / Ton (₹)',

      // Placeholders
      'placeholder.name': 'e.g. Gurpreet Singh',
      'placeholder.phone': 'e.g. 9876543210',
      'placeholder.quantity': 'e.g. 25',
      'placeholder.village': 'e.g. Raikot',
      'placeholder.expected_price': 'e.g. 2200',
      'placeholder.industry_name': 'e.g. GreenBio Fuel Energy Ltd',
      'placeholder.quantity_needed': 'e.g. 500',
      'placeholder.offered_price': 'e.g. 2400',

      // Dropdown Options
      'residue.select': '-- Select Residue Type --',
      'residue.paddy_straw': 'Paddy Straw',
      'residue.wheat_straw': 'Wheat Straw',
      'residue.sugarcane_bagasse': 'Sugarcane Bagasse',
      'residue.maize_stalk': 'Maize Stalk',
      'residue.cotton_stalk': 'Cotton Stalk',
      'residue.any': 'Any Residue / All Types',

      'industry_type.select': '-- Select Industry Type --',
      'industry_type.biofuel': 'Biofuel & Energy',
      'industry_type.paper_mill': 'Paper Mill & Pulp',
      'industry_type.compost': 'Compost & Bio-fertilizer',
      'industry_type.packaging': 'Eco-Friendly Packaging',

      'state.select': '-- Select State --',
      'district.select': '-- Select District --',
      'district.select_state_first': '-- Select State First --',

      // States
      'state.punjab': 'Punjab',
      'state.haryana': 'Haryana',
      'state.uttar_pradesh': 'Uttar Pradesh',
      'state.andhra_pradesh': 'Andhra Pradesh',
      'state.telangana': 'Telangana',
      'state.karnataka': 'Karnataka',
      'state.tamil_nadu': 'Tamil Nadu',
      'state.kerala': 'Kerala',

      // Buttons & Feedback
      'form.submit_farmer': 'List Crop Residue',
      'form.submit_industry': 'Submit Sourcing Requirement',
      'form.submitting': 'Submitting...',
      'form.success_farmer': 'Listing submitted successfully! We will connect you with interested buyers in your district.',
      'form.success_industry': 'Requirement submitted successfully! We will match you with farmers producing your required residue.',
      'form.footer_note': 'Your information will only be shared with verified AgriLink marketplace partners.',
      'mock.badge': 'Demo Mode (Mock Storage)',

      // Validation Errors
      'error.required': 'This field is required',
      'error.phone_invalid': 'Please enter a valid 10-digit mobile number',
      'error.number_positive': 'Please enter a valid quantity greater than 0',
      'error.price_positive': 'Please enter a valid price greater than 0',
      'error.select_option': 'Please choose an option from the list',
      'error.server_unreachable': 'Unable to connect to the server. Please try again later.',
      'error.general': 'An unexpected error occurred. Please try again.',

      // Matches Portal Specific Keys
      'matches.badge': 'Smart Matching Engine',
      'matches.title': 'Biomass Deals & Matches',
      'matches.subtitle': 'Compatible farmer residue listings matched with industrial buyers based on residue type, distance, price, and volume.',
      'matches.count': 'Compatible Deals Found',
      'matches.load_demo': 'Load Demo Data',
      'matches.clear_data': 'Clear Data',
      'matches.sample_data': 'Sample Data',
      'matches.filter_residue': 'Residue Type',
      'matches.filter_state': 'State',
      'matches.filter_max_price': 'Max Price / Ton (₹)',
      'matches.sort_by': 'Sort By',
      'matches.sort_score': 'Highest Match Score',
      'matches.sort_distance': 'Shortest Distance',
      'matches.sort_price': 'Lowest Price / Ton',
      'matches.all_residues': 'All Residues',
      'matches.all_states': 'All States',
      'matches.col_farmer': 'Farmer',
      'matches.col_industry': 'Industry Buyer',
      'matches.col_residue': 'Residue',
      'matches.col_qty': 'Quantity',
      'matches.col_distance': 'Distance',
      'matches.col_farmer_ask': 'Farmer Ask',
      'matches.col_industry_offer': 'Industry Offer',
      'matches.col_gap': 'Price Margin',
      'matches.col_score': 'Match Score',
      'matches.col_action': 'Action',
      'matches.book_btn': 'Book Deal',
      'matches.booked': 'Booked',
      'status.pending': 'Pending Confirmation',
      'status.available': 'Available',
      'matches.empty_title': 'No Matches Found',
      'matches.empty_desc': 'No compatible matches available yet. Click "Load demo data" above to explore sample deals, or register via the Farmer and Industry portals.',
      'matches.score_breakdown_title': 'Match Score Breakdown',
      'matches.score_tap_hint': 'Tap to view points breakdown',
      'matches.score_residue': 'Residue Compatibility',
      'matches.score_distance': 'Geographic Distance',
      'matches.score_price': 'Price Competitiveness',
      'matches.score_quantity': 'Quantity Coverage',
      'matches.score_total': 'Total Match Score',
      'matches.modal_title': 'Confirm Biomass Booking',
      'matches.modal_desc': 'Submit a deal proposal between this farmer and industry buyer. Both parties will be notified for confirmation.',
      'matches.modal_confirm': 'Confirm Booking',
      'matches.modal_cancel': 'Cancel',
      'matches.booking_success': 'Booking created successfully! Status set to Pending.',

      // Impact Dashboard Specific Keys
      'impact.badge': 'Environmental & ESG Impact',
      'impact.title': 'Sustainability & Economic Impact',
      'impact.subtitle': 'Quantifying emissions prevented, farmer wealth created, and clean industrial transition.',
      'impact.sample_badge': 'Sample Data Active',
      'impact.toggle_booked': 'Booked Deals',
      'impact.toggle_potential': 'Potential (from matches)',
      'impact.mode_notice_booked': 'Showing metrics from booked trades (demo, stored in this browser)',
      'impact.mode_notice_potential': 'Showing potential metrics from compatible matches (each farmer counted once).',

      // Summary Cards
      'impact.card_farmer_earnings': 'Total Farmer Earnings',
      'impact.card_residue_diverted': 'Residue Diverted from Burning',
      'impact.card_co2_avoided': 'CO₂ Emissions Avoided',
      'impact.card_trees_equiv': 'Mature Trees Equivalent',
      'impact.card_carbon_credits': 'Potential Carbon Credits (estimate)',
      'impact.card_credit_value': 'Estimated Credit Market Value',
      'impact.card_platform_fee': 'Platform Fee on Trades (2%)',
      'impact.card_brokerage_comm': 'Platform Commission on Credits (10%)',
      'impact.credit_verification_note': 'Real credits require third-party verification.',

      // Charts
      'impact.chart_earnings_title': 'Farmer Revenue Generation (₹)',
      'impact.chart_industry_title': 'Industry Biomass Demand (Tons)',
      'impact.chart_residue_title': 'Diverted Biomass Volume by Residue Type',
      'impact.chart_earnings_axis': 'Earnings (₹)',
      'impact.chart_industry_axis': 'Volume (Tons)',

      // Government View
      'impact.govt_title': 'Government & Regulatory View',
      'impact.govt_subtitle': 'District-level summary of residue utilised and estimated emissions avoided',
      'impact.govt_residue_utilised': 'Total Residue Utilised',
      'impact.govt_co2_saved': 'Net CO₂ Saved',
      'impact.govt_districts_covered': 'Districts Covered',
      'impact.govt_unit_tons': 'Tons',
      'impact.govt_unit_tonnes': 'Tonnes CO₂e',
      'impact.govt_unit_districts': 'Districts',

      // Methodology & Assumptions
      'impact.calc_title': 'How We Calculate',
      'impact.calc_disclaimer': 'Estimated value used for demonstration; to be replaced with a verified emission factor.',
      'impact.calc_editable_label': 'Emission Factor Assumption (kg CO₂ avoided per ton):',
      'impact.calc_reset_btn': 'Reset to Default (1,460)',
      'impact.calc_f1_title': 'Emissions Averted',
      'impact.calc_f1_desc': 'Residue Diverted (t) × Emission Factor (kg CO₂/t) ÷ 1,000',
      'impact.calc_f2_title': 'Tree Sequestration Equivalent',
      'impact.calc_f2_desc': 'Total kg CO₂ Avoided ÷ 21 kg CO₂ absorbed per mature tree per year',
      'impact.calc_f3_title': 'Carbon Credits & Fees',
      'impact.calc_f3_desc': '1 Tonne CO₂e = 1 Credit at ₹800. Platform commission is 10% on credits and 2% fee on residue trades.',

      // Empty State
      'impact.empty_title': 'No Impact Data Available',
      'impact.empty_desc': 'No booked trades or active matches recorded yet. Book deals or load sample data in the Matches portal to generate impact metrics.',
      'impact.empty_btn': 'Go to Matches Portal',

      // === Features Expansion (Clusters, Logistics, Roadmap, Policy, Demo) ===
      'clusters.badge': 'Smart Collection Network',
      'clusters.best_industry': 'Best-Matching Industry',
      'clusters.covers_demand': 'Covers {pct}% of industry demand',
      'clusters.empty_btn': 'Load Demo Data',
      'clusters.empty_desc': 'Clusters require at least two farmers with the same residue type within 50 km. Load demo data to view a sample cluster.',
      'clusters.empty_title': 'No Farmer Clusters Formed Yet',
      'clusters.estimated_trucks': 'Estimated Trucks',
      'clusters.from_hub': 'from hub',
      'clusters.highest_ask': 'Highest Farmer Ask',
      'clusters.hub_center': 'Pickup Hub',
      'clusters.hub_label': 'Pickup Hub District',
      'clusters.industry_offer': 'Industry Offer',
      'clusters.members_title': 'Member Farmers',
      'clusters.no_industry': 'No matching industry buyer found yet for this cluster volume.',
      'clusters.pickup_point': 'Suggested Pickup Point',
      'clusters.subtitle': 'Grouping farmers within 50 km into collective pickup hubs to meet industrial orders efficiently.',
      'clusters.title': 'Biomass Aggregation Clusters',
      'clusters.total_volume': 'Aggregated Volume',
      'clusters.trucks_count': '{count} trucks',
      'clusters.trucks_unit': 'trucks (10 t per truck)',
      'clusters.unclustered_note': '{count} farmers have no nearby group yet',
      'clusters.why_desc': 'Small farmers combine quantity to meet an industry\'s minimum order.',
      'clusters.why_title': 'Why Cluster?',
      'coming_soon.alerts': 'SMS & WhatsApp alerts',
      'coming_soon.badge': 'Coming soon',
      'coming_soon.map_view': 'Map view',
      'coming_soon.negotiation': 'Price negotiation',
      'coming_soon.otp_login': 'Phone OTP login',
      'coming_soon.quality_grades': 'Quality grades',
      'coming_soon.subtitle': 'Tools under active development to make residue trade smoother, faster, and accessible to every village.',
      'coming_soon.title': 'Platform Roadmap & Upcoming Features',
      'coming_soon.upi_payment': 'UPI payment',
      'coming_soon.voice_input': 'Voice input',
      'demo.load_btn': 'Demo mode',
      'demo.loaded_success': 'Demo data loaded successfully!',
      'demo.reset_btn': 'Reset demo',
      'demo.reset_success': 'Demo records removed. User submissions preserved.',
      'logistics.advance_status': 'Advance Deal Status',
      'logistics.estimated_trucks': 'Estimated Trucks',
      'logistics.mock_payment': 'Mock payment (Demo only)',
      'logistics.payment_note': 'Simulated milestone payout on stubble pickup.',
      'logistics.pickup_date': 'Suggested Pickup Date',
      'logistics.pickup_district': 'Pickup District',
      'logistics.status_label': 'Deal Status',
      'logistics.step_confirmed': 'Confirmed',
      'logistics.step_pending': 'Pending',
      'logistics.step_picked_up': 'Picked up',
      'logistics.title': 'Deal & Logistics Details',
      'logistics.trucks_unit': 'trucks (10 t per truck)',
      'nav.clusters': 'Clusters',
      'policy.desc': 'Farmers adopting sustainable crop residue management may be eligible for applicable government assistance, residue aggregation support, and carbon credit monetization opportunities.',
      'policy.note': 'Check official sources for current schemes.',
      'policy.title': 'Support schemes and carbon credits',
    },

    // ========================================================================
    // 2. Hindi (हिन्दी)
    // ========================================================================
    hi: {
      'nav.brand': 'एग्रीलिंक',
      'nav.tagline_short': 'धुएं से स्थिरता तक',
      'nav.home': 'होम',
      'nav.how_it_works': 'कार्यप्रणाली',
      'nav.farmer_portal': 'किसान पोर्टल',
      'nav.industry_portal': 'उद्योग पोर्टल',
      'nav.matches': 'सटीक मैच',
      'nav.impact': 'हमारा प्रभाव',
      'nav.select_lang': 'भाषा',

      'hero.badge': 'सर्कुलर बायोमास पहल',
      'hero.tagline': 'धुएं से स्थिरता तक',
      'hero.description': 'फसल अवशेष को निश्चित आय और स्वच्छ औद्योगिक ऊर्जा में बदलें। पराली जलाने से मुक्ति पाएं, मिट्टी की उर्वरता बचाएं और स्वच्छ हवा सुनिश्चित करें।',
      'hero.btn_farmer_tag': 'किसानों के लिए',
      'hero.btn_farmer_title': 'मैं किसान हूँ',
      'hero.btn_farmer_sub': 'पराली बेचें और अतिरिक्त कमाएं',
      'hero.btn_industry_tag': 'उद्योगों के लिए',
      'hero.btn_industry_title': 'मैं उद्योग हूँ',
      'hero.btn_industry_sub': 'बायोमास व पेलेट्स खरीदें',
      'hero.trust_free': 'किसानों के लिए 100% निःशुल्क',
      'hero.trust_pickup': 'सीधे खरीदार से संपर्क',
      'hero.trust_payment': 'पारदर्शी व उचित मूल्य',

      'metrics.tonnes_val': '१,५०,०००+',
      'metrics.tonnes_label': 'टन पराली का सदुपयोग',
      'metrics.tonnes_sub': 'खेतों में आग लगने से रोका गया',
      'metrics.payout_val': '₹१४.८ करोड़',
      'metrics.payout_label': 'किसानों को प्रत्यक्ष लाभ',
      'metrics.payout_sub': 'पराली बिक्री से अर्जित',
      'metrics.co2_val': '२,१०,०००',
      'metrics.co2_label': 'टन CO₂ उत्सर्जन में कमी',
      'metrics.co2_sub': 'लाखों लोगों के लिए शुद्ध हवा',

      'workflow.tag': 'समाधान चक्र',
      'workflow.title': 'एग्रीलिंक कैसे काम करता है',
      'workflow.desc': 'खेत से लेकर हरित उद्योग तक एक सहज और विश्वसनीय डिजिटल माध्यम।',
      'workflow.step1_title': '१. किसान पराली दर्ज करें',
      'workflow.step1_desc': 'किसान फसल प्रकार (धान, गेहूं, गन्ना आदि), मात्रा व अपेक्षित मूल्य दर्ज करते हैं।',
      'workflow.step2_title': '२. सटीक खरीदार मिलान',
      'workflow.step2_desc': 'एग्रीलिंक आपके ज़िले के उद्योगों से संपर्क कराता है जिससे परिवहन दूरी कम और लाभ अधिक हो।',
      'workflow.step3_title': '३. स्वच्छ ऊर्जा में रूपांतरण',
      'workflow.step3_desc': 'इस पराली से बायो-पेलेट्स, बायो-सीएनजी और कागज बनता है, जिससे कोयले की खपत घटती है।',

      'portals.farmer_badge': 'अन्नदाता एवं उत्पादक',
      'portals.farmer_title': 'किसानों के लाभ',
      'portals.farmer_desc': 'खेत खाली करने का खर्च बचाएं, जुर्माने से बचें और प्रति एकड़ अतिरिक्त सुनिश्चित कमाई करें।',
      'portals.farmer_f1': 'शून्य लिस्टिंग शुल्क: सत्यापित खरीदारों से सीधा संपर्क',
      'portals.farmer_f2': 'पारदर्शी बाज़ार मूल्य जो आप स्वयं तय करते हैं',
      'portals.farmer_f3': 'खेत न जलाने से मिट्टी के पोषक तत्व सुरक्षित',
      'portals.farmer_cta': 'किसान पोर्टल पर जाएं',

      'portals.industry_badge': 'औद्योगिक एवं हरित ऊर्जा',
      'portals.industry_title': 'औद्योगिक खरीद',
      'portals.industry_desc': 'थर्मल प्लांट, रिफाइनरी और पैकेजिंग उद्योग के लिए बायोमास की विश्वसनीय आपूर्ति।',
      'portals.industry_f1': 'आपके संयंत्र के निकटवर्ती ज़िलों से सीधी आपूर्ति',
      'portals.industry_f2': 'किसान समूहों और आपूर्तिकर्ताओं से सीधा संपर्क',
      'portals.industry_f3': 'ईएसजी (ESG) मानक और कार्बन क्रेडिट लाभ',
      'portals.industry_cta': 'उद्योग पोर्टल पर जाएं',

      'footer.mission': 'एग्रीलिंक का उद्देश्य भारत में पराली जलाने की समस्या को समाप्त कर किसानों और स्वच्छ उद्योगों को सीधे जोड़ना है।',
      'footer.quick_links': 'प्रमुख पोर्टल',
      'footer.resources': 'मंच',
      'footer.about_us': 'हमारे बारे में',
      'footer.contact': 'किसान हेल्पलाइन (टोल-फ्री)',
      'footer.privacy': 'गोपनीयता नीति',
      'footer.terms': 'सेवा की शर्तें',
      'footer.rights': 'सर्वाधिकार सुरक्षित। धुएं को पर्यावरण अनुकूल ऊर्जा में बदलना।',

      // Farmer Portal Page & Form
      'farmer_page.badge': 'किसान बाज़ार',
      'farmer_page.title': 'अपनी फसल का अवशेष दर्ज करें',
      'farmer_page.subtitle': 'सत्यापित औद्योगिक खरीदारों से सीधे जुड़ें। प्रति टन अपना अपेक्षित मूल्य तय करें और बिना जलाए पराली बेचें।',
      'farmer_page.notice': 'एग्रीलिंक किसानों को सीधे बायोमास खरीदार उद्योगों से जोड़ता है। हम कोई पंजीकरण शुल्क नहीं लेते।',
      'farmer_page.card_title': '🌾 फसल अवशेष पंजीकरण फॉर्म',
      'farmer_page.card_sub': 'अपने ज़िले के खरीदारों से जुड़ने के लिए फसल विवरण और स्थान दर्ज करें।',

      // Industry Portal Page & Form
      'industry_page.badge': 'औद्योगिक खरीद',
      'industry_page.title': 'स्थायी बायोमास खरीदें',
      'industry_page.subtitle': 'जैव ईंधन, पेपर मिल, कम्पोस्ट और पैकेजिंग के लिए अपने लक्षित ज़िलों के किसानों से सीधे पराली खरीदें।',
      'industry_page.notice': 'एग्रीलिंक उद्योगों को स्थानीय फसल उत्पादक किसानों से मिलाता है।',
      'industry_page.card_title': '🏭 बायोमास मांग पंजीकरण फॉर्म',
      'industry_page.card_sub': 'अपनी आवश्यक मात्रा, फसल अवशेष का प्रकार और पसंदीदा ज़िला दर्ज करें।',

      // Form Field Labels
      'form.name': 'पूरा नाम',
      'form.phone': 'फ़ोन नंबर (१० अंक)',
      'form.residue_type': 'फसल अवशेष का प्रकार',
      'form.quantity_tons': 'मात्रा (टन में)',
      'form.state': 'राज्य',
      'form.district': 'ज़िला',
      'form.village': 'गाँव',
      'form.expected_price': 'अपेक्षित मूल्य / टन (₹)',

      'form.industry_name': 'उद्योग / कंपनी का नाम',
      'form.contact_phone': 'संपर्क फ़ोन (१० अंक)',
      'form.industry_type': 'उद्योग का प्रकार',
      'form.required_residue': 'आवश्यक अवशेष का प्रकार',
      'form.quantity_needed': 'आवश्यक मात्रा (टन में)',
      'form.preferred_state': 'पसंदीदा राज्य',
      'form.preferred_district': 'पसंदीदा ज़िला',
      'form.offered_price': 'प्रस्तावित मूल्य / टन (₹)',

      // Placeholders
      'placeholder.name': 'उदा. गुरप्रीत सिंह',
      'placeholder.phone': 'उदा. 9876543210',
      'placeholder.quantity': 'उदा. 25',
      'placeholder.village': 'उदा. रायकोट',
      'placeholder.expected_price': 'उदा. 2200',
      'placeholder.industry_name': 'उदा. ग्रीनबायो फ्यूल एनर्जी लि.',
      'placeholder.quantity_needed': 'उदा. 500',
      'placeholder.offered_price': 'उदा. 2400',

      // Dropdown Options
      'residue.select': '-- अवशेष प्रकार चुनें --',
      'residue.paddy_straw': 'धान की पराली (Paddy Straw)',
      'residue.wheat_straw': 'गेहूं का भूसा (Wheat Straw)',
      'residue.sugarcane_bagasse': 'गन्ने की खोई (Sugarcane Bagasse)',
      'residue.maize_stalk': 'मक्के का डंठल (Maize Stalk)',
      'residue.cotton_stalk': 'कपास का डंठल (Cotton Stalk)',
      'residue.any': 'कोई भी अवशेष / सभी प्रकार',

      'industry_type.select': '-- उद्योग प्रकार चुनें --',
      'industry_type.biofuel': 'जैव ईंधन व ऊर्जा (Biofuel)',
      'industry_type.paper_mill': 'कागज मिल व लुगदी (Paper Mill)',
      'industry_type.compost': 'कम्पोस्ट व जैविक खाद (Compost)',
      'industry_type.packaging': 'पर्यावरण-अनुकूल पैकेजिंग (Packaging)',

      'state.select': '-- राज्य चुनें --',
      'district.select': '-- ज़िला चुनें --',
      'district.select_state_first': '-- पहले राज्य चुनें --',

      // States
      'state.punjab': 'पंजाब (Punjab)',
      'state.haryana': 'हरियाणा (Haryana)',
      'state.uttar_pradesh': 'उत्तर प्रदेश (Uttar Pradesh)',
      'state.andhra_pradesh': 'आंध्र प्रदेश (Andhra Pradesh)',
      'state.telangana': 'तेलंगाना (Telangana)',
      'state.karnataka': 'कर्नाटक (Karnataka)',
      'state.tamil_nadu': 'तमिलनाडु (Tamil Nadu)',
      'state.kerala': 'केरल (Kerala)',

      // Buttons & Feedback
      'form.submit_farmer': 'फसल अवशेष दर्ज करें',
      'form.submit_industry': 'मांग दर्ज करें',
      'form.submitting': 'जमा हो रहा है...',
      'form.success_farmer': 'विवरण सफलतापूर्वक दर्ज हो गया! हम आपके ज़िले के इच्छुक खरीदारों से आपको जोड़ेंगे।',
      'form.success_industry': 'आपकी आवश्यकता सफलतापूर्वक दर्ज हो गई! हम आपको स्थानीय किसानों से मिलाएंगे।',
      'form.footer_note': 'आपकी जानकारी केवल सत्यापित एग्रीलिंक भागीदारों के साथ साझा की जाएगी।',
      'mock.badge': 'डेमो मोड (मॉक स्टोरेज)',

      // Validation Errors
      'error.required': 'यह जानकारी आवश्यक है',
      'error.phone_invalid': 'कृपया सही १० अंकों का मोबाइल नंबर दर्ज करें',
      'error.number_positive': 'कृपया ० से अधिक मान्य मात्रा दर्ज करें',
      'error.price_positive': 'कृपया ० से अधिक मान्य मूल्य दर्ज करें',
      'error.select_option': 'कृपया सूची में से एक विकल्प चुनें',
      'error.server_unreachable': 'Unable to connect to the server. Please try again later.',
      'error.general': 'एक अप्रत्याशित त्रुटि हुई। कृपया पुनः प्रयास करें।',

      // Matches Portal Specific Keys
      'matches.badge': 'स्मार्ट मैचिंग इंजन',
      'matches.title': 'बायोमास सौदे और मिलान',
      'matches.subtitle': 'फसल अवशेष प्रकार, दूरी, मूल्य और मात्रा के आधार पर किसानों और औद्योगिक खरीदारों का सटीक मिलान।',
      'matches.count': 'उपलब्ध सौदे मिले',
      'matches.load_demo': 'डेमो डेटा लोड करें',
      'matches.clear_data': 'डेटा साफ़ करें',
      'matches.sample_data': 'नमूना डेटा',
      'matches.filter_residue': 'अवशेष का प्रकार',
      'matches.filter_state': 'राज्य',
      'matches.filter_max_price': 'अधिकतम मूल्य / टन (₹)',
      'matches.sort_by': 'क्रमबद्ध करें',
      'matches.sort_score': 'सर्वोच्च मैच स्कोर',
      'matches.sort_distance': 'न्यूनतम दूरी',
      'matches.sort_price': 'न्यूनतम मूल्य / टन',
      'matches.all_residues': 'सभी अवशेष',
      'matches.all_states': 'सभी राज्य',
      'matches.col_farmer': 'किसान',
      'matches.col_industry': 'औद्योगिक खरीदार',
      'matches.col_residue': 'अवशेष',
      'matches.col_qty': 'मात्रा',
      'matches.col_distance': 'दूरी',
      'matches.col_farmer_ask': 'किसान मांग',
      'matches.col_industry_offer': 'कंपनी प्रस्ताव',
      'matches.col_gap': 'मूल्य अंतर',
      'matches.col_score': 'मैच स्कोर',
      'matches.col_action': 'कार्रवाई',
      'matches.book_btn': 'सौदा बुक करें',
      'matches.booked': 'बुक किया गया',
      'status.pending': 'पुष्टि लंबित',
      'status.available': 'उपलब्ध',
      'matches.empty_title': 'कोई मिलान नहीं मिला',
      'matches.empty_desc': 'वर्तमान में कोई उपयुक्त मिलान उपलब्ध नहीं है। नमूना सौदे देखने के लिए ऊपर "डेमो डेटा लोड करें" पर क्लिक करें।',
      'matches.score_breakdown_title': 'मैच स्कोर का विवरण',
      'matches.score_tap_hint': 'अंकों का विवरण देखने के लिए टैप करें',
      'matches.score_residue': 'अवशेष अनुकूलता',
      'matches.score_distance': 'भौगोलिक दूरी',
      'matches.score_price': 'मूल्य अनुकूलता',
      'matches.score_quantity': 'मात्रा कवरेज',
      'matches.score_total': 'कुल मैच स्कोर',
      'matches.modal_title': 'सौदा बुकिंग की पुष्टि',
      'matches.modal_desc': 'इस किसान और खरीदार के बीच सौदे का प्रस्ताव भेजें। दोनों पक्षों को पुष्टि के लिए सूचित किया जाएगा।',
      'matches.modal_confirm': 'बुकिंग की पुष्टि करें',
      'matches.modal_cancel': 'रद्द करें',
      'matches.booking_success': 'बुकिंग सफलतापूर्वक दर्ज हो गई! स्थिति "पुष्टि लंबित" है।',

      // Impact Dashboard Specific Keys
      'impact.badge': 'पर्यावरण व ईएसजी प्रभाव',
      'impact.title': 'स्थिरता और आर्थिक प्रभाव',
      'impact.subtitle': 'रोके गए प्रदूषण, किसानों की आय और औद्योगिक स्वच्छ ऊर्जा का वास्तविक मापन।',
      'impact.sample_badge': 'नमूना डेटा सक्रिय',
      'impact.toggle_booked': 'बुक किए गए सौदे',
      'impact.toggle_potential': 'संभावित (मैचों से)',
      'impact.mode_notice_booked': 'बुक किए गए सौदों से मेट्रिक्स प्रदर्शित (डेमो, इस ब्राउज़र में संगृहीत)',
      'impact.mode_notice_potential': 'सक्रिय मैचों का संभावित प्रभाव (प्रति किसान एकल गणना)।',

      // Summary Cards
      'impact.card_farmer_earnings': 'किसानों की कुल आय',
      'impact.card_residue_diverted': 'जलाने से रोकी गई पराली',
      'impact.card_co2_avoided': 'रोका गया CO₂ उत्सर्जन',
      'impact.card_trees_equiv': 'वृक्षारोपण के समतुल्य',
      'impact.card_carbon_credits': 'संभावित कार्बन क्रेडिट (अनुमानित)',
      'impact.card_credit_value': 'क्रेडिट का अनुमानित मूल्य',
      'impact.card_platform_fee': 'व्यापार पर मंच शुल्क (२%)',
      'impact.card_brokerage_comm': 'क्रेडिट पर मंच कमीशन (१०%)',
      'impact.credit_verification_note': 'वास्तविक क्रेडिट के लिए तृतीय-पक्ष सत्यापन आवश्यक है।',

      // Charts
      'impact.chart_earnings_title': 'किसानवार अर्जित आय (₹)',
      'impact.chart_industry_title': 'उद्योग बायोमास मांग (टन)',
      'impact.chart_residue_title': 'अवशेष प्रकार के अनुसार पराली मात्रा',
      'impact.chart_earnings_axis': 'आय (₹)',
      'impact.chart_industry_axis': 'मात्रा (टन)',

      // Government View
      'impact.govt_title': 'सरकारी व नियामक अवलोकन',
      'impact.govt_subtitle': 'उपयोग किए गए फसल अवशेष और अनुमानित उत्सर्जनों की बचत का ज़िला-स्तरीय सारांश',
      'impact.govt_residue_utilised': 'कुल पराली का सदुपयोग',
      'impact.govt_co2_saved': 'शुद्ध CO₂ बचत',
      'impact.govt_districts_covered': 'शामिल ज़िले',
      'impact.govt_unit_tons': 'टन',
      'impact.govt_unit_tonnes': 'टन CO₂e',
      'impact.govt_unit_districts': 'ज़िले',

      // Methodology & Assumptions
      'impact.calc_title': 'गणना विधि',
      'impact.calc_disclaimer': 'Estimated value used for demonstration; to be replaced with a verified emission factor.',
      'impact.calc_editable_label': 'उत्सर्जन कारक मान्यता (प्रति टन रोकी गई CO₂ किग्रा):',
      'impact.calc_reset_btn': 'डिफ़ॉल्ट पर रीसेट करें (१,४६०)',
      'impact.calc_f1_title': 'रोका गया उत्सर्जन',
      'impact.calc_f1_desc': 'रोकी गई पराली (टन) × उत्सर्जन कारक (किग्रा/टन) ÷ १,०००',
      'impact.calc_f2_title': 'वृक्ष अवशोषण समतुल्य',
      'impact.calc_f2_desc': 'कुल रोकी गई CO₂ (किग्रा) ÷ २१ किग्रा प्रति वृक्ष प्रति वर्ष',
      'impact.calc_f3_title': 'कार्बन क्रेडिट व शुल्क',
      'impact.calc_f3_desc': '१ टन CO₂e = १ क्रेडिट (₹८००)। क्रेडिट पर १०% मंच कमीशन व व्यापार पर २% मंच शुल्क।',

      // Empty State
      'impact.empty_title': 'कोई प्रभाव डेटा उपलब्ध नहीं',
      'impact.empty_desc': 'अभी तक कोई सौदा या सक्रिय मैच दर्ज नहीं हुआ है। प्रभाव देखने के लिए मैच पोर्टल में सौदे बुक करें या नमूना डेटा लोड करें।',
      'impact.empty_btn': 'मैच पोर्टल पर जाएं',

      // === Features Expansion (Clusters, Logistics, Roadmap, Policy, Demo) ===
      'clusters.badge': 'स्मार्ट संग्रहण नेटवर्क',
      'clusters.best_industry': 'सर्वश्रेष्ठ खरीदार उद्योग',
      'clusters.covers_demand': 'उद्योग की मांग का {pct}% पूरा करता है',
      'clusters.empty_btn': 'डेमो डेटा लोड करें',
      'clusters.empty_desc': 'क्लस्टर बनाने के लिए ५० किमी के भीतर एक ही फसल अवशेष वाले कम से कम दो किसानों की आवश्यकता होती है। नमूना क्लस्टर देखने के लिए डेमो डेटा लोड करें।',
      'clusters.empty_title': 'अभी कोई किसान क्लस्टर नहीं बना है',
      'clusters.estimated_trucks': 'अनुमानित ट्रक',
      'clusters.from_hub': 'केंद्र से',
      'clusters.highest_ask': 'अधिकतम किसान मांग',
      'clusters.hub_center': 'मुख्य केंद्र',
      'clusters.hub_label': 'संग्रहण केंद्र ज़िला',
      'clusters.industry_offer': 'उद्योग का प्रस्ताव',
      'clusters.members_title': 'सदस्य किसान',
      'clusters.no_industry': 'इस क्लस्टर की मात्रा के लिए अभी कोई खरीदार उद्योग नहीं मिला है।',
      'clusters.pickup_point': 'सुझावित पिकअप स्थल',
      'clusters.subtitle': 'औद्योगिक मांग को कुशलतापूर्वक पूरा करने के लिए ५० किमी के भीतर किसानों का सामूहिक संग्रहण।',
      'clusters.title': 'बायोमास एकत्रीकरण क्लस्टर',
      'clusters.total_volume': 'कुल एकत्रित मात्रा',
      'clusters.trucks_count': '{count} ट्रक',
      'clusters.trucks_unit': 'ट्रक (१० टन प्रति ट्रक)',
      'clusters.unclustered_note': '{count} किसानों का अभी कोई नजदीकी समूह नहीं है',
      'clusters.why_desc': 'छोटे किसान उद्योग के न्यूनतम ऑर्डर को पूरा करने के लिए अपनी फसल मात्रा को संयोजित करते हैं।',
      'clusters.why_title': 'क्लस्टर क्यों?',
      'coming_soon.alerts': 'एसएमएस और व्हाट्सएप सूचनाएं',
      'coming_soon.badge': 'शीघ्र आ रहा है',
      'coming_soon.map_view': 'मानचित्र दृश्य',
      'coming_soon.negotiation': 'मूल्य बातचीत',
      'coming_soon.otp_login': 'फोन ओटीपी लॉगिन',
      'coming_soon.quality_grades': 'गुणवत्ता ग्रेड',
      'coming_soon.subtitle': 'पराली व्यापार को सुगम, तेज और हर गांव तक पहुंचाने के लिए विकसित की जा रही नई सुविधाएं।',
      'coming_soon.title': 'प्लेटफॉर्म रोडमैप व आगामी सुविधाएं',
      'coming_soon.upi_payment': 'यूपीआई भुगतान',
      'coming_soon.voice_input': 'ध्वनि इनपुट',
      'demo.load_btn': 'डेमो मोड',
      'demo.loaded_success': 'डेमो डेटा सफलतापूर्वक लोड किया गया!',
      'demo.reset_btn': 'डेमो रीसेट',
      'demo.reset_success': 'डेमो डेटा हटा दिया गया। आपकी प्रविष्टियां सुरक्षित हैं।',
      'logistics.advance_status': 'स्थिति आगे बढ़ाएं',
      'logistics.estimated_trucks': 'अनुमानित ट्रक',
      'logistics.mock_payment': 'नकली भुगतान (केवल डेमो)',
      'logistics.payment_note': 'पराली पिकअप पर नकली भुगतान सिमुलेशन।',
      'logistics.pickup_date': 'सुझावित पिकअप तिथि',
      'logistics.pickup_district': 'पिकअप ज़िला',
      'logistics.status_label': 'सौदे की स्थिति',
      'logistics.step_confirmed': 'पुष्टीकृत',
      'logistics.step_pending': 'लंबित',
      'logistics.step_picked_up': 'उठा लिया गया',
      'logistics.title': 'सौदा और लॉजिस्टिक्स विवरण',
      'logistics.trucks_unit': 'ट्रक (१० टन प्रति ट्रक)',
      'nav.clusters': 'क्लस्टर नेटवर्क',
      'policy.desc': 'फसल अवशेषों का स्थायी प्रबंधन करने वाले किसान सरकारी सहायता, पराली एकत्रीकरण सहयोग और कार्बन क्रेडिट के अवसरों के पात्र हो सकते हैं।',
      'policy.note': 'वर्तमान योजनाओं के लिए आधिकारिक स्रोतों की जांच करें।',
      'policy.title': 'सहायता योजनाएं एवं कार्बन क्रेडिट',
    },

    // ========================================================================
    // 3. Telugu (తెలుగు)
    // ========================================================================
    te: {
      'nav.brand': 'అగ్రిలింక్',
      'nav.tagline_short': 'పొగ నుండి స్థిరత్వానికి',
      'nav.home': 'హోమ్',
      'nav.how_it_works': 'ఎలా పనిచేస్తుంది',
      'nav.farmer_portal': 'రైతు పోర్టల్',
      'nav.industry_portal': 'పరిశ్రమ పోర్టల్',
      'nav.matches': 'మ్యాచ్‌లు',
      'nav.impact': 'ప్రభావం',
      'nav.select_lang': 'భాష',

      'hero.badge': 'బయోమాస్ సర్క్యులర్ చొరవ',
      'hero.tagline': 'పొగ నుండి స్థిరత్వానికి',
      'hero.description': 'రైతులకు వ్యవసాయ వ్యర్థాల నుండి అదనపు ఆదాయం కల్పిస్తూ, పరిశ్రమలకు శుద్ధమైన ఇంధనాన్ని అందించడం. పొలాల్లో వ్యర్థాలు తగులబెట్టడం ఆపుదాం, నేలను కాపాడుకుందాం.',
      'hero.btn_farmer_tag': 'రైతుల కోసం',
      'hero.btn_farmer_title': 'నేను రైతును',
      'hero.btn_farmer_sub': 'వ్యర్థాలను విక్రయించి ఆదాయం పొందండి',
      'hero.btn_industry_tag': 'పరిశ్రమల కోసం',
      'hero.btn_industry_title': 'నేను పరిశ్రమను',
      'hero.btn_industry_sub': 'హరిత బయోమాస్ కొనుగోలు చేయండి',
      'hero.trust_free': 'రైతులకు 100% ఉచితం',
      'hero.trust_pickup': 'పరిశ్రమలతో నేరుగా అనుసంధానం',
      'hero.trust_payment': 'పారదర్శకమైన గిట్టుబాటు ధర',

      'metrics.tonnes_val': '1,50,000+',
      'metrics.tonnes_label': 'టన్నుల వ్యర్థాల సద్వినియోగం',
      'metrics.tonnes_sub': 'పొలాల్లో మంటలు నివారించబడ్డాయి',
      'metrics.payout_val': '₹14.8 కోట్లు',
      'metrics.payout_label': 'రైతులకు అందిన ఆదాయం',
      'metrics.payout_sub': 'వ్యర్థాల విక్రయం ద్వారా లభించిన మొత్తం',
      'metrics.co2_val': '2,10,000',
      'metrics.co2_label': 'టన్నుల CO₂ ఉద్గారాల తగ్గింపు',
      'metrics.co2_sub': 'స్వచ్ఛమైన గాలిని అందించడంలో భాగస్వామ్యం',

      'workflow.tag': 'పరిష్కార చక్రం',
      'workflow.title': 'అగ్రిలింక్ ఎలా పనిచేస్తుంది',
      'workflow.desc': 'పంట కోత నుండి హరిత పరిశ్రమల వరకు సరళమైన డిజిటల్ వారధి.',
      'workflow.step1_title': '1. రైతు నమోదు',
      'workflow.step1_desc': 'రైతులు తమ పంట వ్యర్థాల వివరాలు (వరి, గోధుమ, చెరకు, పత్తి), పరిమాణం, ఆశించే ధర నమోదు చేస్తారు.',
      'workflow.step2_title': '2. సరైన కొనుగోలుదారుల అనుసంధానం',
      'workflow.step2_desc': 'అగ్రిలింక్ స్థానిక పరిశ్రమలతో రైతును అనుసంధానించి రవాణా ఖర్చులు తగ్గిస్తుంది.',
      'workflow.step3_title': '3. స్వచ్ఛమైన ఇంధనంగా మార్పిడి',
      'workflow.step3_desc': 'సేకరించిన వ్యర్థాలను బయో-పెల్లెట్లు, బయో-సీఎన్‌జీ మరియు కాగితపు గుజ్జుగా మారుస్తారు.',

      'portals.farmer_badge': 'అన్నదాతలు & రైతులు',
      'portals.farmer_title': 'రైతులకు ప్రయోజనాలు',
      'portals.farmer_desc': 'పొలం శుభ్రం చేసుకునే ఖర్చులు తగ్గిస్తూ, జరిమానాలు లేకుండా ఎకరానికి హామీ ఆదాయం పొందండి.',
      'portals.farmer_f1': 'ఉచిత నమోదు: ధృవీకరించబడిన కొనుగోలుదారులతో నేరుగా సంబంధం',
      'portals.farmer_f2': 'మీరే నిర్ణయించుకునే పారదర్శక టన్ను ధర',
      'portals.farmer_f3': 'భూమిని కాల్చకపోవడం వల్ల నేల సారం రక్షించబడుతుంది',
      'portals.farmer_cta': 'రైతు పోర్టల్‌కు వెళ్లండి',

      'portals.industry_badge': 'వాణిజ్య & బయో-శక్తి',
      'portals.industry_title': 'పరిశ్రమల సేకరణ',
      'portals.industry_desc': 'థర్మల్ విద్యుత్ కేంద్రాలు, బయో-రిఫైనరీలకు నాణ్యమైన బయోమాస్ నిరంతర సరఫరా.',
      'portals.industry_f1': 'మీ ప్లాంట్‌కు సమీప జిల్లాల నుండి స్థానిక సేకరణ',
      'portals.industry_f2': 'రైతు గ్రూపులతో నేరుగా సంబంధాలు',
      'portals.industry_f3': 'కార్బన్ క్రెడిట్స్ మరియు ESG నిబంధనల అమలు',
      'portals.industry_cta': 'పరిశ్రమ పోర్టల్‌కు వెళ్లండి',

      'footer.mission': 'వ్యవసాయ వ్యర్థాల దహనాన్ని నిర్మూలించి రైతులకు ఆదాయం, పరిశ్రమలకు స్వచ్ఛమైన శక్తిని సమకూర్చడమే అగ్రిలింక్ లక్ష్యం.',
      'footer.quick_links': 'పోర్టల్స్',
      'footer.resources': 'వేదిక',
      'footer.about_us': 'మా గురించి',
      'footer.contact': 'కిసాన్ హెల్ప్‌లైన్ (టోల్-ఫ్రీ)',
      'footer.privacy': 'గోప్యతా విధానం',
      'footer.terms': 'నిబంధనలు & షరతులు',
      'footer.rights': 'సర్వహక్కులు ప్రత్యేకించబడ్డాయి. పొగను స్థిరమైన శక్తిగా మారుస్తున్నాము.',

      // Farmer Portal Page & Form
      'farmer_page.badge': 'రైతు మార్కెట్',
      'farmer_page.title': 'పంట వ్యర్థాలను నమోదు చేయండి',
      'farmer_page.subtitle': 'ధృవీకరించబడిన పరిశ్రమల కొనుగోలుదారులతో నేరుగా అనుసంధానం అవ్వండి. ప్రతి టన్నుకు మీ ధర నిర్ణయించి తగులబెట్టకుండా విక్రయించండి.',
      'farmer_page.notice': 'అగ్రిలింక్ రైతులను పరిశ్రమలతో నేరుగా కలుపుతుంది. నమోదుకు ఎటువంటి రుసుము ఉండదు.',
      'farmer_page.card_title': '🌾 పంట వ్యర్థాల నమోదు ఫారమ్',
      'farmer_page.card_sub': 'మీ జిల్లాలోని కొనుగోలుదారులను కనుగొనడానికి వివరాలను నమోదు చేయండి.',

      // Industry Portal Page & Form
      'industry_page.badge': 'పరిశ్రమ సేకరణ',
      'industry_page.title': 'సుస్థిర బయోమాస్ కొనుగోలు',
      'industry_page.subtitle': 'జీవ ఇంధనం, పేపర్ మిల్లులు, కంపోస్ట్ కోసం మీ సమీప జిల్లాల రైతుల నుండి నేరుగా వ్యవసాయ వ్యర్థాలను సేకరించండి.',
      'industry_page.notice': 'అగ్రిలింక్ పరిశ్రమలను స్థానిక రైతులతో అనుసంధానం చేస్తుంది.',
      'industry_page.card_title': '🏭 బయోమాస్ అవసరాల నమోదు ఫారమ్',
      'industry_page.card_sub': 'మీకు అవసరమైన పరిమాణం, రకం మరియు ప్రాధాన్య జిల్లా వివరాలను తెలపండి.',

      // Form Field Labels
      'form.name': 'పూర్తి పేరు',
      'form.phone': 'ఫోన్ నంబర్ (10 అంకెలు)',
      'form.residue_type': 'వ్యర్థాల రకం',
      'form.quantity_tons': 'పరిమాణం (టన్నుల్లో)',
      'form.state': 'రాష్ట్రం',
      'form.district': 'జిల్లా',
      'form.village': 'గ్రామం',
      'form.expected_price': 'ఆశించే ధర / టన్నుకు (₹)',

      'form.industry_name': 'పరిశ్రమ / కంపెనీ పేరు',
      'form.contact_phone': 'సంప్రదింపు ఫోన్ (10 అంకెలు)',
      'form.industry_type': 'పరిశ్రమ రకం',
      'form.required_residue': 'కావలసిన వ్యర్థాల రకం',
      'form.quantity_needed': 'కావలసిన పరిమాణం (టన్నుల్లో)',
      'form.preferred_state': 'ప్రాధాన్య రాష్ట్రం',
      'form.preferred_district': 'ప్రాధాన్య జిల్లా',
      'form.offered_price': 'చెల్లించే ధర / టన్నుకు (₹)',

      // Placeholders
      'placeholder.name': 'ఉదా. రమేష్ నాయుడు',
      'placeholder.phone': 'ఉదా. 9876543210',
      'placeholder.quantity': 'ఉదా. 25',
      'placeholder.village': 'ఉదా. రామాపురం',
      'placeholder.expected_price': 'ఉదా. 2200',
      'placeholder.industry_name': 'ఉదా. గ్రీన్‌బయో ఫ్యూయల్ ఎనర్జీ',
      'placeholder.quantity_needed': 'ఉదా. 500',
      'placeholder.offered_price': 'ఉదా. 2400',

      // Dropdown Options
      'residue.select': '-- వ్యర్థాల రకాన్ని ఎంచుకోండి --',
      'residue.paddy_straw': 'వరి గడ్డి (Paddy Straw)',
      'residue.wheat_straw': 'గోధుమ గడ్డి (Wheat Straw)',
      'residue.sugarcane_bagasse': 'చెరకు పిప్పి (Sugarcane Bagasse)',
      'residue.maize_stalk': 'మొక్కజొన్న వ్యర్థాలు (Maize Stalk)',
      'residue.cotton_stalk': 'పత్తి కట్టెలు (Cotton Stalk)',
      'residue.any': 'ఏ రకమైనా / అన్ని రకాలు',

      'industry_type.select': '-- పరిశ్రమ రకాన్ని ఎంచుకోండి --',
      'industry_type.biofuel': 'బయోఫ్యూయల్ & శక్తి (Biofuel)',
      'industry_type.paper_mill': 'పేపర్ మిల్లు (Paper Mill)',
      'industry_type.compost': 'కంపోస్ట్ & ఎరువులు (Compost)',
      'industry_type.packaging': 'పర్యావరణ అనుకూల ప్యాకేజింగ్ (Packaging)',

      'state.select': '-- రాష్ట్రాన్ని ఎంచుకోండి --',
      'district.select': '-- జిల్లాను ఎంచుకోండి --',
      'district.select_state_first': '-- మొదట రాష్ట్రాన్ని ఎంచుకోండి --',

      // States
      'state.punjab': 'పంజాబ్ (Punjab)',
      'state.haryana': 'హర్యానా (Haryana)',
      'state.uttar_pradesh': 'ఉత్తరప్రదేశ్ (Uttar Pradesh)',
      'state.andhra_pradesh': 'ఆంధ్రప్రదేశ్ (Andhra Pradesh)',
      'state.telangana': 'తెలంగాణ (Telangana)',
      'state.karnataka': 'కర్ణాటక (Karnataka)',
      'state.tamil_nadu': 'తమిళనాడు (Tamil Nadu)',
      'state.kerala': 'కేరళ (Kerala)',

      // Buttons & Feedback
      'form.submit_farmer': 'పంట వ్యర్థాలను నమోదు చేయండి',
      'form.submit_industry': 'అవసరాలను నమోదు చేయండి',
      'form.submitting': 'నమోదు అవుతోంది...',
      'form.success_farmer': 'వివరాలు విజయవంతంగా నమోదయ్యాయి! మీ జిల్లాలోని కొనుగోలుదారులను మీకు అనుసంధానిస్తాము.',
      'form.success_industry': 'మీ అవసరం విజయవంతంగా నమోదైంది! స్థానిక రైతులతో మిమ్మల్ని కలుపుతాము.',
      'form.footer_note': 'మీ సమాచారం కేవలం ధృవీకరించబడిన అగ్రిలింక్ భాగస్వాములతో మాత్రమే పంచుకోబడుతుంది.',
      'mock.badge': 'డెమో మోడ్ (మాక్ స్టోరేజ్)',

      // Validation Errors
      'error.required': 'ఈ సమాచారం తప్పనిసరి',
      'error.phone_invalid': 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి',
      'error.number_positive': 'దయచేసి 0 కంటే ఎక్కువైన సరైన పరిమాణాన్ని నమోదు చేయండి',
      'error.price_positive': 'దయచేసి 0 కంటే ఎక్కువైన సరైన ధరను నమోదు చేయండి',
      'error.select_option': 'దయచేసి జాబితా నుండి ఒక ఎంపికను ఎంచుకోండి',
      'error.server_unreachable': 'Unable to connect to the server. Please try again later.',
      'error.general': 'అనుకోని లోపం జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.',

      // Matches Portal Specific Keys
      'matches.badge': 'స్మార్ట్ మ్యాచింగ్ ఇంజిన్',
      'matches.title': 'బయోమాస్ ఒప్పందాలు & మ్యాచ్‌లు',
      'matches.subtitle': 'వ్యర్థాల రకం, దూరం, ధర మరియు పరిమాణం ఆధారంగా రైతులకు అనువైన పారిశ్రామిక కొనుగోలుదారుల అనుసంధానం.',
      'matches.count': 'అనువైన ఒప్పందాలు లభించాయి',
      'matches.load_demo': 'డెమో డేటా లోడ్ చేయండి',
      'matches.clear_data': 'డేటా తొలగించండి',
      'matches.sample_data': 'నమూనా డేటా',
      'matches.filter_residue': 'వ్యర్థాల రకం',
      'matches.filter_state': 'రాష్ట్రం',
      'matches.filter_max_price': 'గరిష్ట ధర / టన్నుకు (₹)',
      'matches.sort_by': 'క్రమబద్ధీకరించండి',
      'matches.sort_score': 'అత్యధిక మ్యాచ్ స్కోరు',
      'matches.sort_distance': 'సమీప దూరం',
      'matches.sort_price': 'తక్కువ ధర / టన్ను',
      'matches.all_residues': 'అన్ని రకాల వ్యర్థాలు',
      'matches.all_states': 'అన్ని రాష్ట్రాలు',
      'matches.col_farmer': 'రైతు',
      'matches.col_industry': 'పరిశ్రమ కొనుగోలుదారు',
      'matches.col_residue': 'వ్యర్థం',
      'matches.col_qty': 'పరిమాణం',
      'matches.col_distance': 'దూరం',
      'matches.col_farmer_ask': 'రైతు ఆశించిన ధర',
      'matches.col_industry_offer': 'కంపెనీ ఆఫర్',
      'matches.col_gap': 'ధర మార్జిన్',
      'matches.col_score': 'మ్యాచ్ స్కోరు',
      'matches.col_action': 'చర్య',
      'matches.book_btn': 'ఒప్పందం బుక్ చేయండి',
      'matches.booked': 'బుక్ చేయబడింది',
      'status.pending': 'నిర్ధారణ పెండింగ్‌లో ఉంది',
      'status.available': 'అందుబాటులో ఉంది',
      'matches.empty_title': 'మ్యాచ్‌లు కనుగొనబడలేదు',
      'matches.empty_desc': 'ప్రస్తుతం అనువైన ఒప్పందాలు ఏవీ లేవు. నమూనా మ్యాచ్‌లను చూడటానికి పైన "డెమో డేటా లోడ్ చేయండి" పై క్లిక్ చేయండి.',
      'matches.score_breakdown_title': 'మ్యాచ్ స్కోరు వివరాలు',
      'matches.score_tap_hint': 'పాయింట్ల వివరాలను చూడటానికి నొక్కండి',
      'matches.score_residue': 'వ్యర్థాల అనుకూలత',
      'matches.score_distance': 'భౌగోళిక దూరం',
      'matches.score_price': 'ధర అనుకూలత',
      'matches.score_quantity': 'పరిమాణ కవరేజ్',
      'matches.score_total': 'మొత్తం మ్యాచ్ స్కోరు',
      'matches.modal_title': 'ఒప్పందం బుకింగ్ నిర్ధారణ',
      'matches.modal_desc': 'ఈ రైతు మరియు పరిశ్రమ మధ్య ఒప్పంద ప్రతిపాదనను పంపండి. ఇరు పక్షాలకు నిర్ధారణ సమాచారం పంపబడుతుంది.',
      'matches.modal_confirm': 'బుకింగ్ నిర్ధారించండి',
      'matches.modal_cancel': 'రద్దు చేయండి',
      'matches.booking_success': 'బుకింగ్ విజయవంతంగా సృష్టించబడింది! స్థితి "నిర్ధారణ పెండింగ్" గా మార్చబడింది.',

      // Impact Dashboard Specific Keys
      'impact.badge': 'పర్యావరణ & ESG ప్రభావం',
      'impact.title': 'సుస్థిరత మరియు ఆర్థిక ప్రభావం',
      'impact.subtitle': 'నివారించిన కాలుష్యం, రైతుల ఆదాయం మరియు స్వచ్ఛమైన పారిశ్రామిక మార్పు యొక్క సమగ్ర నివేదిక.',
      'impact.sample_badge': 'నమూనా డేటా అమలులో ఉంది',
      'impact.toggle_booked': 'బుక్ చేసిన ఒప్పందాలు',
      'impact.toggle_potential': 'సంభావ్యత (మ్యాచ్‌ల నుండి)',
      'impact.mode_notice_booked': 'బుక్ చేసిన ట్రేడ్‌ల నుండి గణాంకాలు (డెమో, ఈ బ్రౌజర్‌లో నిల్వ చేయబడింది)',
      'impact.mode_notice_potential': 'అందుబాటులోని మ్యాచ్‌ల నుండి అంచనా వేసిన ప్రభావం (రైతుకు ఒకేసారి లెక్కింపు).',

      // Summary Cards
      'impact.card_farmer_earnings': 'రైతుల మొత్తం ఆదాయం',
      'impact.card_residue_diverted': 'కాలుష్య రహితంగా మళ్లించిన వ్యర్థాలు',
      'impact.card_co2_avoided': 'నివారించబడిన CO₂ ఉద్గారాలు',
      'impact.card_trees_equiv': 'చెట్ల పెంపకంతో సమానం',
      'impact.card_carbon_credits': 'సంభావ్య కార్బన్ క్రెడిట్స్ (అంచనా)',
      'impact.card_credit_value': 'క్రెడిట్స్ అంచనా విలువ',
      'impact.card_platform_fee': 'లావాదేవీలపై ప్లాట్‌ఫారమ్ రుసుము (2%)',
      'impact.card_brokerage_comm': 'క్రెడిట్స్‌పై ప్లాట్‌ఫారమ్ కమీషన్ (10%)',
      'impact.credit_verification_note': 'నిజమైన క్రెడిట్లకు థర్డ్ పార్టీ ధృవీకరణ తప్పనిసరి.',

      // Charts
      'impact.chart_earnings_title': 'రైతువారీ ఆదాయం (₹)',
      'impact.chart_industry_title': 'పరిశ్రమల బయోమాస్ డిమాండ్ (టన్నులు)',
      'impact.chart_residue_title': 'వ్యర్థాల రకం ప్రకారం పరిమాణం',
      'impact.chart_earnings_axis': 'ఆదాయం (₹)',
      'impact.chart_industry_axis': 'పరిమాణం (టన్నులు)',

      // Government View
      'impact.govt_title': 'ప్రభుత్వ & నియంత్రణ నివేదిక',
      'impact.govt_subtitle': 'సద్వినియోగం చేసుకున్న వ్యర్థాలు మరియు నివారించిన ఉద్గారాల అంచనా జిల్లా స్థాయి సారాంశం',
      'impact.govt_residue_utilised': 'సద్వినియోగమైన మొత్తం వ్యర్థాలు',
      'impact.govt_co2_saved': 'నికర CO₂ ఆదా',
      'impact.govt_districts_covered': 'పరిధిలోని జిల్లాలు',
      'impact.govt_unit_tons': 'టన్నులు',
      'impact.govt_unit_tonnes': 'టన్నుల CO₂e',
      'impact.govt_unit_districts': 'జిల్లాలు',

      // Methodology & Assumptions
      'impact.calc_title': 'గణన విధానం',
      'impact.calc_disclaimer': 'Estimated value used for demonstration; to be replaced with a verified emission factor.',
      'impact.calc_editable_label': 'ఉద్గార కారకం అంచనా (టన్నుకు నివారించిన CO₂ కిలోలు):',
      'impact.calc_reset_btn': 'సాధారణ విలువకు రీసెట్ చేయండి (1,460)',
      'impact.calc_f1_title': 'నివారించిన ఉద్గారాలు',
      'impact.calc_f1_desc': 'మళ్లించిన వ్యర్థాలు (టన్నులు) × ఉద్గార కారకం (కిలోలు/టన్ను) ÷ 1,000',
      'impact.calc_f2_title': 'చెట్ల శోషణ సమానత',
      'impact.calc_f2_desc': 'మొత్తం నివారించిన CO₂ (కిలోలు) ÷ చెట్టుకు సంవత్సరానికి 21 కిలోల CO₂ శోషణ',
      'impact.calc_f3_title': 'కార్బన్ క్రెడిట్స్ & ఫీజులు',
      'impact.calc_f3_desc': '1 టన్ను CO₂e = 1 క్రెడిట్ (₹800). క్రెడిట్స్‌పై 10% కమీషన్ మరియు వ్యర్థాల వ్యాపారంపై 2% ప్లాట్‌ఫారమ్ రుసుము.',

      // Empty State
      'impact.empty_title': 'ప్రభావ నివేదిక డేటా అందుబాటులో లేదు',
      'impact.empty_desc': 'ఇంకా ఎలాంటి ఒప్పందాలు లేదా మ్యాచ్‌లు నమోదు కాలేదు. ప్రభావ వివరాలను చూడటానికి మ్యాచ్‌ల పోర్టల్‌లో ఒప్పందాలు బుక్ చేయండి లేదా నమూనా డేటా లోడ్ చేయండి.',
      'impact.empty_btn': 'మ్యాచ్‌ల పోర్టల్‌కు వెళ్లండి',

      // === Features Expansion (Clusters, Logistics, Roadmap, Policy, Demo) ===
      'clusters.badge': 'స్మార్ట్ సేకరణ నెట్‌వర్క్',
      'clusters.best_industry': 'ఉత్తమ సరిపోలిక పరిశ్రమ',
      'clusters.covers_demand': 'పరిశ్రమ డిమాండ్‌లో {pct}% ని పూర్తి చేస్తుంది',
      'clusters.empty_btn': 'డెమో డేటాను లోడ్ చేయండి',
      'clusters.empty_desc': 'క్లస్టర్‌ను రూపొందించడానికి 50 కి.మీ పరిధిలో ఒకే వ్యర్థ రకం కలిగిన కనీసం ఇద్దరు రైతులు అవసరం. నమూనా క్లస్టర్ కోసం డెమో డేటాను లోడ్ చేయండి.',
      'clusters.empty_title': 'ఇంకా రైతు క్లస్టర్లు ఏర్పడలేదు',
      'clusters.estimated_trucks': 'అంచనా ట్రక్కులు',
      'clusters.from_hub': 'హబ్ నుండి',
      'clusters.highest_ask': 'రైతు అత్యధిక డిమాండ్',
      'clusters.hub_center': 'ప్రధాన హబ్',
      'clusters.hub_label': 'సేకరణ హబ్ జిల్లా',
      'clusters.industry_offer': 'పరిశ్రమ ప్రతిపాదన',
      'clusters.members_title': 'సభ్య రైతులు',
      'clusters.no_industry': 'ఈ క్లస్టర్ పరిమాణానికి సరిపోయే పరిశ్రమ కొనుగోలుదారు ఇంకా కనుగొనబడలేదు.',
      'clusters.pickup_point': 'సూచించిన పికప్ పాయింట్',
      'clusters.subtitle': 'పారిశ్రామిక ఆర్డర్లను సమర్థవంతంగా తీర్చడానికి 50 కి.మీ పరిధిలోని రైతులను ఉమ్మడి సేకరణ హబ్‌లుగా కలపడం.',
      'clusters.title': 'బయోమాస్ సేకరణ క్లస్టర్లు',
      'clusters.total_volume': 'మొత్తం సేకరించిన పరిమాణం',
      'clusters.trucks_count': '{count} ట్రక్కులు',
      'clusters.trucks_unit': 'ట్రక్కులు (ట్రక్కుకు 10 టన్నులు)',
      'clusters.unclustered_note': '{count} మంది రైతులకు ఇంకా సమీపంలో సమూహం లేదు',
      'clusters.why_desc': 'పరిశ్రమ యొక్క కనీస ఆర్డర్‌ను తీర్చడానికి చిన్న రైతులు తమ పరిమాణాన్ని కలుపుతారు.',
      'clusters.why_title': 'క్లస్టర్ ఎందుకు?',
      'coming_soon.alerts': 'ఎస్ఎంఎస్ మరియు వాట్సాప్ హెచ్చరికలు',
      'coming_soon.badge': 'త్వరలో రాబోతోంది',
      'coming_soon.map_view': 'మ్యాప్ వీక్షణ',
      'coming_soon.negotiation': 'ధర చర్చలు',
      'coming_soon.otp_login': 'ఫోన్ ఓటీపీ లాగిన్',
      'coming_soon.quality_grades': 'నాణ్యత గ్రేడ్లు',
      'coming_soon.subtitle': 'వ్యర్థాల వాణిజ్యాన్ని మరింత వేగవంతంగా మరియు ప్రతి గ్రామానికి చేర్చడానికి అభివృద్ధి చేయబడుతున్న సాధనాలు.',
      'coming_soon.title': 'ప్లాట్‌ఫారమ్ రోడ్‌మ్యాప్ & రాబోయే ఫీచర్లు',
      'coming_soon.upi_payment': 'యూపీఐ చెల్లింపు',
      'coming_soon.voice_input': 'వాయిస్ ఇన్‌పుట్',
      'demo.load_btn': 'డెమో మోడ్',
      'demo.loaded_success': 'డెమో డేటా విజయవంతంగా లోడ్ చేయబడింది!',
      'demo.reset_btn': 'డెమో రీసెట్',
      'demo.reset_success': 'డెమో రికార్డులు తొలగించబడ్డాయి. మీ సమర్పణలు భద్రంగా ఉన్నాయి.',
      'logistics.advance_status': 'స్థితిని ముందుకు తీసుకెళ్లండి',
      'logistics.estimated_trucks': 'అంచనా ట్రక్కులు',
      'logistics.mock_payment': 'మాక్ చెల్లింపు (డెమో మాత్రమే)',
      'logistics.payment_note': 'వ్యర్థాల పికప్ సమయంలో కల్పిత చెల్లింపు ప్రక్రియ.',
      'logistics.pickup_date': 'సూచించిన పికప్ తేదీ',
      'logistics.pickup_district': 'పికప్ జిల్లా',
      'logistics.status_label': 'డీల్ స్థితి',
      'logistics.step_confirmed': 'ధృవీకరించబడింది',
      'logistics.step_pending': 'పెండింగ్‌లో ఉంది',
      'logistics.step_picked_up': 'తీసుకువెళ్లబడింది',
      'logistics.title': 'డీల్ మరియు లాజిస్టిక్స్ వివరాలు',
      'logistics.trucks_unit': 'ట్రక్కులు (ట్రక్కుకు 10 టన్నులు)',
      'nav.clusters': 'క్లస్టర్లు',
      'policy.desc': 'స్థిరమైన పంట వ్యర్థాల నిర్వహణను అవలంబించే రైతులు వర్తించే ప్రభుత్వ సహాయం, వ్యర్థాల సేకరణ మద్దతు మరియు కార్బన్ క్రెడిట్ అవకాశాలకు అర్హులు కావచ్చు.',
      'policy.note': 'ప్రస్తుత పథకాల కోసం అధికారిక వనరులను తనిఖీ చేయండి.',
      'policy.title': 'మద్దతు పథకాలు మరియు కార్బన్ క్రెడిట్స్',
    },

    // ========================================================================
    // 4. Kannada (ಕನ್ನಡ)
    // ========================================================================
    kn: {
      'nav.brand': 'ಅಗ್ರಿಲಿಂಕ್',
      'nav.tagline_short': 'ಹೊಗೆಯಿಂದ ಸುಸ್ಥಿರತೆಗೆ',
      'nav.home': 'ಮುಖಪುಟ',
      'nav.how_it_works': 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',
      'nav.farmer_portal': 'ರೈತ ಪೋರ್ಟಲ್',
      'nav.industry_portal': 'ಕೈಗಾರಿಕಾ ಪೋರ್ಟಲ್',
      'nav.matches': 'ಹೊಂದಾಣಿಕೆಗಳು',
      'nav.impact': 'ಪರಿಣಾಮ',
      'nav.select_lang': 'ಭಾಷೆ',

      'hero.badge': 'ಬಯೋಮಾಸ್ ಸುಸ್ಥಿರ ಉಪಕ್ರಮ',
      'hero.tagline': 'ಹೊಗೆಯಿಂದ ಸುಸ್ಥಿರತೆಗೆ',
      'hero.description': 'ಬೆಳೆ ತ್ಯಾಜ್ಯವನ್ನು ನಿಶ್ಚಿತ ಆದಾಯ ಹಾಗೂ ಶುದ್ಧ ಕೈಗಾರಿಕಾ ಇಂಧನವನ್ನಾಗಿ ಪರಿವರ್ತಿಸಿ. ಕಳೆ ಸುಡುವಿಕೆಗೆ ವಿದಾಯ ಹೇಳಿ, ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಕಾಪಾಡಿ ಮತ್ತು ಶುದ್ಧ ಗಾಳಿ ಉಸಿರಾಡಿ.',
      'hero.btn_farmer_tag': 'ರೈತರಿಗಾಗಿ',
      'hero.btn_farmer_title': 'ನಾನು ರೈತ',
      'hero.btn_farmer_sub': 'ಬೆಳೆ ತ್ಯಾಜ್ಯ ಮಾರಿ ಆದಾಯ ಗಳಿಸಿ',
      'hero.btn_industry_tag': 'ಉದ್ಯಮಿಗಳಿಗಾಗಿ',
      'hero.btn_industry_title': 'ನಾನು ಉದ್ಯಮಿ',
      'hero.btn_industry_sub': 'ಹಸಿರು ಬಯೋಮಾಸ್ ಖರೀದಿಸಿ',
      'hero.trust_free': 'ರೈತರಿಗೆ 100% ಉಚಿತ ಸೇವೆ',
      'hero.trust_pickup': 'ಕೈಗಾರಿಕೆಗಳೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ',
      'hero.trust_payment': 'ಪಾರದರ್ಶಕ ಹಾಗೂ ನ್ಯಾಯಯುತ ಬೆಲೆ',

      'metrics.tonnes_val': '೧,೫೦,೦೦೦+',
      'metrics.tonnes_label': 'ಟನ್ ಬೆಳೆ ತ್ಯಾಜ್ಯ ಸದ್ಬಳಕೆ',
      'metrics.tonnes_sub': 'ಹೊಲಗಳಲ್ಲಿ ಬೆಂಕಿ ಇಡುವುದನ್ನು ತಡೆಯಲಾಗಿದೆ',
      'metrics.payout_val': '₹೧೪.೮ ಕೋಟಿ',
      'metrics.payout_label': 'ರೈತರಿಗೆ ದೊರೆತ ಆದಾಯ',
      'metrics.payout_sub': 'ತ್ಯಾಜ್ಯ ಮಾರಾಟದಿಂದ ಗಳಿಸಿದ ಹಣ',
      'metrics.co2_val': '೨,೧೦,೦೦೦',
      'metrics.co2_label': 'ಟನ್ ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ ಕಡಿತ',
      'metrics.co2_sub': 'ಲಕ್ಷಾಂತರ ಜನರಿಗೆ ಶುದ್ಧ ಗಾಳಿ ಲಭ್ಯ',

      'workflow.tag': 'ಪರಿಹಾರ ಚಕ್ರ',
      'workflow.title': 'ಅಗ್ರಿಲಿಂಕ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
      'workflow.desc': 'ಬೆಳೆ ಕಟಾವಿನಿಂದ ಹಿಡಿದು ಹಸಿರು ಇಂಧನದವರೆಗೆ ಸರಳ ಡಿಜಿಟಲ್ ಸಂಪರ್ಕ.',
      'workflow.step1_title': '೧. ರೈತರ ನೋಂದಣಿ',
      'workflow.step1_desc': 'ರೈತರು ಬೆಳೆ ತ್ಯಾಜ್ಯದ ವಿವರ (ಭತ್ತ, ಗೋಧಿ, ಕಬ್ಬು, ಹತ್ತಿ), ಪ್ರಮಾಣ ಹಾಗೂ ನಿರೀಕ್ಷಿತ ಬೆಲೆಯನ್ನು ನಮೂದಿಸುತ್ತಾರೆ.',
      'workflow.step2_title': '೨. ಖರೀದಿದಾರರ ಹೊಂದಾಣಿಕೆ',
      'workflow.step2_desc': 'ಅಗ್ರಿಲಿಂಕ್ ನಿಮ್ಮ ಜಿಲ್ಲೆಯ ಕೈಗಾರಿಕೆಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ ಸಾಗಾಟ ವೆಚ್ಚ ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.',
      'workflow.step3_title': '೩. ಶುದ್ಧ ಇಂಧನವಾಗಿ ಪರಿವರ್ತನೆ',
      'workflow.step3_desc': 'ಕಲ್ಲಿದ್ದಲಿನ ಬದಲು ಬೆಳೆ ತ್ಯಾಜ್ಯವನ್ನು ಪೆಲೆಟ್ಸ್ ಮತ್ತು ಬಯೋ-ಸಿಎನ್‌ಜಿ ರೂಪದಲ್ಲಿ ಬಳಸಲಾಗುತ್ತದೆ.',

      'portals.farmer_badge': 'ರೈತರು & ಬೆಳೆಗಾರರು',
      'portals.farmer_title': 'ರೈತರಿಗೆ ದೊರೆಯುವ ಲಾಭಗಳು',
      'portals.farmer_desc': 'ಹೊಲ ಸ್ವಚ್ಛಗೊಳಿಸುವ ವೆಚ್ಚ ಉಳಿಸಿ, ದಂಡದಿಂದ ಪಾರಾಗಿ ಹಾಗೂ ಪ್ರತಿ ಎಕರೆಗೆ ಖಚಿತ ಆದಾಯ ಪಡೆಯಿರಿ.',
      'portals.farmer_f1': 'ಶೂನ್ಯ ನೋಂದಣಿ ಶುಲ್ಕ: ನೇರ ಪರಿಶೀಲಿತ ಖರೀದಿದಾರರ ಸಂಪರ್ಕ',
      'portals.farmer_f2': 'ನೀವೇ ನಿಗದಿಪಡಿಸುವ ಪಾರದರ್ಶಕ ಟನ್ ದರ',
      'portals.farmer_f3': 'ಬೆಂಕಿ ಹಚ್ಚದಿರುವುದರಿಂದ ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ರಕ್ಷಣೆ',
      'portals.farmer_cta': 'ರೈತ ಪೋರ್ಟಲ್‌ಗೆ ಹೋಗಿ',

      'portals.industry_badge': 'ಕೈಗಾರಿಕೆ & ಬಯೋ-ಇಂಧನ',
      'portals.industry_title': 'ಕೈಗಾರಿಕಾ ಖರೀದಿ',
      'portals.industry_desc': 'ಥರ್ಮಲ್ ಪವರ್ ಪ್ಲಾಂಟ್ ಮತ್ತು ಕಾರ್ಖಾನೆಗಳಿಗೆ ಗುಣಮಟ್ಟದ ಬಯೋಮಾಸ್ ನಿರಂತರ ಪೂರೈಕೆ.',
      'portals.industry_f1': 'ನಿಮ್ಮ ಘಟಕದ ಸಮೀಪದ ಜಿಲ್ಲೆಗಳಿಂದ ಸ್ಥಳೀಯ ಖರೀದಿ',
      'portals.industry_f2': 'ರೈತ ಸಮೂಹಗಳೊಂದಿಗೆ ನೇರ ಒಡಂಬಡಿಕೆ',
      'portals.industry_f3': 'ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್ಸ್ ಮತ್ತು ESG ನಿಯಮಗಳ ಅನುಸರಣೆ',
      'portals.industry_cta': 'ಕೈಗಾರಿಕಾ ಪೋರ್ಟಲ್‌ಗೆ ಹೋಗಿ',

      'footer.mission': 'ಭಾರತದಾದ್ಯಂತ ಬೆಳೆ ಸುಡುವಿಕೆಯನ್ನು ತಡೆದು, ರೈತರು ಮತ್ತು ಕೈಗಾರಿಕೆಗಳನ್ನು ನೇರವಾಗಿ ಬೆಸೆಯುವುದೇ ಅಗ್ರಿಲಿಂಕ್ ಗುರಿ.',
      'footer.quick_links': 'ತ್ವರಿತ ಪೋರ್ಟಲ್‌ಗಳು',
      'footer.resources': 'ವೇದಿಕೆ',
      'footer.about_us': 'ನಮ್ಮ ಬಗ್ಗೆ',
      'footer.contact': 'ಕಿಸಾನ್ ಸಹಾಯವಾಣಿ (ಟೋಲ್-ಫ್ರೀ)',
      'footer.privacy': 'ಗೌಪ್ಯತಾ ನೀತಿ',
      'footer.terms': 'ಸೇವಾ ನಿಯಮಗಳು',
      'footer.rights': 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ಹೊಗೆಯನ್ನು ಸುಸ್ಥಿರ ಇಂಧನವಾಗಿ ಪರಿವರ್ತಿಸುವ ಪಯಣ.',

      // Farmer Portal Page & Form
      'farmer_page.badge': 'ರೈತ ಮಾರುಕಟ್ಟೆ',
      'farmer_page.title': 'ನಿಮ್ಮ ಬೆಳೆ ತ್ಯಾಜ್ಯವನ್ನು ನೋಂದಾಯಿಸಿ',
      'farmer_page.subtitle': 'ಪರಿಶೀಲಿಸಿದ ಕೈಗಾರಿಕಾ ಖರೀದಿದಾರರೊಂದಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕ ಸಾಧಿಸಿ. ಪ್ರತಿ ಟನ್‌ಗೆ ನಿಮ್ಮ ನಿರೀಕ್ಷಿತ ಬೆಲೆ ನಿಗದಿಪಡಿಸಿ ಸುಡದೆ ಮಾರಾಟ ಮಾಡಿ.',
      'farmer_page.notice': 'ಅಗ್ರಿಲಿಂಕ್ ರೈತರನ್ನು ಕೈಗಾರಿಕೆಗಳೊಂದಿಗೆ ನೇರವಾಗಿ ಜೋಡಿಸುತ್ತದೆ. ಯಾವುದೇ ನೋಂದಣಿ ಶುಲ್ಕವಿಲ್ಲ.',
      'farmer_page.card_title': '🌾 ಬೆಳೆ ತ್ಯಾಜ್ಯ ನೋಂದಣಿ ಫಾರ್ಮ್',
      'farmer_page.card_sub': 'ನಿಮ್ಮ ಜಿಲ್ಲೆಯ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಲು ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.',

      // Industry Portal Page & Form
      'industry_page.badge': 'ಕೈಗಾರಿಕಾ ಖರೀದಿ',
      'industry_page.title': 'ಸುಸ್ಥಿರ ಬಯೋಮಾಸ್ ಖರೀದಿ',
      'industry_page.subtitle': 'ಜೈವಿಕ ಇಂಧನ, ಪೇಪರ್ ಮಿಲ್, ಗೊಬ್ಬರ ಹಾಗೂ ಪ್ಯಾಕೇಜಿಂಗ್‌ಗಾಗಿ ನಿಮ್ಮ ನೆರೆಹೊರೆಯ ಜಿಲ್ಲೆಗಳ ರೈತರಿಂದ ನೇರವಾಗಿ ಬಯೋಮಾಸ್ ಖರೀದಿಸಿ.',
      'industry_page.notice': 'ಅಗ್ರಿಲಿಂಕ್ ಕೈಗಾರಿಕೆಗಳನ್ನು ಸ್ಥಳೀಯ ರೈತರೊಂದಿಗೆ ಹೊಂದಿಸುತ್ತದೆ.',
      'industry_page.card_title': '🏭 ಬಯೋಮಾಸ್ ಅವಶ್ಯಕತೆ ನೋಂದಣಿ ಫಾರ್ಮ್',
      'industry_page.card_sub': 'ನಿಮಗೆ ಬೇಕಾದ ಪ್ರಮಾಣ, ತ್ಯಾಜ್ಯದ ವಿಧ ಹಾಗೂ ಆದ್ಯತೆಯ ಜಿಲ್ಲೆಯನ್ನು ನಮೂದಿಸಿ.',

      // Form Field Labels
      'form.name': 'ಪೂರ್ಣ ಹೆಸರು',
      'form.phone': 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ (೧೦ ಅಂಕಿಗಳು)',
      'form.residue_type': 'ತ್ಯಾಜ್ಯದ ವಿಧ',
      'form.quantity_tons': 'ಪ್ರಮಾಣ (ಟನ್‌ಗಳಲ್ಲಿ)',
      'form.state': 'ರಾಜ್ಯ',
      'form.district': 'ಜಿಲ್ಲೆ',
      'form.village': 'ಗ್ರಾಮ',
      'form.expected_price': 'ನಿರೀಕ್ಷಿತ ಬೆಲೆ / ಟನ್‌ಗೆ (₹)',

      'form.industry_name': 'ಕೈಗಾರಿಕೆ / ಕಂಪನಿಯ ಹೆಸರು',
      'form.contact_phone': 'ಸಂಪರ್ಕ ದೂರವಾಣಿ (೧೦ ಅಂಕಿಗಳು)',
      'form.industry_type': 'ಕೈಗಾರಿಕೆಯ ವಿಧ',
      'form.required_residue': 'ಅಗತ್ಯವಿರುವ ತ್ಯಾಜ್ಯದ ವಿಧ',
      'form.quantity_needed': 'ಬೇಕಾದ ಪ್ರಮಾಣ (ಟನ್‌ಗಳಲ್ಲಿ)',
      'form.preferred_state': 'ಆದ್ಯತೆಯ ರಾಜ್ಯ',
      'form.preferred_district': 'ಆದ್ಯತೆಯ ಜಿಲ್ಲೆ',
      'form.offered_price': 'ನೀಡುವ ಬೆಲೆ / ಟನ್‌ಗೆ (₹)',

      // Placeholders
      'placeholder.name': 'ಉದಾ. ಬಸವರಾಜ್ ಪಾಟೀಲ್',
      'placeholder.phone': 'ಉದಾ. 9876543210',
      'placeholder.quantity': 'ಉದಾ. 25',
      'placeholder.village': 'ಉದಾ. ಹಿರೇಕೆರೂರು',
      'placeholder.expected_price': 'ಉದಾ. 2200',
      'placeholder.industry_name': 'ಉದಾ. ಗ್ರೀನ್‌ಬಯೋ ಫ್ಯೂಯಲ್ ಲಿ.',
      'placeholder.quantity_needed': 'ಉದಾ. 500',
      'placeholder.offered_price': 'ಉದಾ. 2400',

      // Dropdown Options
      'residue.select': '-- ತ್ಯಾಜ್ಯದ ವಿಧವನ್ನು ಆರಿಸಿ --',
      'residue.paddy_straw': 'ಭತ್ತದ ಹುಲ್ಲು (Paddy Straw)',
      'residue.wheat_straw': 'ಗೋಧಿ ಹುಲ್ಲು (Wheat Straw)',
      'residue.sugarcane_bagasse': 'ಕಬ್ಬಿನ ಸಿಪ್ಪೆ (Sugarcane Bagasse)',
      'residue.maize_stalk': 'ಮೆಕ್ಕೆಜೋಳದ ದಂಟು (Maize Stalk)',
      'residue.cotton_stalk': 'ಹತ್ತಿ ಕಡ್ಡಿ (Cotton Stalk)',
      'residue.any': 'ಯಾವುದೇ ವಿಧ / ಎಲ್ಲಾ ವಿಧಗಳು',

      'industry_type.select': '-- ಕೈಗಾರಿಕೆಯ ವಿಧ ಆರಿಸಿ --',
      'industry_type.biofuel': 'ಜೈವಿಕ ಇಂಧನ (Biofuel)',
      'industry_type.paper_mill': 'ಪೇಪರ್ ಮಿಲ್ (Paper Mill)',
      'industry_type.compost': 'ಕಾಂಪೋಸ್ಟ್ ಗೊಬ್ಬರ (Compost)',
      'industry_type.packaging': 'ಪರಿಸರಸ್ನೇಹಿ ಪ್ಯಾಕೇಜಿಂಗ್ (Packaging)',

      'state.select': '-- ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ --',
      'district.select': '-- ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ --',
      'district.select_state_first': '-- ಮೊದಲು ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ --',

      // States
      'state.punjab': 'ಪಂಜಾಬ್ (Punjab)',
      'state.haryana': 'ಹರಿಯಾಣ (Haryana)',
      'state.uttar_pradesh': 'ಉತ್ತರ ಪ್ರದೇಶ (Uttar Pradesh)',
      'state.andhra_pradesh': 'ಆಂಧ್ರಪ್ರದೇಶ (Andhra Pradesh)',
      'state.telangana': 'ತೆಲಂಗಾಣ (Telangana)',
      'state.karnataka': 'ಕರ್ನಾಟಕ (Karnataka)',
      'state.tamil_nadu': 'ತಮಿಳುನಾಡು (Tamil Nadu)',
      'state.kerala': 'ಕೇರಳ (Kerala)',

      // Buttons & Feedback
      'form.submit_farmer': 'ಬೆಳೆ ತ್ಯಾಜ್ಯ ನೋಂದಾಯಿಸಿ',
      'form.submit_industry': 'ಅವಶ್ಯಕತೆ ಸಲ್ಲಿಸಿ',
      'form.submitting': 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...',
      'form.success_farmer': 'ವಿವರಗಳು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿವೆ! ನಿಮ್ಮ ಜಿಲ್ಲೆಯ ಖರೀದಿದಾರರೊಂದಿಗೆ ನಾವು ಸಂಪರ್ಕ ಕಲ್ಪಿಸುತ್ತೇವೆ.',
      'form.success_industry': 'ನಿಮ್ಮ ಬೇಡಿಕೆ ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಾಗಿದೆ! ಸ್ಥಳೀಯ ರೈತರೊಂದಿಗೆ ನಿಮ್ಮನ್ನು ಬೆಸೆಯುತ್ತೇವೆ.',
      'form.footer_note': 'ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಕೇವಲ ಪರಿಶೀಲಿತ ಅಗ್ರಿಲಿಂಕ್ ಪಾಲುದಾರರೊಂದಿಗೆ ಮಾತ್ರ ಹಂಚಿಕೊಳ್ಳಲಾಗುತ್ತದೆ.',
      'mock.badge': 'ಡೆಮೊ ಮೋಡ್ (ಮಾಕ್ ಸಂಗ್ರಹ)',

      // Validation Errors
      'error.required': 'ಈ ಮಾಹಿತಿ ಕಡ್ಡಾಯವಾಗಿದೆ',
      'error.phone_invalid': 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ೧೦ ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ',
      'error.number_positive': 'ದಯವಿಟ್ಟು ೦ ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಮಾನ್ಯ ಪ್ರಮಾಣ ನಮೂದಿಸಿ',
      'error.price_positive': 'ದಯವಿಟ್ಟು ೦ ಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ಮಾನ್ಯ ಬೆಲೆ ನಮೂದಿಸಿ',
      'error.select_option': 'ದಯವಿಟ್ಟು ಪಟ್ಟಿಯಿಂದ ಒಂದು ಆಯ್ಕೆಯನ್ನು ಆರಿಸಿ',
      'error.server_unreachable': 'Unable to connect to the server. Please try again later.',
      'error.general': 'ಅನಿರೀಕ್ಷಿತ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',

      // Matches Portal Specific Keys
      'matches.badge': 'ಸ್ಮಾರ್ಟ್ ಮ್ಯಾಚಿಂಗ್ ಇಂಜಿನ್',
      'matches.title': 'ಬಯೋಮಾಸ್ ಒಪ್ಪಂದಗಳು & ಹೊಂದಾಣಿಕೆಗಳು',
      'matches.subtitle': 'ಬೆಳೆ ತ್ಯಾಜ್ಯದ ವಿಧ, ದೂರ, ಬೆಲೆ ಹಾಗೂ ಪ್ರಮಾಣದ ಆಧಾರದ ಮೇಲೆ ರೈತರು ಮತ್ತು ಕೈಗಾರಿಕೆಗಳ ನಿಖರ ಹೊಂದಾಣಿಕೆ.',
      'matches.count': 'ಹೊಂದಾಣಿಕೆಯ ಒಪ್ಪಂದಗಳು ಲಭ್ಯ',
      'matches.load_demo': 'ಡೆಮೊ ಡೇಟಾ ಲೋಡ್ ಮಾಡಿ',
      'matches.clear_data': 'ಡೇಟಾ ತೆರವುಗೊಳಿಸಿ',
      'matches.sample_data': 'ಮಾದರಿ ಡೇಟಾ',
      'matches.filter_residue': 'ತ್ಯಾಜ್ಯದ ವಿಧ',
      'matches.filter_state': 'ರಾಜ್ಯ',
      'matches.filter_max_price': 'ಗರಿಷ್ಠ ಬೆಲೆ / ಟನ್‌ಗೆ (₹)',
      'matches.sort_by': 'ವಿಂಗಡಿಸಿ',
      'matches.sort_score': 'ಗರಿಷ್ಠ ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರ್',
      'matches.sort_distance': 'ಕಡಿಮೆ ದೂರ',
      'matches.sort_price': 'ಕಡಿಮೆ ಬೆಲೆ / ಟನ್',
      'matches.all_residues': 'ಎಲ್ಲಾ ತ್ಯಾಜ್ಯಗಳು',
      'matches.all_states': 'ಎಲ್ಲಾ ರಾಜ್ಯಗಳು',
      'matches.col_farmer': 'ರೈತ',
      'matches.col_industry': 'ಕೈಗಾರಿಕಾ ಖರೀದಿದಾರ',
      'matches.col_residue': 'ತ್ಯಾಜ್ಯ',
      'matches.col_qty': 'ಪ್ರಮಾಣ',
      'matches.col_distance': 'ದೂರ',
      'matches.col_farmer_ask': 'ರೈತರ ನಿರೀಕ್ಷಿತ ಬೆಲೆ',
      'matches.col_industry_offer': 'ಕಂಪನಿ ಆಫರ್',
      'matches.col_gap': 'ಬೆಲೆ ಅಂತರ',
      'matches.col_score': 'ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರ್',
      'matches.col_action': 'ಕ್ರಮ',
      'matches.book_btn': 'ಒಪ್ಪಂದ ಬುಕ್ ಮಾಡಿ',
      'matches.booked': 'ಬುಕ್ ಮಾಡಲಾಗಿದೆ',
      'status.pending': 'ದೃಢೀಕರಣ ಬಾಕಿ ಇದೆ',
      'status.available': 'ಲಭ್ಯವಿದೆ',
      'matches.empty_title': 'ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
      'matches.empty_desc': 'ಪ್ರಸ್ತುತ ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯ ಒಪ್ಪಂದಗಳು ಲಭ್ಯವಿಲ್ಲ. ಮಾದರಿ ಒಪ್ಪಂದಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಮೇಲೆ "ಡೆಮೊ ಡೇಟಾ ಲೋಡ್ ಮಾಡಿ" ಕ್ಲಿಕ್ ಮಾಡಿ.',
      'matches.score_breakdown_title': 'ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರ್ ವಿವರ',
      'matches.score_tap_hint': 'ಅಂಕಗಳ ವಿವರ ನೋಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
      'matches.score_residue': 'ತ್ಯಾಜ್ಯದ ಹೊಂದಾಣಿಕೆ',
      'matches.score_distance': 'ಭೌಗೋಳಿಕ ಸಾಮೀಪ್ಯ',
      'matches.score_price': 'ಬೆಲೆಯ ಸ್ಪರ್ಧಾತ್ಮಕತೆ',
      'matches.score_quantity': 'ಪ್ರಮಾಣದ ವ್ಯಾಪ್ತಿ',
      'matches.score_total': 'ಒಟ್ಟು ಹೊಂದಾಣಿಕೆ ಸ್ಕೋರ್',
      'matches.modal_title': 'ಒಪ್ಪಂದ ಬುಕಿಂಗ್ ದೃಢೀಕರಣ',
      'matches.modal_desc': 'ಈ ರೈತ ಮತ್ತು ಖರೀದಿದಾರರ ನಡುವೆ ಒಪ್ಪಂದದ ಪ್ರಸ್ತಾವನೆಯನ್ನು ಸಲ್ಲಿಸಿ. ದೃಢೀಕರಣಕ್ಕಾಗಿ ಎರಡೂ ಕಡೆಗೆ ಸೂಚಿಸಲಾಗುತ್ತದೆ.',
      'matches.modal_confirm': 'ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಿ',
      'matches.modal_cancel': 'ರದ್ದುಮಾಡಿ',
      'matches.booking_success': 'ಬುಕಿಂಗ್ ಯಶಸ್ವಿಯಾಗಿ ಸೃಷ್ಟಿಯಾಗಿದೆ! ಸ್ಥಿತಿಯನ್ನು "ದೃಢೀಕರಣ ಬಾಕಿ" ಎಂದು ನಮೂದಿಸಲಾಗಿದೆ.',

      // Impact Dashboard Specific Keys
      'impact.badge': 'ಪರಿಸರ & ESG ಪ್ರಭಾವ',
      'impact.title': 'ಸುಸ್ಥಿರತೆ ಮತ್ತು ಆರ್ಥಿಕ ಪರಿಣಾಮ',
      'impact.subtitle': 'ತಡೆಗಟ್ಟಲಾದ ಮಾಲಿನ್ಯ, ರೈತರ ಆದಾಯ ಮತ್ತು ಹಸಿರು ಕೈಗಾರಿಕಾ ಪರಿವರ್ತನೆಯ ವಾಸ್ತವಿಕ ವರದಿ.',
      'impact.sample_badge': 'ಮಾದರಿ ಡೇಟಾ ಸಕ್ರಿಯವಾಗಿದೆ',
      'impact.toggle_booked': 'ಬುಕ್ ಮಾಡಿದ ಒಪ್ಪಂದಗಳು',
      'impact.toggle_potential': 'ಸಂಭಾವ್ಯ (ಹೊಂದಾಣಿಕೆಗಳಿಂದ)',
      'impact.mode_notice_booked': 'ಬುಕ್ ಮಾಡಿದ ವಹಿವಾಟುಗಳಿಂದ ಮೆಟ್ರಿಕ್‌ಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ (ಡೆಮೊ, ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ)',
      'impact.mode_notice_potential': 'ಲಭ್ಯವಿರುವ ಹೊಂದಾಣಿಕೆಗಳ ಸಂಭಾವ್ಯ ಪರಿಣಾಮ (ಪ್ರತಿ ರೈತನಿಗೆ ಒಂದೇ ಲೆಕ್ಕಾಚಾರ).',

      // Summary Cards
      'impact.card_farmer_earnings': 'ರೈತರ ಒಟ್ಟು ಗಳಿಕೆ',
      'impact.card_residue_diverted': 'ಸುಡುವಿಕೆಯಿಂದ ತಪ್ಪಿಸಿದ ಬೆಳೆ ತ್ಯಾಜ್ಯ',
      'impact.card_co2_avoided': 'ತಡೆಗಟ್ಟಲಾದ CO₂ ಹೊರಸೂಸುವಿಕೆ',
      'impact.card_trees_equiv': 'ಬೆಳೆಸಿದ ಮರಗಳಿಗೆ ಸಮಾನ',
      'impact.card_carbon_credits': 'ಸಂಭಾವ್ಯ ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್‌ಗಳು (ಅಂದಾಜು)',
      'impact.card_credit_value': 'ಕ್ರೆಡಿಟ್ ಮಾರುಕಟ್ಟೆ ಮೌಲ್ಯ',
      'impact.card_platform_fee': 'ವಹಿವಾಟಿನ ಮೇಲೆ ವೇದಿಕೆ ಶುಲ್ಕ (೨%)',
      'impact.card_brokerage_comm': 'ಕ್ರೆಡಿಟ್ ಮೇಲೆ ವೇದಿಕೆ ಕಮಿಷನ್ (೧೦%)',
      'impact.credit_verification_note': 'ನಿಜವಾದ ಕ್ರೆಡಿಟ್‌ಗಳಿಗೆ ತೃತೀಯ ಪಕ್ಷದ ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ.',

      // Charts
      'impact.chart_earnings_title': 'ರೈತವಾರು ಗಳಿಸಿದ ಆದಾಯ (₹)',
      'impact.chart_industry_title': 'ಕೈಗಾರಿಕೆಗಳ ಬಯೋಮಾಸ್ ಬೇಡಿಕೆ (ಟನ್)',
      'impact.chart_residue_title': 'ತ್ಯಾಜ್ಯದ ವಿಧದ ಪ್ರಕಾರ ಪ್ರಮಾಣ',
      'impact.chart_earnings_axis': 'ಗಳಿಕೆ (₹)',
      'impact.chart_industry_axis': 'ಪ್ರಮಾಣ (ಟನ್)',

      // Government View
      'impact.govt_title': 'ಸರ್ಕಾರಿ ಮತ್ತು ನಿಯಂತ್ರಕ ನೋಟ',
      'impact.govt_subtitle': 'ಬಳಕೆಯಾದ ಬೆಳೆ ತ್ಯಾಜ್ಯ ಮತ್ತು ತಪ್ಪಿಸಲಾದ ಅಂದಾಜು ಹೊರಸೂಸುವಿಕೆಯ ಜಿಲ್ಲಾ ಮಟ್ಟದ ಸಾರಾಂಶ',
      'impact.govt_residue_utilised': 'ಸದ್ಬಳಕೆಯಾದ ಒಟ್ಟು ತ್ಯಾಜ್ಯ',
      'impact.govt_co2_saved': 'ಉಳಿಸಲಾದ ನಿವ್ವಳ CO₂',
      'impact.govt_districts_covered': 'ಒಳಗೊಂಡ ಜಿಲ್ಲೆಗಳು',
      'impact.govt_unit_tons': 'ಟನ್',
      'impact.govt_unit_tonnes': 'ಟನ್ CO₂e',
      'impact.govt_unit_districts': 'ಜಿಲ್ಲೆಗಳು',

      // Methodology & Assumptions
      'impact.calc_title': 'ಲೆಕ್ಕಾಚಾರದ ವಿಧಾನ',
      'impact.calc_disclaimer': 'Estimated value used for demonstration; to be replaced with a verified emission factor.',
      'impact.calc_editable_label': 'ಹೊರಸೂಸುವಿಕೆ ಅಂಶದ ಅಂದಾಜು (ಪ್ರತಿ ಟನ್‌ಗೆ ತಪ್ಪಿಸಿದ CO₂ ಕೆಜಿ):',
      'impact.calc_reset_btn': 'ಡೀಫಾಲ್ಟ್‌ಗೆ ಮರುಹೊಂದಿಸಿ (೧,೪೬೦)',
      'impact.calc_f1_title': 'ತಡೆಗಟ್ಟಲಾದ ಹೊರಸೂಸುವಿಕೆ',
      'impact.calc_f1_desc': 'ತಪ್ಪಿಸಿದ ತ್ಯಾಜ್ಯ (ಟನ್) × ಹೊರಸೂಸುವಿಕೆ ಅಂಶ (ಕೆಜಿ/ಟನ್) ÷ ೧,೦೦೦',
      'impact.calc_f2_title': 'ಮರಗಳ ಇಂಗಾಲ ಹೀರಿಕೆಗೆ ಸಮಾನ',
      'impact.calc_f2_desc': 'ಒಟ್ಟು ತಪ್ಪಿಸಿದ CO₂ (ಕೆಜಿ) ÷ ಪ್ರತಿ ಮರಕ್ಕೆ ವಾರ್ಷಿಕ ೨೧ ಕೆಜಿ CO₂ ಹೀರಿಕೆ',
      'impact.calc_f3_title': 'ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್ ಮತ್ತು ಶುಲ್ಕ',
      'impact.calc_f3_desc': '೧ ಟನ್ CO₂e = ೧ ಕ್ರೆಡಿಟ್ (₹೮೦೦). ಕ್ರೆಡಿಟ್ ಮೇಲೆ ೧೦% ಕಮಿಷನ್ ಮತ್ತು ವ್ಯಾಪಾರದ ಮೇಲೆ ೨% ವೇದಿಕೆ ಶುಲ್ಕ.',

      // Empty State
      'impact.empty_title': 'ಯಾವುದೇ ಪರಿಣಾಮದ ಡೇಟಾ ಲಭ್ಯವಿಲ್ಲ',
      'impact.empty_desc': 'ಇನ್ನೂ ಯಾವುದೇ ಒಪ್ಪಂದಗಳು ದಾಖಲಾಗಿಲ್ಲ. ಪರಿಣಾಮ ವೀಕ್ಷಿಸಲು ಹೊಂದಾಣಿಕೆಗಳ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಒಪ್ಪಂದ ಬುಕ್ ಮಾಡಿ ಅಥವಾ ಮಾದರಿ ಡೇಟಾ ಲೋಡ್ ಮಾಡಿ.',
      'impact.empty_btn': 'ಹೊಂದಾಣಿಕೆಗಳ ಪೋರ್ಟಲ್‌ಗೆ ಹೋಗಿ',

      // === Features Expansion (Clusters, Logistics, Roadmap, Policy, Demo) ===
      'clusters.badge': 'ಸ್ಮಾರ್ಟ್ ಸಂಗ್ರಹಣೆ ನೆಟ್‌ವರ್ಕ್',
      'clusters.best_industry': 'ಉತ್ತಮ ಹೊಂದಾಣಿಕೆಯ ಕೈಗಾರಿಕೆ',
      'clusters.covers_demand': 'ಕೈಗಾರಿಕಾ ಬೇಡಿಕೆಯ {pct}% ರಷ್ಟನ್ನು ಪೂರೈಸುತ್ತದೆ',
      'clusters.empty_btn': 'ಡೆಮೊ ಡೇಟಾ ಲೋಡ್ ಮಾಡಿ',
      'clusters.empty_desc': 'ಕ್ಲಸ್ಟರ್ ರಚಿಸಲು 50 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಒಂದೇ ರೀತಿಯ ಬೆಳೆ ತ್ಯಾಜ್ಯ ಹೊಂದಿರುವ ಕನಿಷ್ಠ ಇಬ್ಬರು ರೈತರು ಬೇಕು. ಮಾದರಿಯನ್ನು ನೋಡಲು ಡೆಮೊ ಡೇಟಾ ಲೋಡ್ ಮಾಡಿ.',
      'clusters.empty_title': 'ಇನ್ನೂ ಯಾವುದೇ ರೈತ ಕ್ಲಸ್ಟರ್‌ಗಳು ರೂಪುಗೊಂಡಿಲ್ಲ',
      'clusters.estimated_trucks': 'ಅಂದಾಜು ಲಾರಿಗಳು',
      'clusters.from_hub': 'ಕೇಂದ್ರದಿಂದ',
      'clusters.highest_ask': 'ಅತ್ಯಧಿಕ ರೈತ ಬೇಡಿಕೆ',
      'clusters.hub_center': 'ಮುಖ್ಯ ಕೇಂದ್ರ',
      'clusters.hub_label': 'ಸಂಗ್ರಹಣಾ ಕೇಂದ್ರ ಜಿಲ್ಲೆ',
      'clusters.industry_offer': 'ಕೈಗಾರಿಕಾ ಕೊಡುಗೆ',
      'clusters.members_title': 'ಸದಸ್ಯ ರೈತರು',
      'clusters.no_industry': 'ಈ ಕ್ಲಸ್ಟರ್ ಪ್ರಮಾಣಕ್ಕೆ ಸೂಕ್ತವಾದ ಕೈಗಾರಿಕಾ ಖರೀದಿದಾರರು ಇನ್ನೂ ಕಂಡುಬಂದಿಲ್ಲ.',
      'clusters.pickup_point': 'ಸೂಚಿಸಲಾದ ಪಿಕಪ್ ಕೇಂದ್ರ',
      'clusters.subtitle': 'ಕೈಗಾರಿಕಾ ಬೇಡಿಕೆಗಳನ್ನು ಪೂರೈಸಲು 50 ಕಿ.ಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ರೈತರನ್ನು ಸಾಮೂಹಿಕ ಸಂಗ್ರಹಣಾ ಕೇಂದ್ರಗಳಾಗಿ ಜೋಡಿಸುವುದು.',
      'clusters.title': 'ಬಯೋಮಾಸ್ ಒಟ್ಟುಗೂಡಿಸುವಿಕೆ ಕ್ಲಸ್ಟರ್‌ಗಳು',
      'clusters.total_volume': 'ಒಟ್ಟುಗೂಡಿಸಲಾದ ಪ್ರಮಾಣ',
      'clusters.trucks_count': '{count} ಲಾರಿಗಳು',
      'clusters.trucks_unit': 'ಲಾರಿಗಳು (ಪ್ರತಿ ಲಾರಿಗೆ 10 ಟನ್)',
      'clusters.unclustered_note': '{count} ರೈತರಿಗೆ ಇನ್ನೂ ಯಾವುದೇ ಹತ್ತಿರದ ಗುಂಪು ಇಲ್ಲ',
      'clusters.why_desc': 'ಸಣ್ಣ ರೈತರು ಕೈಗಾರಿಕೆಯ ಕನಿಷ್ಠ ಬೇಡಿಕೆಯನ್ನು ಪೂರೈಸಲು ಪ್ರಮಾಣವನ್ನು ಸಂಯೋಜಿಸುತ್ತಾರೆ.',
      'clusters.why_title': 'ಕ್ಲಸ್ಟರ್ ಏಕೆ?',
      'coming_soon.alerts': 'ಎಸ್ಎಂಎಸ್ ಮತ್ತು ವಾಟ್ಸಾಪ್ ಎಚ್ಚರಿಕೆಗಳು',
      'coming_soon.badge': 'ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ',
      'coming_soon.map_view': 'ನಕ್ಷೆ ನೋಟ',
      'coming_soon.negotiation': 'ಬೆಲೆ ಮಾತುಕತೆ',
      'coming_soon.otp_login': 'ಫೋನ್ ಒಟಿಪಿ ಲಾಗಿನ್',
      'coming_soon.quality_grades': 'ಗುಣಮಟ್ಟದ ಶ್ರೇಣಿಗಳು',
      'coming_soon.subtitle': 'ಬೆಳೆ ತ್ಯಾಜ್ಯ ವ್ಯಾಪಾರವನ್ನು ಸರಳಗೊಳಿಸಲು ಮತ್ತು ಪ್ರತಿ ಹಳ್ಳಿಗೆ ತಲುಪಿಸಲು ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾಗುತ್ತಿರುವ ಸಾಧನಗಳು.',
      'coming_soon.title': 'ವೇದಿಕೆ ಮುನ್ನೋಟ ಮತ್ತು ಮುಂಬರುವ ವೈಶಿಷ್ಟ್ಯಗಳು',
      'coming_soon.upi_payment': 'ಯುಪಿಐ ಪಾವತಿ',
      'coming_soon.voice_input': 'ಧ್ವನಿ ಇನ್‌ಪುಟ್',
      'demo.load_btn': 'ಡೆಮೊ ಮೋಡ್',
      'demo.loaded_success': 'ಡೆಮೊ ಡೇಟಾವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಲೋಡ್ ಮಾಡಲಾಗಿದೆ!',
      'demo.reset_btn': 'ಡೆಮೊ ಮರುಹೊಂದಿಸಿ',
      'demo.reset_success': 'ಡೆಮೊ ದಾಖಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆ. ನಿಮ್ಮ ನಮೂದುಗಳನ್ನು ಸಂರಕ್ಷಿಸಲಾಗಿದೆ.',
      'logistics.advance_status': 'ಸ್ಥಿತಿ ಮುನ್ನಡೆಸಿ',
      'logistics.estimated_trucks': 'ಅಂದಾಜು ಲಾರಿಗಳು',
      'logistics.mock_payment': 'ಅಣಕು ಪಾವತಿ (ಡೆಮೊ ಮಾತ್ರ)',
      'logistics.payment_note': 'ತ್ಯಾಜ್ಯ ಸಾಗಣೆಯ ಸಮಯದಲ್ಲಿ ಸಿಮ್ಯುಲೇಟೆಡ್ ಪಾವತಿ ಪ್ರಕ್ರಿಯೆ.',
      'logistics.pickup_date': 'ಸೂಚಿಸಲಾದ ಪಿಕಪ್ ದಿನಾಂಕ',
      'logistics.pickup_district': 'ಪಿಕಪ್ ಜಿಲ್ಲೆ',
      'logistics.status_label': 'ಡೀಲ್ ಸ್ಥಿತಿ',
      'logistics.step_confirmed': 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
      'logistics.step_pending': 'ದೃಢೀಕರಣ ಬಾಕಿ',
      'logistics.step_picked_up': 'ಸಾಗಿಸಲಾಗಿದೆ',
      'logistics.title': 'ಡೀಲ್ ಮತ್ತು ಸಾರಿಗೆ ವಿವರಗಳು',
      'logistics.trucks_unit': 'ಲಾರಿಗಳು (ಪ್ರತಿ ಲಾರಿಗೆ 10 ಟನ್)',
      'nav.clusters': 'ಕ್ಲಸ್ಟರ್‌ಗಳು',
      'policy.desc': 'ಸ್ಥಿರವಾದ ಬೆಳೆ ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆಯನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳುವ ರೈತರು ಸರ್ಕಾರದ ನೆರವು, ತ್ಯಾಜ್ಯ ಒಟ್ಟುಗೂಡಿಸುವಿಕೆ ಬೆಂಬಲ ಮತ್ತು ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್ ಅವಕಾಶಗಳಿಗೆ ಅರ್ಹರಾಗಿರಬಹುದು.',
      'policy.note': 'ಪ್ರಸ್ತುತ ಯೋಜನೆಗಳಿಗಾಗಿ ಅಧಿಕೃತ ಮೂಲಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
      'policy.title': 'ಬೆಂಬಲ ಯೋಜನೆಗಳು ಮತ್ತು ಕಾರ್ಬನ್ ಕ್ರೆಡಿಟ್‌ಗಳು',
    },

    // ========================================================================
    // 5. Tamil (தமிழ்)
    // ========================================================================
    ta: {
      'nav.brand': 'அக்ரிலிங்க்',
      'nav.tagline_short': 'புகையிலிருந்து நிலைத்தன்மைக்கு',
      'nav.home': 'முகப்பு',
      'nav.how_it_works': 'எவ்வாறு செயல்படுகிறது',
      'nav.farmer_portal': 'உழவர் போர்டல்',
      'nav.industry_portal': 'தொழில் போர்டல்',
      'nav.matches': 'பொருத்தங்கள்',
      'nav.impact': 'தாக்கம்',
      'nav.select_lang': 'மொழி',

      'hero.badge': 'சுழற்சி உயிரி கழிவு முயற்சி',
      'hero.tagline': 'புகையிலிருந்து நிலைத்தன்மைக்கு',
      'hero.description': 'விவசாயக் கழிவுகளை நிலையான வருமானமாகவும், தொழிற்சாலைகளுக்கான தூய ஆற்றலாகவும் மாற்றுங்கள். பயிர் எரிப்பதை நிறுத்துவோம், மண்ணின் வளத்தைக் காப்போம், தூய காற்றை சுவாசிப்போம்.',
      'hero.btn_farmer_tag': 'விவசாயிகளுக்காக',
      'hero.btn_farmer_title': 'நான் விவசாயி',
      'hero.btn_farmer_sub': 'பயிர் கழிவுகளை விற்று லாபம் பெறுங்கள்',
      'hero.btn_industry_tag': 'தொழில்துறைக்காக',
      'hero.btn_industry_title': 'நான் தொழில்துறை',
      'hero.btn_industry_sub': 'பசுமை பயோமாஸ் வாங்குங்கள்',
      'hero.trust_free': 'விவசாயிகளுக்கு 100% இலவசம்',
      'hero.trust_pickup': 'தொழிற்சாலைகளுடன் நேரடி இணைப்பு',
      'hero.trust_payment': 'வெளிப்படையான நியாய விலை',

      'metrics.tonnes_val': '1,50,000+',
      'metrics.tonnes_label': 'டன் பயிர் கழிவு மறுபயன்பாடு',
      'metrics.tonnes_sub': 'வயல்களில் தீ வைப்பது தடுக்கப்பட்டது',
      'metrics.payout_val': '₹14.8 கோடி',
      'metrics.payout_label': 'விவசாயிகளுக்கு கிடைத்த வருவாய்',
      'metrics.payout_sub': 'கழிவு விற்பனை மூலம் பெறப்பட்டது',
      'metrics.co2_val': '2,10,000',
      'metrics.co2_label': 'டன் CO₂ உமிழ்வு குறைப்பு',
      'metrics.co2_sub': 'மக்களுக்கு தூய காற்று உறுதி',

      'workflow.tag': 'தீர்வு சுழற்சி',
      'workflow.title': 'அக்ரிலிங்க் எவ்வாறு இயங்குகிறது',
      'workflow.desc': 'பயிர் அறுவடையிலிருந்து பசுமை தொழிற்சாலை வரை தடையற்ற டிஜிட்டல் இணைப்பு.',
      'workflow.step1_title': '1. உழவர் பதிவு செய்தல்',
      'workflow.step1_desc': 'விவசாயிகள் பயிர் கழிவு வகை (நெல், கோதுமை, கரும்பு, பருத்தி), அளவு மற்றும் எதிர்பார்க்கும் விலையைப் பதிவு செய்கின்றனர்.',
      'workflow.step2_title': '2. வாங்குபவர்களுடன் இணைப்பு',
      'workflow.step2_desc': 'அக்ரிலிங்க் உங்கள் மாவட்டத்தின் தொழிற்சாலைகளுடன் நேரடியாக இணைத்து போக்குவரத்து செலவை குறைக்கிறது.',
      'workflow.step3_title': '3. தூய ஆற்றலாக மாற்றுதல்',
      'workflow.step3_desc': 'சேகரிக்கப்பட்ட கழிவுகள் பயோ-பெல்லட்டுகள், பயோ-சிஎன்ஜி மற்றும் காகிதக் கூழாக மாற்றப்படுகின்றன.',

      'portals.farmer_badge': 'விவசாயிகள் & உற்பத்தியாளர்கள்',
      'portals.farmer_title': 'விவசாயிகளுக்கான நன்மைகள்',
      'portals.farmer_desc': 'வயலை சுத்தம் செய்யும் செலவை மிச்சப்படுத்துங்கள், அபராதங்களைத் தவிருங்கள், ஏக்கருக்கு கூடுதல் வருவாய் ஈட்டுங்கள்.',
      'portals.farmer_f1': 'இலவச பதிவு: சரிபார்க்கப்பட்ட வாங்குபவர்களுடன் நேரடி தொடர்பு',
      'portals.farmer_f2': 'நீங்களே நிர்ணயிக்கும் வெளிப்படையான டன்னின் விலை',
      'portals.farmer_f3': 'எரிக்காமல் விடுவதால் மண்ணின் நுண்ணூட்டச்சத்துக்கள் பாதுகாப்பு',
      'portals.farmer_cta': 'உழவர் போர்ட்டலுக்கு செல்க',

      'portals.industry_badge': 'தொழில்துறை & உயிரி எரிபொருள்',
      'portals.industry_title': 'தொழில்துறை கொள்முதல்',
      'portals.industry_desc': 'மின் உற்பத்தி நிலையங்கள் மற்றும் ஆலைகளுக்கு உயர்தர பயோமாஸ் தொடர்ந்து வழங்குதல்.',
      'portals.industry_f1': 'உங்கள் ஆலைக்கு அருகிலுள்ள மாவட்டங்களிலிருந்து உள்ளூர் கொள்முதல்',
      'portals.industry_f2': 'விவசாய குழுக்களுடன் நேரடி வர்த்தகம்',
      'portals.industry_f3': 'கார்பன் வரவுகள் மற்றும் ESG நெறிமுறைகள் பூர்த்தி',
      'portals.industry_cta': 'தொழில்துறை போர்ட்டலுக்கு செல்க',

      'footer.mission': 'விவசாயக் கழிவுகளை எரிப்பதை முற்றிலும் தடுத்து, உழவர்களுக்கும் பசுமைத் தொழில்களுக்கும் நேரடி வணிக பாலத்தை உருவாக்குவதே அக்ரிலிங்கின் நோக்கம்.',
      'footer.quick_links': 'முக்கிய போர்ட்டல்கள்',
      'footer.resources': 'தளம்',
      'footer.about_us': 'எங்களை பற்றி',
      'footer.contact': 'உழவர் உதவி எண் (இலவசம்)',
      'footer.privacy': 'தனியுரிமை கொள்கை',
      'footer.terms': 'பயன்பாட்டு விதிமுறைகள்',
      'footer.rights': 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. புகையை நிலையான ஆற்றலாக மாற்றுகிறோம்.',

      // Farmer Portal Page & Form
      'farmer_page.badge': 'உழவர் சந்தை',
      'farmer_page.title': 'உங்கள் பயிர் கழிவுகளை பதிவு செய்யுங்கள்',
      'farmer_page.subtitle': 'சரிபார்க்கப்பட்ட தொழில்துறை வாங்குபவர்களுடன் நேரடியாக இணையுங்கள். டன்னுக்கு உங்கள் விலையை நிர்ணயித்து எரிக்காமல் விற்று பயன் பெறுங்கள்.',
      'farmer_page.notice': 'அக்ரிலிங்க் விவசாயிகளை தொழிற்சாலைகளுடன் நேரடியாக இணைக்கிறது. எந்த கட்டணமும் இல்லை.',
      'farmer_page.card_title': '🌾 பயிர் கழிவு பதிவு படிவம்',
      'farmer_page.card_sub': 'உங்கள் மாவட்டத்தின் வாங்குபவர்களைக் கண்டறிய விவரங்களை உள்ளிடவும்.',

      // Industry Portal Page & Form
      'industry_page.badge': 'தொழில்துறை கொள்முதல்',
      'industry_page.title': 'உயிரி எரிபொருள் கொள்முதல்',
      'industry_page.subtitle': 'உயிரி எரிபொருள், காகித ஆலை, உரம் மற்றும் பேக்கேஜிங்கிற்காக உங்கள் அருகிலுள்ள மாவட்ட விவசாயிகளிடமிருந்து நேரடியாக பயோமாஸ் வாங்குங்கள்.',
      'industry_page.notice': 'அக்ரிலிங்க் தொழில்துறைகளை உள்ளூர் விவசாயிகளுடன் இணைக்கிறது.',
      'industry_page.card_title': '🏭 பயோமாஸ் தேவை பதிவு படிவம்',
      'industry_page.card_sub': 'தேவையான அளவு, கழிவின் வகை மற்றும் விரும்பிய மாவட்டத்தை குறிப்பிடவும்.',

      // Form Field Labels
      'form.name': 'முழு பெயர்',
      'form.phone': 'தொலைபேசி எண் (10 இலக்கங்கள்)',
      'form.residue_type': 'கழிவின் வகை',
      'form.quantity_tons': 'அளவு (டன்களில்)',
      'form.state': 'மாநிலம்',
      'form.district': 'மாவட்டம்',
      'form.village': 'கிராமம்',
      'form.expected_price': 'எதிர்பார்க்கும் விலை / டன்னுக்கு (₹)',

      'form.industry_name': 'தொழில் / நிறுவனத்தின் பெயர்',
      'form.contact_phone': 'தொடர்பு தொலைபேசி (10 இலக்கங்கள்)',
      'form.industry_type': 'தொழிலின் வகை',
      'form.required_residue': 'தேவையான கழிவின் வகை',
      'form.quantity_needed': 'தேவைப்படும் அளவு (டன்களில்)',
      'form.preferred_state': 'விருப்பமான மாநிலம்',
      'form.preferred_district': 'விருப்பமான மாவட்டம்',
      'form.offered_price': 'வழங்கும் விலை / டன்னுக்கு (₹)',

      // Placeholders
      'placeholder.name': 'எ.கா. செந்தில் குமார்',
      'placeholder.phone': 'எ.கா. 9876543210',
      'placeholder.quantity': 'எ.கா. 25',
      'placeholder.village': 'எ.கா. திருவாலங்காடு',
      'placeholder.expected_price': 'எ.கா. 2200',
      'placeholder.industry_name': 'எ.கா. கிரீன்பயோ எனர்ஜி லி.',
      'placeholder.quantity_needed': 'எ.கா. 500',
      'placeholder.offered_price': 'எ.கா. 2400',

      // Dropdown Options
      'residue.select': '-- கழிவின் வகையைத் தேர்ந்தெடுக்கவும் --',
      'residue.paddy_straw': 'நெல் வைக்கோல் (Paddy Straw)',
      'residue.wheat_straw': 'கோதுமை வைக்கோல் (Wheat Straw)',
      'residue.sugarcane_bagasse': 'கரும்பு சக்கை (Sugarcane Bagasse)',
      'residue.maize_stalk': 'மக்காச்சோள தட்டை (Maize Stalk)',
      'residue.cotton_stalk': 'பருத்தி குச்சி (Cotton Stalk)',
      'residue.any': 'அனைத்து வகைகளும் (All Types)',

      'industry_type.select': '-- தொழிலின் வகையைத் தேர்ந்தெடுக்கவும் --',
      'industry_type.biofuel': 'உயிரி எரிபொருள் & ஆற்றல் (Biofuel)',
      'industry_type.paper_mill': 'காகித ஆலை (Paper Mill)',
      'industry_type.compost': 'உரம் & உரம் தயாரிப்பு (Compost)',
      'industry_type.packaging': 'சுற்றுச்சூழல் பேக்கேஜிங் (Packaging)',

      'state.select': '-- மாநிலத்தைத் தேர்ந்தெடுக்கவும் --',
      'district.select': '-- மாவட்டத்தைத் தேர்ந்தெடுக்கவும் --',
      'district.select_state_first': '-- முதலில் மாநிலத்தைத் தேர்ந்தெடுக்கவும் --',

      // States
      'state.punjab': 'பஞ்சாப் (Punjab)',
      'state.haryana': 'ஹரியானா (Haryana)',
      'state.uttar_pradesh': 'உத்தரப் பிரதேசம் (Uttar Pradesh)',
      'state.andhra_pradesh': 'ஆந்திரப் பிரதேசம் (Andhra Pradesh)',
      'state.telangana': 'தெலங்கானா (Telangana)',
      'state.karnataka': 'கர்நாடகா (Karnataka)',
      'state.tamil_nadu': 'தமிழ்நாடு (Tamil Nadu)',
      'state.kerala': 'கேரளா (Kerala)',

      // Buttons & Feedback
      'form.submit_farmer': 'பயிர் கழிவை பதிவு செய்க',
      'form.submit_industry': 'தேவையை பதிவு செய்க',
      'form.submitting': 'பதிவாகிறது...',
      'form.success_farmer': 'விவரங்கள் வெற்றிகரமாக பதிவு செய்யப்பட்டன! உங்கள் மாவட்ட வாங்குபவர்களுடன் இணைப்போம்.',
      'form.success_industry': 'உங்கள் தேவை பதிவு செய்யப்பட்டது! உள்ளூர் விவசாயிகளுடன் தொடர்பு ஏற்படுத்துவோம்.',
      'form.footer_note': 'உங்கள் தகவல் சரிபார்க்கப்பட்ட அக்ரிலிங்க் கூட்டாளர்களுடன் மட்டுமே பகிரப்படும்.',
      'mock.badge': 'டெமோ முறை (மாக் சேமிப்பு)',

      // Validation Errors
      'error.required': 'இத்தகவல் தேவை',
      'error.phone_invalid': 'சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்',
      'error.number_positive': '0 விட அதிகமான சரியான அளவை உள்ளிடவும்',
      'error.price_positive': '0 விட அதிகமான சரியான விலையை உள்ளிடவும்',
      'error.select_option': 'பட்டியலில் இருந்து ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்',
      'error.server_unreachable': 'Unable to connect to the server. Please try again later.',
      'error.general': 'எதிர்பாராத பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',

      // Matches Portal Specific Keys
      'matches.badge': 'ஸ்மார்ட் பொருத்த இயந்திரம்',
      'matches.title': 'பயோமாஸ் ஒப்பந்தங்கள் மற்றும் பொருத்தங்கள்',
      'matches.subtitle': 'பயிர் கழிவு வகை, தூரம், விலை மற்றும் அளவு அடிப்படையில் விவசாயிகள் மற்றும் தொழில்துறை வாங்குபவர்களின் துல்லியமான இணைப்பு.',
      'matches.count': 'பொருத்தமான ஒப்பந்தங்கள் கிடைத்தன',
      'matches.load_demo': 'டெமோ தரவை ஏற்றுக',
      'matches.clear_data': 'தரவை அழிக்கவும்',
      'matches.sample_data': 'மாதிரி தரவு',
      'matches.filter_residue': 'கழிவின் வகை',
      'matches.filter_state': 'மாநிலம்',
      'matches.filter_max_price': 'அதிகபட்ச விலை / டன் (₹)',
      'matches.sort_by': 'வரிசைப்படுத்துக',
      'matches.sort_score': 'அதிகபட்ச பொருத்தம் மதிப்பெண்',
      'matches.sort_distance': 'குறைந்த தூரம்',
      'matches.sort_price': 'குறைந்த விலை / டன்',
      'matches.all_residues': 'அனைத்து கழிவுகள்',
      'matches.all_states': 'அனைத்து மாநிலங்கள்',
      'matches.col_farmer': 'விவசாயி',
      'matches.col_industry': 'தொழில்துறை வாங்குபவர்',
      'matches.col_residue': 'கழிவு',
      'matches.col_qty': 'அளவு',
      'matches.col_distance': 'தூரம்',
      'matches.col_farmer_ask': 'விவசாயி கோரிக்கை',
      'matches.col_industry_offer': 'நிறுவன சலுகை',
      'matches.col_gap': 'விலை இடைவெளி',
      'matches.col_score': 'பொருத்த மதிப்பெண்',
      'matches.col_action': 'செயல்',
      'matches.book_btn': 'ஒப்பந்தம் பதிவு செய்க',
      'matches.booked': 'பதிவு செய்யப்பட்டது',
      'status.pending': 'உறுதிப்படுத்தல் நிலுவையில்',
      'status.available': 'கிடைக்கக்கூடியது',
      'matches.empty_title': 'பொருத்தங்கள் ஏதும் கிடைக்கவில்லை',
      'matches.empty_desc': 'தற்போது பொருத்தமான ஒப்பந்தங்கள் ஏதுமில்லை. மாதிரி ஒப்பந்தங்களைக் காண மேலே உள்ள "டெமோ தரவை ஏற்றுக" பொத்தானைக் கிளிக் செய்யவும்.',
      'matches.score_breakdown_title': 'பொருத்த மதிப்பெண் விவரம்',
      'matches.score_tap_hint': 'மதிப்பெண்களைக் காண தட்டவும்',
      'matches.score_residue': 'கழிவுப் பொருத்தம்',
      'matches.score_distance': 'புவியியல் தூரம்',
      'matches.score_price': 'விலை பொருத்தம்',
      'matches.score_quantity': 'அளவு கவரேஜ்',
      'matches.score_total': 'மொத்த பொருத்தம் மதிப்பெண்',
      'matches.modal_title': 'ஒப்பந்த முன்பதிவு உறுதிப்படுத்தல்',
      'matches.modal_desc': 'இந்த விவசாயி மற்றும் வாங்குபவருக்கு இடையே ஒப்பந்த முன்மொழிவை அனுப்பவும். உறுதிப்படுத்தலுக்கு இரு தரப்பிற்கும் அறிவிக்கப்படும்.',
      'matches.modal_confirm': 'முன்பதிவை உறுதி செய்க',
      'matches.modal_cancel': 'ரத்து செய்க',
      'matches.booking_success': 'முன்பதிவு வெற்றிகரமாக உருவாக்கப்பட்டது! நிலை "உறுதிப்படுத்தல் நிலுவையில்" என அமைக்கப்பட்டது.',

      // Impact Dashboard Specific Keys
      'impact.badge': 'சுற்றுச்சூழல் & ESG தாக்கம்',
      'impact.title': 'நிலைத்தன்மை மற்றும் பொருளாதார தாக்கம்',
      'impact.subtitle': 'தடுக்கப்பட்ட உமிழ்வுகள், விவசாயிகள் வருவாய் மற்றும் பசுமை தொழில்துறை மாற்றத்தின் அளவீடுகள்.',
      'impact.sample_badge': 'மாதிரி தரவு பயன்பாட்டில் உள்ளது',
      'impact.toggle_booked': 'முன்பதிவு செய்யப்பட்ட ஒப்பந்தங்கள்',
      'impact.toggle_potential': 'சாத்தியமானவை (பொருத்தங்களிலிருந்து)',
      'impact.mode_notice_booked': 'முன்பதிவு செய்யப்பட்ட ஒப்பந்தங்களின் புள்ளிவிவரங்கள் (டெமோ, இந்த உலாவியில் சேமிக்கப்பட்டது)',
      'impact.mode_notice_potential': 'சாத்தியமான பொருத்தங்களின் எதிர்பார்க்கப்படும் தாக்கம் (ஒரு உழவருக்கு ஒரு முறை கணக்கீடு).',

      // Summary Cards
      'impact.card_farmer_earnings': 'விவசாயிகளின் மொத்த வருவாய்',
      'impact.card_residue_diverted': 'எரிக்கப்படாமல் பாதுகாக்கப்பட்ட கழிவு',
      'impact.card_co2_avoided': 'தவிர்க்கப்பட்ட CO₂ உமிழ்வு',
      'impact.card_trees_equiv': 'வளர்ந்த மரங்களுக்கு சமம்',
      'impact.card_carbon_credits': 'சாத்தியமான கார்பன் வரவுகள் (மதிப்பீடு)',
      'impact.card_credit_value': 'கார்பன் வரவுகளின் மதிப்பு',
      'impact.card_platform_fee': 'வர்த்தக தள கட்டணம் (2%)',
      'impact.card_brokerage_comm': 'வரவுகளுக்கான தள கமிஷன் (10%)',
      'impact.credit_verification_note': 'உண்மையான கார்பன் வரவுகளுக்கு மூன்றாம் தரப்பு சான்றிதழ் அவசியம்.',

      // Charts
      'impact.chart_earnings_title': 'விவசாயி வாரியான வருவாய் (₹)',
      'impact.chart_industry_title': 'தொழில்துறை பயோமாஸ் தேவை (டன்கள்)',
      'impact.chart_residue_title': 'கழிவு வகை வாரியாக அளவு',
      'impact.chart_earnings_axis': 'வருவாய் (₹)',
      'impact.chart_industry_axis': 'அளவு (டன்கள்)',

      // Government View
      'impact.govt_title': 'அரசு மற்றும் ஒழுங்குமுறை பார்வை',
      'impact.govt_subtitle': 'பயன்படுத்தப்பட்ட பயிர்க்கழிவு மற்றும் தவிர்க்கப்பட்ட உமிழ்வுகளின் மாவட்ட அளவிலான சுருக்கம்',
      'impact.govt_residue_utilised': 'பயன்படுத்தப்பட்ட மொத்த கழிவு',
      'impact.govt_co2_saved': 'சேமிக்கப்பட்ட நிகர CO₂',
      'impact.govt_districts_covered': 'உட்பட்ட மாவட்டங்கள்',
      'impact.govt_unit_tons': 'டன்கள்',
      'impact.govt_unit_tonnes': 'டன்கள் CO₂e',
      'impact.govt_unit_districts': 'மாவட்டங்கள்',

      // Methodology & Assumptions
      'impact.calc_title': 'கணக்கீட்டு முறை',
      'impact.calc_disclaimer': 'Estimated value used for demonstration; to be replaced with a verified emission factor.',
      'impact.calc_editable_label': 'உமிழ்வு காரணி அனுமானம் (டன்னுக்கு தவிர்க்கப்பட்ட CO₂ கிலோ):',
      'impact.calc_reset_btn': 'இயல்புநிலைக்கு மீட்டமைக்கவும் (1,460)',
      'impact.calc_f1_title': 'தவிர்க்கப்பட்ட உமிழ்வுகள்',
      'impact.calc_f1_desc': 'தவிர்க்கப்பட்ட கழிவு (டன்) × உமிழ்வு காரணி (கிலோ/டன்) ÷ 1,000',
      'impact.calc_f2_title': 'மரங்களின் உறிஞ்சுதல் சமம்',
      'impact.calc_f2_desc': 'தவிர்க்கப்பட்ட மொத்த CO₂ (கிலோ) ÷ ஒரு மரத்திற்கு ஆண்டுக்கு 21 கிலோ CO₂',
      'impact.calc_f3_title': 'கார்பன் வரவுகள் மற்றும் கட்டணம்',
      'impact.calc_f3_desc': '1 டன் CO₂e = 1 வரவு (₹800). வரவுகளுக்கு 10% கமிஷன் மற்றும் வர்த்தகத்திற்கு 2% தள கட்டணம்.',

      // Empty State
      'impact.empty_title': 'தாக்க தரவு எதுவும் கிடைக்கவில்லை',
      'impact.empty_desc': 'இன்னும் ஒப்பந்தங்கள் எதுவும் பதிவாகவில்லை. தாக்க விவரங்களைக் காண பொருத்தங்கள் போர்ட்டலில் ஒப்பந்தங்களை பதிவு செய்யவும் அல்லது மாதிரி தரவை ஏற்றவும்.',
      'impact.empty_btn': 'பொருத்தங்கள் போர்ட்டலுக்கு செல்லவும்',

      // === Features Expansion (Clusters, Logistics, Roadmap, Policy, Demo) ===
      'clusters.badge': 'ஸ்மார்ட் சேகரிப்பு நெட்வொர்க்',
      'clusters.best_industry': 'சிறந்த பொருத்தமான தொழில்',
      'clusters.covers_demand': 'தொழில் தேவையில் {pct}% ஐ பூர்த்தி செய்கிறது',
      'clusters.empty_btn': 'டெமோ தரவை ஏற்று',
      'clusters.empty_desc': 'ஒரு கிளஸ்டரை உருவாக்க 50 கி.மீ சுற்றளவில் ஒரே பயிர்க்கழிவு கொண்ட குறைந்தது இரண்டு விவசாயிகள் தேவை. மாதிரி கிளஸ்டரை பார்க்க டெமோ தரவை ஏற்றவும்.',
      'clusters.empty_title': 'இன்னும் விவசாயி கிளஸ்டர்கள் உருவாகவில்லை',
      'clusters.estimated_trucks': 'மதிப்பிடப்பட்ட லாரிகள்',
      'clusters.from_hub': 'மையத்திலிருந்து',
      'clusters.highest_ask': 'விவசாயியின் அதிகபட்ச கோரிக்கை',
      'clusters.hub_center': 'முதன்மை மையம்',
      'clusters.hub_label': 'சேகரிப்பு மைய மாவட்டம்',
      'clusters.industry_offer': 'தொழில்துறை சலுகை',
      'clusters.members_title': 'உறுப்பினர் விவசாயிகள்',
      'clusters.no_industry': 'இந்த கிளஸ்டர் அளவிற்கு பொருத்தமான தொழில்துறை வாங்குபவர் இன்னும் கிடைக்கவில்லை.',
      'clusters.pickup_point': 'பரிந்துரைக்கப்பட்ட சேகரிப்பு மையம்',
      'clusters.subtitle': 'தொழில்துறை தேவைகளை திறம்பட பூர்த்தி செய்ய 50 கி.மீ சுற்றளவில் விவசாயிகளை கூட்டு மையங்களாக இணைத்தல்.',
      'clusters.title': 'பயோமாஸ் ஒருங்கிணைப்பு கிளஸ்டர்கள்',
      'clusters.total_volume': 'மொத்த ஒருங்கிணைந்த அளவு',
      'clusters.trucks_count': '{count} லாரிகள்',
      'clusters.trucks_unit': 'லாரிகள் (ஒரு லாரிக்கு 10 டன்)',
      'clusters.unclustered_note': '{count} விவசாயிகளுக்கு இன்னும் அருகில் குழு இல்லை',
      'clusters.why_desc': 'சிறிய விவசாயிகள் ஒரு தொழில்துறையின் குறைந்தபட்ச ஆர்டரைப் பூர்த்தி செய்ய அளவை ஒருங்கிணைக்கிறார்கள்.',
      'clusters.why_title': 'ஏன் கிளஸ்டர்?',
      'coming_soon.alerts': 'SMS மற்றும் வாட்ஸ்அப் அறிவிப்புகள்',
      'coming_soon.badge': 'விரைவில் வருகிறது',
      'coming_soon.map_view': 'வரைபட பார்வை',
      'coming_soon.negotiation': 'விலை பேச்சுவார்த்தை',
      'coming_soon.otp_login': 'தொலைபேசி OTP உள்நுழைவு',
      'coming_soon.quality_grades': 'தர நிலைகள்',
      'coming_soon.subtitle': 'பயிர்க்கழிவு வர்த்தகத்தை எளிதாக்கவும், ஒவ்வொரு கிராமத்திற்கும் கொண்டு சேர்க்கவும் உருவாக்கப்படும் அம்சங்கள்.',
      'coming_soon.title': 'தளத்தின் வளர்ச்சி திட்டம் மற்றும் புதிய அம்சங்கள்',
      'coming_soon.upi_payment': 'UPI கட்டணம்',
      'coming_soon.voice_input': 'குரல் உள்ளீடு',
      'demo.load_btn': 'டெமோ முறை',
      'demo.loaded_success': 'டெமோ தரவு வெற்றிகரமாக ஏற்றப்பட்டது!',
      'demo.reset_btn': 'டெமோ மீட்டமை',
      'demo.reset_success': 'டெமோ தரவு அகற்றப்பட்டது. உங்கள் உள்ளீடுகள் பாதுகாக்கப்பட்டுள்ளன.',
      'logistics.advance_status': 'நிலையை மாற்று',
      'logistics.estimated_trucks': 'மதிப்பிடப்பட்ட லாரிகள்',
      'logistics.mock_payment': 'மாதிரி கட்டணம் (டெமோ மட்டும்)',
      'logistics.payment_note': 'பயிர்க்கழிவு பிக்கப் செய்யப்படும்போது மாதிரி கட்டண செயல்முறை.',
      'logistics.pickup_date': 'பரிந்துரைக்கப்பட்ட பிக்கப் தேதி',
      'logistics.pickup_district': 'பிக்கப் மாவட்டம்',
      'logistics.status_label': 'ஒப்பந்த நிலை',
      'logistics.step_confirmed': 'உறுதிப்படுத்தப்பட்டது',
      'logistics.step_pending': 'நிலுவையில்',
      'logistics.step_picked_up': 'எடுத்துச்செல்லப்பட்டது',
      'logistics.title': 'ஒப்பந்தம் மற்றும் போக்குவரத்து விவரங்கள்',
      'logistics.trucks_unit': 'லாரிகள் (ஒரு லாரிக்கு 10 டன்)',
      'nav.clusters': 'கிளஸ்டர்கள்',
      'policy.desc': 'நிலையான பயிர்க்கழிவு மேலாண்மையை மேற்கொள்ளும் விவசாயிகள் பொருந்தக்கூடிய அரசு உதவிகள், கழிவு ஒருங்கிணைப்பு ஆதரவு மற்றும் கார்பன் வரவு வாய்ப்புகளுக்கு தகுதியுடையவராக இருக்கலாம்.',
      'policy.note': 'தற்போதைய திட்டங்களுக்கு அதிகாரப்பூர்வ ஆதாரங்களை சரிபார்க்கவும்.',
      'policy.title': 'ஆதரவு திட்டங்கள் மற்றும் கார்பன் வரவுகள்',
    },

    // ========================================================================
    // 6. Malayalam (മലയാളം)
    // ========================================================================
    ml: {
      'nav.brand': 'അഗ്രിലിങ്ക്',
      'nav.tagline_short': 'പുകയിൽ നിന്ന് സുസ്ഥിരതയിലേക്ക്',
      'nav.home': 'ഹോം',
      'nav.how_it_works': 'പ്രവർത്തനം',
      'nav.farmer_portal': 'കർഷക പോർട്ടൽ',
      'nav.industry_portal': 'വ്യവസായ പോർട്ടൽ',
      'nav.matches': 'പൊരുത്തങ്ങൾ',
      'nav.impact': 'നേട്ടങ്ങൾ',
      'nav.select_lang': 'ഭാഷ',

      'hero.badge': 'ബയോമാസ് സുസ്ഥിര സംരംഭം',
      'hero.tagline': 'പുകയിൽ നിന്ന് സുസ്ഥിരതയിലേക്ക്',
      'hero.description': 'കാർഷിക അവശിഷ്ടങ്ങളെ ഉറപ്പുള്ള വരുമാനവും വ്യവസായങ്ങൾക്കുള്ള ശുദ്ധമായ ഹരിത ഊർജ്ജവുമാക്കി മാറ്റുക. വൈക്കോൽ കത്തിക്കുന്നത് ഒഴിവാക്കാം, മണ്ണും അന്തരീക്ഷവും സംരക്ഷിക്കാം.',
      'hero.btn_farmer_tag': 'കർഷകർക്കായി',
      'hero.btn_farmer_title': 'ഞാൻ കർഷകനാണ്',
      'hero.btn_farmer_sub': 'കാർഷിക അവശിഷ്ടങ്ങൾ വിറ്റ് വരുമാനം നേടൂ',
      'hero.btn_industry_tag': 'വ്യവസായങ്ങൾക്കായി',
      'hero.btn_industry_title': 'ഞാൻ വ്യവസായമാണ്',
      'hero.btn_industry_sub': 'ഹരിത ബയോമാസ് വാങ്ങുക',
      'hero.trust_free': 'കർഷകർക്ക് 100% സൗജന്യം',
      'hero.trust_pickup': 'വ്യവസായങ്ങളുമായി നേരിട്ടുള്ള ബന്ധം',
      'hero.trust_payment': 'സുതാര്യമായ ന്യായവില',

      'metrics.tonnes_val': '1,50,000+',
      'metrics.tonnes_label': 'ടൺ അവശിഷ്ടങ്ങൾ പുനരുപയോഗിച്ചു',
      'metrics.tonnes_sub': 'പാടങ്ങളിൽ തീയിടുന്നത് തടഞ്ഞു',
      'metrics.payout_val': '₹14.8 കോടി',
      'metrics.payout_label': 'കർഷകർക്ക് ലഭിച്ച വരുമാനം',
      'metrics.payout_sub': 'അവശിഷ്ടങ്ങൾ വിറ്റ് നേടിയ തുക',
      'metrics.co2_val': '2,10,000',
      'metrics.co2_label': 'ടൺ CO₂ ഉദ്‌വമനം കുറച്ചു',
      'metrics.co2_sub': 'ശുദ്ധവായു ഉറപ്പാക്കുന്നതിൽ പങ്കാളിത്തം',

      'workflow.tag': 'പരിഹാര ചക്രം',
      'workflow.title': 'അഗ്രിലിങ്ക് എങ്ങനെ പ്രവർത്തിക്കുന്നു',
      'workflow.desc': 'വിളവെടുപ്പ് മുതൽ ഹരിത വ്യവസായം വരെയുള്ള ലളിതമായ ഡിജിറ്റൽ സംയോജനം.',
      'workflow.step1_title': '1. കർഷകരുടെ രജിസ്ട്രേഷൻ',
      'workflow.step1_desc': 'കർഷകർ വിള അവശിഷ്ടത്തിന്റെ തരം (നെല്ല്, ഗോതമ്പ്, കരിമ്പ്, പരുത്തി), അളവ്, പ്രതീക്ഷിക്കുന്ന വില എന്നിവ രേഖപ്പെടുത്തുന്നു.',
      'workflow.step2_title': '2. അനുയോജ്യരായ ഉപഭോക്താക്കളെ കണ്ടെത്തൽ',
      'workflow.step2_desc': 'അഗ്രിലിങ്ക് നിങ്ങളുടെ ജില്ലയിലെ വ്യവസായങ്ങളുമായി ബന്ധിപ്പിച്ച് ഗതാഗതച്ചെലവ് കുറയ്ക്കുന്നു.',
      'workflow.step3_title': '3. ശുദ്ധമായ ഊർജ്ജമായി മാറ്റുന്നു',
      'workflow.step3_desc': 'ശേഖരിച്ച അവശിഷ്ടങ്ങൾ ബയോ-പെല്ലറ്റുകൾ, ബയോ-സിഎൻജി എന്നിവയാക്കി മാറ്റി കൽക്കരിക്ക് പകരമായി ഉപയോഗിക്കുന്നു.',

      'portals.farmer_badge': 'കർഷകരും ഉത്പാദകരും',
      'portals.farmer_title': 'കർഷകർക്കുള്ള നേട്ടങ്ങൾ',
      'portals.farmer_desc': 'പാടം വൃത്തിയാക്കുന്നതിനുള്ള ചെലവ് ലാഭിക്കുക, പിഴകൾ ഒഴിവാക്കുക, ഏക്കറിന് അധിക വരുമാനം നേടുക.',
      'portals.farmer_f1': 'സൗജന്യ രജിസ്ട്രേഷൻ: അംഗീകൃത ഉപഭോക്താക്കളുമായി നേരിട്ടുള്ള ബന്ധം',
      'portals.farmer_f2': 'നിങ്ങൾ നിശ്ചയിക്കുന്ന സുതാര്യമായ ടൺ നിരക്ക്',
      'portals.farmer_f3': 'കത്തിക്കാതിരിക്കുന്നതിലൂടെ മണ്ണിന്റെ ഫലഭൂയിഷ്ഠത സംരക്ഷിക്കപ്പെടുന്നു',
      'portals.farmer_cta': 'കർഷക പോർട്ടലിലേക്ക് പോകുക',

      'portals.industry_badge': 'വ്യവസായം & ബയോ-എനർജി',
      'portals.industry_title': 'വ്യവസായ സംഭരണം',
      'portals.industry_desc': 'തെർമൽ പവർ പ്ലാന്റുകൾക്കും ഫാക്ടറികൾക്കും ഉയർന്ന ഗുണനിലവാരമുള്ള ബയോമാസ് തുടർച്ചയായ വിതരണം.',
      'portals.industry_f1': 'നിങ്ങളുടെ പ്ലാന്റിന് സമീപമുള്ള ജില്ലകളിൽ നിന്നുള്ള സംഭരണം',
      'portals.industry_f2': 'കർഷക കൂട്ടായ്മകളുമായി നേരിട്ടുള്ള ഇടപെടൽ',
      'portals.industry_f3': 'കാർബൺ ക്രെഡിറ്റുകളും ESG മാനദണ്ഡങ്ങളും പാലിക്കൽ',
      'portals.industry_cta': 'വ്യവസായ പോർട്ടലിലേക്ക് പോകുക',

      'footer.mission': 'കാർഷിക അവശിഷ്ടങ്ങൾ കത്തിക്കുന്നത് ഇല്ലാതാക്കി കർഷകരെയും വ്യവസായങ്ങളെയും നേരിട്ട് ബന്ധിപ്പിക്കുകയാണ് അഗ്രിലിങ്കിന്റെ ലക്ഷ്യം.',
      'footer.quick_links': 'പ്രധാന പോർട്ടലുകൾ',
      'footer.resources': 'പ്ലാറ്റ്‌ഫോം',
      'footer.about_us': 'ഞങ്ങളെക്കുറിച്ച്',
      'footer.contact': 'കിസാൻ ഹെൽപ്പ്‌ലൈൻ (ടോൾ-ഫ്രീ)',
      'footer.privacy': 'സ്വകാര്യതാ നയം',
      'footer.terms': 'ഉപാധികളും നിബന്ധനകളും',
      'footer.rights': 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം. പുകയെ സുസ്ഥിര ഊർജ്ജമാക്കി മാറ്റുന്നു.',

      // Farmer Portal Page & Form
      'farmer_page.badge': 'കർഷക വിപണി',
      'farmer_page.title': 'കാർഷിക അവശിഷ്ടങ്ങൾ ലിസ്റ്റ് ചെയ്യുക',
      'farmer_page.subtitle': 'പരിശോധിച്ചുറപ്പിച്ച വ്യവസായ ഉപഭോക്താക്കളുമായി നേരിട്ട് ബന്ധപ്പെടുക. ടണ്ണിന് നിങ്ങളുടെ വില നിശ്ചയിച്ച് കത്തിക്കാതെ വിൽക്കുക.',
      'farmer_page.notice': 'അഗ്രിലിങ്ക് കർഷകരെ വ്യവസായങ്ങളുമായി നേരിട്ട് ബന്ധിപ്പിക്കുന്നു. യാതൊരു ഫീസും ഈടാക്കുന്നില്ല.',
      'farmer_page.card_title': '🌾 വിള അവശിഷ്ട രജിസ്ട്രേഷൻ ഫോം',
      'farmer_page.card_sub': 'നിങ്ങളുടെ ജില്ലയിലെ വാങ്ങലുകാരെ കണ്ടെത്താൻ വിശദാംശങ്ങൾ നൽകുക.',

      // Industry Portal Page & Form
      'industry_page.badge': 'വ്യവസായ സംഭരണം',
      'industry_page.title': 'സുസ്ഥിര ബയോമാസ് സംഭരണം',
      'industry_page.subtitle': 'ബയോഫ്യൂവൽ, പേപ്പർ മിൽ, കമ്പോസ്റ്റ് എന്നിവയ്ക്കായി നിങ്ങളുടെ സമീപ ജില്ലകളിലെ കർഷകരിൽ നിന്ന് നേരിട്ട് ബയോമാസ് സംഭരിക്കുക.',
      'industry_page.notice': 'അഗ്രിലിങ്ക് വ്യവസായങ്ങളെ പ്രാദേശിക കർഷകരുമായി ബന്ധിപ്പിക്കുന്നു.',
      'industry_page.card_title': '🏭 ബയോമാസ് ആവശ്യകതാ ഫോം',
      'industry_page.card_sub': 'ആവശ്യമായ അളവ്, അവശിഷ്ടത്തിന്റെ തരം, മുൻഗണനാ ജില്ല എന്നിവ രേഖപ്പെടുത്തുക.',

      // Form Field Labels
      'form.name': 'പൂർണ്ണ പേര്',
      'form.phone': 'ഫോൺ നമ്പർ (10 അക്കങ്ങൾ)',
      'form.residue_type': 'അവശിഷ്ടത്തിന്റെ തരം',
      'form.quantity_tons': 'അളവ് (ടണ്ണിൽ)',
      'form.state': 'സംസ്ഥാനം',
      'form.district': 'ജില്ല',
      'form.village': 'ഗ്രാമം',
      'form.expected_price': 'പ്രതീക്ഷിക്കുന്ന വില / ടണ്ണിന് (₹)',

      'form.industry_name': 'വ്യവസായം / കമ്പനിയുടെ പേര്',
      'form.contact_phone': 'ബന്ധപ്പെടേണ്ട ഫോൺ (10 അക്കങ്ങൾ)',
      'form.industry_type': 'വ്യവസായ തരം',
      'form.required_residue': 'ആവശ്യമായ അവശിഷ്ടം',
      'form.quantity_needed': 'ആവശ്യമായ അളവ് (ടണ്ണിൽ)',
      'form.preferred_state': 'മുൻഗണനാ സംസ്ഥാനം',
      'form.preferred_district': 'മുൻഗണനാ ജില്ല',
      'form.offered_price': 'നൽകുന്ന വില / ടണ്ണിന് (₹)',

      // Placeholders
      'placeholder.name': 'ഉദാ. സുരേഷ് കുമാർ',
      'placeholder.phone': 'ഉദാ. 9876543210',
      'placeholder.quantity': 'ഉദാ. 25',
      'placeholder.village': 'ഉദാ. ചിറ്റൂർ',
      'placeholder.expected_price': 'ഉദാ. 2200',
      'placeholder.industry_name': 'ഉദാ. ഗ്രീൻബയോ എനർജി ലിമിറ്റഡ്',
      'placeholder.quantity_needed': 'ഉദാ. 500',
      'placeholder.offered_price': 'ഉദാ. 2400',

      // Dropdown Options
      'residue.select': '-- അവശിഷ്ടത്തിന്റെ തരം തിരഞ്ഞെടുക്കുക --',
      'residue.paddy_straw': 'നെല്ല് വൈക്കോൽ (Paddy Straw)',
      'residue.wheat_straw': 'ഗോതമ്പ് വൈക്കോൽ (Wheat Straw)',
      'residue.sugarcane_bagasse': 'കരിമ്പ് ചണ്ടി (Sugarcane Bagasse)',
      'residue.maize_stalk': 'ചോളം തണ്ട് (Maize Stalk)',
      'residue.cotton_stalk': 'പരുത്തി തണ്ട് (Cotton Stalk)',
      'residue.any': 'എല്ലാ തരങ്ങളും (All Types)',

      'industry_type.select': '-- വ്യവസായ തരം തിരഞ്ഞെടുക്കുക --',
      'industry_type.biofuel': 'ബയോഫ്യൂവൽ & ഊർജ്ജം (Biofuel)',
      'industry_type.paper_mill': 'പേപ്പർ മിൽ (Paper Mill)',
      'industry_type.compost': 'കമ്പോസ്റ്റ് & വളം (Compost)',
      'industry_type.packaging': 'പരിസ്ഥിതി സൗഹൃദ പാക്കേജിംഗ് (Packaging)',

      'state.select': '-- സംസ്ഥാനം തിരഞ്ഞെടുക്കുക --',
      'district.select': '-- ജില്ല തിരഞ്ഞെടുക്കുക --',
      'district.select_state_first': '-- ആദ്യം സംസ്ഥാനം തിരഞ്ഞെടുക്കുക --',

      // States
      'state.punjab': 'പഞ്ചാബ് (Punjab)',
      'state.haryana': 'ഹരിയാന (Haryana)',
      'state.uttar_pradesh': 'ഉത്തർപ്രദേശ് (Uttar Pradesh)',
      'state.andhra_pradesh': 'ആന്ധ്രാപ്രദേശ് (Andhra Pradesh)',
      'state.telangana': 'തെലങ്കാന (Telangana)',
      'state.karnataka': 'കർണാടക (Karnataka)',
      'state.tamil_nadu': 'തമിഴ്‌നാട് (Tamil Nadu)',
      'state.kerala': 'കേരളം (Kerala)',

      // Buttons & Feedback
      'form.submit_farmer': 'വിള അവശിഷ്ടം ലിസ്റ്റ് ചെയ്യുക',
      'form.submit_industry': 'ആവശ്യകത സമർപ്പിക്കുക',
      'form.submitting': 'സമർപ്പിക്കുന്നു...',
      'form.success_farmer': 'വിവരങ്ങൾ വിജയകരമായി സമർപ്പിച്ചു! നിങ്ങളുടെ ജില്ലയിലെ താൽപ്പര്യമുള്ള വാങ്ങലുകാരുമായി ഞങ്ങൾ ബന്ധിപ്പിക്കും.',
      'form.success_industry': 'നിങ്ങളുടെ ആവശ്യം വിജയകരമായി രജിസ്റ്റർ ചെയ്തു! പ്രാദേശിക കർഷകരുമായി ബന്ധിപ്പിക്കുന്നതാണ്.',
      'form.footer_note': 'നിങ്ങളുടെ വിവരങ്ങൾ പരിശോധിച്ചുറപ്പിച്ച അഗ്രിലിങ്ക് പങ്കാളികളുമായി മാത്രമേ പങ്കിടുകയുള്ളൂ.',
      'mock.badge': 'ഡെമോ മോഡ് (മോക്ക് സ്റ്റോറേജ്)',

      // Validation Errors
      'error.required': 'ഈ വിവരം നൽകേണ്ടതുണ്ട്',
      'error.phone_invalid': 'സാധുവായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക',
      'error.number_positive': '0-ൽ കൂടുതൽ ഉള്ള സാധുവായ അളവ് നൽകുക',
      'error.price_positive': '0-ൽ കൂടുതൽ ഉള്ള സാധുവായ തുക നൽകുക',
      'error.select_option': 'ലിസ്റ്റിൽ നിന്ന് ഒരു ഓപ്ഷൻ തിരഞ്ഞെടുക്കുക',
      'error.server_unreachable': 'Unable to connect to the server. Please try again later.',
      'error.general': 'അപ്രതീക്ഷിതമായ ഒരു തകരാറുണ്ടായി. ദയവായി വീണ്ടും ശ്രമിക്കുക.',

      // Matches Portal Specific Keys
      'matches.badge': 'സ്മാർട്ട് മാച്ചിംഗ് എഞ്ചിൻ',
      'matches.title': 'ബയോമാസ് കരാറുകളും പൊരുത്തങ്ങളും',
      'matches.subtitle': 'വിള അവശിഷ്ട തരം, ദൂരം, വില, അളവ് എന്നിവയെ അടിസ്ഥാനമാക്കി കർഷകരെയും വ്യവസായങ്ങളെയും കൃത്യമായി സംയോജിപ്പിക്കുന്നു.',
      'matches.count': 'യോജിച്ച കരാറുകൾ കണ്ടെത്തി',
      'matches.load_demo': 'ഡെമോ ഡാറ്റ ലോഡ് ചെയ്യുക',
      'matches.clear_data': 'ഡാറ്റ മായ്‌ക്കുക',
      'matches.sample_data': 'സാമ്പിൾ ഡാറ്റ',
      'matches.filter_residue': 'അവശിഷ്ടത്തിന്റെ തരം',
      'matches.filter_state': 'സംസ്ഥാനം',
      'matches.filter_max_price': 'പരമാവധി വില / ടണ്ണിന് (₹)',
      'matches.sort_by': 'ക്രമീകരിക്കുക',
      'matches.sort_score': 'ഉയർന്ന പൊരുത്ത സ്കോർ',
      'matches.sort_distance': 'കുറഞ്ഞ ദൂരം',
      'matches.sort_price': 'കുറഞ്ഞ വില / ടൺ',
      'matches.all_residues': 'എല്ലാ അവശിഷ്ടങ്ങളും',
      'matches.all_states': 'എല്ലാ സംസ്ഥാനങ്ങളും',
      'matches.col_farmer': 'കർഷകൻ',
      'matches.col_industry': 'വ്യവസായ വാങ്ങലുകാരൻ',
      'matches.col_residue': 'അവശിഷ്ടം',
      'matches.col_qty': 'അളവ്',
      'matches.col_distance': 'ദൂരം',
      'matches.col_farmer_ask': 'കർഷകന്റെ നിരക്ക്',
      'matches.col_industry_offer': 'കമ്പനി വാഗ്ദാനം',
      'matches.col_gap': 'വില വ്യത്യാസം',
      'matches.col_score': 'പൊരുത്ത സ്കോർ',
      'matches.col_action': 'നടപടി',
      'matches.book_btn': 'കരാർ ഉറപ്പിക്കുക',
      'matches.booked': 'ബുക്ക് ചെയ്തു',
      'status.pending': 'സ്ഥിരീകരണം കാത്തിരിക്കുന്നു',
      'status.available': 'ലഭ്യമാണ്',
      'matches.empty_title': 'പൊരുത്തങ്ങളൊന്നും കണ്ടെത്തിയില്ല',
      'matches.empty_desc': 'നിലവിൽ യോജിച്ച കരാറുകളൊന്നും ലഭ്യമല്ല. സാമ്പിൾ കരാറുകൾ കാണാൻ മുകളിലെ "ഡെമോ ഡാറ്റ ലോഡ് ചെയ്യുക" ക്ലിക്ക് ചെയ്യുക.',
      'matches.score_breakdown_title': 'സ്കോർ വിശദാംശങ്ങൾ',
      'matches.score_tap_hint': 'പോയിന്റുകൾ കാണാൻ ടാപ്പ് ചെയ്യുക',
      'matches.score_residue': 'അവശിഷ്ട അനുയോജ്യത',
      'matches.score_distance': 'ഭൂമിശാസ്ത്രപരമായ ദൂരം',
      'matches.score_price': 'വില അനുയോജ്യത',
      'matches.score_quantity': 'അളവിന്റെ കവറേജ്',
      'matches.score_total': 'ആകെ പൊരുത്ത സ്കോർ',
      'matches.modal_title': 'കരാർ ബുക്കിംഗ് സ്ഥിരീകരിക്കുക',
      'matches.modal_desc': 'ഈ കർഷകനും കമ്പനിക്കും ഇടയിലുള്ള കരാർ നിർദ്ദേശം സമർപ്പിക്കുക. സ്ഥിരീകരണത്തിനായി ഇരുവർക്കും വിവരം ലഭിക്കും.',
      'matches.modal_confirm': 'ബുക്കിംഗ് സ്ഥിരീകരിക്കുക',
      'matches.modal_cancel': 'റദ്ദാക്കുക',
      'matches.booking_success': 'ബുക്കിംഗ് വിജയകരമായി സമർപ്പിച്ചു! നിലവിലെ അവസ്ഥ: സ്ഥിരീകരണം കാത്തിരിക്കുന്നു.',

      // Impact Dashboard Specific Keys
      'impact.badge': 'പാരിസ്ഥിതിക & ESG നേട്ടങ്ങൾ',
      'impact.title': 'സുസ്ഥിരതയും സാമ്പത്തിക നേട്ടങ്ങളും',
      'impact.subtitle': 'തടഞ്ഞ മലിനീകരണം, കർഷകരുടെ വരുമാനം, ഹരിത വ്യവസായ പരിവർത്തനം എന്നിവയുടെ അളവുകോൽ.',
      'impact.sample_badge': 'സാമ്പിൾ ഡാറ്റ നിലവിലുണ്ട്',
      'impact.toggle_booked': 'ബുക്ക് ചെയ്ത കരാറുകൾ',
      'impact.toggle_potential': 'സാധ്യതകൾ (പൊരുത്തങ്ങളിൽ നിന്ന്)',
      'impact.mode_notice_booked': 'ബുക്ക് ചെയ്ത ഇടപാടുകളിൽ നിന്നുള്ള കണക്കുകൾ കാണിക്കുന്നു (ഡെമോ, ഈ ബ്രൗസറിൽ സൂക്ഷിച്ചത്)',
      'impact.mode_notice_potential': 'ലഭ്യമായ പൊരുത്തങ്ങളിൽ നിന്നുള്ള സാധ്യതകൾ (ഒരു കർഷകന് ഒരു തവണ മാത്രം കണക്കാക്കുന്നു).',

      // Summary Cards
      'impact.card_farmer_earnings': 'കർഷകരുടെ ആകെ വരുമാനം',
      'impact.card_residue_diverted': 'തീയിടാതെ മാറ്റിയ അവശിഷ്ടങ്ങൾ',
      'impact.card_co2_avoided': 'ഒഴിവാക്കിയ CO₂ ഉദ്‌വമനം',
      'impact.card_trees_equiv': 'നട്ടുപിടിപ്പിച്ച മരങ്ങൾക്ക് തുല്യം',
      'impact.card_carbon_credits': 'സാധ്യതയുള്ള കാർബൺ ക്രെഡിറ്റുകൾ (അനുമാനം)',
      'impact.card_credit_value': 'ക്രെഡിറ്റിന്റെ വിപണി മൂല്യം',
      'impact.card_platform_fee': 'വ്യാപാര പ്ലാറ്റ്‌ഫോം ഫീസ് (2%)',
      'impact.card_brokerage_comm': 'ക്രെഡിറ്റിലെ പ്ലാറ്റ്‌ഫോം കമ്മീഷൻ (10%)',
      'impact.credit_verification_note': 'യഥാർത്ഥ ക്രെഡിറ്റുകൾക്ക് മൂന്നാം കക്ഷി സാക്ഷ്യപ്പെടുത്തൽ ആവശ്യമാണ്.',

      // Charts
      'impact.chart_earnings_title': 'കർഷകരുടെ വരുമാനം (₹)',
      'impact.chart_industry_title': 'വ്യവസായ ബയോമാസ് ആവശ്യം (ടൺ)',
      'impact.chart_residue_title': 'അവശിഷ്ട തരം തിരിച്ചുള്ള അളവ്',
      'impact.chart_earnings_axis': 'വരുമാനം (₹)',
      'impact.chart_industry_axis': 'അളവ് (ടൺ)',

      // Government View
      'impact.govt_title': 'സർക്കാർ & നിയന്ത്രണ റിപ്പോർട്ട്',
      'impact.govt_subtitle': 'ഉപയോഗിച്ച വിള അവശിഷ്ടങ്ങളുടെയും ഒഴിവാക്കിയ കണക്കാക്കിയ ഉദ്വമനങ്ങളുടെയും ജില്ലാ തല സംഗ്രഹം',
      'impact.govt_residue_utilised': 'പുനരുപയോഗിച്ച ആകെ അവശിഷ്ടം',
      'impact.govt_co2_saved': 'ആകെ സംരക്ഷിച്ച CO₂',
      'impact.govt_districts_covered': 'ഉൾപ്പെട്ട ജില്ലകൾ',
      'impact.govt_unit_tons': 'ടൺ',
      'impact.govt_unit_tonnes': 'ടൺ CO₂e',
      'impact.govt_unit_districts': 'ജില്ലകൾ',

      // Methodology & Assumptions
      'impact.calc_title': 'കണക്കുകൂട്ടൽ രീതി',
      'impact.calc_disclaimer': 'Estimated value used for demonstration; to be replaced with a verified emission factor.',
      'impact.calc_editable_label': 'ഉദ്‌വമന ഘടകം (ഒരു ടൺ അവശിഷ്ടത്തിന് ഒഴിവാക്കിയ CO₂ കിലോഗ്രാം):',
      'impact.calc_reset_btn': 'യഥാർത്ഥ നിരക്കിലേക്ക് മാറ്റുക (1,460)',
      'impact.calc_f1_title': 'ഒഴിവാക്കിയ ഉദ്‌വമനം',
      'impact.calc_f1_desc': 'മാറ്റിയ അവശിഷ്ടം (ടൺ) × ഉദ്‌വമന ഘടകം (കിലോ/ടൺ) ÷ 1,000',
      'impact.calc_f2_title': 'മരങ്ങൾ ആഗിരണം ചെയ്യുന്നതിന് തുല്യം',
      'impact.calc_f2_desc': 'ഒഴിവാക്കിയ ആകെ CO₂ (കിലോ) ÷ ഒരു മരം പ്രതിവർഷം ആഗിരണം ചെയ്യുന്ന 21 കിലോ CO₂',
      'impact.calc_f3_title': 'കാർബൺ ക്രെഡിറ്റും കമ്മീഷനും',
      'impact.calc_f3_desc': '1 ടൺ CO₂e = 1 ക്രെഡിറ്റ് (₹800). ക്രെഡിറ്റിൽ 10% കമ്മീഷനും വ്യാപാരത്തിൽ 2% പ്ലാറ്റ്‌ഫോം ഫീസും.',

      // Empty State
      'impact.empty_title': 'ഡാറ്റ ലഭ്യമല്ല',
      'impact.empty_desc': 'ഇതുവരെ കരാറുകളോ പൊരുത്തങ്ങളോ രേഖപ്പെടുത്തിയിട്ടില്ല. ഡാറ്റ കാണുന്നതിന് പൊരുത്തങ്ങളുടെ പോർട്ടലിൽ കരാറുകൾ ഉറപ്പിക്കുകയോ സാമ്പിൾ ഡാറ്റ ലോഡ് ചെയ്യുകയോ ചെയ്യുക.',
      'impact.empty_btn': 'പൊരുത്തങ്ങളുടെ പോർട്ടലിലേക്ക് പോകുക',

      // === Features Expansion (Clusters, Logistics, Roadmap, Policy, Demo) ===
      'clusters.badge': 'സ്മാർട്ട് കളക്ഷൻ നെറ്റ്‌വർക്ക്',
      'clusters.best_industry': 'ഏറ്റവും അനുയോജ്യമായ വ്യവസായം',
      'clusters.covers_demand': 'വ്യവസായ ആവശ്യത്തിന്റെ {pct}% നിറവേറ്റുന്നു',
      'clusters.empty_btn': 'ഡെമോ ഡാറ്റ ലോഡ് ചെയ്യുക',
      'clusters.empty_desc': 'ക്ലസ്റ്റർ രൂപീകരിക്കാൻ 50 കി.മീ ചുറ്റളവിൽ ഒരേ അവശിഷ്ടമുള്ള ചുരുങ്ങിയത് രണ്ട് കർഷകർ ആവശ്യമാണ്. സാമ്പിൾ കാണാൻ ഡെമോ ഡാറ്റ ലോഡ് ചെയ്യുക.',
      'clusters.empty_title': 'ഇതുവരെ കർഷക ക്ലസ്റ്ററുകൾ രൂപീകരിച്ചിട്ടില്ല',
      'clusters.estimated_trucks': 'ആവശ്യമായ ലോറികൾ',
      'clusters.from_hub': 'ഹബ്ബിൽ നിന്ന്',
      'clusters.highest_ask': 'ഏറ്റവും ഉയർന്ന കർഷക വില',
      'clusters.hub_center': 'പ്രധാന ഹബ്ബ്',
      'clusters.hub_label': 'ശേഖരണ ഹബ്ബ് ജില്ല',
      'clusters.industry_offer': 'വ്യവസായ വാഗ്ദാനം',
      'clusters.members_title': 'അംഗ കർഷകർ',
      'clusters.no_industry': 'ഈ ക്ലസ്റ്റർ അളവിനായി അനുയോജ്യമായ വ്യവസായ ഉപഭോക്താവിനെ ഇതുവരെ കണ്ടെത്തിയില്ല.',
      'clusters.pickup_point': 'നിർദ്ദേശിച്ച പിക്കപ്പ് കേന്ദ്രം',
      'clusters.subtitle': 'വ്യാവസായിക ആവശ്യങ്ങൾ കാര്യക്ഷമമായി നിറവേറ്റുന്നതിന് 50 കി.മീ പരിധിയിലെ കർഷകരെ കൂട്ടായ്മകളാക്കി മാറ്റുന്നു.',
      'clusters.title': 'ബയോമാസ് സംയോജന ക്ലസ്റ്ററുകൾ',
      'clusters.total_volume': 'ആകെ സമാഹരിച്ച അളവ്',
      'clusters.trucks_count': '{count} ലോറികൾ',
      'clusters.trucks_unit': 'ലോറികൾ (ലോറിക്ക് 10 ടൺ)',
      'clusters.unclustered_note': '{count} കർഷകർക്ക് ഇതുവരെ അടുത്തുള്ള കൂട്ടായ്മ ലഭ്യമല്ല',
      'clusters.why_desc': 'ഒരു വ്യവസായത്തിന്റെ കുറഞ്ഞ ഓർഡർ തുക തികയ്ക്കാൻ ചെറുകിട കർഷകർ അളവ് സംയോജിപ്പിക്കുന്നു.',
      'clusters.why_title': 'എന്തുകൊണ്ട് ക്ലസ്റ്റർ?',
      'coming_soon.alerts': 'എസ്എംഎസ്, വാട്ട്‌സ്ആപ്പ് അറിയിപ്പുകൾ',
      'coming_soon.badge': 'ഉടൻ വരുന്നു',
      'coming_soon.map_view': 'മാപ്പ് കാഴ്ച',
      'coming_soon.negotiation': 'വില ചർച്ചകൾ',
      'coming_soon.otp_login': 'ഫോൺ ഒടിപി ലോഗിൻ',
      'coming_soon.quality_grades': 'ഗുണനിലവാര ഗ്രേഡുകൾ',
      'coming_soon.subtitle': 'വിള അവശിഷ്ട വ്യാപാരം ലളിതവും വേഗതയേറിയതുമാക്കാൻ രൂപകൽപ്പന ചെയ്യുന്ന പുതിയ സവിശേഷതകൾ.',
      'coming_soon.title': 'പ്ലാറ്റ്‌ഫോം റോഡ്‌മാപ്പും വരാനിരിക്കുന്ന സവിശേഷതകളും',
      'coming_soon.upi_payment': 'യുപിഐ പേയ്‌മെന്റ്',
      'coming_soon.voice_input': 'വോയ്‌സ് ഇൻപുട്ട്',
      'demo.load_btn': 'ഡെമോ മോഡ്',
      'demo.loaded_success': 'ഡെമോ ഡാറ്റ വിജയകരമായി ലോഡ് ചെയ്തു!',
      'demo.reset_btn': 'ഡെമോ പുനഃസജ്ജമാക്കുക',
      'demo.reset_success': 'ഡെമോ വിവരങ്ങൾ നീക്കം ചെയ്തു. നിങ്ങളുടെ സമർപ്പണങ്ങൾ സുരക്ഷിതമാണ്.',
      'logistics.advance_status': 'നില മാറ്റുക',
      'logistics.estimated_trucks': 'ആവശ്യമായ ലോറികൾ',
      'logistics.mock_payment': 'മോക്ക് പേയ്മെന്റ് (ഡെമോ മാത്രം)',
      'logistics.payment_note': 'പിക്കപ്പ് സമയത്ത് നടക്കുന്ന സാങ്കൽപ്പിക പേയ്‌മെന്റ് പ്രക്രിയ.',
      'logistics.pickup_date': 'നിർദ്ദേശിച്ച പിക്കപ്പ് തീയതി',
      'logistics.pickup_district': 'പിക്കപ്പ് ജില്ല',
      'logistics.status_label': 'ഇടപാട് നില',
      'logistics.step_confirmed': 'സ്ഥിരീകരിച്ചു',
      'logistics.step_pending': 'തീർപ്പുകൽപ്പിക്കാത്തത്',
      'logistics.step_picked_up': 'ലോഡ് ചെയ്തു',
      'logistics.title': 'ഇടപാടും ലോജിസ്റ്റിക്സ് വിവരങ്ങളും',
      'logistics.trucks_unit': 'ലോറികൾ (ലോറിക്ക് 10 ടൺ)',
      'nav.clusters': 'ക്ലസ്റ്ററുകൾ',
      'policy.desc': 'സുസ്ഥിര വിള അവശിഷ്ട പരിപാലനം നടത്തുന്ന കർഷകർക്ക് സർക്കാർ ആനുകൂല്യങ്ങൾക്കും കാർബൺ ക്രെഡിറ്റ് വരുമാന അവസരങ്ങൾക്കും അർഹതയുണ്ടായേക്കാം.',
      'policy.note': 'നിലവിലെ പദ്ധതികൾക്കായി ഔദ്യോഗിക വിവരങ്ങൾ പരിശോധിക്കുക.',
      'policy.title': 'പിന്തുണ പദ്ധതികളും കാർബൺ ക്രെഡിറ്റുകളും',
    }
  };

  /**
   * Safe getter with English fallback and parameter interpolation
   */
  function t(key, langOrParams, maybeParams) {
    let lang = currentLanguage;
    let params = null;

    if (typeof langOrParams === 'string') {
      lang = langOrParams;
      params = maybeParams;
    } else if (langOrParams && typeof langOrParams === 'object') {
      params = langOrParams;
    }

    const activeLang = (lang && typeof lang === 'string') ? lang : currentLanguage;
    let res = key;

    if (translations[activeLang] && translations[activeLang][key] !== undefined) {
      res = translations[activeLang][key];
    } else if (translations[DEFAULT_LANG] && translations[DEFAULT_LANG][key] !== undefined) {
      res = translations[DEFAULT_LANG][key];
    }

    if (params && typeof params === 'object') {
      Object.keys(params).forEach(k => {
        res = res.replace(new RegExp('\\{' + k + '\\}', 'g'), params[k]);
      });
    }

    return res;
  }

  function getInitialLanguage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
        return stored;
      }
    } catch (e) {
      console.warn('AgriLink i18n: localStorage access failed', e);
    }

    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase().split('-')[0];
    if (SUPPORTED_LANGUAGES.includes(browserLang)) {
      return browserLang;
    }

    return DEFAULT_LANG;
  }

  let currentLanguage = getInitialLanguage();

  function applyTranslations(lang) {
    if (lang && SUPPORTED_LANGUAGES.includes(lang)) {
      currentLanguage = lang;
    }

    try {
      localStorage.setItem(STORAGE_KEY, currentLanguage);
    } catch (e) {
      console.warn('AgriLink i18n: Could not write to localStorage', e);
    }

    document.documentElement.lang = currentLanguage;

    document.querySelectorAll('[data-i18n]').forEach(node => {
      const key = node.getAttribute('data-i18n');
      const translated = t(key, currentLanguage);
      if (translated) {
        node.textContent = translated;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(node => {
      const key = node.getAttribute('data-i18n-placeholder');
      const translated = t(key, currentLanguage);
      if (translated) {
        node.setAttribute('placeholder', translated);
      }
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(node => {
      const key = node.getAttribute('data-i18n-aria-label');
      const translated = t(key, currentLanguage);
      if (translated) {
        node.setAttribute('aria-label', translated);
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(node => {
      const key = node.getAttribute('data-i18n-title');
      const translated = t(key, currentLanguage);
      if (translated) {
        node.setAttribute('title', translated);
      }
    });

    document.querySelectorAll('select.lang-select, #lang-select').forEach(sel => {
      if (sel.value !== currentLanguage) {
        sel.value = currentLanguage;
      }
    });

    window.dispatchEvent(new CustomEvent('agrilink:languageChanged', {
      detail: { language: currentLanguage }
    }));
  }

  function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`AgriLink i18n: Unsupported language '${lang}'`);
      return;
    }
    applyTranslations(lang);
  }

  function bindLanguageSelectors() {
    document.querySelectorAll('select.lang-select, #lang-select').forEach(select => {
      select.value = currentLanguage;
      select.addEventListener('change', function (e) {
        setLanguage(e.target.value);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindLanguageSelectors();
      applyTranslations(currentLanguage);
    });
  } else {
    bindLanguageSelectors();
    applyTranslations(currentLanguage);
  }

  window.AgriLinkI18n = {
    t,
    setLanguage,
    getLanguage: () => currentLanguage,
    getSupportedLanguages: () => [...SUPPORTED_LANGUAGES],
    applyTranslations,
    translations
  };
})();
