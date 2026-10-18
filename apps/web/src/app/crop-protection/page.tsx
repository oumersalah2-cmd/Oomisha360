"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  PhoneCall,
  MapPin,
  Sparkles,
  Package,
  Plus,
  X,
  FileText,
  Clock,
  Send,
  Eye,
  Store,
  Check,
  Globe,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import {
  CropProtectionProduct,
  CropProtectionListing,
  CropProtectionCategory,
  CROP_PROTECTION_CATEGORY_LABELS,
} from "@gebere/shared";
import { useApp } from "@/context/AppContext";
import { Language, SUPPORTED_LANGUAGES, translations } from "@/lib/i18n";

// Helper to provide natural localized product information in Afaan Oromoo, Amharic, and English
function getLocalizedProductInfo(p: CropProtectionProduct, lang: Language) {
  if (lang === "om") {
    switch (p.id) {
      case "prod-copper-oxychloride":
        return {
          tradeName: "Koppar Oksiikilooraayidii 50% WP",
          brandName: "Cobox 50 WP / Koppar Qonnaa",
          targetPests: [
            "Dhibee Firiilee Bunaa (CBD - Colletotrichum kahawae)",
            "Waagii Baala Bunaa (CLR - Hemileia vastatrix)",
            "Dhibee Baakteeriyaa fi Bulaayitii",
          ],
          summary: "Farra fangaasii oomisha bunaatiif eeyyamame. Firiilee fi baala dhibee irraa ittisa.",
          usesNotes: "Biifa dursaa yeroo rooba dura godhaa; guyyoota 21-28 gidduutti irra deebisaa.",
        };
      case "prod-tilt-propiconazole":
        return {
          tradeName: "Piroopikonaazoolii 250 EC (Tilt 250)",
          brandName: "Tilt 250 EC / Agro-Propico",
          targetPests: [
            "Waagii Qamadii Boraatii/Dilbii (Stripe Rust)",
            "Waagii Hundee Qamadii (Ug99 Lineage)",
            "Dhibee Baala Garbuu (Net Blotch)",
            "Iskaldii Garbuu (Scald)",
          ],
          summary: "Farra fangaasii sirnaawaa waagii qamadii fi dhibee baala garbuu ittisu.",
          usesNotes: "Mallattoon waagii jalqaba yommuu mul'atu battalumatti biifama.",
        };
      case "prod-24d-amine-720":
        return {
          tradeName: "2,4-D Amiin 720 SL (Farra Aramaa)",
          brandName: "Weedone / 2,4-D Suupparii",
          targetPests: [
            "Aramaa baala bal’aa (Mech/Guzootiyaa, Qobboo, Raafuu boqqolloo, Amaranthus)",
          ],
          summary: "Farra aramaa filatamaa maasii xaafii, qamadii fi garbuu keessaa aramaa balleessu.",
          usesNotes: "Xaafiin yeroo damee baasu (torbee 4-6) qofa biifama; baala dhangaggoo irraa fageessaa.",
        };
      case "prod-mancozeb-80wp":
        return {
          tradeName: "Mankoozebii 80% WP (Diiteen M-45)",
          brandName: "Dithane M-45 / Agro-Mancozeb",
          targetPests: [
            "Waagii Xaafii (Uromyces eragrostidis)",
            "Waagii Baala Garbuu",
            "Dhibee Bulaayitii Baalaa",
          ],
          summary: "Farra fangaasii ittisaa bal’aa dhibee waagii xaafii fi baala garbuutiif oolu.",
          usesNotes: "Biifa ittisaa dhibeen utuu hin babal'atin dura kan kennamu.",
        };
      case "prod-cruiser-seed-protectant":
        return {
          tradeName: "Kiruuzar Pilaas 312.5 FS (Qoricha Sanyii)",
          brandName: "Cruiser Plus Seed Dressing",
          targetPests: [
            "Tisiisa sanyii Xaafii (Shoot fly)",
            "Dhibee buutii sanyii Qamadii fi Garbuu (Smuts)",
            "Dhibee biqiltuu daangoo fi Pythium",
          ],
          summary: "Qoricha sirnaawaa sanyiin utuu hin facaafamin dura ittiin dibamu.",
          usesNotes: "Sanyiin dibame matumaa nyaata namaa fi beelladaaf hin oolu.",
        };
      case "prod-trichoderma-viride":
        return {
          tradeName: "Tiraayikoodarmaa Viriidii 1% WP (To’annoo Uumamaa)",
          brandName: "Bio-Cure-F / Eko-Faangayii",
          targetPests: [
            "Tortora hidda Bunaa (Root Rot)",
            "Dhibee daangoo biqiltuu bunaa",
            "Dhibee fangaasii biyyee fi midhaanii",
          ],
          summary: "Qoricha baayoloojikaalaa uumamaa qulqulluu biqiltuu bunaa fi qamadii eegu.",
          usesNotes: "Keemikaala biraa waliin hin makin; qoricha uumamaa 100% nageenya qabudha.",
        };
      case "prod-decis-deltamethrin":
        return {
          tradeName: "Deltameetiriin 25 g/L EC (Decis 2.5)",
          brandName: "Decis 2.5 EC / Agro-Delta",
          targetPests: [
            "Hawaanisa qamadii (Armyworm)",
            "Ilbiisa baala bunaa (Leaf Miner)",
            "Bollworm fi Aafidii midhaanii",
          ],
          summary: "Farra ilbiisotaa saffisaan hojjatu hawaanisa qamadii fi ilbiisa bunaatiif.",
          usesNotes: "Abaaboo yeroo kanniisi dammaa jirtutti matumaa hin biifinaa.",
        };
      case "prod-pallas-pyroxsulam":
        return {
          tradeName: "Paallaas 45 OD (Farra Aramaa Qamadii)",
          brandName: "Pallas 45 OD Wheat Herbicide",
          targetPests: [
            "Sinbila qamadii (Wild Oats - Avena fatua)",
            "Aramaa saardoo (Ryegrass)",
            "Aramaa baala bal’aa qamadii keessaa",
          ],
          summary: "Farra aramaa addaa maasii qamadii qofaaf eeyyamame. Garbuu fi xaafii irratti hin fayyadominaa.",
          usesNotes: "Qamadii qofaaf; garbuu fi xaafii ni ajjeesa waan ta'eef of eeggadhaa.",
        };
    }
  } else if (lang === "am") {
    switch (p.id) {
      case "prod-copper-oxychloride":
        return {
          tradeName: "ኮፐር ኦክሲክሎራይድ 50% WP",
          brandName: "ኮቦክስ 50 WP / አግሮ-ኮፐር",
          targetPests: [
            "የቡና ፍሬ በሽታ (ቦረንቲ / Colletotrichum kahawae)",
            "የቡና ቅጠል ዝገት (CLR / Hemileia vastatrix)",
            "የባክቴሪያ ቅርፊት በሽታ",
          ],
          summary: "በቡና ምርት ላይ የሚከሰተውን ቦረንቲ እና የቅጠል ዝገት የሚከላከል ፈቃድ ያለው መድኃኒት።",
          usesNotes: "ከዝናብ በፊት የቅድመ-መከላከል ርጭት ያድርጉ፤ በየ3-4 ሳምንቱ ይደገማል።",
        };
      case "prod-tilt-propiconazole":
        return {
          tradeName: "ፕሮፒኮናዞል 250 EC (ቲልት 250)",
          brandName: "Tilt 250 EC / አግሮ-ፕሮፒኮ",
          targetPests: [
            "የስንዴ ቢጫ ዝገት (Stripe Rust)",
            "የስንዴ ግንድ ዝገት (Ug99 ዝርያ)",
            "የገብስ ቅጠል ጥቁረት (Net Blotch)",
            "የገብስ ስካልድ በሽታ",
          ],
          summary: "በስንዴና ገብስ ላይ የሚከሰተውን አደገኛ የዝገት በሽታ የሚቆጣጠር ሲስተሚክ ፈንገስ ማጥፊያ።",
          usesNotes: "የዝገት ምልክት በቅጠል ላይ እንደታየ ወዲያውኑ ይርጩ፤ የ30 ቀናት የጥበቃ ጊዜ አለው።",
        };
      case "prod-24d-amine-720":
        return {
          tradeName: "2,4-D አሚን 720 SL (የአረም ማጥፊያ)",
          brandName: "ዊዶን / 2,4-D ሱፐር",
          targetPests: [
            "ሰፋፊ ቅጠል ያላቸው አረሞች (መጭ፣ ኮመሊና፣ አለብላቢት፣ አሜከላ)",
          ],
          summary: "በጤፍ፣ ስንዴና ገብስ ማሳ ውስጥ ሰፋፊ አረሞችን የሚመርጥና የሚያጠፋ መድኃኒት።",
          usesNotes: "ጤፍ በደንብ ባበቀለበት ወቅት (ከተዘራ ከ4-6 ሳምንት) ብቻ ይርጩ፤ ወደ ጥራጥሬ ማሳ እንዳይሄድ ይጠንቀቁ።",
        };
      case "prod-mancozeb-80wp":
        return {
          tradeName: "ማንኮዜብ 80% WP (ዳይታይን M-45)",
          brandName: "Dithane M-45 / አግሮ-ማንኮዜብ",
          targetPests: [
            "የጤፍ ዝገት በሽታ (Uromyces eragrostidis)",
            "የገብስ ቅጠል ዝገት",
            "የቅጠል ብላይት በሽታዎች",
          ],
          summary: "የጤፍ ዝገትን እና የሰብል ቅጠል በሽታዎችን የሚከላከል አስተማማኝ የፈንገስ መድኃኒት።",
          usesNotes: "ከባድ ዝናብ ከዘነበ በኋላ እንደገና መርጨት ያስፈልጋል።",
        };
      case "prod-cruiser-seed-protectant":
        return {
          tradeName: "ክሩዘር ፕላስ 312.5 FS (የዘር ማከሚያ)",
          brandName: "Cruiser Plus Seed Dressing",
          targetPests: [
            "የጤፍ ቡቃያ ዝንብ (Shoot fly)",
            "የስንዴና ገብስ የዘር ላይ ጥቁረት (Smut)",
            "የስንዴ ቡቃያ መበስበስ",
          ],
          summary: "ዘር ከመዘራቱ በፊት የሚቀባና ቡቃያውን ከመሬት ውስጥ ተባይና ፈንገስ የሚጠብቅ መድኃኒት።",
          usesNotes: "የተቀባ ዘር በፍጹም ለሰው ምግብ ወይም ለእንስሳት መኖ መዋል የለበትም።",
        };
      case "prod-trichoderma-viride":
        return {
          tradeName: "ትራይኮደርማ ቪሪዲ 1% WP (ባዮ-ቁጥጥር)",
          brandName: "Bio-Cure-F / ባዮ-ፈንገስ ጋርድ",
          targetPests: [
            "የቡና ችግኝ ሥር መበስበስ (Root Rot)",
            "የችግኝ መድረቅ በሽታ",
            "የአፈር ውስጥ ፈንገሶች",
          ],
          summary: "ተፈጥሯዊ እና ኦርጋኒክ የሆነ ጠቃሚ ፈንገስ፤ የቡና ችግኝ ማፍያዎችን ከሥር መበስበስ ይጠብቃል።",
          usesNotes: "100% ተፈጥሯዊ ባዮሎጂካል መድኃኒት፤ ከኬሚካል ጋር አብረው አይቀላቅሉ።",
        };
      case "prod-decis-deltamethrin":
        return {
          tradeName: "ዴልታሜትሪን 25 g/L EC (ዴሲስ 2.5)",
          brandName: "Decis 2.5 EC / አግሮ-ዴልታ",
          targetPests: [
            "የስንዴ አሜሪካን ትል (Armyworm)",
            "የቡና ቅጠል ቆርጣጭ ነፍሳት",
            "የስንዴ አፊዶች እና ግንዶች ቆርጣጭ",
          ],
          summary: "በሰብል ላይ ድንገት የሚከሰተውን የአሜሪካን የበረሃ ትልና ተባይ በአስተማማኝ ሁኔታ የሚያጠፋ።",
          usesNotes: "ለማር ንቦች በጣም አደገኛ ስለሆነ ሰብል ባበበበት ወቅት በጭራሽ አይርጩ።",
        };
      case "prod-pallas-pyroxsulam":
        return {
          tradeName: "ፓላስ 45 OD (የስንዴ አረም ማጥፊያ)",
          brandName: "Pallas 45 OD Wheat Herbicide",
          targetPests: [
            "የስንዴ አጃ (Wild Oats - Avena fatua)",
            "የስንዴ ጎመንዘር እና ሰፋፊ አረሞች",
          ],
          summary: "ለስንዴ ሰብል ብቻ የተፈቀደ ልዩ የአረም ማጥፊያ። በገብስ እና ጤፍ ላይ በጭራሽ አይጠቀሙ።",
          usesNotes: "ለስንዴ ብቻ የተፈቀደ፤ በገብስ ወይም ጤፍ ላይ ቢረጩ ሰብሉን ሙሉ በሙሉ ያጠፋል።",
        };
    }
  }

  return {
    tradeName: p.tradeName,
    brandName: p.brandName || "",
    targetPests: p.targetPests,
    summary: p.activeIngredient,
    usesNotes: p.safetyPrecautions[0] || "",
  };
}

