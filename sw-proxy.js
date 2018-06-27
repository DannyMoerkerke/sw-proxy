let responses = [];

const handleInstall = () => {
    console.log('[sw-proxy] service worker installed');
    self.skipWaiting();
};

const handleActivate = () => {
    console.log('[sw-proxy] service worker activated', responses.length);
    self.clients.claim()
    .then(() => {
        if(!responses.length) {
            console.log('requesting responses');
            self.clients.matchAll()
            .then(clients => {
                console.log('send message to client', clients);
                clients.forEach(client => client.postMessage('request for responses'));
            })
            .catch(err => {
                console.log('clients error', err);
            });
        }
    })
    .catch(err => {
        console.log('claim error', err);
    });
};

const handleMessage = e => {
    if(e.data.responses) {
        console.log('receiving responses');
        responses = e.data.responses;
    }
};

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
            e.respondWith(delay ? delayResponse(delay, proxyResponse) : proxyResponse)
        );
    }
};


self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('message', handleMessage);
self.addEventListener('fetch', handleFetch);

