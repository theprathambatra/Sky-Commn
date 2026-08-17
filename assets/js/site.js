(() => {
  const q = (s, p = document) => p.querySelector(s);
  const qa = (s, p = document) => [...p.querySelectorAll(s)];

  const loader = q('#loader');
  const seen = sessionStorage.getItem('skyIntroSeen') === '1';
  if (seen && loader) loader.style.display = 'none';
  window.addEventListener('load', () => {
    if (!loader || seen) return;
    setTimeout(() => {
      loader.classList.add('is-done');
      sessionStorage.setItem('skyIntroSeen', '1');
    }, 320);
  });

  const nav = q('.site-nav');
  const toggle = q('.nav-toggle');
  const panel = q('.mobile-panel');

  const updateNav = () => nav?.classList.toggle('scrolled', window.scrollY > 18);
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  const closeMenu = () => {
    toggle?.classList.remove('active');
    nav?.classList.remove('menuing');
    panel?.classList.remove('open');
    document.body.classList.remove('nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
  };

  toggle?.addEventListener('click', () => {
    const opening = !toggle.classList.contains('active');
    if (!opening) return closeMenu();
    toggle.classList.add('active');
    nav?.classList.add('menuing');
    panel?.classList.add('open');
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
  });
  qa('.mobile-panel a').forEach(a => a.addEventListener('click', closeMenu));

  const progress = q('.scroll-progress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const ratio = max > 0 ? scrollY / max : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    qa('.reveal').forEach(el => observer.observe(el));
  } else {
    qa('.reveal').forEach(el => el.classList.add('is-in'));
  }

  const hero = q('.hero');
  const cards = qa('.hero-card');
  if (hero && cards.length && matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 1.2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 1.2;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
    const depths = [9, 14, 11, 0];
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      cards.forEach((card, i) => {
        const d = depths[i] || 0;
        card.style.setProperty('--move-x', `${(cx * d).toFixed(2)}px`);
        card.style.setProperty('--move-y', `${(cy * d * .72).toFixed(2)}px`);
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  qa('.case-strip').forEach(strip => {
    let active = false;
    let startX = 0;
    let startScroll = 0;
    strip.addEventListener('pointerdown', e => {
      active = true;
      startX = e.clientX;
      startScroll = strip.scrollLeft;
      strip.classList.add('dragging');
      strip.setPointerCapture?.(e.pointerId);
    });
    strip.addEventListener('pointermove', e => {
      if (!active) return;
      strip.scrollLeft = startScroll - (e.clientX - startX) * 1.15;
    });
    const end = () => {
      active = false;
      strip.classList.remove('dragging');
    };
    strip.addEventListener('pointerup', end);
    strip.addEventListener('pointercancel', end);
  });

  qa('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
    qa('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter || 'all';
    qa('.portfolio-card').forEach(card => {
      const cats = card.dataset.cat || '';
      card.classList.toggle('hide', filter !== 'all' && !cats.includes(filter));
    });
  }));

  const form = q('#contactForm');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = `New Sky Communications enquiry: ${data.get('brand') || 'Website'}`;
    const body = [
      `Name: ${data.get('name') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Brand: ${data.get('brand') || ''}`,
      `Service: ${data.get('service') || ''}`,
      '',
      `${data.get('message') || ''}`
    ].join('\n');
    window.location.href = `mailto:info@skycommunications.co.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  qa('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
