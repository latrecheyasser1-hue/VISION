import { db } from '../src/db/client.js';
import { outreach } from '../src/db/schema.js';

const leads = [
  {
    businessName: "BD Luxury Setif 19",
    businessType: "ملابس رجالية وستريتوير",
    wilaya: "سطيف",
    phone: "0557664431",
    instagramUrl: "https://www.instagram.com/bd_luxury19/",
    status: "no_reply",
    notes: "حي 1006 توال الفاروج"
  },
  {
    businessName: "Palmes Cosmétique",
    businessType: "مواد تجميل وعناية شخصية",
    wilaya: "الجزائر العاصمة",
    phone: "0797388098",
    instagramUrl: "https://www.instagram.com/laboratoire_palmes_cosmetique/",
    status: "no_reply",
    notes: "مخبر ومستحضرات تجميل"
  },
  {
    businessName: "Boutique Bahii 17",
    businessType: "خياطة وألبسة رجالية راقية",
    wilaya: "الجلفة",
    phone: "0557154487",
    instagramUrl: "https://www.instagram.com/bahii_boutique/",
    status: "no_reply",
    notes: "مسعد، تثبيت مشكل ضياع الرسائل في إنستغرام"
  },
  {
    businessName: "SANDRO Bab Ezzouar",
    businessType: "ألبسة رجالية وأطفال",
    wilaya: "الجزائر العاصمة",
    phone: "0773907572",
    instagramUrl: "https://www.instagram.com/sandro_bbz_/",
    status: "no_reply",
    notes: "باب الزوار"
  },
  {
    businessName: "Zaki Luxury 05",
    businessType: "ملابس رجالية كلاسيك وعصرية",
    wilaya: "باتنة",
    phone: "0659292946",
    instagramUrl: "https://www.instagram.com/zaki_luxury05/",
    status: "no_reply",
    notes: "بريكة وباتنة"
  },
  {
    businessName: "SUNRISE Bab Ezzouar",
    businessType: "مقهى وسندويتشات وعصائر",
    wilaya: "الجزائر العاصمة",
    phone: "0777502816",
    instagramUrl: "https://www.instagram.com/sunrise_by_hanana/",
    status: "no_reply",
    notes: "باب الزوار"
  },
  {
    businessName: "Stitiwa Mode",
    businessType: "ملابس شبابية وستريتوير",
    wilaya: "الجزائر العاصمة",
    phone: "",
    instagramUrl: "https://www.instagram.com/stitiwa_mode.dz/",
    status: "no_reply",
    notes: "الطلب عبر واتساب ورسائل"
  },
  {
    businessName: "Boutique Bon Prix 34",
    businessType: "ألبسة رجالية",
    wilaya: "برج بوعريريج",
    phone: "0667075309",
    instagramUrl: "https://www.instagram.com/bon.prix.34bba/",
    status: "no_reply",
    notes: "برج بوعريريج"
  },
  {
    businessName: "Aymen Latino 28",
    businessType: "ألبسة رجالية وسبور",
    wilaya: "المسيلة",
    phone: "0660886013",
    instagramUrl: "https://www.instagram.com/aymen_latino_28/",
    status: "no_reply",
    notes: "المسيلة"
  },
  {
    businessName: "Genius Watch 16",
    businessType: "ساعات ذكية وسماعات وإكسسوارات",
    wilaya: "الجزائر العاصمة",
    phone: "0559838422",
    instagramUrl: "https://www.instagram.com/genius_watch_16/",
    status: "no_reply",
    notes: "سوريكال باب الزوار"
  },
  {
    businessName: "Boutique MH 63",
    businessType: "ملابس رجالية وسوبر باغي",
    wilaya: "الجزائر العاصمة",
    phone: "0553520354",
    instagramUrl: "https://www.instagram.com/boutique_mh_63/",
    status: "no_reply",
    notes: "الأبيار"
  },
  {
    businessName: "ملابس اسطنبول برج البحري",
    businessType: "ألبسة رجالية مستوردة",
    wilaya: "الجزائر العاصمة",
    phone: "0669604016",
    instagramUrl: "https://www.instagram.com/_istanbul_vetements_/",
    status: "no_reply",
    notes: "برج البحري"
  },
  {
    businessName: "Snazzy Shop Msila",
    businessType: "ملابس رجالية لاكشري",
    wilaya: "المسيلة",
    phone: "0561584124",
    instagramUrl: "https://www.instagram.com/snazzy.shop28/",
    status: "no_reply",
    notes: "المسيلة"
  },
  {
    businessName: "Brothers Mode UK",
    businessType: "ملابس رياضية أصلية",
    wilaya: "بجاية",
    phone: "0656530597",
    instagramUrl: "https://www.instagram.com/brothers__mode__uk/",
    status: "no_reply",
    notes: "بجاية"
  },
  {
    businessName: "Luxify 16",
    businessType: "ألبسة رجالية ولاكوست سبور",
    wilaya: "الجزائر العاصمة",
    phone: "0778930481",
    instagramUrl: "https://www.instagram.com/luxify_bir_mourad_rais/",
    status: "no_reply",
    notes: "بير مراد رايس"
  },
  {
    businessName: "Patrol Plus Blida",
    businessType: "ملابس رجالية عصرية",
    wilaya: "البليدة",
    phone: "0549261343",
    instagramUrl: "https://www.instagram.com/patrols09/",
    status: "no_reply",
    notes: "شارع 20 متر"
  },
  {
    businessName: "VIP Fashion Blida",
    businessType: "ألبسة رجالية منوعة",
    wilaya: "البليدة",
    phone: "0553272205",
    instagramUrl: "https://www.instagram.com/vip.fashion09/",
    status: "no_reply",
    notes: "بن يامينة أولاد يعيش"
  },
  {
    businessName: "Anas Yakoubi",
    businessType: "أحذية وملابس سبور ماركات",
    wilaya: "الجزائر العاصمة",
    phone: "0543408700",
    instagramUrl: "https://www.instagram.com/anasyakoubi2025/",
    status: "no_reply",
    notes: "واد الليل"
  },
  {
    businessName: "Oran Sport 012",
    businessType: "ألبسة رجالية وماركات عالمية",
    wilaya: "وهران",
    phone: "0771900190",
    instagramUrl: "https://www.instagram.com/empire012_dz/",
    status: "no_reply",
    notes: "وهران"
  },
  {
    businessName: "Boutique Chenna",
    businessType: "ألبسة وإكسسوارات رجالية",
    wilaya: "الجزائر العاصمة",
    phone: "",
    instagramUrl: "https://www.instagram.com/boutique_chenna/",
    status: "no_reply",
    notes: "الطلب في الرسائل"
  },
  {
    businessName: "Walid Luxury",
    businessType: "ملابس رجالية وستريتوير",
    wilaya: "البليدة",
    phone: "0796944931",
    instagramUrl: "https://www.instagram.com/walid_luxxury/",
    status: "no_reply",
    notes: "أولاد يعيش مقابل مسجد الحياة"
  },
  {
    businessName: "محل أنيس أولاد يعيش",
    businessType: "أحذية وألبسة رجالية",
    wilaya: "البليدة",
    phone: "0541998390",
    instagramUrl: "https://www.instagram.com/boutique_anis99/",
    status: "no_reply",
    notes: "بن يامينة أولاد يعيش"
  },
  {
    businessName: "GO Sport 19",
    businessType: "ألبسة وسبور أصلي 100%",
    wilaya: "سطيف",
    phone: "0796297538",
    instagramUrl: "https://www.instagram.com/gosport19/",
    status: "no_reply",
    notes: "صالح باي وبوعروة سطيف"
  },
  {
    businessName: "Tayeb Original Shoes",
    businessType: "أحذية وسنيكرز أصلية",
    wilaya: "الجزائر العاصمة",
    phone: "0554565551",
    instagramUrl: "https://www.instagram.com/tayeb_original_shoes/",
    status: "no_reply",
    notes: "براقي"
  },
  {
    businessName: "Kingdom Fashion",
    businessType: "ملابس رجالية لوكس",
    wilaya: "بومرداس",
    phone: "0540297349",
    instagramUrl: "https://www.instagram.com/kingdom_fs/",
    status: "no_reply",
    notes: "أولاد هداج"
  },
  {
    businessName: "Bilal Fashion",
    businessType: "سنيكرز بريميوم وأحذية رياضية",
    wilaya: "بومرداس",
    phone: "0559366890",
    instagramUrl: "https://www.instagram.com/bilal_fashion_/",
    status: "no_reply",
    notes: "حمادي بومرداس"
  },
  {
    businessName: "TONTON Vêtements",
    businessType: "ألبسة رجالية وشبابية",
    wilaya: "الجزائر العاصمة",
    phone: "0550079228",
    instagramUrl: "https://www.instagram.com/tonton.vetements16/",
    status: "no_reply",
    notes: "بئر توتة"
  },
  {
    businessName: "Padroni Clothes",
    businessType: "ستريتوير وملابس رياضية رجالية",
    wilaya: "الجزائر العاصمة",
    phone: "0553056741",
    instagramUrl: "https://www.instagram.com/padroni_clothes/",
    status: "no_reply",
    notes: "الرويبة"
  },
  {
    businessName: "Be One Luxury",
    businessType: "ألبسة وأحذية ماركات عالمية فاخرة",
    wilaya: "وهران",
    phone: "0540954177",
    instagramUrl: "https://www.instagram.com/beone_luxury/",
    status: "no_reply",
    notes: "عقيد لطفي"
  },
  {
    businessName: "Twins Fashion 28",
    businessType: "ملابس وأطقم رجالية",
    wilaya: "المسيلة",
    phone: "0771102847",
    instagramUrl: "https://www.instagram.com/twins_fashion_28_/",
    status: "no_reply",
    notes: "سيدي عيسى"
  },
  {
    businessName: "Black & White Blida",
    businessType: "ملابس رجالية عالية الجودة",
    wilaya: "البليدة",
    phone: "0556253102",
    instagramUrl: "https://www.instagram.com/blackandwhite_blida/",
    status: "no_reply",
    notes: "البليدة"
  },
  {
    businessName: "Footflex DZ",
    businessType: "أحذية وسنيكرز رياضية",
    wilaya: "الجزائر العاصمة",
    phone: "",
    instagramUrl: "https://www.instagram.com/footflexdz/",
    status: "no_reply",
    notes: "الطلب في الرسائل"
  },
  {
    businessName: "Boutique Man City Casbah",
    businessType: "أحذية تيان وكلاكيطات وسنيكرز",
    wilaya: "الجزائر العاصمة",
    phone: "0792550147",
    instagramUrl: "https://www.instagram.com/boutiquemancity2/",
    status: "no_reply",
    notes: "القصبة"
  },
  {
    businessName: "Air Twins",
    businessType: "ألبسة وستريتوير وسبور أصلي",
    wilaya: "الجزائر العاصمة",
    phone: "0553246902",
    instagramUrl: "https://www.instagram.com/air__twins/",
    status: "no_reply",
    notes: "بئر توتة براقي"
  },
  {
    businessName: "Elite Shop Bananiers",
    businessType: "ألبسة رجالية كاجوال وبولوهات",
    wilaya: "الجزائر العاصمة",
    phone: "0772367002",
    instagramUrl: "https://www.instagram.com/elite_shop_officiel/",
    status: "no_reply",
    notes: "حي الموز ليزبانانيي مقابل كارفور"
  },
  {
    businessName: "Black Mode Blida",
    businessType: "محلات ملابس رجالية عصرية",
    wilaya: "البليدة",
    phone: "",
    instagramUrl: "https://www.instagram.com/blackmode2024/",
    status: "no_reply",
    notes: "موزاية وأولاد يعيش"
  },
  {
    businessName: "Yass Store",
    businessType: "إكسسوارات هواتف آيفون وشواحن",
    wilaya: "الجزائر العاصمة",
    phone: "",
    instagramUrl: "https://www.instagram.com/yass_acces/",
    status: "no_reply",
    notes: "الطلب في الرسائل"
  },
  {
    businessName: "Zawali Good Boutique",
    businessType: "ألبسة وأطقم رجالية شتوية",
    wilaya: "الجلفة",
    phone: "0562934849",
    instagramUrl: "https://www.instagram.com/zawali_good_boutique/",
    status: "no_reply",
    notes: "عين وسارة طريق تكوين"
  },
  {
    businessName: "Platinum Class Zorlu",
    businessType: "ملابس رجالية وأطقم كلاسيك",
    wilaya: "المسيلة",
    phone: "0675645464",
    instagramUrl: "https://www.instagram.com/platinum__class/",
    status: "no_reply",
    notes: "المسيلة زورلو"
  },
  {
    businessName: "Dani 21 Skikda",
    businessType: "ألبسة رجالية وأحذية براند",
    wilaya: "سكيكدة",
    phone: "0664782332",
    instagramUrl: "https://www.instagram.com/boutique_dani_21/",
    status: "no_reply",
    notes: "سكيكدة"
  },
  {
    businessName: "Boutique Flamingo 02",
    businessType: "ألبسة وإكسسوارات رجالية فخمة",
    wilaya: "الشلف",
    phone: "0555199463",
    instagramUrl: "https://www.instagram.com/boutique_flamingo_02/",
    status: "no_reply",
    notes: "وسط مدينة الشلف"
  },
  {
    businessName: "DZ Store Les Castors",
    businessType: "ملابس رجالية وأحذية أصلية",
    wilaya: "وهران",
    phone: "0770882314",
    instagramUrl: "https://www.instagram.com/dzstore_oran/",
    status: "no_reply",
    notes: "طريق ب ليزكاستور"
  },
  {
    businessName: "1008 Company",
    businessType: "ألبسة إيطالية فاخرة وأحذية",
    wilaya: "الجزائر العاصمة",
    phone: "0665434203",
    instagramUrl: "https://www.instagram.com/1008_company/",
    status: "no_reply",
    notes: "الجزائر العاصمة"
  },
  {
    businessName: "Boutique The Man",
    businessType: "ألبسة رجالية كلاسيك وعصرية",
    wilaya: "تلمسان",
    phone: "",
    instagramUrl: "https://www.instagram.com/boutique_theman/",
    status: "no_reply",
    notes: "الدالية وإمامة"
  },
  {
    businessName: "Rhino Phone El Achour",
    businessType: "بيع وصيانة هواتف وإكسسوارات",
    wilaya: "الجزائر العاصمة",
    phone: "0783840302",
    instagramUrl: "https://www.instagram.com/rhino.phonedz/",
    status: "no_reply",
    notes: "العاشور مقابل أوربا 2000"
  },
  {
    businessName: "مملكة نسائم",
    businessType: "فساتين وألبسة نسائية وحجابات راقية",
    wilaya: "الشلف",
    phone: "0661964168",
    instagramUrl: "https://www.instagram.com/mamlak_nsaim__/",
    status: "no_reply",
    notes: "حي عروج"
  },
  {
    businessName: "RL Luxury Bougara",
    businessType: "ملابس رجالية وستريتوير",
    wilaya: "البليدة",
    phone: "0557258001",
    instagramUrl: "https://www.instagram.com/rl_luxury_/",
    status: "no_reply",
    notes: "بوقرة"
  },
  {
    businessName: "Stan Accessory",
    businessType: "إكسسوارات هواتف وشواحن ذكية",
    wilaya: "الجزائر العاصمة",
    phone: "",
    instagramUrl: "https://www.instagram.com/stan_accessory/",
    status: "no_reply",
    notes: "موقع إلكتروني ورسائل"
  },
  {
    businessName: "Boutique Tendance 21",
    businessType: "ملابس رجالية ماركات كبرى",
    wilaya: "سكيكدة",
    phone: "0797059642",
    instagramUrl: "https://www.instagram.com/boutique_tendance21_/",
    status: "no_reply",
    notes: "الأركاد مسجد ابن باديس"
  },
  {
    businessName: "King Shop 03 Laghouat",
    businessType: "ملابس رجالية وأحذية وتي شيرتات",
    wilaya: "الأغواط",
    phone: "0657102066",
    instagramUrl: "https://www.instagram.com/king_sho.03/",
    status: "no_reply",
    notes: "البلاد مقابل البلدية"
  },
  {
    businessName: "الخلوج للعباءات الإماراتية",
    businessType: "عبايات نسائية إماراتية فاخرة",
    wilaya: "الشلف",
    phone: "0557712610",
    instagramUrl: "https://www.instagram.com/al_kholooj/",
    status: "no_reply",
    notes: "المركز التجاري الأنيق بسمة شوب"
  },
  {
    businessName: "Perle Mode 09 Shoes",
    businessType: "أحذية وبوتات وسواريه نسائية",
    wilaya: "البليدة",
    phone: "",
    instagramUrl: "https://www.instagram.com/perlemode09shoes_/",
    status: "no_reply",
    notes: "الطلب في الرسائل"
  },
  {
    businessName: "Boutique Belledemoiselle",
    businessType: "ألبسة نسائية جاهزة ومعاطف شتوية",
    wilaya: "الجزائر العاصمة",
    phone: "",
    instagramUrl: "https://www.instagram.com/belledemoisellee/",
    status: "no_reply",
    notes: "الطلب في الرسائل أونلاين"
  },
  {
    businessName: "CHIC Boutique Bejaia",
    businessType: "حقائب وسكوشات وكاسكيتات لوكس",
    wilaya: "بجاية",
    phone: "0798994016",
    instagramUrl: "https://www.instagram.com/chic_boutique_58/",
    status: "no_reply",
    notes: "حي دالاس الصغير"
  },
  {
    businessName: "لمسة ذوق للعبايات الشلف",
    businessType: "عبايات إماراتية وخليجية راقية",
    wilaya: "الشلف",
    phone: "0549105829",
    instagramUrl: "https://www.instagram.com/lamsat_thoog02/",
    status: "no_reply",
    notes: "النسائم مول الطابق الثاني"
  },
  {
    businessName: "ZM Collection",
    businessType: "ألبسة وخمارات وعبايات نسائية",
    wilaya: "الجزائر العاصمة",
    phone: "",
    instagramUrl: "https://www.instagram.com/zmcollectiondz/",
    status: "no_reply",
    notes: "إنتاج جزائري، الطلب أونلاين"
  },
  {
    businessName: "Nalouti Store",
    businessType: "ألبسة وأحذية رجالية",
    wilaya: "مدنين (تونس)",
    phone: "+21621903259",
    instagramUrl: "https://www.instagram.com/nalouti_store/",
    status: "no_reply",
    notes: "مدنين تونس"
  },
  {
    businessName: "Dibagui Mode BBA",
    businessType: "ألبسة نسائية ومعاطف شتوية",
    wilaya: "برج بوعريريج",
    phone: "0552808770",
    instagramUrl: "https://www.instagram.com/dibaguimode34/",
    status: "no_reply",
    notes: "لابوسط الكبيرة السيتدال"
  },
  {
    businessName: "متجر أحذية يونس عزة",
    businessType: "أحذية وحقائب نسائية",
    wilaya: "الجزائر العاصمة",
    phone: "0541576289",
    instagramUrl: "https://www.instagram.com/boutique_younes_az/",
    status: "no_reply",
    notes: "كروا روج مقابل السونلغاز"
  },
  {
    businessName: "Nadsa Outfit",
    businessType: "ألبسة نسائية وأوتفيت عصرية",
    wilaya: "الجزائر العاصمة",
    phone: "0781061236",
    instagramUrl: "https://www.instagram.com/nadsa_outfit/",
    status: "no_reply",
    notes: "توصيل 58 ولاية"
  },
  {
    businessName: "Ipad Store 16",
    businessType: "أجهزة آيباد وتابلت سامسونغ وملحقاتها",
    wilaya: "الجزائر العاصمة",
    phone: "0560360523",
    instagramUrl: "https://www.instagram.com/ipad_store16/",
    status: "no_reply",
    notes: "بيع وشراء وتبديل أونلاين"
  }
];

async function insertAll() {
  console.log(`Starting insertion of ${leads.length} leads...`);
  let inserted = 0;
  for (const item of leads) {
    try {
      await db.insert(outreach).values(item);
      inserted++;
    } catch (e) {
      console.error(`Error inserting ${item.businessName}:`, e.message);
    }
  }
  console.log(`Successfully inserted ${inserted}/${leads.length} leads into outreach table.`);
  process.exit(0);
}

insertAll();
