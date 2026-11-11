/* Projects pages (ongoing + completed): shared script. Page chosen by <body data-page="ongoing|completed">.
   INTERIORS are the main business and show first; REAL ESTATE (layouts and villas) is the second tab. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const PHONE = '918939200583', q = encodeURIComponent, fine = matchMedia('(hover:hover)').matches;
  const page = document.body.dataset.page, done = page === 'completed';

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

  // Reveal + counters
  const count = el => { const end = +el.dataset.count, t0 = performance.now(); const tick = t => { const p = Math.min((t - t0) / 1800, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('en-IN'); if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; const t = e.target;
    if (t.dataset.count) count(t); else { t.classList.add('in'); setTimeout(() => t.classList.add('done'), 1300); $$('[data-count]', t).forEach(count); }
    io.unobserve(t);
  }), { threshold: .15 });
  $$('[data-r],[data-count]').forEach(el => io.observe(el));

  /* =====================  PROJECT DATA (edit here)  =====================
     INTERIOR projects below are SAMPLE entries so the page looks complete.
     Replace the names, areas, scopes and progress with your real projects.
     img = file name inside /images */
  const INT_ONGOING = [
    { name: 'Modern 3 BHK Apartment', loc: 'Avadi', cat: 'Residential', progress: 70, scope: ['Living room', 'Modular kitchen', 'Wardrobes'], img: 'int-ongoing-1.jpg' },
    { name: 'Contemporary Villa Interiors', loc: 'Pattabiram', cat: 'Residential', progress: 45, scope: ['Full-home design', 'False ceiling', 'Pooja unit'], img: 'int-ongoing-2.jpg' },
    { name: 'Corporate Office Fit-out', loc: 'Poonamallee', cat: 'Office', progress: 60, scope: ['Workstations', 'Reception', 'Meeting room'], img: 'int-ongoing-3.jpg' },
    { name: 'Boutique Showroom', loc: 'Thiruninravur', cat: 'Commercial', progress: 30, scope: ['Display units', 'Lighting', 'Billing counter'], img: 'int-ongoing-4.jpg' },
    { name: '2 BHK Home Makeover', loc: 'Melpakkam', cat: 'Residential', progress: 85, scope: ['Kitchen', 'Bedrooms', 'TV unit'], img: 'int-ongoing-5.jpg' },
    { name: 'Clinic Interiors', loc: 'Paruthipattu', cat: 'Commercial', progress: 55, scope: ['Reception', 'Treatment rooms', 'Lighting'], img: 'int-ongoing-6.jpg' }
  ];
  const INT_DONE = [
    { name: 'Luxury 3 BHK Apartment', loc: 'Avadi', cat: 'Residential', scope: ['Living room', 'Kitchen', 'Bedrooms'], img: 'int-completed-1.jpg' },
    { name: 'Family Villa Interiors', loc: 'Pattabiram', cat: 'Residential', scope: ['Full-home design', 'Pooja unit', 'Wardrobes'], img: 'int-completed-2.jpg' },
    { name: 'Modular Kitchen and Wardrobes', loc: 'Thirumullaivoyal', cat: 'Residential', scope: ['Modular kitchen', 'Wardrobes'], img: 'int-completed-3.jpg' },
    { name: 'IT Office Interiors', loc: 'Ambattur', cat: 'Office', scope: ['Workstations', 'Cabins', 'Lounge'], img: 'int-completed-4.jpg' },
    { name: 'Fashion Boutique', loc: 'Poonamallee', cat: 'Commercial', scope: ['Display units', 'Lighting', 'Trial rooms'], img: 'int-completed-5.jpg' },
    { name: '1 BHK Smart Space', loc: 'Paruthipattu', cat: 'Residential', scope: ['Space saving', 'Storage', 'Kitchen'], img: 'int-completed-6.jpg' },
    { name: 'Cafe Interiors', loc: 'Avadi', cat: 'Commercial', scope: ['Seating', 'Counter', 'Ambience lighting'], img: 'int-completed-7.jpg' },
    { name: 'Pooja Room and False Ceiling', loc: 'Thiruninravur', cat: 'Residential', scope: ['Pooja room', 'False ceiling'], img: 'int-completed-8.jpg' },
    { name: 'Showroom Interiors', loc: 'Melpakkam', cat: 'Commercial', scope: ['Display', 'Reception', 'Lighting'], img: 'int-completed-9.jpg' }
  ];
  // REAL ESTATE (additional business): from your own project list
  const RE_ONGOING = [
    { name: 'Jabakishan Nagar', loc: 'Near Vandalur\u2013Minjur Highway', type: 'Plots', img: 'ongoing-1.jpg' },
    { name: 'Thandral Nagar', loc: 'Avadi, CTH Road, near Hindu College', type: 'Plots', img: 'ongoing-2.jpg' },
    { name: 'Highway Lane', loc: 'Poonamallee Highway, Thiruninravur', type: 'Plots', img: 'ongoing-3.jpg' },
    { name: 'Sreekandhan Villas Nivas', loc: 'Vandalur\u2013Minjur Highway area', type: 'Villas', img: 'ongoing-4.jpg' },
    { name: 'Gomathi Amman Nagar', loc: 'Thiruvallur Highway area', type: 'Plots', img: 'ongoing-5.jpg' }
  ];
  const RE_DONE = [
    { name: 'O Town', loc: 'Pattabiram', area: 'Pattabiram', units: 424, img: 'completed-1.jpg' },
    { name: 'Shang Shanmugam Nagar', loc: 'Pattabiram', area: 'Pattabiram', units: 235, img: 'completed-2.jpg' },
    { name: 'Elite Avenue', loc: 'Arakkonam', area: 'Arakkonam', units: 234, img: 'completed-3.jpg' },
    { name: 'Royal Nest', loc: 'Paruthipattu', area: 'Paruthipattu', units: 73, img: 'completed-4.jpg' },
    { name: 'Shaitanya Avenue', loc: 'Pattabiram', area: 'Pattabiram', units: 63, img: 'completed-5.jpg' },
    { name: 'Apple City', loc: 'Avadi', area: 'Avadi', units: 47, img: 'completed-6.jpg' },
    { name: 'Venkateshwaram Nagar', loc: 'Thirumullaivoyal', area: 'Thirumullaivoyal', units: 23, img: 'completed-7.jpg' },
    { name: 'Sai Garden', loc: 'Paruthipattu', area: 'Paruthipattu', units: 23, img: 'completed-8.jpg' }
  ];

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const grid = $('#pGrid'), filters = $('#pFilters'), note = $('#pNote');
  const TXT = {
    int: { eye: done ? 'Completed Projects' : 'Ongoing Projects', h2: done ? 'Interiors we have <em>designed and delivered</em>' : 'Spaces we are <em>designing right now</em>', note: '' },
    re: { eye: done ? 'Real Estate · Completed' : 'Real Estate · Ongoing', h2: done ? 'Layouts <em>sold out and delivered</em>' : 'Plots and villas <em>open for booking</em>', note: 'Real estate is our additional business: approved layouts and villas from the same trusted team.' }
  };
  let tab = 'int', cur = 'All';
  const dataFor = () => tab === 'int' ? (done ? INT_DONE : INT_ONGOING) : (done ? RE_DONE : RE_ONGOING);
  const keyFor = () => tab === 'int' ? 'cat' : (done ? 'area' : 'type');
  const wa = (p, extra) => `https://wa.me/${PHONE}?text=${q('Hello, I am interested in ' + p.name + ' (' + p.loc + '). ' + (extra || ''))}`;
  const scope = p => `<div class="scope">${p.scope.map(s => `<span>${esc(s)}</span>`).join('')}</div>`;

  function card(p, i) {
    const img = `<img src="images/${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">`;
    if (tab === 'int' && !done) return `<article class="pcard" style="--i:${i}" data-tilt><div class="pi">${img}<span class="tag live">In progress</span><span class="ptype">${esc(p.cat)}</span></div><div class="pb"><h4>${esc(p.name)}</h4><div class="ploc">${esc(p.loc)}</div>${scope(p)}<div class="prog"><div class="prog-top"><span>Progress</span><b>${p.progress}%</b></div><div class="prog-bar"><i style="--p:${p.progress}%;--i:${i}"></i></div></div><div class="pbottom"><button class="btn" data-ask="${esc(p.name)}" data-kind="int">Get a Similar Design</button><a class="pwa" target="_blank" rel="noopener" aria-label="WhatsApp about ${esc(p.name)}" href="${wa(p)}">💬</a></div></div></article>`;
    if (tab === 'int') return `<article class="pcard" style="--i:${i}" data-tilt><div class="pi">${img}<span class="tag done">Completed</span><span class="dl">Delivered</span><span class="ptype">${esc(p.cat)}</span></div><div class="pb"><h4>${esc(p.name)}</h4><div class="ploc">${esc(p.loc)}</div>${scope(p)}<div class="pbottom"><button class="btn" data-ask="${esc(p.name)}" data-kind="int">Get a Similar Design</button><a class="pwa" target="_blank" rel="noopener" aria-label="WhatsApp about ${esc(p.name)}" href="${wa(p, 'I would like a similar design.')}">💬</a></div></div></article>`;
    if (done) return `<article class="pcard" style="--i:${i}" data-tilt><div class="pi">${img}<span class="tag done">Completed</span><span class="stamp">SOLD OUT</span></div><div class="pb"><h4>${esc(p.name)}</h4><div class="ploc">${esc(p.loc)}</div><div class="pbottom"><div class="sold"><b data-count="${p.units}">0</b> units sold</div><button class="btn ghost" data-ask="${esc(p.name)}" data-kind="re">Similar Projects</button></div></div></article>`;
    return `<article class="pcard" style="--i:${i}" data-tilt><div class="pi">${img}<span class="tag">Ongoing</span><span class="ptype">${esc(p.type)}</span></div><div class="pb"><h4>${esc(p.name)}</h4><div class="ploc">${esc(p.loc)}</div><div class="pbottom"><button class="btn" data-ask="${esc(p.name)}" data-kind="re" data-type="${esc(p.type)}">Enquire Now</button><a class="pwa" target="_blank" rel="noopener" aria-label="WhatsApp about ${esc(p.name)}" href="${wa(p)}">💬</a></div></div></article>`;
  }
  const ctaCard = i => `<article class="pcard pcta" style="--i:${i}"><h4>${done ? 'Looking for a similar project?' : 'Want something different?'}</h4><p>${done ? 'Our new layouts are open now. Tell us your area and budget.' : 'Tell us your preferred area and budget and we will find the right plot or villa.'}</p><button class="btn" data-ask="Custom requirement" data-kind="re">Talk to Us</button></article>`;

  function render() {
    const rows = dataFor().filter(p => cur === 'All' || p[keyFor()] === cur);
    grid.innerHTML = rows.length ? rows.map(card).join('') + (tab === 're' ? ctaCard(rows.length) : '') : '<p class="nothing">No projects in this category.</p>';
    $$('[data-count]', grid).forEach(el => io.observe(el));
    if (fine) $$('[data-tilt]', grid).forEach(el => {
      el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-8px)`; });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }
  function buildFilters() {
    const d = dataFor(), k = keyFor(), keys = ['All', ...new Set(d.map(p => p[k]))];
    filters.innerHTML = keys.map(v => `<button class="f${v === cur ? ' on' : ''}" data-f="${esc(v)}">${esc(v)}<small>${v === 'All' ? d.length : d.filter(p => p[k] === v).length}</small></button>`).join('');
  }
  function setTab(t) {
    tab = t; cur = 'All';
    $$('.pt').forEach(b => b.classList.toggle('on', b.dataset.tab === t));
    $('#pEye').textContent = TXT[t].eye; $('#pH2').innerHTML = TXT[t].h2;
    note.hidden = !TXT[t].note; note.textContent = TXT[t].note;
    buildFilters(); render();
  }
  $$('.pt').forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));
  filters.addEventListener('click', e => { const b = e.target.closest('.f'); if (!b) return; cur = b.dataset.f; $$('.f', filters).forEach(x => x.classList.toggle('on', x === b)); render(); });
  setTab('int');

  // Enquiry popup (WhatsApp), prefilled with the chosen project
  const modal = $('#enquiryModal'), form = $('#enquiryForm'), thanks = $('.thanks', modal); let last;
  const open = () => { last = document.activeElement; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); setTimeout(() => $('input', modal).focus(), 350); };
  const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); last && last.focus(); };
  $$('[data-open-enquiry]').forEach(b => b.addEventListener('click', open));
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-ask]'); if (!a) return;
    const n = a.dataset.ask, int = a.dataset.kind === 'int';
    form.message.value = int ? `I would like an interior design similar to "${n}".` : (done ? `I would like to know about projects similar to ${n}.` : `I am interested in ${n}.`);
    const want = int ? 'Interiors' : (a.dataset.type === 'Villas' ? 'Villa construction' : 'Residential plots');
    [...form.interest.options].forEach(o => { if (o.text === want) form.interest.value = o.value || o.text; });
    open();
  });
  $$('[data-close]').forEach(b => b.addEventListener('click', close));
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  form.addEventListener('submit', e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(form));
    window.open(`https://wa.me/${PHONE}?text=${q(`New enquiry from website\nName: ${d.name}\nPhone: ${d.phone}\nEmail: ${d.email || '-'}\nInterested in: ${d.interest}\nMessage: ${d.message || '-'}`)}`, '_blank', 'noopener');
    form.reset(); thanks.hidden = false; setTimeout(() => { thanks.hidden = true; close(); }, 3500);
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