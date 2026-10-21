(function(){
  const basePath = './pictures/';
  const imageFiles = [
    'IMG_1674.PNG', 'IMG_1676.PNG', 'IMG_1678.PNG',
    'IMG_1679.PNG', 'IMG_1681.PNG', 'IMG_1682.PNG', 'IMG_1683.PNG',
    'IMG_1684.PNG', 'IMG_1685.PNG', 'IMG_1686.PNG'
  ];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildStarField(){
    const field = document.getElementById('starField');
    if (!field) return;
    if (reducedMotion) field.classList.add('static');
    for (let i = 0; i < 90; i++){
      const s = document.createElement('div');
      s.className = 'star';
      s.style.left = Math.random() * 100 + 'vw';
      s.style.top = Math.random() * 100 + 'vh';
      s.style.animationDuration = (Math.random() * 4 + 3) + 's';
      s.style.animationDelay = (Math.random() * 4) + 's';
      field.appendChild(s);
    }
  }

  function fillRow(trackId, files){
    const track = document.getElementById(trackId);
    if (!track) return;
    files.concat(files).forEach((file) => {
      const img = document.createElement('img');
      img.src = basePath + file;
      img.alt = 'A memory from this year';
      img.loading = 'lazy';
      track.appendChild(img);
    });
  }

  function buildMarquee(){
    fillRow('marqueeTop', imageFiles);
    fillRow('marqueeBottom', imageFiles.slice().reverse());
  }

  let lastDotX = null, lastDotY = null;
  let lastPhotoX = null, lastPhotoY = null;
  const DOT_DISTANCE = 11;
  const PHOTO_DISTANCE = 90;
  const PHOTO_SIZE = 78;

  function spawnDot(x, y){
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    dot.style.left = (x - 2) + 'px';
    dot.style.top = (y - 2) + 'px';
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 700);
  }

  function spawnPhoto(x, y){
    const wrap = document.createElement('div');
    wrap.className = 'trail-photo';
    const tilt = (Math.random() * 16 - 8).toFixed(1);
    wrap.style.setProperty('--tilt', tilt + 'deg');
    wrap.style.width = PHOTO_SIZE + 'px';
    wrap.style.height = (PHOTO_SIZE * 1.15) + 'px';
    wrap.style.left = (x - PHOTO_SIZE / 2) + 'px';
    wrap.style.top = (y - PHOTO_SIZE * 0.6) + 'px';

    const img = document.createElement('img');
    img.src = basePath + imageFiles[Math.floor(Math.random() * imageFiles.length)];
    wrap.appendChild(img);

    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 1300);
  }

  function onPointerMove(x, y){
    if (lastDotX === null){ lastDotX = x; lastDotY = y; }
    if (lastPhotoX === null){ lastPhotoX = x; lastPhotoY = y; }

    const dDot = Math.hypot(x - lastDotX, y - lastDotY);
    if (dDot >= DOT_DISTANCE){
      spawnDot(x, y);
      lastDotX = x; lastDotY = y;
    }
    const dPhoto = Math.hypot(x - lastPhotoX, y - lastPhotoY);
    if (dPhoto >= PHOTO_DISTANCE){
      spawnPhoto(x, y);
      lastPhotoX = x; lastPhotoY = y;
    }
  }

  function onMouseMove(e){ onPointerMove(e.clientX, e.clientY); }
  function onTouchMove(e){ if (e.touches.length) onPointerMove(e.touches[0].clientX, e.touches[0].clientY); }
  function onLeave(){ lastDotX = lastDotY = lastPhotoX = lastPhotoY = null; }

  const progressBar = document.getElementById('progressBar');
  function updateProgress(){
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  }

  function initScrollReveal(){
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
    }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => observer.observe(el));

    const heroChart = document.querySelector('.section-hero .reveal');
    if (heroChart) requestAnimationFrame(() => setTimeout(() => heroChart.classList.add('is-visible'), 80));
  }

  function heartSVG(withFace){
    const face = withFace
      ? '<circle cx="24" cy="23" r="2.4" fill="var(--void)"/>'
        + '<circle cx="40" cy="23" r="2.4" fill="var(--void)"/>'
        + '<path d="M28 31 Q32 36 36 31" stroke="var(--void)" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
      : '';
    return '<svg viewBox="0 0 64 56" xmlns="http://www.w3.org/2000/svg">'
      + '<path d="M32 50 C10 34 4 18 16 10 C24 5 32 10 32 16 C32 10 40 5 48 10 C60 18 54 34 32 50 Z" '
      + 'fill="var(--love)" stroke="var(--starlight)" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>'
      + face
      + '</svg>';
  }

  function spawnFloatingHeart(h1){
    const rect = h1.getBoundingClientRect();
    const wrap = document.createElement('div');
    wrap.className = 'heart-wrap floating';
    const size = 14 + Math.random() * 6;
    wrap.style.width = size + 'px';
    wrap.style.height = size + 'px';
    wrap.style.left = (rect.left + Math.random() * rect.width) + 'px';
    wrap.style.top = (rect.top + rect.height * (0.3 + Math.random() * 0.4)) + 'px';
    wrap.style.setProperty('--drift', (Math.random() * 40 - 20) + 'px');
    wrap.innerHTML = heartSVG(false);
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 1800);
  }

  function spawnHeartBurst(){
    const cols = 4, rows = 3;
    const cellW = window.innerWidth / cols;
    const cellH = window.innerHeight / rows;
    const cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push({ c, r });
    for (let i = cells.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = cells[i]; cells[i] = cells[j]; cells[j] = tmp;
    }
    const count = Math.min(7, cells.length);
    const pad = 0.28;

    cells.slice(0, count).forEach((cell, i) => {
      setTimeout(() => {
        const x = (cell.c + pad + Math.random() * (1 - 2 * pad)) * cellW;
        const y = (cell.r + pad + Math.random() * (1 - 2 * pad)) * cellH;
        const wrap = document.createElement('div');
        wrap.className = 'heart-wrap popping';
        const size = 42 + Math.random() * 22;
        wrap.style.width = size + 'px';
        wrap.style.height = size + 'px';
        wrap.style.left = x + 'px';
        wrap.style.top = y + 'px';
        wrap.style.setProperty('--drift', (Math.random() * 30 - 15) + 'px');
        wrap.innerHTML = heartSVG(true);
        document.body.appendChild(wrap);
        setTimeout(() => wrap.remove(), 1900);
      }, i * 70);
    });
  }

  function initFalakHearts(){
    const h1 = document.querySelector('.chart-core h1');
    if (!h1) return;
    let spawnTimer = null;

    h1.addEventListener('mouseenter', () => {
      h1.classList.add('loved');
      spawnFloatingHeart(h1);
      spawnTimer = setInterval(() => spawnFloatingHeart(h1), 220);
    });

    h1.addEventListener('mouseleave', () => {
      h1.classList.remove('loved');
      if (spawnTimer){ clearInterval(spawnTimer); spawnTimer = null; }
    });

    h1.addEventListener('click', () => spawnHeartBurst());
  }

  function init(){
    buildStarField();
    buildMarquee();
    initScrollReveal();
    initFalakHearts();

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    if (!reducedMotion){
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('touchmove', onTouchMove, { passive: true });
      document.addEventListener('mouseleave', onLeave);
      document.addEventListener('touchend', onLeave);
      document.addEventListener('touchcancel', onLeave);
    } else {
      document.body.classList.add('no-trail');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
