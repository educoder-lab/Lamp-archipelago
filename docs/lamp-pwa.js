/* PWA 登録＋オフライン表示 */
(function () {
  function register() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js', { scope: './' }).catch(() => {});
    });
  }

  function markOffline(el) {
    if (!el) return;
    const on = () => {
      const base = el.textContent.replace(/\s*·\s*オフライン$/,'');
      el.textContent = navigator.onLine ? base : base + ' · オフライン';
    };
    window.addEventListener('online', on);
    window.addEventListener('offline', on);
    on();
  }

  register();
  global.LampPwa = { markOffline };
})(typeof window !== 'undefined' ? window : globalThis);
