(async () => {
  const registration = await navigator.serviceWorker.register('./swopr.js');

  try {
    await navigator.serviceWorker.ready

    console.log('[SWOPR] proxy server ready');
  }
  catch(err) {
    console.error('error registering SWOPR:', err)
  }

  window.addEventListener('beforeunload', async () => {
    await registration.unregister();
  });
})();
