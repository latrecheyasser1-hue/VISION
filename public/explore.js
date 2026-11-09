/* Local-only discovery and software demonstration. No client data or network calls. */
const fitOptions=[
 {id:'orders',ar:['الطلبات متفرّقين','كل طلب عنده مكان ومسار.','نجمعو الطلبات في مساحة واحدة، مع حالتها والمعلومات اللازمة لمتابعتها.',['استقبال الطلب','تنظيمه','متابعته'],'الطلبات متفرّقين ونحتاج طريقة أوضح لتنظيمهم.'],fr:['Mes commandes sont dispersées','Un parcours clair pour chaque commande.','Réunir les commandes et les informations utiles dans un espace commun, avec un suivi de leur état.',['Recevoir','Organiser','Suivre'],'Mes commandes sont dispersées et je cherche à mieux les organiser.']},
 {id:'stock',ar:['المخزون ما هوش واضح','تعرف واش كاين، وواش تبدّل.','نربطو حركة البيع بالكميات، وننظّمو المنتجات حسب المقاسات أو الألوان إذا نشاطك يحتاجها.',['المنتجات','حركة البيع','الكميات'],'نواجه صعوبة في متابعة المخزون والكميات.'],fr:['Je manque de visibilité sur le stock','Voir les quantités et leurs mouvements.','Relier les ventes au stock et organiser les variantes, comme les tailles ou les couleurs, selon votre activité.',['Produits','Ventes','Quantités'],'Je rencontre des difficultés à suivre le stock et les quantités.']},
 {id:'repeat',ar:['نعاود نفس الخدمة يدوياً','المعلومة تدخل مرّة، وتخدم أكثر.','نحدّدو الخطوات المتكرّرة اللي نقدروا نربطوها: من تسجيل المعلومة إلى تحضير الوصل أو التقرير.',['إدخال','معالجة','وصل أو تقرير'],'نعاود نفس المهام يدوياً وحاب نناقش كيفاش نسهّلها.'],fr:['Je répète les mêmes tâches','Une saisie, plusieurs usages.','Identifier les étapes à relier, de la saisie des informations à la préparation d’un reçu ou d’un rapport.',['Saisie','Traitement','Document'],'Je répète des tâches manuelles et souhaite les simplifier.']},
 {id:'team',ar:['تنظيم الفريق صعيب','كل واحد يعرف واش عليه.','نوضّحو الأدوار، الصلاحيات وحالة المهام في نظام مناسب لطريقة خدمة فريقك.',['الأدوار','المهام','المتابعة'],'نحتاج ننظّم الأدوار والمهام ومتابعة الفريق.'],fr:['Mon équipe manque de coordination','Des rôles et des tâches lisibles.','Organiser les rôles, les accès et l’avancement des tâches selon le fonctionnement de votre équipe.',['Rôles','Tâches','Suivi'],'Je souhaite mieux organiser les rôles, les tâches et le suivi de mon équipe.']}
];
const projectStories={
 pyjama:{ar:['تسيير التجزئة والجملة والمحل مع مخازن ومتغيرات مختلفة.','متجر تجزئة، بوابة جملة ونقطة بيع متصلة بإدارة الطلبات والمخزون.','الطلب يتسجّل حسب قناة البيع، يتابع الفريق حالته ويحضّر السلع بالكميات والمتغيرات المطلوبة.'],fr:['Gérer le détail, le gros et le magasin, avec plusieurs stocks et variantes.','Une boutique B2C, un portail B2B et une caisse reliés à la gestion des commandes et des stocks.','La commande est identifiée par canal de vente, suivie par l’équipe et préparée selon les quantités et variantes demandées.']},
 clinic:{ar:['تنظيم المواعيد وملفات المرضى والعمل بين أدوار مختلفة داخل العيادة.','منصة تجمع المواعيد والملفات وإدارة الفريق بصلاحيات حسب الدور.','الاستقبال ينظّم الموعد، والطبيب يتابع ملف المريض ضمن الصلاحيات المحددة له.'],fr:['Organiser rendez-vous, dossiers patients et rôles au sein d’une clinique.','Une plateforme réunissant rendez-vous, dossiers et équipe avec des accès par rôle.','L’accueil organise le rendez-vous et le médecin suit le dossier dans le cadre de ses autorisations.']},
 aqsa:{ar:['تسجيل البيع بالوزن أو الوحدة ومتابعة حسابات الزبائن دون إنترنت.','برنامج مكتبي للبيع، المنتجات، الديون والدفعات، مع وصولات A5.','يختار المستخدم السلع والكميات والزبون، يسجّل الدفع ويطبع الوصل؛ ويمكنه الرجوع للسجل لاحقاً.'],fr:['Vendre au poids ou à l’unité et suivre les comptes clients sans connexion.','Un logiciel desktop pour les ventes, produits, dettes et versements, avec des bons A5.','L’utilisateur sélectionne produits, quantités et client, enregistre le paiement et imprime un bon consultable dans l’historique.']},
 asel:{ar:['ربط متجر الملابس بالمحل، مع متابعة المقاسات والألوان والبيع عند انقطاع الإنترنت.','متجر ونقطة بيع يدعمان المتغيرات، الباركود والطباعة الحرارية، مع مزامنة المبيعات دون اتصال.','يختار الكاشير المقاس واللون المتوفرين، يسجّل البيع ويطبع التذكرة. مبيعات وضع عدم الاتصال تتزامن عند عودة الإنترنت.'],fr:['Relier boutique et magasin, suivre tailles et couleurs et vendre en cas de coupure Internet.','Une boutique et une caisse avec variantes, codes-barres, impression thermique et synchronisation hors ligne.','Le caissier choisit une variante disponible, enregistre la vente et imprime le ticket. Les ventes hors ligne se synchronisent au retour de la connexion.']},
 hk:{ar:['جمع طلبات الموقع ومبيعات المحل مع متابعة المخزون والمصاريف.','متجر إلكتروني مرتبط بالكاسة وإدارة المنتجات والطلبات والتقارير.','طلب الموقع أو بيع الكاسة يدخل في المتابعة، وتتحدّث الكمية مع تسجيل العملية.'],fr:['Réunir commandes web et ventes en magasin avec le suivi du stock et des dépenses.','Une boutique en ligne reliée à la caisse, aux produits, aux commandes et aux rapports.','La commande web ou la vente en caisse rejoint le suivi, et la quantité est actualisée lors de l’enregistrement.']}
};
function projectStoryHTML(project){
 const titles=lang==='ar'?['الاحتياج','الحل المنجز','كيفاش يخدم؟']:['Le besoin','La solution réalisée','Le fonctionnement'];
 return `<div class="case-story">${projectStories[project.id][lang].map((text,i)=>`<section><span>0${i+1}</span><div><h3>${titles[i]}</h3><p>${text}</p></div></section>`).join('')}</div>`;
}
let chosenFit='orders';
function renderFit(animate=false){
 const option=fitOptions.find(x=>x.id===chosenFit),c=option[lang];
 document.querySelectorAll('[data-fit]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.fit===chosenFit));b.classList.toggle('selected',b.dataset.fit===chosenFit);});
 document.querySelector('#fit-title').textContent=c[1];
 document.querySelector('#fit-description').textContent=c[2];
 document.querySelector('#fit-route').innerHTML=c[3].map((s,i)=>`<span><small>0${i+1}</small>${s}</span>`).join('');
 document.querySelector('#fit-contact').href=`https://wa.me/213771335039?text=${encodeURIComponent((lang==='ar'?'السلام عليكم VISION، ':'Bonjour VISION, ')+c[4])}`;
 if(animate&&window.gsap&&!reduceMotion.matches)gsap.fromTo('#fit-result > *',{y:12,opacity:0},{y:0,opacity:1,duration:.3,stagger:.045,clearProps:'all'});
}
document.querySelectorAll('[data-fit]').forEach(b=>b.addEventListener('click',()=>{chosenFit=b.dataset.fit;renderFit(true);}));
let demo={stock:8,quantity:1,status:'empty'};
const demoCopy={ar:{empty:'مازال ما كاين حتى طلب',new:'طلب جديد',prepared:'جاهز للتسليم',done:'تمّ التسليم',cancelled:'تمّ إلغاء الطلب',create:'سجّل الطلب',prepare:'حضّر الطلب',finish:'أكّد التسليم',created:'تسجّل الطلب وتنقصت الكمية من المخزون.',packed:'الطلب راهو جاهز للتسليم.',delivered:'تأكّد التسليم. جرّب من جديد بإعادة التجربة.',cancel:'تلغى الطلب ورجعت الكمية للمخزون.',reset:'رجعنا للبداية: 8 قطع في المخزون.'},fr:{empty:'Aucune commande pour le moment',new:'Nouvelle commande',prepared:'Prête à livrer',done:'Livrée',cancelled:'Commande annulée',create:'Enregistrer la commande',prepare:'Préparer la commande',finish:'Confirmer la livraison',created:'Commande enregistrée, quantité déduite du stock.',packed:'La commande est prête à livrer.',delivered:'Livraison confirmée. Réinitialisez pour recommencer.',cancel:'Commande annulée, quantité rétablie.',reset:'Début de la démonstration : 8 articles en stock.'}};
function renderDemo(){
 const c=demoCopy[lang],active=['new','prepared'].includes(demo.status),finished=demo.status==='done';
 document.querySelector('#demo-stock').textContent=String(demo.stock);
 document.querySelector('#demo-order-status').textContent=c[demo.status];
 document.querySelector('#demo-order-quantity').textContent=demo.status==='empty'||demo.status==='cancelled'?'—':String(demo.quantity);
 document.querySelector('#demo-total').textContent=demo.status==='empty'||demo.status==='cancelled'?'—':new Intl.NumberFormat(lang==='ar'?'ar-DZ':'fr-DZ').format(demo.quantity*2500)+(lang==='ar'?' دج':' DA');
 document.querySelector('#demo-quantity').disabled=active||finished;
 document.querySelector('#demo-create').disabled=active||finished;
 const next=document.querySelector('#demo-next');next.disabled=!active;next.textContent=finished?c.done:demo.status==='prepared'?c.finish:c.prepare;
 document.querySelector('#demo-cancel').disabled=!active;
 const step=demo.status==='new'?1:demo.status==='prepared'?2:demo.status==='done'?3:0;
 document.querySelectorAll('.demo-stages span').forEach((el,i)=>el.classList.toggle('complete',i<step));
 document.querySelector('#demo-workspace').dataset.status=demo.status;
}
function updateDemo(action){
 const c=demoCopy[lang];let notice='';
 if(action==='create'&&['empty','cancelled'].includes(demo.status)){
  const q=Number(document.querySelector('#demo-quantity').value);if(!Number.isInteger(q)||q<1||q>demo.stock)return;
  demo.quantity=q;demo.stock-=q;demo.status='new';notice=c.created;
 }else if(action==='next'&&demo.status==='new'){demo.status='prepared';notice=c.packed;}
 else if(action==='next'&&demo.status==='prepared'){demo.status='done';notice=c.delivered;}
 else if(action==='cancel'&&['new','prepared'].includes(demo.status)){demo.stock+=demo.quantity;demo.status='cancelled';notice=c.cancel;}
 else if(action==='reset'){demo={stock:8,quantity:1,status:'empty'};document.querySelector('#demo-quantity').value='1';notice=c.reset;}
 else return;
 renderDemo();document.querySelector('#demo-notice').textContent=notice;
 if(window.gsap&&!reduceMotion.matches)gsap.fromTo('.demo-order',{y:10,opacity:.4},{y:0,opacity:1,duration:.25,clearProps:'all'});
}
['create','next','cancel','reset'].forEach(action=>document.querySelector('#demo-'+action).addEventListener('click',()=>updateDemo(action)));
window.addEventListener('vision:layout',()=>{renderFit();renderDemo();document.querySelector('#demo-notice').textContent='';});
renderFit();renderDemo();
