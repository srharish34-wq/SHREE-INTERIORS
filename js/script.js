/* Shree Desire Groups — v3 scripts */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const fine = matchMedia('(hover:hover)').matches;

  // Preloader
  addEventListener('load', () => setTimeout(() => $('#preloader').classList.add('hidden'), 900));

  // Scroll: header, progress, back-to-top, parallax blobs
  const header = $('#header'), bar = $('#progress'), toTop = $('#toTop'), pars = $$('[data-par]');
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('sc', y > 20);
    toTop.classList.toggle('show', y > 500);
    bar.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    pars.forEach(p => { const r = p.parentElement.getBoundingClientRect(); p.style.transform = `translateY(${(r.top - innerHeight / 2) * p.dataset.par}px)`; });
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Cursor glow + magnetic buttons + tilt (desktop)
  if (fine) {
        $$('[data-magnet]').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
      b.addEventListener('mouseleave', () => b.style.transform = '');
    });
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }

  // Mobile menu
  const burger = $('#burger'), nav = $('#nav');
  const closeMenu = () => { nav.classList.remove('open'); burger.classList.remove('x'); document.body.style.overflow = ''; };
  burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.classList.toggle('x', o); document.body.style.overflow = o ? 'hidden' : ''; });
  $$('#nav a').forEach(a => a.addEventListener('click', closeMenu));

  // Hero slider
  const slides = $$('.slide'), dots = $('#dots'); let cur = 0, timer;
  slides.forEach((_, i) => { const b = document.createElement('button'); b.setAttribute('aria-label', 'Slide ' + (i + 1)); b.onclick = () => { go(i); restart(); }; dots.appendChild(b); });
  function go(n) { cur = (n + slides.length) % slides.length; slides.forEach((s, i) => s.classList.toggle('on', i === cur)); $$('button', dots).forEach((d, i) => d.classList.toggle('on', i === cur)); }
  const restart = () => { clearInterval(timer); timer = setInterval(() => go(cur + 1), 6500); };
  $('#next').onclick = () => { go(cur + 1); restart(); }; $('#prev').onclick = () => { go(cur - 1); restart(); };
  let sx = 0; const hero = $('#banner');
  hero.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  hero.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) { go(cur + (d < 0 ? 1 : -1)); restart(); } });
  go(0); restart();

  // Reveal + counters
  const count = el => {
    const end = +el.dataset.count, t0 = performance.now();
    const tick = t => { const p = Math.min((t - t0) / 1800, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target; t.classList.add('in');
    setTimeout(() => t.classList.add('done'), 1300);
    $$('[data-count]', t).forEach(count);
    io.unobserve(t);
  }), { threshold: .15 });
  $$('[data-r]').forEach(el => io.observe(el));

  // How-we-work tabs
  $$('.tab').forEach(t => t.onclick = () => { $$('.tab').forEach(x => x.classList.toggle('on', x === t)); $$('.panel').forEach(p => p.classList.toggle('on', p.id === t.dataset.tab)); });

  // Before / after slider
  const ba = $('#ba'); ba.querySelector('input').addEventListener('input', e => ba.style.setProperty('--p', e.target.value + '%'));

  // Gallery filter + lightbox
  $$('.f').forEach(b => b.onclick = () => {
    $$('.f').forEach(x => x.classList.toggle('on', x === b));
    $$('#gal figure').forEach(f => f.classList.toggle('hide', b.dataset.f !== 'all' && f.dataset.c !== b.dataset.f));
  });
  const lb = document.createElement('div'); lb.className = 'lightbox'; lb.innerHTML = '<img alt="">'; document.body.appendChild(lb);
  $$('#gal img').forEach(i => i.onclick = () => { $('img', lb).src = i.src; lb.classList.add('open'); });
  lb.onclick = () => lb.classList.remove('open');

  // FAQ
  $$('.q').forEach(q => q.onclick = () => { const it = q.parentElement, was = it.classList.contains('open'); $$('.qa').forEach(i => i.classList.remove('open')); it.classList.toggle('open', !was); });

  // EMI calculator
  const amt = $('#amt'), rate = $('#rate'), yrs = $('#yrs'), inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
  function emi() {
    const P = amt.value * 1e5, r = rate.value / 1200, n = yrs.value * 12, e = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    $('#vAmt').textContent = amt.value + ' Lakhs'; $('#vRate').textContent = rate.value + '%'; $('#vYrs').textContent = yrs.value + ' years';
    $('#emiVal').textContent = inr(e); $('#emiTot').textContent = 'Total payable ' + inr(e * n);
  }
  [amt, rate, yrs].forEach(i => i.addEventListener('input', emi)); emi();

  // Enquiry popup (sends to WhatsApp; swap for your backend or Formspree if you prefer email)
  const modal = $('#enquiryModal'), form = $('#enquiryForm'), thanks = $('.thanks', modal); let last;
  const open = () => { last = document.activeElement; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); setTimeout(() => $('input', modal).focus(), 350); };
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); last && last.focus(); };
  $$('[data-open-enquiry]').forEach(b => b.addEventListener('click', open));
  $$('[data-close]').forEach(b => b.addEventListener('click', close));
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { close(); lb.classList.remove('open'); } });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form)), q = encodeURIComponent;
    const msg = `New enquiry from website%0AName: ${q(d.name)}%0APhone: ${q(d.phone)}%0AEmail: ${q(d.email || '-')}%0AInterested in: ${q(d.interest)}%0AMessage: ${q(d.message || '-')}`;
    open_wa(msg); form.reset(); thanks.hidden = false; setTimeout(() => { thanks.hidden = true; close(); }, 3500);
  });
  const bf = $('#bookForm');
  bf.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(bf)), q = encodeURIComponent;
    open_wa(`Call back request%0AName: ${q(d.name)}%0APhone: ${q(d.phone)}%0AService: ${q(d.service)}`);
    bf.reset(); const t = $('.bthanks', bf); t.hidden = false; setTimeout(() => t.hidden = true, 4000);
  });
  function open_wa(msg) { window.open('https://wa.me/918939200583?text=' + msg, '_blank', 'noopener'); }
})();

