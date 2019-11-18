# sw-proxy

sw-proxy is a really tiny proxy server which utilizes a service worker.
A [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
sits between web applications and the network (when available).

Service workers are able to intercept requests and take an action, like
serving a custom response.

This enables you to use sw-proxy as a proxy server inside your browser or as a mock server to test a REST API without 
having to run a local backend.


## Installation
Run `npm install sw-proxy --save-dev`

## Usage
Simply add sw-proxy to your web app using a script tag:

`<script src="node_modules/sw-proxy/index.js></script>`

Then list the requests you want to intercept in an array of objects and save it to `sw-proxy-responses.js` in the
root folder of your application.

For example:

```javascript
const responses = [
    {
         url: 'http://api.example.com/json',
         headers: {
             'Content-Type': 'application/json'
         },
         body: {
             message: 'a json response'
         },
         status: 200,
         statusText: 'OK'
    },
    {
        ...
    }
]
```


- `url`: String (required), fully qualified URL of the request to be proxied
- `method`: String (required), HTTP method (GET, POST, PUT or DELETE)
- `headers`: Object (optional), key/value pairs of HTTP headers
- `body`: Object/String (optional): response body
- `file`: String (optional), path to file to be served, relative to root folder of the
application. Must be accessible to the web server and will be ignored if `body` is present
- `status`: Number (optional), HTTP status code
- `statusText`: String (optional), HTTP status text

## Running the demo
Run `npm install`.

Rename `sw-proxy-responses.example.js` to `sw-proxy-responses.js`.

Run `npm start`.

The demo can now be viewed on http://localhost:8080/demo.

Click the buttons on the demo page to generate the requests and
view the results in the dev tools of your browser of choice.

To view the console logs in Safari you need to open a separate Web Inspector
window via Develop > Service Workers > localhost.

## Browser support
Tested in:
- Chrome 67+
- Safari 11.1+
- Firefox 60+
- Edge 17+

sw-proxy should run in all browsers that support Service Worker.

## Inspecting and debugging the service worker
For a great explanation of how to inspect and debug service workers
in Chrome, Firefox, Safari and Edge check [Tools for PWA developers](https://developers.google.com/web/ilt/pwa/tools-for-pwa-developers#interact_with_service_workers_in_the_browser).
