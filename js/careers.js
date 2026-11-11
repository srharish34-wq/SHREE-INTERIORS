/* Careers page scripts (self-contained; load after style.css/careers.css) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const fine = matchMedia('(hover:hover)').matches;

  addEventListener('load', () => setTimeout(() => $('#preloader').classList.add('hidden'), 800));

  // Header, progress, back-to-top
  const header = $('#header'), bar = $('#progress'), toTop = $('#toTop');
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('sc', y > 20); toTop.classList.toggle('show', y > 500); bar.style.width = (h > 0 ? y / h * 100 : 0) + '%';
  };
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

  // Reveal + counters
  const count = el => { const end = +el.dataset.count, t0 = performance.now(); const tick = t => { const p = Math.min((t - t0) / 1800, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target; t.classList.add('in'); setTimeout(() => t.classList.add('done'), 1300);
    $$('[data-count]', t).forEach(count); io.unobserve(t);
  }), { threshold: .15 });
  $$('[data-r]').forEach(el => io.observe(el));

  // FAQ
  $$('.q').forEach(q => q.onclick = () => { const it = q.parentElement, was = it.classList.contains('open'); $$('.qa').forEach(i => i.classList.remove('open')); it.classList.toggle('open', !was); });

  /* ===== Job openings =====
     SAMPLE roles. Edit, add or delete entries. Set "isNew: true" to show a NEW badge. */
  const JOBS = [
    { title: 'Sales Executive, Layouts', dept: 'Sales', type: 'Full-time', loc: 'Chennai', isNew: true, desc: 'Meet customers, conduct site visits and guide families to the right plot.', skills: ['Communication', 'Customer handling', 'Local knowledge'] },
    { title: 'Customer Relations Executive', dept: 'Support', type: 'Full-time', loc: 'Chennai', desc: 'Handle enquiries, follow up with customers and keep every visit on schedule.', skills: ['Phone skills', 'Tamil and English', 'Follow-up'] },
    { title: 'Site Engineer', dept: 'Construction', type: 'Full-time', loc: 'Chennai', isNew: true, desc: 'Supervise villa and layout work on site, ensuring quality and timelines.', skills: ['Civil engineering', 'Site management', 'Drawings'] },
    { title: 'Site Supervisor', dept: 'Construction', type: 'Full-time', loc: 'Chennai', desc: 'Coordinate daily site work, workers and materials.', skills: ['Supervision', 'Material tracking', 'Safety'] },
    { title: 'Interior Designer', dept: 'Design', type: 'Full-time', loc: 'Chennai', desc: 'Create elegant, functional interior designs for homes, shops and offices.', skills: ['Space planning', '3D design', 'Client presentation'] },
    { title: 'Architect / Draftsman', dept: 'Design', type: 'Full-time', loc: 'Chennai', desc: 'Prepare layout plans and home drawings for approvals and construction.', skills: ['AutoCAD', 'Layout planning', 'Approvals'] },
    { title: 'Documentation Executive', dept: 'Support', type: 'Full-time', loc: 'Chennai', desc: 'Prepare and track documents, registrations and bank loan paperwork.', skills: ['Attention to detail', 'Documentation', 'MS Office'] },
    { title: 'Solar Installation Technician', dept: 'Technical', type: 'Full-time', loc: 'Chennai', desc: 'Install and service solar systems and RO water purifiers.', skills: ['Electrical basics', 'Installation', 'Service'] }
  ];
  const list = $('#jobs'), filters = $('#jobFilters'), none = $('#noJob'), sel = $('#roleSel');
  const depts = ['All', ...new Set(JOBS.map(j => j.dept))];
  let cur = 'All';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  filters.innerHTML = depts.map(d => `<button class="f${d === 'All' ? ' on' : ''}" data-f="${d}">${d}<small>${d === 'All' ? JOBS.length : JOBS.filter(j => j.dept === d).length}</small></button>`).join('');
  sel.innerHTML = '<option value="">Select a role</option>' + JOBS.map(j => `<option>${esc(j.title)}</option>`).join('') + '<option>General application</option>';
  function render() {
    const rows = JOBS.filter(j => cur === 'All' || j.dept === cur);
    none.hidden = rows.length > 0;
    list.innerHTML = rows.map((j, i) => `<article class="job" style="--i:${i}"><div class="job-top"><span class="dept">${esc(j.dept)}</span>${j.isNew ? '<span class="new">NEW</span>' : ''}</div><h3>${esc(j.title)}</h3><div class="meta"><span>📍 ${esc(j.loc)}</span><span>🕒 ${esc(j.type)}</span></div><p>${esc(j.desc)}</p><div class="skills">${j.skills.map(s => `<span>${esc(s)}</span>`).join('')}</div><button class="btn" data-apply="${esc(j.title)}">Apply Now</button></article>`).join('');
  }
  filters.addEventListener('click', e => { const b = e.target.closest('.f'); if (!b) return; cur = b.dataset.f; $$('.f', filters).forEach(x => x.classList.toggle('on', x === b)); render(); });
  render();

  // Popups: application + enquiry
  const wa = msg => window.open('https://wa.me/918939200583?text=' + msg, '_blank', 'noopener'), q = encodeURIComponent;
  function popup(modal) {
    let last;
    return {
      open() { last = document.activeElement; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); setTimeout(() => $('input', modal).focus(), 350); },
      close() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); last && last.focus(); }
    };
  }
  const enq = popup($('#enquiryModal')), app = popup($('#applyModal'));
  $$('[data-open-enquiry]').forEach(b => b.addEventListener('click', enq.open));
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-apply]'); if (!a) return;
    sel.value = a.dataset.apply || 'General application';
    $('#mailLink').href = 'mailto:Shreedhanesgroup@gmail.com?subject=' + q('Job application: ' + sel.value);
    app.open();
  });
  $$('.modal').forEach(m => { m.addEventListener('click', e => { if (e.target === m) (m.id === 'applyModal' ? app : enq).close(); }); $$('[data-close]', m).forEach(b => b.addEventListener('click', () => (m.id === 'applyModal' ? app : enq).close())); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { enq.close(); app.close(); } });

  const eForm = $('#enquiryForm'), eThanks = $('.thanks', $('#enquiryModal'));
  eForm.addEventListener('submit', e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(eForm));
    wa(`New enquiry from website%0AName: ${q(d.name)}%0APhone: ${q(d.phone)}%0AEmail: ${q(d.email || '-')}%0AInterested in: ${q(d.interest)}%0AMessage: ${q(d.message || '-')}`);
    eForm.reset(); eThanks.hidden = false; setTimeout(() => { eThanks.hidden = true; enq.close(); }, 3500);
  });
  const aForm = $('#applyForm'), aThanks = $('.thanks', $('#applyModal'));
  aForm.addEventListener('submit', e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(aForm));
    wa(`Job application%0ARole: ${q(d.role)}%0AName: ${q(d.name)}%0APhone: ${q(d.phone)}%0AEmail: ${q(d.email || '-')}%0AAbout me: ${q(d.message || '-')}`);
    aForm.reset(); aThanks.hidden = false; setTimeout(() => { aThanks.hidden = true; app.close(); }, 4500);
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