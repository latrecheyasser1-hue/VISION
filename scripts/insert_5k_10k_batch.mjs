import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });
import { db } from '../dist/src/db/client.js';
import { outreach } from '../dist/src/db/schema.js';

const stores5k10k = [
  // 1. Boutique Zinou Draria
  {
    businessName: "Boutique Zinou Draria",
    businessType: "Chaussures & Sacs Femme",
    wilaya: "Alger",
    phone: "0553602528",
    instagramUrl: "https://www.instagram.com/boutique_zinou_draria/",
    notes: "Followers: 6.4k. Maps link only. Pointures 35-44",
    p1: "Salam alikom l'equipe Boutique Zinou f Draria, ya3tikom saha 3la les modeles ta3 les chaussures w sacs li rakom t-7atouhom.",
    p2: "Fel domaine ta3 les chaussures pointures 35 hata 44, les clientes f Instagram y-sa9sou bzaf 3la les pointures disponibles f les DMs, w kol ma t-khlas pointure y-b9aw les messages y-jiw f l-vide.",
    p3: "Khdemna catalogue e-commerce khfif bzaf win l-pointure li t-khlas t-tna7a automatique, w l-clienta t-commondi direct en 20 secondes m3a confirmation automatique sur WhatsApp.",
    p4: "Chhal men commande rakom t-day3oha kol ma t-koun pointure khlasset w l-clienta t-stena la reponse f les DMs?"
  },

  // 2. L'Alliance Oran
  {
    businessName: "L'Alliance Bijouterie Oran",
    businessType: "Bijoux & Alliances Mariage",
    wilaya: "Oran",
    phone: "0675094582",
    instagramUrl: "https://www.instagram.com/lalliance_oran/",
    notes: "Followers: 8.6k. Maps link only",
    p1: "Salam alikom l'equipe L'Alliance f Oran, tbarkellah 3la les modeles des alliances w les bijoux de mariage li rakom t-proposiw fihom.",
    p2: "Les couples li y-wajdo l-3ars yhabo y-choufo les modeles b les details w les prix bla ma y-b9aw y-stenaou f les DMs, w had l-haja t-daya3lkom des ventes m3a 8.6k followers.",
    p3: "3ndna plateforme vitrine e-commerce de luxe win l-client y-chouf la galerie ta3 les alliances, y-akhod rendez-vous wla y-commondi direct b un paiement unique sans abonnement.",
    p4: "Est-ce que la gestion ta3 les demandes f les messages f les periodes des fetes rahi t-akhodlkom bzaf wa9t li n9edro n-automatisiwh?"
  },

  // 3. MS Boutique Oran
  {
    businessName: "MS Boutique Oran Boulevard Dubai",
    businessType: "Homme & Femme Prêt-à-Porter",
    wilaya: "Oran",
    phone: "0561899545",
    instagramUrl: "https://www.instagram.com/ms_boutique_oran/",
    notes: "Followers: 9.8k. No URL",
    p1: "Salam alikom khawti MS Boutique f Hai Es Salam Boulevard Dubai f Wahran, ya3tikom saha 3la les arrivages w l-khedma ta3kom.",
    p2: "M3a 9.8k followers, l-vente par message f Instagram t-daya3 bzaf wa9t m3a les questions ta3 les prix w les tailles kol youm.",
    p3: "N-dirolkom boutique en ligne moderne w rapide win l-client y-chouf l-modele w la taille en stock w y-passi commande en 30 secondes sans passer par les DMs.",
    p4: "Chhal rakom t-passiw men wa9t f n-har ghi f l-reponse 3la les memes questions 3la les tailles w l-prix f les messages?"
  },

  // 4. Gresley Menswear Algerie - BROKEN SITE
  {
    businessName: "Gresley Menswear Algérie",
    businessType: "Homme Costumes & Sur-Mesure",
    wilaya: "Alger",
    phone: "0660934052",
    instagramUrl: "https://www.instagram.com/gresleymenswearalgerie/",
    notes: "Followers: 9.8k. Site: http://www.gresley.dz (BROKEN / DOWN)",
    p1: "Salam alikom l'equipe Gresley Menswear, ma chaa Allah 3la l-prestige w la classe ta3 les costumes sur mesure li rakom t-7atou fihom.",
    p2: "Dkholna l l-lien gresley.dz li 7atinho fel bio ta3 l-compte Instagram l9inah habes w ma yftehch (site down), w had l-haja rahi t-daya3lkom des clients VIP li yhabo y-choufo les collections w y-commondiw.",
    p3: "N9edro n-riglolkom l-site b plateforme e-commerce luxueuse w rapide bzaf fiha prise de rendez-vous w guide des mesures digital, bla abonnement chahri w khadama 24h/24.",
    p4: "Rakom deja 3la balek bli l-site ta3kom habes, wla rakom habin n-weriwlkom kifah n-3awdo n-lansiwh b un systeme performant w sahla f l-gestion?"
  },

  // 5. Yenni Accessories
  {
    businessName: "Yenni Accessories Alger",
    businessType: "Bijoux Berbères & Artisanat",
    wilaya: "Alger",
    phone: "0694402000",
    instagramUrl: "https://www.instagram.com/yenni.accessories/",
    notes: "Followers: 5.3k. Linktree only",
    p1: "Salam alikom l'equipe Yenni Accessories, tbarkellah 3la l'artisanat ta3 les bijoux faits main en argent veritable w corail.",
    p2: "Rakom 7atin Linktree fel bio bssh l-vente d'artisanat li fiha livraison 69 wilayas w diaspora t-koun bzaf plus performante b un vrai site e-commerce b nom de domaine propre.",
    p3: "Khdemna solution e-commerce artisanale classe li t-bayan l'histoire ta3 kol bijou w t-akhod les commandes direct m3a confirmation automatique sur WhatsApp.",
    p4: "Chhal men commande rakom t-day3o men la diaspora w hors Alger psk ma 3ndkomch site e-commerce m-fessal l l-bijouterie?"
  },

  // 6. Merie Accessories Oran
  {
    businessName: "Merie Accessories Oran",
    businessType: "Bijoux Personnalisables",
    wilaya: "Oran",
    phone: "0551706518",
    instagramUrl: "https://www.instagram.com/merie.accessories/",
    notes: "Followers: 9k. FB link only",
    p1: "Salam alikom l'equipe Merie Accessories f Oran, ya3tikom saha 3la les bijoux personnalisables li rakom t-khadmou fihom.",
    p2: "Fel bijoux personnalises, kol commande t-akhod bzaf wa9t f l-messages bch t-fehmou l'ecriture, le prenom w la couleur, w had l-haja t-sabbel retard kbir.",
    p3: "3ndna systeme e-commerce fiha champ speciale personnalisation win l-cliente t-kteb le prenom w t-chouf l'apercu w t-valider la commande direct.",
    p4: "Rakom habin t-choufo kifah t-na9sou l-wa9t ta3 l-confirmation ta3 les prenoms f les messages b un formulaire intelligent?"
  },

  // 7. Areej Cosmetics Setif
  {
    businessName: "Areej Cosmetics Sétif",
    businessType: "Cosmétique & Soins Beauté",
    wilaya: "Sétif",
    phone: "0778137188",
    instagramUrl: "https://www.instagram.com/areejcosmetics19/",
    notes: "Followers: 7.4k. No URL",
    p1: "Salam alikom l'equipe Areej Cosmetics f Setif, tbarkellah 3la la selection des produits de beaute w soins li rakom t-proposiw fihom.",
    p2: "Fel cosmetique, les clientes y-sa9sou bzaf 3la les types de peau w la disponibilite f les DMs, w bzaf y-melou men l'attente w y-cherou men blassa okhra.",
    p3: "N-dirolkom boutique e-commerce sahla fiha filtre par type de peau w par probleme, win l-cliente t-chouf le produit w t-passi commande f 30 secondes.",
    p4: "Chahou l-point li rah y-di l-wa9t l-kbir f la vente, le conseil f les messages wla la confirmation ta3 les adresses de livraison?"
  },

  // 8. Zahra Handmade Artisanal
  {
    businessName: "Zahra Handmade Artisanal",
    businessType: "Savon & Cosmétique Naturel",
    wilaya: "Alger",
    phone: "0555321611",
    instagramUrl: "https://www.instagram.com/zahrahandmade_artisanal/",
    notes: "Followers: 5.8k. FB link only",
    p1: "Salam alikom l'equipe Zahra Handmade, ya3tikom saha 3la l-khedma n9iya ta3 le savon naturel w les soins artisanaux.",
    p2: "Rakom 7atin lien Facebook fel bio bssh l-clientes f Instagram yhabo y-choufo les bienfaits de chaque savon w y-commondiw direct bla ma y-khorjo.",
    p3: "Khdemna site e-commerce bio ultra fluide win kol produit 3ndou ses ingredients w ses bienfaits, m3a commande en un clic direct sur WhatsApp.",
    p4: "Est-ce que rakom t-fakkrou t-dirou votre propre site e-commerce pour valoriser had l-produit naturel w t-zidou f les ventes?"
  },

  // 9. Citypharm Para Alger
  {
    businessName: "Citypharm Para Alger",
    businessType: "Parapharmacie & Dermo-Cosmétique",
    wilaya: "Alger",
    phone: "0658658482",
    instagramUrl: "https://www.instagram.com/citypharm.para/",
    notes: "Followers: 9k. No URL",
    p1: "Salam alikom l'equipe Citypharm Para f Alger, tbarkellah 3la l'expertise w les gammes dermo-cosmetiques li rakom t-partajiw fihom.",
    p2: "M3a 9k followers, la reponse manuelle f les DMs 3la les prix w les routines t-akhod bzaf wa9t w t-khali bzaf clients y-hesitiw f l-achat.",
    p3: "3ndna plateforme e-commerce speciale parapharmacie fiha des packs routines w commande rapide b confirmation automatique.",
    p4: "Chhal men commande rakom t-dakhloha par jour, wla rakom habin t-kheliw l-boutique t-bi3 automatique bla ma t-b9aw t-katbou f les DMs?"
  },

  // 10. Boutique Inas Batna
  {
    businessName: "Boutique Inas Batna",
    businessType: "Tissus Soirée & Robes Luxe",
    wilaya: "Batna",
    phone: "0540143296",
    instagramUrl: "https://www.instagram.com/boutique_inas_05/",
    notes: "Followers: 5.8k. No URL",
    p1: "Salam alikom l'equipe Boutique Inas f Batna, ma chaa Allah 3la les tissus de soiree luxe li rakom t-jibou fihom.",
    p2: "Fel tissus de soiree, les clientes y-sa9sou 3la le metre, la couleur exacte w la qualite f les DMs, w kol piece t-akhod wa9t kbir f l-khedma manuelle.",
    p3: "N-dirolkom catalogue e-commerce VIP win la cliente t-chouf les photos en gros plan w t-khayer le nombre de metres direct bla casse-tete.",
    p4: "Rakom habin t-choufo demo kifah t-kheliw les commandes ta3 les tissus y-dkholkom m-nadmin direct f WhatsApp?"
  },

  // 11. Vêtements Constantine 25
  {
    businessName: "Vêtements Constantine 25",
    businessType: "Femme Prêt-à-Porter & Robes",
    wilaya: "Constantine",
    phone: "0780764644",
    instagramUrl: "https://www.instagram.com/vetements_constantine25/",
    notes: "Followers: 9.7k. No URL",
    p1: "Salam alikom l'equipe Vêtements Constantine, ya3tikom saha 3la l'activite continue w les modeles feminins li rakom t-7atouhom.",
    p2: "M3a 9.7k followers w livraison a domicile, les messages f les stories y-jiw bzaf w la gestion manuelle t-sabbel retard f la livraison.",
    p3: "Khdemna site e-commerce mobile-first khfif win l-cliente t-passi sa commande f 20 secondes m3a localisation exacte w confirmation instantanee.",
    p4: "Chhal men cliente t-b9a f l'attente psk ma tel79ouch t-repoundiw 3la ga3 les DMs f les heures de pointe?"
  },

  // 12. Boutique Istanbul Constantine
  {
    businessName: "Boutique Istanbul Constantine",
    businessType: "Mode & Vêtements Turquie",
    wilaya: "Constantine",
    phone: "0542408966",
    instagramUrl: "https://www.instagram.com/_boutique_istanbul25_/",
    notes: "Followers: 6.6k. Maps link only",
    p1: "Salam alikom l'equipe Boutique Istanbul f Constantine, tbarkellah 3la les arrivages ta3 la marchandise turque li rakom t-jibouha.",
    p2: "Rakom 7atin localisation Google Maps fel bio bssh les clients li b3ad 3la Constantine yhabo y-choufo les modeles w y-commondiw direct.",
    p3: "3ndna plateforme e-commerce dziriya khfifa win le stock turc y-koun bayen b les tailles w les prix, w l-commande t-wselkom f WhatsApp.",
    p4: "Est-ce que rakom habin t-zidou les ventes ta3kom f les 58 wilayas b un site e-commerce professionnel sans abonnement chahri?"
  },

  // 13. Maman Habille Moi Alger
  {
    businessName: "Maman Habille Moi Alger",
    businessType: "Maman & Enfant Haut de Gamme",
    wilaya: "Alger",
    phone: "0541082023",
    instagramUrl: "https://www.instagram.com/maman_habille_moi_/",
    notes: "Followers: 8.9k. No URL",
    p1: "Salam alikom l'equipe Maman Habille Moi f Alger, tbarkellah 3la le gout raffiné w la qualite des vetements d'enfants importes.",
    p2: "Les mamans f Instagram y-sa9sou bzaf 3la les mois w les tailles des bebes f les DMs, w bzaf y-khorjo bla ma y-chrriw psk l-reponse twel.",
    p3: "Khdemna site specialise enfant win l-maman t-fildi par tranche d'âge en un clic w t-chouf le stock exact disponible m3a commande rapide.",
    p4: "Chahou l-obstacle l-kbir li rah y-daya3lkom des ventes, la disponibilite des tailles wla le retard f la reponse f les messages?"
  },

  // 14. Boutique Champion Setif
  {
    businessName: "Boutique Champion Sétif",
    businessType: "Homme Sportswear & Streetwear",
    wilaya: "Sétif",
    phone: "0673750957",
    instagramUrl: "https://www.instagram.com/boutique_champion19/",
    notes: "Followers: 5.4k. Linktree only",
    p1: "Salam alikom khawti Boutique Champion f Setif, ya3tikom saha 3la les modeles ta3 l-sportswear w les survêtements li rakom t-7atou fihom.",
    p2: "Rakom 7atin Linktree fel bio bssh Linktree y-dir etape zayda, le client yhab y-chouf l-survetement w la taille w y-commondi f blassa wahda.",
    p3: "N-dirolkom boutique e-commerce directe khfifa bzaf win le client y-passi la commande b clic wahed m3a confirmation automatique sur WhatsApp.",
    p4: "Rakom habin t-choufo kifah t-kheliw l-ventes ta3kom y-kono automatiques bla ma t-b9aw t-katbou f les DMs?"
  },

  // 15. Melina Location Constantine
  {
    businessName: "Mélina Location Robes Constantine",
    businessType: "Location Robes Soirées de Luxe",
    wilaya: "Constantine",
    phone: "0652712508",
    instagramUrl: "https://www.instagram.com/melina.location25/",
    notes: "Followers: 8.8k. Google share link only",
    p1: "Salam alikom l'equipe Melina Location f Ali Mendjeli Constantine, ma chaa Allah 3la les robes de soirees de luxe li rakom t-louwou fihom.",
    p2: "Fel location de robes, la question ta3 la date w la disponibilite t-akhod wa9t kbir f les DMs, w kol cliente t-b9a t-sa9si 3la le weekend ta3ha.",
    p3: "Khdemna calendrier e-commerce digital win la cliente t-chouf la robe, t-khayer la date libre f le calendrier w t-reserver direct.",
    p4: "Est-ce que l-gestion manuelle ta3 l'agenda des locations f les messages rahi t-sabbelkom des chevauchements w retard f la reponse?"
  },

  // 16. Boutique Tiffany Tlemcen
  {
    businessName: "Boutique Tiffany Tlemcen",
    businessType: "Vaisselle Chic & Décoration",
    wilaya: "Tlemcen",
    phone: "0550094172",
    instagramUrl: "https://www.instagram.com/boutiquetiffanytlemcen/",
    notes: "Followers: 9.7k. No URL",
    p1: "Salam alikom l'equipe Boutique Tiffany f Tlemcen Rue de Paris, ya3tikom saha 3la la selection de la vaisselle chic w la deco.",
    p2: "M3a 9.7k followers, les clientes f Instagram y-sa9sou 3la les packs w les prix f les DMs, w had l-haja t-daya3 bzaf wa9t f l-ecriture.",
    p3: "3ndna plateforme e-commerce speciale deco/vaisselle win kol service 3ndou ses pieces w son prix clair, m3a commande rapide et securisee.",
    p4: "Chhal rakom t-passiw men wa9t f n-har ghi f l-envoi ta3 les prix w les photos ta3 les modeles f les DMs?"
  },

  // 17. Boutique Msili Béjaïa
  {
    businessName: "Boutique Msili Béjaïa",
    businessType: "Femme Prêt-à-Porter & Robes",
    wilaya: "Béjaïa",
    phone: "0659271670",
    instagramUrl: "https://www.instagram.com/boutique_msili_les600_bejaia/",
    notes: "Followers: 5.4k. No URL",
    p1: "Salam alikom l'equipe Boutique Msili f Bejaia les 600, ya3tikom saha 3la les modeles feminins li rakom t-proposiw fihom.",
    p2: "L-vente par message f les robes t-kheli bzaf clientes y-b9aw f l'attente w bzaf y-khorjo bla ma y-commondiw.",
    p3: "N-dirolkom boutique en ligne sahla fiha les articles b les photos w les tailles disponiles, w l-commande t-wselkom direct f WhatsApp.",
    p4: "Rakom habin t-choufo demo kifah t-kheliw les clientes y-commondiw direct en 20 secondes bla ma t-katbou m3ahom f les messages?"
  },

  // 18. Boutique Tlemcen Turquie
  {
    businessName: "Boutique Tlemcen Vêtements Turcs",
    businessType: "Femme Vêtements Turquie 100%",
    wilaya: "Tlemcen",
    phone: "0542174803",
    instagramUrl: "https://www.instagram.com/boutique_tlemcen_/",
    notes: "Followers: 8k. No URL",
    p1: "Salam alikom l'equipe Boutique Tlemcen, tbarkellah 3la la marchandise turque originale w la livraison 58 wilayas.",
    p2: "M3a 8k followers, les clientes f les wilayas yhabo y-chriw b rapidite, w la reponse f les DMs t-daya3lkom kter men 40% men les ventes.",
    p3: "3ndna solution e-commerce fluide win la cliente t-chouf la robe turque, t-khayer sa taille w t-passi commande direct avec confirmation automatique.",
    p4: "Chhal men commande hors Tlemcen rakom t-diro par semaine, wla rakom habin t-doublo had l-chiffre b un site professionnel?"
  },

  // 19. Boutique Samie Tlemcen
  {
    businessName: "Boutique Samie Tlemcen",
    businessType: "Femme Fashion & Prêt-à-Porter",
    wilaya: "Tlemcen",
    phone: "0792460433",
    instagramUrl: "https://www.instagram.com/boutiquesamie.bs/",
    notes: "Followers: 7k. No URL",
    p1: "Salam alikom l'equipe Boutique Samie f Place Elkhadam Tlemcen, ya3tikom saha 3la les collections w le dynamisme ta3kom.",
    p2: "L-vente par DM f Instagram t-daya3 l-wa9t l'equipe f l-magasin m3a les questions ta3 les prix w les disponibilites.",
    p3: "Khdemna plateforme e-commerce mobile-first b un paiement unique sans abonnement chahri, win l-commandes y-dozou direct sur WhatsApp.",
    p4: "Rakom habin t-choufo kifah t-kheliw l-boutique t-bi3 en ligne automatique 24h/24 bla ma t-derongiw les vendeurs?"
  },

  // 20. Boutique Lupin Tlemcen
  {
    businessName: "Boutique Lupin Tlemcen",
    businessType: "Homme Streetwear & Élégance",
    wilaya: "Tlemcen",
    phone: "0549000895",
    instagramUrl: "https://www.instagram.com/boutique_lupin/",
    notes: "Followers: 7.9k. Maps link only",
    p1: "Salam alikom khawti Boutique Lupin f Kiffen Tlemcen, ya3tikom saha 3la l'ambiance w le style streetwear & elegance pour homme.",
    p2: "Rakom 7atin localisation Google Maps fel bio bssh les clients li b3ad 3la Tlemcen yhabo y-chriw en ligne direct bla ma y-stenaou f les DMs.",
    p3: "N-proposiwlkom boutique e-commerce propre win le client y-chouf la taille disponible w y-valider la commande en un clic avec WhatsApp.",
    p4: "Chhal men vente rakom t-estiméw bli rahi t-ro7lkom psk l-client ma l9ach moyen direct de commande sur Instagram?"
  },

  // 21. AM Phone Alger
  {
    businessName: "AM Phone Alger",
    businessType: "Smartphones & Accessoires Tech",
    wilaya: "Alger",
    phone: "0796079196",
    instagramUrl: "https://www.instagram.com/_am_phone_/",
    notes: "Followers: 6.8k. Maps link only",
    p1: "Salam alikom khawti AM Phone f Alger, ya3tikom saha 3la l'activite ta3kom f les smartphones w les accessoires.",
    p2: "Fel domaine de la tech, les clients y-sa9sou 3la les prix du jour, l'etat de la batterie w la garantie f les DMs, w had l-haja t-akhod wa9t kbir.",
    p3: "3ndna plateforme e-commerce speciale smartphones/tech fiha la fiche technique de chaque telephone w commande express m3a confirmation automatique.",
    p4: "Rakom habin t-choufo kifah t-nado les demandes ta3 l'achat w l'echange f un seul tableau de bord professionnel?"
  },

  // 22. Sofiane Fashion Béjaïa
  {
    businessName: "Sofiane Fashion Béjaïa",
    businessType: "Femme Prêt-à-Porter Tendance",
    wilaya: "Béjaïa",
    phone: "0797465040",
    instagramUrl: "https://www.instagram.com/sofiane_fashion_/",
    notes: "Followers: 9.6k. No URL",
    p1: "Salam alikom l'equipe Sofiane Fashion f Quartier Sghir Bejaia, tbarkellah 3la l'elegance des tenues feminines w 9.6k followers.",
    p2: "M3a had l-succes, les commentaires w les messages f les stories y-tl3ou bzaf w la reponse manuelle t-kheli bzaf clientes y-hesitiw.",
    p3: "Khdemna site e-commerce rapide win la cliente t-chouf les modeles w les tailles disponibles en direct w t-commondi bla ma t-stena.",
    p4: "Chahou l-point li rah y-akhodlkom l-wa9t l-kbir f n-har, la reponse f les messages wla la confirmation ta3 l'envoi?"
  },

  // 23. La Maison de la Mariée Chlef
  {
    businessName: "La Maison de la Mariée Chlef",
    businessType: "Robes Mariée & Tenues Traditionnelles",
    wilaya: "Chlef",
    phone: "0553459923",
    instagramUrl: "https://www.instagram.com/la_maisone_de_la_marie/",
    notes: "Followers: 5.8k. Maps link only",
    p1: "Salam alikom l'equipe La Maison de la Mariee f Chlef, tbarkellah 3la les tenues traditionnelles w les robes de mariee de luxe.",
    p2: "Fel mariage, les 3rayess y-sa9sou 3la les disponibilites w les prix f les DMs, w had l-haja t-daya3 wa9t kbir f l'organisation.",
    p3: "3ndna plateforme galerie de prestige fiha prise de rendez-vous w catalogue complet pour mariee, sans abonnement chahri.",
    p4: "Rakom habin t-choufo kifah t-kheliw l'organisation des essayages w les commandes ykoun automatique et facile?"
  },

  // 24. Boutique Zayn DZ Alger
  {
    businessName: "Boutique Zayn DZ Alger",
    businessType: "Chaussures Femmes (Escarpins & Sneakers)",
    wilaya: "Alger",
    phone: "0657924185",
    instagramUrl: "https://www.instagram.com/boutique.zayndz/",
    notes: "Followers: 5.9k. No URL (zayndz.com in bio is not active)",
    p1: "Salam alikom l'equipe Zayn DZ f Alger, tbarkellah 3la les modeles des chaussures feminines w escarpins li rakom t-7atouhom.",
    p2: "Remarquit bli 7atin nom de domaine fel bio bssh l-commandes rakoum t-gerouhom f WhatsApp w DM, w fel chaussures l-pointure t-daya3 bzaf wa9t.",
    p3: "N-dirolkom boutique e-commerce ultra rapide m3a gestion des pointures en temps reel w confirmation automatique direct sur WhatsApp.",
    p4: "Chhal men cliente t-ro7lkom psk l-pointure ta3ha ma l9athach disponible wla psk l-reponse f WhatsApp twlet chwiya?"
  },

  // 25. Modest Béjaïa
  {
    businessName: "Modest Fashion Béjaïa",
    businessType: "Mode Modeste & Prêt-à-Porter Hijab",
    wilaya: "Béjaïa",
    phone: "0551818759",
    instagramUrl: "https://www.instagram.com/modest__bejaia/",
    notes: "Followers: 8.6k. 2 Boutiques Tobal & El Qods",
    p1: "Salam alikom l'equipe Modest f Bejaia (Tobal w El Qods), ya3tikom saha 3la le succes ta3 les boutiques ta3kom f la mode modeste.",
    p2: "M3a 8.6k followers w deux points de vente, la gestion des messages f Instagram t-chadi bzaf l'equipe w bzaf clientes y-stenaou.",
    p3: "Khdemna site e-commerce classe specialise mode modeste win la cliente t-chouf le stock disponible w t-commondi f 30 secondes sans attente.",
    p4: "Est-ce que l-gestion ta3 les DMs rahi t-akhod wa9t les vendeuses li n9edro n-automatisiwh b une boutique en ligne fluide?"
  },

  // 26. Boutique Maya En Ligne
  {
    businessName: "Boutique Maya En Ligne",
    businessType: "Robes de Soirée Importées",
    wilaya: "Alger",
    phone: "0698654175",
    instagramUrl: "https://www.instagram.com/boutique_maya_enligne/",
    notes: "Followers: 7.1k. WhatsApp in bio only",
    p1: "Salam alikom l'equipe Boutique Maya, ma chaa Allah 3la les robes de soiree importees w la finition ta3 les modeles.",
    p2: "Rakom 7atin numero WhatsApp fel bio bssh ki t-ji l-clienta t-sa9si 3la ga3 les modeles w les tailles wahed b wahed f WhatsApp t-daya3lkom bzaf wa9t.",
    p3: "3ndna catalogue e-commerce VIP win la cliente t-chouf les robes b les videos w les photos HD w t-b3at sa commande wajda f WhatsApp.",
    p4: "Chhal men se3a f n-har rakom t-passiwha f l-envoi ta3 les photos w les details f WhatsApp wahed b wahed?"
  },

  // 27. Miroza Boutique Tlemcen
  {
    businessName: "Miroza Boutique Tlemcen",
    businessType: "Femme Prêt-à-Porter & Sacs",
    wilaya: "Tlemcen",
    phone: "0554638024",
    instagramUrl: "https://www.instagram.com/mirozaboutique/",
    notes: "Followers: 6k. No URL",
    p1: "Salam alikom l'equipe Miroza Boutique f Tlemcen Les Cerisiers, ya3tikom saha 3la les articles feminins w les sacs tendances.",
    p2: "L-vente par DM w telephone t-kheli bzaf clientes f les autres wilayas y-hesitiw w y-khorjo bla ma y-commondiw.",
    p3: "N-dirolkom boutique e-commerce khfifa bzaf f le telephone fiha les articles b les prix w les tailles, m3a confirmation automatique sur WhatsApp.",
    p4: "Rakom habin t-choufo demo kifah t-kheliw les clientes y-commondiw direct f 20 secondes bla ma t-katbou m3ahom f les messages?"
  }
];

async function insertAll() {
  console.log(`Starting insertion of ${stores5k10k.length} stores (5k-10k range)...`);
  
  let inserted = 0;
  for (const s of stores5k10k) {
    const fullProposal = `${s.p1}\n---\n${s.p2}\n---\n${s.p3}\n---\n${s.p4}`;
    
    // Check 4 chunks
    const chunks = fullProposal.split('\n---\n');
    if (chunks.length !== 4) {
      console.error(`ERROR: ${s.businessName} has ${chunks.length} chunks!`);
      return;
    }

    try {
      await db.insert(outreach).values({
        businessName: s.businessName,
        businessType: s.businessType,
        wilaya: s.wilaya,
        phone: s.phone,
        instagramUrl: s.instagramUrl,
        status: 'no_reply',
        customProposal: fullProposal,
        notes: s.notes
      });
      inserted++;
      console.log(`[${inserted}/${stores5k10k.length}] Inserted: ${s.businessName} (${s.phone}) - ${s.businessType}`);
    } catch (e) {
      console.error(`Failed to insert ${s.businessName}:`, e.message);
    }
  }

  console.log(`\nAll done! Successfully inserted ${inserted} records.`);
}

insertAll();
