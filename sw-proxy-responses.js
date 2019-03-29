/* eslint-disable no-unused-vars */
const responses = [
  {
    url: 'http://api.example.com/json',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      message: 'a json response'
    }
  },
  {
    url: 'http://api.example.com/text',
    method: 'GET',
    body: 'plain text body'
  },
  {
    url: 'http://api.example.com/pdf',
    method: 'GET',
    headers: {
      'Content-Type': 'application/pdf'
    },
    file: 'demo/example.pdf'
  },
  {
    url: 'http://api.example.com/post',
    method: 'POST',
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
    url: 'http://api.example.com/notfound',
    method: 'GET',
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
    url: 'http://api.example.com/redirect',
    method: 'GET',
    status: 302,
    redirectUrl: 'http://api.example.com/302'
  },
];