/* ===== Client reviews: 3D carousel ===== */
(() => {
  /* SAMPLE REVIEWS: these are placeholder examples written for layout and design.
     Replace each entry with a REAL review from your own clients (with their permission) before you publish. */
  const REVIEWS = [
    { name: 'Ramesh Kumar', place: 'Avadi', service: 'Plot Buyer', rating: 5, text: 'Clear documents, honest advice and no pressure at all. We chose our plot with confidence and registration was smooth.' },
    { name: 'Priya Suresh', place: 'Pattabiram', service: 'Interiors', rating: 5, text: 'They understood our taste and budget in the very first meeting. The living room and kitchen turned out even better than the 3D design.' },
    { name: 'Karthikeyan R.', place: 'Thiruninravur', service: 'Villa Construction', rating: 5, text: 'Our 2 BHK villa was handed over on schedule. The site team kept us updated every week and answered every question.' },
    { name: 'Divya Mohan', place: 'Paruthipattu', service: 'Plot Buyer', rating: 5, text: 'As first-time buyers we had many doubts. The team patiently explained everything and helped with the bank loan papers.' },
    { name: 'Suresh Babu', place: 'Poonamallee', service: 'Solar', rating: 5, text: 'Solar installation was quick and neat. Our electricity bill has come down and they guided us on the subsidy process.' },
    { name: 'Lakshmi Narayanan', place: 'Thirumullaivoyal', service: 'Interiors', rating: 5, text: 'Modular kitchen and wardrobes finished with great quality. The designer suggested smart storage ideas we had not thought of.' },
    { name: 'Arun Prakash', place: 'Melpakkam', service: 'Villa Construction', rating: 4, text: 'Quality materials, neat finishing and a fair estimate with no surprise costs later. Happy with the result.' },
    { name: 'Meena Rajan', place: 'Avadi', service: 'Plot Buyer', rating: 5, text: 'Approved layout, good roads and street lights, exactly what the team promised during the site visit.' },
    { name: 'Vignesh S.', place: 'Pattabiram', service: 'Interiors', rating: 5, text: 'Our office interior was completed on time and the whole team loves it. Professional from design to handover.' },
    { name: 'Anitha Selvam', place: 'Arakkonam', service: 'Plot Buyer', rating: 5, text: 'Honest people to deal with. They guided my family through the registration step by step.' },
    { name: 'Mohammed Ismail', place: 'Ambattur', service: 'RO Water Purifier', rating: 5, text: 'The RO purifier was installed the same week we called. The water tastes great and the service team responds quickly.' },
    { name: 'Gayathri Ramesh', place: 'Paruthipattu', service: 'Interiors', rating: 5, text: 'From the first sketch to the final handover the process was transparent. Highly recommended for home interiors.' },
    { name: 'Senthil Kumar', place: 'Thiruninravur', service: 'Plot Buyer', rating: 4, text: 'I bought a plot for my family\u2019s future home. The team kept every promise they made on the site visit.' },
    { name: 'Revathi Balaji', place: 'Avadi', service: 'Villa Construction', rating: 5, text: 'They built our home on our own plot. Good communication throughout and the finishing is very neat.' },
    { name: 'Dinesh Raj', place: 'Poonamallee', service: 'Solar', rating: 5, text: 'A complete solar solution for our small workshop. Installation was professional and the after-sales support has been reliable.' },
    { name: 'Sumathi Venkat', place: 'Pattabiram', service: 'Interiors', rating: 5, text: 'Beautiful pooja unit and false ceiling work. The carpenters were skilled and kept the house tidy every day.' },
    { name: 'Balamurugan T.', place: 'Thirumullaivoyal', service: 'Plot Buyer', rating: 4, text: 'Good value for money. The plot rates suited our budget and the loan guidance saved us a lot of running around.' },
    { name: 'Nirmala Devi', place: 'Avadi', service: 'RO Water Purifier', rating: 5, text: 'Prompt installation and a clear explanation of maintenance. Very happy with the service.' },
    { name: 'Harish Kumar', place: 'Melpakkam', service: 'Villa Construction', rating: 5, text: 'Our family moved in right on time. Thank you to the whole team for a stress-free experience.' },
    { name: 'Shalini Prabhu', place: 'Paruthipattu', service: 'Interiors', rating: 5, text: 'Smart use of space in our 1 BHK. The designer gave us practical ideas that fit our budget.' }
  ];

  const stage = document.getElementById('rvStage'), count = document.getElementById('rvCount'), fill = document.getElementById('rvBarFill');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const N = REVIEWS.length, reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  let active = 0, timer, dragging = false, moved = false, sx = 0;

  // twinkling stars
  const sb = document.getElementById('rvStars');
  for (let i = 0; i < 26; i++) {
    const s = document.createElement('span'); s.className = 'rv-star'; s.textContent = '\u2605';
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;font-size:${8 + Math.random() * 12}px;animation-delay:${Math.random() * 4}s;animation-duration:${3 + Math.random() * 3}s`;
    sb.appendChild(s);
  }

  stage.innerHTML = REVIEWS.map((r, i) => `<article class="rv-card c${i % 4 + 1}" aria-label="Review ${i + 1} of ${N}">
    <div class="rv-medal" aria-hidden="true"><div><i>\u2605</i><b>HAPPY<br>CLIENT</b></div></div>
    <span class="rv-quote" aria-hidden="true">\u201C</span>
    <div class="rv-rate" aria-label="${r.rating} out of 5 stars">${'\u2605'.repeat(r.rating)}${'\u2606'.repeat(5 - r.rating)}</div>
    <p class="rv-text">\u201C${esc(r.text)}\u201D</p>
    <div class="rv-who"><span class="rv-av">${esc(r.name.trim().charAt(0))}</span><div><b>${esc(r.name)}</b><small>${esc(r.service)} \u00B7 ${esc(r.place)}</small></div></div>
  </article>`).join('');
  const cards = [...stage.children];

  function layout() {
    const w = innerWidth, cw = cards[0].offsetWidth;
    const step = w < 600 ? cw * .46 : w < 900 ? cw * .55 : cw * .62, maxVis = w < 600 ? 1 : w < 900 ? 2 : 3;
    cards.forEach((c, i) => {
      let d = i - active; if (d > N / 2) d -= N; if (d < -N / 2) d += N;
      const a = Math.abs(d), vis = a <= maxVis;
      c.style.transform = `translateX(-50%) translateX(${d * step}px) translateZ(${-a * 90}px) rotateY(${d * 24}deg) scale(${1 - a * .05})`;
      c.style.zIndex = 100 - a; c.style.opacity = vis ? (a === 0 ? 1 : 1 - a * .12) : 0; c.style.pointerEvents = vis ? 'auto' : 'none';
      c.classList.toggle('on', a === 0); c.setAttribute('aria-hidden', a === 0 ? 'false' : 'true');
    });
    count.textContent = `${active + 1} / ${N}`; fill.style.width = ((active + 1) / N * 100) + '%';
  }
  const go = n => { active = (n + N) % N; layout(); };
  const restart = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go(active + 1), 4500); };
  document.getElementById('rvNext').onclick = () => { go(active + 1); restart(); };
  document.getElementById('rvPrev').onclick = () => { go(active - 1); restart(); };

  // click a side card to bring it forward
  cards.forEach((c, i) => c.addEventListener('click', () => { if (!moved && i !== active) { go(i); restart(); } }));

  // drag / swipe
  stage.addEventListener('pointerdown', e => { dragging = true; moved = false; sx = e.clientX; clearInterval(timer); });
  addEventListener('pointermove', e => { if (dragging && Math.abs(e.clientX - sx) > 8) moved = true; });
  addEventListener('pointerup', e => {
    if (!dragging) return; dragging = false;
    const dx = e.clientX - sx; if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
    restart(); setTimeout(() => moved = false, 0);
  });
  stage.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { go(active + 1); restart(); } if (e.key === 'ArrowLeft') { go(active - 1); restart(); } });
  stage.addEventListener('mouseenter', () => clearInterval(timer)); stage.addEventListener('mouseleave', restart);

  // only autoplay while on screen
  new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? restart() : clearInterval(timer))).observe(stage);
  addEventListener('resize', layout); layout();
})();

/* ===== Floating contact buttons ===== */
(() => {
  const fab = document.getElementById('fab'), toggle = document.getElementById('fabToggle');
  if (!fab) return;
  // staggered slide-in after the page has loaded
  [...fab.querySelectorAll('.fab-btn')].forEach((b, i) => b.style.setProperty('--i', i));
  const start = () => setTimeout(() => fab.classList.add('ready'), 600);
  document.readyState === 'complete' ? start() : addEventListener('load', start);
  // collapse / expand on phones
  toggle.addEventListener('click', () => {
    const closed = fab.classList.toggle('closed');
    toggle.setAttribute('aria-expanded', String(!closed));
    toggle.setAttribute('aria-label', closed ? 'Show quick contact buttons' : 'Hide quick contact buttons');
    if (!closed) { fab.classList.remove('ready'); void fab.offsetWidth; fab.classList.add('ready'); }
  });
  // start collapsed on small screens so it never covers content
  if (matchMedia('(max-width:700px)').matches) { fab.classList.add('closed'); toggle.setAttribute('aria-expanded', 'false'); }
})();


/* ===== Real estate sections: flyer gallery, layout plan pins, checklist, converter, area map (self-contained) ===== */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const fine = matchMedia('(hover:hover)').matches;

  // Scroll reveal
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const t = e.target;
    t.classList.add('re-in'); setTimeout(() => t.classList.add('re-done'), 1300); io.unobserve(t);
  }), { threshold: .15 });
  $$('[data-re]').forEach(el => io.observe(el));
  if (fine) $$('.rt[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-6px)`; });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  /* ---------- Lightbox (flyers + full plan) ---------- */
  const lb = document.createElement('div');
  lb.className = 're-lb'; lb.innerHTML = '<button class="lb-x" aria-label="Close">×</button><button class="lb-p" aria-label="Previous">‹</button><button class="lb-n" aria-label="Next">›</button><div class="re-lb-box"><img alt=""></div><div class="re-lb-cap"></div>';
  document.body.appendChild(lb);
  let list = [], cur = 0;
  const show = i => { cur = (i + list.length) % list.length; $('img', lb).src = list[cur][0]; $('img', lb).alt = list[cur][1]; $('.re-lb-cap', lb).textContent = list[cur][1] + (list.length > 1 ? `  (${cur + 1} / ${list.length})` : ''); lb.classList.remove('zoomed'); };
  const open = (l, i) => { list = l; show(i); $('.lb-p', lb).style.display = $('.lb-n', lb).style.display = l.length > 1 ? '' : 'none'; lb.classList.add('open'); };
  const close = () => lb.classList.remove('open', 'zoomed');
  $('.lb-x', lb).onclick = close; $('.lb-p', lb).onclick = () => show(cur - 1); $('.lb-n', lb).onclick = () => show(cur + 1);
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('re-lb-box')) close(); });
  $('img', lb).addEventListener('click', () => lb.classList.toggle('zoomed'));
  addEventListener('keydown', e => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1); });
  const FLYERS = [['images/skandhan-grand-launch.jpg', 'Skandhan Nivas: Grand Launch'], ['images/skandhan-banner-1.jpg', 'Skandhan Nivas: location and offers'], ['images/skandhan-banner-2.jpg', 'Skandhan Nivas: villa and plot options'], ['images/skandhan-plots-offer.jpg', 'Skandhan Nivas: plots, 2 BHK and bank loan']];
  $$('[data-gal]').forEach(b => b.addEventListener('click', () => open(FLYERS, +b.dataset.gal)));
  $$('[data-plan]').forEach(b => b.addEventListener('click', () => open([['images/gomathi-layout-plan.jpg', 'Gomathi Amman Nagar: approved layout plan (tap to zoom)']], 0)));

  /* Optional price chips for Skandhan Nivas. Leave empty if you prefer not to show prices on the page,
     because your three flyers show slightly different numbers. Example: plot: 'Plots from \u20B926 Lakhs' */
  const PRICES = { plot: '', villa: '' };
  const pr = $('#rsPrices'); if (pr) pr.innerHTML = Object.values(PRICES).filter(Boolean).map(p => `<span>${p}</span>`).join('');

  /* ---------- Layout plan pins ---------- */
  const INFO = {
    p1: ['Park 1', 'An open green space marked within the layout.'], p2: ['Park 2', 'A central green space in the middle of the layout.'], p3: ['Park 3', 'A green space marked at the southern end of the layout.'],
    r1: ['32\u203210\u2033 wide road', 'One of the main internal roads, shown on the approved plan.'], r2: ['30\u2032 wide road', 'A 30 ft internal road running through the layout.'], r3: ['27\u2032 wide road', 'A 27 ft internal road serving the plots.']
  };
  const info = $('#rgInfo');
  function pick(k) {
    $$('.rg-pin').forEach(p => p.classList.toggle('on', p.dataset.k === k)); $$('#rgLegend button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
    info.innerHTML = `<h4>${INFO[k][0]}</h4><p>${INFO[k][1]}</p>`; info.classList.remove('swap'); void info.offsetWidth; info.classList.add('swap');
  }
  $$('.rg-pin,#rgLegend button').forEach(b => b.addEventListener('click', () => pick(b.dataset.k)));

  /* ---------- Buyer's checklist ---------- */
  const items = $$('.rk');
  if (items.length) {
    const arc = $('#rkArc'), num = $('#rkNum'), msg = $('#rkMsg'), C = 326.7, N = items.length;
    const MSG = ['Start ticking to track your progress.', 'Good start. Keep going.', 'Nice progress.', 'You are on your way.', 'Halfway there.', 'More than halfway.', 'Almost done.', 'Just one more to check.', 'All checked! Talk to our team to confirm each one.'];
    const update = () => { const n = items.filter(b => b.getAttribute('aria-pressed') === 'true').length; arc.style.strokeDashoffset = C * (1 - n / N); num.textContent = n; msg.textContent = MSG[n]; };
    items.forEach(b => b.addEventListener('click', () => { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); update(); }));
    $('#rkReset').addEventListener('click', () => { items.forEach(b => b.setAttribute('aria-pressed', 'false')); update(); });
    update();
  }

  /* ---------- Plot size converter ---------- */
  const val = $('#rcVal'), unit = $('#rcUnit');
  if (val && unit) {
    const TO = { sqft: 1, sqm: 10.7639, cent: 435.6, ground: 2400 };
    const fmt = n => n.toLocaleString('en-IN', { maximumFractionDigits: n < 10 ? 3 : 2 });
    const tiles = { sqft: $('#rcSqft'), sqm: $('#rcSqm'), cent: $('#rcCent'), ground: $('#rcGround') }, shown = { sqft: 0, sqm: 0, cent: 0, ground: 0 };
    const tween = (k, to) => { const from = shown[k], t0 = performance.now(); const step = t => { const p = Math.min((t - t0) / 450, 1); tiles[k].textContent = fmt(from + (to - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); else shown[k] = to; }; requestAnimationFrame(step); };
    const calc = () => {
      const sq = Math.max(0, parseFloat(val.value) || 0) * TO[unit.value];
      Object.keys(tiles).forEach(k => tween(k, sq / TO[k]));
      $('#rcBar').style.width = Math.min(sq / 6000 * 100, 100) + '%';
      $('#rcNote').textContent = sq === 0 ? 'Enter a plot size above.' : sq < 750 ? 'Smaller than our minimum plot size of 750 sq ft.' : sq === 750 ? 'This is our smallest plot size.' : `About ${fmt(sq / 750)} times our smallest plot (750 sq ft).`;
      $$('#rcChips button').forEach(b => b.classList.toggle('on', +b.dataset.v === +val.value && b.dataset.u === unit.value));
    };
    [val, unit].forEach(el => el.addEventListener('input', calc));
    $$('#rcChips button').forEach(b => b.addEventListener('click', () => { val.value = b.dataset.v; unit.value = b.dataset.u; calc(); }));
    calc();
  }

  /* ---------- Area explorer (map). Edit this list to match your projects ---------- */
  const rl = $('#rmList');
  if (rl) {
    const AREAS = [
      { name: 'Avadi', q: 'Avadi, Chennai', p: [['Skandhan Nivas', 'Ongoing'], ['Thandral Nagar', 'Ongoing'], ['Apple City', 'Completed']] },
      { name: 'Pattabiram', q: 'Pattabiram, Chennai', p: [['O Town', 'Completed'], ['Shang Shanmugam Nagar', 'Completed'], ['Shaitanya Avenue', 'Completed']] },
      { name: 'Thiruninravur', q: 'Thiruninravur, Chennai', p: [['Highway Lane', 'Ongoing']] },
      { name: 'Vandalur\u2013Minjur ORR', q: 'Vandalur Minjur Outer Ring Road, Chennai', p: [['Jabakishan Nagar', 'Ongoing'], ['Skandhan Nivas (near the ORR)', 'Ongoing']] },
      { name: 'Paruthipattu', q: 'Paruthipattu, Chennai', p: [['Royal Nest', 'Completed'], ['Sai Garden', 'Completed']] },
      { name: 'Thirumullaivoyal', q: 'Thirumullaivoyal, Chennai', p: [['Venkateshwaram Nagar', 'Completed']] },
      { name: 'Arakkonam', q: 'Arakkonam, Tamil Nadu', p: [['Elite Avenue', 'Completed']] },
      { name: 'Thiruvallur (Thirupachur)', q: 'Thirupachur, Thiruvallur', p: [['Gomathi Amman Nagar', 'Ongoing']] }
    ];
    const q = encodeURIComponent, esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    rl.innerHTML = AREAS.map((a, i) => `<button role="tab" data-i="${i}">${esc(a.name)}<small>${a.p.length}</small></button>`).join('');
    const card = $('.rm-card');
    const go = i => {
      const a = AREAS[i]; $$('button', rl).forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i); });
      $('#rmName').textContent = a.name;
      $('#rmProj').innerHTML = a.p.map(([n, s]) => `<li>${esc(n)}<em class="${s === 'Completed' ? 'done' : ''}">${s}</em></li>`).join('');
      $('#rmFrame').src = 'https://www.google.com/maps?q=' + q(a.q) + '&output=embed'; $('#rmDir').href = 'https://www.google.com/maps/search/?api=1&query=' + q(a.q);
      card.style.animation = 'none'; void card.offsetWidth; card.style.animation = '';
    };
    rl.addEventListener('click', e => { const b = e.target.closest('button'); if (b) go(+b.dataset.i); });
    go(0);
  }
})();

