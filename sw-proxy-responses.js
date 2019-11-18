/* eslint-disable no-unused-vars */
const responses = [
  {
    reqUrl: 'https://api.example.com/json',
    reqMethod: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      message: 'a json response'
    }
  },
  {
    reqUrl: 'https://api.example.com/text',
    reqMethod: 'GET',
    body: 'plain text body'
  },
  {
    reqUrl: 'https://api.example.com/pdf',
    reqMethod: 'GET',
    headers: {
      'Content-Type': 'application/pdf'
    },
    file: 'demo/example.pdf'
  },
  {
    reqUrl: 'https://api.example.com/post',
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
    reqUrl: 'https://api.example.com/notfound',
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
    reqUrl: 'https://localhost/*',
    reqMethod: 'GET',
    status: 302,
    redirectUrl: 'http://localhost:8080/$1'
  }
];
