from pathlib import Path
import hashlib, json

ROOT = Path(__file__).resolve().parent
SKILL = Path('C:/Users/Computs/.codex/skills/motion-design')
ARTICLE = 'https://higgsfield.ai/@adilinthewildtempo/blogs/claude-fable-5-1-higgsfield-marketing-studio-300-day'
BRAND = Path('C:/antigravity-projects/VISION/assets/brand/VISION-Brand-Kit')

films = {
'request': {
 'title':'ماذا يحدث بعد الضغط على «اطلب»؟', 'preset':'glass-ui-launch', 'duration':32,
 'preview':'https://d2ol7oe51mr4n9.cloudfront.net/user_3DiY2MbHSIvzM3FG2DOgC6Cf2MM/fee13558-1de4-46cb-80c6-443935cb8257.mp4',
 'voice':'Male, clear mid register, curious technical storyteller; neutral Modern Standard Arabic, thoughtful question then increasing momentum, soft confident resolution. Not the previous Darija narrator.',
 'music':'112 BPM electronic micro-groove; rounded bass, granular glass percussion, sparse plucked synth. Two distinct macro dropouts, restrained ending.',
 'departures':['15 seconds landscape becomes32 seconds portrait to serve Arabic speech and visible causality, not proportional stretching.','Phone-sales story replaced by one fictional order request. No copied Tepsira labels or metrics.','Dark studio passage becomes smoked-glass material surrounded by a bright ice-white world, honoring the light VISION direction.','Arabic narration added explicitly by user; sales CTA removed.','Three nonquantitative stages replace source metric bars.'],
 'shots':[
  [0,4.5,'A selected order control becomes one recognizable cyan signal.','ضغطة واحدة على «اطلب»... وخلفها رحلة لا تراها.',['اطلب','ماذا يحدث بعد النقرة؟']],
  [4.5,10,'The interface encodes a product and quantity into that same packet.','تجمع الواجهة المنتج والكمية التي اخترتها، ثم ترسل هذه البيانات إلى الخادم.',['الواجهة','المنتج A','الكمية 2']],
  [10,12,'Macro verification gate physically checks the signal, no headline.','هنا، يبدأ التحقق من المعلومات والأسعار...',['تحقّق']],
  [12,17.5,'A different viewpoint reveals stock verification and a single accepted request.','ثم يُفحص المخزون، للتأكد من توفر الكمية المطلوبة.',['الخادم','المعلومات','السعر','المخزون']],
  [17.5,20.5,'Trace macro: the accepted packet reaches a persistent record slot.','بعد قبول العملية، ينتقل الطلب إلى التخزين.',['حفظ الطلب']],
  [20.5,28.5,'Record locks in, acknowledgement travels back, three stages become one legible route.','تُحفظ بياناته في قاعدة البيانات، ويعود تأكيد واضح إلى شاشتك.',['قاعدة البيانات','تم تأكيد الطلب','واجهة ← خادم ← قاعدة بيانات']],
  [28.5,32,'The route resolves into a frozen VISION identity, no CTA.','نقرة واحدة. نظام متكامل.',['VISION','وراء كل نقرة، نظام.']]
 ],
 'prompt':'''One complete32-second portrait9:16 3D educational motion film for VISION. Explain one fictional order from its interface to server validation, database persistence and acknowledgement. Seven edited camera shots inside one consistent optical world. Native Modern Standard Arabic narration, original instrumental music and synchronized effects. This is not a software advertisement or an actual client interface.

design world:
Rigid cyan-edged optical-glass forms with visible thickness, pearl interiors, polished silver bevels and precise studio reflections. Cool white#FFFFFF and ice#EAF7FC environments, cyan#00BCEB signals, ink#080E17 typography. A single cyan packet is the recurring hero; it retains its geometry throughout the journey. Its identity, trajectory and result tell the story even if the headlines are hidden. Use one small meaningful illustrative interface, not a succession of empty dashboard cards. Dubai-like Arabic sans, proper connected letters, no Arabic letter spacing. Type is sharp black screen-space geometry, never reflected or refracted into illegibility. No stars, stickers, avatars, random code, floating decorative particles or dark navy backgrounds. Smoked glass occurs only on the verification component; the world stays bright. All data are fictional.

motion rules:
Real camera travel with parallax, changing occlusion and rigid objects, not zooms over still pictures. Large lateral moves and30-degree arcs brake into stable reading holds. Fast travel is followed by restrained comprehension time; do not animate everything continuously at the same speed. Blur only during travel, never settled type. Edits are caused by the packet crossing an edge, entering a component or arriving at a result. Distinguish a request from the acknowledgement it causes. Composition changes across wide views and genuine extreme macros; no permanent headline-plus-card layout. Keep important Arabic within x90–950 and y180–1600 on a1080×1920 delivery.

[Shot1,0.00–4.50] Already moving on the first frame, begin extremely close to the bevel of one order control among depth-separated UI strips. Truck right through the gaps rapidly, then brake at1.0s. The only active control reads «اطلب». It depresses once at1.4s; a cyan edge pulse becomes the single packet. Reveal «ماذا يحدث بعد النقرة؟» in two complete Arabic units with at least2s of stable reading. The packet passes under a glass edge, motivating the cut. Voice, curious and quietly inviting: «ضغطة واحدة على «اطلب»... وخلفها رحلة لا تراها.» No alarm or exaggerated sales shout.

[Shot2,4.50–10.00] Match the packet to a wide optical assembly. The interface layer carries «المنتج A» and «الكمية 2»; these two specific selections move together into the packet. A thin rigid glass ribbon joins the interface and a distant server component. Arc right30degrees to reveal thickness and depth; the packet travels along the ribbon only after its fields are assembled. Headline «الواجهة». Read the selected values clearly before the camera accelerates. Voice: «تجمع الواجهة المنتج والكمية التي اخترتها، ثم ترسل هذه البيانات إلى الخادم.»

[Shot3,10.00–12.00] Extreme macro of a smoked-crystal verification gate with a rounded polished rim, surrounded by ice-white light. A short push shows the packet reaching one precise gate. The gate closes, inspects, then reopens once. A single etched «تحقّق» is the only copy; no main headline. The reflection moves through the material and settles. Voice begins the next thought without rushing: «هنا، يبدأ التحقق من المعلومات والأسعار...»

[Shot4,12.00–17.50] Cut to a different three-quarter angle, pull from close through medium to wide, revealing the server and a rear stock registry. The first component rests after validation; the stock registry responds after it. Three physical check paths illuminate sequentially beside «المعلومات»، «السعر»، «المخزون». None implies that validation is magical or guarantees security. Land on «الخادم», then let the accepted packet leave for storage. Voice completes the thought: «ثم يُفحص المخزون، للتأكد من توفر الكمية المطلوبة.» Hold the completed checks long enough to understand before the departure.

[Shot5,17.50–20.50] Graphic match the outgoing path to a rigid glass process trace in extreme macro. Track right along its engraved route as one narrow scan follows the same packet into a record slot. No arbitrary waveform. Only «حفظ الطلب» appears. Voice: «بعد قبول العملية، ينتقل الطلب إلى التخزين.». The insertion sound happens when the packet reaches the slot, not on the cut.

[Shot6,20.50–28.50] Cut wide as that slot mechanically locks into a persistent database stack. The saved record stays in the stack while a separate acknowledgement pulse returns along the established route to the interface. Arc left moderately, then settle frontal. Reveal «قاعدة البيانات» at storage; reveal «تم تأكيد الطلب» only after the returning pulse reaches the interface. Recompose into a clear complete route with three nonquantitative components and the exact label «واجهة ← خادم ← قاعدة بيانات». Do not add charts, invented timing claims or metrics. Voice: «تُحفظ بياناته في قاعدة البيانات، ويعود تأكيد واضح إلى شاشتك.»

[Shot7,28.50–32.00] The last pulse traces the existing VISION eye identity and rests in its cyan pupil. Camera locks. Center the genuine VISION lockup with «وراء كل نقرة، نظام.» below. One narrow reflection travels along a foreground glass ribbon, then the entire image including lighting is frozen from30.6s to32.0s. No fade, CTA or appended graphic. Voice resolves gently: «نقرة واحدة. نظام متكامل.» Finish speech by30.6s and leave the last hold silent except for a short musical decay.

overall_soundscape:
One natural male Modern Standard Arabic voice, curious mid register, precise consonants, no regional colloquial phrasing or accent performance, no imitation of a real person. A measured opening question, more forward momentum through the data journey, softer ending; never uniformly accelerated. Speak only the specified lines, once each, in order. Select dry tick on the button, spatial glass-edge sweeps during camera travel, distinct verification/stock taps, narrow trace scan, record-seating click, and a two-note acknowledgement when the signal returns. Macro holds briefly reduce the score. Effects support rather than cover speech.

non_diegetic_music:
Original instrumental electronic micro-groove at112BPM: rounded bass pulses, crisp restrained syncopation, sparse plucked synth and granular glass percussion. Build at the packet departure, thin to near silence at the first verification macro, return with stock confirmation, then reduce percussion at the final identity. No vocals or reused music from the older videos. End the beat at30.6s with a short tonal decay wholly inside32s.

Text control: only the quoted on-screen strings above, with correct Arabic shaping, punctuation and stable complete numerals. Narration is not printed as dense subtitles over every shot. Use the supplied VISION identity reference only for the brand, not as a fixed starting frame. One complete film; no slideshow, no independently generated scene compilation.'''
},
'profit': {
 'title':'المبيعات ليست الأرباح', 'preset':'editorial-collage', 'duration':36,
 'preview':'https://d2ol7oe51mr4n9.cloudfront.net/user_3DiY2MbHSIvzM3FG2DOgC6Cf2MM/61a1f7e8-0a71-4f07-87de-8c75b4c69c34.mp4',
 'voice':'Female, warm grounded lower-mid register, articulate Modern Standard Arabic; conversational analytical delivery, patient number reading and meaningful pauses, no advertising voice.',
 'music':'76 BPM felt piano, restrained plucked bass and brushed wooden percussion; deliberate gaps at deductions, no glass-electronic bed.',
 'departures':['Source recorded-voice science story replaced with a fictional financial arithmetic example. No scientific claims or50/50stats inherited.','Four compositions and three silhouette-match cuts retained; authored36s portrait timing, not a claim about source timing.','Photographic face replaced by the same paper ledger as a recurring narrative subject. This is a custom editorial adaptation.','Cobalt/orange/yellow source hues replaced by VISION cyan, warm ivory and ink while retaining matte print and one dominant background at a time.','User-requested Fusha female narration; no advertising endcard.'],
 'shots':[
  [0,6,'Printed sales ribbon emerges, oversized question contrasts sales with profit.','مئة ألف دينار من المبيعات. رقم جميل... لكنه لا يعني مئة ألف من الأرباح.',['100 000 دج','مبيعات ≠ أرباح']],
  [6,16,'A fixed100-unit ribbon separates60units for goods cost;40remain on the same scale.','لنأخذ مثالًا مبسطًا: السلع المباعة كلّفت ستين ألف دينار؛ يتبقّى أربعون ألفًا، قبل مصاريف التشغيل.',['100 000 دج','60 000 دج','40 000 دج','تكلفة السلع']],
  [16,24.5,'Separate15additionalunits for expenses of the sameperiod,25remain.','نطرح الآن خمسة عشر ألفًا لمصاريف الفترة نفسها. المتبقي: خمسة وعشرون ألف دينار.',['15 000 دج','25 000 دج','مصاريف الفترة']],
  [24.5,36,'Reveal complete ledger, then contrast missingexpense with recordedexpense using consistent scale.','يجمع النظام المبيعات والتكاليف والمصاريف. لكن، إن نسيت تسجيل جزء منها، فستحصل على صورة ناقصة... حتى لو كانت العملية الحسابية صحيحة.',['المبيعات','تكلفة السلع','المصاريف','المتبقّي','100 000 − 60 000 − 15 000 = 25 000 دج','بيانات كاملة. صورة أوضح.','مثال مبسّط، قبل أي تكاليف أو ضرائب أخرى.','VISION']]
 ],
 'prompt':'''One complete36-second portrait9:16 editorial motion short for VISION, in Modern Standard Arabic, explaining why sales and profit differ and why incomplete inputs produce an incomplete picture. Four distinct compositions joined by three exact shape-match cuts. This is a fictional same-period arithmetic example, not accounting advice or a client performance claim. Give this film an observant, measured personality different from a technological launch.

VISUAL SYSTEM
One recurring cut-paper sales ledger is the subject. Use oversized printed numerals, tightly composed paper layers, visible paper fibre, restrained halftone ink and consistent upper-left shadows. Ivory#FFF8E9, VISION cyan#00BCEB, pale cyan#DDF6FC and ink#080E17. Each composition has one dominant background; no all-over rainbow. Every surface is flat matte paper. No glow, neon, plastic glass, luminous edges, starbursts or decorative stickers. The paper can hinge and turn to expose real thickness but the number graphics remain printed. Strong Arabic display typography with proper joining, no stretched isolated letters, no Arabic tracking. This is a designed editorial film, not a succession of ordinary information cards.

MOTION PRINCIPLES AND DATA CONTRACT
Energy comes from huge-to-small scale changes, paper mechanics and silhouette-match cuts. Each purposeful movement decelerates with a small overshoot and a stable landing. One causal element moves at a time. Numbers appear fully printed and correct from their first readable frame: never count up, morph or flash a false intermediate figure. A single original ribbon100units long represents100000dinars throughout. Cost consumes60of those units, expenses15, and the remainder25. Preserve this common denominator; do not stretch the40-unit remainder to look like a new100-unit total. The outlined100-unit track remains visible whenever quantitative pieces are compared. Detached pieces remain intact and retain their value. All values use the same unit and period. Main information stays inside x90–950 and y180–1600 on1080×1920. Provide clear holds around every deduction; spectacle must make the arithmetic easier to follow.

COMPOSITION1,0.00–6.00 — THE QUESTION
Open already in action on ivory paper. An enormous printed «100 000 دج» arrives as a sale receipt unrolling from the top of frame, with realistic ink grain and a subtle curled edge. It settles without character distortion. A cyan equals sign appears physically as two printed strips; a diagonal ink strip lands between them to form≠, resolving the headline «مبيعات ≠ أرباح». The contradiction is a visual question, not a flashing warning. A triangular folded corner expands toward camera, filling the frame at6s to motivate the first cut. Voice: «مئة ألف دينار من المبيعات. رقم جميل... لكنه لا يعني مئة ألف من الأرباح.» Let the question breathe for about0.5s.

COMPOSITION2,6.00–16.00 — THE COST
Match the receipt's triangular fold to a triangular selection pointer on a pale-cyan background. Pull from macro fibres to a complete horizontal100-unit printed ribbon, positioned inside the portrait frame with its whole outlined track visible. The first60units are one pre-cut ink segment carrying «60 000 دج» and «تكلفة السلع»; the remaining40units are cyan with «40 000 دج». The top reference reads «100 000 دج». After a short inspection hold, the60-unit segment slides upward as a physical strip and parks beside the track. The40-unit segment stays in its original position and retains its actual width. Follow the cut seam in a calm camera push; do not race through the arithmetic. Voice: «لنأخذ مثالًا مبسطًا: السلع المباعة كلّفت ستين ألف دينار؛ يتبقّى أربعون ألفًا، قبل مصاريف التشغيل.» Hold the40-unit result during the last phrase. End on a circular punched registration hole in the paper, ready for a circle match cut.

COMPOSITION3,16.00–24.50 — THE NEXT DEDUCTION
Match that circular hole to an enormous circular ledger registration mark on a warmer ivory background. A camera pull reveals the same original100-unit baseline and its40-unit remaining cyan section. A pale-ink15-unit segment separates from within those40units, bearing the complete printed «15 000 دج» and «مصاريف الفترة». Its remaining25-unit companion bears «25 000 دج». Keep60units of already-removed goods cost ghosted only as a neutral outline outside the retained section, not as additional money. Lift the15-unit piece with one convincing paper peel and settle it next to the60-unit cost segment. Expose the25-unit result clearly for at least2s. Voice: «نطرح الآن خمسة عشر ألفًا لمصاريف الفترة نفسها. المتبقي: خمسة وعشرون ألف دينار.» The registration circle contracts to the ledger's original binding hole and creates the third match cut.

COMPOSITION4,24.50–36.00 — THE COMPLETE PICTURE
Pull away from that binding hole to reveal the opened original ledger, now organized. Its four printed rows read «المبيعات»، «تكلفة السلع»، «المصاريف»، «المتبقّي», paired with100000,60000,15000,25000respectively, all in dinars. Briefly show an empty expenses slot and a clearly provisional40-unit remainder; the15-unit expense piece returns to its record position and the remainder resolves to25units. This is filling missing input, not a second expense deduction. Hold the exact equation «100 000 − 60 000 − 15 000 = 25 000 دج» as a single correctly ordered left-to-right numeric group, with Arabic explanation separate from it. Headline «بيانات كاملة. صورة أوضح.» The visible qualifier «مثال مبسّط، قبل أي تكاليف أو ضرائب أخرى.» stays readable throughout this composition and also appears as a small legible footer from6s onward. Voice: «يجمع النظام المبيعات والتكاليف والمصاريف. لكن، إن نسيت تسجيل جزء منها، فستحصل على صورة ناقصة... حتى لو كانت العملية الحسابية صحيحة.» Finish by34.5s. Keep the conclusion and a small printed VISION identity inside the ledger; the last1.5s has only a gentle paper-edge settling movement. No appended sales endcard or CTA.

AUDIO
One natural female narrator, warm low-to-mid register, clear neutral Modern Standard Arabic. Patient, intelligent, conversational analytical delivery; no Darija, no exaggerated advertising intonation and no uniform speed-up. Pronounce all numbers completely. Deliver the opening question with curiosity, make subtle pauses before each result, and give the final line a grounded conclusion. Speak the specified script once, no additional dialogue. The narration must fit the scene ideas without rushing or truncation.

MUSIC AND EFFECTS
An original instrumental76BPM score: intimate felt piano, a restrained plucked bass motif, occasional soft wooden brush taps. Distinct from electronic glass music and from a suspense score. Leave deliberate gaps at the two numerical deductions so the paper actions can be heard. Sync gentle paper unroll, printed-type taps, two dry paper peels, the three match-cut page accents and a closing binding click to visible contact. No repeated generic swoosh on every object. Music remains under the narrator, with a warm final chord decaying fully before36s. No vocals.

Only the listed Arabic text, values and VISION identity may be readable. No inherited source science labels, percentages, face photographs or recorder. All diagrams are illustrative, with mathematically correct shared scale. One complete film, four purposeful compositions; no montage of separate video generations.'''
},
'undo': {
 'title':'لماذا يحتاج «تراجع» إلى أكثر من الحذف؟', 'preset':'exploded-product', 'duration':34,
 'preview':'https://d2ol7oe51mr4n9.cloudfront.net/user_3DiY2MbHSIvzM3FG2DOgC6Cf2MM/9eb4a7a5-d79c-459a-8a8d-593e912aa7a3.mp4',
 'voice':'Male, deeper warm register, deliberate cinematic narration in neutral Modern Standard Arabic. Quiet suspense, crisp causal explanation, slowed decisive final phrase. Different from request voice.',
 'music':'72 BPM minimal piano and low string pulse; stretch into a drone for exploded view, reverse swell for undo, warm sustained final note. No watch ticking.',
 'departures':['Real watch replaced by explicitly fictional transaction assembly; no engineering or watch specifications transferred.','Pure black void replaced with high-key pearl-white studio and ink/cyan objects per VISION light preference.','One continuous route with four macro stops retained but retimed to34s and given stateful reversal rather than cosmetic reassembly.','User-requested MSA narration added, source operating watch sounds removed.','Audit trail survives reversal: reassembly must not imply deletion of history.'],
 'shots':[
  [0,4,'Complete transaction assembly and a single undo control.','زر صغير اسمه «تراجع». لكن إلغاء العملية يتطلب أكثر من حذفها.',['تراجع']],
  [4,7,'The transaction separates into four rigid semantic layers on one axis.','لنُفكّك ما يحدث عند تسجيل عملية بيع.',['تصوّر توضيحي']],
  [7,11.5,'Macro stock layer: one physicalitem exits8→7.','تخرج قطعة من المخزون، فتتغير الكمية.',['المخزون','8 → 7']],
  [11.5,15.5,'Macro invoice layer: create and preserve invoice0042.','وتُحفظ فاتورة جديدة تحمل تفاصيل العملية.',['الفاتورة','0042']],
  [15.5,20,'Macro sales layer: record sale+2500dinars.','ثم تُضاف قيمة البيع إلى التقارير.',['أثر البيع','+2 500 دج']],
  [20,24,'Macro history layer: recordtheaction with actorandtime.','وتبقى في السجل معلومات المستخدم ووقت التنفيذ.',['سجلّ التغييرات','10:42','أمين']],
  [24,31,'Reverse effects: stock7→8, saleeffect0; invoice0042stayscancelled and historygainsnewentry.','عند الإلغاء، تعود القطعة، ويُصحَّح أثر البيع. تبقى الفاتورة بحالة «ملغاة»، ويُسجَّل التغيير.',['7 → 8','0 دج','0042','ملغاة','10:44']],
  [31,34,'Lock assembled correctedstate withhistoryvisible andVISIONidentity.','هكذا نحسب أثر كل ضغطة.',['VISION','أثر كل ضغطة محسوب.']]
 ],
 'prompt':'''One complete34-second portrait9:16 cinematic motion explainer for VISION. One continuous unbroken camera take, no editorial cuts or dissolves. The hero is a fictional physical visualization of a software transaction, not a real machine or a wristwatch. Its ordered layers are stock, invoice, sales effect and audit history. Explain that cancelling a sale reverses its consequences while retaining a record.

DESIGN WORLD
High-key pearl-white studio, white-to-ice ambient light, ink-black ceramic structural edges and cyan#00BCEB data accents. No full dark-navy or black-void scenes. Rigid carefully machined illustrative components; believable roughness, fine bevels, selective focus and reflections, but no irrelevant gears or complexity for decoration. Four layers remain identifiable throughout: an eight-slot inventory tray, one upright invoice plate, a sales ledger rail, and a history strip with two possible record positions. All data are fictional. The components are the transaction's meaning, not hardware claims. Arabic typography is a clean bold geometric sans with proper joining and no letter spacing; callouts sit in clear reading positions and use one leader anchored to the actual component. Only one main callout at a time. Important content remains within portrait safe margins x90–950,y180–1600 at1080×1920.

CAMERA AND MOTION
Rigid layers separate only along one vertical axis, with ordered gaps and no morphing, disappearing parts or extra components. A speed ramp introduces slow separation, then the camera banks into the existing stack, using near edges for parallax. At each macro stop it brakes to sharp stillness, allows the state change to be understood and holds the callout before flying onward. Motion blur only during travel. No text wobble or unstable geometry. Preserve one continuous spatial route. Reassembly is motivated by an undo action and actual corrected state, not by a decorative explosion. The inventory, invoice, sales and history must remain causally linked even with titles hidden.

0.00–4.00 — THE SMALL CONTROL
Open on the complete transaction assembly, upright and comprehensible in a luminous studio. A camera push reveals a small recessed control «تراجع». It has not yet activated. Establish the stock tray's eight identical units and the empty record slots as parts of one object, without asking the viewer to read them all at once. A low-register male voice asks with controlled curiosity: «زر صغير اسمه «تراجع». لكن إلغاء العملية يتطلب أكثر من حذفها.» A short quiet pause follows the opening statement.

4.00–7.00 — REVEAL THE CONSEQUENCES
Time stretches into slow motion. The four layers separate along one vertical axis in their original order: stock tray, invoice plate, sales rail, history strip. They remain intact. The top rim briefly carries «تصوّر توضيحي» so the physical metaphor is explicit. A cyan impulse marking one sale enters the stack. Voice: «لنُفكّك ما يحدث عند تسجيل عملية بيع.». At7s the camera accelerates into the gap toward the inventory tray.

7.00–11.50 — INVENTORY MACRO
Brake at extreme macro distance to show the actual eight slots. One and only one unit leaves its slot along an established delivery path. The count changes from8to7 only after that unit departs; do not generate intermediate random numbers. One anchored callout reads «المخزون» and «8 → 7». Voice: «تخرج قطعة من المخزون، فتتغير الكمية.». Keep the seven remaining units visibly countable for a reading beat. Snap the callout away before camera travel.

11.50–15.50 — INVOICE MACRO
Bank through the same stack to the invoice plate. A record «0042» physically seats into an empty invoice slot. Use a thin leader attached to this plate and the single main callout «الفاتورة». Voice: «وتُحفظ فاتورة جديدة تحمل تفاصيل العملية.». Do not make the plate a real client invoice. The record must remain present for the rest of the film, including cancellation. Hold sharp, remove the callout, then whip along the existing rail.

15.50–20.00 — SALES-EFFECT MACRO
The sales rail receives one printed-value tile «+2 500 دج» with a precise mechanical snap; its label is «أثر البيع». The whole value is complete from its first readable frame. A travelling cyan marker confirms it once, then comes to rest. Voice: «ثم تُضاف قيمة البيع إلى التقارير.» Allow a brief quiet hold; do not count up or fill an arbitrary chart. Camera travels lower toward the existing history strip.

20.00–24.00 — HISTORY MACRO
The history strip records the operation with the fictional actor «أمين» and timestamp «10:42». Its main callout reads «سجلّ التغييرات». Focus racks from the actor record to the invoice0042still visible above, proving that they belong to the same operation. Voice lowers slightly: «وتبقى في السجل معلومات المستخدم ووقت التنفيذ.» Keep the phrase clear and let the final words land before undo begins. Pull out into a side view of the full stack without a cut.

24.00–31.00 — REVERSE EFFECTS, RETAIN HISTORY
The camera's return reveals the original «تراجع» control; it depresses once at24.3s. A reversed cyan impulse follows the known path. First the departed inventory unit returns to its exact empty slot, restoring7to8. Next the sales effect is neutralized, replacing«+2 500 دج» with«0 دج»; these values belong to this operation, not the business's entire revenue. The invoice0042does not vanish: a precise cyan status«ملغاة»attaches to it. The history strip gains a new entry«10:44»while preserving«10:42». Show these consequences sequentially with one focus at a time. The four layers then rejoin along the same axis, retaining the corrected values and both history entries. Voice: «عند الإلغاء، تعود القطعة، ويُصحَّح أثر البيع. تبقى الفاتورة بحالة «ملغاة»، ويُسجَّل التغيير.» Distinct physical sounds mark each restored slot and recorded event; no generic rewind deleting all information.

31.00–34.00 — RESOLUTION
Arc to a frontal hero view and lock the camera completely. The corrected assembly shows its persistent history strip through an open edge. Resolve the authentic VISION identity below it with «أثر كل ضغطة محسوب.» Voice concludes, clear and decisive rather than loud: «هكذا نحسب أثر كل ضغطة.» Finish by32.8s, then hold the state and lettering absolutely still until34s. No CTA, fade or appended scene.

OVERALL SOUNDSCAPE
One natural male narrator with a deeper, warm register, distinct from the curious technical voice in the request film. Modern Standard Arabic only; no Darija and no impersonation. Quiet opening suspense, patient causal phrases at the four macro stops, a modest rise during reversal, and a slowed final sentence. Speak only the specified lines, once in sequence. No universal speed multiplier. Stock has a dry ceramic seat sound; invoice has a soft paper-metal snap; sales rail has a short low tonal click; history has two crisp separate recording ticks. Time stretch uses a restrained reverse swell and brief hush. No watch ticking or borrowed watch sound identity. Voice always intelligible above effects.

NON-DIEGETIC MUSIC
Original72BPM cinematic minimalism: low bowed-string pulse and sparse piano, with a very restrained low drum. Stretch the pulse into a quiet drone during separation. Reduce it at macro reading holds. A reverse swell anticipates24.3s, followed by a purposeful three-part rhythmic resolution matching restored stock, financial reversal and preserved history. Resolve to one warm piano note beneath the final phrase; decay fully inside34s. No vocals, stock advertising beat or music reused from the other films.

Exact text only as specified; numerals and values do not mutate. Use the supplied VISION reference solely for brand identity. This is a custom transaction metaphor, not the source watch, no inherited mechanical specifications or brand names. One complete continuous film, not separate macro clips.'''
}
}

