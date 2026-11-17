function getDialectGreeting(wilaya, name) {
  const w = (wilaya || 'ALGER').toUpperCase().trim();

  if (w.includes('BLIDA')) {
    return `السلام عليكم خاوتنا ناس البليدة مدينة الورد، ما شاء الله على خدمة وسلعة ${name} وعلى الأناقة والذوق الرفيع اللي راكم تقدموه.`;
  }
  if (w.includes('ALGER') || w.includes('BOUMERDES') || w.includes('TIPAZA')) {
    return `السلام عليكم ليكيب ${name}، تبارك الله عليكم وعلى السلعة النقية والخدمة الاحترافية اللي راكم تعرضوها فـ Alger.`;
  }
  if (w.includes('ORAN') || w.includes('MOSTAGANEM') || w.includes('SIDI BEL ABBES') || w.includes('MASCARA')) {
    return `السلام عليكم خوتنا ناس وهران الباهية، تبارك الله على الهمة والنشاط تاع ${name} وعلى السلعة الشابة اللي راكم تقدموها للزبائن.`;
  }
  if (w.includes('TLEMCEN')) {
    return `السلام عليكم خوتنا ناس تلمسان عاصمة التاريخ والهمة، ما شاء الله على الذوق الراقي والسلعة المتقونة عند ${name}.`;
  }
  if (w.includes('CONSTANTINE')) {
    return `عسلامة وخير عليكم خاوتنا ناس قسنطينة مدينة الجسور والهمة، تبارك الله على سلعة وخدمة ${name} وربي يبارك في رزقكم.`;
  }
  if (w.includes('SETIF') || w.includes('BORDJ BOU ARRERIDJ') || w.includes('MILA')) {
    return `السلام عليكم خاوتنا ناس سطيف العالي أهل التجارة والشطارة، ما شاء الله على سلعة ${name} وعلى السمعة الطيبة اللي بنيتوها.`;
  }
  if (w.includes('BATNA') || w.includes('KHENCHELA') || w.includes('TEBESSA') || w.includes('OUM EL BOUAGHI')) {
    return `السلام عليكم خاوتنا ناس باتنة والأوراس الأحرار، تبارك الله على السلعة والخدمة المتقونة عند ${name} ربي يبارك فيكم.`;
  }
  if (w.includes('ANNABA') || w.includes('SKIKDA') || w.includes('GUELMA') || w.includes('EL TARF')) {
    return `السلام عليكم خاوتنا ناس عنابة بونة الجميلة، تبارك الله على السلعة الزينة والنشاط المتميز تاع ${name}.`;
  }
  if (w.includes('CHLEF') || w.includes('AIN DEFLA') || w.includes('RELIZANE')) {
    return `السلام عليكم خاوتنا ناس الشلف الكرماء، ما شاء الله على السلعة والنشاط المتقون تاع ${name} ربي يحفظكم.`;
  }
  if (w.includes('BEJAIA') || w.includes('TIZI OUZOU') || w.includes('BOUIRA')) {
    return `السلام عليكم ليكيب ${name}، ربي يبارك على الخدمة النقية والسلعة الممتازة اللي راكم تعرضوها فـ ${wilaya}.`;
  }
  if (w.includes('OUARGLA') || w.includes('BISKRA') || w.includes('EL OUED') || w.includes('GHARDAIA') || w.includes('DJELFA')) {
    return `السلام عليكم خاوتنا ناس ${wilaya} الكرام أهل الجود والكرم، تبارك الله على السلعة النظيفة والخدمة المتقونة عند ${name}.`;
  }

  return `السلام عليكم خاوتنا ليكيب ${name} فـ ${wilaya}، تبارك الله على السلعة النقية والخدمة الاحترافية اللي راكم تقدموها.`;
}

