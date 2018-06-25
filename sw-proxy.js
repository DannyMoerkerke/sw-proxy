let responses = [];

const handleInstall = () => {
    console.log('[sw-proxy] service worker installed');
    self.skipWaiting()
};

const handleActivate = () => {
    console.log('[sw-proxy] service worker activated', responses.length);
    self.clients.claim();

    if(!responses.length) {
        self.clients.matchAll()
        .then(clients => clients.forEach(client => client.postMessage('request for responses')))
    }
};

const handleMessage = e => {
    if(e.data.responses) {
        responses = e.data.responses;
    }
};

const handleFetch = e => {
    const {method, url} = e.request;
    const response = getResponseFor(url, method);

    if(response) {
        console.log(`[sw-proxy] proxying request ${method}: ${url}`);

        let {headers, status, statusText, delay} = response;


        const init = {headers, status, statusText};
        const proxyResponse = response.file ? fetch(`${self.origin}/${response.file}`) :
            Promise.resolve(new Response(JSON.stringify(response.body), init));

        e.waitUntil(
            e.respondWith(delay ? delayResponse(delay, proxyResponse) : proxyResponse)
        );
    }
};

const delayResponse = (time, response) => {
    return new Promise((resolve, reject) => {
        return setTimeout(() => {
            return resolve(response);
        }, time);
    })
}

const getResponseFor = (url, method) => {
    return responses.find(response => response.url === url && (response.method === method || response.method === undefined && method === 'GET'));
};

self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('message', handleMessage);
self.addEventListener('fetch', handleFetch);

