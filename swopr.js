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

const getResponseFor = ({url: reqUrl, method: reqMethod}) => {
  // console.log('reqUrl', reqUrl);

  const exactUrlMatch = ({url, method}) => url === reqUrl && method === reqMethod;
  const patternUrlMatch = ({url, method}) => {
    return url.includes('*') && new RegExp(url.replace('*', '(.+)')).test(reqUrl) && method === reqMethod;
  };

  const paramsUrlMatch = ({url, method}) => {
    return url.includes(':') && new RegExp(`${url.replaceAll(/(:[a-z-A-Z0-9]+)/g, '([0-9]+)')}$`).test(reqUrl) && method === reqMethod;
  };


  const exactOrPatternMatch = compose(exactUrlMatch, patternUrlMatch, paramsUrlMatch);

  /* eslint-disable no-undef */
  return responses.find(exactOrPatternMatch);
  /* eslint-enable no-undef */
};

const getRequestParams = (matchedUrl, reqUrl) => {
  const params = [...matchedUrl.matchAll(/(:[a-z-A-Z0-9]+)/g)].map(([m]) => m);
  const values = [...reqUrl.matchAll(/(?<=\/)[0-9]+/g)].map(([m]) => m);

  return params.reduce((acc, key, index) => ({...acc, [key.substring(1)]: values[index]}), {});
};

const getResponseBody = (response, params) => typeof response.body === 'function' ? response.body(params) : response.body;

const handleFetch = async (e) => {
  const {request} = e;
  const {method: reqMethod, url: reqUrl} = request;
  const response = getResponseFor(request);

  if(response) {
    const {headers, status, statusText, delay, resMethod, url: matchedUrl} = response;
    const params = matchedUrl.includes(':') ? getRequestParams(matchedUrl, reqUrl) : null;

    const redirectUrl = matchedUrl.includes('*') ? reqUrl.replace(new RegExp(matchedUrl.replace('*', '(.+)')), response.redirectUrl) : response.redirectUrl;
    const init = {headers, status, statusText, url: reqUrl, method: resMethod ? resMethod : reqMethod};

    const proxyResponse = response.file ? fetch(`${self.origin}/${response.file}`) :
      redirectUrl ? fetch(redirectUrl, init) :
        Promise.resolve(new Response(JSON.stringify(getResponseBody(response, params)), init));


    const msg = `[SW-PROXY] proxying request ${reqMethod}: ${reqUrl}`;
    console.log(`${msg} ${redirectUrl ? `-> ${redirectUrl}` : ``} ${response.file ? `-> serving: ${response.file}` : ``}`);

    e.waitUntil(e.respondWith(delay ? delayResponse(delay, proxyResponse) : proxyResponse));
  }
};

self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('fetch', handleFetch);
