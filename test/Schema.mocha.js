var sscParse = require('../index.js')
  , testSchema = require('./fixture');

describe('sscSchema', function() {

    describe('.augment', function() {
        it('should concatenate arrays', function(done) {
//            done('implement');
            done();
        });

        it('should extend objects', function(done) {
//            done('implement');
            done();
        });

        it('should wrap functions', function(done) {
//            done('implement');
            done();
        });

        it('should overwrite primitives', function(done) {
//            done('implement');
            done();
        });
    });

    describe('.toClient', function() {
        it('should return a schema with only the client and shared properties', function(done) {
            var parsed = sscParse.toClient(testSchema);

            parsed.should.be.a('object');

            console.log('parsed: ', parsed);

            parsed.should.have.property('name');
            parsed.should.have.property('country');
            parsed.should.have.property('created_on');
            parsed.should.have.property('address');
            parsed.should.have.property('vendors');

            parsed.name.should.be.a('object');
            parsed.name.type.should.exist();
            parsed.name.type.should.equal('Text');
            parsed.name.validators.should.exist().with.length(1);

            parsed.country.should.be.a('object');
            parsed.country.type.should.exist();
            parsed.country.type.should.equal('Text');
            parsed.country.validators.should.exist().with.length(2);

            parsed.created_on.should.be.a('string');
            parsed.created_on.should.equal('Date');

            parsed.address.should.be.a('string');
            parsed.address.should.equal('Text');

            parsed.vendors.should.be.a('object');
            parsed.vendors.type.should.exist().and.equal('Text')

            done();
        });

        it('should strip "client", "c", "shared", and "sh" keys', function(done) {
            var parsed = sscParse.toClient(testSchema);

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
            var parsed = sscParse.toServer(testSchema);

            parsed.should.be.a('object');

            parsed.should.have.property('name');
            parsed.should.have.property('country');
            parsed.should.have.property('created_on');
            parsed.should.have.property('address');
            parsed.should.have.property('vendors');

            parsed.name.should.be.a('object');
            parsed.name.type.should.exist();
            parsed.name.type.should.equal('String');
            parsed.name.validators.should.exist().with.length(1);

            parsed.country.should.be.a('object');
            parsed.country.type.should.exist();
            parsed.country.type.should.equal('String');
            parsed.country.validators.should.exist().with.length(3);

            parsed.created_on.should.be.a('string');
            parsed.created_on.should.equal('Date');

            parsed.address.should.be.a('string');
            parsed.address.should.equal('Text');

            parsed.vendors.should.be.a('object');
            parsed.vendors.type.should.exist().and.equal('String');
            parsed.vendors.method.should.exist().and.be.a('array').with.lengthOf('1');

            done();
        });

        it('should strip "server", "s", "shared", and "sh" keys', function(done) {
            var parsed = sscParse.toServer(testSchema);

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
