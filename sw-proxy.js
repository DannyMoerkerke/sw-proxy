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
const compose = (...funcs) => x => funcs.reduce((res, f) => res || f(x), false);

const getResponseFor = (url, method) => {
  const exactUrlMatch = ({reqUrl, reqMethod}) => url === reqUrl && method === reqMethod;
  const patternUrlMatch = ({reqUrl, reqMethod}) => reqUrl.includes('*') && new RegExp(reqUrl.replace('*', '(.+)')).test(url) && method === reqMethod;
  const exactOrPatternMatch = compose(exactUrlMatch, patternUrlMatch);

  /* eslint-disable no-undef */
  return responses.find(exactOrPatternMatch);
  /* eslint-enable no-undef */
};

const handleFetch = e => {
  const {method: reqMethod, url: reqUrl} = e.request;
  const response = getResponseFor(reqUrl, reqMethod);

  if(response) {
    console.log(`[sw-proxy] proxying request ${reqMethod}: ${reqUrl}`);

    const {headers, status, statusText, delay} = response;
    const redirectUrl = response.reqUrl.includes('*') ? reqUrl.replace(new RegExp(response.reqUrl.replace('*', '(.+)')), response.redirectUrl) : response.redirectUrl;
    console.log('redirecting to', redirectUrl);
    const init = {headers, status, statusText, url: reqUrl};
    const proxyResponse = response.file ? fetch(`${self.origin}/${response.file}`) :
      redirectUrl ? fetch(redirectUrl) :
      Promise.resolve(new Response(JSON.stringify(response.body), init));

    e.waitUntil(
      Promise.resolve(e.respondWith(delay ? delayResponse(delay, proxyResponse) : proxyResponse))
    );
  }
};

self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('fetch', handleFetch);