def save(p, data):
 p.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')

ROOT.mkdir(parents=True,exist_ok=True)
for id,f in films.items():
 target=ROOT/id;target.mkdir(exist_ok=True)
 prompt_path=SKILL/'references/source-prompts'/f"{f['preset']}.txt"
 source={
  'preset_id':f['preset'],'template_version':4,'source_prompt_path':str(prompt_path),
  'source_prompt_sha256':hashlib.sha256(prompt_path.read_bytes()).hexdigest(),
  'source_prompt_read_in_full':True,'adaptation_guide_read_in_full':True,
  'source_article':ARTICLE,'source_preview':f['preview'],
  'source_preview_playback_inspection':'not completed; local-gallery navigation denied by browser URL policy; public preview opened but media inspection timed out',
  'actual_film_generated':False,'departures':f['departures']
 }
 save(target/'source-record.json',source)
 # Keep all exact visible strings explicitly bound for the future generation.
 screen_inventory=list(dict.fromkeys(x for s in f['shots'] for x in s[4]))
 compiled_prompt=f['prompt']+'\n\nEXACT ON-SCREEN COPY INVENTORY\n'+'\n'.join(screen_inventory)+'\nAll numeric expressions use isolated left-to-right ordering inside Arabic layouts. Inventory strings appear only at their assigned phases, never all at once.\n'
 (target/'prompt.md').write_text(compiled_prompt,encoding='utf-8')
 shots=[{'start':a,'end':b,'action':action,'voiceover':vo,'screen_copy':copy} for a,b,action,vo,copy in f['shots']]
 save(target/'shot-map.json',shots)
 save(target/'exact-copy.json',{'language':'ar-MSA','narration':[s['voiceover'] for s in shots],'on_screen':list(dict.fromkeys(x for s in shots for x in s['screen_copy']))})
 save(target/'campaign.json',{
  'mode':'production','status':'creative_prompt_ready_connection_required','revision':2,
  'brand':'VISION','subject':f['title'],'preset_id':f['preset'],
  'requested_format':{'duration_s':f['duration'],'aspect_ratio':'9:16','delivery_dimensions':[1080,1920],'delivery_fps':30},
  'native_model_settings':None,'live_model_schema_verified':False,'requested_model_preference':'strongest suitable accessible Seedance via Higgsfield; must verify actual capability',
  'generation_strategy':'one_full_film_request','requested_audio':{'narration_language':'Modern Standard Arabic','voice_direction':f['voice'],'music_direction':f['music'],'synchronized_effects':True},
  'source_record':'source-record.json','prompt':'prompt.md','shot_map':'shot-map.json','exact_copy':'exact-copy.json',
  'assets':[{'path':str(BRAND/'VISION-logo.png'),'role':'identity-only brand reference','acquired_locally':True,'uploaded':False,'remote_media_id':None}],
  'requires_before_submission':['Higgsfield connection','live duration/aspect/audio/reference/schema checks','read-only cost/access estimate if supported','bind logo through supported upload role','inspect selected source preview playback'],
  'duration_policy':'Creative target only; native support not yet known. No automatic shortening, provider switching, or segmentation if unsupported.',
  'job_id':None,'submitted':False,'cost_estimate':None,'actual_charge':None,'result':None,
  'explicit_constraints':['Arabic Fusha only','distinct voice, music and delivery per topic','motion substantially stronger than prior version','no forced uniform fast pacing','no CTA','no private client data','retain old artifacts'],
  'departures':f['departures']
 })
 rows=['# Production review — '+f['title'],'','Status: creative treatment ready; no generation submitted. Model/account/cost not verified.','',
       '| Requirement | Planned evidence | Observed result | Status |','|---|---|---|---|']
 for s in shots:
  rows.append(f"| {s['start']}–{s['end']}s: {s['action']} | prompt.md and shot-map.json | No generated film | Not inspected |")
 rows += ['| Arabic wording and numeric geometry | exact-copy.json, narrated/visible values | No generated film | Not inspected |',
          '| Voice, music and effect sync | distinct audio direction in campaign.json | No generated audio | Not inspected |',
          '| Smooth motion and causal transitions | Full playback required, not just stills | No generated film | Not inspected |',
          '| Final export dimensions/fps/audio/hold | requested format, verify actual output | No generated film | Not inspected |','',
          'Default corrective scope: at most one corrective complete-film generation or supported targeted edit after inspection. Preserve original result. Do not fragment automatically.']
 (target/'review.md').write_text('\n'.join(rows)+'\n',encoding='utf-8')

