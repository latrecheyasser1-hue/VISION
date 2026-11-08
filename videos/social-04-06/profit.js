(() => {
  const digits = (value, extra = '') => `<span class="pf-odometer ${extra}" aria-label="${value}">${[...value].map((c, i) => c === ' ' ? '<span class="pf-space"></span>' : `<span class="pf-slot"><span class="pf-reel"><b>${(Number(c) + 7 + i) % 10}</b><b>${(Number(c) + 3) % 10}</b><b>${c}</b></span></span>`).join('')}</span>`;
  const blocks = (total, cost) => Array.from({ length: total }, (_, i) => `<i class="pf-block ${i < cost ? 'pf-deduct' : 'pf-keep'}"></i>`).join('');
  const note = '<div class="pf-note" dir="rtl">أرقام افتراضية • مثال مبسّط<br>قبل أي تكاليف أو ضرائب أخرى.</div>';
  const top = (n, title) => `<div class="pf-mast"><span>VISION / SYSTEMS</span><span>05.${n}</span></div><h2 class="pf-heading" dir="rtl">${title}</h2>`;
  const enter = (tl, node, at, props = {}) => tl.from(node, { opacity: 0, y: 50, duration: .42, ease: 'expo.out', ...props }, at);
  const roll = (tl, node, at, duration = .64) => {
    enter(tl, node, at, { y: 35, duration: .3 });
    tl.fromTo(node.querySelectorAll('.pf-reel'), { yPercent: 0 }, { yPercent: -66.6666667, duration, stagger: .025, ease: 'power3.out' }, at);
  };
  const intro = (tl, el, t) => {
    enter(tl, el.querySelector('.pf-mast'), t + .12, { y: -20, ease: 'power2.out' });
    enter(tl, el.querySelector('.pf-heading'), t + .17, { y: 90, rotation: -2, duration: .52 });
    enter(tl, el.querySelector('.pf-note'), t + .4, { y: 12, ease: 'sine.out' });
  };

  window.STORY = {
    id: 'profit',
    css: `
      .pf-scene{width:100%;height:100%;box-sizing:border-box;display:flex;flex-direction:column;padding:185px 130px 320px 90px;background:#f5fbfd;color:#080e17;position:relative;overflow:hidden;font-family:Dubai,sans-serif;isolation:isolate}
      .pf-scene *{box-sizing:border-box}.pf-scene h2,.pf-scene p{margin:0}.pf-mast{display:flex;justify-content:space-between;align-items:center;direction:ltr;font:24px/1.2 Consolas,monospace;color:#526771;border-bottom:2px solid #080e1720;padding-bottom:24px;margin-bottom:42px}
      .pf-heading{font-size:90px;line-height:1.08;font-weight:700;text-align:right;min-height:192px;position:relative;z-index:4}.pf-heading em{font-style:normal;color:#00a4cf}
      .pf-theatre{position:relative;flex:1;min-height:0;width:100%}.pf-note{font-size:34px;line-height:1.35;color:#4d626d;text-align:center;margin-top:26px;flex-shrink:0;position:relative;z-index:10}
      .pf-number{font:700 172px/1.05 Consolas,monospace;letter-spacing:-10px;direction:ltr;font-variant-numeric:tabular-nums;white-space:nowrap}.pf-odometer{display:inline-flex;direction:ltr;height:1.05em;vertical-align:middle;letter-spacing:0}.pf-slot{display:block;width:.59em;height:1.05em;overflow:hidden}.pf-reel{display:block;will-change:transform}.pf-reel b{display:block;height:1.05em;line-height:1.05em;font-weight:inherit}.pf-space{width:.18em}.pf-unit{font:32px/1 Consolas,monospace;letter-spacing:0;color:#4d626d;display:block;margin-top:12px}.pf-label{font-size:47px;font-weight:700;line-height:1.1}.pf-mono{font-family:Consolas,monospace;direction:ltr;font-variant-numeric:tabular-nums}.pf-hairline{height:2px;background:#080e1720}
      .pf-blockline{display:flex;direction:ltr;gap:7px;perspective:1100px;position:relative;height:190px;transform-style:preserve-3d}.pf-block{display:block;flex:1;min-width:0;height:100%;border-radius:9px;background:#00bceb;box-shadow:0 14px 0 #008fb5,0 35px 30px #0076951a;position:relative;transform-origin:50% 100%;will-change:transform}.pf-block:before{content:'';position:absolute;inset:10px 8px auto;height:4px;border-radius:4px;background:#ffffff85}.pf-deduct{background:#080e17;box-shadow:0 14px 0 #3e4b54,0 35px 30px #080e1712}.pf-rail{position:absolute;left:0;right:0;height:2px;background:#080e1729;bottom:-45px}.pf-tick{position:absolute;width:2px;height:24px;background:#080e1750;bottom:-56px}.pf-tick:first-of-type{left:0}.pf-tick:last-of-type{right:0}
      .pf-s1{background:#fff}.pf-s1 .pf-heading{font-size:116px;min-height:140px;text-align:center}.pf-hook-total{position:absolute;top:20px;left:0;width:100%;text-align:center}.pf-hook-total .pf-number{font-size:186px}.pf-hook-total .pf-label{margin-top:22px;color:#526771;font-weight:400}.pf-not-equal{position:absolute;top:325px;left:calc(50% - 92px);width:184px;height:178px;transform:rotate(-6deg)}.pf-eq-line{position:absolute;width:178px;height:22px;left:3px;background:#080e17;border-radius:2px}.pf-eq-line:first-child{top:48px}.pf-eq-line:nth-child(2){top:104px}.pf-slash{position:absolute;left:79px;top:0;width:25px;height:180px;background:#00bceb;transform:rotate(29deg)}.pf-hook-answer{position:absolute;top:555px;left:0;width:100%;text-align:center;font-size:100px;line-height:1.05;font-weight:700;direction:rtl}.pf-hook-answer em{font-style:normal;color:#00a4cf}.pf-hook-bar{position:absolute;top:750px;left:0;width:100%;height:95px}.pf-hook-bar .pf-blockline{height:95px}
      .pf-s2 .pf-heading,.pf-s3 .pf-heading{font-size:88px}.pf-start{position:absolute;left:0;top:0;width:100%;display:flex;justify-content:space-between;align-items:center;gap:24px;direction:rtl}.pf-start .pf-number{font-size:84px;letter-spacing:-4px}.pf-start .pf-unit{font-size:24px;display:inline;margin-left:10px}.pf-start .pf-label{font-size:42px;color:#526771;font-weight:400}.pf-cut-amount{position:absolute;top:190px;left:0;display:flex;flex-direction:column;align-items:flex-start;gap:10px}.pf-cut-amount .pf-number{font-size:92px;letter-spacing:-5px}.pf-cut-amount .pf-label{font-size:40px;color:#526771;font-weight:400}.pf-split{position:absolute;left:0;right:0;top:400px}.pf-result{position:absolute;top:690px;left:0;right:0;text-align:center}.pf-result .pf-label{font-size:42px;color:#526771;font-weight:400;margin-bottom:18px}.pf-result .pf-number{font-size:166px;color:#008daf}.pf-s3 .pf-cut-amount{left:auto;right:0;align-items:flex-end}.pf-s3 .pf-result{top:690px}.pf-minus{font:700 70px/1 Consolas;color:#080e17;vertical-align:middle;margin-right:16px}.pf-s2 .pf-cut-amount .pf-number,.pf-s3 .pf-cut-amount .pf-number{display:flex;align-items:center;gap:0}
      .pf-s4{background:#eaf8fc}.pf-s4 .pf-heading{font-size:90px}.pf-ledger{position:absolute;top:12px;left:0;width:100%;background:#fff;border:2px solid #080e1712;border-radius:22px;padding:32px 45px 40px;box-shadow:0 30px 0 #b2e7f4;transform:perspective(1400px) rotateX(4deg);transform-origin:50% 50%;overflow:hidden}.pf-ledger-head{display:flex;justify-content:space-between;align-items:center;direction:rtl;font-size:34px;color:#526771;border-bottom:2px solid #ddeaf0;padding:4px 0 26px}.pf-ledger-head svg{width:64px;height:42px}.pf-entry{display:flex;align-items:center;justify-content:space-between;gap:20px;direction:rtl;padding:36px 0;border-bottom:2px solid #e2edf1}.pf-entry-label{font-size:44px;white-space:nowrap}.pf-entry-value{font:700 73px/1.1 Consolas,monospace;direction:ltr;white-space:nowrap;letter-spacing:-4px}.pf-entry-cost .pf-entry-value,.pf-entry-expense .pf-entry-value{color:#526771}.pf-entry-result{border:0;background:#c6f2fc;margin:25px -20px 0;padding:32px 20px;border-radius:12px}.pf-entry-result .pf-entry-value{font-size:92px;color:#007d9f}.pf-entry-result .pf-entry-label{font-size:46px;font-weight:700}.pf-ledger-note{font-size:38px;text-align:center;direction:rtl;position:absolute;top:800px;left:0;right:0}.pf-ledger-guide{position:absolute;top:138px;left:15px;width:5px;height:405px;background:#00bceb;transform-origin:50% 0}.pf-ledger-scan{position:absolute;width:100%;height:3px;background:#00bceb;left:0;top:130px;box-shadow:0 0 30px #00bceb}
      .pf-ledger-note{top:880px}
      .pf-s5{background:#fff}.pf-s5 .pf-heading{font-size:89px}.pf-field{position:absolute;top:10px;left:0;width:100%;height:205px;border:3px solid #b0c6ce;border-radius:18px;padding:24px 38px;display:flex;align-items:center;justify-content:space-between;direction:rtl;background:#f5fbfd;box-shadow:0 12px 0 #e9f2f5}.pf-field-label{font-size:42px;line-height:1.2}.pf-field-label small{display:block;font-size:29px;color:#526771;font-weight:400;margin-top:14px}.pf-field-number{font:700 86px/1.1 Consolas,monospace;direction:ltr;position:relative;width:335px;height:100px;display:flex;justify-content:center;align-items:center}.pf-field-empty{position:absolute;inset:0;display:flex;justify-content:center;align-items:center;color:#849da7;letter-spacing:9px}.pf-field-filled{position:absolute;inset:0;display:flex;justify-content:center;align-items:center}.pf-data-link{position:absolute;top:229px;left:calc(50% - 2px);width:4px;height:112px;background:#c5dbe2;transform-origin:top}.pf-data-dot{position:absolute;top:230px;left:calc(50% - 10px);width:20px;height:20px;background:#00bceb;border-radius:50%}.pf-chart{position:absolute;top:370px;left:45px;right:45px;height:490px;border-bottom:3px solid #080e17;direction:ltr}.pf-chart-bar{position:absolute;left:70px;bottom:0;width:225px;height:390px;background:#00bceb;border-radius:12px 12px 0 0;transform-origin:bottom;box-shadow:16px 0 0 #b3ebf9}.pf-chart-shadow{position:absolute;left:70px;bottom:0;width:225px;height:390px;border:3px dashed #b0c6ce;border-bottom:0;border-radius:12px 12px 0 0;background:repeating-linear-gradient(135deg,transparent 0,transparent 14px,#e2eff4 14px,#e2eff4 16px)}.pf-chart-value{position:absolute;right:0;top:80px;font:700 110px/1.1 Consolas,monospace;direction:ltr;width:380px;height:135px;letter-spacing:-7px}.pf-chart-before,.pf-chart-after{position:absolute;left:0;top:0}.pf-chart-after{color:#008daf}.pf-chart-state{position:absolute;right:0;top:235px;width:380px;font-size:42px;line-height:1.2;text-align:center;direction:rtl}.pf-state-old,.pf-state-new{position:absolute;inset:0}.pf-state-old{color:#697f89}.pf-state-new{color:#007d9f;font-weight:700}.pf-chart-check{position:absolute;right:150px;top:350px;width:65px;height:65px;color:#008daf}.pf-chart-check svg{width:65px;height:65px}.pf-chart-axis{position:absolute;left:0;bottom:-50px;font:27px Consolas;color:#526771}.pf-chart-caption{position:absolute;left:0;right:0;bottom:-85px;font-size:34px;text-align:center;color:#526771;direction:rtl}
      .pf-s6{padding:180px 90px 290px;justify-content:center;align-items:center;background:#f0fbfe}.pf-brand{display:flex;align-items:center;justify-content:center;position:relative;z-index:3}.pf-brand .brand-lockup{display:flex;flex-direction:column;align-items:center;gap:42px;direction:ltr}.pf-brand .brand-eye{width:330px;height:208px}.pf-brand .brand-word{font:900 144px/1 Arial,sans-serif;letter-spacing:-7px}.pf-brand-line{width:500px;height:4px;background:#00bceb;margin-top:55px;transform-origin:50% 50%}.pf-brand-frame{position:absolute;width:780px;height:780px;border:2px solid #00bceb22;border-radius:50%;top:calc(50% - 440px);left:150px}
    `,
    scenes: [
      {
        html: `<div class="pf-scene pf-s1">${top('01', 'بعت…')}<div class="pf-theatre"><div class="pf-hook-total"><div class="pf-number">${digits('100 000')}<span class="pf-unit">DA</span></div><div class="pf-label" dir="rtl">مبيعات</div></div><div class="pf-not-equal"><i class="pf-eq-line"></i><i class="pf-eq-line"></i><i class="pf-slash"></i></div><div class="pf-hook-answer">ماشي كامل <em>ربح.</em></div><div class="pf-hook-bar"><div class="pf-blockline">${blocks(10, 0)}</div></div></div>${note}</div>`,
        animate(tl, el, t, d, hit) {
          const q = s => el.querySelector(s);
          intro(tl, el, t);
          roll(tl, q('.pf-hook-total .pf-odometer'), t + .22, .73);
          enter(tl, q('.pf-unit'), t + .45, { y: 15, ease: 'power2.out' });
          enter(tl, q('.pf-hook-total .pf-label'), t + .6, { y: 20, ease: 'power2.out' });
          hit(t + .35, 'impact', .75);
          tl.from(q('.pf-hook-total'), { scale: 1.15, duration: .85, ease: 'expo.out' }, t + .2);
          el.querySelectorAll('.pf-eq-line').forEach((n, i) => enter(tl, n, t + d * .34 + i * .09, { x: i ? 170 : -170, y: 0, ease: 'power4.out' }));
          enter(tl, q('.pf-slash'), t + d * .68, { scaleY: 0, y: -60, duration: .32, ease: 'back.out(1.7)' });
          hit(t + d * .68, 'click', .8);
          enter(tl, q('.pf-hook-answer'), t + d * .72, { y: 100, scale: .86, ease: 'back.out(1.2)', duration: .5 });
          el.querySelectorAll('.pf-block').forEach((n, i) => {
            enter(tl, n, t + d * .78 + i * .025, { y: 110, rotationX: -80, duration: .4, ease: 'back.out(1.3)' });
          });
          hit(t + d * .72, 'pop', .7);
          tl.to(q('.pf-not-equal'), { rotation: 3, scale: 1.08, duration: d * .28, ease: 'sine.inOut' }, t + d * .68);
        }
      },
      {
        html: `<div class="pf-scene pf-s2">${top('02', 'نحّيو <em>تكلفة</em><br>السلعة.')}<div class="pf-theatre"><div class="pf-start"><div class="pf-label">المبيعات</div><div class="pf-number pf-mono">100 000<span class="pf-unit">DA</span></div></div><div class="pf-cut-amount"><div class="pf-label" dir="rtl">تكلفة السلعة</div><div class="pf-number"><span class="pf-minus">−</span>${digits('60 000')}</div></div><div class="pf-split"><div class="pf-blockline">${blocks(10, 6)}<span class="pf-rail"></span><span class="pf-tick"></span><span class="pf-tick"></span></div></div><div class="pf-result"><div class="pf-label" dir="rtl">يبقى قبل المصاريف</div><div class="pf-number">${digits('40 000')}<span class="pf-unit">DA</span></div></div></div>${note}</div>`,
        animate(tl, el, t, d, hit) {
          const q = s => el.querySelector(s);
          intro(tl, el, t);
          enter(tl, q('.pf-start'), t + .18, { y: -25, ease: 'power3.out' });
          el.querySelectorAll('.pf-block').forEach((n, i) => enter(tl, n, t + .25 + i * .025, { x: 100, y: 40, rotationX: 25, duration: .45, ease: 'expo.out' }));
          enter(tl, q('.pf-cut-amount .pf-label'), t + d * .25, { x: -55, y: 0, ease: 'power3.out' });
          enter(tl, q('.pf-minus'), t + d * .29, { x: -60, y: 0, duration: .3, ease: 'power2.out' });
          roll(tl, q('.pf-cut-amount .pf-odometer'), t + d * .29);
          tl.fromTo(el.querySelectorAll('.pf-deduct'), { backgroundColor: '#00bceb', boxShadow: '0 14px 0 #008fb5' }, { backgroundColor: '#080e17', boxShadow: '0 14px 0 #3e4b54', duration: .25, stagger: .025, ease: 'power1.inOut' }, t + d * .39);
          tl.to(el.querySelectorAll('.pf-deduct'), { y: -105, opacity: .3, rotationX: 15, duration: .6, stagger: .035, ease: 'power3.inOut' }, t + d * .43);
          tl.to(el.querySelectorAll('.pf-keep'), { y: 25, duration: .45, stagger: .035, ease: 'back.out(1.3)' }, t + d * .47);
          hit(t + d * .44, 'whoosh', .7, -.35);
          enter(tl, q('.pf-rail'), t + d * .51, { scaleX: 0, y: 0, duration: .4, ease: 'power2.out' });
          el.querySelectorAll('.pf-tick').forEach(n => enter(tl, n, t + d * .54, { scaleY: 0, y: 0, ease: 'power2.out' }));
          enter(tl, q('.pf-result .pf-label'), t + d * .59, { y: 35, ease: 'power3.out' });
          roll(tl, q('.pf-result .pf-odometer'), t + d * .62);
          enter(tl, q('.pf-result .pf-unit'), t + d * .68, { y: 10, ease: 'power2.out' });
          hit(t + d * .65, 'impact', .6);
        }
      },
      {
        html: `<div class="pf-scene pf-s3">${top('03', 'ومن بعد…<br><em>مصاريف</em> النشاط.')}<div class="pf-theatre"><div class="pf-start"><div class="pf-label">قبل المصاريف</div><div class="pf-number pf-mono">40 000<span class="pf-unit">DA</span></div></div><div class="pf-cut-amount"><div class="pf-label" dir="rtl">مصاريف نفس الفترة</div><div class="pf-number"><span class="pf-minus">−</span>${digits('15 000')}</div></div><div class="pf-split"><div class="pf-blockline">${blocks(8, 3)}<span class="pf-rail"></span><span class="pf-tick"></span><span class="pf-tick"></span></div></div><div class="pf-result"><div class="pf-label" dir="rtl">المتبقّي في هذا المثال</div><div class="pf-number">${digits('25 000')}<span class="pf-unit">DA</span></div></div></div>${note}</div>`,
        animate(tl, el, t, d, hit) {
          const q = s => el.querySelector(s);
          intro(tl, el, t);
          enter(tl, q('.pf-start'), t + .18, { x: 50, y: 0, ease: 'power3.out' });
          el.querySelectorAll('.pf-block').forEach((n, i) => enter(tl, n, t + .25 + i * .025, { x: -100, y: 25, rotationX: 25, duration: .45, ease: 'expo.out' }));
          enter(tl, q('.pf-cut-amount .pf-label'), t + .44, { x: 55, y: 0, ease: 'power3.out' });
          enter(tl, q('.pf-minus'), t + .54, { x: -60, y: 0, duration: .3, ease: 'power2.out' });
          roll(tl, q('.pf-cut-amount .pf-odometer'), t + .54);
          tl.fromTo(el.querySelectorAll('.pf-deduct'), { backgroundColor: '#00bceb', boxShadow: '0 14px 0 #008fb5' }, { backgroundColor: '#080e17', boxShadow: '0 14px 0 #3e4b54', duration: .25, stagger: .04, ease: 'power1.inOut' }, t + d * .37);
          tl.to(el.querySelectorAll('.pf-deduct'), { y: -105, opacity: .3, rotationX: 15, duration: .55, stagger: .045, ease: 'power3.inOut' }, t + d * .43);
          tl.to(el.querySelectorAll('.pf-keep'), { y: 25, duration: .45, stagger: .03, ease: 'back.out(1.3)' }, t + d * .48);
          enter(tl, q('.pf-rail'), t + d * .51, { scaleX: 0, y: 0, duration: .4, ease: 'power2.out' });
          el.querySelectorAll('.pf-tick').forEach(n => enter(tl, n, t + d * .54, { scaleY: 0, y: 0, ease: 'power2.out' }));
          enter(tl, q('.pf-result .pf-label'), t + d * .57, { y: 35, ease: 'power3.out' });
          roll(tl, q('.pf-result .pf-odometer'), t + d * .62);
          enter(tl, q('.pf-result .pf-unit'), t + d * .68, { y: 10, ease: 'power2.out' });
          hit(t + d * .43, 'whoosh', .7, -.25);
          hit(t + d * .66, 'success', .65);
        }
      },
      {
        html: `<div class="pf-scene pf-s4">${top('04', 'النظام يجمع<br><em>الصورة.</em>')}<div class="pf-theatre"><div class="pf-ledger"><div class="pf-ledger-head"><span>نفس الفترة. نفس الحساب.</span>${V.eye()}</div><div class="pf-ledger-guide"></div><div class="pf-entry pf-entry-sales"><span class="pf-entry-label">المبيعات</span><span class="pf-entry-value">100 000</span></div><div class="pf-entry pf-entry-cost"><span class="pf-entry-label">تكلفة السلعة</span><span class="pf-entry-value">− 60 000</span></div><div class="pf-entry pf-entry-expense"><span class="pf-entry-label">المصاريف</span><span class="pf-entry-value">− 15 000</span></div><div class="pf-entry pf-entry-result"><span class="pf-entry-label">المتبقّي</span><span class="pf-entry-value">${digits('25 000')}</span></div><div class="pf-ledger-scan"></div></div><div class="pf-ledger-note" dir="rtl">حسب البيانات المسجّلة.</div></div>${note}</div>`,
        animate(tl, el, t, d, hit) {
          const q = s => el.querySelector(s);
          intro(tl, el, t);
          enter(tl, q('.pf-ledger'), t + .2, { y: 180, scale: .8, rotationX: 16, rotationZ: -3, duration: .62, ease: 'expo.out' });
          enter(tl, q('.pf-ledger-head'), t + .45, { y: 25, ease: 'power3.out' });
          ['sales', 'cost', 'expense'].forEach((name, i) => {
            const at = t + d * (.19 + i * .16);
            enter(tl, q('.pf-entry-' + name), at, { x: i % 2 ? -340 : 340, y: 0, duration: .45, ease: 'power4.out' });
            hit(at + .22, 'click', .55, i % 2 ? -.3 : .3);
          });
          enter(tl, q('.pf-ledger-guide'), t + d * .25, { scaleY: 0, y: 0, duration: d * .42, ease: 'power2.inOut' });
          enter(tl, q('.pf-ledger-scan'), t + d * .55, { scaleX: 0, y: 0, duration: .2, ease: 'power3.out' });
          tl.to(q('.pf-ledger-scan'), { y: 500, duration: d * .18, ease: 'power2.inOut' }, t + d * .57);
          tl.to(q('.pf-ledger-scan'), { opacity: 0, duration: .2, ease: 'power2.out' }, t + d * .75);
          enter(tl, q('.pf-entry-result'), t + d * .66, { y: 80, scale: .92, duration: .48, ease: 'back.out(1.1)' });
          roll(tl, q('.pf-entry-result .pf-odometer'), t + d * .69, .45);
          enter(tl, q('.pf-ledger-note'), t + d * .77, { y: 30, ease: 'power3.out' });
          tl.to(q('.pf-ledger'), { rotationX: 0, rotationZ: 0, scale: 1.02, duration: d * .38, ease: 'sine.inOut' }, t + d * .59);
          hit(t + d * .58, 'scan', .45);
          hit(t + d * .72, 'success', .55);
        }
      },
      {
        html: `<div class="pf-scene pf-s5">${top('05', 'الرقم الصح…<br>يحتاج بيانات <em>كاملة.</em>')}<div class="pf-theatre"><div class="pf-field"><div class="pf-field-label">المصاريف<small>نفس الفترة</small></div><div class="pf-field-number"><span class="pf-field-empty">— — —</span><span class="pf-field-filled">${digits('15 000')}</span></div></div><div class="pf-data-link"></div><div class="pf-data-dot"></div><div class="pf-chart"><div class="pf-chart-shadow"></div><div class="pf-chart-bar"></div><div class="pf-chart-value"><span class="pf-chart-before">40 000</span><span class="pf-chart-after">${digits('25 000')}</span></div><div class="pf-chart-state"><div class="pf-state-old">صورة ناقصة</div><div class="pf-state-new">بعد تسجيل المصاريف</div></div><div class="pf-chart-check">${V.icon('check', 65)}</div><span class="pf-chart-axis">DA</span><div class="pf-chart-caption">الحساب يتغيّر كي تكتمل البيانات.</div></div></div>${note}</div>`,
        animate(tl, el, t, d, hit) {
          const q = s => el.querySelector(s);
          intro(tl, el, t);
          enter(tl, q('.pf-field'), t + .2, { y: -80, scale: .92, duration: .5, ease: 'expo.out' });
          enter(tl, q('.pf-data-link'), t + .5, { scaleY: 0, y: 0, duration: .45, ease: 'power2.out' });
          enter(tl, q('.pf-chart'), t + .4, { y: 80, duration: .5, ease: 'power3.out' });
          enter(tl, q('.pf-chart-bar'), t + .52, { scaleY: 0, y: 0, duration: .6, ease: 'back.out(1.1)' });
          enter(tl, q('.pf-chart-shadow'), t + d * .24, { y: 0, duration: .25, ease: 'power2.out' });
          tl.to(q('.pf-field'), { borderColor: '#00bceb', boxShadow: '0 12px 0 #c8f1fb', duration: .25, ease: 'power2.out' }, t + d * .4);
          tl.to(q('.pf-field-empty'), { y: -35, opacity: 0, duration: .2, ease: 'power3.in' }, t + d * .43);
          enter(tl, q('.pf-field-filled'), t + d * .45, { y: 30, duration: .3, ease: 'power3.out' });
          roll(tl, q('.pf-field-filled .pf-odometer'), t + d * .45, .48);
          enter(tl, q('.pf-data-dot'), t + d * .49, { scale: 0, y: 0, duration: .18, ease: 'back.out(1.8)' });
          tl.to(q('.pf-data-dot'), { y: 120, duration: d * .12, ease: 'power2.inOut' }, t + d * .51);
          tl.to(q('.pf-data-dot'), { opacity: 0, scale: .4, duration: .18, ease: 'power2.out' }, t + d * .64);
          tl.to(q('.pf-chart-bar'), { scaleY: .625, duration: .65, ease: 'power3.inOut' }, t + d * .63);
          tl.to(q('.pf-chart-before'), { y: -70, opacity: 0, duration: .3, ease: 'power3.in' }, t + d * .63);
          enter(tl, q('.pf-chart-after'), t + d * .66, { y: 55, duration: .4, ease: 'power3.out' });
          roll(tl, q('.pf-chart-after .pf-odometer'), t + d * .66, .5);
          tl.to(q('.pf-state-old'), { y: -25, opacity: 0, duration: .2, ease: 'power2.in' }, t + d * .65);
          enter(tl, q('.pf-state-new'), t + d * .7, { y: 25, duration: .35, ease: 'power3.out' });
          enter(tl, q('.pf-chart-check'), t + d * .78, { scale: .25, rotation: -20, y: 0, duration: .38, ease: 'back.out(2)' });
          enter(tl, q('.pf-chart-caption'), t + d * .81, { y: 15, duration: .3, ease: 'power2.out' });
          hit(t + d * .43, 'click', .75);
          hit(t + d * .57, 'scan', .45);
          hit(t + d * .72, 'success', .6);
        }
      },
      {
        html: `<div class="pf-scene pf-s6"><div class="pf-brand-frame"></div><div class="pf-brand">${V.logo()}</div><div class="pf-brand-line"></div></div>`,
        animate(tl, el, t, d) {
          const q = s => el.querySelector(s);
          enter(tl, q('.pf-brand'), t + .06, { scale: .88, y: 25, duration: Math.min(.43, d * .36), ease: 'expo.out' });
          enter(tl, q('.pf-brand-frame'), t + .08, { scale: .75, y: 0, duration: Math.min(.65, d * .6), ease: 'power3.out' });
          enter(tl, q('.pf-brand-line'), t + .2, { scaleX: 0, y: 0, duration: Math.min(.4, d * .35), ease: 'power3.out' });
        }
      }
    ]
  };
})();
