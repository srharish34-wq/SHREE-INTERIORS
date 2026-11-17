/* Service pages (Interiors, Construction, Layout Promoting): shared script, floating buttons included at the bottom */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const PHONE = '918939200583', q = encodeURIComponent, fine = matchMedia('(hover:hover)').matches;
  const SERVICE = document.body.dataset.service || 'Interiors';

  addEventListener('load', () => setTimeout(() => $('#preloader').classList.add('hidden'), 800));

  // Header, progress bar, back-to-top, hero parallax
  const header = $('#header'), bar = $('#progress'), toTop = $('#toTop'), heroBg = $('#heroBg');
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('sc', y > 20); toTop.classList.toggle('show', y > 500); bar.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    if (heroBg && y < innerHeight * 1.2) heroBg.style.transform = `translateY(${y * .25}px)`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile menu
  const burger = $('#burger'), nav = $('#nav');
  const closeMenu = () => { nav.classList.remove('open'); burger.classList.remove('x'); document.body.style.overflow = ''; };
  burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.classList.toggle('x', o); document.body.style.overflow = o ? 'hidden' : ''; });
  $$('#nav a').forEach(a => a.addEventListener('click', closeMenu));

  // Tilt + magnetic buttons (desktop)
  if (fine) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-6px)`; });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
    $$('[data-magnet]').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
      b.addEventListener('mouseleave', () => b.style.transform = '');
    });
  }

  // Reveal + counters + checklist
  const count = el => { const end = +el.dataset.count, t0 = performance.now(); const tick = t => { const p = Math.min((t - t0) / 1800, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('en-IN'); if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const t = e.target;
    t.classList.add('in'); setTimeout(() => t.classList.add('done'), 1300);
    $$('[data-count]', t).forEach(count); if (t.dataset.count) count(t);
    io.unobserve(t);
  }), { threshold: .15 });
  $$('[data-r],#ck,[data-count]').forEach(el => io.observe(el));

  // Sub-navigation scroll spy
  const links = $$('#subnav a'), map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.classList.toggle('on', a === map.get(e.target.id)));
    const a = map.get(e.target.id); if (a && a.scrollIntoView) a.parentElement.scrollTo({ left: a.offsetLeft - 20, behavior: 'smooth' });
  }), { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((a, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });

  // Type tabs
  $$('.stab').forEach(b => b.addEventListener('click', () => {
    $$('.stab').forEach(x => x.classList.toggle('on', x === b));
    $$('.spanel').forEach(p => p.classList.toggle('on', p.dataset.p === b.dataset.t));
  }));

  // Accordions (FAQ + specifications)
  $$('.q').forEach(b => b.addEventListener('click', () => { const it = b.parentElement, box = it.parentElement, was = it.classList.contains('open'); $$('.qa', box).forEach(i => i.classList.remove('open')); it.classList.toggle('open', !was); }));

  // Before / after slider
  const ba = $('#ba'); if (ba) ba.querySelector('input').addEventListener('input', e => ba.style.setProperty('--p', e.target.value + '%'));

  // Gallery lightbox
  const lb = document.createElement('div'); lb.className = 'lightbox'; lb.innerHTML = '<img alt="">'; document.body.appendChild(lb);
  $$('.sgal img').forEach(i => i.addEventListener('click', () => { $('img', lb).src = i.src; lb.classList.add('open'); }));
  lb.addEventListener('click', () => lb.classList.remove('open'));

  // Enquiry popup (WhatsApp), prefilled from any "Enquire" / "Get a Quote" button
  const modal = $('#enquiryModal'), form = $('#enquiryForm'), thanks = $('.thanks', modal); let last;
  const want = SERVICE;
  const open = () => { last = document.activeElement; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); setTimeout(() => $('input', modal).focus(), 350); };
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); last && last.focus(); };
  const preset = msg => { [...form.interest.options].forEach(o => { if (o.text === want) form.interest.value = o.value || o.text; }); form.message.value = msg || ''; };
  $$('[data-open-enquiry]').forEach(b => b.addEventListener('click', () => { preset(''); open(); }));
  $$('[data-ask]').forEach(b => b.addEventListener('click', () => { preset('I am interested in: ' + b.dataset.ask + '.'); open(); }));
  $$('[data-close]').forEach(b => b.addEventListener('click', close));
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { close(); lb.classList.remove('open'); } });
  const wa = text => window.open(`https://wa.me/${PHONE}?text=${q(text)}`, '_blank', 'noopener');
  form.addEventListener('submit', e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(form));
    wa(`New enquiry from website\nName: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email || '-'}\nInterested in: ${d.interest}\nMessage: ${d.message || '-'}`);
    form.reset(); thanks.hidden = false; setTimeout(() => { thanks.hidden = true; close(); }, 3500);
  });
  // Bottom call-back form
  const qf = $('#quickForm');
  qf.addEventListener('submit', e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(qf));
    wa(`Call back request\nName: ${d.name}\nPhone: ${d.phone}\nService: ${d.service}`);
    qf.reset(); const t = $('.bthanks', qf); t.hidden = false; setTimeout(() => t.hidden = true, 4000);
  });

  /* ===== Floating contact buttons ===== */
  const fab = $('#fab'), toggle = $('#fabToggle');
  if (fab) {
    $$('.fab-btn', fab).forEach((b, i) => b.style.setProperty('--i', i));
    const start = () => setTimeout(() => fab.classList.add('ready'), 600);
    document.readyState === 'complete' ? start() : addEventListener('load', start);
    toggle.addEventListener('click', () => {
      const closed = fab.classList.toggle('closed');
      toggle.setAttribute('aria-expanded', String(!closed));
      toggle.setAttribute('aria-label', closed ? 'Show quick contact buttons' : 'Hide quick contact buttons');
      if (!closed) { fab.classList.remove('ready'); void fab.offsetWidth; fab.classList.add('ready'); }
    });
    if (matchMedia('(max-width:700px)').matches) { fab.classList.add('closed'); toggle.setAttribute('aria-expanded', 'false'); }
  }
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
