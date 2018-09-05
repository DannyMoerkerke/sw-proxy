
navigator.serviceWorker
.register('./sw-proxy.js');

navigator.serviceWorker.ready
.then(() => {
    console.log('sw ready', navigator.serviceWorker);
});

