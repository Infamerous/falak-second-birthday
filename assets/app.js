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

  function init(){
    buildStarField();
    buildMarquee();
    initScrollReveal();

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
