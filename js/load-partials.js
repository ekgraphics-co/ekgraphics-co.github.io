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
  document.addEventListener('click', handleInternalNavigation, true);
  revealWhenReady();
});
