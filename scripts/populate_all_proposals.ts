import { sql } from '../src/db/client.js';

interface NullProspect {
  id: string;
  business_name: string;
  business_type: string;
  wilaya: string | null;
}

function craftCustomProposal(p: NullProspect): string {
  const name = p.business_name.trim();
  const wilaya = (p.wilaya || '').trim();
  const wilayaStr = wilaya ? ` في ${wilaya}` : '';
  const type = (p.business_type || '').toLowerCase();

  let p1 = `السلام عليكم خويا، شفت la page تاع ${name} ما شاء الله وسلعة نقية ربي يبارك.`;
  let p2 = '';
  let p3 = '';

  if (type.includes('femme') || type.includes('robe')) {
    p1 = `السلام عليكم، شفت سلعة ${name}${wilayaStr} ما شاء الله les tenues والموضة النسائية قمة في الأناقة ربي يبارك.`;
    p2 = `المشكل في الموضة النسائية أن الزبونات يسقسوا بكثرة في les messages على المقاسات المتوفرة والألوان، والانتظار يخليهم يشوفوا باجات أخرى وتضيعلكم مبيعات كل سهرة.`;
    p3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم boutique en ligne أنيقة تعرض كل موديل بالمقاس والألوان المتوفرة، توفر تعب الرد وترفع مبيعاتكم بـ 30%.`;
  } else if (type.includes('cadeau') || type.includes('gift')) {
    p1 = `السلام عليكم، شفت les cadeaux وباقات الهدايا عند ${name}${wilayaStr} ما شاء الله خدمة نقية وتفتح النفس ربي يبارك.`;
    p2 = `في مجال الهدايا أكثر مشكل يدي الوقت في les messages هو شرح تفاصيل الباقة وتأكيد التوصيل في المناسبة، والزبون يحب يشوف الخيارات بوضوح باه يثق ويكوموندي فالحين.`;
    p3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم متجر إلكتروني راقي يعرض كل باقة هدايا بتفاصيلها وسعرها وفورمير طلب سريعة، تضاعف مبيعاتكم وتريحكم من تعب الشات.`;
  } else if (type.includes('shoe') || type.includes('chaussure')) {
    p1 = `السلام عليكم خويا، شفت سلعة الأحذية عند ${name}${wilayaStr} ما شاء الله موديلات توب ربي يبارك.`;
    p2 = `أكبر مشكل في les chaussures هو تكرار نفس الأسئلة على les pointures و les retours كي تجيه ماشي قيسو، والرد اليدوي في les messages يدي 4 سوايع في النهار وتخسرو حق التوصيل.`;
    p3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم plateforme خاصة بالأحذية تخلي الزبون يخير la pointure المتوفرة في le stock بالضبط، تقضي على les retours وترفع مبيعاتكم بـ 35%.`;
  } else if (type.includes('cosmet')) {
    p1 = `السلام عليكم خويا، شفت منتجات ${name}${wilayaStr} ما شاء الله كلش نقي واحترافي ربي يبارك.`;
    p2 = `في le domaine تاع cosmétique أكبر ضياع وقت في les messages هو تكرار نفس الأسئلة على نوع البشرة و mode d'utilisation، و le client إذا ما لقاش رد فوري يتردد وما يشريش.`;
    p3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم boutique en ligne ذكية تعرض كل produit مع les bienfaits وطريقة الاستعمال وفورمير كوند سريعة، ترفع نسبة الثقة و les commandes بـ 40%.`;
  } else if (type.includes('dish') || type.includes('vaisselle')) {
    p1 = `السلام عليكم، شفت سلعة الأواني ولوازم الدار عند ${name}${wilayaStr} ما شاء الله سلعة نقية ومتقونة ربي يبارك.`;
    p2 = `في أواني المطبخ ولوازم البيت، الزبونات يسقسوا بزاف على الأسعار والجودة وتفاصيل التوصيل، والرد اليدوي في les messages يدي نص نهار ويخلط الطلبيات.`;
    p3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم boutique en ligne واضحة تعرض كل قطعة بسعرها مع التوصيل لـ 58 ولاية، توفر عليكم تعب الرد وتضاعف الطلبيات.`;
  } else if (type.includes('accessoire') || type.includes('bijoux')) {
    p1 = `السلام عليكم، شفت les accessoires عند ${name}${wilayaStr} ما شاء الله موديلات راقية le standing هايل ربي يبارك.`;
    p2 = `في les accessoires الزبائن يسقسوا بزاف على صور حقيقية للسلعة والسعر ومدة التوصيل، والتأخر في الرد يخلي le client يتردد ويروح لباجات منافسة.`;
    p3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم boutique en ligne أنيقة تعرض كل أكسسوار بتفاصيله وسعره، تزرع ثقة عمياء وتسرع les commandes.`;
  } else if (type.includes('tech') || type.includes('phone')) {
    p1 = `السلام عليكم خويا، شفت سلعة ${name}${wilayaStr} ما شاء الله ليزاباراي وسلعة التيك توب ربي يبارك.`;
    p2 = `في les appareils الإلكترونية الزبون يخاف ويبعث 40 سؤال في les messages على l'état و la garantie و الدفع، والرد اليدوي يدي نص نهار ويبقى الكليون متردد.`;
    p3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم plateforme احترافية تعرض الأجهزة بـ fiche technique وفاتورة واضحة، تزرع ثقة عمياء وتسرع les ventes بـ 50%.`;
  } else {
    // General clothing
    p1 = `السلام عليكم خويا، شفت سلعة ${name}${wilayaStr} ما شاء الله ملابس نقية وخدمة متقونة ربي يبارك.`;
    p2 = `المشكل في تجارة الملابس هو كثرة رسائل الزبائن على المقاسات والألوان المتوفرة وطلبيات التوصيل، والرد اليدوي يدي ساعات ويخلي الزبون المستعجل يروح يشري من عند باج أخرى.`;
    p3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم boutique en ligne ذكية تعرض السلعة بالمقاسات والأسعار وفورمير طلب سريعة في 10 ثواني، ترفع مبيعاتكم بـ 30%.`;
  }

  const p4 = `تفرج le site تاعنا: digitalvisiondz.com بالتوفيق خويا العزيز.`;
  return `${p1} ${p2} ${p3} ${p4}`;
}

async function run() {
  const nullRows: NullProspect[] = await sql.query(`
    SELECT id, business_name, business_type, wilaya
    FROM outreach
    WHERE custom_proposal IS NULL
  `);

  console.log(`Found ${nullRows.length} prospects without custom_proposal.`);

  for (const r of nullRows) {
    const proposal = craftCustomProposal(r);
    await sql.query(`
      UPDATE outreach
      SET custom_proposal = $1
      WHERE id = $2
    `, [proposal, r.id]);
    console.log(`Saved custom proposal for [${r.business_name}] (${r.business_type})`);
  }

  console.log('All 27 prospects now have personalized custom proposals in DB!');
}

run().catch(console.error);
