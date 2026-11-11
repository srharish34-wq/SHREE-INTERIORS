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