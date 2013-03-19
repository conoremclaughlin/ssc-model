module.exports = {
    name: {
        client: { type: 'Text' },
        shared: { validators: ['required'] },
        server: { type: 'String' }
    },
    country: {
        client: { type: 'Text' },
        shared: { validators: ['required', 'alphabetical']  },
        server: { type: 'String', validators: ['country'] }
    },
    created_on: 'Date',
    address: {
        client: 'Text',
        server: 'String'
    },
    vendors: {
        client: { type: 'Text' },
        server: { type: ['Oid'], method: ['put'] }
    }
};
