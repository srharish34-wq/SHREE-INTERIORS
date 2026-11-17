
/* Careers page scripts (self-contained; load after style.css/careers.css) */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const fine = matchMedia('(hover:hover)').matches, q = encodeURIComponent;

  /* ===== CV email recipients =====
     Info and HR receive CVs separately. */
  const MAIL = {
    admin: 'info@shreedesiregroups.com',
    hr: 'hr@shreedesiregroups.com'
  };
  const PHONE = '918939200583';

  addEventListener('load', () => setTimeout(() => $('#preloader').classList.add('hidden'), 800));

  // Header, progress, back-to-top
  const header = $('#header'), bar = $('#progress'), toTop = $('#toTop');
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('sc', y > 20);
    toTop.classList.toggle('show', y > 500);
    bar.style.width = (h > 0 ? y / h * 100 : 0) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  // Mobile menu
  const burger = $('#burger'), nav = $('#nav');
  const closeMenu = () => {
    nav.classList.remove('open');
    burger.classList.remove('x');
    document.body.style.overflow = '';
  };
  burger.addEventListener('click', () => {
    const o = nav.classList.toggle('open');
    burger.classList.toggle('x', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  $$('#nav a').forEach(a => a.addEventListener('click', closeMenu));

  // Tilt (desktop)
  if (fine) $$('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width - .5,
        y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  // Reveal + counters
  const count = el => {
    const end = +el.dataset.count, t0 = performance.now();
    const tick = t => {
      const p = Math.min((t - t0) / 1800, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target;
    t.classList.add('in');
    setTimeout(() => t.classList.add('done'), 1300);
    $$('[data-count]', t).forEach(count);
    io.unobserve(t);
  }), { threshold: .15 });

  $$('[data-r]').forEach(el => io.observe(el));

  // FAQ
  $$('.q').forEach(b => b.onclick = () => {
    const it = b.parentElement, was = it.classList.contains('open');
    $$('.qa').forEach(i => i.classList.remove('open'));
    it.classList.toggle('open', !was);
  });

  /* ===== Hiring slides ===== */
  const SLIDES = [
    {
      img: 'career-ad-tamil-wanted.jpg',
      ar: '1320 / 1464',
      chip: 'Now Hiring',
      title: 'Office Staff, Marketing Executives and Real Estate Brokers',
      text: 'We need people for our real estate business. Men and women can apply.',
      pts: ['Part time or full time', 'Men and women', 'No age limit'],
      role: 'Marketing Executive'
    },
    {
      img: 'career-ad-marketing-executives.jpg',
      ar: '1024 / 1347',
      chip: 'Wanted',
      title: 'Marketing Executives: join our team',
      text: 'We are looking for enthusiastic, self-driven people for our growing business.',
      pts: ['Attractive salary package', 'Incentives for good performance', 'Team support and guidance', 'Training and growth opportunities'],
      role: 'Marketing Executive'
    },
    {
      img: 'career-ad-fixed-salary.jpg',
      ar: '1536 / 782',
      chip: 'Part / Full Time',
      title: 'Real estate: a higher-income opportunity',
      text: 'New to real estate? Start with a fixed salary and an attractive incentive.',
      pts: ['Part or full time', 'Fixed salary', 'No sales target'],
      role: 'Marketing Executive'
    },
    {
      img: 'career-ad-channel-partners.jpg',
      ar: '1080 / 830',
      chip: 'Channel Partners',
      title: 'Real estate channel partners wanted',
      text: 'We welcome channel partners with attractive pay-outs.',
      pts: ['Income that matches your skills', 'Work with an excellent team', 'Stable growth and support'],
      role: 'Channel Partner'
    },
    {
      img: 'career-ad-property-partners.jpg',
      ar: '1122 / 1228',
      chip: 'No Experience Needed',
      title: 'Property marketing partners, in and around Chennai',
      text: 'Promote our real estate projects and earn on successful sales. We train you from basics to closing.',
      pts: ['Work on your own time', 'Earn on successful sales', 'Incentive-based opportunity'],
      role: 'Property Marketing Partner'
    }
  ];

  const esc = s => String(s).replace(/[&<>"]/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  }[c]));

  const track = $('#csTrack'), dots = $('#csDots'), prog = $('#csProg');

  track.innerHTML = SLIDES.map((s, i) =>
    `<article class="cs-slide${i ? '' : ' on'}" aria-label="Slide ${i + 1} of ${SLIDES.length}">
      <img class="cs-bg" src="images/${esc(s.img)}" alt="">
      <div class="cs-in">
        <button class="cs-img" style="--ar:${s.ar}" data-fly="${i}" aria-label="View flyer">
          <img src="images/${esc(s.img)}" alt="${esc(s.title)}">
        </button>
        <div class="cs-txt">
          <span class="cs-chip">${esc(s.chip)}</span>
          <h2>${esc(s.title)}</h2>
          <p>${esc(s.text)}</p>
          <ul class="ticks">${s.pts.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
          <div class="row">
            <button class="btn" data-apply="${esc(s.role)}">Apply Now</button>
            <button class="btn ghost-w" data-fly="${i}">View Flyer</button>
          </div>
        </div>
      </div>
    </article>`
  ).join('');

  const slides = $$('.cs-slide');
  let cur = 0, timer;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    b.onclick = () => { go(i); restart(); };
    dots.appendChild(b);
  });

  function go(n) {
    cur = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('on', i === cur));
    $$('button', dots).forEach((d, i) => d.classList.toggle('on', i === cur));
    prog.classList.remove('run');
    void prog.offsetWidth;
    if (!matchMedia('(prefers-reduced-motion:reduce)').matches) prog.classList.add('run');
  }

  const restart = () => {
    clearInterval(timer);
    if (!matchMedia('(prefers-reduced-motion:reduce)').matches)
      timer = setInterval(() => go(cur + 1), 6000);
    go(cur);
  };

  $('#csNext').onclick = () => { go(cur + 1); restart(); };
  $('#csPrev').onclick = () => { go(cur - 1); restart(); };

  const cs = $('#careerSlider');
  cs.addEventListener('mouseenter', () => {
    clearInterval(timer);
    prog.style.animationPlayState = 'paused';
  });
  cs.addEventListener('mouseleave', restart);

  let sx = 0;
  cs.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  cs.addEventListener('touchend', e => {
    const d = e.changedTouches[0].clientX - sx;
    if (Math.abs(d) > 50) {
      go(cur + (d < 0 ? 1 : -1));
      restart();
    }
  });

  go(0);
  restart();

  // Flyer lightbox
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<img alt="">';
  document.body.appendChild(lb);

  document.addEventListener('click', e => {
    const f = e.target.closest('[data-fly]');
    if (!f) return;
    $('img', lb).src = 'images/' + SLIDES[+f.dataset.fly].img;
    lb.classList.add('open');
  });
  lb.addEventListener('click', () => lb.classList.remove('open'));

  /* ===== Job openings ===== */
  const JOBS = [
    {
      title: 'Marketing Executive', dept: 'Employees', type: 'Part / Full time',
      loc: 'Chennai', isNew: true,
      perk: 'First-timers: fixed salary + attractive incentive',
      desc: 'Promote our plots, villas and interiors, meet customers and support site visits.',
      skills: ['Hard working', 'Confident', 'Good communication']
    },
    {
      title: 'Office Staff', dept: 'Employees', type: 'Part / Full time',
      loc: 'Chennai',
      desc: 'Support the office with customer calls, documentation and daily coordination.',
      skills: ['Communication', 'Computer basics', 'Organised']
    },
    {
      title: 'Real Estate Broker', dept: 'Partners', type: 'Partner',
      loc: 'Chennai and around', perk: 'Attractive pay-outs',
      desc: 'Bring buyers to our projects and earn on successful sales, with support for sales closing.',
      skills: ['Local network', 'Negotiation', 'Customer handling']
    },
    {
      title: 'Channel Partner', dept: 'Partners', type: 'Partner',
      loc: 'Chennai and around', isNew: true, perk: 'Attractive pay-outs',
      desc: 'Partner with us to market our real estate projects, with marketing support and training.',
      skills: ['Referral network', 'Marketing', 'Flexible time']
    },
    {
      title: 'Property Marketing Partner', dept: 'Partners', type: 'Partner',
      loc: 'In and around Chennai',
      perk: 'Incentive based, no experience needed',
      desc: 'Promote our onroad plots and villas. We train you from basics to closing.',
      skills: ['No experience needed', 'Own time', 'Earn on sales']
    },
    {
      title: 'Business Partner', dept: 'Partners', type: 'Partner',
      loc: 'Chennai and around', perk: 'Earn unlimitedly',
      desc: 'Business owners can add real estate sales to their income, with support for team management.',
      skills: ['Business owner', 'Team building', 'Networking']
    }
  ];

  const list = $('#jobs'), filters = $('#jobFilters'), none = $('#noJob'), sel = $('#roleSel');
  const depts = ['All', ...new Set(JOBS.map(j => j.dept))];
  let fcur = 'All';

  filters.innerHTML = depts.map(d =>
    `<button class="f${d === 'All' ? ' on' : ''}" data-f="${d}">
      ${d}<small>${d === 'All' ? JOBS.length : JOBS.filter(j => j.dept === d).length}</small>
    </button>`
  ).join('');

  sel.innerHTML = '<option value="">Select a role</option>' +
    JOBS.map(j => `<option>${esc(j.title)}</option>`).join('') +
    '<option>General application</option>';

  function render() {
    const rows = JOBS.filter(j => fcur === 'All' || j.dept === fcur);
    none.hidden = rows.length > 0;
    list.innerHTML = rows.map((j, i) =>
      `<article class="job" style="--i:${i}">
        <div class="job-top">
          <span class="dept">${esc(j.dept)}</span>
          ${j.isNew ? '<span class="new">NEW</span>' : ''}
        </div>
        <h3>${esc(j.title)}</h3>
        <div class="meta">
          <span>📍 ${esc(j.loc)}</span>
          <span>🕒 ${esc(j.type)}</span>
        </div>
        ${j.perk ? `<span class="perk">💰 ${esc(j.perk)}</span>` : ''}
        <p>${esc(j.desc)}</p>
        <div class="skills">${j.skills.map(s => `<span>${esc(s)}</span>`).join('')}</div>
        <button class="btn" data-apply="${esc(j.title)}">Apply Now</button>
      </article>`
    ).join('');
  }

  filters.addEventListener('click', e => {
    const b = e.target.closest('.f');
    if (!b) return;
    fcur = b.dataset.f;
    $$('.f', filters).forEach(x => x.classList.toggle('on', x === b));
    render();
  });

  render();

  // Send CV cards
  const same = MAIL.admin.toLowerCase() === MAIL.hr.toLowerCase();

  const cards = same
    ? [['📨', 'Info and HR', MAIL.admin]]
    : [['📨', 'Info', MAIL.admin], ['👩‍💼', 'HR', MAIL.hr]];

  $('#cvCards').innerHTML = cards.map(([i, l, m]) =>
    `<div class="cvc">
      <i>${i}</i>
      <h4>${l}</h4>
      <a class="mailto" href="mailto:${esc(m)}?subject=${q('CV: job application')}">${esc(m)}</a>
      <button class="copy" data-copy="${esc(m)}">Copy email</button>
    </div>`
  ).join('');

  const to = same ? MAIL.admin : MAIL.admin + ',' + MAIL.hr;

  const mailHref = role =>
    `mailto:${to}?subject=${q('CV: ' + (role || 'job application'))}&body=${q(
      'Hello,\n\nPlease find my CV attached.\n\nName:\nPhone:\nRole:' +
      (role ? ' ' + role : '') + '\n'
    )}`;

  $('#cvAll').href = mailHref('');

  $$('.copy').forEach(b => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
    } catch (e) {
      return;
    }
    const t = b.textContent;
    b.textContent = 'Copied';
    b.classList.add('ok');
    setTimeout(() => {
      b.textContent = t;
      b.classList.remove('ok');
    }, 1600);
  }));

  // Popups: application + enquiry
  const wa = msg => window.open(
    'https://wa.me/' + PHONE + '?text=' + msg,
    '_blank',
    'noopener'
  );

  function popup(modal) {
    let last;
    return {
      open() {
        last = document.activeElement;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        setTimeout(() => $('input', modal).focus(), 350);
      },
      close() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        last && last.focus();
      }
    };
  }

  const enq = popup($('#enquiryModal')), app = popup($('#applyModal'));

  $$('[data-open-enquiry]').forEach(b => b.addEventListener('click', enq.open));

  document.addEventListener('click', e => {
    const a = e.target.closest('[data-apply]');
    if (!a) return;
    sel.value = a.dataset.apply || 'General application';
    if (!sel.value) sel.value = 'General application';
    $('#mailLink').href = mailHref(sel.value);
    app.open();
  });

  sel.addEventListener('change', () => $('#mailLink').href = mailHref(sel.value));

  $$('.modal').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) (m.id === 'applyModal' ? app : enq).close();
    });
    $$('[data-close]', m).forEach(b =>
      b.addEventListener('click', () => (m.id === 'applyModal' ? app : enq).close())
    );
  });

  addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      enq.close();
      app.close();
      lb.classList.remove('open');
    }
  });

  const eForm = $('#enquiryForm'), eThanks = $('.thanks', $('#enquiryModal'));

  eForm.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(eForm));
    wa(`New enquiry from website%0AName: ${q(d.name)}%0APhone: ${q(d.phone)}%0AEmail: ${q(d.email || '-')}%0AInterested in: ${q(d.interest)}%0AMessage: ${q(d.message || '-')}`);
    eForm.reset();
    eThanks.hidden = false;
    setTimeout(() => {
      eThanks.hidden = true;
      enq.close();
    }, 3500);
  });

  const aForm = $('#applyForm'), aThanks = $('.thanks', $('#applyModal'));

  aForm.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(aForm));
    wa(`Job application%0ARole: ${q(d.role)}%0AName: ${q(d.name)}%0APhone: ${q(d.phone)}%0AEmail: ${q(d.email || '-')}%0AAbout me: ${q(d.message || '-')}`);
    aForm.reset();
    aThanks.hidden = false;
    setTimeout(() => {
      aThanks.hidden = true;
      app.close();
    }, 4500);
  });
})();

/* ===== Floating contact buttons ===== */
(() => {
  const fab = document.getElementById('fab'), toggle = document.getElementById('fabToggle');
  if (!fab) return;

  [...fab.querySelectorAll('.fab-btn')].forEach((b, i) =>
    b.style.setProperty('--i', i)
  );

  const start = () => setTimeout(() => fab.classList.add('ready'), 600);
  document.readyState === 'complete' ? start() : addEventListener('load', start);

  toggle.addEventListener('click', () => {
    const closed = fab.classList.toggle('closed');
    toggle.setAttribute('aria-expanded', String(!closed));
    toggle.setAttribute('aria-label', closed ? 'Show quick contact buttons' : 'Hide quick contact buttons');
    if (!closed) {
      fab.classList.remove('ready');
      void fab.offsetWidth;
      fab.classList.add('ready');
    }
  });

  if (matchMedia('(max-width:700px)').matches) {
    fab.classList.add('closed');
    toggle.setAttribute('aria-expanded', 'false');
  }
})();