export default function CropProtectionPage() {
  const { language, setLanguage, addNotification } = useApp();
  const t = translations[language] || translations.en;

  // State
  const [products, setProducts] = useState<CropProtectionProduct[]>([]);
  const [listings, setListings] = useState<CropProtectionListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedZone, setSelectedZone] = useState<string>("all");

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<CropProtectionProduct | null>(null);
  const [inquiryListing, setInquiryListing] = useState<CropProtectionListing | null>(null);
  const [showAddListingModal, setShowAddListingModal] = useState(false);

  // Inquiry Form State
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("+251 ");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryQuantity, setInquiryQuantity] = useState<number>(1);
  const [inquirySending, setInquirySending] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Add Listing Form State
  const [newListingProductId, setNewListingProductId] = useState("");
  const [newListingSupplierName, setNewListingSupplierName] = useState("");
  const [newListingStoreName, setNewListingStoreName] = useState("");
  const [newListingLicense, setNewListingLicense] = useState("");
  const [newListingPackageSize, setNewListingPackageSize] = useState("1 kg packet");
  const [newListingPrice, setNewListingPrice] = useState<number>(850);
  const [newListingZone, setNewListingZone] = useState("East Shewa");
  const [newListingWoreda, setNewListingWoreda] = useState("Bishoftu");
  const [newListingPhone, setNewListingPhone] = useState("+251 ");
  const [newListingSubmitting, setNewListingSubmitting] = useState(false);
  const [newListingSuccess, setNewListingSuccess] = useState(false);
  const [newListingError, setNewListingError] = useState<string | null>(null);

  // Available Oromia Zones
  const OROMIA_ZONES = [
    t.allZones,
    "East Shewa",
    "Bale",
    "Jimma",
    "Arsi",
    "West Shewa",
    "Southwest Shewa",
    "West Guji",
    "Ilu Aba Bor",
  ];

  // Priority Crops localized
  const PRIORITY_CROPS = [
    { id: "all", label: t.crops.all, badge: language === "om" ? "Hunda" : language === "am" ? "ሁሉም" : "All" },
    { id: "Coffee", label: t.crops.Coffee, badge: language === "om" ? "Buna" : language === "am" ? "ቡና" : "Coffee" },
    { id: "Teff", label: t.crops.Teff, badge: language === "om" ? "Xaafii" : language === "am" ? "ጤፍ" : "Teff" },
    { id: "Wheat", label: t.crops.Wheat, badge: language === "om" ? "Qamadii" : language === "am" ? "ስንዴ" : "Wheat" },
    { id: "Barley", label: t.crops.Barley, badge: language === "om" ? "Garbuu" : language === "am" ? "ገብስ" : "Barley" },
  ];

  const CATEGORIES: { id: string; label: string }[] = [
    { id: "all", label: t.categories.all },
    { id: "fungicide", label: t.categories.fungicide },
    { id: "insecticide", label: t.categories.insecticide },
    { id: "herbicide", label: t.categories.herbicide },
    { id: "seed_treatment", label: t.categories.seed_treatment },
    { id: "biological_control", label: t.categories.biological_control },
  ];

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prodRes, listRes] = await Promise.all([
        apiClient.getCropProtectionProducts({
          crop: selectedCrop !== "all" ? selectedCrop : undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          query: searchQuery || undefined,
        }),
        apiClient.getCropProtectionListings({
          zone: selectedZone !== "all" && selectedZone !== t.allZones ? selectedZone : undefined,
        }),
      ]);

      setProducts(prodRes.products);
      setListings(listRes);
    } catch (err: any) {
      console.error("Failed to load crop protection data:", err);
      setError(
        language === "om"
          ? "Kuusaa qorichaa qunnamuu hin dandeenye. Maaloo intarneetii keessan mirkaneeffadhaa."
          : language === "am"
          ? "የመድኃኒት መረጃ ቋቱን ማግኘት አልተቻለም። እባክዎ የበይነመረብ ግንኙነትዎን ያረጋግጡ።"
          : "Unable to connect to the agricultural database. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCrop, selectedCategory, selectedZone]);

  // Handle Search Input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  // Submit Inquiry
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryListing) return;

    setInquirySending(true);
    try {
      const res = await apiClient.sendCropProtectionInquiry(inquiryListing.id, {
        listingId: inquiryListing.id,
        senderName: inquiryName,
        senderPhone: inquiryPhone,
        message: inquiryMessage || `I am requesting availability for ${inquiryListing.packageSize}.`,
        quantityRequested: inquiryQuantity,
      });

      if (res.success) {
        setInquirySuccess(true);
        addNotification({
          title: language === "om" ? "Gaaffiin Daldalaaf Ergameera" : language === "am" ? "ጥያቄዎት ለአቅራቢው ተልኳል" : "Inquiry Sent to Input Dealer",
          message: `${inquiryListing.packageSize} - ${inquiryListing.supplierName}`,
          type: "marketplace",
        });
        setTimeout(() => {
          setInquirySuccess(false);
          setInquiryListing(null);
          setInquiryMessage("");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInquirySending(false);
    }
  };

  // Submit New Listing
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListingProductId) {
      setNewListingError(t.selectProductLabel);
      return;
    }

    setNewListingSubmitting(true);
    setNewListingError(null);

    try {
      const res = await apiClient.createCropProtectionListing({
        productId: newListingProductId,
        supplierName: newListingSupplierName,
        storeName: newListingStoreName,
        licenseNumber: newListingLicense,
        packageSize: newListingPackageSize,
        priceAmount: Number(newListingPrice),
        region: "Oromia",
        zone: newListingZone,
        woreda: newListingWoreda,
        contactPhone: newListingPhone,
        inStock: true,
      });

      if (res.success) {
        setNewListingSuccess(true);
        addNotification({
          title: language === "om" ? "Qorichi Gabaaf Dhiyaateera" : language === "am" ? "ምርቱ ለገበያ ቀርቧል" : "Input Listing Published",
          message: `${newListingPackageSize} @ ${newListingPrice} ETB`,
          type: "marketplace",
        });
        loadData();
        setTimeout(() => {
          setNewListingSuccess(false);
          setShowAddListingModal(false);
        }, 1800);
      } else {
        setNewListingError(res.error || "Failed to create listing.");
      }
    } catch (err: any) {
      setNewListingError(err?.message || "Error submitting listing.");
    } finally {
      setNewListingSubmitting(false);
    }
  };

  // Helper for Category Color
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "fungicide":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "insecticide":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "herbicide":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "seed_treatment":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "biological_control":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Helper for WHO toxicity color
  const getWHOToxicityClass = (whoClass: string) => {
    if (whoClass.includes("Class II")) {
      return "bg-amber-50 text-amber-900 border-amber-300";
    } else if (whoClass.includes("Class III")) {
      return "bg-blue-50 text-blue-900 border-blue-200";
    } else {
      return "bg-emerald-50 text-emerald-900 border-emerald-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* 1. Header Banner with In-Banner Language Switcher */}
      <div className="bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#1B4332] text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-emerald-500/20">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {/* Top bar with Language Switcher inside Banner */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            <span>{t.badge}</span>
          </div>

          {/* Language Selector Buttons */}
          <div className="flex items-center bg-black/25 backdrop-blur-md p-1 rounded-2xl border border-white/20">
            {SUPPORTED_LANGUAGES.map((langOpt) => {
              const isActive = language === langOpt.code;
              return (
                <button
                  key={langOpt.code}
                  onClick={() => setLanguage(langOpt.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-white text-[#1B4332] shadow-sm font-extrabold"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span>{langOpt.flag}</span>
                  <span>{langOpt.nativeLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t.title}
          </h1>
          <p className="text-emerald-100/95 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
          <div className="text-xs text-emerald-200/80 font-medium italic">
            {t.regionalNote}
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/gebere-vision-ai"
              className="inline-flex items-center gap-2 bg-white text-[#1B4332] hover:bg-emerald-50 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md"
            >
              <Sparkles className="h-4 w-4 text-[#2D6A4F]" />
              <span>{t.aiDiagnoseBtn}</span>
            </Link>

            <button
              onClick={() => setShowAddListingModal(true)}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all"
            >
              <Store className="h-4 w-4" />
              <span>{t.listDealerBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metric Stat Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#E5DFD3] shadow-sm flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{products.length}</div>
            <div className="text-xs text-gray-500 font-medium">{t.statRegistered}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E5DFD3] shadow-sm flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-[#2D6A4F] flex items-center justify-center font-bold">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">{listings.length}</div>
            <div className="text-xs text-gray-500 font-medium">{t.statOffers}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E5DFD3] shadow-sm flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">5+ Zones</div>
            <div className="text-xs text-gray-500 font-medium">{t.statCoverage}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E5DFD3] shadow-sm flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900">100% Verified</div>
            <div className="text-xs text-gray-500 font-medium">{t.statVerified}</div>
          </div>
        </div>
      </div>

      {/* 3. Search and Filtering Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5DFD3] shadow-sm space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>{t.searchBtn}</span>
          </button>
        </form>

        {/* Priority Crops Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
            {t.filterByCrop}
          </span>
          <div className="flex flex-wrap gap-2">
            {PRIORITY_CROPS.map((crop) => {
              const active = selectedCrop === crop.id;
              return (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCrop(crop.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? "bg-[#1B4332] text-white shadow-sm font-bold"
                      : "bg-[#F5F0E8] text-gray-700 hover:bg-[#EAE4D9]"
                  }`}
                >
                  {crop.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Tabs & Zone Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? "bg-[#2D6A4F] text-white font-semibold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl px-3 py-1.5 text-xs text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
            >
              {OROMIA_ZONES.map((zone) => (
                <option key={zone} value={zone === t.allZones ? "all" : zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Products Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="animate-spin h-8 w-8 border-4 border-[#2D6A4F] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-xs text-gray-500 font-medium">{t.loadingText}</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center space-y-3">
          <AlertTriangle className="h-8 w-8 text-red-600 mx-auto" />
          <h3 className="text-sm font-bold text-red-900">{error}</h3>
          <button
            onClick={loadData}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            Retry Connection
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E5DFD3] space-y-4">
          <div className="h-14 w-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Search className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900">{t.noProductsMatch}</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            {t.noProductsAdvice}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCrop("all");
              setSelectedCategory("all");
              setSelectedZone("all");
            }}
            className="bg-[#2D6A4F] text-white px-4 py-2 rounded-xl text-xs font-semibold"
          >
            {t.resetFiltersBtn}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const locInfo = getLocalizedProductInfo(product, language);
            const categoryLabel =
              t.categories[product.category as keyof typeof t.categories] || product.category;

            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-[#E5DFD3] hover:border-emerald-300 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-5 space-y-3.5">
                  {/* Category and Registration Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadgeClass(
                        product.category
                      )}`}
                    >
                      {categoryLabel}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-mono">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>{product.registrationNumber}</span>
                    </span>
                  </div>

                  {/* Trade Name & Active Ingredient */}
                  <div>
                    <h3 className="text-base font-bold text-[#1A1A2E] group-hover:text-[#2D6A4F] transition-colors leading-snug">
                      {locInfo.tradeName}
                    </h3>
                    {product.tradeName !== locInfo.tradeName && (
                      <div className="text-[11px] text-gray-500 font-medium">
                        Label: {product.tradeName}
                      </div>
                    )}
                    <div className="mt-1 text-xs text-gray-700 font-mono bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                      🧪 {product.activeIngredient}
                    </div>
                  </div>

                  {/* Supported Crops */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      {t.approvedCrops}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {product.supportedCrops.map((c) => {
                        const cropLabel =
                          t.crops[c as keyof typeof t.crops] || c;
                        return (
                          <span
                            key={c}
                            className="text-[11px] font-semibold bg-[#F5F0E8] text-gray-700 px-2 py-0.5 rounded-md border border-[#E5DFD3]"
                          >
                            {cropLabel}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Target Pests Preview */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      {t.targetPests}
                    </span>
                    <div className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {locInfo.targetPests.join(" • ")}
                    </div>
                  </div>

                  {/* WHO Toxicity & Pre-Harvest Interval (PHI) */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getWHOToxicityClass(
                        product.whoToxicityClass
                      )}`}
                    >
                      {product.whoToxicityClass.split(" ")[0]} {product.whoToxicityClass.split(" ")[1]}
                    </span>

                    <span className="text-gray-500 font-medium">
                      {t.phiLabel} <strong className="text-gray-800">{product.withholdingPeriodDays} {t.days}</strong>
                    </span>
                  </div>
                </div>

                {/* Card Footer: Pricing and Action */}
                <div className="bg-[#FAF7F2] px-5 py-3.5 border-t border-[#E5DFD3] flex items-center justify-between gap-2">
                  <div>
                    {product.minPriceAmount ? (
                      <div>
                        <div className="text-xs text-gray-500 font-medium">{t.localOffersFrom}</div>
                        <div className="text-sm font-bold text-[#1B4332]">
                          {product.minPriceAmount.toLocaleString()} ETB
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-gray-400 italic">{t.dealersOnRequest}</div>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="inline-flex items-center gap-1.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{t.viewLabelBtn}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Integrated Pest Management (IPM) Educational Guidance Box */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-[#1B4332]">
          <ShieldAlert className="h-6 w-6 text-emerald-700 flex-shrink-0" />
          <h3 className="text-base sm:text-lg font-bold">
            {t.ipmTitle}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
          {t.ipmBody}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-emerald-900">
          <div className="bg-white/80 p-3 rounded-xl border border-emerald-100 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{t.ipmRule1}</span>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-emerald-100 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{t.ipmRule2}</span>
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-emerald-100 flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{t.ipmRule3}</span>
          </div>
        </div>
      </div>

      {/* 6. Product Detail Drawer / Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#E5DFD3] shadow-2xl space-y-6 p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadgeClass(
                      selectedProduct.category
                    )}`}
                  >
                    {t.categories[selectedProduct.category as keyof typeof t.categories] ||
                      selectedProduct.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-mono">
                    Reg: {selectedProduct.registrationNumber}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {getLocalizedProductInfo(selectedProduct, language).tradeName}
                </h2>
                <p className="text-xs text-gray-500 font-medium">
                  {selectedProduct.brandName} • Formulation: {selectedProduct.formulation}
                </p>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Official Registration Authority Information */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 text-xs space-y-2 text-blue-900">
              <div className="flex items-center gap-2 font-bold text-blue-950">
                <ShieldCheck className="h-4 w-4 text-blue-700" />
                <span>{t.modalRegBadge}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <strong>{t.regAuthority}</strong> {selectedProduct.registrationAuthority}
                </div>
                <div>
                  <strong>{t.sourceOrg}</strong> {selectedProduct.sourceOrganization}
                </div>
                <div>
                  <strong>{t.whoRating}</strong> {selectedProduct.whoToxicityClass}
                </div>
                <div>
                  <strong>{t.phiDays}</strong> {selectedProduct.withholdingPeriodDays} {t.days}
                </div>
              </div>
            </div>

            {/* Approved Uses & Application Timing */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                {t.approvedUsesTitle}
              </h4>
              <div className="space-y-2.5">
                {selectedProduct.approvedUses && selectedProduct.approvedUses.length > 0 ? (
                  selectedProduct.approvedUses.map((use, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DFD3] text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between font-bold text-[#1B4332]">
                        <span>{t.cropLabel} {t.crops[use.crop as keyof typeof t.crops] || use.crop}</span>
                        <span className="text-[11px] text-gray-500">{t.phiLabel} {use.phiDays} {t.days}</span>
                      </div>
                      <div>
                        <strong>{t.targetProblemLabel}</strong> {use.targetProblem}
                      </div>
                      <div>
                        <strong>{t.appMethodLabel}</strong> {use.applicationMethod}
                      </div>
                      <div>
                        <strong>{t.optimalTimingLabel}</strong> {use.applicationTiming}
                      </div>
                      <div className="text-gray-600 bg-white p-2 rounded-xl border border-gray-100 text-[11px] mt-1">
                        ⚠️ <strong>{t.safetyLabelNote}</strong> {use.safetyNotes}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">Label application details available on request.</p>
                )}
              </div>
            </div>

            {/* Safety Precautions and Required PPE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
                <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-700" />
                  <span>{t.mandatoryPPE}</span>
                </h5>
                <ul className="space-y-1 text-xs text-amber-950">
                  {selectedProduct.ppeRequirements.map((ppe, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{ppe}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-gray-600" />
                  <span>{t.safetyPrecautions}</span>
                </h5>
                <ul className="space-y-1 text-xs text-gray-700">
                  {selectedProduct.safetyPrecautions.map((safe, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-gray-400 font-bold">•</span>
                      <span>{safe}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Storage and Disposal */}
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E5DFD3] text-xs space-y-2 text-gray-700">
              <div>
                <strong>{t.safeStorage}</strong> {selectedProduct.storageInstructions}
              </div>
              <div>
                <strong>{t.safeDisposal}</strong> {selectedProduct.disposalInstructions}
              </div>
            </div>

            {/* Local Verified Suppliers in Oromia */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  {t.localDealersTitle}
                </h4>
                <span className="text-xs text-gray-500 font-medium">
                  {listings.filter((l) => l.productId === selectedProduct.id).length} {t.offersAvailable}
                </span>
              </div>

              <div className="space-y-2.5">
                {listings
                  .filter((l) => l.productId === selectedProduct.id)
                  .map((dealerOffer) => (
                    <div
                      key={dealerOffer.id}
                      className="bg-white p-3.5 rounded-2xl border border-[#E5DFD3] hover:border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900">
                            {dealerOffer.supplierName}
                          </span>
                          {dealerOffer.isVerifiedDealer && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              {t.licensedDealer}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span>
                            {dealerOffer.woreda}, {dealerOffer.zone}
                          </span>
                          <span>•</span>
                          <span>{dealerOffer.packageSize}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto">
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#1B4332]">
                            {dealerOffer.priceAmount.toLocaleString()} {dealerOffer.currency}
                          </div>
                          <div className="text-[10px] text-emerald-700 font-medium">{t.inStock}</div>
                        </div>

                        <button
                          onClick={() => setInquiryListing(dealerOffer)}
                          className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                        >
                          <Send className="h-3 w-3" />
                          <span>{t.inquireBuyBtn}</span>
                        </button>
                      </div>
                    </div>
                  ))}

                {listings.filter((l) => l.productId === selectedProduct.id).length === 0 && (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center text-xs text-gray-500">
                    {t.noDealersInZone}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Farmer Inquiry Modal */}
      {inquiryListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5DFD3] shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">{t.inquiryTitle}</h3>
                <p className="text-xs text-gray-500">{inquiryListing.supplierName}</p>
              </div>
              <button
                onClick={() => setInquiryListing(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {inquirySuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-gray-900">{t.inquirySuccessTitle}</h4>
                <p className="text-xs text-gray-500">
                  {t.inquirySuccessMsg}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-3.5 text-xs">
                <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E5DFD3]">
                  <div className="font-bold text-gray-800">{inquiryListing.packageSize}</div>
                  <div className="text-emerald-800 font-bold">
                    {inquiryListing.priceAmount.toLocaleString()} {inquiryListing.currency}
                  </div>
                  <div className="text-gray-500 text-[11px]">
                    {inquiryListing.woreda}, {inquiryListing.zone}
                  </div>
                  <div className="text-blue-900 text-[11px] font-semibold mt-1 flex items-center gap-1">
                    <PhoneCall className="h-3 w-3" />
                    <span>{t.directLine} {inquiryListing.contactPhone}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{t.fullNameLabel}</label>
                  <input
                    type="text"
                    required
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                    placeholder="e.g. Abebe Demisse"
                    className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{t.phoneLabel}</label>
                  <input
                    type="tel"
                    required
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                    placeholder="+251 91 123 4567"
                    className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">{t.quantityLabel}</label>
                    <input
                      type="number"
                      min="1"
                      value={inquiryQuantity}
                      onChange={(e) => setInquiryQuantity(Number(e.target.value))}
                      className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">{t.totalEstLabel}</label>
                    <div className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900">
                      {(inquiryQuantity * inquiryListing.priceAmount).toLocaleString()} ETB
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{t.messageLabel}</label>
                  <textarea
                    rows={2}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="e.g. When will stock be available for pickup at the Bishoftu depot?"
                    className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setInquiryListing(null)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded-xl text-xs"
                  >
                    {t.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    disabled={inquirySending}
                    className="flex-1 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-2 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {inquirySending ? (
                      <span>{t.sendingBtn}</span>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>{t.sendInquiryBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 8. Add Supplier Listing Modal (Agro-Dealer Portal) */}
      {showAddListingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E5DFD3] shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">{t.dealerListingTitle}</h3>
                <p className="text-xs text-gray-500">
                  {t.dealerListingSubtitle}
                </p>
              </div>
              <button
                onClick={() => setShowAddListingModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {newListingSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-gray-900">{t.publishSuccessTitle}</h4>
                <p className="text-xs text-gray-500">{t.publishSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleCreateListing} className="space-y-3.5 text-xs">
                {newListingError && (
                  <div className="bg-red-50 text-red-700 p-2.5 rounded-xl border border-red-200">
                    {newListingError}
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    {t.selectProductLabel}
                  </label>
                  <select
                    required
                    value={newListingProductId}
                    onChange={(e) => setNewListingProductId(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                  >
                    <option value="">{t.selectProductDefault}</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {getLocalizedProductInfo(p, language).tradeName} ({p.registrationNumber}) - {t.categories[p.category as keyof typeof t.categories] || p.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">{t.dealerNameLabel}</label>
                    <input
                      type="text"
                      required
                      value={newListingSupplierName}
                      onChange={(e) => setNewListingSupplierName(e.target.value)}
                      placeholder="e.g. Ada'a Union Ag-Inputs"
                      className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">{t.storeNameLabel}</label>
                    <input
                      type="text"
                      value={newListingStoreName}
                      onChange={(e) => setNewListingStoreName(e.target.value)}
                      placeholder="e.g. Central Depot #2"
                      className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">{t.packageSizeLabel}</label>
                    <input
                      type="text"
                      required
                      value={newListingPackageSize}
                      onChange={(e) => setNewListingPackageSize(e.target.value)}
                      placeholder="e.g. 1 Litre bottle or 1 kg pouch"
                      className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">{t.priceLabel}</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newListingPrice}
                      onChange={(e) => setNewListingPrice(Number(e.target.value))}
                      className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">{t.zoneLabel}</label>
                    <select
                      value={newListingZone}
                      onChange={(e) => setNewListingZone(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                    >
                      {OROMIA_ZONES.filter((z) => z !== t.allZones).map((z) => (
                        <option key={z} value={z}>
                          {z}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">{t.woredaLabel}</label>
                    <input
                      type="text"
                      required
                      value={newListingWoreda}
                      onChange={(e) => setNewListingWoreda(e.target.value)}
                      placeholder="e.g. Bishoftu or Sinana"
                      className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">{t.licenseLabel}</label>
                    <input
                      type="text"
                      value={newListingLicense}
                      onChange={(e) => setNewListingLicense(e.target.value)}
                      placeholder="e.g. ETH-OR-AG-2024-0891"
                      className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">{t.contactPhoneLabel}</label>
                    <input
                      type="tel"
                      required
                      value={newListingPhone}
                      onChange={(e) => setNewListingPhone(e.target.value)}
                      placeholder="+251 91 123 4567"
                      className="w-full bg-[#FAF7F2] border border-[#E5DFD3] rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddListingModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded-xl text-xs"
                  >
                    {t.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    disabled={newListingSubmitting}
                    className="flex-1 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold py-2 rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {newListingSubmitting ? t.publishingBtn : t.publishBtn}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