function getNicheContent(niche, notes, website) {
  const n = (niche || '').toLowerCase();
  const not = (notes || '').toLowerCase();
  const web = (website || '').toLowerCase();

  // 1. Subscription platform
  if (not.includes('flexdz') || not.includes('shopify') || web.includes('flexdz') || web.includes('shopify') || web.includes('dzbuild')) {
    return {
      pain: `لاحظنا بلي راكم خادمين بـ plateforme d'abonnement، والحقيقة هاد المنصات تاكل بزاف من la marge net وأرباح كل كوموند مع الرسوم الشهرية المكررة اللي تضيع دراهم التجارة مع الوقت.`,
      result: `بالحل تاعنا تتهناو نهائياً من أي اشتراك شهري وتستحفظو بـ 100% من أرباحكم فجيبكم، بـ متجر إلكتروني ملككم التام مدى الحياة بـ nom de domaine propre وتوصيل فوري للطلبيات.`,
      cta: `شحال راكم تخلصو فـ l'abonnement الشهري مع المنصة حالياً؟ واش رأيكم تتهناو من هاد المصاريف تماماً بـ حل ملكية دائمة (Paiement unique)؟`
    };
  }

  // 2. Broken site
  if (not.includes('broken') || not.includes('down') || not.includes('403') || not.includes('habes')) {
    return {
      pain: `حاولنا ندخلوا للرابط تاع le site اللي حاطينو فالبيو لقيناه حابس وما يفتحش للزوار، وهاد المشكل راه يضيعلكم زبائن يدخلوا من الإنستغرام يلقاو الموقع حابس وتقل ثقتهم.`,
      result: `نصلحوهالكم بـ متجر إلكتروني فائق السرعة وبدون أي انقطاع، يضمنلكم استرجاع كامل حركة الزوار لمبيعات حقيقية وتثبيت صورة البراند الاحترافية.`,
      cta: `واش راكم حابين نعاودو نلونسيو الموقع تاعكم بنظام تقني ذكي بدون أي اشتراكات شهرية؟`
    };
  }

  // 3. Chaussures
  if (n.includes('chaussure') || n.includes('sneaker') || n.includes('pied') || n.includes('escarpin')) {
    return {
      pain: `المشكل الكبير فتجارة الأحذية هو مقاسات الـ pointures، كل ما يخلص مقاس يقعدو الزبائن يسقسو عليه فالشات، والتأكيد اليدوي بالهاتف يدي وقت وتصرى معاه نسبة من les retours بسبب الخطأ في اختيار المقاس.`,
      result: `بالنظام تاعنا تضاعفوا الطلبيات المؤكدة وتربحوا الزبائن المستعجلين، المقاس اللي يخلص يتنحى أوتوماتيكياً فالحين، ونسبة les retours تهبط بأكثر من 40%.`,
      cta: `واش هو أكبر مشكل راه يتعب الفريق تاعكم فالحساب اليومي: الرد على رسائل المقاسات فالشات ولا تأكيد العناوين وles retours تاع التوصيل؟`
    };
  }

  // 4. Costumes / Homme
  if (n.includes('costume') || n.includes('homme') || n.includes('streetwear') || n.includes('casual')) {
    return {
      pain: `المشكل الأكبر في ملابس الرجال هو كثرة رسائل الزبائن على المقاسات والألوان، والرد اليدوي في les DMs يدي ساعات ويخلي الزبون يروح يشري من باج أخرى إذا طول عليه الرد.`,
      result: `بالحل تاعنا ترفعوا مبيعاتكم بـ 35% إلى 50% وتسترجعوا الزبائن اللي كانو يضيعوا فالانتظار، مع نظام طلب سريع يخدم 24/24 حتى وراكم راقدين.`,
      cta: `واش هو العائق الأكبر اللي راه يدي وقتكم حالياً: الرد على استفسارات الأسعار والمقاسات فـ les messages ولا تأكيد طلبيات التوصيل؟`
    };
  }

  // 5. Abayas & Voiles
  if (n.includes('abaya') || n.includes('hijab') || n.includes('voile')) {
    return {
      pain: `في مجال العبايات، أكبر ضياع وقت هو السؤال المتكرر على أطوال العباية (52, 54, 56, 58) ونوعية القماش، والزبونة فالشات تتردد بزاف وتأخذ وقت طويل قبل ما تقرر وتكوموندي.`,
      result: `تضاعفوا مبيعاتكم وترتاحوا من ضغط الرسائل، الزبونة تختار طولها وتشوف تفاصيل القماش وتأكد طلبها فـ 20 ثانية، مع انعدام أخطاء المقاسات تماماً.`,
      cta: `واش رايكم فالاعتماد على كتالوج ذكي يفرز الأطوال المتوفرة أوتوماتيكياً ويريحكم من الإجابة الفردية على كل زبونة؟`
    };
  }

  // 6. Cosmétique / Parfums
  if (n.includes('cosmetique') || n.includes('parfum') || n.includes('beaut') || n.includes('soin')) {
    return {
      pain: `في مجال مستحضرات التجميل والعطور، تكرار نفس الأسئلة على نوع البشرة والمكونات وروائح العطور يدي ساعات، والزبون إذا ما لقاش الرد الفوري يتردد وما يشريش.`,
      result: `ترفعوا معدل المبيعات وثقة الزبائن بأكثر من 40%، كل منتج معروض بفوائده وطريقة استعماله مع طلب سريع ومباشر.`,
      cta: `شحال من كوموند راكم تحسوا بلي تضيع يومياً بسبب تأخر الرد فالشات؟ واش رأيكم تشوفوا كيفاش نأتمتوا هاد العملية كلياً؟`
    };
  }

  // 7. Bijoux / Accessoires
  if (n.includes('bijou') || n.includes('accessoire') || n.includes('alliance') || n.includes('or')) {
    return {
      pain: `في مجال المجوهرات والإكسسوارات، كل قطعة تطلب صور إضافية وتوضيح للعيار والقياس، والرد فالشات ياكل وقت العمل والورشة ويدي طاقة كبيرة.`,
      result: `معرض إلكتروني راقي يبرز فخامة ولمعان كل قطعة ويزيد ثقة الزبائن، يضاعف طلبياتكم لـ 58 ولاية ويوفر عليكم تعب الشات اليدوي.`,
      cta: `واش هو التحدي الأكبر عندكم حالياً: إرسال تفاصيل ومقاسات القطع فـ les DMs ولا متابعة وتأكيد إرسال الطرود؟`
    };
  }

  // Default: Prêt-à-porter féminin / général
  return {
    pain: `المشكل في تجارة الملابس الجاهزة هو كثرة الرسائل على المقاسات والألوان المتوفرة فـ les DMs، والرد اليدوي ياكل نص نهار ويخلي بزاف زبونات يترددوا ويخرجوا بلا ما يكومونديو.`,
    result: `ترفعوا مبيعاتكم بـ 35% وتسترجعوا الزبونات اللي كانو يضيعوا فالانتظار، الكتالوج يعرض السلعة بمقاساتها الحقيقية والطلب يوصلكم مؤكد ومنظم فالحين.`,
    cta: `واش هو أكبر مشكل راه يدي وقت الفريق تاعكم حالياً: كثرة رسائل المقاسات والألوان ولا تأكيد طلبيات التوصيل؟`
  };
}

