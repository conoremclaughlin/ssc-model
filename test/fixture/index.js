module.exports = {
    name: {
        client: { type: 'Text' },
        shared: { validators: ['required'] },
        server: { type: 'String' }
    },
    country: {
        client: { type: 'Text' },
        shared: { validators: ['required'] },
        server: { type: 'String' }
    },
    created_on: { type: 'Date', validators: ['required'] },
    location: {
        client: 'Text',
        server: 'String'
    },
    address: {
        client: 'Text',
        server: 'String'
    },
    vendors: {
        client: { type: 'String' },
        server: { type: ['Oid'], method: ['put'] }
    }
};
