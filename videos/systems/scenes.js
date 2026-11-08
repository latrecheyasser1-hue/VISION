/* VISION — Systems film. Fictional diagrams and figures only. */
(() => {
  const inAt = (tl, sel, t, target, vars, delay) => tl.from(sel(target), { opacity: 0, duration: 0.75, ease: 'power3.out', ...vars }, t + delay);
  const head = (tl, sel, t) => {
    inAt(tl, sel, t, '.sys-eyebrow', { x: 35, duration: .55, ease: 'power2.out' }, .2);
    inAt(tl, sel, t, '.sys-title', { y: 42, duration: .9, ease: 'expo.out' }, .42);
    inAt(tl, sel, t, '.sys-lead', { y: 22, duration: .65, ease: 'sine.out' }, 1.02);
  };
  const barcode = Array.from({ length: 34 }, (_, i) => `<i style="width:${[4,2,6,3,2,5,2][i % 7]}px"></i>`).join('');
  const qr = Array.from({ length: 121 }, (_, i) => {
    const x = i % 11, y = Math.floor(i / 11);
    const finder = (ox, oy) => x >= ox && x < ox + 4 && y >= oy && y < oy + 4 && (x === ox || x === ox + 3 || y === oy || y === oy + 3 || (x === ox + 1 && y === oy + 1));
    const on = finder(0,0) || finder(7,0) || finder(0,7) || (x > 3 && y > 3 && (x * 7 + y * 5) % 9 < 4) || (x > 4 && y < 4 && (x + y) % 3 === 0) || (y > 4 && x < 4 && (x + 2 * y) % 4 === 0);
    return `<i class="${on ? 'on' : ''}"></i>`;
  }).join('');
  window.FILM = {
    id: 'systems',
    title: 'أنظمة الإدارة والبرامج المكتبية',
    css: `
      .sys-layout{color:#080E17;direction:rtl;grid-template-columns:.86fr 1.14fr;gap:70px;width:100%;height:100%;align-items:center}
      .sys-copy{position:relative;z-index:3;align-items:flex-start;text-align:right}
      .sys-eyebrow{color:#080E17;font-size:23px;font-weight:700;display:flex;gap:13px;align-items:center;letter-spacing:0}
      .sys-eyebrow:before{content:'';display:block;width:32px;height:5px;background:#00BCEB}
      .sys-title{font-size:79px!important;line-height:1.22!important;margin:0!important;font-weight:900;max-width:690px}
      .sys-title em{font-style:normal;color:#080E17;box-shadow:inset 0 -12px 0 rgba(0,188,235,.24)}
      .sys-lead{font-size:31px;line-height:1.7;margin:0;max-width:620px;font-weight:400}
      .sys-visual{height:620px;position:relative;direction:rtl;min-width:0}
      .sys-caption{font-size:22px;color:#080E17;opacity:.65;font-weight:400}
      .sys-number{font-family:'Dubai',sans-serif;font-variant-numeric:tabular-nums;direction:ltr;unicode-bidi:isolate}
      .sys-label{font-size:23px;font-weight:700}.sys-ico{display:flex;align-items:center;justify-content:center;color:#080E17}
      .sys-tag{display:inline-flex;align-items:center;gap:11px;border:1px solid #080E17;border-radius:99px;padding:9px 20px;font-size:22px;font-weight:500;background:#fff}
      .sys-tag:before{content:'';height:9px;width:9px;border-radius:50%;background:#00BCEB}
      .sys-gridline{position:absolute;inset:0;border:1px solid rgba(8,14,23,.1);border-radius:50%;pointer-events:none}
      .sys-question-visual{display:flex;flex-direction:column;justify-content:center;gap:24px}
      .sys-question{min-height:132px;display:grid;grid-template-columns:88px 1fr 78px;align-items:center;gap:22px;padding:22px 27px;background:#fff;border-bottom:2px solid #080E17;position:relative}
      .sys-question:nth-child(2){margin-right:55px}.sys-question:nth-child(3){margin-right:110px}
      .sys-question b{font-size:39px;font-weight:700}.sys-question .sys-q-index{font-size:23px;opacity:.4;justify-self:end}
      .sys-question .sys-ico{width:80px;height:80px;border-radius:24px;background:#080E17;color:#fff}
      .sys-question .sys-ico svg{stroke:#fff}
      .sys-q-line{position:absolute;width:5px;background:#00BCEB;right:67px;top:38px;bottom:38px;transform-origin:top;z-index:0}
      .sys-q-detail{font-size:23px;opacity:.65;margin-top:4px}.sys-q-foot{display:flex;justify-content:flex-end;gap:13px;align-items:center;margin-top:22px;font-size:24px}
      .sys-q-foot .sys-dot{width:14px;height:14px;background:#00BCEB;border-radius:50%}
      .sys-pos-shell{position:absolute;right:0;top:14px;width:640px;height:464px;border:10px solid #080E17;border-radius:28px;background:#fff;overflow:hidden;box-shadow:0 22px 0 rgba(8,14,23,.06)}
      .sys-pos-top{height:59px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(8,14,23,.16);padding:0 22px;font-size:22px;font-weight:700}
      .sys-pos-dots{display:flex;gap:7px}.sys-pos-dots i{width:7px;height:7px;background:#080E17;border-radius:50%;opacity:.3}
      .sys-pos-main{display:grid;grid-template-columns:1fr 1fr;padding:22px;gap:16px;direction:rtl}
      .sys-product{border:1px solid rgba(8,14,23,.16);border-radius:15px;padding:18px;display:flex;flex-direction:column;align-items:center;gap:11px;text-align:center}
      .sys-product-icon{height:65px;display:flex;align-items:center}.sys-product strong{font-size:26px}.sys-product span{font-size:23px;opacity:.7}
      .sys-pos-total{margin:0 22px;display:flex;justify-content:space-between;align-items:center;background:#080E17;color:#fff;padding:15px 20px;border-radius:13px;font-size:25px}
      .sys-pos-total strong{font-size:38px;color:#00BCEB;line-height:1}
      .sys-receipt{position:absolute;left:0;top:135px;width:275px;min-height:355px;background:#fff;padding:29px 25px 33px;box-shadow:0 18px 55px rgba(8,14,23,.13);border:1px solid rgba(8,14,23,.18);z-index:2;transform:rotate(-5deg)}
      .sys-receipt:after{content:'';position:absolute;height:14px;left:-1px;right:-1px;bottom:-9px;background:linear-gradient(135deg,#fff 25%,transparent 25%) -7px 0/14px 14px,linear-gradient(225deg,#fff 25%,transparent 25%) -7px 0/14px 14px}
      .sys-receipt-top{font-size:25px;text-align:center;font-weight:700;border-bottom:2px dashed rgba(8,14,23,.25);padding-bottom:14px;margin-bottom:17px}
      .sys-pay-row{font-size:23px;display:flex;justify-content:space-between;margin:12px 0}.sys-pay-row b{font-size:27px}
      .sys-pay-row:last-of-type{border-top:1px dashed rgba(8,14,23,.25);padding-top:15px}
      .sys-receipt-stamp{background:#00BCEB;color:#080E17;text-align:center;font-size:22px;font-weight:700;padding:8px;margin-top:18px;border-radius:6px}
      .sys-pos-notes{position:absolute;bottom:4px;right:10px;display:flex;gap:15px;align-items:center}.sys-pos-hint{position:absolute;bottom:7px;left:25px;font-size:22px;opacity:.65}
      .sys-stock-board{position:absolute;inset:20px 0 0;border-radius:26px;border:2px solid #080E17;background:#fff;overflow:hidden}
      .sys-stock-head{padding:25px 30px;display:flex;justify-content:space-between;border-bottom:1px solid rgba(8,14,23,.16);font-size:27px;font-weight:700}
      .sys-stock-head small{font-size:22px;opacity:.6;font-weight:400}
      .sys-stock-body{display:grid;grid-template-columns:240px 1fr;gap:26px;align-items:center;padding:32px 26px;direction:ltr}
      .sys-box{background:#080E17;color:#fff;position:relative;border-radius:14px;width:215px;height:205px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:15px}
      .sys-box .sys-box-id{font-size:22px;letter-spacing:2px;font-weight:700;color:#00BCEB}
      .sys-barcode{display:flex;align-items:stretch;justify-content:center;gap:3px;background:#fff;padding:13px 18px;height:83px;direction:ltr;width:max-content;border-radius:4px}
      .sys-barcode i{display:block;background:#080E17;height:100%}
      .sys-scan-line{position:absolute;left:20px;right:20px;height:3px;background:#00BCEB;top:94px;box-shadow:0 0 0 5px rgba(0,188,235,.12)}
      .sys-stock-ledger{direction:rtl;display:flex;flex-direction:column;gap:15px}
      .sys-ledger-row{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:rgba(8,14,23,.035);border-radius:9px;font-size:22px}
      .sys-ledger-row b{font-size:31px}.sys-ledger-row.active{background:#00BCEB;color:#080E17}
      .sys-validation{display:flex;align-items:center;gap:13px;padding:18px 26px;margin:0 26px;border-top:1px solid rgba(8,14,23,.2);font-size:25px}
      .sys-validation .sys-check{width:37px;height:37px;background:#080E17;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center}
      .sys-unknown{font-size:22px;display:flex;align-items:center;gap:12px;padding:17px 26px;margin:14px 26px 0;border:1px solid #080E17;border-radius:10px;background:#fff}
      .sys-unknown b{width:44px;height:44px;line-height:40px;flex-shrink:0;text-align:center;border-radius:50%;border:2px solid #080E17;direction:ltr}
      .sys-qr-frame{position:absolute;right:5px;top:30px;width:330px;height:450px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;border-radius:26px;background:#080E17;color:#fff}
      .sys-qr-frame h3{font-size:27px;margin:0;font-weight:500}.sys-qr-code{display:grid;grid-template-columns:repeat(11,1fr);gap:3px;background:#fff;padding:20px;width:230px;height:230px;border:3px solid #fff}
      .sys-qr-code i{background:#fff}.sys-qr-code i.on{background:#080E17}
      .sys-qr-refresh{display:flex;gap:12px;align-items:center;color:#00BCEB;font-size:24px}.sys-refresh-icon{font-size:35px;line-height:1}
      .sys-attendance{position:absolute;left:0;top:140px;width:430px;padding:25px;background:#fff;border:2px solid #080E17;border-radius:22px;box-shadow:0 20px 45px rgba(8,14,23,.09)}
      .sys-attendance h3{margin:0 0 20px;font-size:28px}.sys-att-row{display:grid;grid-template-columns:42px 1fr 90px;gap:12px;align-items:center;padding:15px 0;border-top:1px solid rgba(8,14,23,.13);font-size:23px}
      .sys-avatar{height:37px;width:37px;border-radius:50%;background:#080E17;color:#fff;font-size:18px;display:flex;align-items:center;justify-content:center}
      .sys-att-row b{font-weight:500;direction:ltr;color:#080E17}.sys-att-row.new .sys-avatar{background:#00BCEB;color:#080E17}
      .sys-att-notes{position:absolute;bottom:18px;right:15px;display:flex;gap:15px}.sys-att-caption{position:absolute;left:0;bottom:85px;font-size:22px;opacity:.6}
      .sys-env{height:100%;display:flex;flex-direction:column;justify-content:center;gap:26px}
      .sys-env-row{display:grid;grid-template-columns:150px 1fr;gap:28px;align-items:center;padding:28px 30px;border:2px solid #080E17;border-radius:22px;direction:rtl;background:#fff}
      .sys-env-row.offline{background:#080E17;color:#fff}.sys-env-row.offline .sys-env-icon{color:#00BCEB}
      .sys-env-icon{display:flex;align-items:center;justify-content:center}.sys-env-icon svg{width:95px;height:95px}
      .sys-env-row h3{font-size:37px;margin:0 0 10px;line-height:1.2}.sys-env-row p{font-size:26px;margin:0;line-height:1.6;font-weight:400}
      .sys-env-pills{display:flex;gap:11px;margin-top:16px}.sys-env-pills span{font-size:22px;padding:4px 15px;border:1px solid rgba(255,255,255,.35);border-radius:99px}
      .sys-env-row.web .sys-env-pills span{border-color:rgba(8,14,23,.3)}
      .sys-env-link{display:flex;justify-content:center;align-items:center;gap:18px;font-size:24px;font-weight:500}.sys-env-link:before,.sys-env-link:after{content:'';height:2px;background:#00BCEB;width:68px}
      .sys-final{width:100%;height:100%;display:grid;grid-template-columns:.95fr 1.05fr;gap:90px;align-items:center;direction:rtl;color:#080E17}
      .sys-final-copy{display:flex;flex-direction:column;align-items:flex-start;gap:27px}
      .sys-final-logo{display:flex;align-items:center;font-size:75px;font-weight:900;line-height:1;direction:ltr;gap:17px}
      .sys-final-logo svg{width:145px;height:auto}.sys-final-title{font-size:78px;font-weight:900;line-height:1.28;max-width:760px;margin:0}
      .sys-final-cta{background:#080E17;color:#fff;padding:18px 35px;border-radius:99px;display:flex;align-items:center;gap:20px;font-size:29px;font-weight:500}
      .sys-final-cta svg{color:#00BCEB;transform:rotate(180deg)}
      .sys-final-art{height:600px;position:relative;display:flex;align-items:center;justify-content:center}
      .sys-final-ring{position:absolute;width:440px;height:440px;border:1px solid rgba(8,14,23,.16);border-radius:50%}
      .sys-final-ring.r2{width:575px;height:575px;border-style:dashed;border-color:rgba(8,14,23,.12)}
      .sys-eye-core{background:#080E17;width:220px;height:220px;display:flex;align-items:center;justify-content:center;border-radius:50%;z-index:2;box-shadow:0 0 0 24px #fff}
      .sys-eye-core svg{width:145px;height:auto;color:#fff}
      .sys-final-node{position:absolute;display:flex;gap:12px;align-items:center;font-size:27px;font-weight:700;background:#fff;border:1px solid #080E17;padding:18px 27px;border-radius:14px;z-index:3}
      .sys-final-node.n1{top:6px;right:75px}.sys-final-node.n2{top:255px;left:0}.sys-final-node.n3{bottom:12px;right:55px}
      .sys-final-node .sys-node-dot{height:10px;width:10px;background:#00BCEB;border-radius:50%}
      .sys-final-note{font-size:25px;line-height:1.6;margin:0;max-width:660px;opacity:.7}
    `,
    scenes: [
      {
        key: 'questions', title: 'كل معلومة في مكانها', duration: 12,
        body: 'متابعة نشاطك تحتاج معلومات واضحة: ما الذي بِيع؟ ما المتوفّر؟ وما الذي ما زال يحتاج إلى متابعة؟',
        html: `<div class="split sys-layout"><div class="copy sys-copy"><div class="sys-eyebrow">أنظمة الإدارة</div><h1 class="sys-title">وضوح أكبر.<br>متابعة أسهل.</h1><p class="sys-lead">حلول تبدأ من الأسئلة التي تواجهها في يوم عملك.</p></div><div class="sys-visual sys-question-visual"><div class="sys-q-line"></div><div class="sys-question q1"><div class="sys-ico">${V.icon('cart',44)}</div><div><b>ما الذي بِيع؟</b><div class="sys-q-detail">المبيعات والدفعات</div></div><span class="sys-q-index sys-number">01</span></div><div class="sys-question q2"><div class="sys-ico">${V.icon('stock',44)}</div><div><b>ما المتوفّر؟</b><div class="sys-q-detail">السلع وحركة المخزون</div></div><span class="sys-q-index sys-number">02</span></div><div class="sys-question q3"><div class="sys-ico">${V.icon('check',44)}</div><div><b>أين وصلت العملية؟</b><div class="sys-q-detail">الحالة والخطوة التالية</div></div><span class="sys-q-index sys-number">03</span></div><div class="sys-q-foot"><span class="sys-dot"></span>معلومات تساعدك على المتابعة</div></div></div>`,
        animate: (tl,sel,t,d) => {
          head(tl,sel,t);
          inAt(tl,sel,t,'.sys-q-line',{scaleY:0,transformOrigin:'top',duration:1.8,ease:'power1.out'},1.4);
          inAt(tl,sel,t,'.q1',{x:-65,rotation:-2,duration:.8,ease:'expo.out'},1.65);
          inAt(tl,sel,t,'.q2',{x:-65,duration:.75,ease:'power3.out'},4);
          inAt(tl,sel,t,'.q3',{x:-65,rotation:2,duration:.9,ease:'power2.out'},6.4);
          inAt(tl,sel,t,'.sys-q-foot',{y:20,duration:.6,ease:'sine.out'},8.5);
          tl.to(sel('.sys-dot'),{scale:1.4,duration:1,ease:'sine.inOut',yoyo:true,repeat:1},t+9);
        }
      },
      {
        key:'pos',title:'البيع والديون',duration:14,
        body:'نطوّر برامج لتسجيل المبيعات، والحساب بالوزن أو القطعة، ومتابعة دفعات الزبائن، وطباعة الوصولات.',
        html:`<div class="split sys-layout"><div class="copy sys-copy"><div class="sys-eyebrow">البيع والدفعات</div><h1 class="sys-title">كل عملية،<br><em>بحسابها.</em></h1><p class="sys-lead">بالوزن أو القطعة، مع متابعة المبلغ المدفوع والمتبقّي.</p></div><div class="sys-visual"><div class="sys-pos-shell"><div class="sys-pos-top"><span>عملية بيع توضيحية</span><div class="sys-pos-dots"><i></i><i></i><i></i></div></div><div class="sys-pos-main"><div class="sys-product p1"><div class="sys-product-icon">${V.icon('box',58)}</div><strong>سلعة بالوزن</strong><span class="sys-number">0.50 kg</span></div><div class="sys-product p2"><div class="sys-product-icon">${V.icon('box',58)}</div><strong>سلعة بالقطعة</strong><span>قطعتان</span></div></div><div class="sys-pos-total"><span>المجموع</span><strong class="sys-number">1 200 <small style="font-size:22px">دج</small></strong></div></div><div class="sys-receipt"><div class="sys-receipt-top">وصل توضيحي</div><div class="sys-pay-row r1"><span>الإجمالي</span><b class="sys-number">1 200</b></div><div class="sys-pay-row r2"><span>المدفوع</span><b class="sys-number">800</b></div><div class="sys-pay-row r3"><span>المتبقّي</span><b class="sys-number">400</b></div><div class="sys-receipt-stamp">محفوظ في سجل الدفعات</div></div><div class="sys-pos-hint">الأرقام والواجهة للتوضيح</div><div class="sys-pos-notes"><span class="sys-tag">سجل الزبون</span><span class="sys-tag">طباعة الوصولات</span></div></div></div>`,
        animate:(tl,sel,t,d)=>{
          head(tl,sel,t);
          inAt(tl,sel,t,'.sys-pos-shell',{x:-70,scale:.94,duration:.95,ease:'expo.out'},1.5);
          inAt(tl,sel,t,'.sys-pos-top',{y:10,duration:.5,ease:'sine.out'},2.0);
          inAt(tl,sel,t,'.p1',{y:30,scale:.9,duration:.65,ease:'back.out(1.15)'},2.8);
          inAt(tl,sel,t,'.p2',{y:30,scale:.9,duration:.65,ease:'power3.out'},4.0);
          inAt(tl,sel,t,'.sys-pos-total',{scaleX:.7,transformOrigin:'right',duration:.6,ease:'power2.out'},5.2);
          inAt(tl,sel,t,'.sys-receipt',{y:-90,rotation:3,duration:1.1,ease:'expo.out'},6.4);
          inAt(tl,sel,t,'.r1',{x:15,duration:.5,ease:'sine.out'},7.3);
          inAt(tl,sel,t,'.r2',{x:15,duration:.5,ease:'power3.out'},8.1);
          inAt(tl,sel,t,'.r3',{x:15,duration:.5,ease:'power2.out'},9.0);
          inAt(tl,sel,t,'.sys-receipt-stamp',{scale:1.2,rotation:6,duration:.45,ease:'back.out(1.2)'},10.0);
          inAt(tl,sel,t,'.sys-pos-notes .sys-tag',{y:17,stagger:.15,duration:.55,ease:'sine.out'},10.8);
          inAt(tl,sel,t,'.sys-pos-hint',{duration:.5,ease:'power1.out'},11.4);
        }
      },
      {
        key:'inventory',title:'الباركود والمخزون',duration:12,
        body:'وحلولاً تستخدم الباركود لتسجيل السلع والتحقّق منها، وتسهيل عمليات الاستلام والجرد.',
        html:`<div class="split sys-layout"><div class="copy sys-copy"><div class="sys-eyebrow">الباركود والمخزون</div><h1 class="sys-title">امسح السلعة.<br><em>تابع حركتها.</em></h1><p class="sys-lead">استلام وجرد أوضح، مع التحقّق من المنتجات المسجّلة.</p></div><div class="sys-visual"><div class="sys-stock-board"><div class="sys-stock-head"><span>استلام السلع</span><small>واجهة توضيحية</small></div><div class="sys-stock-body"><div class="sys-box"><div class="sys-box-id">ITEM / 024</div><div class="sys-barcode">${barcode}</div><div class="sys-scan-line"></div></div><div class="sys-stock-ledger"><div class="sys-ledger-row active"><span>المنتج التجريبي</span><b class="sys-number">+1</b></div><div class="sys-ledger-row"><span>الكمية المستلمة</span><b class="sys-number">12</b></div><div class="sys-ledger-row"><span>مرجع العملية</span><b class="sys-number" style="font-size:24px">R-024</b></div></div></div><div class="sys-validation"><span class="sys-check">${V.icon('check',24)}</span><span>المنتج موجود في القائمة</span></div><div class="sys-unknown"><b>!</b><span>باركود غير معروف؟ يظهر تنبيه للتحقّق.</span></div></div></div></div>`,
        animate:(tl,sel,t,d)=>{
          head(tl,sel,t);
          inAt(tl,sel,t,'.sys-stock-board',{scale:.94,y:28,duration:.9,ease:'expo.out'},1.5);
          inAt(tl,sel,t,'.sys-stock-head',{x:20,duration:.55,ease:'sine.out'},1.8);
          inAt(tl,sel,t,'.sys-box',{x:-40,rotation:-4,duration:.75,ease:'power3.out'},2.6);
          inAt(tl,sel,t,'.sys-scan-line',{scaleX:0,transformOrigin:'center',duration:.35,ease:'power2.out'},3.5);
          tl.to(sel('.sys-scan-line'),{y:51,duration:.95,ease:'sine.inOut',repeat:1,yoyo:true},t+4);
          inAt(tl,sel,t,'.sys-ledger-row',{x:30,stagger:.22,duration:.6,ease:'power3.out'},4.2);
          inAt(tl,sel,t,'.sys-validation',{y:20,duration:.6,ease:'back.out(1.1)'},6.5);
          inAt(tl,sel,t,'.sys-unknown',{y:20,duration:.65,ease:'sine.out'},8.4);
          tl.to(sel('.sys-ledger-row.active'),{scale:1.035,duration:.55,ease:'sine.inOut',repeat:1,yoyo:true},t+7.4);
        }
      },
      {
        key:'attendance',title:'الحضور والعمليات الداخلية',duration:13,
        body:'وأنظمة داخلية لتنظيم الحضور أو إجراءات العمل، مع صلاحيات ومتابعة تناسب مسؤوليات المستخدمين.',
        html:`<div class="split sys-layout"><div class="copy sys-copy"><div class="sys-eyebrow">الحضور والعمليات الداخلية</div><h1 class="sys-title">المعلومة تصل<br>للمسؤول عنها.</h1><p class="sys-lead">سجلات واضحة وصلاحيات حسب الدور، من التسجيل إلى المتابعة.</p></div><div class="sys-visual"><div class="sys-qr-frame"><h3>تسجيل الحضور</h3><div class="sys-qr-code">${qr}</div><div class="sys-qr-refresh"><span class="sys-refresh-icon">↻</span><span>رمز متغيّر</span></div></div><div class="sys-attendance"><h3>سجل اليوم</h3><div class="sys-att-row a1"><span class="sys-avatar">أ</span><span>موظف تجريبي أ</span><b class="sys-number">08:00</b></div><div class="sys-att-row a2"><span class="sys-avatar">ب</span><span>موظف تجريبي ب</span><b class="sys-number">08:04</b></div><div class="sys-att-row a3 new"><span class="sys-avatar">ج</span><span>موظف تجريبي ج</span><b class="sys-number">08:07</b></div></div><div class="sys-att-caption">أسماء وأوقات توضيحية</div><div class="sys-att-notes"><span class="sys-tag">حسب الموقع</span><span class="sys-tag">حسب التاريخ</span></div></div></div>`,
        animate:(tl,sel,t,d)=>{
          head(tl,sel,t);
          inAt(tl,sel,t,'.sys-qr-frame',{y:40,scale:.9,duration:.9,ease:'expo.out'},1.7);
          inAt(tl,sel,t,'.sys-qr-frame h3',{y:12,duration:.6,ease:'power3.out'},2.1);
          inAt(tl,sel,t,'.sys-qr-code',{scale:.85,duration:.7,ease:'back.out(1.08)'},2.7);
          inAt(tl,sel,t,'.sys-qr-refresh',{y:10,duration:.55,ease:'sine.out'},3.5);
          tl.to(sel('.sys-refresh-icon'),{rotation:360,duration:1.2,ease:'power2.inOut'},t+5);
          inAt(tl,sel,t,'.sys-attendance',{x:-60,duration:.9,ease:'expo.out'},4.4);
          inAt(tl,sel,t,'.sys-attendance h3',{y:12,duration:.6,ease:'power2.out'},4.8);
          inAt(tl,sel,t,'.a1',{x:20,duration:.5,ease:'sine.out'},5.4);
          inAt(tl,sel,t,'.a2',{x:20,duration:.55,ease:'power3.out'},6.6);
          inAt(tl,sel,t,'.a3',{x:20,scale:.96,duration:.65,ease:'back.out(1.15)'},7.8);
          inAt(tl,sel,t,'.sys-att-notes .sys-tag',{y:22,stagger:.15,duration:.6,ease:'power2.out'},9.4);
          inAt(tl,sel,t,'.sys-att-caption',{duration:.6,ease:'sine.out'},10.2);
        }
      },
      {
        key:'environments',title:'بيئة العمل المناسبة',duration:14,
        body:'قد يكون الحل برنامجاً مكتبياً يعمل دون إنترنت، أو نظام ويب، أو يجمع بينهما عندما يتطلّب المشروع ذلك.',
        html:`<div class="split sys-layout"><div class="copy sys-copy"><div class="sys-eyebrow">حسب احتياج المشروع</div><h1 class="sys-title">الحل المناسب،<br><em>في بيئتك.</em></h1><p class="sys-lead">نختار طريقة التشغيل على أساس مكان العمل، الاتصال، والعمليات المطلوبة.</p></div><div class="sys-visual sys-env"><div class="sys-env-row offline"><div class="sys-env-icon">${V.icon('desktop',95)}</div><div><h3>برنامج مكتبي</h3><p>للعمل دون اتصال، عندما يكون ذلك مطلوباً.</p><div class="sys-env-pills"><span>بيع محلي</span><span>طباعة</span></div></div></div><div class="sys-env-link">أو نجمع بينهما حسب المشروع</div><div class="sys-env-row web"><div class="sys-env-icon">${V.icon('cloud',95)}</div><div><h3>نظام ويب</h3><p>وصول عبر أجهزة مختلفة، حسب الصلاحيات.</p><div class="sys-env-pills"><span>متابعة</span><span>تعاون</span></div></div></div></div></div>`,
        animate:(tl,sel,t,d)=>{
          head(tl,sel,t);
          inAt(tl,sel,t,'.offline',{x:-50,rotation:-1,duration:.85,ease:'expo.out'},1.7);
          inAt(tl,sel,t,'.offline .sys-env-icon',{scale:.7,duration:.65,ease:'back.out(1.1)'},2.2);
          inAt(tl,sel,t,'.offline h3',{x:25,duration:.55,ease:'power3.out'},2.5);
          inAt(tl,sel,t,'.offline p',{y:18,duration:.6,ease:'sine.out'},3.2);
          inAt(tl,sel,t,'.offline .sys-env-pills span',{scale:.85,stagger:.1,duration:.5,ease:'power2.out'},4.1);
          inAt(tl,sel,t,'.web',{x:-50,duration:.85,ease:'expo.out'},5.4);
          inAt(tl,sel,t,'.web .sys-env-icon',{scale:.7,duration:.65,ease:'back.out(1.1)'},6);
          inAt(tl,sel,t,'.web h3',{x:25,duration:.55,ease:'power3.out'},6.3);
          inAt(tl,sel,t,'.web p',{y:18,duration:.6,ease:'sine.out'},7);
          inAt(tl,sel,t,'.web .sys-env-pills span',{scale:.85,stagger:.1,duration:.5,ease:'power2.out'},7.9);
          inAt(tl,sel,t,'.sys-env-link',{scaleX:.8,duration:.8,ease:'power3.out'},9.3);
        }
      },
      {
        key:'cta',title:'على مقاس نشاطك',duration:10,
        body:'ننطلق من احتياجك لنحدّد الوظائف المناسبة. VISION، حلول برمجية على مقاس نشاطك. حدّثنا عن مشروعك.',
        html:`<div class="sys-final"><div class="sys-final-copy"><div class="sys-final-logo">${V.logo()}</div><h1 class="sys-final-title">نبرمج لك نظاماً<br>يناسب متطلباتك.</h1><p class="sys-final-note">من فهم الاحتياج إلى تحديد الوظائف المناسبة لنشاطك.</p><div class="sys-final-cta">حدّثنا عن مشروعك ${V.icon('arrow',34)}</div></div><div class="sys-final-art"><div class="sys-final-ring r1"></div><div class="sys-final-ring r2"></div><div class="sys-eye-core">${V.eye('#fff','#00BCEB')}</div><div class="sys-final-node n1"><span class="sys-node-dot"></span>طريقة عملك</div><div class="sys-final-node n2"><span class="sys-node-dot"></span>احتياجاتك</div><div class="sys-final-node n3"><span class="sys-node-dot"></span>نظامك</div></div></div>`,
        animate:(tl,sel,t,d)=>{
          inAt(tl,sel,t,'.sys-final-logo',{y:22,duration:.75,ease:'expo.out'},.2);
          inAt(tl,sel,t,'.sys-final-title',{y:36,duration:.9,ease:'power3.out'},.65);
          inAt(tl,sel,t,'.sys-final-note',{x:25,duration:.65,ease:'sine.out'},1.5);
          inAt(tl,sel,t,'.sys-final-ring',{scale:.7,stagger:.15,duration:1.1,ease:'power2.out'},.6);
          inAt(tl,sel,t,'.sys-eye-core',{scale:.55,rotation:-8,duration:1.0,ease:'back.out(1.1)'},1.2);
          inAt(tl,sel,t,'.n1',{y:35,duration:.7,ease:'expo.out'},2.3);
          inAt(tl,sel,t,'.n2',{x:-35,duration:.7,ease:'power3.out'},3.4);
          inAt(tl,sel,t,'.n3',{y:-30,duration:.7,ease:'sine.out'},4.5);
          inAt(tl,sel,t,'.sys-final-cta',{x:35,scale:.95,duration:.75,ease:'power2.out'},5.7);
          tl.to(sel('.sys-final-ring.r2'),{rotation:30,duration:8,ease:'none'},t+1.2);
          tl.to(sel('.sys-eye-core'),{scale:1.035,duration:1.4,ease:'sine.inOut',repeat:1,yoyo:true},t+6);
        }
      }
    ]
  };
})();

