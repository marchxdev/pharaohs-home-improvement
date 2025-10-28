// ===== Quick Estimate modal =====
(function () {
  const openBtn = document.getElementById('openEstimate');
  const modal = document.getElementById('estimateModal');
  const closeBtn = document.getElementById('closeEstimate');
  const backdrop = document.getElementById('estimateBackdrop');
  const firstField = document.getElementById('est-name');

  function openModal(e){
    if (e) e.preventDefault();
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(()=> firstField && firstField.focus(), 50);
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn && openBtn.addEventListener('click', openModal);
  closeBtn && closeBtn.addEventListener('click', closeModal);
  backdrop && backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeModal(); });
})();

// ===== Carousel logic =====
(function() {
  const root = document.querySelector('#lighting .carousel');
  if (!root) return;
  const track = root.querySelector('.carousel-track');
  const slides = Array.from(root.querySelectorAll('.slide'));
  const prevBtn = root.querySelector('.prev');
  const nextBtn = root.querySelector('.next');
  const dots = Array.from(root.querySelectorAll('.dot'));
  let current = 0;
  let timer = null;

  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((s, i) => s.classList.toggle('is-active', i === current));
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
      d.tabIndex = i === current ? 0 : -1;
    });
  }

  function go(n) { current = (n + slides.length) % slides.length; update(); }
  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  function start() { timer = setInterval(next, 5000); }
  function stop() { clearInterval(timer); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));

  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  update();
  start();
})();

// ===== Gallery Lightbox (images + videos) =====
(function() {
  const items = Array.from(document.querySelectorAll('#gallery .gallery-item'));
  if (!items.length) return;

  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.id = 'lightbox';
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-nav prev" aria-label="Previous">&#10094;</button>
    <div class="lightbox-content" id="lbContent"></div>
    <button class="lightbox-nav next" aria-label="Next">&#10095;</button>
  `;
  document.body.appendChild(lb);
  const closeBtn = lb.querySelector('.lightbox-close');
  const prevBtn = lb.querySelector('.lightbox-nav.prev');
  const nextBtn = lb.querySelector('.lightbox-nav.next');
  const content = lb.querySelector('#lbContent');

  let index = 0;

  function render(i) {
    const el = items[i];
    const type = el.getAttribute('data-type');
    const src = el.getAttribute('data-src');
    const poster = el.getAttribute('data-poster') || '';

    if (type === 'video') {
      content.innerHTML = '';
      const v = document.createElement('video');
      v.controls = true;
      v.autoplay = true;
      if (poster) v.poster = poster;
      v.src = src;
      content.appendChild(v);
    } else {
      content.innerHTML = `<img src="${src}" alt="" />`;
    }
  }

  function open(i) { index = i; render(index); lb.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function close() { lb.classList.remove('is-open'); content.innerHTML = ''; document.body.style.overflow = ''; }
  function prev() { index = (index - 1 + items.length) % items.length; render(index); }
  function next() { index = (index + 1) % items.length; render(index); }

  items.forEach((it, i) => {
    it.addEventListener('click', () => open(i));
    it.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });
  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
})();
