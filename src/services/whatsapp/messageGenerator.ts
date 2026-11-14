import { ChunkedMessage, GeneratedOutreachContent } from './types.js';

interface ProspectData {
  businessName: string;
  businessType: string;
  wilaya?: string | null;
  phone?: string | null;
  instagramUrl?: string | null;
  customProposal?: string | null;
}

/**
 * Calculates human-like typing delay based on chunk length in Arabic/French characters.
 * Average human types 35-50 words per minute (~25-45ms per character) plus thinking pauses.
 */
function calculateTypingDelay(text: string): number {
  const base = Math.min(8500, Math.max(3000, text.length * 42));
  const jitter = Math.floor(Math.random() * 1500);
  return base + jitter;
}

/**
 * Generates the tailored 4-part Proposal message strictly adhering to our agreed standards:
 * - Arabic script with French commercial/tech loanwords
 * - Specific pain point with real money/time loss calculations
 * - Introduction of VISION as a web development and AI systems company
 * - Direct link to digitalvisiondz.com and user's WhatsApp: 0771335039
 */
export function generateChunkedProposal(prospect: ProspectData): GeneratedOutreachContent {
  const name = (prospect.businessName || 'خويا').trim();
  const type = (prospect.businessType || '').toLowerCase();
  const wilayaStr = prospect.wilaya && prospect.wilaya.trim() ? ` في ${prospect.wilaya.trim()}` : '';

  // Part 1: Tahya & Compliment
  let part1 = `السلام عليكم خويا، شفت la page تاعكم ما شاء الله وسلعة ${prospect.businessType || 'التجارة'}${wilayaStr} باينة نقية ربي يبارك.`;

  // Part 2: Pain Point & Money/Time Calculation
  let part2 = '';
  let part3 = '';

  if (type.includes('streetwear') || type.includes('sportswear') || type.includes('clothing') || type.includes('vetement') || type.includes('fashion') || type.includes('men')) {
    part2 = `علابالي بلي streetwear يتباع بالسرعة و l'impulsion، وتأخر الرد في les messages بساعتين يخلي le client يبرد ويروح يشري من عند باج أخرى، وتضيعلك ما لا يقل عن 2 إلى 3 ملايين مبيعات كل سهرة.`;
    part3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم boutique en ligne ذكية تخلي le client يشوف les tailles disponibles ويكوموندي فالحين، توفر 3 سوايع كل ليلة وترفع les ventes تاعك بـ 30%.`;
  } else if (type.includes('chaussure') || type.includes('sneaker') || type.includes('shoe') || type.includes('basket')) {
    part2 = `أكبر مشكل في les chaussures هو تكرار les questions على les pointures و les retours كي تجيه ماشي قيسو، والرد اليدوي في les messages يدي 4 سوايع في النهار ويطيحلك الكليون في الشك وتخسر حق التوصيل.`;
    part3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم plateforme خاصة بالأحذية تخلي الزبون يختر la pointure المتوفرة في le stock بالضبط، تقضي على les retours وترفع les ventes تاعك بـ 35%.`;
  } else if (type.includes('cosmet') || type.includes('beaute') || type.includes('skin') || type.includes('parfum')) {
    part2 = `في le domaine تاع cosmétique أكبر ضياع وقت في les messages هو تكرار نفس الأسئلة على نوع البشرة و mode d'utilisation، و le client إذا ما لقاش رد فوري يتردد وما يشريش.`;
    part3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم boutique en ligne ذكية تعرض كل produit مع les bienfaits وطريقة الاستعمال وفورمير كوند سريعة، ترفع نسبة الثقة و les commandes بـ 40%.`;
  } else if (type.includes('femme') || type.includes('robe') || type.includes('outfit') || type.includes('hijab') || type.includes('abaya')) {
    part2 = `المشكل في les tenues والموضة النسائية أن الزبونات يسقسوا بكثرة في les messages على المقاسات والألوان المتوفرة، والانتظار يخليهم يشوفوا باجات أخرى وتضيعلك ما لا يقل عن 3 ملايين كل سهرة.`;
    part3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم boutique en ligne أنيقة تعرض كل tenue بالمقاس واللون المتوفر، توفر تعب الرد وترفع les ventes بـ 30%.`;
  } else if (type.includes('phone') || type.includes('tech') || type.includes('electron') || type.includes('ipad') || type.includes('informatique')) {
    part2 = `في les appareils الإلكترونية الزبون يخاف ويبعث 40 سؤال في les messages على l'état و la garantie و الدفع، والرد اليدوي يدي نص نهار ويبقى الكليون متردد.`;
    part3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم plateforme احترافية تعرض الأجهزة بـ fiche technique وفاتورة واضحة، تزرع ثقة عمياء وتسرع les ventes بـ 50%.`;
  } else {
    // General E-commerce / retail
    part2 = `علابالي بلي خدمة les messages وضياع الوقت في شرح الأسعار وتأكيد طلبيات التوصيل تدي ما لا يقل عن 3 إلى 4 سوايع كل يوم وتضيعلك زبائن مستعجلين يروحوا للمنافسين.`;
    part3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم boutique en ligne سريعة تخلي الكليون يشري مباشرة في 10 ثواني، توفر التعب وتضاعف مبيعاتك بنظام أوتوماتيكي كامل.`;
  }

  // If a custom proposal was manually written/stored for this prospect, use it if it exists
  if (prospect.customProposal && prospect.customProposal.trim()) {
    // If it has multiple paragraphs or lines, split it into chunks
    const customChunks = prospect.customProposal.split(/\n\n+/).filter(c => c.trim().length > 0);
    if (customChunks.length >= 2) {
      const chunks: ChunkedMessage[] = customChunks.map((chunk, idx) => ({
        partIndex: idx + 1,
        totalParts: customChunks.length,
        partName: `Part ${idx + 1}`,
        text: chunk.trim(),
        typingDelayMs: calculateTypingDelay(chunk),
        pauseAfterMs: 4000 + Math.floor(Math.random() * 4000)
      }));
      return {
        chunks,
        fullText: customChunks.join('\n\n')
      };
    }
  }

  // Part 4: Official Portfolio Link & WhatsApp & Closing
  const part4 = `تفرج le site تاعنا: digitalvisiondz.com وتواصل معايا في WhatsApp: 0771335039 بالتوفيق خويا العزيز.`;

  const rawParts = [
    { name: 'التحية والمدح', text: part1 },
    { name: 'نقطة الألم وحساب الخسارة', text: part2 },
    { name: 'التعريف بـ VISION والحل', text: part3 },
    { name: 'رابط الموقع والواتساب', text: part4 }
  ];

  const chunks: ChunkedMessage[] = rawParts.map((item, idx) => ({
    partIndex: idx + 1,
    totalParts: rawParts.length,
    partName: item.name,
    text: item.text,
    typingDelayMs: calculateTypingDelay(item.text),
    pauseAfterMs: idx === rawParts.length - 1 ? 0 : 4500 + Math.floor(Math.random() * 3500)
  }));

  return {
    chunks,
    fullText: rawParts.map(p => p.text).join('\n\n')
  };
}

