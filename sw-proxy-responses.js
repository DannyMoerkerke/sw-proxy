/* eslint-disable no-unused-vars */
const responses = [
  {
    reqUrl: 'http://api.example.com/json',
    reqMethod: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      message: 'a json response'
    }
  },
  {
    reqUrl: 'http://api.example.com/text',
    reqMethod: 'GET',
    body: 'plain text body'
  },
  {
    reqUrl: 'http://api.example.com/pdf',
    reqMethod: 'GET',
    headers: {
      'Content-Type': 'application/pdf'
    },
    file: 'demo/example.pdf'
  },
  {
    reqUrl: 'http://api.example.com/post',
    reqMethod: 'POST',
    status: 201,
    statusText: 'Created',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      message: 'created'
    }
  },
  {
    reqUrl: 'http://api.example.com/notfound',
    reqMethod: 'GET',
    status: 404,
    statusText: 'Not found',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      message: 'Not found'
    }
  },
  {
    reqUrl: 'http://localhost:8080/redirect',
    reqMethod: 'GET',
    status: 302,
    redirectUrl: 'https://api.dannymoerkerke.com/v1/blogpostings'
  },
  {
    reqUrl: 'http://localhost/*',
    reqMethod: 'GET',
    status: 302,
    redirectUrl: 'http://localhost:8080/$1'
  }
];
