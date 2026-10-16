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
      'error.general': 'An unexpected error occurred. Please try again.'
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
      'error.general': 'एक अप्रत्याशित त्रुटि हुई। कृपया पुनः प्रयास करें।'
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
      'error.general': 'అనుకోని లోపం జరిగింది. దయచేసి మళ్లీ ప్రయత్నించండి.'
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
      'error.general': 'ಅನಿರೀಕ್ಷಿತ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
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
      'error.general': 'எதிர்பாராத பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.'
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
      'error.general': 'അപ്രതീക്ഷിതമായ ഒരു തകരാറുണ്ടായി. ദയവായി വീണ്ടും ശ്രമിക്കുക.'
    }
  };

  /**
   * Safe getter with English fallback
   */
  function t(key, lang) {
    const activeLang = lang || currentLanguage;
    if (translations[activeLang] && translations[activeLang][key]) {
      return translations[activeLang][key];
    }
    // Fallback to English
    if (translations[DEFAULT_LANG] && translations[DEFAULT_LANG][key]) {
      return translations[DEFAULT_LANG][key];
    }
    return key;
  }

  /**
   * Determine initial language:
   * 1. localStorage preference
   * 2. Browser language if matched in supported list
   * 3. Default to 'en'
   */
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

  /**
   * Render all translations onto the DOM
   */
  function applyTranslations(lang) {
    if (lang && SUPPORTED_LANGUAGES.includes(lang)) {
      currentLanguage = lang;
    }

    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, currentLanguage);
    } catch (e) {
      console.warn('AgriLink i18n: Could not write to localStorage', e);
    }

    // Update <html lang="...">
    document.documentElement.lang = currentLanguage;

    // Translate standard text contents
    const textNodes = document.querySelectorAll('[data-i18n]');
    textNodes.forEach(node => {
      const key = node.getAttribute('data-i18n');
      const translated = t(key, currentLanguage);
      if (translated) {
        node.textContent = translated;
      }
    });

    // Translate placeholder attributes
    const placeholderNodes = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderNodes.forEach(node => {
      const key = node.getAttribute('data-i18n-placeholder');
      const translated = t(key, currentLanguage);
      if (translated) {
        node.setAttribute('placeholder', translated);
      }
    });

    // Translate aria-label attributes
    const ariaNodes = document.querySelectorAll('[data-i18n-aria-label]');
    ariaNodes.forEach(node => {
      const key = node.getAttribute('data-i18n-aria-label');
      const translated = t(key, currentLanguage);
      if (translated) {
        node.setAttribute('aria-label', translated);
      }
    });

    // Translate title attributes
    const titleNodes = document.querySelectorAll('[data-i18n-title]');
    titleNodes.forEach(node => {
      const key = node.getAttribute('data-i18n-title');
      const translated = t(key, currentLanguage);
      if (translated) {
        node.setAttribute('title', translated);
      }
    });

    // Sync any language select elements in the document
    const selects = document.querySelectorAll('select.lang-select, #lang-select');
    selects.forEach(sel => {
      if (sel.value !== currentLanguage) {
        sel.value = currentLanguage;
      }
    });

    // Dispatch event for other custom JS widgets
    window.dispatchEvent(new CustomEvent('agrilink:languageChanged', {
      detail: { language: currentLanguage }
    }));
  }

  /**
   * Set language programmatically
   */
  function setLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      console.warn(`AgriLink i18n: Unsupported language '${lang}'. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`);
      return;
    }
    applyTranslations(lang);
  }

  /**
   * Bind event listeners to all language selector dropdowns
   */
  function bindLanguageSelectors() {
    const selects = document.querySelectorAll('select.lang-select, #lang-select');
    selects.forEach(select => {
      select.value = currentLanguage;
      select.addEventListener('change', function (e) {
        setLanguage(e.target.value);
      });
    });
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindLanguageSelectors();
      applyTranslations(currentLanguage);
    });
  } else {
    bindLanguageSelectors();
    applyTranslations(currentLanguage);
  }

  // Expose global API
  window.AgriLinkI18n = {
    t,
    setLanguage,
    getLanguage: () => currentLanguage,
    getSupportedLanguages: () => [...SUPPORTED_LANGUAGES],
    applyTranslations,
    translations
  };
})();
