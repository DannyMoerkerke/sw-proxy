import responses from '/sw-proxy-responses.js';

const sendResponses = responses => navigator.serviceWorker.controller.postMessage({responses});

navigator.serviceWorker
.register('./sw-proxy.js');

navigator.serviceWorker.ready
.then(() => {
    console.log('sw ready', navigator.serviceWorker);

    navigator.serviceWorker.onmessage = message => {
        console.log('got message', message);
        if(message.data === 'request for responses') {
            sendResponses(responses);
        }
    };

    try {
        sendResponses(responses);
    }
    catch(e) {
        console.log('[sw-proxy] service worker not yet ready to receive responses');
    }
});

