import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });
import { db } from '../dist/src/db/client.js';
import { outreach } from '../dist/src/db/schema.js';

// All 47 verified candidates with accurate metadata and tailored 4-part messages
const storesToInsert = [
  // 1. SUBSCRIPTION PLATFORM
  {
    businessName: "Boutique Sem Prêt-à-Porter",
    businessType: "Femme Prêt-à-Porter",
    wilaya: "Alger",
    phone: "0676290799",
    instagramUrl: "https://www.instagram.com/boutique.sem/",
    notes: "Site: https://sem.flexdz.store/ (Platform subscription Flexdz). Followers: 51.8k",
    p1: "Salam alikom l'equipe Boutique Sem, n-taba3 f l'activite ta3kom f pret-a-porter feminin w la collection li 7atinha f la boutique en ligne ta3kom.",
    p2: "Remarquit bli rakom khadamin b plateforme ta3 abonnement (flexdz.store), w la verite had l-plateformes f l'e-commerce dzayer ybano faciles fel bdya bssh m3a l-wa9t l'abonnement chahri w les frais yaaklo bzaf men la marge net w l'arba7 ta3kol commande.",
    p3: "Khdemna solution b daf3 wahed (paiement unique a vie) win l-boutique tweli 100% ta3kom b votre nom de domaine propre, bla ma tzidou tkhalsso 7ta doro d'abonnement chahri, m3a systeme de commande ultra rapide w confirmation automatique direct sur WhatsApp.",
    p4: "Chhal rakom tkhalsso ta9riban f l-ichtirak l-chahri m3a had l-plateforme dork, wla rakom habin t-tehnaw men had les frais chahriya b un paiement unique w t-gardiw ga3 l-marge ta3kom?"
  },

  // 2. BROKEN SITE 1
  {
    businessName: "Top Shopman Constantine",
    businessType: "Homme Streetwear & Casual",
    wilaya: "Constantine",
    phone: "0541140478",
    instagramUrl: "https://www.instagram.com/shopmandzair/",
    notes: "Site: http://www.shopman-dz.com (Site DOWN/Broken). Followers: 22.9k",
    p1: "Salam alikom l'equipe Top Shopman, ya3tikom saha 3la l'activite ta3kom f Constantine bayn 3ndkom public kbir f les boutiques ta3kom f Nedjma w St Jean.",
    p2: "Dkholt l l-lien ta3 l-site web ta3kom shopman-dz.com li 7atinho fel bio l9ito habes w ma yftehch (erreur de connexion), w had l-haja rahi t-daya3lkom des clients li yhabo ychoufou les articles w ycommondiw direct bla ma yestano.",
    p3: "N9edro nriglolkom had l-probleme b plateforme e-commerce jdida w rapide bzaf, fiha catalogue ta3 les tailles w les modeles li ykheli l-client ycommondi f 30 secondes bla ma y3ayekom fel messagerie w bla abonnement chahri.",
    p4: "Chhal men commande rakom t-hasso bli rakom t-day3oha kol ma l-site ykoun habes, wla mazal rakom t-geriw les commandes ghi f WhatsApp w téléphone?"
  },

  // 3. BROKEN SITE 2
  {
    businessName: "Mayfer Haute Couture El Biar",
    businessType: "Femme Haute Couture & Prêt-à-Porter",
    wilaya: "Alger",
    phone: "0670476655",
    instagramUrl: "https://www.instagram.com/mayfer.dz/",
    notes: "Site: http://www.mayfer.fr/ (Site 403 Forbidden). Followers: 13.7k",
    p1: "Salam alikom l'equipe Mayfer, tbarkellah 3la l'elegance ta3 les creations ta3 maison de couture ta3kom f El Biar.",
    p2: "Siyit ndkhol l l-lien mayfer.fr li 7atinho fel bio ta3 l-compte Instagram l9ito bloque b erreur 403 Forbidden ma yftehch l les visiteurs, w had l-amr y-na9as men l'image de marque ta3kom w ykheli l-clients y-hassou b l'hesitation.",
    p3: "3ndna plateforme sur-mesure b design classe li y-lame l-standing ta3 Mayfer, fiha espace prive w prise de rendez-vous w commande directe, bla abonnement chahri w khadama 24h/24 sans aucune coupure.",
    p4: "Rakom f l-khedma bch t-3awdo t-lanso l-site ta3kom wla habin tchoufo kifah n-recuperiw l-visiteurs ta3kom b plateforme jdida bla frais chahriya?"
  },

  // 4. NO SITE - Lapetite Algerienne
  {
    businessName: "Boutique La Petite Algerienne",
    businessType: "Femme Prêt-à-Porter & Élégance",
    wilaya: "Alger",
    phone: "0557589385",
    instagramUrl: "https://www.instagram.com/lapetite_algerienne_/",
    notes: "Followers: 176k. Canal IG/DM only",
    p1: "Salam alikom l'equipe La Petite Algerienne, tbarkellah 3la l-compte ta3kom w l-collection ta3 les tenues li 7atinha rakom dayrin un tres bon succes.",
    p2: "M3a kter men 176k followers w les stories li t-7atouhom, l-flux ta3 les messages f Instagram w canal bayn rah bzaf charge, w l-clients f pret-a-porter feminin y-sa9sou bzaf 3la les tailles w les couleurs w bzaf ykhorjo bla commande.",
    p3: "Khdemna systeme de boutique rapide win l-clienta tchouf l-modele, t-khayer la taille disponible, w t-valider la commande direct b SMS w WhatsApp sans aucune attente f les DMs.",
    p4: "Chahou l-point li rah y-di l-wa9t l-kbir l'equipe ta3kom dork, la confirmation ta3 les tailles wla l-reponse 3la les DMs f les heures de pointe?"
  },

  // 5. NO SITE - Eleven Mode Store
  {
    businessName: "Eleven Mode Store Draria",
    businessType: "Homme Casual & Streetwear",
    wilaya: "Alger",
    phone: "0558569703",
    instagramUrl: "https://www.instagram.com/elevenmodestore/",
    notes: "Followers: 11.4k. TikTok link only",
    p1: "Salam alikom khawti Eleven Mode Store f Draria, ya3tikom saha 3la les arrivages ta3 l-vetements pour homme li rakom t-7atouhom.",
    p2: "Rakom khedamin bien f TikTok w Instagram bssh la vente par DM w message fel vestimentaire t-daya3 bzaf l-wa9t m3a les questions ta3 les tailles disponibles w le prix.",
    p3: "3ndna solution catalogue interactif win l-client ychouf les tailles en stock w y-passi la commande direct, w l-systeme y-confirmi m3ah automatique bla ma t-b9aw t-katbou manuellement.",
    p4: "Chhal men client ta9riban y-sa9si 3la la taille w y-b9a f l-attente bla ma y-kemel l-achat, wla rakom habin t-automatisiw had l-process?"
  },

  // 6. NO SITE - Dapper Algeria
  {
    businessName: "Dapper Costumes Alger",
    businessType: "Homme Costumes & Casual Chic",
    wilaya: "Alger",
    phone: "0797661692",
    instagramUrl: "https://www.instagram.com/dapper.algeria/",
    notes: "Followers: 411k. No URL",
    p1: "Salam alikom l'equipe Dapper, ma chaa Allah 3la l-standing ta3 les boutiques ta3kom f Alger Centre w El Biar w la qualite ta3 les costumes.",
    p2: "M3a kter men 400k abonnes w livraison 58 wilayas, la gestion ta3 les mesures w les rendez-vous w les commandes par telephone w DM rahi t-chadi l'equipe w t-khali bzaf d-dya3 ta3 l-wa9t.",
    p3: "Khdemna plateforme speciale costumes w pret-a-porter haut de gamme fiha guide des tailles digital w systeme de reservation direct m3a confirmation automatique sur WhatsApp.",
    p4: "Est-ce que l-probleme l-kbir f les costumes 3ndkom howa le conseil des tailles w retours, wla la confirmation ta3 les envois f les wilayas?"
  },

  // 7. NO SITE - La Petite Italie Chaussures
  {
    businessName: "La Petite Italie Chaussures",
    businessType: "Chaussures Femmes Italiennes",
    wilaya: "Alger",
    phone: "0557208210",
    instagramUrl: "https://www.instagram.com/la_petite_italie_chaussures/",
    notes: "Followers: 13.5k. No URL",
    p1: "Salam alikom l'equipe La Petite Italie f Didouche Mourad, tbarkellah 3la la collection des chaussures italiennes li rakom t-proposiw fiha.",
    p2: "Fel domaine ta3 les chaussures l-point l-kbir howa la pointure, kol ma t-7ato article y-jiw des dizaines de questions par message w l-pointures li y-khalso y-b9aw les clients y-talbou fihom.",
    p3: "3ndna plateforme e-commerce win l-pointure li t-khlas t-tna7a automatique, w l-clienta t-commondi f 20 secondes bla ma t-stena la reponse f Instagram.",
    p4: "Chhal men clienta t-ro7lkom psk l-pointure ta3ha ma t-l9ahach disponible wla psk l-reponse twel chwiya f les DMs?"
  },

  // 8. NO SITE - Ramzou Ramzou
  {
    businessName: "Boutique Ramzou Kouba",
    businessType: "Homme Prêt-à-Porter & Chaussures",
    wilaya: "Alger",
    phone: "0555933757",
    instagramUrl: "https://www.instagram.com/ramzou_ramzou/",
    notes: "Followers: 29.7k. Bio gmail link only",
    p1: "Salam alikom khawti Boutique Ramzou f Kouba Benomar, ya3tikom saha 3la l-khedma w les modeles li rakom t-7atou fihom.",
    p2: "Remarquit bli ma 3ndkomch site web w rakom t-etmdo ghi 3la les messages w l'appel fel bio, w had l-tari9a t-daya3 bzaf les clients li yhabo y-commondiw f lil wla bla ma y-3aytou.",
    p3: "N9edro n-dirolkom boutique en ligne sahla w khfifa bzaf f le telephone, win l-commandes y-dkholkom f tableau wahed m-nadem m3a confirmation automatique.",
    p4: "Chhal rakom t-day3o ta9riban men commande psk l-magasin ykoun m3amar w ma tel79ouch t-jawbou f le telephone?"
  },

  // 9. NO SITE - Leeds Pour Hommes
  {
    businessName: "Leeds Pour Hommes Dely Ibrahim",
    businessType: "Homme Prêt-à-Porter & Streetwear",
    wilaya: "Alger",
    phone: "0673952528",
    instagramUrl: "https://www.instagram.com/leeds_pour_hommes/",
    notes: "Followers: 45.1k. No URL",
    p1: "Salam alikom l'equipe Leeds f Dely Ibrahim, tbarkellah 3la la boutique w l'ambiance ta3 les arrivages li rakom t-partajiw fihom.",
    p2: "M3a 45k followers w l-khedma 7j/7, la reponse f les messages sur Instagram rahi t-akhod bzaf men wa9t les vendeurs f l-magasin.",
    p3: "Khdemna systeme de boutique autonome win l-clients ta3 Dely Ibrahim w ga3 les wilayas ychoufou l-prix w les tailles disponibles w y-commondiw direct bla ma y-derongiwkom.",
    p4: "Chahou l-obstacle l-kbir li rah y-kheli l-process ta3 la vente y-tihelkom f les DMs, les questions 3la les prix wla la confirmation ta3 l'adresse?"
  },

  // 10. NO SITE - Boutique Wolf 13 Tlemcen
  {
    businessName: "Boutique Wolf 13 Tlemcen",
    businessType: "Homme Prêt-à-Porter",
    wilaya: "Tlemcen",
    phone: "0784482008",
    instagramUrl: "https://www.instagram.com/boutique_wolf_13/",
    notes: "Followers: 16.4k. No URL",
    p1: "Salam alikom khawti Boutique Wolf f Tlemcen Imama, ya3tikom saha 3la l'activite ta3kom w les modeles tendance li rakom t-jibou.",
    p2: "Rakom t-7ato les articles w dayrin les numeros de telephone, bssh la confirmation manuelle par appel w WhatsApp t-kheli bzaf des faux commandes w l-wa9t y-ro7 f l-vide.",
    p3: "3ndna plateforme e-commerce dziriya khfifa t-dir confirmation automatique b WhatsApp w SMS bla ma t-3aytou l kol client, w t-na9as les retours b 40%.",
    p4: "Rakom t-la7do bli l'appel téléphonique rah y-di l-khedma kamel men l'equipe, wla rakom habin t-choufo kifah ykoun automatique?"
  },

  // 11. NO SITE - Le Pied d'Or Annaba
  {
    businessName: "Le Pied d'Or Annaba",
    businessType: "Chaussures & Sacs Tendance",
    wilaya: "Annaba",
    phone: "0556193578",
    instagramUrl: "https://www.instagram.com/le_pied_dor23/",
    notes: "Followers: 28.6k. No URL",
    p1: "Salam alikom l'equipe Le Pied d'Or f Annaba, ya3tikom saha 3la les modeles ta3 les chaussures w sacs li rakom t-7atouhom.",
    p2: "M3a livraison 58 wilayas w l-activite f l'est, les messages sur les pointures w les couleurs y-jiw bzaf w y-khelou les clientes y-nestanaw.",
    p3: "N-proposiwlkom site e-commerce m-fessal 3la hsab les chaussures w sacs, y-bayan le stock exact w y-akhod les coordonnees direct m3a confirmation WhatsApp.",
    p4: "Chhal men pointure y-b9aw les clientes y-sa9sou 3liha w hiya deja khlaset f l-magasin psk ma 3ndkomch mise a jour automatique?"
  },

  // 12. NO SITE - Palais des Parfums Baba Hassen
  {
    businessName: "Palais des Parfums Baba Hassen",
    businessType: "Parfumerie & Cosmétique",
    wilaya: "Alger",
    phone: "0770548622",
    instagramUrl: "https://www.instagram.com/palaisdesparfums_dz/",
    notes: "Followers: 522k. Maps link only",
    p1: "Salam alikom l'equipe Palais des Parfums f Baba Hassen, ma chaa Allah 3la l-compte ta3kom kter men 520k followers w l'authenticite ta3 les parfums.",
    p2: "M3a had l-nombre l-kbir ta3 les followers, l-messages f Instagram bayn rah fih encombrement kbir, w bzaf li y-sa9si 3la la disponibilite w le prix w y-ro7 bla ma y-commondi.",
    p3: "Khdemna solution e-commerce speciale parfumerie li t-fildi les familles olfactives w t-akhod les commandes b un clic bla ma t-day3o l-clients li y-habo y-chrriw f l-hine.",
    p4: "M3a 500k abonnes, chhal men commande rakom t-estiméw bli rahi t-ro7 psk les messages y-tawlo bch y-tl79ou t-jawbouhom kamel?"
  },

  // 13. NO SITE - Accessoires Pour Elle Alger
  {
    businessName: "Accessoires Pour Elle Alger",
    businessType: "Bijoux & Pierres Naturelles",
    wilaya: "Alger",
    phone: "0557754946",
    instagramUrl: "https://www.instagram.com/accessoirespourelle2/",
    notes: "Followers: 94.2k. No URL",
    p1: "Salam alikom l'equipe Accessoires Pour Elle, tbarkellah 3la les creations ta3 les bijoux faits main w les pierres naturelles.",
    p2: "M3a 94k followers, la vente artisanale f les DMs t-akhod bzaf men wa9t l'artisanat w l-khedma psk l-clienta t-sa9si 3la kol detail w photo.",
    p3: "3ndna plateforme galerie e-commerce li t-bayan kol bijou m3a la description ta3 les pierres w commande rapide direct, bla frais chahriya w sahla f l'utilisation.",
    p4: "Chahou l-point li rah y-akhodlkom l-wa9t l-kbir, l-envoi ta3 les photos ta3 les modeles f les DMs wla la confirmation ta3 l'adresse de livraison?"
  },

  // 14. NO SITE - El Feriel Bijoux
  {
    businessName: "El Feriel Bijoux",
    businessType: "Bijoux & Accessoires",
    wilaya: "Alger",
    phone: "0791954351",
    instagramUrl: "https://www.instagram.com/el_feriel_bijoux/",
    notes: "Followers: 18.4k. TikTok link only",
    p1: "Salam alikom l'equipe El Feriel Bijoux, ya3tikom saha 3la l-khedma w les videos TikTok w Instagram li rakom t-7atouhom.",
    p2: "Rakom t-7ato les articles w l-prix bssh l-commade par message fel bio t-daya3 l-clients li y-choufo TikTok f lil w yhabo y-commondiw direct.",
    p3: "N-dirolkom boutique en ligne li t-connecta m3a TikTok w Instagram, win l-clienta b clic wahed t-passi la commande w t-weslkom notification instantanee.",
    p4: "Rakom habin t-choufo kifah t-zidou le taux de conversion ta3 les vues TikTok l des vraies commandes b un formulaire simple?"
  },

  // 15. NO SITE - Youcef Bijoux Alger
  {
    businessName: "Youcef Bijoux Alger",
    businessType: "Bijoux & Or/Plaqué Or",
    wilaya: "Alger",
    phone: "0560854895",
    instagramUrl: "https://www.instagram.com/youcef_bijoux16/",
    notes: "Followers: 69.7k. No URL",
    p1: "Salam alikom khawti Youcef Bijoux f Alger, ma chaa Allah 3la les modeles ta3 les bijoux li rakom t-proposiw fihom w l-qualite ta3 l-khedma.",
    p2: "M3a 70k followers, les questions 3la le poids, le gramme w le prix y-khelou les messages m-khaltin w bzaf clients y-selbou f l-attente.",
    p3: "Khdemna systeme e-commerce ultra rapide specialise f la bijouterie win kol piece 3ndha fiche technique claire w commande en 2 etapes m3a WhatsApp.",
    p4: "Chhal men client y-ji y-sa9si 3la le prix w y-b9a f les DMs bla ma y-kemel, wla rakom habin t-automatisiw had l-process?"
  },

  // 16. NO SITE - Secret Femme Batna
  {
    businessName: "Secret Femme Batna",
    businessType: "Femme Prêt-à-Porter & Lingerie",
    wilaya: "Batna",
    phone: "0656334125",
    instagramUrl: "https://www.instagram.com/secret.femme_batna/",
    notes: "Followers: 250k. No URL",
    p1: "Salam alikom l'equipe Secret Femme f Batna, tbarkellah 3la l-succes ta3kom w l-communaute ta3 250k followers li bnitouha.",
    p2: "M3a volume kbir ta3 les clientes w livraison 58 wilayas, la vente par DM t-sabbelkom retard f la reponse w bzaf des doublons fel commande.",
    p3: "N-proposiwlkom plateforme e-commerce propre b nom de domaine ta3kom, t-gari l-confidentialite ta3 les clientes w t-confirmi les commandes b WhatsApp automatique.",
    p4: "Chahou l-defi l-kbir li rakom t-wa9fou m3ah kol youm, la reponse f les messages f les heures de pointe wla la confirmation téléphonique?"
  },

  // 17. NO SITE - La Reine du Shopping
  {
    businessName: "Boutique La Reine du Shopping",
    businessType: "Femme Prêt-à-Porter & Mode",
    wilaya: "Alger",
    phone: "0792994486",
    instagramUrl: "https://www.instagram.com/boutique_la_reine_du_shopping/",
    notes: "Followers: 181k. No URL",
    p1: "Salam alikom l'equipe La Reine du Shopping, ya3tikom saha 3la l'activite continue w les arrivages ta3 180k followers.",
    p2: "L-probleme ta3 les boutiques li 3ndhom traffic kbir f Instagram howa que 60% men li y-b3atou message ma y-cherouch psk y-steno la confirmation ta3 la taille w la disponibilite.",
    p3: "3ndna solution site web mobile-first win l-cliente t-chouf l-modele w t-khayer direct bla ma t-sa9si f les DMs, m3a zero frais d'abonnement mensuel.",
    p4: "Rakom habin t-choufo demo kifah t-khaliw les clientes ta3kom y-commondiw direct f 30 secondes bla ma t-katbou m3ahom f les DMs?"
  },

  // 18. NO SITE - Boutique Djihane Batna
  {
    businessName: "Boutique Djihane Batna",
    businessType: "Femme Prêt-à-Porter",
    wilaya: "Batna",
    phone: "0697981015",
    instagramUrl: "https://www.instagram.com/boutique_djihane_batna/",
    notes: "Followers: 21.6k. FB link only",
    p1: "Salam alikom l'equipe Boutique Djihane f Batna, tbarkellah 3la les collections feminines li rakom t-proposiw fihom.",
    p2: "Rakom 7atin lien Facebook fel bio bssh l-client li y-dkhol men Instagram yhab y-chouf catalogue clair w y-commondi direct bla ma y-dor f Facebook.",
    p3: "Khdemna boutique e-commerce khfifa bzaf t-wali fiha ga3 les articles ta3kom b les tailles w les couleurs w t-akhod les commandes direct sur WhatsApp.",
    p4: "Chhal men commande rakom t-dakhloha par jour men les messages, wla rakoum t-hasso bli rakom t-day3o l-clients li ma 3ndhomch Facebook?"
  },

  // 19. NO SITE - Soul By CB
  {
    businessName: "Soul by CB Alger",
    businessType: "Femme Prêt-à-Porter Chic",
    wilaya: "Alger",
    phone: "0554991922",
    instagramUrl: "https://www.instagram.com/soul_bycb/",
    notes: "Followers: 112k. Maps link only",
    p1: "Salam alikom l'equipe Soul by CB, ma chaa Allah 3la l-style moderne w raffiné ta3 les collections li rakom t-7atou fihom f Alger.",
    p2: "M3a kter men 110k followers, les clientes y-talbou la rapidite, w la gestion manuelle ta3 les DMs t-daya3 l'image haut de gamme li rakom khadamin 3liha.",
    p3: "3ndna plateforme e-commerce VIP b design minimaliste w pur, win l-commandes y-dozou en un clic m3a suivi automatique sans aucun abonnement chahri.",
    p4: "Est-ce que rakom t-fakkrou t-lansiou votre propre site e-commerce bch t-tehnaw men la charge ta3 les messages f Instagram?"
  },

  // 20. NO SITE - Mima Boutique Blida
  {
    businessName: "Mima Boutique Blida",
    businessType: "Femme Prêt-à-Porter & Robes",
    wilaya: "Blida",
    phone: "0553684934",
    instagramUrl: "https://www.instagram.com/mima_boutique09/",
    notes: "Followers: 88.8k. Maps link only",
    p1: "Salam alikom l'equipe Mima Boutique f Blida, ya3tikom saha 3la les arrivages w l'activite ta3kom m3a 88k followers.",
    p2: "Rakom dayrin localisation Google Maps fel bio bssh les clientes li b3ad 3la Blida f les 58 wilayas y-habo y-commondiw direct bla ma y-sa9sou f les commentaires.",
    p3: "N-dirolkom site e-commerce sahla fiha les articles b les prix w les tailles disponiles, w l-commande t-wsalkom direct f WhatsApp w panneau de gestion.",
    p4: "Chhal men commande hors wilaya rakom t-diro par semaine, wla la plupart ta3 l-khedma rahi f l-magasin physique faute de site web?"
  },

  // 21. NO SITE - K2 Luxe Setif
  {
    businessName: "K2 Luxe Sétif",
    businessType: "Homme Streetwear & Luxe",
    wilaya: "Sétif",
    phone: "0770378575",
    instagramUrl: "https://www.instagram.com/k2_luxe/",
    notes: "Followers: 23.5k. Maps link only",
    p1: "Salam alikom khawti K2 Luxe f Setif, ya3tikom saha 3la les articles tendance w le choix des marques li rakom t-jibouh.",
    p2: "Fel vestimentaire homme luxe, l-client yhab l-khedma tkoun rapide w pro, w l-vente par message t-akhod wa9t kbir f la reponse 3la les tailles.",
    p3: "Khdemna solution e-commerce rapide win le client y-chouf les tailles disponibles en direct w y-confirmi sans attendre, m3a zero frais d'abonnement.",
    p4: "Rakom habin t-choufo kifah t-zidou les ventes ta3kom hors Setif b un catalogue digital m-nadem?"
  },

  // 22. NO SITE - Boutique Silia Setif
  {
    businessName: "Boutique Silia Sétif",
    businessType: "Femme Prêt-à-Porter & Robes",
    wilaya: "Sétif",
    phone: "0553154664",
    instagramUrl: "https://www.instagram.com/boutique_silia19/",
    notes: "Followers: 123k. No URL",
    p1: "Salam alikom l'equipe Boutique Silia f Setif, tbarkellah 3la l'activite ta3kom w 120k followers li rakom waslin liha.",
    p2: "M3a had l-succes, l-messages f Instagram y-kono m3amrin bzaf b les demandes ta3 les prix w les disponibilites, w bzaf clientes y-melou men l'attente.",
    p3: "3ndna plateforme e-commerce complete win kol robe w article 3ndou son stock w ses tailles, w l-confirmation t-koun automatique f WhatsApp.",
    p4: "Chhal rakom t-passiw men se3a f n-har ghi f l-reponse 3la les memes questions f les DMs ta3 Instagram?"
  },

  // 23. NO SITE - Boutique Anes Costa
  {
    businessName: "Boutique Anes Costa Constantine",
    businessType: "Homme Streetwear & Chaussures",
    wilaya: "Constantine",
    phone: "0778188794",
    instagramUrl: "https://www.instagram.com/boutique_anes_costa/",
    notes: "Followers: 115k. Maps link only",
    p1: "Salam alikom khawti Boutique Anes Costa f Constantine, ya3tikom saha 3la les collections w l-succes ta3 115k followers.",
    p2: "L-probleme ta3 l-vente par message f les sneakers w streetwear howa pointures w confirmation, bzaf li y-b3at w ma y-repoundich 3la l'appel.",
    p3: "Khdemna systeme e-commerce dziri fiha confirmation automatique par WhatsApp li t-na9as les faux clients w t-khali le vendeur y-b9a concentrate f l-magasin.",
    p4: "Chhal men colis y-weli f les retours psk l-client ma rpondech f le telephone bch y-confirmi l'envoi?"
  },

  // 24. NO SITE - Amelia Creation Boutique Chaima
  {
    businessName: "Amelia Création Boutique Chaima",
    businessType: "Femme Traditionnel & Prêt-à-Porter",
    wilaya: "Alger",
    phone: "0554666253",
    instagramUrl: "https://www.instagram.com/amelia_creation_boutiquechaima/",
    notes: "Followers: 16.8k. Maps link only",
    p1: "Salam alikom l'equipe Amelia Creation f Alger, tbarkellah 3la l-khedma n9iya ta3 les tenues w les finitions li rakom t-7atouhom.",
    p2: "Fel khedma artisanale w sur-mesure, kol commande t-akhod bzaf d-d9aye9 f l-telephone w les messages bch t-fehmou les mesures w les couleurs.",
    p3: "3ndna plateforme specialisee win l-cliente t-chouf les modeles b les photos HD, t-3amer ses mesures w t-passi la commande direct bla casse-tete.",
    p4: "Rakom habin t-choufo kifah t-nado les commandes ta3 l-khedma ta3kom f un espace unique bla ma t-day3o les coordonnees f les messages?"
  },

  // 25. NO SITE - Bambino Boutique Setif
  {
    businessName: "Boutique Bambino Sétif",
    businessType: "Enfants & Bébés Vêtements",
    wilaya: "Sétif",
    phone: "0556502894",
    instagramUrl: "https://www.instagram.com/bambino.boutique19/",
    notes: "Followers: 104k. Maps link only",
    p1: "Salam alikom l'equipe Bambino Boutique f Setif, ya3tikom saha 3la les collections ta3 les bebes w l-atfal li rakom t-proposiw fihom.",
    p2: "M3a kter men 100k followers, les mamans y-sa9sou bzaf 3la les âges (mois/annees) w la disponibilite f les DMs, w had l-haja t-daya3 bzaf wa9t.",
    p3: "Khdemna site e-commerce specialise bebe/enfant win l-maman t-fildi direct par tranche d'âge w t-chouf le stock en direct m3a commande rapide.",
    p4: "Chhal men commande rakom t-fawtoha f n-har par telephone, wla l'encombrement ta3 les messages rah y-kheli bzaf y-khorjo bla achat?"
  },

  // 26. NO SITE - Ladys Chic Chlef
  {
    businessName: "Boutique Ladys Chic Chlef",
    businessType: "Femme Prêt-à-Porter",
    wilaya: "Chlef",
    phone: "0560082181",
    instagramUrl: "https://www.instagram.com/ladys.chic02/",
    notes: "Followers: 42.4k. FB link only",
    p1: "Salam alikom l'equipe Ladys Chic f Chlef, tbarkellah 3la la boutique w l'activite ta3kom f les reseaux sociaux m3a 42k followers.",
    p2: "Rakom 7atin lien Facebook fel bio bssh bzaf clientes li y-tab3oukom f Instagram yhabo y-chriw direct bla ma y-ro7o l Facebook wla y-steno f les DMs.",
    p3: "N-dirolkom boutique en ligne sahla w khfifa t-wali fiha ga3 les pieces ta3kom, m3a confirmation automatique sur WhatsApp w livraison 58 wilayas.",
    p4: "Rakom habin t-kheliw les clientes ta3kom y-commondiw direct f 30 secondes w t-na9sou l-wa9t ta3 les DMs?"
  },

  // 27. NO SITE - Casa Moda Alger
  {
    businessName: "Boutique Casa Moda Alger",
    businessType: "Femme Mode & Accessoires",
    wilaya: "Alger",
    phone: "0555203024",
    instagramUrl: "https://www.instagram.com/boutique___casamoda/",
    notes: "Followers: 23.6k. No URL",
    p1: "Salam alikom l'equipe Casa Moda f Alger, ya3tikom saha 3la les modeles w le gout li rakom t-khayrouh f les arrivages ta3kom.",
    p2: "M3a 23k followers, kol ma t-7ato reel wla story y-jiw des messages 3la le prix w la taille, w bzaf clientes y-b9aw f l-attente.",
    p3: "3ndna plateforme e-commerce mobile-first sahla bzaf win l-cliente t-chouf le prix w t-valider sans attendre, bla 7ta abonnement chahri.",
    p4: "Chahou l-point li rah y-t3abkom kter f la vente en ligne dork, la reponse f les DMs wla la confirmation ta3 l'adresse?"
  },

  // 28. NO SITE - Boutique Amine Tlemcen
  {
    businessName: "Boutique Amine Tlemcen",
    businessType: "Homme Casual & Streetwear",
    wilaya: "Tlemcen",
    phone: "0561896560",
    instagramUrl: "https://www.instagram.com/boutique_amine13/",
    notes: "Followers: 73.1k. No URL",
    p1: "Salam alikom khawti Boutique Amine f Tlemcen, ya3tikom saha 3la l-khedma w les arrivages ta3 73k followers.",
    p2: "L-vente par DM f les vetements homme t-sabbel retard kbir psk l-chbab y-sa9sou 3la les tailles f les commentaires w l'appel téléphonque y-di l-wa9t.",
    p3: "Khdemna systeme de boutique rapide specialise vetements homme win le client y-chouf la taille en stock w y-passi commande direct m3a WhatsApp.",
    p4: "Rakom habin t-choufo kifah t-kheliw l-boutique ta3kom t-bi3 automatique 24h/24 bla ma t-b9aw t-repoundiw par message?"
  },

  // 29. NO SITE - Lunelle Tlemcen
  {
    businessName: "Lunelle Optique Tlemcen",
    businessType: "Optique & Lunettes Solaires",
    wilaya: "Tlemcen",
    phone: "0542138355",
    instagramUrl: "https://www.instagram.com/lunelle_tlemcen/",
    notes: "Followers: 81.3k. No URL",
    p1: "Salam alikom l'equipe Lunelle f Tlemcen, tbarkellah 3la la collection des lunettes solaires w optiques li rakom t-proposiw fihom.",
    p2: "M3a 81k followers, l-clients y-sa9sou bzaf 3la les modeles, l-protection UV w les prix f les DMs, w had l-haja t-daya3 bzaf wa9t.",
    p3: "3ndna catalogue e-commerce ultra moderne specialise lunettes win le client y-chouf les photos sous plusieurs angles w y-commondi direct.",
    p4: "Chhal men client y-ji y-sa9si f les DMs w y-ro7 bla ma y-chri psk l-reponse t-wlet chwiya?"
  },

  // 30. NO SITE - Boutique Medusa Tlemcen
  {
    businessName: "Boutique Medusa Tlemcen",
    businessType: "Femme Prêt-à-Porter & Chaussures",
    wilaya: "Tlemcen",
    phone: "0562012376",
    instagramUrl: "https://www.instagram.com/boutique_medusa13/",
    notes: "Followers: 51k. TikTok link only",
    p1: "Salam alikom l'equipe Boutique Medusa f Tlemcen, ya3tikom saha 3la l'ambiance w les videos TikTok w Instagram ta3 50k followers.",
    p2: "Les videos TikTok ta3kom y-jibou des vues bssh l-passage men TikTok l la commande par DM y-daya3 kter men 50% men l-acheteurs potentiels.",
    p3: "N-dirolkom boutique en ligne rapide fiha formulaire de commande en un clic li y-kheli les clientes ta3 TikTok y-commondiw direct bla ma y-khorjo.",
    p4: "Rakom habin t-bedlo l-vues ta3 TikTok l des vraies commandes automatiques sans passer par les messages?"
  },

  // 31. NO SITE - Boutique Massaya Alger
  {
    businessName: "Boutique Massaya Alger",
    businessType: "Femme Prêt-à-Porter & Caftans",
    wilaya: "Alger",
    phone: "0658564093",
    instagramUrl: "https://www.instagram.com/boutiquemassaya_/",
    notes: "Followers: 65k. Maps link only",
    p1: "Salam alikom l'equipe Boutique Massaya f Alger, tbarkellah 3la les pieces uniques w l'elegance ta3 les tenues li rakom t-7atou fihom.",
    p2: "M3a 65k followers w localisation Maps fel bio, les clientes li b3ad 3la Alger yhabo y-choufo les modeles b les details w y-commondiw direct.",
    p3: "Khdemna plateforme e-commerce raffinee li t-bayan la noblesse ta3 les tissus w t-akhod les commandes m3a confirmation automatique sur WhatsApp.",
    p4: "Est-ce que l-gestion manuelle ta3 les commandes rahi t-akhodlkom bzaf wa9t li n9edro n-automatisiwh b un catalogue digital?"
  },

  // 32. NO SITE - Boutique Lovisa Alger
  {
    businessName: "Boutique Lovisa Alger",
    businessType: "Femme Prêt-à-Porter Tendance",
    wilaya: "Alger",
    phone: "0552316985",
    instagramUrl: "https://www.instagram.com/boutique_lovisa/",
    notes: "Followers: 29.3k. No URL",
    p1: "Salam alikom l'equipe Boutique Lovisa f Alger, ya3tikom saha 3la le choix des articles w l-succes ta3 30k followers.",
    p2: "L-vente par DM f Instagram t-daya3 bzaf wa9t m3a les questions ta3 les prix w les disponibilites kol youm.",
    p3: "3ndna plateforme e-commerce khfifa bzaf f le telephone, win l-cliente t-chouf les articles disponibles w t-valider sa commande en 20 secondes.",
    p4: "Chhal rakom t-day3o men wa9t kol youm ghi f l-ecriture ta3 les prix w les tailles f les DMs?"
  },

  // 33. NO SITE - Boutique Celina Alger
  {
    businessName: "Boutique Celina Alger",
    businessType: "Femme Prêt-à-Porter & Robes",
    wilaya: "Alger",
    phone: "0554830740",
    instagramUrl: "https://www.instagram.com/boutique_celinaa/",
    notes: "Followers: 87.1k. No URL",
    p1: "Salam alikom l'equipe Boutique Celina f Alger, tbarkellah 3la les modeles feminins w 87k followers li rakom waslin liha.",
    p2: "M3a had l-chiffre, les messages f les stories y-tl3ou bzaf w y-kheli bzaf clientes y-nestanaw l-reponse ta3 les tailles.",
    p3: "N-proposiwlkom site e-commerce b nom de domaine propre fiha systeme de stock automatique bla abonnement chahri, m3a confirmation WhatsApp.",
    p4: "Rakom habin t-choufo demo kifah t-kheliw les commandes y-dkholkom m-nadmin direct f tableau wahed?"
  },

  // 34. NO SITE - Wissam Abaya Dubai
  {
    businessName: "Wissam Abaya Dubai Alger",
    businessType: "Abayas & Voiles Dubai",
    wilaya: "Alger",
    phone: "0796109296",
    instagramUrl: "https://www.instagram.com/wissam_abaya_dubai/",
    notes: "Followers: 124k. IG creator link only",
    p1: "Salam alikom l'equipe Wissam Abaya Dubai, ma chaa Allah 3la les modeles des abayas li rakom t-jibou fihom w 124k followers.",
    p2: "Fel abayas l-point l-kbir howa la longueur (52, 54, 56, 58) w le tissu, kol ma t-7ato modele y-jiw des centaines de questions f les DMs.",
    p3: "Khdemna site e-commerce specialise abayas win l-cliente t-khayer la longueur exacte w t-chouf les photos en haute resolution direct b un clic.",
    p4: "Chhal men commande rakom t-day3o psk les clientes ma ya3rfouch la longueur exacte li t-lemlhom wla psk l-reponse t-wlet?"
  },

  // 35. NO SITE - Tayri by Lydia Tizi Ouzou
  {
    businessName: "Tayri by Lydia Tizi Ouzou",
    businessType: "Femme Traditionnel & Robes Kabyles",
    wilaya: "Tizi Ouzou",
    phone: "0668025997",
    instagramUrl: "https://www.instagram.com/tayri_by_lydia/",
    notes: "Followers: 85.9k. Maps link only",
    p1: "Salam alikom l'equipe Tayri by Lydia f Tizi Ouzou, tbarkellah 3la l'elegance ta3 les tenues traditionnelles w 85k followers li rakom waslin liha.",
    p2: "M3a localisation Maps fel bio w la vente f 58 wilayas, les clientes li yhabo y-commondiw men l-kharij wla men d-dakhil y-b9aw y-katbou f les messages.",
    p3: "3ndna plateforme e-commerce classe li t-bayan l'artisanat ta3kom w t-kheli les clientes y-khayrou les modeles w les tailles direct avec confirmation.",
    p4: "Est-ce que l-gestion ta3 les commandes hors wilaya rahi t-sabbelkom charge kbira f l-telephone w les messages?"
  },

  // 36. NO SITE - Boutique Belle Women Alger
  {
    businessName: "Boutique Belle Women Alger",
    businessType: "Femme Prêt-à-Porter",
    wilaya: "Alger",
    phone: "0560524722",
    instagramUrl: "https://www.instagram.com/boutique_belle_women/",
    notes: "Followers: 19.2k. No URL",
    p1: "Salam alikom l'equipe Belle Women f Alger, ya3tikom saha 3la les collections w l'activite continue ta3kom f Instagram.",
    p2: "L-vente par DM t-akhod bzaf wa9t w bzaf clientes y-khorjo bla ma y-commondiw psk y-steno la reponse 3la le prix w la taille.",
    p3: "N-dirolkom boutique e-commerce khfifa w sahla win l-commande t-koun en 20 secondes direct sur WhatsApp bla frais chahriya.",
    p4: "Chhal rakom t-hasso bli rakom t-day3o men vente kol ma y-koun kayen retard f la reponse f les DMs?"
  },

  // 37. NO SITE - Boutique Jouriya Blida
  {
    businessName: "Boutique Jouriya Blida",
    businessType: "Femme Prêt-à-Porter & Hijab",
    wilaya: "Blida",
    phone: "0553713206",
    instagramUrl: "https://www.instagram.com/boutique_jouriya/",
    notes: "Followers: 30.8k. No URL",
    p1: "Salam alikom l'equipe Boutique Jouriya f Blida, tbarkellah 3la les modeles ta3 les tenues w l'elegance feminine ta3 30k followers.",
    p2: "Rakom t-7ato les articles bssh la commande par message t-kheli bzaf clientes y-b9aw y-sa9sou 3la les couleurs disponiles w y-sabbelkom retard.",
    p3: "3ndna solution catalogue digital fiha les couleurs w les tailles en direct, m3a confirmation automatique bla ma t-katbou manuellement.",
    p4: "Rakom habin tchoufo kifah t-kheliw les commandes y-wesloukom m-nadmin direct b les details bla ma t-sa9sou kol cliente?"
  },

  // 38. NO SITE - Algerian Abaya
  {
    businessName: "Algerian Abaya Alger",
    businessType: "Abayas & Hijab Élégance",
    wilaya: "Alger",
    phone: "0551255951",
    instagramUrl: "https://www.instagram.com/algerian.abaya/",
    notes: "Followers: 52.6k. WhatsApp direct link only",
    p1: "Salam alikom l'equipe Algerian Abaya, ma chaa Allah 3la les abayas w les tissus li rakom t-proposiw fihom m3a 52k followers.",
    p2: "Rakom 7atin lien WhatsApp fel bio bssh l-clienta ki t-dkhol WhatsApp t-sa9si 3la ga3 les modeles w les tailles wahed b wahed w had l-haja t-daya3 wa9t kbir.",
    p3: "Khdemna site e-commerce specialise abayas win l-cliente t-chouf le catalogue kamel, t-khayer la longueur w la couleur, w t-b3at commande wajda direct f WhatsApp.",
    p4: "Chhal men se3a f n-har rakom t-passiwha f l-envoi ta3 les photos w les details f WhatsApp wahed b wahed?"
  },

  // 39. NO SITE - Boutique Aissa Style Constantine
  {
    businessName: "Boutique Aissa Style Constantine",
    businessType: "Homme Casual & Streetwear",
    wilaya: "Constantine",
    phone: "0553926883",
    instagramUrl: "https://www.instagram.com/boutique_aissa_style/",
    notes: "Followers: 77.2k. No URL",
    p1: "Salam alikom khawti Boutique Aissa Style f Constantine, ya3tikom saha 3la les arrivages w l-chiffre ta3 77k followers.",
    p2: "M3a livraison 58 wilayas, la confirmation ta3 les tailles w l'adresse par appel w SMS rahi t-chadi bzaf l-khedma f l-magasin.",
    p3: "3ndna plateforme e-commerce dziriya khfifa win le client y-chouf la taille disponible w y-confirmi direct avec un systeme automatique.",
    p4: "Chahou l-point li rah y-sabbelkom retours f la livraison, les erreurs ta3 les tailles wla les faux clients li ma y-repoundouch?"
  },

  // 40. NO SITE - Boutique 2 One Oran
  {
    businessName: "Boutique 2 One Oran",
    businessType: "Homme Streetwear & Sneakers",
    wilaya: "Oran",
    phone: "0552072624",
    instagramUrl: "https://www.instagram.com/boutique_2_one/",
    notes: "Followers: 179k. Maps link only",
    p1: "Salam alikom khawti Boutique 2 One f Oran, ma chaa Allah 3la l-succes ta3kom f l-ouest m3a 180k followers.",
    p2: "M3a had l-volume kbir, les messages f les stories w les posts y-tl3ou b l-oulouf w bzaf chbab y-sa9sou 3la les pointures w y-khorjo bla ma y-chrriw.",
    p3: "Khdemna solution e-commerce ultra rapide specialisee sneakers w streetwear win le client y-commondi en 30 secondes bla ma y-stena f les DMs.",
    p4: "Chhal men vente rakom t-estiméw bli rahi t-ro7lkom psk l-messages rakom t-tawlo bch t-repoundiw 3lihom kamel?"
  },

  // 41. NO SITE - Boutique Lilia Tlemcen
  {
    businessName: "Boutique Lilia 13 Tlemcen",
    businessType: "Femme Prêt-à-Porter & Robes",
    wilaya: "Tlemcen",
    phone: "0556479344",
    instagramUrl: "https://www.instagram.com/boutique_lilia13/",
    notes: "Followers: 27.3k. No URL",
    p1: "Salam alikom l'equipe Boutique Lilia f Tlemcen, tbarkellah 3la les modeles feminins w les tenues li rakom t-7atou fihom.",
    p2: "L-vente par DM t-kheli l-wa9t y-ro7 f l-vide m3a les questions ta3 les prix w les disponibilites kol youm.",
    p3: "N-dirolkom boutique en ligne sahla fiha les articles b les photos w les tailles, w l-commande t-wselkom m-nadma direct f WhatsApp.",
    p4: "Rakom habin t-choufo demo sahla kifah t-kheliw les clientes y-commondiw direct bla ma t-katbou m3ahom f les DMs?"
  },

  // 42. NO SITE - Bouali Magasin Alger
  {
    businessName: "Bouali Magasin Alger",
    businessType: "Homme Prêt-à-Porter & Chaussures",
    wilaya: "Alger",
    phone: "0550533650",
    instagramUrl: "https://www.instagram.com/boualimagasin/",
    notes: "Followers: 11.8k. No URL",
    p1: "Salam alikom khawti Bouali Magasin f Alger, ya3tikom saha 3la les articles pour homme li rakom t-jibou fihom.",
    p2: "Rakom t-7ato les articles bssh bla site web la vente t-b9a ma7doda ghi f l-magasin w bzaf li y-chouf f Instagram y-b9a f l'hesitation.",
    p3: "3ndna plateforme e-commerce khfifa b un paiement unique win le client y-chouf l-prix w la taille w y-passi la commande direct.",
    p4: "Chhal men commande hors Alger rakom t-fawtoha f l-usbou3, wla rakom habin t-tal9ou la livraison 58 wilayas b un site professionnel?"
  },

  // 43. NO SITE - Vêtement Traditionnel Constantine
  {
    businessName: "Gandoura Vêtement Traditionnel Constantine",
    businessType: "Femme Gandoura & Traditionnel",
    wilaya: "Constantine",
    phone: "0540964914",
    instagramUrl: "https://www.instagram.com/vetementtraditionnel/",
    notes: "Followers: 34.4k. Maps link only",
    p1: "Salam alikom l'equipe Gandoura Constantine, tbarkellah 3la l'asala w l'artisanat ta3 la gandoura constantinoise li rakom t-7atou fihom.",
    p2: "Fel khedma traditionnelle, kol commande t-akhod wa9t kbir f l-mesures w les questions sur le tissu w la livraison f les autres wilayas.",
    p3: "Khdemna site e-commerce specialise tenue traditionnelle fiha guide des mesures clair w commande rapide m3a confirmation automatique.",
    p4: "Est-ce que l-gestion manuelle ta3 les commandes f les DMs rahi t-akhodlkom wa9t li n9edro n-khaliwh l l-khedma ta3 l'atelier?"
  },

  // 44. NO SITE - Abaya Boutique Rayane Blida
  {
    businessName: "Abaya Boutique Rayane Blida",
    businessType: "Abayas & Prêt-à-Porter Voilée",
    wilaya: "Blida",
    phone: "0662360023",
    instagramUrl: "https://www.instagram.com/abaya_boutique_rayane/",
    notes: "Followers: 32k. No URL",
    p1: "Salam alikom l'equipe Abaya Boutique Rayane f Blida, ma chaa Allah 3la les modeles des abayas li rakom t-proposiw fihom m3a 32k followers.",
    p2: "L-probleme ta3 les abayas howa les longueurs w les couleurs, kol ma t-7ato story y-jiw des dizaines de questions f les DMs.",
    p3: "3ndna plateforme catalogue e-commerce win l-cliente t-chouf les longueurs disponibles en temps reel w t-commondi direct en 20 secondes.",
    p4: "Chhal men cliente t-sa9si 3la la longueur w ma t-chrrich psk l-reponse t-wlet chwiya f les DMs?"
  },

  // 45. NO SITE - Boutique MBC Barika Batna
  {
    businessName: "Boutique MBC Barika Batna",
    businessType: "Femme Prêt-à-Porter & Robes",
    wilaya: "Batna",
    phone: "0665141307",
    instagramUrl: "https://www.instagram.com/boutique_mbc/",
    notes: "Followers: 84.3k. FB link only",
    p1: "Salam alikom l'equipe Boutique MBC f Barika Batna, tbarkellah 3la l'activite ta3kom w 84k followers li bnitouha.",
    p2: "Rakom 7atin lien Facebook fel bio bssh l-clientes f Instagram yhabo y-choufo les modeles b les prix w les tailles bla ma y-ro7o l Facebook.",
    p3: "N-dirolkom boutique en ligne moderne w rapide win l-cliente t-passi la commande direct m3a confirmation automatique sur WhatsApp.",
    p4: "Rakom habin t-choufo demo kifah t-kheliw ga3 les commandes ta3 Instagram w Facebook y-dkholkom f blassa wahda m-nadma?"
  },

  // 46. NO SITE - Almas Abaya Alger
  {
    businessName: "Almas Abaya Alger",
    businessType: "Abayas Tendance & Hijab",
    wilaya: "Alger",
    phone: "0541860243",
    instagramUrl: "https://www.instagram.com/almas_abaya_dz/",
    notes: "Followers: 26.2k. Maps link only",
    p1: "Salam alikom l'equipe Almas Abaya f Alger, ya3tikom saha 3la les collections raffinées des abayas li rakom t-7atou fihom.",
    p2: "M3a 26k followers, la vente par message f les abayas t-daya3 bzaf wa9t m3a les questions 3la les tissus w les longueurs disponibles.",
    p3: "Khdemna site e-commerce fluide specialise abayas win l-cliente t-chouf les fiches techniques w t-valider sans attendre l-reponse f les DMs.",
    p4: "Chahou l-point li rah y-akhodlkom l-wa9t l-kbir, la reponse 3la les DMs wla la confirmation téléphonique des adresses?"
  },

  // 47. NO SITE - Boutique Lala Meriem Tlemcen
  {
    businessName: "Boutique Lala Meriem Tlemcen",
    businessType: "Femme Robes & Prêt-à-Porter",
    wilaya: "Tlemcen",
    phone: "0775593496",
    instagramUrl: "https://www.instagram.com/boutique_lala_meriem/",
    notes: "Followers: 11.4k. No URL",
    p1: "Salam alikom l'equipe Boutique Lala Meriem f Tlemcen, tbarkellah 3la les modeles feminins w les arrivages li rakom t-jibou fihom.",
    p2: "L-vente par DM t-khali bzaf clientes y-b9aw f l'attente w bzaf y-khorjo bla ma y-commondiw psk ma 3ndhomch moyen direct de commande.",
    p3: "3ndna plateforme e-commerce sahla bzaf f le telephone, t-wali fiha ga3 les articles ta3kom b un paiement unique sans aucun abonnement chahri.",
    p4: "Rakom habin t-choufo kifah t-kheliw les clientes ta3kom y-commondiw direct f 30 secondes w t-na9sou l-wa9t ta3 les messages?"
  }
];

async function insertAll() {
  console.log(`Starting insertion of ${storesToInsert.length} stores into outreach table...`);
  
  let inserted = 0;
  for (const s of storesToInsert) {
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
      console.log(`[${inserted}/${storesToInsert.length}] Inserted: ${s.businessName} (${s.phone}) - ${s.businessType}`);
    } catch (e) {
      console.error(`Failed to insert ${s.businessName}:`, e.message);
    }
  }

  console.log(`\nAll done! Successfully inserted ${inserted} records.`);
}

insertAll();
