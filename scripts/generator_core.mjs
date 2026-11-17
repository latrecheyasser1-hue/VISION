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

// 3. Normal Algerian Arabic greeting (Clean, professional, natural - NO "تبارك الله", NO forced dialects)
export function getNormalGreeting(name, wilaya, businessType) {
  const bt = (businessType || '').toLowerCase();
  const wStr = (wilaya && wilaya !== 'الجزائر' && wilaya !== 'MULTIPLE') ? ` في ${wilaya}` : '';

  if (bt.includes('femme') || bt.includes('robe') || bt.includes('abaya') || bt.includes('hijab')) {
    return `السلام عليكم، شفت la page تاع ${name}${wStr} ما شاء الله les modèles والموضة النسائية قمة في الأناقة والخدمة تاعكم الله يبارك.`;
  }

  return `السلام عليكم خويا، شفت la page تاع ${name}${wStr} ما شاء الله سلعة نقية واحترافية والخدمة تاعكم الله يبارك.`;
}

// 4. Pain points + Concrete Results + CTA
export function getNicheAndResult(businessType, notes) {
  const bt = (businessType || '').toLowerCase();
  const not = (notes || '').toLowerCase();

  // A. Subscription platforms (Flexdz, Shopify, etc.)
  if (not.includes('flexdz') || not.includes('shopify') || not.includes('dzbuild')) {
    return {
      pain: `لاحظنا بلي راكم خادمين بـ plateforme d'abonnement، والحقيقة هاد المنصات تاكل بزاف من la marge net وأرباح كل كوموند مع الرسوم الشهرية المكررة والنسب اللي تضيع دراهم التجارة مع الوقت.`,
      result: `تتهناو نهائياً من أي اشتراك شهري وتستحفظو بـ 100% من أرباحكم فجيبكم، بـ متجر إلكتروني ملككم التام مدى الحياة بـ nom de domaine propre وبدون أي عمولة على مبيعاتكم.`,
      cta: `شحال راكم تخلصو فـ l'abonnement الشهري مع المنصة حالياً؟ واش رأيكم تتهناو من هاد المصاريف تماماً بـ حل ملكية دائمة (Paiement unique à vie)؟`
    };
  }

  // B. Broken / Down site
  if (not.includes('broken') || not.includes('down') || not.includes('403') || not.includes('habes')) {
    return {
      pain: `حاولنا ندخلوا للرابط تاع le site اللي حاطينو فالبيو لقيناه حابس وما يفتحش للزوار، وهاد المشكل راه يضيعلكم زبائن يدخلوا من الإنستغرام يلقاو الموقع حابس وتقل ثقتهم ويفقدو الرغبة فالشراء.`,
      result: `نصلحوهالكم بـ متجر إلكتروني فائق السرعة وبدون أي انقطاع، يضمنلكم استرجاع كامل حركة الزوار لمبيعات حقيقية وتثبيت صورة البراند الاحترافية لزيادة المبيعات.`,
      cta: `واش راكم حابين نريڤلو المشكل ونعاودو نلونسيو الموقع تاعكم بنظام تقني ذكي بدون أي اشتراكات شهرية؟`
    };
  }

  // C. Chaussures / Sneakers
  if (bt.includes('chaussure') || bt.includes('sneaker') || bt.includes('pied') || bt.includes('escarpin') || bt.includes('حذاء') || bt.includes('أحذية')) {
    return {
      pain: `المشكل الكبير في تجارة الأحذية هو مقاسات الـ pointures، كل ما يخلص مقاس يقعدو الزبائن يسقسو عليه فالشات، والتأكيد اليدوي بالهاتف يدي ساعات وتصرى معاه نسبة من les retours بسبب الخطأ في اختيار المقاس.`,
      result: `تضاعفوا الطلبيات المؤكدة وتربحوا الزبائن المستعجلين، المقاس اللي يخلص يتنحى أوتوماتيكياً فالحين، ونسبة les retours تهبط بأكثر من 40%.`,
      cta: `واش هو أكبر عائق راه يتعب الفريق تاعكم فالحساب اليومي: الرد على رسائل المقاسات فالشات ولا تأكيد العناوين وles retours تاع التوصيل؟`
    };
  }

  // D. Costumes / Homme / Streetwear
  if (bt.includes('costume') || bt.includes('homme') || bt.includes('streetwear') || bt.includes('casual') || bt.includes('رجالي') || bt.includes('رجال')) {
    return {
      pain: `المشكل الأكبر في ملابس الرجال هو كثرة رسائل الزبائن على المقاسات والألوان، والرد اليدوي في les DMs يدي ساعات ويخلي الزبون يروح يشري من باج أخرى إذا طول عليه الرد.`,
      result: `ترفعوا مبيعاتكم بـ 35% إلى 50% وتسترجعوا الزبائن اللي كانو يضيعوا فالانتظار، مع نظام طلب سريع يخدم 24/24 حتى وراكم راقدين.`,
      cta: `واش هو العائق الأكبر اللي راه يدي وقتكم حالياً: الرد على استفسارات الأسعار والمقاسات فـ les messages ولا تأكيد طلبيات التوصيل؟`
    };
  }

  // E. Abayas / Hijab / Voiles
  if (bt.includes('abaya') || bt.includes('hijab') || bt.includes('voile') || bt.includes('mastour') || bt.includes('عباية') || bt.includes('حجاب')) {
    return {
      pain: `في مجال العبايات، أكبر ضياع وقت هو السؤال المتكرر على أطوال العباية (52, 54, 56, 58) ونوعية القماش، والزبونة فالشات تتردد بزاف وتأخذ وقت طويل قبل ما تقرر وتكوموندي.`,
      result: `تضاعفوا مبيعاتكم وترتاحوا من ضغط الرسائل، الزبونة تختار طولها وتشوف تفاصيل القماش وتأكد طلبها في 20 ثانية، مع انعدام أخطاء المقاسات تماماً.`,
      cta: `واش رايكم فالاعتماد على كتالوج ذكي يفرز الأطوال المتوفرة أوتوماتيكياً ويريحكم من الإجابة الفردية على كل زبونة؟`
    };
  }

  // F. Cosmétique / Parfums / Soin
  if (bt.includes('cosmetique') || bt.includes('parfum') || bt.includes('beaut') || bt.includes('soin') || bt.includes('عطور') || bt.includes('تجميل')) {
    return {
      pain: `في مجال مستحضرات التجميل والعطور، تكرار نفس الأسئلة على نوع البشرة والمكونات وروائح العطور يدي ساعات، والزبون إذا ما لقاش الرد الفوري يتردد وما يشريش.`,
      result: `ترفعوا معدل المبيعات وثقة الزبائن بأكثر من 40%، كل منتج معروض بفوائده وطريقة استعماله مع طلب سريع ومباشر.`,
      cta: `شحال من كوموند راكم تحسوا بلي تضيع يومياً بسبب تأخر الرد فالشات؟ واش رأيكم تشوفوا كيفاش نأتمتوا هاد العملية كلياً؟`
    };
  }

  // G. Bijoux / Accessoires / Montres
  if (bt.includes('bijou') || bt.includes('accessoire') || bt.includes('montre') || bt.includes('alliance') || bt.includes('مجوهرات') || bt.includes('ساعات')) {
    return {
      pain: `في مجال المجوهرات والإكسسوارات، كل قطعة تطلب صور إضافية وتوضيح للعيار والقياس، والرد فالشات ياكل وقت العمل والورشة ويدي طاقة كبيرة.`,
      result: `معرض إلكتروني راقي يبرز فخامة ولمعان كل قطعة ويزيد ثقة الزبائن، يضاعف طلبياتكم لـ 58 ولاية ويوفر عليكم تعب الشات اليدوي.`,
      cta: `واش هو التحدي الأكبر عندكم حالياً: إرسال تفاصيل ومقاسات القطع فـ les DMs ولا متابعة وتأكيد إرسال الطرود؟`
    };
  }

  // H. Robes de soirée / Caftan / Mariage
  if (bt.includes('robe') || bt.includes('caftan') || bt.includes('mariage') || bt.includes('قفطان') || bt.includes('فساتين') || bt.includes('سهرة')) {
    return {
      pain: `في فساتين السهرة والقنادر والقفطان، الزبونات يطلبو تفاصيل القياس بالسنتمتر وصور من زوايا مختلفة فالشات، وهاد الشي يدي سوايع طويلة ومفاوضات قبل أي طلبية.`,
      result: `كتالوج رقمي احترافي يعرض تفاصيل الفساتين بالصور ودليل المقاسات الدقيق، يرفع من قيمة البراند ويضاعف الطلبيات المؤكدة بدون إرهاق المراسلات.`,
      cta: `شحال من وقت يدي منكم شرح تفاصيل القياسات والأقمشة لكل زبونة؟ واش رأيكم تعرضو تصاميمكم بكتالوج VIP يليق بمقام خدمتكم؟`
    };
  }

  // Default: Prêt-à-porter féminin / Vêtements
  return {
    pain: `المشكل في تجارة الملابس الجاهزة هو كثرة الرسائل على المقاسات والألوان المتوفرة في les DMs، والرد اليدوي ياكل نص نهار ويخلي بزاف زبونات يترددوا ويخرجوا بلا ما يكومونديو.`,
    result: `ترفعوا مبيعاتكم بـ 35% وتسترجعوا الزبونات اللي كانو يضيعوا فالانتظار، الكتالوج يعرض السلعة بمقاساتها الحقيقية والطلب يوصلكم مؤكد ومنظم فالحين.`,
    cta: `واش هو أكبر مشكل راه يدي وقت الفريق تاعكم حالياً: كثرة رسائل المقاسات والألوان ولا تأكيد طلبيات التوصيل؟`
  };
}

