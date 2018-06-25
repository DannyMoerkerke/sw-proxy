export default [
    {
        url: 'http://localapi.dannymoerkerke.com/v1/blog',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            message: 'response found! 1'
        }
    },
    {
        url: 'http://localapi.dannymoerkerke.com/v1/text',
        body: 'plain text body'
    },
    {
        url: 'http://localapi.dannymoerkerke.com/v1/pdf',
        headers: {
            'Content-Type': 'application/pdf'
        },
        file: 'tickets.pdf'
    },
    {
        url: 'http://localapi.dannymoerkerke.com/v1/pdf',
        method: 'POST',
        status: 201,
        statusText: 'Created'
    },
    {
        url: 'http://localapi.dannymoerkerke.com/v1/notfound',
        status: 404,
        statusText: 'Not found'
    }
];