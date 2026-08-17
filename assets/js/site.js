(() => {
  const q = (s, p=document) => p.querySelector(s);
  const qa = (s, p=document) => [...p.querySelectorAll(s)];

  // Force diagonal arrows to render as text rather than iOS emoji.
  const arrowWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (arrowWalker.nextNode()) {
    const node = arrowWalker.currentNode;
    if (node.nodeValue && node.nodeValue.includes('↗')) {
      node.nodeValue = node.nodeValue.replace(/\u2197(?!\uFE0E)/g, '\u2197\uFE0E');
    }
  }

  // Loader — full intro only once per browsing session so page-to-page movement stays fast.
  const loader = q('#loader');
  const seenIntro = sessionStorage.getItem('skyIntroSeen') === '1';
  if (seenIntro && loader) { loader.style.display = 'none'; }
  window.addEventListener('load', () => {
    if (seenIntro) return;
    setTimeout(() => { loader?.classList.add('is-done'); sessionStorage.setItem('skyIntroSeen','1'); }, 520);
  });

  // nav state
  const nav = q('.site-nav');
  const toggle = q('.nav-toggle');
  const mobile = q('.mobile-panel');
  const setNav = () => nav?.classList.toggle('scrolled', window.scrollY > 24);
  setNav(); addEventListener('scroll', setNav, {passive:true});
  toggle?.addEventListener('click', () => {
    const open = !toggle.classList.contains('active');
    toggle.classList.toggle('active', open);
    nav?.classList.toggle('menuing', open);
    mobile?.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // page transition
  const wipe = q('.page-wipe');
  qa('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || a.target === '_blank') return;
    a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      wipe?.classList.add('go');
      setTimeout(() => location.href = href, 430);
    });
  });

  // scroll progress
  const progress = q('.scroll-progress');
  const scrollProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? scrollY / max : 0;
    if(progress) progress.style.transform = `scaleX(${p})`;
  };
  addEventListener('scroll', scrollProgress, {passive:true}); scrollProgress();

  // reveal observer
  const observer = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); observer.unobserve(en.target); }
  }), {threshold:.12, rootMargin:'0px 0px -6% 0px'});
  qa('.reveal').forEach(el => observer.observe(el));

  // cursor
  if (matchMedia('(pointer:fine)').matches) {
    const c = q('.cursor'), label = q('.cursor-label');
    let tx=0,ty=0,x=0,y=0;
    addEventListener('mousemove', e => { tx=e.clientX; ty=e.clientY; });
    const loop=()=>{x+=(tx-x)*.18;y+=(ty-y)*.18;if(c)c.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`;if(label)label.style.transform=`translate(${tx}px,${ty}px) translate(-50%,-50%)`;requestAnimationFrame(loop)}; loop();
    qa('a,button,[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter',()=>{ c?.classList.add('is-big'); if(label){label.textContent=el.dataset.cursor||'';label.style.opacity=el.dataset.cursor?'1':'0';}});
      el.addEventListener('mouseleave',()=>{ c?.classList.remove('is-big'); if(label){label.style.opacity='0';}});
    });
  }

  // Hero collage — continuous drift + eased pointer parallax.
  // It remains alive even when the pointer is not directly over the snapshots.
  const stage = q('.hero-stack');
  const hero = q('.hero');
  if(stage && hero && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    const cards = qa('.hero-card', stage);
    const states = cards.map(() => ({x:0,y:0,r:0}));
    let targetX = 0, targetY = 0;

    if(matchMedia('(pointer:fine)').matches){
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        targetX = Math.max(-.5, Math.min(.5, (e.clientX-r.left)/r.width-.5));
        targetY = Math.max(-.5, Math.min(.5, (e.clientY-r.top)/r.height-.5));
      }, {passive:true});
      hero.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });
    }

    const depths = [.74, 1.12, 1.38, .92];
    const animateCards = now => {
      cards.forEach((card,i) => {
        const depth = depths[i] || 1;
        const floatX = Math.sin(now*.00048 + i*1.73) * (3.2 + i*.65);
        const floatY = Math.cos(now*.00042 + i*1.21) * (4.2 + i*.72);
        const driftR = Math.sin(now*.00036 + i*1.43) * .55;
        const dx = targetX * 24 * depth + floatX;
        const dy = targetY * 17 * depth + floatY;
        states[i].x += (dx - states[i].x) * .065;
        states[i].y += (dy - states[i].y) * .065;
        states[i].r += (driftR - states[i].r) * .05;
        card.style.setProperty('--move-x', `${states[i].x.toFixed(2)}px`);
        card.style.setProperty('--move-y', `${states[i].y.toFixed(2)}px`);
        card.style.setProperty('--drift-r', `${states[i].r.toFixed(2)}deg`);
      });
      requestAnimationFrame(animateCards);
    };
    requestAnimationFrame(animateCards);
  }

  // draggable case strip
  qa('.case-strip').forEach(strip=>{
    let down=false,startX=0,startScroll=0;
    strip.addEventListener('pointerdown',e=>{down=true;startX=e.clientX;startScroll=strip.scrollLeft;strip.classList.add('dragging');strip.setPointerCapture(e.pointerId)});
    strip.addEventListener('pointermove',e=>{if(!down)return;strip.scrollLeft=startScroll-(e.clientX-startX)*1.3});
    const up=()=>{down=false;strip.classList.remove('dragging')}; strip.addEventListener('pointerup',up);strip.addEventListener('pointercancel',up);
  });

  // service row click on touch
  qa('.service-row').forEach(row=>row.addEventListener('click',()=>row.classList.toggle('open')));

  // work filters
  qa('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{
    qa('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
    const f=btn.dataset.filter;
    qa('.portfolio-card').forEach(card=>card.classList.toggle('hide', f!=='all' && !card.dataset.cat.includes(f)));
  }));

  // mailto contact form fallback
  const form=q('#contactForm');
  form?.addEventListener('submit',e=>{
    e.preventDefault(); const data=new FormData(form);
    const subject=`New Sky Communications enquiry — ${data.get('brand')||'Website'}`;
    const body=`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nBrand: ${data.get('brand')}\nService: ${data.get('service')}\n\n${data.get('message')}`;
    location.href=`mailto:info@skycommunications.co.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  // year
  qa('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
})();