save(ROOT/'production-status.json',{'date':'2026-10-28','skill_installed':str(SKILL),'skill_used_for':'three complete source-based creative prompts, shot maps, exact-copy inventories and review plans','higgsfield_connection_confirmed':False,'generated_new_media':False,'uploaded_assets':False,'paid_jobs_submitted':0,'film_ids':list(films),'next_action':'User installs/connects Higgsfield; then inspect model capabilities and generate each as one complete film within supported settings.'})

lines=['# VISION — المعالجة الجديدة للفيديوهات','',
'هذه ملفات تنفيذ جديدة مبنية على مهارة motion-design المطلوبة. **لم تُولَّد فيديوهات جديدة بعد**؛ ربط Higgsfield والتحقق من قدرات النموذج لم يكتملَا. النسخ السابقة محفوظة.','',
'اللغة المعتمدة: العربية الفصحى في الإلقاء والكتابة. لكل موضوع إخراج وصوت وموسيقى وإيقاع مستقل. جميع المدد أدناه أهداف إبداعية، وليست قدرات مؤكدة للنموذج.','',
'| الفيديو | المعالجة البصرية | الأداء الصوتي والموسيقى | المدة المستهدفة |','|---|---|---|---|',
'| رحلة الطلب | زجاج بصري ثلاثي الأبعاد؛ تتبع حزمة واحدة، مرور بين الطبقات، لقطات دقيقة ثم عودة التأكيد | رجل بصوت فضولي واضح؛ إيقاع إلكتروني112BPM مع توقفات |32ث |',
'| المبيعات والأرباح | ورق مطبوع وأرقام كبيرة؛ تفكيك حسابي بنسب صحيحة وانتقالات تطابق الأشكال | امرأة بصوت دافئ ومتأنٍ؛ بيانو مكتوم وإيقاع76BPM |36ث |',
'| التراجع | لقطة متصلة داخل طبقات العملية؛ تفكيك، تتبع الآثار، ثم عكسها مع حفظ السجل | رجل أعمق وأهدأ؛ توتر سينمائي72BPM وحلّ موسيقي |34ث |','',
'## النصوص الجديدة','']
for id,f in films.items():
 lines += ['### '+f['title'],'', '\n\n'.join(s[3] for s in f['shots']), '', f'التفاصيل الكاملة: [{id}/prompt.md]({id}/prompt.md).','']
