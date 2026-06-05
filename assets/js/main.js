/* ============================================================
   Frq — main.js
   Shared behavior across pages: join modal, mobile nav,
   scroll-reveal animations, and Formspree form submission.
   Pure vanilla JS, no dependencies. Every function guards for
   missing elements so it can be safely loaded on any page.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- join modal ---------- */
  function openModal() {
    var modal = document.getElementById('modal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    var first = modal.querySelector('input, button, select');
    if (first) first.focus();
  }

  function closeModal() {
    var modal = document.getElementById('modal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // expose for inline onclick handlers
  window.openModal = openModal;
  window.closeModal = closeModal;

  var modal = document.getElementById('modal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  /* ---------- mobile hamburger menu ---------- */
  function toggleMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;
    var isOpen = menu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.remove('open');
    if (toggle) {
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  window.toggleMenu = toggleMenu;
  window.closeMenu = closeMenu;

  // close mobile menu when a link inside it is tapped
  var mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        // links that open the modal handle their own state
        if (!link.hasAttribute('data-modal')) closeMenu();
      });
    });
  }

  /* ---------- escape key closes overlays ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
      closeMenu();
    }
  });

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // no IO support — just show everything
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- lightweight toast (used by "coming soon" OAuth) ---------- */
  function toast(message) {
    var note = document.createElement('div');
    note.textContent = message;
    note.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);' +
      'background:#b49eff;color:#15112a;padding:0.75rem 1.5rem;font-family:"DM Mono",monospace;' +
      'font-size:13px;z-index:999;letter-spacing:0.04em;max-width:90vw;text-align:center;';
    document.body.appendChild(note);
    setTimeout(function () { note.remove(); }, 3500);
  }
  window.toast = toast;

  // OAuth buttons aren't wired to an identity provider yet — nudge to the form
  window.comingSoon = function () {
    toast("login coming soon — drop your email below and we'll reach out.");
  };

  /* ---------- Formspree submission ---------- *
   * Any <form data-formspree> is intercepted and submitted via fetch so we
   * can show an inline thank-you / error without redirecting the user.
   * The form's `action` should point at the Formspree endpoint.
   */
  function wireForm(form) {
    var statusEl = form.querySelector('.form-status');
    var submitBtn = form.querySelector('[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : '';

    function setStatus(msg, kind) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className = 'form-status ' + (kind || '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setStatus('');

      // guard: make sure the founder swapped in a real Formspree ID
      if (form.action.indexOf('REPLACE_WITH_FORM_ID') !== -1) {
        setStatus("almost there — the form isn't connected yet. check back soon.", 'error');
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'sending…'; }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          // hide the inputs, show a clean thank-you in their place
          var fields = form.querySelector('[data-form-fields]');
          if (fields) fields.style.display = 'none';
          setStatus("you're on the list. we'll reach out when your frequency's ready.", 'success');
        } else {
          return res.json().then(function (data) {
            var msg = (data && data.errors)
              ? data.errors.map(function (er) { return er.message; }).join(', ')
              : 'something glitched. try again in a sec.';
            setStatus(msg, 'error');
          });
        }
      }).catch(function () {
        setStatus("couldn't reach the server. check your connection and try again.", 'error');
      }).finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitLabel; }
      });
    });
  }

  document.querySelectorAll('form[data-formspree]').forEach(wireForm);

  /* ---------- auto-fill timezone selects ---------- *
   * Pre-select the visitor's timezone so circle matching is one less step.
   */
  try {
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      document.querySelectorAll('select[name="timezone"]').forEach(function (sel) {
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].value === tz) { sel.selectedIndex = i; break; }
        }
      });
    }
  } catch (e) { /* Intl not available — leave default */ }
})();
