self.importScripts('./sw-proxy-responses.js');
// let responses = [];

const handleInstall = () => {
    console.log('[sw-proxy] service worker installed');
    self.skipWaiting();
};

const handleActivate = () => {
    console.log('[sw-proxy] service worker activated');
    self.clients.claim()
    .catch(err => {
        console.log('claim error', err);
    });
};

/**
 *
 * @param {Number} time delay in ms
 * @param {Promise<Response>} response response
 * @returns {Promise<Response>}
 */
const delayResponse = (time, response) => new Promise(resolve => setTimeout(() => resolve(response), time));

const getResponseFor = (url, method) => {
    return responses.find(response => response.url === url && (response.method === method || response.method === undefined && method === 'GET'));
};

const handleFetch = e => {
    const {method, url} = e.request;
    const response = getResponseFor(url, method);

    if(response) {
        console.log(`[sw-proxy] proxying request ${method}: ${url}`);

        const {headers, status, statusText, delay} = response;

        const init = {headers, status, statusText};
        const proxyResponse = response.file ? fetch(`${self.origin}/${response.file}`) :
            Promise.resolve(new Response(JSON.stringify(response.body), init));

        e.waitUntil(
            Promise.resolve(e.respondWith(delay ? delayResponse(delay, proxyResponse) : proxyResponse))
        );
    }
};


self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('fetch', handleFetch);

