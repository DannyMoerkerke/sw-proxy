const responses = [
    {
        url: 'http://api.example.com/json',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            message: 'a json response'
        }
    },
    {
        url: 'http://api.example.com/text',
        body: 'plain text body'
    },
    {
        url: 'http://api.example.com/pdf',
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
        status: 404,
        statusText: 'Not found',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            message: 'Not found'
        }
    }
];