function generateTailoredArabicProposal(store) {
  const part1 = getDialectGreeting(store.wilaya, store.businessName);
  const nicheData = getNicheContent(store.businessType, store.notes, store.website);

  const part2 = `${nicheData.pain}\nبفضل الحل تاعنا، ${nicheData.result}`;

  const part3 = `حنا شركة VISION لتطوير مواقع الـ E-commerce وأنظمة الذكاء الاصطناعي (Intelligence Artificielle) المخصصة للتجارة في الجزائر، ونوفرولكم أنظمة ذكية متطورة، مثلاً:\n- أولاً: نظام تأكيد الطلبيات التلقائي عبر WhatsApp، الذكاء الاصطناعي يتواصل مع الزبون، يأكد معاه العنوان والمقاس أوتوماتيكياً ويفلتر les faux clients باه تنقص نسبة les retours.\n- ثانياً: مساعد ذكي (Assistant IA) يجاوب 24/24 على استفسارات الأسعار والمقاسات والتوفر فالحين.\nونقدرو نخدمولكم أي نظام ذكي أو فكرة برمجية مخصصة تحللكم أي مشكل تعانو منو فالمبيعات أو التسيير.`;

  const part4 = nicheData.cta;

  return [part1, part2, part3, part4].join('\n---\n');
}

// Test sample
const testStore = {
  businessName: "Boutique Jouriya",
  businessType: "Femme Prêt-à-Porter & Hijab",
  wilaya: "Blida",
  notes: "Followers: 30.8k"
};

console.log(generateTailoredArabicProposal(testStore));
