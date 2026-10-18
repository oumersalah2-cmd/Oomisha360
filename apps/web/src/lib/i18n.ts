export type Language = 'en' | 'om' | 'am';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'om', label: 'Afaan Oromoo', nativeLabel: 'Afaan Oromoo', flag: '🌳' },
  { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ', flag: '🇪🇹' },
];

export const translations = {
  en: {
    // Top Banner
    badge: 'Official Ethiopian MoA / EAA Registry & Verified Oromia Suppliers',
    title: 'Crop Protection & Agricultural Medicines',
    subtitle:
      'Discover registered fungicides, insecticides, herbicides, seed protectants, and biological controls approved for Ethiopia. Compare prices from verified dealers across Oromia woredas, view safe application labels, and cross-reference with Gebere Vision AI.',
    regionalNote: 'Serving Farmers Across All Zones of Oromia',
    aiDiagnoseBtn: 'Diagnose Leaf Disease with AI',
    listDealerBtn: 'List as Authorized Agro-Dealer',

    // Stats
    statRegistered: 'Registered Medicines',
    statOffers: 'Verified Dealer Offers',
    statCoverage: 'Oromia Wide Coverage',
    statVerified: '100% MoA / EAA Verified',

    // Search and Filters
    searchPlaceholder:
      'Search product name, active ingredient, disease (e.g. rust, CBD, blotch), or registration #...',
    searchBtn: 'Search',
    filterByCrop: 'Filter by Priority Crop:',
    allCrops: 'All Crops',
    allCategories: 'All Categories',
    allZones: 'All Zones',
    categories: {
      all: 'All Categories',
      fungicide: 'Fungicides',
      insecticide: 'Insecticides',
      herbicide: 'Herbicides',
      seed_treatment: 'Seed Treatments',
      biological_control: 'Biological Controls',
    },
    crops: {
      all: 'All',
      Coffee: 'Coffee',
      Teff: 'Teff',
      Wheat: 'Wheat',
      Barley: 'Barley',
    },

    // Product Card
    approvedCrops: 'Approved Crops:',
    targetPests: 'Target Diseases / Pests:',
    phiLabel: '⏱️ PHI:',
    days: 'days',
    localOffersFrom: 'Local Offers from:',
    dealersOnRequest: 'Dealers on request',
    viewLabelBtn: 'View Label & Dealers',
    brand: 'Brand',
    activeIng: 'Active Ingredient',

    // Modal Details
    modalRegBadge: 'Verified National Registry Record',
    regAuthority: 'Registration Authority:',
    sourceOrg: 'Source Authority:',
    whoRating: 'WHO Toxicity Rating:',
    phiDays: 'Pre-Harvest Interval (PHI):',
    approvedUsesTitle: 'Approved Agricultural Uses & Application Instructions',
    cropLabel: 'Crop:',
    targetProblemLabel: 'Target Problem:',
    appMethodLabel: 'Application Method:',
    optimalTimingLabel: 'Optimal Timing:',
    safetyLabelNote: 'Safety Label Note:',
    mandatoryPPE: 'Mandatory PPE Equipment',
    safetyPrecautions: 'Safety Precautions',
    safeStorage: 'Safe Storage:',
    safeDisposal: 'Safe Disposal:',
    localDealersTitle: 'Verified Local Input Dealers in Oromia',
    offersAvailable: 'offers available',
    licensedDealer: 'Licensed Dealer',
    inStock: 'In Stock',
    inquireBuyBtn: 'Inquire / Buy',
    closeBtn: 'Close Label',
    noDealersInZone:
      'No active input dealer listings currently registered in this zone. You can contact your Woreda Agricultural Cooperative Union directly.',

    // Inquiry Modal
    inquiryTitle: 'Contact Authorized Dealer',
    directLine: 'Direct Dealer Line:',
    fullNameLabel: 'Your Full Name:',
    phoneLabel: 'Your Phone Number:',
    quantityLabel: 'Quantity Needed:',
    totalEstLabel: 'Total Estimated:',
    messageLabel: 'Message or Pickup Note:',
    sendInquiryBtn: 'Send Order Inquiry',
    sendingBtn: 'Sending...',
    cancelBtn: 'Cancel',
    inquirySuccessTitle: 'Inquiry Transmitted!',
    inquirySuccessMsg:
      'The dealer has received your contact details and will call you shortly.',

    // Dealer Listing Modal
    dealerListingTitle: 'Authorized Agro-Dealer Listing',
    dealerListingSubtitle:
      'Publish verified inventory for legal crop-protection medicines in Oromia.',
    selectProductLabel: 'Select Registered Product (Mandatory Registration Check):',
    selectProductDefault: '-- Choose Registered Product --',
    dealerNameLabel: 'Dealer / Company Name:',
    storeNameLabel: 'Store / Depot Name:',
    packageSizeLabel: 'Package Size:',
    priceLabel: 'Price (ETB):',
    zoneLabel: 'Zone (Oromia):',
    woredaLabel: 'Woreda:',
    licenseLabel: 'Dealer License #:',
    contactPhoneLabel: 'Contact Phone:',
    publishBtn: 'Publish Inventory',
    publishingBtn: 'Publishing...',
    publishSuccessTitle: 'Inventory Listed Successfully!',
    publishSuccessMsg: 'Your offer is now visible to farmers across Oromia.',

    // IPM Educational Guide
    ipmTitle: 'Integrated Pest Management (IPM) & Safety Policy',
    ipmBody:
      'Chemical crop medicines must never be applied as a routine prophylactic measure. Always adopt IPM hierarchy: (1) Plant certified disease-resistant varieties developed by EIAR/JARC/DZARC; (2) Implement field sanitation and 2-year crop rotations with non-host legumes; (3) Encourage beneficial biological predators and bio-control protectants; (4) Apply synthetic chemical treatments strictly when economic thresholds are breached and confirmed with your Kebele Development Agent (DA).',
    ipmRule1: 'Never spray during flowering hours to protect honeybee colonies.',
    ipmRule2: 'Triple-rinse and puncture chemical containers; never store food in them.',
    ipmRule3: 'Strictly observe Pre-Harvest Intervals (PHI) before marketing crops.',

    // Empty / Error
    noProductsMatch: 'No registered products matched your filters',
    noProductsAdvice:
      'Try broadening your search term or select "All Crops" and "All Categories" to view all officially evaluated Ethiopian crop protection products.',
    resetFiltersBtn: 'Reset Filters',
    loadingText: 'Querying verified agricultural medicines...',

    // Gebere Vision AI Integration
    aiIntegrationTitle: 'Verified Crop Protection Medicines',
    aiSafetyWarningTitle: 'Strict Safety & Non-Prescription Notice:',
    aiSafetyWarningBody:
      'AI diagnosis is strictly preliminary and does NOT prescribe chemical pesticides. Never guess mixing dosages or apply off-label products. Always prioritize cultural sanitation and inspect field economic damage thresholds with your local Development Agent (DA).',
    aiExploreCatalog: 'Explore Catalog',
    aiFindDealers: 'Find Dealers',
  },

  om: {
    // Top Banner
    badge: 'Galmee Mootummaa Itiyoophiyaa (MoA/EAA) fi Daldaltoota Hayyama Qaban Oromiyaa',
    title: 'Eegumsa Oomishaa fi Qorichoota Qonnaa',
    subtitle:
      'Qorichoota farra fangaasii, farra ilbiisotaa, farra aramaa, qoricha sanyii, fi to’annoo baayoloojikaalaa Itiyoophiyaatti beekamtii argatan argadhaa. Gatii daldaltoota hayyama qaban aanaalee Oromiyaa keessaa wal-bira qabaa, qajeelfama fayyadama nageenyaa dubbisaa, akkasumas Gebere Vision AI waliin qindeessaa.',
    regionalNote: 'Qonnaan Bultoota Godinoota Oromiyaa Hundaaf',
    aiDiagnoseBtn: 'Dhibee Baalaa AI dhaan Qoradhu',
    listDealerBtn: 'Akka Daldalaa Qorichaatti Galmaa’i',

    // Stats
    statRegistered: 'Qorichoota Galmaa’an',
    statOffers: 'Dhiyeessii Daldaltootaa',
    statCoverage: 'Oromiyaa Guutuu',
    statVerified: '100% MoA / EAA Eeyyamame',

    // Search and Filters
    searchPlaceholder:
      'Maqaa qorichaa, qabiyyee keemikaalaa, dhibee (fakkeenyaaf: waagii, CBD), ykn lakk. galmee barbaadaa...',
    searchBtn: 'Barbaadi',
    filterByCrop: 'Akka Oomishaatti Calali:',
    allCrops: 'Oomisha Hunda',
    allCategories: 'Kutaa Qorichaa Hunda',
    allZones: 'Godinaalee Hunda',
    categories: {
      all: 'Kutaa Hunda',
      fungicide: 'Farra Fangaasii (Dhibee)',
      insecticide: 'Farra Ilbiisotaa',
      herbicide: 'Farra Aramaa',
      seed_treatment: 'Qoricha Qulqullina Sanyii',
      biological_control: 'To’annoo Baayoloojikaalaa',
    },
    crops: {
      all: 'Hunda',
      Coffee: 'Buna',
      Teff: 'Xaafii',
      Wheat: 'Qamadii',
      Barley: 'Garbuu',
    },

    // Product Card
    approvedCrops: 'Oomishaalee Eeyyamaman:',
    targetPests: 'Dhibeewwan fi Ilbiisota Qiyyaafatan:',
    phiLabel: '⏱️ Yeroo Eegumsaa (PHI):',
    days: 'guyyoota',
    localOffersFrom: 'Gatii Daldaltoota Naannoo:',
    dealersOnRequest: 'Gaaffiidhaan dhiyaata',
    viewLabelBtn: 'Qajeelfama fi Daldaltoota Ilaali',
    brand: 'Gosa Brandii',
    activeIng: 'Qabiyyee Qorichaa',

    // Modal Details
    modalRegBadge: 'Galmee Mootummaa Eeyyamamee fi Mirkanaa’e',
    regAuthority: 'Abbaa Taayitaa Galmeesse:',
    sourceOrg: 'Madda Odeeffannoo:',
    whoRating: 'Sadarkaa Balaa WHO:',
    phiDays: 'Yeroo Eegumsa Haamaa Duraa (PHI):',
    approvedUsesTitle: 'Fayyadama Qonnaa Eeyyamame fi Qajeelfama Biifaa',
    cropLabel: 'Oomisha:',
    targetProblemLabel: 'Dhibee / Ilbiisa:',
    appMethodLabel: 'Mala Itti Fayyadamaa:',
    optimalTimingLabel: 'Yeroo Sirrii Itti Biifamu:',
    safetyLabelNote: 'Hubachiisa Nageenya Waraqaa Qorichaa:',
    mandatoryPPE: 'Meeshaalee Eegumsa Dhuunfaa Dirqamaa',
    safetyPrecautions: 'Of Eeggannoo Nageenyaa',
    safeStorage: 'Haala Kuusaa Nageenya Qabu:',
    safeDisposal: 'Qodaa Qorichaa Dhabamsiisuu:',
    localDealersTitle: 'Daldaltoota Qorichaa Hayyama Qaban Oromiyaa Keessatti',
    offersAvailable: 'dhiyeessiin jiru',
    licensedDealer: 'Daldalaa Hayyama Qabu',
    inStock: 'Kuusaa Keessa Jira',
    inquireBuyBtn: 'Biti / Gaafadhu',
    closeBtn: 'Cufi',
    noDealersInZone:
      'Godina kana keessatti daldalaan qoricha kana gurguru yeroof hin galmoofne. Yuuniyeenii Qonnaan Bultoota Aanaa keessanii qunnamaa.',

    // Inquiry Modal
    inquiryTitle: 'Daldalaa Hayyama Qabu Qunnami',
    directLine: 'Bilbila Daldalaa Qajeeltoo:',
    fullNameLabel: 'Maqaa Keessan Guutuu:',
    phoneLabel: 'Lakk. Bilbila Keessanii:',
    quantityLabel: 'Hamma Barbaaddan:',
    totalEstLabel: 'Gatii Tilmaamaa Waliigalaa:',
    messageLabel: 'Ergaa ykn Ibsa Fudhannaa:',
    sendInquiryBtn: 'Gaaffii Ajajaa Ergi',
    sendingBtn: 'Ergamaa jira...',
    cancelBtn: 'Dhiisi',
    inquirySuccessTitle: 'Gaaffiin Keessan Daldalaaf Ergameera!',
    inquirySuccessMsg:
      'Daldalaan odeeffannoo keessan argatee jira, dafee isiniif bilbila.',

    // Dealer Listing Modal
    dealerListingTitle: 'Galmee Daldalaa Qoricha Qonnaa Hayyama Qabuu',
    dealerListingSubtitle:
      'Qorichoota seeraan eeyyamaman qonnaan bultoota Oromiyaatiif dhiyeessaa.',
    selectProductLabel: 'Qoricha Galmaa’e Filadhu (Dirqama Seeraa):',
    selectProductDefault: '-- Qoricha Galmaa’e Filadhaa --',
    dealerNameLabel: 'Maqaa Daldalaa / Dhaabbataa:',
    storeNameLabel: 'Maqaa Kuusaa / Suuqii:',
    packageSizeLabel: 'Hamma Qodaa (Saayizii):',
    priceLabel: 'Gatii (Qarshii):',
    zoneLabel: 'Godina (Oromiyaa):',
    woredaLabel: 'Aanaa:',
    licenseLabel: 'Lakk. Hayyama Daldalaa:',
    contactPhoneLabel: 'Lakk. Bilbilaa:',
    publishBtn: 'Gabaaf Dhiyeessi',
    publishingBtn: 'Dhiyaachaa jira...',
    publishSuccessTitle: 'Qorichi Milkaa’inaan Galmaa’eera!',
    publishSuccessMsg: 'Qorichi keessan amma qonnaan bultoota Oromiyaa hundaaf mul’ata.',

    // IPM Educational Guide
    ipmTitle: 'Imaammata Nageenyaa fi To’annoo Dhibee Qindaa’aa (IPM)',
    ipmBody:
      'Qorichi keemikaalaa matumaa akka barachuutti yeroo hunda biifamuu hin qabu. Yeroo hunda sadarkaa IPM hordofaa: (1) Sanyii filatamaa dhibee dandamatu kan EIAR/JARC/DZARC qopheesse facaasaa; (2) Qulqullina maasii eegaa, oomisha jijjiirraa waggaa lamaa dhangaggoo waliin godhaa; (3) Uumamoota ilbiisa gaarii fi qoricha uumamaa jajjabeessaa; (4) Keemikaala yeroo miidhaan dinagdee guddatee fi ogeessa DA aanaatiin mirkanaa’e qofa biifaa.',
    ipmRule1: 'Kanniisa dammaa eeguuf yeroo abaaboon darbutti matumaa hin biifinaa.',
    ipmRule2: 'Qodaa qorichaa si’a sadii dhiqaatii tarsaasaa; matumaa nyaata keessa hin kaa’inaa.',
    ipmRule3: 'Oomisha gabaatti dhiyeessuun dura yeroo eegumsa haamaa (PHI) sirriitti eegaa.',

    // Empty / Error
    noProductsMatch: 'Qorichi barbaaddan hin argamne',
    noProductsAdvice:
      'Jecha biraatiin barbaadaa ykn "Oomisha Hunda" fi "Kutaa Hunda" filachuun qorichoota eeyyamaman hunda ilaalaa.',
    resetFiltersBtn: 'Calaltuu Jalqabatti Deebisi',
    loadingText: 'Qorichoonni qonnaa eeyyamaman fe’amaa jiru...',

    // Gebere Vision AI Integration
    aiIntegrationTitle: 'Qorichoota Qonnaa Eeyyamaman',
    aiSafetyWarningTitle: 'Akeekkachiisa Nageenyaa fi Ajaja Hin Taane:',
    aiSafetyWarningBody:
      'Qorannoon AI kun odeeffannoo qofaaf; matumaa qoricha keemikaalaa hin ajaju. Qoricha utuu hin beekin hin biifinaa. Qulqullina maasii dura dursaa, ogeessa DA aanaa keessanii mariisisaa.',
    aiExploreCatalog: 'Kataloogii Guutuu Ilaali',
    aiFindDealers: 'Daldaltoota Bari',
  },

  am: {
    // Top Banner
    badge: 'የኢትዮጵያ ግብርና ሚኒስቴር (MoA/EAA) ሕጋዊ ምዝገባ እና የኦሮሚያ አቅራቢዎች',
    title: 'የሰብል ጥበቃ እና የግብርና መድኃኒቶች',
    subtitle:
      'በኢትዮጵያ ውስጥ የተመዘገቡ የፈንገስ፣ የተባይ፣ የአረም፣ የዘር ማከሚያ እና ባዮሎጂካል መድኃኒቶችን ያግኙ። በኦሮሚያ ወረዳዎች ውስጥ ካሉ ሕጋዊ አቅራቢዎች ዋጋዎችን ያወዳድሩ፣ የደህንነት መመሪያዎችን ይመልከቱ፣ እና ከገበሬ ቪዥን AI ጋር ያገናኙ።',
    regionalNote: 'ለሁሉም የኦሮሚያ ዞኖች አርሶ አደሮች የቀረበ',
    aiDiagnoseBtn: 'የቅጠል በሽታን በAI መርምር',
    listDealerBtn: 'ሕጋዊ አቅራቢ ሆነው ይመዝገቡ',

    // Stats
    statRegistered: 'የተመዘገቡ መድኃኒቶች',
    statOffers: 'የአቅራቢዎች ምርቶች',
    statCoverage: 'መላው ኦሮሚያ ሽፋን',
    statVerified: '100% ሕጋዊና የተረጋገጠ',

    // Search and Filters
    searchPlaceholder:
      'የመድኃኒቱን ስም፣ ንቁ ኬሚካል ቅመም፣ በሽታ (ለምሳሌ፡ ዝገት፣ ቦረንቲ)፣ ወይም የምዝገባ ቁጥር ይፈልጉ...',
    searchBtn: 'ፈልግ',
    filterByCrop: 'በሰብል ዓይነት ይለዩ:',
    allCrops: 'ሁሉም ሰብሎች',
    allCategories: 'ሁሉም ምድቦች',
    allZones: 'ሁሉም ዞኖች',
    categories: {
      all: 'ሁሉም ምድቦች',
      fungicide: 'የፈንገስ ማጥፊያ',
      insecticide: 'የተባይ ማጥፊያ',
      herbicide: 'የአረም ማጥፊያ',
      seed_treatment: 'የዘር ማከሚያ',
      biological_control: 'የተፈጥሮ ባዮ-ቁጥጥር',
    },
    crops: {
      all: 'ሁሉም',
      Coffee: 'ቡና',
      Teff: 'ጤፍ',
      Wheat: 'ስንዴ',
      Barley: 'ገብስ',
    },

    // Product Card
    approvedCrops: 'የተፈቀዱ ሰብሎች:',
    targetPests: 'የሚከላከላቸው በሽታዎች / ተባዮች:',
    phiLabel: '⏱️ የጥበቃ ቀናት (PHI):',
    days: 'ቀናት',
    localOffersFrom: 'የአካባቢ አቅራቢዎች ዋጋ:',
    dealersOnRequest: 'በጥያቄ የሚቀርብ',
    viewLabelBtn: 'መመሪያ እና አቅራቢዎችን እይ',
    brand: 'የንግድ ስም (ብራንድ)',
    activeIng: 'ንቁ ኬሚካል ቅመም',

    // Modal Details
    modalRegBadge: 'በመንግሥት የተመዘገበ ሕጋዊ ሰነድ',
    regAuthority: 'መዝጋቢ ባለሥልጣን:',
    sourceOrg: 'የመረጃ ምንጭ:',
    whoRating: 'የዓለም ጤና ድርጅት (WHO) የአደጋ ደረጃ:',
    phiDays: 'ከምርት ስብሰባ በፊት መቆየት ያለበት ጊዜ (PHI):',
    approvedUsesTitle: 'የተፈቀዱ የግብርና አጠቃቀሞች እና የመርጫ መመሪያዎች',
    cropLabel: 'ሰብል:',
    targetProblemLabel: 'ዒላማ ችግር / በሽታ:',
    appMethodLabel: 'የአጠቃቀም ዘዴ:',
    optimalTimingLabel: 'ተመራጭ የመርጫ ወቅት:',
    safetyLabelNote: 'የመለያ ደህንነት ማስታወሻ:',
    mandatoryPPE: 'ግዴታ የሆኑ የግል ደህንነት መጠበቂያ አልባሳት',
    safetyPrecautions: 'የጥንቃቄ እርምጃዎች',
    safeStorage: 'ደህንነቱ የተጠበቀ የመድኃኒት አያያዝ:',
    safeDisposal: 'የባዶ እቃዎች አወጋገድ:',
    localDealersTitle: 'በኦሮሚያ ያሉ ሕጋዊ የግብርና መድኃኒት አቅራቢዎች',
    offersAvailable: 'ያሉ አቅራቢዎች',
    licensedDealer: 'ሕጋዊ ፈቃድ ያለው',
    inStock: 'በክምችት ላይ ያለ',
    inquireBuyBtn: 'ይዘዙ / ይጠይቁ',
    closeBtn: 'ዝጋ',
    noDealersInZone:
      'በዚህ ዞን ውስጥ በአሁኑ ጊዜ የተመዘገበ አቅራቢ የለም። የወረዳዎን የግብርና ኅብረት ሥራ ማህበር በቀጥታ ማነጋገር ይችላሉ።',

    // Inquiry Modal
    inquiryTitle: 'ሕጋዊ አቅራቢውን ያነጋግሩ',
    directLine: 'የአቅራቢው ቀጥታ ስልክ:',
    fullNameLabel: 'ሙሉ ስምዎት:',
    phoneLabel: 'ስልክ ቁጥርዎት:',
    quantityLabel: 'የሚፈልጉት መጠን:',
    totalEstLabel: 'የተገመተ ጠቅላላ ዋጋ:',
    messageLabel: 'መልእክት ወይም የማስታወሻ ጽሑፍ:',
    sendInquiryBtn: 'የትዕዛዝ ጥያቄውን ላክ',
    sendingBtn: 'እየተላከ ነው...',
    cancelBtn: 'ተመለስ',
    inquirySuccessTitle: 'ጥያቄዎት ለአቅራቢው ደርሷል!',
    inquirySuccessMsg: 'አቅራቢው የእርስዎን መረጃ ተቀብሏል፤ በቅርቡ በስልክ ያነጋግርዎታል።',

    // Dealer Listing Modal
    dealerListingTitle: 'የሕጋዊ ግብርና መድኃኒት አቅራቢ ምዝገባ',
    dealerListingSubtitle:
      'በኦሮሚያ ላሉ አርሶ አደሮች ሕጋዊ የሆኑ የግብርና መድኃኒቶችን ያቅርቡ።',
    selectProductLabel: 'የተመዘገበውን መድኃኒት ይምረጡ (የሕግ ግዴታ):',
    selectProductDefault: '-- የተመዘገበ መድኃኒት ይምረጡ --',
    dealerNameLabel: 'የአቅራቢው / ድርጅቱ ስም:',
    storeNameLabel: 'የመደብሩ / መጋዘኑ ስም:',
    packageSizeLabel: 'የእቃው መጠን (ጥቅል):',
    priceLabel: 'ዋጋ (በብር):',
    zoneLabel: 'ዞን (ኦሮሚያ):',
    woredaLabel: 'ወረዳ:',
    licenseLabel: 'የንግድ ፈቃድ ቁጥር:',
    contactPhoneLabel: 'ስልክ ቁጥር:',
    publishBtn: 'ምርቱን ለገበያ አቅርብ',
    publishingBtn: 'እየቀረበ ነው...',
    publishSuccessTitle: 'ምርቱ በተሳካ ሁኔታ ተመዝግቧል!',
    publishSuccessMsg: 'ያቀረቡት ምርት አሁን በመላው ኦሮሚያ ላሉ አርሶ አደሮች ይታያል።',

    // IPM Educational Guide
    ipmTitle: 'የተቀናጀ የተባይ እና የበሽታ መቆጣጠሪያ መመሪያ (IPM)',
    ipmBody:
      'የኬሚካል መድኃኒቶችን እንደ ተራ ልማድ ሁልጊዜ መርጨት በጥብቅ የተከለከለ ነው። ሁልጊዜ የተቀናጀ ዘዴን ይከተሉ፡ (1) በምርምር ማዕከላት የተረጋገጡ በሽታ-ተከላካይ ዘሮችን ይዝሩ፤ (2) ማሳዎን ያጽዱ፣ የሁለት ዓመት የሰብል ፈረቃን ከአተርና ባቄላ ጋር ይተግብሩ፤ (3) ጠቃሚ የተፈጥሮ ነፍሳትን እና ባዮሎጂካል መድኃኒቶችን ይጠቀሙ፤ (4) የኢኮኖሚ ጉዳት ደረጃው ሲያልፍ እና በወረዳው የልማት ጣቢያ ባለሙያ (DA) ሲረጋገጥ ብቻ ኬሚካል ይጠቀሙ።',
    ipmRule1: 'የማር ንቦችን ለመጠበቅ ሰብሉ ባበበበት ወቅት በጭራሽ አይርጩ።',
    ipmRule2: 'የመድኃኒት እቃዎችን ሦስት ጊዜ በማጠብ ያበላሹ፤ ለምግብ ማስቀመጫ በጭራሽ አይጠቀሙ።',
    ipmRule3: 'ምርቱን ለገበያ ከማቅረብዎ በፊት የተገለጸውን የጥበቃ ቀናት (PHI) በጥብቅ ይተግብሩ።',

    // Empty / Error
    noProductsMatch: 'ምንም የተመዘገበ ምርት አልተገኘም',
    noProductsAdvice:
      'እባክዎ ሌላ ቃል ይፈልጉ ወይም "ሁሉንም ሰብሎች" እና "ሁሉንም ምድቦች" በመምረጥ የተመዘገቡትን ምርቶች ይመልከቱ።',
    resetFiltersBtn: 'ማጣሪያውን ወደ ነበረበት መልስ',
    loadingText: 'የተመዘገቡ የግብርና መድኃኒቶች እየተፈለጉ ነው...',

    // Gebere Vision AI Integration
    aiIntegrationTitle: 'የተፈቀዱ የሰብል ጥበቃ መድኃኒቶች',
    aiSafetyWarningTitle: 'ጥብቅ የደህንነት እና ያለሐኪም ትዕዛዝ ያለመጠቀም ማሳሰቢያ:',
    aiSafetyWarningBody:
      'የአርቴፊሻል ኢንተለጀንስ (AI) ውጤት ቅድመ-ምርመራ ብቻ እንጂ ኬሚካል አያዝም። መጠኑን ሳይረዱ በግምት በጭራሽ አይርጩ። ሁልጊዜ የተፈጥሮ መከላከያዎችን ያስቀድሙ፣ የኬሚካል መድኃኒት ከመጠቀምዎ በፊት የአካባቢዎን የልማት ጣቢያ ሠራተኛ (DA) ያማክሩ።',
    aiExploreCatalog: 'ሁሉንም ይመልከቱ',
    aiFindDealers: 'አቅራቢዎችን ፈልግ',
  },
};
