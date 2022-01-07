# swopr

`swopr` is a really tiny proxy server which utilizes a service worker.
A [service worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
sits between web applications and the network (when available).

Service workers are able to intercept requests and take an action, like serving a custom response.

This enables you to use `swopr` as a proxy server inside your browser or as a mock server to test a REST API without 
having to run a local backend.


## Installation
Run `npm install swopr --save-dev`

## Usage
The Service Worker file needed by `swopr` needs to be in the root folder of your application, so you need to copy 
`node_modules/swopr/swopr.js` to the root folder.

Then simply add `swopr` to your web app using a script tag:

`<script src="node_modules/swopr/index.js></script>`

Then list the requests you want to intercept in an array of objects and save it to `swopr-responses.js` in the
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
- `body`: Object/String/Function (optional): response body, when a function is given it will receive as argument an 
object containing any request parameters
- `file`: String (optional), path to file to be served, relative to root folder of the
application. Must be accessible to the web server and will be ignored if `body` is present
- `status`: Number (optional), HTTP status code
- `statusText`: String (optional), HTTP status text

The file `swopr-responses.example.js` contains an example for each option.

Whenever a change is made to the responses, the page must be reloaded.

Since this will not reload the Service Worker, `swopr` will add a 'beforeunload' event listener to the `window` to 
re-register the Service Worker when the page is reloaded. This ensures that `swopr` will always use the correct responses 
whenever these are changed, without having to change the Service Worker file itself.

## Running the demo
Run `npm install`.

Rename `swopr-responses.example.js` to `swopr-responses.js`.

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

`swopr` should run in all browsers that support Service Worker.

## Inspecting and debugging the service worker
For a great explanation of how to inspect and debug service workers
in Chrome, Firefox, Safari and Edge check [Tools for PWA developers](https://developers.google.com/web/ilt/pwa/tools-for-pwa-developers#interact_with_service_workers_in_the_browser).
