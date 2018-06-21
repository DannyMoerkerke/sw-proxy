// import responses from './sw-proxy-responses.js';

const responses = [
    {
        url: 'http://localapi.dannymoerkerke.com/v1/blog',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            message: 'response found!'
        }
    },
    {
        url: 'http://localapi.dannymoerkerke.com/v1/pdf',
        headers: {
            'Content-Type': 'application/pdf'
        },
        file: 'tickets.pdf'
    }
];

self.addEventListener('install', e => {
    console.log('[sw-proxy] service worker installed');
    self.skipWaiting()
});

self.addEventListener('activate', e => {
    console.log('[sw-proxy] service worker activated');

    return self.clients.claim();
});

self.addEventListener('fetch', e => {
    const {method, url} = e.request;
    const response = getResponseFor(url, method);

    if(response) {
        console.log(`[sw-proxy] proxying request ${url}`);

        const {headers} = response;
        const proxyResponse = response.body ? Promise.resolve(new Response(JSON.stringify(response.body), {headers})) :
                              response.file ? fetch(`${self.origin}/${response.file}`) : fetch(e.request);

        e.respondWith(proxyResponse);
    }
});

const getResponseFor = (url, method) => {
    return responses.find(response => response.url === url && (response.method === method || response.method === undefined && method === 'GET'));
};
