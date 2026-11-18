import { generateTailoredProposal } from './generator_core.mjs';

const testStores = [
  {
    business_name: 'Ipad Store 16',
    business_type: 'أجهزة آيباد وتابلت سامسونغ وملحقاتها',
    wilaya: 'الجزائر العاصمة',
    notes: 'بيع وشراء وتبديل أونلاين'
  },
  {
    business_name: 'Rhino Phone El Achour',
    business_type: 'بيع وصيانة هواتف وإكسسوارات',
    wilaya: 'الجزائر العاصمة',
    notes: 'العاشور مقابل أوربا 2000'
  },
  {
    business_name: 'Lunelle Optique Tlemcen',
    business_type: 'Optique & Lunettes Solaires',
    wilaya: 'تلمسان',
    notes: 'Followers: 81.3k. No URL'
  },
  {
    business_name: 'Eleulma Gros 0773760420',
    business_type: 'تجارة جملة واستيراد',
    wilaya: 'سطيف',
    notes: 'Followers: 16.2k. Site: http://t.me/eleulmashop213'
  },
  {
    business_name: 'Dari Belle',
    business_type: 'DISHES',
    wilaya: 'تيارت',
    notes: null
  },
  {
    business_name: 'Boutique Bambino Sétif',
    business_type: 'Enfants & Bébés Vêtements',
    wilaya: 'سطيف',
    notes: 'Followers: 104k. Maps link only'
  },
  {
    business_name: 'Citypharm Para Alger',
    business_type: 'Parapharmacie & Dermo-Cosmétique',
    wilaya: 'الجزائر العاصمة',
    notes: 'Followers: 9k. No URL'
  },
  {
    business_name: 'Horlogerie Le Quartz',
    business_type: 'ساعات وإكسسوارات رجالية',
    wilaya: 'الجزائر العاصمة',
    notes: null
  }
];

for (const s of testStores) {
  console.log(`=======================================================`);
  console.log(`STORE: ${s.business_name} (${s.business_type})`);
  console.log(`=======================================================`);
  const p = generateTailoredProposal(s);
  console.log(p);
  console.log('\n');
}
