navigator.serviceWorker
.register('./sw-proxy.js');

navigator.serviceWorker.ready
.then(() => {
  console.log('[SW-PROXY] ready');
});

