var schema = require('../index.js')
  , testSchema = require('./fixture');

describe('ssc-schema', function() {

    describe('.augment', function() {
        it('should concatenate arrays', function(done) {
            var one = { array: [1, 2, 3] };
            var two = { array: [4, 5, 6] };
            var result = schema.augment(one, two);
            result.should.have.property('array').with.length(6);
            result.array.should.eql([1, 2, 3, 4, 5 ,6]);
            done();
        });

        it('should extend objects', function(done) {
            var one = { propOne: 1 };
            var two = { propTwo: 2 };
            var result = schema.augment(one, two);
            result.should.have.property('propOne').and.equal(1);
            result.should.have.property('propTwo').and.equal(2);
            done();
        });

        it('should wrap functions', function(done) {
            var one = { fn: function() { return 1; } };
            var two = { fn: function(parent) { return parent() + 1; } };
            var result = schema.augment(one, two);

            result.should.have.property('fn');
            result.fn().should.equal(2);
            done();
        });

        it('should overwrite primitives', function(done) {
            var one = { prop: 1 };
            var two = { prop: 2 };
            var result = schema.augment(one, two);
            result.should.have.property('prop').and.equal(2);
            done();
        });
    });

    describe('.toClient', function() {
        it('should return a schema with only the client and shared properties', function(done) {

            var parsed = schema.toClient(testSchema);

            parsed.should.be.a('object');

            parsed.should.have.property('name');
            parsed.should.have.property('country');
            parsed.should.have.property('created_on');
            parsed.should.have.property('address');
            parsed.should.have.property('vendors');

            parsed.name.should.be.a('object');
            parsed.name.type.should.equal('Text');
            parsed.name.validators.should.have.length(1);

            parsed.country.should.be.a('object');
            parsed.country.type.should.equal('Text');
            parsed.country.validators.should.have.length(2);

            parsed.created_on.should.be.a('string');
            parsed.created_on.should.equal('Date');

            parsed.address.should.be.a('string');
            parsed.address.should.equal('Text');

            parsed.vendors.should.be.a('object');
            parsed.vendors.type.should.equal('Text')

            done();
        });

        it('should strip "client", "c", "shared", and "sh" keys', function(done) {
            var parsed = schema.toClient(testSchema);

            parsed.should.be.a('object');

            checkProperties(parsed);

            function checkProperties(schema) {
                for (var prop in schema) {
                    if (typeof schema[prop] === 'object') {
                        checkProperties(schema[prop]);
                    } else {
                        schema[prop].should.not.equal('client');
                        schema[prop].should.not.equal('c');
                        schema[prop].should.not.equal('shared');
                        schema[prop].should.not.equal('sh');
                    }
                }
            }
            done();
        });
    });

    describe('.toServer', function() {
        it('should return a schema with only the server and shared properties', function(done) {
            var parsed = schema.toServer(testSchema);

            parsed.should.be.a('object');

            parsed.should.have.property('name');
            parsed.should.have.property('country');
            parsed.should.have.property('created_on');
            parsed.should.have.property('address');
            parsed.should.have.property('vendors');

            parsed.name.should.be.a('object');
            parsed.name.type.should.equal('String');
            parsed.name.validators.should.have.length(1);

            parsed.country.should.be.a('object');
            parsed.country.type.should.equal('String');
            parsed.country.validators.should.have.length(3);

            parsed.created_on.should.be.a('string');
            parsed.created_on.should.equal('Date');

            parsed.address.should.be.a('string');
            parsed.address.should.equal('String');

            parsed.vendors.should.be.a('object');
            parsed.vendors.type.should.eql(['Oid']);
            parsed.vendors.method.should.be.instanceOf(Array).with.lengthOf('1');

            done();
        });

        it('should strip "server", "s", "shared", and "sh" keys', function(done) {
            var parsed = schema.toServer(testSchema);

            parsed.should.be.a('object');

            checkProperties(parsed);

            function checkProperties(schema) {
                for (var prop in schema) {
                    if (typeof schema[prop] === 'object') {
                        checkProperties(schema[prop]);
                    } else {
                        schema[prop].should.not.equal('server');
                        schema[prop].should.not.equal('s');
                        schema[prop].should.not.equal('shared');
                        schema[prop].should.not.equal('sh');
                    }
                }
            }
            done();
        });
    });
});
