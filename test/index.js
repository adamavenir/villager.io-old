var server;
var Lab = require('lab');
var Code = require('code');
var Hapi = require('hapi');
var Bell = require('bell');
var config = require('../dev_config.json');
var Cookie = require('hapi-auth-cookie');
var routes = require('../server/routes');
var Dulcimer = require('dulcimer');
Dulcimer.connect({type: 'level', path: './testdb'});

var lab = exports.lab = Lab.script();
var expect = Code.expect;

lab.experiment('main tests', function () {
    lab.before(function (done) {
        server = new Hapi.Server();

        server.connection({ 
            host: config.hostname, 
            port: config.port 
        });

        server.views({
            engines: { jade: require('jade') },
            path: __dirname + '../../templates'
        });

        server.register([Bell, Cookie], function (err) {

            server.auth.strategy('twitter', 'bell', {
                provider: 'twitter',
                password: config.auth.twitter.password,
                isSecure: false,
                clientId: config.auth.twitter.clientId,
                clientSecret: config.auth.twitter.clientSecret
            });

            server.auth.strategy('session', 'cookie', {
                password: config.session.cookieOptions.password,
                cookie: 'sid',
                redirectTo: '/login',
                redirectOnTry: false,
                isSecure: false
            });

            server.route(routes(server));

            if (err) {
                process.stderr.write('Error setting up tests', err, '\n');
                process.exit(1);
            }

            done();

        });

    });

    lab.test('load home page', function (done) {
        var options = { method: 'GET', url: '/' };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    lab.test('404 error', function (done) {
        var options = { method: 'GET', url: '/chumbawumba' };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(404);
            done();
        });
    });

    lab.test('load people list', function (done) {
        var options = { method: 'GET', url: '/people' };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    lab.test('load places list', function (done) {
        var options = { method: 'GET', url: '/places' };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    lab.test('load lists list', function (done) {
        var options = { method: 'GET', url: '/lists' };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    lab.test('load groups list', function (done) {
        var options = { method: 'GET', url: '/groups' };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    // lab.test('load people add form', function (done) {
    //     var options = { method: 'GET', url: '/people/add' };
    //     server.inject(options, function (response) {
    //         expect(response.statusCode).to.equal(200);
    //         done();
    //     });
    // });

    // lab.test('load places add form', function (done) {
    //     var options = { method: 'GET', url: '/places/add' };
    //     server.inject(options, function (response) {
    //         expect(response.statusCode).to.equal(200);
    //         done();
    //     });
    // });

    // lab.test('load groups add form', function (done) {
    //     var options = { method: 'GET', url: '/groups/add' };
    //     server.inject(options, function (response) {
    //         expect(response.statusCode).to.equal(200);
    //         done();
    //     });
    // });

});    