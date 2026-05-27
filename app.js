(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Per-language metadata + WhatsApp message templates ----
  const META = {
    es: {
      title: 'Punta Mágica · Alojamiento y bienestar en Puerto Escondido, Oaxaca',
      description: 'Villas boutique con espacio privado y alberca en Puerto Escondido. Diseño minimalista, sombra y palmeras. Reserva directo.',
      waBook: 'Hola Punta Mágica, quisiera consultar fechas y reservar.',
      waDates: 'Hola Punta Mágica, quisiera consultar fechas.',
      waWellness: 'Hola Punta Mágica, me interesa saber más sobre bienestar.',
    },
    en: {
      title: 'Punta Mágica · Boutique stays & wellness in Puerto Escondido, Oaxaca',
      description: 'Boutique villas with private space and pool in Puerto Escondido. Minimalist design, shade, and palm trees. Book direct.',
      waBook: 'Hi Punta Mágica, I would like to check dates and book.',
      waDates: 'Hi Punta Mágica, I would like to check dates.',
      waWellness: 'Hi Punta Mágica, I would like to know more about wellness.',
    },
  };

  // ---- Nav scroll state ----
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu ----
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    const setExpanded = (open) => {
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setExpanded(!links.classList.contains('open')));
    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setExpanded(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) setExpanded(false);
    });
  }

  // ---- Hero carousel ----
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dots button');
  let current = 0;
  let timer;
  const go = (i) => {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].removeAttribute('aria-current');
    current = (i + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-current', 'true');
  };
  const startCarousel = () => {
    if (prefersReducedMotion) return;
    timer = setInterval(() => go(current + 1), 5500);
  };
  const stopCarousel = () => clearInterval(timer);
  dots.forEach((d) =>
    d.addEventListener('click', (e) => {
      stopCarousel();
      go(parseInt(e.currentTarget.dataset.i, 10));
      startCarousel();
    })
  );
  // Set initial aria-current
  if (dots[0]) dots[0].setAttribute('aria-current', 'true');
  startCarousel();

  // ---- Gallery filter ----
  const tabs = document.querySelectorAll('.gallery-tab');
  const masonry = document.getElementById('masonry');
  tabs.forEach((t) =>
    t.addEventListener('click', () => {
      tabs.forEach((x) => {
        x.classList.remove('active');
        x.setAttribute('aria-pressed', 'false');
      });
      t.classList.add('active');
      t.setAttribute('aria-pressed', 'true');
      if (masonry) masonry.className = 'masonry filter-' + t.dataset.filter + ' reveal in';
    })
  );
  // Initialize aria-pressed
  tabs.forEach((t) => t.setAttribute('aria-pressed', t.classList.contains('active') ? 'true' : 'false'));

  // ---- Reveal on scroll ----
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  // ---- Reviews marquee: duplicate items for seamless infinite scroll ----
  (function () {
    const track = document.getElementById('reviewsTrack');
    if (!track) return;
    const reviews = Array.from(track.children);
    reviews.forEach((r) => {
      const clone = r.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true'); // duplicate is for visuals only
      track.appendChild(clone);
    });
  })();

  // ---- Animated counters in stats ribbon ----
  const counters = document.querySelectorAll('.ribbon-item .num');
  const setFinal = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const span = el.querySelector('.cnt');
    if (span) span.textContent = target.toFixed(decimals);
  };
  const animateCount = (el) => {
    if (prefersReducedMotion) return setFinal(el);
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const span = el.querySelector('.cnt');
    const duration = 1600;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      span.textContent = (target * ease(t)).toFixed(decimals);
      if (t < 1) requestAnimationFrame(step);
      else span.textContent = target.toFixed(decimals);
    };
    requestAnimationFrame(step);
  };
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCount(e.target);
          countObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((c) => countObserver.observe(c));

  // ---- Hero cursor spotlight ----
  const hero = document.querySelector('.hero');
  if (hero && !prefersReducedMotion) {
    let raf = 0;
    hero.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        hero.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
        raf = 0;
      });
    });
  }

  // ---- Wellness card 3D tilt ----
  document.querySelectorAll('.wellness-card').forEach((card) => {
    if (prefersReducedMotion) return;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ---- Video reel mute toggle ----
  const reelVideo = document.getElementById('reelVideo');
  const reelMute = document.getElementById('reelMute');
  const iconMuted = document.getElementById('iconMuted');
  const iconSound = document.getElementById('iconSound');
  if (reelVideo && reelMute) {
    reelMute.setAttribute('aria-pressed', String(reelVideo.muted));
    reelMute.addEventListener('click', () => {
      reelVideo.muted = !reelVideo.muted;
      reelMute.setAttribute('aria-pressed', String(reelVideo.muted));
      if (iconMuted) iconMuted.style.display = reelVideo.muted ? 'block' : 'none';
      if (iconSound) iconSound.style.display = reelVideo.muted ? 'none' : 'block';
    });
  }

  // ---- WhatsApp link localization ----
  // Links opt in with data-wa="book" | "dates" | "wellness"
  const updateWhatsAppLinks = (lang) => {
    const messages = META[lang];
    document.querySelectorAll('a[data-wa]').forEach((a) => {
      const key = a.dataset.wa;
      const base = a.dataset.waBase || a.getAttribute('href').split('?')[0];
      a.dataset.waBase = base;
      const msg = messages['wa' + key.charAt(0).toUpperCase() + key.slice(1)];
      a.href = msg ? `${base}?text=${encodeURIComponent(msg)}` : base;
    });
  };

  // ---- Language toggle (EN / ES) ----
  const langButtons = document.querySelectorAll('.lang-toggle button');
  const setLang = (lang) => {
    if (lang !== 'en' && lang !== 'es') lang = 'es';
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-en]').forEach((el) => {
      const v = el.getAttribute('data-' + lang);
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll('[data-en-html]').forEach((el) => {
      const v = el.getAttribute('data-' + lang + '-html');
      if (v != null) el.innerHTML = v;
    });

    langButtons.forEach((b) => {
      const isActive = b.dataset.lang === lang;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });

    // Update <title> + <meta description> + og:locale
    document.title = META[lang].title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', META[lang].description);
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', lang === 'es' ? 'es_MX' : 'en_US');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', META[lang].title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', META[lang].description);

    updateWhatsAppLinks(lang);

    try { localStorage.setItem('pm_lang', lang); } catch (e) { /* private mode */ }
  };
  langButtons.forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

  // Initialize from saved preference or browser language
  let initialLang = 'es';
  try {
    const saved = localStorage.getItem('pm_lang');
    if (saved === 'en' || saved === 'es') initialLang = saved;
    else if ((navigator.language || '').toLowerCase().startsWith('en')) initialLang = 'en';
  } catch (e) { /* private mode */ }
  setLang(initialLang);

  // ---- Booking modal ----
  const bookingModal = document.getElementById('bookingModal');
  const bookingFrame = document.getElementById('bookingFrame');
  if (bookingModal && bookingFrame) {
    const bookingOverlay = bookingModal.querySelector('.booking-modal-overlay');
    const bookingClose = bookingModal.querySelector('.booking-modal-close');

    const fmtDate = (d) => d.toISOString().slice(0, 10);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const bookingUrl =
      'https://direct-book.com/properties/puntamagica?locale=en&referrer=canvas' +
      '&items[0][adults]=2&items[0][children]=0&items[0][infants]=0&currency=MXN&trackPage=no' +
      '&checkInDate=' + fmtDate(today) + '&checkOutDate=' + fmtDate(tomorrow);

    const openBooking = (e) => {
      e.preventDefault();
      bookingFrame.src = bookingUrl;
      bookingModal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      bookingClose.focus();
    };

    const closeBooking = () => {
      bookingModal.setAttribute('hidden', '');
      document.body.style.overflow = '';
      bookingFrame.src = '';
    };

    document.querySelectorAll('a[href*="direct-book.com"]').forEach((a) => {
      a.addEventListener('click', openBooking);
    });

    bookingOverlay.addEventListener('click', closeBooking);
    bookingClose.addEventListener('click', closeBooking);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !bookingModal.hasAttribute('hidden')) closeBooking();
    });
  }
})();
