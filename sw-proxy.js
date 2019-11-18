self.importScripts('./sw-proxy-responses.js');

const handleInstall = () => {
  console.log('[SW-PROXY] service worker installed');
  self.skipWaiting();
};

const handleActivate = () => {
  console.log('[SW-PROXY] service worker activated');

  return self.clients.claim();
};

const delayResponse = (time, response) => new Promise(resolve => setTimeout(() => resolve(response), time));
const compose = (...fns) => x => fns.reduce((res, f) => res || f(x), false);

const getResponseFor = (url, method) => {
  const exactUrlMatch = ({reqUrl, reqMethod}) => url === reqUrl && method === reqMethod;
  const patternUrlMatch = ({reqUrl, reqMethod}) => reqUrl.includes('*') && new RegExp(reqUrl.replace('*', '(.+)')).test(url) && method === reqMethod;
  const exactOrPatternMatch = compose(exactUrlMatch, patternUrlMatch);

  /* eslint-disable no-undef */
  return responses.find(exactOrPatternMatch);
  /* eslint-enable no-undef */
};

const handleFetch = async (e) => {
  const {request} = e;
  const {method: reqMethod, url: reqUrl} = request;
  const response = getResponseFor(reqUrl, reqMethod);

  if(response) {
    const {headers, status, statusText, delay, resMethod} = response;
    const redirectUrl = response.reqUrl.includes('*') ? reqUrl.replace(new RegExp(response.reqUrl.replace('*', '(.+)')), response.redirectUrl) : response.redirectUrl;
    const init = {headers, status, statusText, url: reqUrl, method: resMethod ? resMethod : reqMethod};

    const proxyResponse = response.file ? fetch(`${self.origin}/${response.file}`) :
      redirectUrl ? fetch(redirectUrl, init) :
        Promise.resolve(new Response(JSON.stringify(response.body), init));


    const msg = `[SW-PROXY] proxying request ${reqMethod}: ${reqUrl}`;
    console.log(`${msg} ${redirectUrl ? `-> ${redirectUrl}` : ``} ${response.file ? `-> serving: ${response.file}` : ``}`);

    e.waitUntil(
      Promise.resolve(e.respondWith(delay ? delayResponse(delay, proxyResponse) : proxyResponse))
    );
  }
};

self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('fetch', handleFetch);