/* ===== Layout promotion videos: click to play, one at a time, with sound ===== */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const row = $('#vrRow'); if (!row) return;
  const cards = $$('.vr-card', row), fine = matchMedia('(hover:hover)').matches;

  // scroll reveal (self-contained)
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vr-in'); io.unobserve(e.target); } }), { threshold: .15 });
  $$('[data-vr]').forEach(el => io.observe(el));

  const fmtAny = () => cards.some(c => c.classList.contains('playing'));
  const refresh = () => row.classList.toggle('has-play', fmtAny());

  cards.forEach(card => {
    const v = $('video', card), hit = $('.vr-hit', card), pp = $('.vr-pp', card), mute = $('.vr-mute', card), fs = $('.vr-fs', card), bar = $('.vr-bar i', card);

    const pauseOthers = () => cards.forEach(o => { if (o !== card) { const ov = $('video', o); if (!ov.paused) ov.pause(); } });
    async function play() {
      pauseOthers();
      try { v.muted = false; await v.play(); }
      catch (e) { try { v.muted = true; await v.play(); } catch (e2) { card.classList.add('missing'); } }
    }
    const toggle = () => v.paused ? play() : v.pause();

    hit.addEventListener('click', toggle);
    pp.addEventListener('click', e => { e.stopPropagation(); toggle(); });
    mute.addEventListener('click', e => { e.stopPropagation(); v.muted = !v.muted; });
    fs.addEventListener('click', e => {
      e.stopPropagation();
      const f = v.requestFullscreen || v.webkitRequestFullscreen || v.webkitEnterFullscreen;
      if (f) f.call(v);
    });

    v.addEventListener('play', () => { card.classList.add('playing', 'started'); card.classList.remove('paused'); pp.textContent = '❚❚'; pp.setAttribute('aria-label', 'Pause'); hit.setAttribute('aria-label', 'Pause video'); refresh(); });
    v.addEventListener('pause', () => { card.classList.remove('playing'); card.classList.add('paused'); pp.textContent = '▶'; pp.setAttribute('aria-label', 'Play'); hit.setAttribute('aria-label', 'Play video'); refresh(); });
    v.addEventListener('ended', () => { card.classList.remove('playing', 'started', 'paused'); bar.style.width = '0'; v.currentTime = 0; refresh(); });
    v.addEventListener('timeupdate', () => { if (v.duration) bar.style.width = (v.currentTime / v.duration * 100) + '%'; });
    v.addEventListener('volumechange', () => { mute.textContent = v.muted ? '🔇' : '🔊'; mute.setAttribute('aria-label', v.muted ? 'Unmute' : 'Mute'); });
    v.addEventListener('error', () => card.classList.add('missing'));

    // pause when the video scrolls out of view
    new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting && !v.paused) v.pause(); }), { threshold: .2 }).observe(card);

    // gentle 3D tilt on desktop
    if (fine) {
      const ring = $('.vr-ring', card);
      card.addEventListener('mousemove', e => { const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; ring.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`; });
      card.addEventListener('mouseleave', () => ring.style.transform = '');
    }
  });
  // pause everything with the Escape key
  addEventListener('keydown', e => { if (e.key === 'Escape') cards.forEach(c => { const v = $('video', c); if (!v.paused) v.pause(); }); });
})();