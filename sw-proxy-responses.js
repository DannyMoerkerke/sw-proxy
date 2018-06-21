export default [
    {
        url: 'http://localapi.dannymoerkerke.com/v1/blog',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            message: 'response found!'
        }
    },
    {
        url: 'http://localapi.dannymoerkerke.com/v1/pdf',
        _headers: {
            'Content-Type': 'application/pdf'
        },
        file: 'tickets.pdf'
    }
];