// 5. Generate Full 4-part Proposal
export function generateTailoredProposal(store) {
  const trueWilaya = resolveTrueWilaya(store.wilaya, store.business_name, store.notes);
  const cleanName = cleanBusinessName(store.business_name);

  // Part 1: Normal Algerian Arabic Greeting (No "تبارك الله", No regional gimmick accents)
  const part1 = getNormalGreeting(cleanName, trueWilaya, store.business_type);

  // Part 2: Pain Point + Immediate Result
  const niche = getNicheAndResult(store.business_type, store.notes);
  const part2 = `${niche.pain}\nوالنتيجة مع الحل تاعنا: ${niche.result}`;

  // Part 3: Company Presentation + AI Systems (2 Examples) + Custom Software Capability
  const part3 = `حنا شركة VISION لتطوير مواقع الـ E-commerce وأنظمة الذكاء الاصطناعي (Intelligence Artificielle) المخصصة للتجارة في الجزائر، ونوفرولكم أنظمة ذكية متطورة، مثلاً:
- أولاً: نظام تأكيد الطلبيات التلقائي عبر WhatsApp، الذكاء الاصطناعي يتواصل مع الزبون، يأكد معاه العنوان والمقاس أوتوماتيكياً ويفلتر les faux clients باه تنقص نسبة les retours.
- ثانياً: مساعد ذكي (Assistant IA) يجاوب 24/24 على استفسارات الأسعار والمقاسات والتوفر فالحين.
ونقدرو نخدمولكم أي نظام ذكي أو فكرة برمجية مخصصة تحللكم أي مشكل تعانو منو فالمبيعات أو التسيير.`;

  // Part 4: Conversational Open-ended CTA
  const part4 = niche.cta;

  return [part1, part2, part3, part4].join('\n---\n');
}
