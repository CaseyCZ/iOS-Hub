(() => {
  const MEASUREMENT_ID = 'G-SZTERTRTCE';
  const CONSENT_KEY = 'ioshub-analytics-consent-v1';
  const ANALYTICS_PAGE_TITLE = String(document.querySelector('meta[name="analytics-page-title"]')?.content || document.title || 'iOS Hub').trim() || 'iOS Hub';
  const ANALYTICS_PAGE_LOCATION = `${window.location.origin}${window.location.pathname}${window.location.search}`;
  let banner = null;
  let loaded = false;

  const COPY = {
    en: {
      title: 'Analytics cookies',
      text: 'iOS Hub uses Google Analytics only if you choose Accept. Rejecting keeps analytics disabled.',
      accept: 'Accept analytics',
      reject: 'Reject',
      privacy: 'Privacy & Cookies'
    },
    cs: {
      title: 'Analytické cookies',
      text: 'iOS Hub používá Google Analytics pouze pokud zvolíte Přijmout. Odmítnutím zůstane analytika vypnutá.',
      accept: 'Přijmout analytiku',
      reject: 'Odmítnout',
      privacy: 'Soukromí a cookies'
    },
    de: {
      title: 'Analyse-Cookies',
      text: 'iOS Hub verwendet Google Analytics nur mit Ihrer Zustimmung. Bei Ablehnung bleibt die Analyse deaktiviert.',
      accept: 'Analyse akzeptieren',
      reject: 'Ablehnen',
      privacy: 'Datenschutz & Cookies'
    },
    es: {
      title: 'Cookies de análisis',
      text: 'iOS Hub usa Google Analytics solo si eliges Aceptar. Si rechazas, el análisis permanece desactivado.',
      accept: 'Aceptar análisis',
      reject: 'Rechazar',
      privacy: 'Privacidad y cookies'
    },
    fr: {
      title: 'Cookies de mesure',
      text: 'iOS Hub utilise Google Analytics uniquement si vous l’acceptez. En cas de refus, la mesure reste désactivée.',
      accept: 'Accepter la mesure',
      reject: 'Refuser',
      privacy: 'Confidentialité et cookies'
    }
  };

  function readConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (_) { return null; }
  }

  function writeConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (_) {}
  }

  function language() {
    const value = String(document.documentElement.lang || 'en').toLowerCase().split('-')[0];
    return COPY[value] ? value : 'en';
  }

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function loadAnalytics() {
    if (loaded || document.querySelector('script[data-ioshub-analytics]')) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    gtag('js', new Date());
    gtag('config', MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_title: ANALYTICS_PAGE_TITLE,
      page_location: ANALYTICS_PAGE_LOCATION
    });

    const script = document.createElement('script');
    script.async = true;
    script.dataset.ioshubAnalytics = 'true';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
    document.head.appendChild(script);
  }

  function disableAnalytics() {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      });
    }

    const cookieNames = ['_ga', '_ga_SZTERTRTCE'];
    for (const name of cookieNames) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    }
  }

  function closeBanner() {
    if (!banner) return;
    banner.remove();
    banner = null;
  }

  function setConsent(value) {
    writeConsent(value);
    if (value === 'granted') loadAnalytics();
    else disableAnalytics();
    closeBanner();
  }

  function showBanner(force = false) {
    if (banner) return;
    if (!force && readConsent()) return;

    const copy = COPY[language()];
    banner = document.createElement('section');
    banner.className = 'privacy-consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-modal', 'true');
    banner.setAttribute('aria-labelledby', 'privacyConsentTitle');
    banner.innerHTML = `
      <div class="privacy-consent-copy">
        <strong id="privacyConsentTitle">${copy.title}</strong>
        <span>${copy.text}</span>
      </div>
      <div class="privacy-consent-actions">
        <button type="button" class="btn primary" data-consent-accept>${copy.accept}</button>
        <button type="button" class="btn secondary" data-consent-reject>${copy.reject}</button>
        <a class="btn ghost" href="privacy.html">${copy.privacy}</a>
      </div>
    `;

    banner.querySelector('[data-consent-accept]')?.addEventListener('click', () => setConsent('granted'));
    banner.querySelector('[data-consent-reject]')?.addEventListener('click', () => setConsent('denied'));
    document.body.appendChild(banner);
  }

  function bindSettings() {
    document.querySelectorAll('[data-cookie-settings]').forEach(button => {
      button.addEventListener('click', event => {
        event.preventDefault();
        showBanner(true);
      });
    });
  }

  function init() {
    bindSettings();
    const consent = readConsent();
    if (consent === 'granted') loadAnalytics();
    else if (!consent) showBanner();
  }

  window.iOSHubAnalytics = Object.freeze({
    consent: () => readConsent(),
    showSettings: () => showBanner(true)
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
