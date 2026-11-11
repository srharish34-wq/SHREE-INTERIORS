/* About page scripts (self-contained; load after style.css/about.css) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const fine = matchMedia('(hover:hover)').matches;

  addEventListener('load', () => setTimeout(() => $('#preloader').classList.add('hidden'), 800));

  // Header, progress bar, back-to-top, journey line fill
  const header = $('#header'), bar = $('#progress'), toTop = $('#toTop'), tl = $('#tl'), fill = $('#tlFill');
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('sc', y > 20);
    toTop.classList.toggle('show', y > 500);
    bar.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    if (tl) { const r = tl.getBoundingClientRect(); fill.style.setProperty('--prog', Math.max(0, Math.min(100, (innerHeight * .6 - r.top) / r.height * 100)) + '%'); }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile menu
  const burger = $('#burger'), nav = $('#nav');
  const closeMenu = () => { nav.classList.remove('open'); burger.classList.remove('x'); document.body.style.overflow = ''; };
  burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.classList.toggle('x', o); document.body.style.overflow = o ? 'hidden' : ''; });
  $$('#nav a').forEach(a => a.addEventListener('click', closeMenu));

  // Card tilt (desktop)
  if (fine) $$('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`; });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  // Reveal + counters
  const count = el => { const end = +el.dataset.count, t0 = performance.now(); const tick = t => { const p = Math.min((t - t0) / 1800, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target; t.classList.add('in'); setTimeout(() => t.classList.add('done'), 1300);
    $$('[data-count]', t).forEach(count); if (t.dataset.count) count(t); io.unobserve(t);
  }), { threshold: .15 });
  $$('[data-r]').forEach(el => io.observe(el));

 

  // Enquiry popup + call-back form (both send to WhatsApp; swap for your backend if you prefer email)
  const modal = $('#enquiryModal'), form = $('#enquiryForm'), thanks = $('.thanks', modal); let last;
  const open = () => { last = document.activeElement; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); setTimeout(() => $('input', modal).focus(), 350); };
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); last && last.focus(); };
  $$('[data-open-enquiry]').forEach(b => b.addEventListener('click', open));
  $$('[data-close]').forEach(b => b.addEventListener('click', close));
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  const wa = msg => window.open('https://wa.me/918939200583?text=' + msg, '_blank', 'noopener'), q = encodeURIComponent;
  form.addEventListener('submit', e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(form));
    wa(`New enquiry from website%0AName: ${q(d.name)}%0APhone: ${q(d.phone)}%0AEmail: ${q(d.email || '-')}%0AInterested in: ${q(d.interest)}%0AMessage: ${q(d.message || '-')}`);
    form.reset(); thanks.hidden = false; setTimeout(() => { thanks.hidden = true; close(); }, 3500);
  });
  const bf = $('#bookForm');
  bf.addEventListener('submit', e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(bf));
    wa(`Call back request%0AName: ${q(d.name)}%0APhone: ${q(d.phone)}%0AService: ${q(d.service)}`);
    bf.reset(); const t = $('.bthanks', bf); t.hidden = false; setTimeout(() => t.hidden = true, 4000);
  });
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