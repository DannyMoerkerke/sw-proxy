const users = [
  {
    id: '1',
    name: 'User 1'
  },
  {
    id: '2',
    name: 'User 2'
  },
  {
    id: '3',
    name: 'User 3'
  }
];

const getUserById = ({id}) => users.find((user) => user.id === id);

/* eslint-disable no-unused-vars */
const responses = [
  {
    url: 'https://api.example.com/json',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      message: 'a json response'
    }
  },
  {
    url: 'https://api.example.com/users/:id',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: params => getUserById(params),
  },
  {
    url: 'https://api.example.com/text',
    method: 'GET',
    body: 'plain text body'
  },
  {
    url: 'https://api.example.com/pdf',
    method: 'GET',
    headers: {
      'Content-Type': 'application/pdf'
    },
    file: 'demo/example.pdf'
  },
  {
    url: 'https://api.example.com/post',
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
    url: 'https://api.example.com/notfound',
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
    url: 'https://localhost/*',
    method: 'GET',
    status: 302,
    redirectUrl: 'http://localhost:8080/$1'
  }
];
