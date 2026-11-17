/* Ongoing projects page interactions.
   Project names, descriptions and image paths are written in ongoing-projects.html.
   This file handles interactions only. */

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const PHONE = '918939200583';
  const q = encodeURIComponent;

  // Preloader
  addEventListener('load', () => {
    const preloader = $('#preloader');
    if (preloader) {
      setTimeout(() => preloader.classList.add('hidden'), 800);
    }
  });

  // Header, scroll progress and back-to-top
  const header = $('#header');
  const bar = $('#progress');
  const toTop = $('#toTop');

  const onScroll = () => {
    const y = scrollY;
    const h = document.documentElement.scrollHeight - innerHeight;

    if (header) header.classList.toggle('sc', y > 20);
    if (toTop) toTop.classList.toggle('show', y > 500);

    if (bar) {
      bar.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    }
  };

  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile menu
  const burger = $('#burger');
  const nav = $('#nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');

      burger.classList.toggle('x', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    $$('#nav a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.classList.remove('x');
        document.body.style.overflow = '';
      });
    });
  }

  // Reveal animations and counters
  const count = el => {
    const end = Number(el.dataset.count || 0);
    const start = performance.now();

    const tick = now => {
      const p = Math.min((now - start) / 1400, 1);

      el.textContent = Math.round(
        end * (1 - Math.pow(1 - p, 3))
      ).toLocaleString('en-IN');

      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        el.classList.add('in');
        el.classList.add('done');

        if (el.dataset.count) count(el);

        io.unobserve(el);
      });
    }, { threshold: 0.12 });

    $$('[data-r], [data-count]').forEach(el => io.observe(el));

  } else {
    $$('[data-r]').forEach(el => {
      el.classList.add('in', 'done');
    });

    $$('[data-count]').forEach(count);
  }

  // Enquiry popup
  const modal = $('#enquiryModal');
  const form = $('#enquiryForm');
  const thanks = modal ? $('.thanks', modal) : null;

  let lastFocus = null;

  const openModal = () => {
    if (!modal) return;

    lastFocus = document.activeElement;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    const firstInput = $('input', modal);

    if (firstInput) {
      setTimeout(() => firstInput.focus(), 200);
    }
  };

  const closeModal = () => {
    if (!modal) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');

    if (lastFocus) lastFocus.focus();
  };

  $$('[data-open-enquiry]').forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  $$('[data-close]').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }

  addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Project enquiry buttons
  document.addEventListener('click', e => {
    const button = e.target.closest('[data-ask]');

    if (!button || !form) return;

    const project = button.dataset.ask || 'ongoing project';
    const kind = button.dataset.kind;

    const interest = form.elements.interest;
    const message = form.elements.message;

    if (message) {
      message.value = kind === 'int'
        ? `I am interested in an interior project similar to ${project}.`
        : `I am interested in ${project}. Please share more details.`;
    }

    if (interest) {
      const desired = kind === 'int'
        ? 'Interiors'
        : (
            button.dataset.type === 'Villas'
              ? 'Villa construction'
              : 'Layout Promoting'
          );

      [...interest.options].forEach(option => {
        if (option.text.trim() === desired) {
          interest.value = option.value || option.text;
        }
      });
    }

    openModal();
  });

  // Enquiry form submission to WhatsApp
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const d = Object.fromEntries(new FormData(form));

      const message =
        `New enquiry from website\n` +
        `Name: ${d.name}\n` +
        `Phone: ${d.phone}\n` +
        `Email: ${d.email || '-'}\n` +
        `Interested in: ${d.interest}\n` +
        `Message: ${d.message || '-'}`;

      window.open(
        `https://wa.me/${PHONE}?text=${q(message)}`,
        '_blank',
        'noopener'
      );

      form.reset();

      if (thanks) {
        thanks.hidden = false;

        setTimeout(() => {
          thanks.hidden = true;
          closeModal();
        }, 3000);
      } else {
        closeModal();
      }
    });
  }

  // Floating contact buttons
  const fab = $('#fab');
  const toggle = $('#fabToggle');

  if (fab && toggle) {
    $$('.fab-btn', fab).forEach((button, i) => {
      button.style.setProperty('--i', i);
    });

    const ready = () => {
      setTimeout(() => fab.classList.add('ready'), 600);
    };

    document.readyState === 'complete'
      ? ready()
      : addEventListener('load', ready);

    toggle.addEventListener('click', () => {
      const closed = fab.classList.toggle('closed');

      toggle.setAttribute('aria-expanded', String(!closed));

      toggle.setAttribute(
        'aria-label',
        closed
          ? 'Show quick contact buttons'
          : 'Hide quick contact buttons'
      );
    });

    if (matchMedia('(max-width:700px)').matches) {
      fab.classList.add('closed');
      toggle.setAttribute('aria-expanded', 'false');
    }
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
