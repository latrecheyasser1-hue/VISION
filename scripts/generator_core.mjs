// 1. Clean business name
export function cleanBusinessName(rawName) {
  if (!rawName) return 'المحل';
  let name = rawName
    // remove all emojis comprehensively
    .replace(/[\p{Extended_Pictographic}\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    // remove suffixes like | Blida, - Setif, etc.
    .replace(/\|\s*(blida|oran|alger|setif|tlemcen|constantine|annaba|chlef|batna|[^\w\s]+)/gi, '')
    .replace(/-\s*(blida|oran|alger|setif|tlemcen|constantine|annaba|chlef|batna)/gi, '')
    .trim();

  // Strip trailing wilaya names or numbers
  name = name.replace(/\s+(blida|oran|alger|tlemcen|constantine|annaba|batna|chlef|sétif|setif|13|19|09|16|25|31)$/i, '').trim();
  return name || rawName;
}

// 2. Resolve true Wilaya
export function resolveTrueWilaya(wilaya, name, notes) {
  const text = `${wilaya || ''} ${name || ''} ${notes || ''}`.toLowerCase();

  // Specific Algiers communes first
  if (text.includes('برج البحري') || text.includes('برج الكيفان') || text.includes('رويبة') || text.includes('باب الزوار') ||
      text.includes('cheraga') || text.includes('شراقة') || text.includes('kouba') || text.includes('قبة') ||
      text.includes('dely ibrahim') || text.includes('دالي براهيم') || text.includes('el biar') || text.includes('الأبيار') ||
      text.includes('hydra') || text.includes('حيدرة') || text.includes('sidi yahia') || text.includes('سيدي يحيى') ||
      text.includes('bab ezzouar') || text.includes('birtouta') || text.includes('birkhadem') || text.includes('بئر خادم') ||
      text.includes('ouled fayet') || text.includes('أولاد فايت') || text.includes('staoueli') || text.includes('سطاوالي')) {
    return 'الجزائر العاصمة';
  }

  if (text.includes('blida') || text.includes('بليدة') || text.includes('boufarik') || text.includes('بوفاريك') || text.includes('أولاد يعيش') || text.includes('موزاية')) return 'البليدة';
  if (text.includes('oran') || text.includes('وهران') || text.includes('wahran') || text.includes('es-senia') || text.includes('السانية') || text.includes('boulevard dubai')) return 'وهران';
  if (text.includes('tlemcen') || text.includes('تلمسان') || text.includes('imama') || text.includes('مغنية')) return 'تلمسان';
  if (text.includes('constantine') || text.includes('قسنطينة') || text.includes('الخروب') || text.includes('علي منجلي')) return 'قسنطينة';
  if (text.includes('sétif') || text.includes('setif') || text.includes('سطيف') || text.includes('صالح باي') || text.includes('العلمة') || text.includes('عين ولمان')) return 'سطيف';
  if (text.includes('batna') || text.includes('باتنة') || text.includes('أوراس') || text.includes('aures')) return 'باتنة';
  if (text.includes('chlef') || text.includes('الشلف') || text.includes('تنس') || text.includes('tnes')) return 'الشلف';
  if (text.includes('annaba') || text.includes('عنابة') || text.includes('بونة')) return 'عنابة';
  if (text.includes('skikda') || text.includes('سكيكدة')) return 'سكيكدة';
  if (text.includes('bejaia') || text.includes('béjaïa') || text.includes('بجاية')) return 'بجاية';
  if (text.includes('tizi') || text.includes('تيزي')) return 'تيزي وزو';
  if (text.includes('djelfa') || text.includes('الجلفة')) return 'الجلفة';
  if (text.includes('m\'sila') || text.includes('msila') || text.includes('المسيلة')) return 'المسيلة';
  if (text.includes('bordj بوعريريج') || text.includes('bba') || text.includes('برج بوعريريج')) return 'برج بوعريريج';
  if (text.includes('mostaganem') || text.includes('مستغانم')) return 'مستغانم';
  if (text.includes('ouargla') || text.includes('ورقلة')) return 'ورقلة';
  if (text.includes('biskra') || text.includes('بسكرة')) return 'بسكرة';
  if (text.includes('el oued') || text.includes('الوادي')) return 'الوادي';
  if (text.includes('ghardaia') || text.includes('غرداية')) return 'غرداية';
  if (text.includes('laghouat') || text.includes('الأغواط')) return 'الأغواط';
  if (text.includes('alger') || text.includes('عاصمة') || text.includes('العاصمة')) return 'الجزائر العاصمة';

  return wilaya || 'الجزائر';
}

// 3. Normal Algerian Arabic greeting
export function getNormalGreeting(name, wilaya, category) {
  const wStr = (wilaya && wilaya !== 'الجزائر' && wilaya !== 'MULTIPLE') ? ` في ${wilaya}` : '';

  if (category === 'tech') {
    return `السلام عليكم خويا، شفت la page تاع ${name}${wStr} ما شاء الله les appareils والسلعة نقية واحترافية والخدمة تاعكم الله يبارك.`;
  }
  if (category === 'wholesale') {
    return `السلام عليكم خويا، شفت la page تاع ${name}${wStr} ما شاء الله سلعة الجملة وتوفر les articles بقوة والخدمة تاعكم الله يبارك.`;
  }
  if (category === 'optics') {
    return `السلام عليكم خويا، شفت la page تاع ${name}${wStr} ما شاء الله les lunettes والموديلات العصرية قمة فالأناقة والخدمة تاعكم الله يبارك.`;
  }
  if (category === 'home') {
    return `السلام عليكم، شفت la page تاع ${name}${wStr} ما شاء الله المواعن وديكور الدار روعة وذوق راقي والخدمة تاعكم الله يبارك.`;
  }
  if (category === 'kids') {
    return `السلام عليكم، شفت la page تاع ${name}${wStr} ما شاء الله حوايج المواليد والصغار يهبلو وسلعة نقية الله يبارك.`;
  }
  if (category === 'abayas' || category === 'dresses' || category === 'women_fashion') {
    return `السلام عليكم، شفت la page تاع ${name}${wStr} ما شاء الله les modèles والموضة النسائية قمة في الأناقة والخدمة تاعكم الله يبارك.`;
  }

  return `السلام عليكم خويا، شفت la page تاع ${name}${wStr} ما شاء الله سلعة نقية واحترافية والخدمة تاعكم الله يبارك.`;
}

// 4. Pain points + Concrete Results + CTA + Category detection
export function getNicheAndResult(businessType, notes, businessName) {
  const bt = (businessType || '').toLowerCase();
  const not = (notes || '').toLowerCase();
  const name = (businessName || '').toLowerCase();
  const comb = `${bt} ${not} ${name}`;

  // 1. Subscription platforms (Flexdz, Shopify, etc.)
  if (not.includes('flexdz') || not.includes('shopify') || not.includes('dzbuild') || not.includes('youcan')) {
    return {
      category: 'platform',
      pain: `لاحظنا بلي راكم خادمين بـ plateforme d'abonnement، والحقيقة هاد المنصات تاكل بزاف من la marge net وأرباح كل كوموند مع الرسوم الشهرية المكررة والنسب اللي تضيع دراهم التجارة مع الوقت.`,
      result: `تتهناو نهائياً من أي اشتراك شهري وتستحفظو بـ 100% من أرباحكم فجيبكم، بـ متجر إلكتروني ملككم التام مدى الحياة بـ nom de domaine propre وبدون أي عمولة على مبيعاتكم.`,
      cta: `شحال راكم تخلصو فـ l'abonnement الشهري مع المنصة حالياً؟ واش رأيكم تتهناو من هاد المصاريف تماماً بـ حل ملكية دائمة (Paiement unique à vie)؟`
    };
  }

  // 2. Broken / Down site
  if (not.includes('broken') || not.includes('down') || not.includes('403') || not.includes('habes')) {
    return {
      category: 'broken_site',
      pain: `حاولنا ندخلوا للرابط تاع le site اللي حاطينو فالبيو لقيناه حابس وما يفتحش للزوار، وهاد المشكل راه يضيعلكم زبائن يدخلوا من الإنستغرام يلقاو الموقع حابس وتقل ثقتهم ويفقدو الرغبة فالشراء.`,
      result: `نصلحوهالكم بـ متجر إلكتروني فائق السرعة وبدون أي انقطاع، يضمنلكم استرجاع كامل حركة الزوار لمبيعات حقيقية وتثبيت صورة البراند الاحترافية لزيادة المبيعات.`,
      cta: `واش راكم حابين نريڤلو المشكل ونعاودو نلونسيو الموقع تاعكم بنظام تقني ذكي بدون أي اشتراكات شهرية؟`
    };
  }

  // 3. Tech / Phones / Tablets / Smart devices / Electronics / Apple
  if (comb.includes('ipad') || comb.includes('iphone') || comb.includes('apple') || comb.includes('samsung') ||
      comb.includes('phone') || comb.includes('smartphone') || comb.includes('tablette') || comb.includes('تابلت') ||
      comb.includes('هاتف') || comb.includes('هواتف') || comb.includes('إلكتروني') || comb.includes('tech') ||
      comb.includes('informatique') || comb.includes('شواحن') || comb.includes('ecouteur') || comb.includes('airpod') ||
      comb.includes('smartwatch') || comb.includes('ساعات ذكية') || (comb.includes('galaxy') && !comb.includes('vetement'))) {
    return {
      category: 'tech',
      pain: `في مجال الهواتف والأجهزة الذكية، كثرة رسائل الزبائن على الأسعار، حالة البطارية (État de batterie)، مدة الضمان (Garantie)، ومساحة التخزين فـ les DMs تاكل نص نهار، والرد اليدوي يخلي بزاف زبائن يترددوا ويروحوا يشوفوا عند باج أخرى.`,
      result: `ترفعوا مبيعاتكم وتربحوا الزبائن المستعجلين، الكتالوج الرقمي يعرض كل موديل بخصائصه التقنية وسعره والضمان بوضوح، والطلب يوصلكم مؤكد ومنظم فالحين.`,
      cta: `واش هو العائق الأكبر اللي راه يدي وقتكم حالياً: كثرة رسائل الاستفسار على الأسعار ومواصفات الأجهزة فـ les messages ولا تأكيد طلبيات التوصيل؟`
    };
  }

  // 4. Wholesale / Commerce de gros / Import
  if (comb.includes('grossiste') || comb.includes('gros') || comb.includes('جملة') || comb.includes('استيراد') || comb.includes('import')) {
    return {
      category: 'wholesale',
      pain: `في تجارة الجملة، أكبر عائق هو ضغط الرسائل والمكالمات تاع أصحاب المحلات يطلبو ليستة الأسعار والسلعة المتوفرة فـ le stock، والرد اليدوي على كل واحد يدي وقت وتصرى فيه فوضى وتأخر فالإرسال.`,
      result: `نظام كتالوج جملة محمي وأوتوماتيكي يفرز les séries والأسعار لأصحاب المحلات والريفوندور فالحين، والكوموند توصلك مفروزة ومحسوبة مباشرة بدون أي تكسار راس.`,
      cta: `واش رايكم فـ منصة ذكية خاصة بطلبيات الجملة تنظم حسابات الزبائن وتريحكم من إرسال الأسعار والكميات بالواحد فـ les messages؟`
    };
  }

  // 5. Optics / Lunettes
  if (comb.includes('optique') || comb.includes('lunette') || comb.includes('نظارات') || comb.includes('بصريات')) {
    return {
      category: 'optics',
      pain: `في مجال النظارات والبصريات، كثرة الأسئلة على نوع العدسات، الحماية من الشمس (UV/Polarized)، والماركات تدي ساعات فالشات والزبائن يترددوا بزاف قبل ما يقرروا.`,
      result: `كتالوج راقي يفرز الموديلات حسب الماركة والمواصفات مع تجربة طلب سلسة تضاعف مبيعاتكم وترسخ احترافية المحل.`,
      cta: `واش رأيكم في كتالوج رقمي يعرض مواصفات وتفاصيل كل نظارة أوتوماتيكياً ويسرع عملية الشراء بدون تضييع وقت الشات؟`
    };
  }

  // 6. Tableware / Dishes / Home Décor / Meuble
  if (comb.includes('dishes') || comb.includes('vaisselle') || comb.includes('décor') || comb.includes('deco') ||
      comb.includes('meuble') || comb.includes('أواني') || comb.includes('مواعن') || comb.includes('ديكور') ||
      comb.includes('أثاث') || comb.includes('linge de maison')) {
    return {
      category: 'home',
      pain: `في مجال الأواني والديكور ومستلزمات المنزل، الزبونات يطلبو فيديوهات وتفاصيل القطع والألوان وطريقة التوصيل الآمن، والرد فالشات ياكل نهار كامل والزبونة تتردد وتضيع الكوموند.`,
      result: `كتالوج إلكتروني منظم يعرض كل سيرفيس بتفاصيله وصوره والقطع المتوفرة، يضاعف طلبياتكم لـ 58 ولاية ويريحكم من ضغط الرسائل اليومية.`,
      cta: `واش هو أكبر مشكل راه يتعبكم: كثرة استفسارات الأسعار وتفاصيل السيرفيسات فـ les messages ولا تأكيد عناوين التوصيل؟`
    };
  }

  // 7. Jewelry / Montres / Horlogerie / Bijoux / Or / Argent
  if (comb.includes('bijou') || comb.includes('montre') || comb.includes('horlogerie') || comb.includes('alliance') ||
      comb.includes('مجوهرات') || comb.includes('ساعات') || comb.includes('ذهب') || comb.includes('فضة')) {
    return {
      category: 'jewelry',
      pain: `في مجال المجوهرات والإكسسوارات والساعات، كل قطعة تطلب صور إضافية وتوضيح للعيار والقياس والمواصفات، والرد فالشات ياكل وقت العمل والورشة ويدي طاقة كبيرة.`,
      result: `معرض إلكتروني راقي يبرز فخامة ولمعان كل قطعة ويزيد ثقة الزبائن، يضاعف طلبياتكم لـ 58 ولاية ويوفر عليكم تعب الشات اليدوي.`,
      cta: `واش هو التحدي الأكبر عندكم حالياً: إرسال تفاصيل ومواصفات القطع فـ les DMs ولا متابعة وتأكيد إرسال الطرود؟`
    };
  }

  // 8. Cosmétique / Parfums / Soin / Parapharmacie
  if (comb.includes('cosmet') || comb.includes('parfum') || comb.includes('beaut') || comb.includes('soin') ||
      comb.includes('عطور') || comb.includes('تجميل') || comb.includes('parapharmacie') || comb.includes('عناية') ||
      comb.includes('صابون')) {
    return {
      category: 'cosmetics',
      pain: `في مجال مستحضرات التجميل والعطور، تكرار نفس الأسئلة على نوع البشرة والمكونات وروائح العطور يدي ساعات، والزبون إذا ما لقاش الرد الفوري يتردد وما يشريش.`,
      result: `ترفعوا معدل المبيعات وثقة الزبائن بأكثر من 40%، كل منتج معروض بفوائده وطريقة استعماله مع طلب سريع ومباشر.`,
      cta: `شحال من كوموند راكم تحسوا بلي تضيع يومياً بسبب تأخر الرد فالشات؟ واش رأيكم تشوفوا كيفاش نأتمتوا هاد العملية كلياً؟`
    };
  }

  // 9. Kids & Babies
  if (comb.includes('enfant') || comb.includes('bébé') || comb.includes('bebe') || comb.includes('bambino') ||
      comb.includes('maman') || comb.includes('أطفال') || comb.includes('مواليد') || comb.includes('صغار') || comb.includes('بيبي')) {
    return {
      category: 'kids',
      pain: `في ملابس ومستلزمات الأطفال والمواليد، الأمهات يسقسو بزاف على الأعمار بالشهور (0-3m, 3-6m...) ونوعية القماش، والرد اليدوي فالشات ياكل وقت كبير والأمهات يترددوا.`,
      result: `كتالوج ذكي يفرز الأعمار والمقاسات المتوفرة أوتوماتيكياً، الأم تختار طلبها في ثواني ويوصلكم الطلب مؤكد ومفروز في الحين.`,
      cta: `واش هو التحدي الأكبر عندكم حالياً: الرد على استفسارات الأعمار والمقاسات فالشات ولا تأكيد طلبيات التوصيل؟`
    };
  }

  // 10. Bags, Gifts & Leather Accessories
  if (comb.includes('cadeau') || comb.includes('sac') || comb.includes('حقائب') || comb.includes('شنط') ||
      comb.includes('هدايا') || comb.includes('سكوشات') || comb.includes('كاسكيتات')) {
    return {
      category: 'bags',
      pain: `في مجال الحقائب والهدايا والإكسسوارات، أكبر ضياع وقت هو إرسال الصور والتفاصيل والألوان لكل زبون فـ les messages، والرد اليدوي ياكل وقت ويفوت طلبيات مستعجلة.`,
      result: `متجر إلكتروني راقي يعرض الموديلات والألوان بوضوح، يسهل على الزبون الاختيار والطلب مباشرة ويوفر عليكم تعب المراسلات اليدوية.`,
      cta: `واش رأيكم في كتالوج ذكي يعرض صور وتفاصيل كل موديل أوتوماتيكياً ويأكد الطلبات فالحين؟`
    };
  }

  // 11. Chaussures / Sneakers
  if (comb.includes('chaussure') || comb.includes('sneaker') || comb.includes('pied') || comb.includes('escarpin') ||
      comb.includes('حذاء') || comb.includes('أحذية') || comb.includes('سنيكرز') || comb.includes('كلاكيطات') ||
      comb.includes('بوتات') || comb.includes('shoes')) {
    return {
      category: 'shoes',
      pain: `المشكل الكبير في تجارة الأحذية هو مقاسات الـ pointures، كل ما يخلص مقاس يقعدو الزبائن يسقسو عليه فالشات، والتأكيد اليدوي بالهاتف يدي ساعات وتصرى معاه نسبة من les retours بسبب الخطأ في اختيار المقاس.`,
      result: `تضاعفوا الطلبيات المؤكدة وتربحوا الزبائن المستعجلين، المقاس اللي يخلص يتنحى أوتوماتيكياً فالحين، ونسبة les retours تهبط بأكثر من 40%.`,
      cta: `واش هو أكبر عائق راه يتعب الفريق تاعكم فالحساب اليومي: الرد على رسائل المقاسات فالشات ولا تأكيد العناوين وles retours تاع التوصيل؟`
    };
  }

  // 12. Abayas / Hijab / Voiles
  if (comb.includes('abaya') || comb.includes('hijab') || comb.includes('voile') || comb.includes('mastour') ||
      comb.includes('عباية') || comb.includes('عبايات') || comb.includes('حجاب') || comb.includes('خمار')) {
    return {
      category: 'abayas',
      pain: `في مجال العبايات، أكبر ضياع وقت هو السؤال المتكرر على أطوال العباية (52, 54, 56, 58) ونوعية القماش، والزبونة فالشات تتردد بزاف وتأخذ وقت طويل قبل ما تقرر وتكوموندي.`,
      result: `تضاعفوا مبيعاتكم وترتاحوا من ضغط الرسائل، الزبونة تختار طولها وتشوف تفاصيل القماش وتأكد طلبها في 20 ثانية، مع انعدام أخطاء المقاسات تماماً.`,
      cta: `واش رايكم فالاعتماد على كتالوج ذكي يفرز الأطوال المتوفرة أوتوماتيكياً ويريحكم من الإجابة الفردية على كل زبونة؟`
    };
  }

  // 13. Robes de soirée / Caftan / Mariage / Traditionnel
  if (comb.includes('robe') || comb.includes('caftan') || comb.includes('mariage') || comb.includes('قفطان') ||
      comb.includes('فساتين') || comb.includes('سهرة') || comb.includes('تقليدي') || comb.includes('كراكو') ||
      comb.includes('عرائس')) {
    return {
      category: 'dresses',
      pain: `في فساتين السهرة والقنادر والقفطان، الزبونات يطلبو تفاصيل القياس بالسنتمتر وصور من زوايا مختلفة فالشات، وهاد الشي يدي سوايع طويلة ومفاوضات قبل أي طلبية.`,
      result: `كتالوج رقمي احترافي يعرض تفاصيل الفساتين بالصور ودليل المقاسات الدقيق، يرفع من قيمة البراند ويضاعف الطلبيات المؤكدة بدون إرهاق المراسلات.`,
      cta: `شحال من وقت يدي منكم شرح تفاصيل القياسات والأقمشة لكل زبونة؟ واش رأيكم تعرضو تصاميمكم بكتالوج VIP يليق بمقام خدمتكم؟`
    };
  }

  // 14. Costumes / Homme / Streetwear / Plus Size Homme
  if (comb.includes('costume') || comb.includes('homme') || comb.includes('streetwear') || comb.includes('casual') ||
      comb.includes('بدلات') || comb.includes('كلاسيك') || comb.includes('رجال') || comb.includes('شبابية') ||
      comb.includes('grande taille')) {
    return {
      category: 'men_fashion',
      pain: `المشكل الأكبر في ملابس الرجال هو كثرة رسائل الزبائن على المقاسات والألوان، والرد اليدوي في les DMs يدي ساعات ويخلي الزبون يروح يشري من باج أخرى إذا طول عليه الرد.`,
      result: `ترفعوا مبيعاتكم بـ 35% إلى 50% وتسترجعوا الزبائن اللي كانو يضيعوا فالانتظار، مع نظام طلب سريع يخدم 24/24 حتى وراكم راقدين.`,
      cta: `واش هو العائق الأكبر اللي راه يدي وقتكم حالياً: الرد على استفسارات الأسعار والمقاسات فـ les messages ولا تأكيد طلبيات التوصيل؟`
    };
  }

  // 15. Prêt-à-porter féminin / Vêtements
  if (comb.includes('femme') || comb.includes('fille') || comb.includes('pyjama') || comb.includes('lingerie') ||
      comb.includes('نسائي') || comb.includes('ألبسة') || comb.includes('ملابس') || comb.includes('vetement') || comb.includes('mode')) {
    return {
      category: 'women_fashion',
      pain: `المشكل في تجارة الملابس النسائية الجاهزة هو كثرة الرسائل على المقاسات والألوان المتوفرة في les DMs، والرد اليدوي ياكل نص نهار ويخلي بزاف زبونات يترددوا ويخرجوا بلا ما يكومونديو.`,
      result: `ترفعوا مبيعاتكم بـ 35% وتسترجعوا الزبونات اللي كانو يضيعوا فالانتظار، الكتالوج يعرض السلعة بمقاساتها الحقيقية والطلب يوصلكم مؤكد ومنظم فالحين.`,
      cta: `واش هو أكبر مشكل راه يدي وقت الفريق تاعكم حالياً: كثرة رسائل المقاسات والألوان ولا تأكيد طلبيات التوصيل؟`
    };
  }

  // 16. General Retail Fallback (Strictly neutral - NEVER mentions clothing or clothes sizes)
  return {
    category: 'general',
    pain: `المشكل الأكبر في التجارة والمبيعات أونلاين هو كثرة الرسائل على الأسعار وتوفر السلعة فـ les DMs، والرد اليدوي ياكل نص نهار ويخلي بزاف زبائن يترددوا ويروحوا يشوفوا عند باج أخرى إذا طول عليهم الرد.`,
    result: `ترفعوا مبيعاتكم بـ 35% وتسترجعوا الزبائن اللي كانو يضيعوا فالانتظار، الكتالوج الرقمي يعرض سلعتكم وتفاصيلها بوضوح والطلب يوصلكم مؤكد ومنظم فالحين.`,
    cta: `واش هو العائق الأكبر اللي راه يدي وقتكم حالياً: كثرة رسائل الاستفسار فـ les DMs ولا متابعة وتأكيد طلبيات التوصيل؟`
  };
}

// 5. Generate Part 3 tailored AI systems (Adapts wording so non-clothing niches never get "المقاس")
export function getTailoredAiPart(category) {
  let ex1 = '';
  let ex2 = '';

  if (category === 'tech') {
    ex1 = `- أولاً: نظام تأكيد الطلبيات التلقائي عبر WhatsApp، الذكاء الاصطناعي يتواصل مع الزبون، يأكد معاه العنوان ومواصفات الجهاز المختار أوتوماتيكياً ويفلتر les faux clients باه تنقص نسبة les retours.`;
    ex2 = `- ثانياً: مساعد ذكي (Assistant IA) يجاوب 24/24 على استفسارات الأسعار والمواصفات التقنية والتوفر فالحين.`;
  } else if (category === 'wholesale') {
    ex1 = `- أولاً: نظام تأكيد طلبيات الجملة التلقائي عبر WhatsApp، الذكاء الاصطناعي يتواصل مع أصحاب المحلات، يأكد معاهم السيريات والعنوان وفلترة الكوموندات الجادة.`;
    ex2 = `- ثانياً: مساعد ذكي (Assistant IA) يجاوب 24/24 على استفسارات الأسعار وتوفر السلعة وles séries فالحين.`;
  } else if (category === 'cosmetics') {
    ex1 = `- أولاً: نظام تأكيد الطلبيات التلقائي عبر WhatsApp، الذكاء الاصطناعي يتواصل مع الزبون، يأكد معاه العنوان والمنتجات المطلوبة أوتوماتيكياً ويفلتر les faux clients باه تنقص نسبة les retours.`;
    ex2 = `- ثانياً: مساعد ذكي (Assistant IA) يجاوب 24/24 على استفسارات الأسعار والمكونات وطريقة الاستعمال والتوفر فالحين.`;
  } else if (category === 'jewelry') {
    ex1 = `- أولاً: نظام تأكيد الطلبيات التلقائي عبر WhatsApp، الذكاء الاصطناعي يتواصل مع الزبون، يأكد معاه العنوان والقطع المختارة أوتوماتيكياً ويفلتر les faux clients باه تنقص نسبة les retours.`;
    ex2 = `- ثانياً: مساعد ذكي (Assistant IA) يجاوب 24/24 على استفسارات الأسعار والموديلات والتوفر فالحين.`;
  } else if (category === 'home') {
    ex1 = `- أولاً: نظام تأكيد الطلبيات التلقائي عبر WhatsApp، الذكاء الاصطناعي يتواصل مع الزبون، يأكد معاه العنوان والسيرفيس المختار أوتوماتيكياً ويفلتر les faux clients باه تنقص نسبة les retours.`;
    ex2 = `- ثانياً: مساعد ذكي (Assistant IA) يجاوب 24/24 على استفسارات الأسعار والألوان والتوفر فالحين.`;
  } else if (category === 'optics') {
    ex1 = `- أولاً: نظام تأكيد الطلبيات التلقائي عبر WhatsApp، الذكاء الاصطناعي يتواصل مع الزبون، يأكد معاه العنوان ومواصفات النظارة أوتوماتيكياً ويفلتر les faux clients.`;
    ex2 = `- ثانياً: مساعد ذكي (Assistant IA) يجاوب 24/24 على استفسارات الأسعار والموديلات المتوفرة فالحين.`;
  } else if (category === 'bags') {
    ex1 = `- أولاً: نظام تأكيد الطلبيات التلقائي عبر WhatsApp، الذكاء الاصطناعي يتواصل مع الزبون، يأكد معاه العنوان والموديل المختار أوتوماتيكياً ويفلتر les faux clients باه تنقص نسبة les retours.`;
    ex2 = `- ثانياً: مساعد ذكي (Assistant IA) يجاوب 24/24 على استفسارات الأسعار والألوان والتوفر فالحين.`;
  } else if (['shoes', 'men_fashion', 'abayas', 'dresses', 'women_fashion', 'kids'].includes(category)) {
    ex1 = `- أولاً: نظام تأكيد الطلبيات التلقائي عبر WhatsApp، الذكاء الاصطناعي يتواصل مع الزبون، يأكد معاه العنوان والمقاس أوتوماتيكياً ويفلتر les faux clients باه تنقص نسبة les retours.`;
    ex2 = `- ثانياً: مساعد ذكي (Assistant IA) يجاوب 24/24 على استفسارات الأسعار والمقاسات والتوفر فالحين.`;
  } else {
    // General / Platform / Broken site
    ex1 = `- أولاً: نظام تأكيد الطلبيات التلقائي عبر WhatsApp، الذكاء الاصطناعي يتواصل مع الزبون، يأكد معاه العنوان وتفاصيل الطلبية أوتوماتيكياً ويفلتر les faux clients باه تنقص نسبة les retours.`;
    ex2 = `- ثانياً: مساعد ذكي (Assistant IA) يجاوب 24/24 على استفسارات الأسعار وتوفر السلعة فالحين.`;
  }

  return `حنا شركة VISION لتطوير مواقع الـ E-commerce وأنظمة الذكاء الاصطناعي (Intelligence Artificielle) المخصصة للتجارة في الجزائر، ونوفرولكم أنظمة ذكية متطورة، مثلاً:
${ex1}
${ex2}
ونقدرو نخدمولكم أي نظام ذكي أو فكرة برمجية مخصصة تحللكم أي مشكل تعانو منو فالمبيعات أو التسيير.`;
}

// 6. Generate Full 4-part Proposal
export function generateTailoredProposal(store) {
  const trueWilaya = resolveTrueWilaya(store.wilaya, store.business_name, store.notes);
  const cleanName = cleanBusinessName(store.business_name);

  // 1. Detect niche and result
  const niche = getNicheAndResult(store.business_type, store.notes, store.business_name);

  // 2. Normal Algerian Arabic Greeting
  const part1 = getNormalGreeting(cleanName, trueWilaya, niche.category);

  // 3. Pain Point + Immediate Result
  const part2 = `${niche.pain}\nوالنتيجة مع الحل تاعنا: ${niche.result}`;

  // 4. Company Presentation + AI Systems (2 Examples tailored) + Custom Software Capability
  const part3 = getTailoredAiPart(niche.category);

  // 5. Conversational Open-ended CTA
  const part4 = niche.cta;

  return [part1, part2, part3, part4].join('\n---\n');
}