/**
 * Follow-up 1 (48h after first message with no reply):
 * Short, polite, value-focused check-in.
 */
export function generateFollowUp1(prospect: ProspectData): GeneratedOutreachContent {
  const businessName = prospect.businessName || 'خويا';

  const part1 = `السلام عليكم خويا، إن شاء الله راك مليح وصحتك بخير.`;
  const part2 = `حبيت نسقسيك برك إذا لحقك الميساج اللي فات وكان عندك وقت تشوف كيفاش نقصو ضياع الوقت في les messages ونرفعو les ventes في ${businessName}.`;
  const part3 = `تفضل تفرج خدمتنا هنا في الموقع: digitalvisiondz.com وراني متوفر في أي وقت هنا في WhatsApp خويا العزيز.`;

  const rawParts = [
    { name: 'سلام ومتابعة', text: part1 },
    { name: 'تذكير بالقيمة', text: part2 },
    { name: 'رابط الموقع', text: part3 }
  ];

  const chunks: ChunkedMessage[] = rawParts.map((item, idx) => ({
    partIndex: idx + 1,
    totalParts: rawParts.length,
    partName: item.name,
    text: item.text,
    typingDelayMs: calculateTypingDelay(item.text),
    pauseAfterMs: idx === rawParts.length - 1 ? 0 : 4000 + Math.floor(Math.random() * 3000)
  }));

  return {
    chunks,
    fullText: rawParts.map(p => p.text).join('\n\n')
  };
}

/**
 * Follow-up 2 (4 days after Follow-up 1 with no reply):
 * Final courteous closing message leaving the door open.
 */
export function generateFollowUp2(prospect: ProspectData): GeneratedOutreachContent {
  const part1 = `صحا خويا العزيز، ربي يعاونك ويسهل لك في خدمتك ومشاريعك.`;
  const part2 = `أنا ما نحبش نبرزيك بكثرة الرسائل، حبيت برك نخليلك رابط الموقع تاعنا digitalvisiondz.com ورقمي إذا حبيت في أي وقت نطلعو لك boutique en ligne ولا سيستيم ذكي لخدمتك. بالتوفيق خويا.`;

  const rawParts = [
    { name: 'تحية ودعاء', text: part1 },
    { name: 'إقفال محترم للرسائل', text: part2 }
  ];

  const chunks: ChunkedMessage[] = rawParts.map((item, idx) => ({
    partIndex: idx + 1,
    totalParts: rawParts.length,
    partName: item.name,
    text: item.text,
    typingDelayMs: calculateTypingDelay(item.text),
    pauseAfterMs: idx === rawParts.length - 1 ? 0 : 3500 + Math.floor(Math.random() * 2500)
  }));

  return {
    chunks,
    fullText: rawParts.map(p => p.text).join('\n\n')
  };
}
