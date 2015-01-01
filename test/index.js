var server = require('../server');
var Lab = require('lab');
var Code = require('code');

var lab = exports.lab = Lab.script();
var expect = Code.expect;

lab.experiment('main tests', function () {
    lab.before(function (done) {
       done();
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

    lab.test('load people add form', function (done) {
        var options = { method: 'GET', url: '/people/add' };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    lab.test('load places add form', function (done) {
        var options = { method: 'GET', url: '/places/add' };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    lab.test('load groups add form', function (done) {
        var options = { method: 'GET', url: '/groups/add' };
        server.inject(options, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

});    
