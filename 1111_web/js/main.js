(function () {
  'use strict';

  /* ---- 輪播 ---- */
  const track = document.getElementById('carouselTrack');
  const cards = track ? Array.from(track.querySelectorAll('.carousel__card')) : [];
  const progressItems = Array.from(document.querySelectorAll('.progress-item'));
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  let currentIndex = 1;
  let autoplayTimer = null;
  const AUTOPLAY_MS = 5000;

  function goToSlide(index) {
    if (!cards.length) return;

    currentIndex = ((index % cards.length) + cards.length) % cards.length;

    cards.forEach(function (card, i) {
      card.classList.toggle('carousel__card--active', i === currentIndex);
    });

    progressItems.forEach(function (item, i) {
      item.classList.toggle('progress-item--active', i === currentIndex);
    });
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { prevSlide(); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { nextSlide(); startAutoplay(); });

  progressItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var slide = parseInt(item.getAttribute('data-slide'), 10);
      goToSlide(slide);
      startAutoplay();
    });
  });

  /* 觸控滑動 */
  if (track) {
    var touchStartX = 0;
    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      var diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? prevSlide() : nextSlide();
      }
      startAutoplay();
    }, { passive: true });

    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
  }

  goToSlide(currentIndex);
  startAutoplay();

  /* ---- 導覽列滾動高亮 ---- */
  var sections = document.querySelectorAll('section[id], footer[id]');
  var navLinks = document.querySelectorAll('.navbar__link');

  function updateActiveNav() {
    var scrollY = window.scrollY + 100;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          var href = link.getAttribute('href');
          link.style.color = href === '#' + id
            ? '#ffffff'
            : 'rgba(255, 255, 255, 0.88)';
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
})();
