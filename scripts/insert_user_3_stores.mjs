import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function insertThreeStores() {
  const stores = [
    {
      business_name: 'Case Phone',
      business_type: 'كفرات وإكسسوارات هواتف ذكية',
      phone: '0792221327',
      instagram_url: 'https://www.instagram.com/case.phone06/',
      status: 'pending',
      notes: 'Followers: 24.8k. Phone cases / Bejaia. Delivery 58 wilayas. WhatsApp link in bio.',
      wilaya: 'بجاية',
      custom_proposal: `السلام عليكم خويا، شفت la page تاع Case Phone في بجاية ما شاء الله les pochettes وتشكيلة كفرات وإكسسوارات الهواتف روعة وسلعة نقية الله يبارك.
---
المشكل الأكبر في بيع كفرات الهواتف هو كثرة الرسائل فـ les DMs على توافق الموديلات، كل زبون يسقسي على موديل تيليفونو (iPhone 11, 13, 15, Samsung...) ولا كاين الكفر تاعو، والبحث اليدوي في الستوك يدي وقت طويل ويخلي الزبائن يترددوا ويروحوا يشوفوا عند باج أخرى.
والنتيجة مع الحل تاعنا: ترفعوا مبيعاتكم بـ 35% وتربحوا الزبائن المستعجلين، الكتالوج الرقمي يفرز الكفرات المتوفرة حسب موديل الهاتف في ثواني، والطلب يوصلكم مؤكد ومنظم فالحين.
---
حنا شركة VISION لتطوير مواقع الـ E-commerce وأنظمة الذكاء الاصطناعي (Intelligence Artificielle) المخصصة للتجارة في الجزائر، ونوفرولكم أنظمة ذكية متطورة، مثلاً:
- أولاً: نظام تأكيد الطلبيات التلقائي عبر WhatsApp، الذكاء الاصطناعي يتواصل مع الزبون، يأكد معاه العنوان وموديل الهاتف المختار أوتوماتيكياً ويفلتر les faux clients باه تنقص نسبة les retours.
- ثانياً: مساعد ذكي (Assistant IA) يجاوب 24/24 على استفسارات الأسعار وموديلات الهواتف المتوفرة فالحين.
ونقدرو نخدمولكم أي نظام ذكي أو فكرة برمجية مخصصة تحللكم أي مشكل تعانو منو فالمبيعات أو التسيير.
---
واش هو العائق الأكبر اللي راه يدي وقتكم حالياً: كثرة رسائل الاستفسار على توفر كفرات موديلات الهواتف فـ les messages ولا تأكيد طلبيات التوصيل؟`
    },
    {
      business_name: 'La Villa Femme',
      business_type: 'ألبسة وموضة نسائية وأطفال',
      phone: '0697978488',
      instagram_url: 'https://www.instagram.com/lavillafemme02/',
      status: 'pending',
      notes: 'Followers: 27.4k. Mode femme & enfants. Deuxième compte @lavillakids02. Delivery all wilayas.',
      wilaya: 'الشلف',
      custom_proposal: `السلام عليكم، شفت la page تاع La Villa Femme في الشلف ما شاء الله تشكيلة الموضة النسائية وحوايج الصغار قمة فالأناقة والخدمة تاعكم الله يبارك.
---
المشكل في الجمع بين الموضة النسائية وملابس الأطفال هو كثرة الرسائل على المقاسات والأعمار والألوان المتوفرة في les DMs، والرد اليدوي ياكل نص نهار ويخلي بزاف زبونات يترددوا ويخرجوا بلا ما يكومونديو.
والنتيجة مع الحل تاعنا: ترفعوا مبيعاتكم بـ 35% وتسترجعوا الزبونات اللي كانو يضيعوا فالانتظار، الكتالوج يعرض السلعة بمقاساتها الحقيقية وتفاصيلها والطلب يوصلكم مؤكد ومنظم فالحين.
---
حنا شركة VISION لتطوير مواقع الـ E-commerce وأنظمة الذكاء الاصطناعي (Intelligence Artificielle) المخصصة للتجارة في الجزائر، ونوفرولكم أنظمة ذكية متطورة، مثلاً:
- أولاً: نظام تأكيد الطلبيات التلقائي عبر WhatsApp، الذكاء الاصطناعي يتواصل مع الزبون، يأكد معاه العنوان والمقاس أوتوماتيكياً ويفلتر les faux clients باه تنقص نسبة les retours.
- ثانياً: مساعد ذكي (Assistant IA) يجاوب 24/24 على استفسارات الأسعار والمقاسات والأعمار والتوفر فالحين.
ونقدرو نخدمولكم أي نظام ذكي أو فكرة برمجية مخصصة تحللكم أي مشكل تعانو منو فالمبيعات أو التسيير.
---
واش هو أكبر مشكل راه يدي وقت الفريق تاعكم حالياً: كثرة رسائل المقاسات والألوان ولا تأكيد طلبيات التوصيل؟`
    },
    {
      business_name: 'Dreams Shop',
      business_type: 'Personal Shopper ومستحضرات تجميل وماركات فاخرة من أوروبا',
      phone: 'PRIVEE',
      instagram_url: 'https://www.instagram.com/dreams_shopdz/',
      status: 'pending',
      notes: 'Followers: 11.4k. FR Personal Shopper Europe. Luxe, Mode, Beauté. Produits 100% originaux. Commande par message.',
      wilaya: 'الجزائر',
      custom_proposal: `السلام عليكم، شفت la page تاع Dreams Shop ما شاء الله خدمة الـ Personal Shopper وتوفير الماركات ومستحضرات التجميل الأصلية من أوروبا قمة فالاحترافية والخدمة تاعكم الله يبارك.
---
في مجال الـ Personal Shopper والشراء على الطلب، أكبر ضياع وقت هو إرسال الزبائن لصور وروابط المنتجات والاستفسار المستمر على الأسعار بالدينار وتكاليف الشحن والتوفر فـ les DMs، والحساب اليدوي والرد على كل زبونة يدي سوايع طويلة وبزاف يترددوا وما يكملوش الطلب.
والنتيجة مع الحل تاعنا: منصة ذكية تعرض المنتجات المطلوبة وتخفيضات الماركات بالأسعار المحسوبة مباشرة بالدينار، ترفع نسبة تأكيد الطلبيات وتضاعف مبيعاتكم بدون إرهاق الحسابات الفردية فالمراسلات.
---
حنا شركة VISION لتطوير مواقع الـ E-commerce وأنظمة الذكاء الاصطناعي (Intelligence Artificielle) المخصصة للتجارة في الجزائر، ونوفرولكم أنظمة ذكية متطورة، مثلاً:
- أولاً: نظام تأكيد الطلبيات التلقائي عبر WhatsApp، الذكاء الاصطناعي يتواصل مع الزبونة، يأكد معاها تفاصيل المنتج والعنوان أوتوماتيكياً ويفلتر الطلبات الجادة.
- ثانياً: مساعد ذكي (Assistant IA) يجاوب 24/24 على استفسارات الأسعار بالدينار، توفر المنتجات الأصلية، ومواعيد الشحن والتوصيل فالحين.
ونقدرو نخدمولكم أي نظام ذكي أو فكرة برمجية مخصصة تحللكم أي مشكل تعانو منو فالمبيعات أو التسيير.
---
واش هو العائق الأكبر اللي راه يدي وقتكم حالياً: كثرة رسائل السؤال على أسعار المنتجات وتحويلها للدينار فـ les DMs ولا متابعة وتأكيد إرسال الطرود؟`
    }
  ];

  for (const s of stores) {
    const res = await sql`
      INSERT INTO outreach (
        business_name,
        business_type,
        phone,
        instagram_url,
        status,
        notes,
        wilaya,
        custom_proposal,
        created_at,
        updated_at
      ) VALUES (
        ${s.business_name},
        ${s.business_type},
        ${s.phone},
        ${s.instagram_url},
        ${s.status},
        ${s.notes},
        ${s.wilaya},
        ${s.custom_proposal},
        NOW(),
        NOW()
      )
      RETURNING id, business_name;
    `;
    console.log(`Inserted: ${res[0].business_name} (ID: ${res[0].id})`);
  }

  const finalCount = await sql`SELECT count(*) FROM outreach`;
  console.log(`Final total businesses in DB: ${finalCount[0].count}`);
}

insertThreeStores().catch(console.error);
