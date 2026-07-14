function loadPartial(containerSelector, partialPath) {
  fetch(partialPath)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to load ' + partialPath);
      }
      return response.text();
    })
    .then(function (html) {
      document.querySelector(containerSelector).innerHTML = html;
    })
    .catch(function (error) {
      console.error(error);
    });
}

function revealPage() {
  document.body.classList.add('page-ready');
}

function closeFullscreenOverlay() {
  var overlay = document.querySelector('.fullscreen-overlay');
  if (!overlay) {
    return;
  }

  overlay.classList.remove('active');
  overlay.addEventListener('transitionend', function () {
    overlay.remove();
  }, { once: true });
}

function openFullscreenImage(img) {
  closeFullscreenOverlay();

  var overlay = document.createElement('div');
  overlay.className = 'fullscreen-overlay';
  overlay.tabIndex = -1;

  var clone = img.cloneNode(true);
  clone.removeAttribute('width');
  clone.removeAttribute('height');
  clone.style.cursor = 'zoom-out';
  overlay.appendChild(clone);

  overlay.addEventListener('click', function () {
    closeFullscreenOverlay();
  });

  document.body.appendChild(overlay);
  requestAnimationFrame(function () {
    overlay.classList.add('active');
  });
}

function handleFullscreenClick(event) {
  var overlay = event.target.closest('.fullscreen-overlay');
  if (overlay) {
    closeFullscreenOverlay();
    event.preventDefault();
    event.stopPropagation();
    return true;
  }

  var image = event.target.closest('.gallery-card img');
  if (!image) {
    return false;
  }

  var isOverlayOpen = document.querySelector('.fullscreen-overlay');
  if (isOverlayOpen) {
    closeFullscreenOverlay();
    event.preventDefault();
    event.stopPropagation();
    return true;
  }

  openFullscreenImage(image);
  event.preventDefault();
  event.stopPropagation();
  return true;
}

function handleInternalNavigation(event) {
  var anchor = event.target.closest('a');
  if (!anchor || !anchor.href) {
    return;
  }

  var href = anchor.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || anchor.target) {
    return;
  }

  var linkUrl = new URL(anchor.href, window.location.href);
  if (linkUrl.origin !== window.location.origin) {
    return;
  }

  if (linkUrl.pathname === window.location.pathname && linkUrl.hash) {
    return;
  }

  event.preventDefault();
  document.body.classList.add('fade-out');
  window.setTimeout(function () {
    window.location.href = href;
  }, 280);
}

function revealWhenReady() {
  revealPage();
}

document.addEventListener('DOMContentLoaded', function () {
  loadPartial('[data-partial="header"]', 'partials/header.html');
  loadPartial('[data-partial="footer"]', 'partials/footer.html');
  document.addEventListener('click', function (event) {
    if (handleFullscreenClick(event)) {
      return;
    }
    handleInternalNavigation(event);
  }, true);

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      closeFullscreenOverlay();
    }
  });

  revealWhenReady();
});
