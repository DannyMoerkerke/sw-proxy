self.importScripts('./sw-proxy-responses.js');

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

const getResponseFor = (reqUrl, reqMethod) => {
  const exactUrlMatch = ({url, method}) => url === reqUrl && method === reqMethod;
  const patternUrlMatch = ({url, method}) => url.includes('*') && new RegExp(url).test(reqUrl) && method === reqMethod;

  /* eslint-disable no-undef */
  responses.find(exactUrlMatch || patternUrlMatch);
  /* eslint-enable no-undef */
};

const handleFetch = e => {
  const {method, url} = e.request;
  const response = getResponseFor(url, method);

  if(response) {
    console.log(`[sw-proxy] proxying request ${method}: ${url}`);

    const {headers, status, statusText, delay, redirectUrl} = response;

    const init = {headers, status, statusText, url: redirectUrl};
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

