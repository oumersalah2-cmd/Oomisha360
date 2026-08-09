export interface Disease {
  id: string;
  name: {
    en: string;
    am: string;
    om: string;
    ar: string;
  };
  scientificName: string;
  crop: string;
  symptoms: {
    en: string[];
    am: string[];
    om: string[];
    ar: string[];
  };
  organicRemedies: {
    en: string;
    am: string;
    om: string;
    ar: string;
  };
  chemicalTreatments: {
    en: string;
    am: string;
    om: string;
    ar: string;
  };
  confidenceMock?: number;
  imagePlaceholder?: string;
  audioDuration?: string;
}

export const diseases: Disease[] = [
  {
    id: "coffee-berry-disease",
    name: {
      en: "Coffee Berry Disease",
      am: "የቡና ፍሬ በሽታ (ቦረንቲ)",
      om: "Dhukkuba Firi Qophee",
      ar: "مرض توت القهوة"
    },
    scientificName: "Colletotrichum kahawae",
    crop: "Coffee",
    symptoms: {
      en: [
        "Dark, sunken spots on green coffee berries",
        "Berries shrink, dry up, and turn black",
        "Berries drop prematurely from the branches"
      ],
      am: [
        "ባልበሰሉ የቡና ፍሬዎች ላይ ጥቁር እና የሰመጡ ነጠብጣቦች መታየት",
        "ፍሬዎቹ ይሸበሸባሉ፣ ይደርቃሉ እና ወደ ጥቁርነት ይለወጣሉ",
        "ፍሬዎች ሳይበስሉ ከቅርንጫፎች ላይ ይረግፋሉ"
      ],
      om: [
        "Firiilee bunaa magariisa irratti mallattoo gurraacha mul'achuu",
        "Firiileen kokkoyanii, goganii gurraacha'uu",
        "Firiin bunaa osoo hin bilchaatin harca'uu"
      ],
      ar: [
        "بقع داكنة وغائرة على حبات البن الخضراء",
        "تتقلص الثمار وتجف وتتحول إلى اللون الأسود",
        "تساقط الثمار قبل نضجها من الأغصان"
      ]
    },
    organicRemedies: {
      en: "Prune coffee trees to improve air flow and sunlight penetration. Apply copper-based organic fungicides before the onset of the rainy season. Mulch properly and remove diseased crop residue.",
      am: "የአየር ዝውውርን እና የፀሀይ ብርሃን መግቢያን ለማሻሻል የቡና ዛፎችን መቁረጥ። ዝናብ ከመጀመሩ በፊት በኮፐር ላይ የተመሰረቱ ኦርጋኒክ ፈንገስ ኬሚካሎችን መቀባት። አፈርን መሸፈን እና የበሰበሱ ፍሬዎችን ማስወገድ።",
      om: "Qilleensaa fi ifa biiftuu argachuuf lafa mukkeen bunaa pruning (shakaxuu). Roobni osoo hin jalqabin dura qoricha fungus kooperii irratti hundaa'e dibuu. Xਾa fi mukkeen gogaa haquu.",
      ar: "تقليم أشجار البن لتحسين تدفق الهواء وتغلغل أشعة الشمس. رش مبيدات الفطريات العضوية النحاسية قبل بدء موسم الأمطار. التغطية المناسبة وإزالة بقايا المحاصيل المصابة."
    },
    chemicalTreatments: {
      en: "Apply authorized systemic fungicides such as Pyraclostrobin or Azoxystrobin during the flowering stage at 4-week intervals if symptoms persist.",
      am: "በአበባው ወቅት በየ 4 ሳምንቱ ልዩነት እንደ Pyraclostrobin ወይም Azoxystrobin ያሉ የተፈቀዱ ሲስተሚክ ፈንገስ ማጥፊያዎችን መጠቀም።",
      om: "Yeroo daraaraa keessatti qoricha fungus akka Pyraclostrobin ykn Azoxystrobin fayyadamuu.",
      ar: "رش مبيدات الفطريات الجهازية المعتمدة مثل بيراكلوستروبين أو أزوكسيستروبين خلال مرحلة الإزهار بفواصل زمنية مدتها 4 أسابيع في حال استمرار الأعراض."
    },
    confidenceMock: 94.2,
    imagePlaceholder: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    audioDuration: "0:45"
  },
  {
    id: "wheat-rust",
    name: {
      en: "Wheat Rust (Stem Rust)",
      am: "የስንዴ ግንድ ዋግ (ዋግ)",
      om: "Waaqii Qamadii",
      ar: "صدأ القمح (صدأ الساق)"
    },
    scientificName: "Puccinia graminis",
    crop: "Wheat",
    symptoms: {
      en: [
        "Reddish-brown, oblong pustules on stems and leaves",
        "Pustules rupture to release powdery spores",
        "Stalks become weak and lodge (fall over)"
      ],
      am: [
        "በግንዱ እና በቅጠሎች ላይ ቀይ-ቡናማ ሞላላ ነጠብጣቦች መታየት",
        "ነጠብጣቦቹ ፈንድተው ደረቅ ዱቄት መሰል ስፖሮችን ይረጫሉ",
        "ግንዶች ይደክማሉ እና ይሰበራሉ"
      ],
      om: [
        "Jirmaa fi baala irratti mallattoo diimaa mul'achuu",
        "Mallattoon sun dho'ee daakuu diimaa facasuu",
        "Mukkeen qamadii dadhabanii kufuu"
      ],
      ar: [
        "بثور مستطيلة ذات لون بني محمر على السيقان والأوراق",
        "تمزق البثور لإطلاق جراثيم مسحوقية",
        "ضعف السيقان وسقوط المحصول"
      ]
    },
    organicRemedies: {
      en: "Plant rust-resistant wheat varieties (e.g., Kingbird or Danda'a). Crop rotation with non-cereal crops, early planting, and clearing weed hosts such as barberry.",
      am: "ዋግን የሚቋቋሙ የስንዴ ዝርያዎችን መዝራት (ምሳሌ፡ ኪንግበርድ ወይም ደንዳአ)። ሰብልን ማፈራረቅ፣ ቀድሞ መዝራት፣ እና አረሞችን ማስወገድ።",
      om: "Sanyii qamadii waaqii dandamatu kan akka Kingbird ykn Danda'a facaasuu. Midhaan mimmijuu fi aramaa haquu.",
      ar: "زراعة أصناف القمح المقاومة للصدأ. التناوب المحصولي مع المحاصيل غير الحبوب، والتبكير في الزراعة، والتخلص من الأعشاب الضارة الحاضنة للمرض."
    },
    chemicalTreatments: {
      en: "Use triazole-based chemical fungicides (e.g., Tebuconazole or Propiconazole) at the first sign of rust pustules on the upper leaves.",
      am: "በላይኛው ቅጠሎች ላይ የዋግ ምልክት ሲታይ እንደ Tebuconazole ወይም Propiconazole ያሉ ትሪያዞል-ነክ ኬሚካላዊ ፈንገስ ማጥፊያዎችን መጠቀም።",
      om: "Mallattoon waaqii baala irratti yoo mul'ate qoricha Tebuconazole ykn Propiconazole fayyadamuu.",
      ar: "استخدام مبيدات الفطريات الكيميائية القائمة على التريازول (مثل تيبوكونازول أو بروبيكونازول) عند ظهور أولى علامات الصدأ على الأوراق العلوية."
    },
    confidenceMock: 98.5,
    imagePlaceholder: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    audioDuration: "1:02"
  },
  {
    id: "maize-lethal-necrosis",
    name: {
      en: "Maize Lethal Necrosis (MLN)",
      am: "የበቆሎ ገዳይ በሽታ",
      om: "Necrosis Labata Boqqolloo",
      ar: "نخر الذرة المميت"
    },
    scientificName: "MCMV + SCMV Synergistic Infection",
    crop: "Maize",
    symptoms: {
      en: [
        "Severe yellowing of leaves starting from the margins",
        "Drying of leaves from the tip downwards (necrosis)",
        "Stunted growth, sterile ears, or rotting cobs"
      ],
      am: [
        "ቅጠሎች ከዳርና ዳር ወደ ቢጫነት መለወጥ",
        "ቅጠሎች ከጫፍ ጀምሮ ወደ ታች መድረቅ",
        "የእድገት መገታት፣ ፍሬ አልባ መሆን እና የበቆሎው መበስበስ"
      ],
      om: [
        "Baalli boqqolloa fiixee irraa jalqabee keelloo ta'uu",
        "Baalli fiixee irraa gogaa deemuu",
        "Guddinni daangeffamuu fi boqqolloon kabaa dhabuu"
      ],
      ar: [
        "اصفرار شديد للأوراق يبدأ من الحواف",
        "جفاف الأوراق من القمة إلى الأسفل (النخر)",
        "تقزم النمو، أو كيزان فارغة، أو تعفن الكيزان"
      ]
    },
    organicRemedies: {
      en: "Immediately uproot and burn infected plants to stop vector insect transmission (aphids/thrips). Practice strict crop rotation for at least 2 seasons. Keep fields weed-free.",
      am: "በሽታው የተያዙትን ተክሎች ወዲያውኑ ንቅሎ ማቃጠል። ቢያንስ ለሁለት የምርት ዘመን ሰብል ማፈራረቅ። ማሳውን ከአረም ነጻ ማድረግ።",
      om: "Mukkeen boqqolloa dhukkubbiin qabaman hedduminaan buqqisanii gubuu. Rotation midhaanii waggaa 2 gochuu.",
      ar: "اقتلاع النباتات المصابة وحرقها فورًا لوقف انتقال الحشرات الناقلة. ممارسة التناوب الزراعي الصارم لمدة موسمين على الأقل. المحافظة على نظافة الحقول من الحشائش."
    },
    chemicalTreatments: {
      en: "MLN is viral; there is no chemical cure. Apply systemic insecticides early (e.g., Imidacloprid) to control vector populations like thrips and aphids.",
      am: "በሽታው በቫይረስ ስለሚመጣ ኬሚካላዊ ፈውስ የለውም። ነገር ግን ተሸካሚ ነፍሳትን ለመቆጣጠር እንደ Imidacloprid ያሉ ፀረ-ነፍሳትን ቀድሞ መርጨት።",
      om: "Dhibeen kun vaayirasii waan ta'eef qoricha hin qabu. Garuu ilbiisota daddabarsan to'achuuf Imidacloprid fayyadamuun ni danda'ama.",
      ar: "نخر الذرة المميت مرض فيروسي؛ لا يوجد علاج كيميائي له. رش المبيدات الحشرية الجهازية مبكرًا (مثل إيميداكلوبرايد) للتحكم في الحشرات الناقلة."
    },
    confidenceMock: 89.7,
    imagePlaceholder: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80",
    audioDuration: "0:58"
  },
  {
    id: "teff-rust",
    name: {
      en: "Teff Rust",
      am: "የጤፍ ዋግ በሽታ",
      om: "Waaqii Xaafii",
      ar: "صدأ الطيف"
    },
    scientificName: "Uromyces eragrostidis",
    crop: "Teff",
    symptoms: {
      en: [
        "Small orange-brown pustules on leaves and sheaths",
        "Premature leaf drying leading to low grain fill",
        "Lodging (falling) of the delicate teff grass stems"
      ],
      am: [
        "በቅጠሎች ላይ ትናንሽ ብርቱካናማ-ቡናማ ነጠብጣቦች",
        "ቅጠሎች ያለጊዜው መድረቅ እና ፍሬ አለማፍራት",
        "ቀጫጭኑ የጤፍ ግንዶች መውደቅ"
      ],
      om: [
        "Baala xaafii irratti mallattoo xixiqqoo keelloo-diimaa",
        "Baalli dafee goguun ija xaafii hir'isuu",
        "Seneen xaafii lafatti kufuun bilchina dhabuu"
      ],
      ar: [
        "بثور صغيرة ذات لون بني برتقالي على الأوراق والغماد",
        "جفاف الأوراق المبكر مما يؤدي إلى انخفاض امتلاء الحبوب",
        "رقاد سيقان العشب الرفيعة"
      ]
    },
    organicRemedies: {
      en: "Use certified clean seeds. Row planting instead of broadcasting to improve spacing and reduce humidity in the crop canopy. Destroy alternative weed hosts.",
      am: "የተረጋገጠ ንጹህ ዘር መጠቀም። የአየር ዝውውርን ለመጨመር በረድፍ መዝራት። ተለዋጭ አረሞችን ማጥፋት።",
      om: "Sanyii qulqulluu filachuu. Hiriiraan facaasuu (tarping) qilleensa argachuuf. Aramaalee balleessuu.",
      ar: "استخدام بذور نظيفة معتمدة. الزراعة في صفوف بدلاً من البذر العشوائي لتحسين المسافات وتقليل الرطوبة. التخلص من الأعشاب الضارة."
    },
    chemicalTreatments: {
      en: "Foliar application of Mancozeb or Propiconazole if the disease manifests early and weather conditions are warm and humid.",
      am: "በሽታው ቀድሞ ከተከሰተ እና የአየር ሁኔታው እርጥበታማ ከሆነ Mancozeb ወይም Propiconazole መርጨት።",
      om: "Dhibeen kun yoo jiraate Mancozeb ykn Propiconazole fayyadamanii facaasuun ni danda'ama.",
      ar: "الرش الورقي بمبيد مانكوزيب أو بروبيكونازول إذا ظهر المرض مبكرًا وكانت الظروف الجوية دافئة ورطبة."
    },
    confidenceMock: 91.4,
    imagePlaceholder: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    audioDuration: "0:52"
  }
];
