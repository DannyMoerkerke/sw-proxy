navigator.serviceWorker
.register('./swopr.js');

navigator.serviceWorker.ready
.then(() => {
  console.log('[SW-PROXY] ready');
});

