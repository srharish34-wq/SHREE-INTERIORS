/* Contact page scripts (self-contained; load after style.css/contact.css) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const fine = matchMedia('(hover:hover)').matches;
  const PHONE = '918939200583', MAIL = 'Shreedhanesgroup@gmail.com', q = encodeURIComponent;

  addEventListener('load', () => setTimeout(() => $('#preloader').classList.add('hidden'), 800));

  // Header, progress, back-to-top
  const header = $('#header'), bar = $('#progress'), toTop = $('#toTop');
  const onScroll = () => { const y = scrollY, h = document.documentElement.scrollHeight - innerHeight; header.classList.toggle('sc', y > 20); toTop.classList.toggle('show', y > 500); bar.style.width = (h > 0 ? y / h * 100 : 0) + '%'; };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile menu
  const burger = $('#burger'), nav = $('#nav');
  const closeMenu = () => { nav.classList.remove('open'); burger.classList.remove('x'); document.body.style.overflow = ''; };
  burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.classList.toggle('x', o); document.body.style.overflow = o ? 'hidden' : ''; });
  $$('#nav a').forEach(a => a.addEventListener('click', closeMenu));

  // Tilt (desktop)
  if (fine) $$('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`; });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  // Reveal
  const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; e.target.classList.add('in'); setTimeout(() => e.target.classList.add('done'), 1300); io.unobserve(e.target); }), { threshold: .15 });
  $$('[data-r]').forEach(el => io.observe(el));

  // FAQ
  $$('.q').forEach(b => b.onclick = () => { const it = b.parentElement, was = it.classList.contains('open'); $$('.qa').forEach(i => i.classList.remove('open')); it.classList.toggle('open', !was); });

  // Copy buttons
  $$('.copy').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch (e) { return; }
    const t = b.textContent; b.textContent = 'Copied'; b.classList.add('ok'); setTimeout(() => { b.textContent = t; b.classList.remove('ok'); }, 1600);
  }));

  // Enquiry form -> WhatsApp (or email)
  const form = $('#contactForm'), err = $('#formErr'), sent = $('#sent'), msg = $('#cMsg');
  msg.addEventListener('input', () => $('#count').textContent = msg.value.length + ' / 500');
  function read() {
    const d = Object.fromEntries(new FormData(form)); const bad = [];
    $$('input', form).forEach(i => i.classList.remove('bad'));
    if (!d.name.trim()) { bad.push('name'); $('#cName').classList.add('bad'); }
    if (!/^[0-9+\s]{10,15}$/.test(d.phone.trim())) { bad.push('a valid phone number'); $('#cPhone').classList.add('bad'); }
    if (!d.service) bad.push('a service');
    if (bad.length) { err.textContent = 'Please enter ' + bad.join(', ') + '.'; err.hidden = false; return null; }
    err.hidden = true; return d;
  }
  const text = d => `New enquiry from website\nName: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email || '-'}\nInterested in: ${d.service}\nMessage: ${d.message || '-'}`;
  function done() { form.hidden = true; sent.hidden = false; sent.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  form.addEventListener('submit', e => { e.preventDefault(); const d = read(); if (!d) return; window.open(`https://wa.me/${PHONE}?text=${q(text(d))}`, '_blank', 'noopener'); form.reset(); $('#count').textContent = '0 / 500'; done(); });
  $('#mailBtn').addEventListener('click', () => { const d = read(); if (!d) return; location.href = `mailto:${MAIL}?subject=${q('Website enquiry: ' + d.service)}&body=${q(text(d))}`; });
  $('#again').addEventListener('click', () => { sent.hidden = true; form.hidden = false; });

  // Service picks fill the form
  $$('.pick').forEach(p => p.addEventListener('click', () => {
    const r = $(`input[name="service"][value="${p.dataset.service}"]`); if (r) r.checked = true;
    sent.hidden = true; form.hidden = false; $('#enquiry').scrollIntoView({ behavior: 'smooth' }); setTimeout(() => $('#cName').focus({ preventScroll: true }), 700);
  }));

  // Office map tabs
  const OFFICES = [
    { name: 'Head Office, Melpakkam', addr: '497/1B, Rajagopapathi Street, ANS Nagar, Melpakkam, Chennai – 600024, Tamil Nadu', q: 'Rajagopapathi Street ANS Nagar Melpakkam Chennai 600024' },
    { name: 'Periyapalayam Office', addr: '469, Balaji Nagar, Periyapalayam, Chennai, Tamil Nadu 602024', q: '469 Balaji Nagar Periyapalayam Chennai 602024' }
  ];
  function office(i) {
    const o = OFFICES[i];
    $('#mName').textContent = o.name; $('#mAddr').textContent = o.addr;
    $('#mapFrame').src = 'https://www.google.com/maps?q=' + q(o.q) + '&output=embed';
    $('#mDir').href = 'https://www.google.com/maps/search/?api=1&query=' + q(o.q);
    $$('.mt').forEach((b, k) => b.classList.toggle('on', k === i));
    const c = $('.mcard'); c.style.animation = 'none'; void c.offsetWidth; c.style.animation = '';
  }
  $$('.mt').forEach(b => b.addEventListener('click', () => office(+b.dataset.map)));
  office(0);

  // Header Enquiry popup -> WhatsApp
  const modal = $('#enquiryModal'), eForm = $('#enquiryForm'), eThanks = $('.thanks', modal); let last;
  const open = () => { last = document.activeElement; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); setTimeout(() => $('input', modal).focus(), 350); };
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); last && last.focus(); };
  $$('[data-open-enquiry]').forEach(b => b.addEventListener('click', open));
  $$('[data-close]').forEach(b => b.addEventListener('click', close));
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  eForm.addEventListener('submit', e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(eForm));
    window.open(`https://wa.me/${PHONE}?text=${q(text({ ...d, service: d.interest }))}`, '_blank', 'noopener');
    eForm.reset(); eThanks.hidden = false; setTimeout(() => { eThanks.hidden = true; close(); }, 3500);
  });
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