lines += ['## التنفيذ بعد الربط','',
'1. التحقق من النموذج المتاح فعليًا، والمدة، والصوت العربي، ونسبة9:16، والتكلفة إن كانت أداة التقدير متاحة.',
'2. مراجعة تشغيل المراجع الأصلية؛ قراءة نصوصها لا تكفي للحكم على حركتها الفعلية.',
'3. إرفاق شعار VISION كمرجع هوية عبر الآلية المدعومة فقط.',
'4. إرسال كل فيديو كطلب واحد كامل، ثم مشاهدة النتيجة والاستماع إليها والتحقق من العربية والأرقام والحركة.',
'5. تصحيح محدد عند الحاجة؛ لا تقسيم تلقائي إلى مقاطع ولا استبدال التوليد بعارض محلي.','',
'المهارة: https://github.com/cth9191/motion-design','',
'المعلومات الإنتاجية، بصمات المصادر، الاختلافات المتعمدة وقوائم المراجعة محفوظة داخل مجلد كل فيديو.']
(ROOT/'README.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')

for id,f in films.items():
 assert f['shots'][0][0]==0 and f['shots'][-1][1]==f['duration']
 assert all(a[1]==b[0] for a,b in zip(f['shots'],f['shots'][1:]))
 assert '{{' not in f['prompt'] and '}}' not in f['prompt']
 words=sum(len(s[3].split()) for s in f['shots'])
 print(id, f['duration'], 'seconds;', words, 'Arabic narration words; timeline contiguous; no template placeholders')
