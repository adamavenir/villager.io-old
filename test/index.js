var server = require('../server');
var Lab = require('lab');
var Code = require('code');

var lab = exports.lab = Lab.script();
var expect = Code.expect;

lab.experiment('main tests', function () {

    lab.before(function (done) {
       done();
    });

    var admin = {
        fullName    : 'Adam Brault',
        twitterId   : '1563',
        twitter     : 'adambrault',
        twavatar    : 'https://pbs.twimg.com/profile_images/474848741849968641/vN5qcXaZ_400x400.jpeg',
        website     : 'http://andyet.com',
        about       : 'Awkward but earnest',
        hasLoggedIn : true,
        approved    : true,
        admin       : true,
        moderator   : true
    };

    // var moderator = {
    //     fullName    : 'Heather Seaman',
    //     twitterId   : '2511636140',
    //     twitter     : 'one000mph',
    //     twavatar    : 'https://pbs.twimg.com/profile_images/539962260580335616/8WPRGt7j.jpeg',
    //     website     : 'http://ike.io',
    //     about       : 'Orthodox Renaissance Kid. Artificer. Node Hobbit at @andyet. Producer at @muxtc. Peddler of bombast.',
    //     hasLoggedIn : true,
    //     approved    : true,
    //     admin       : false,
    //     moderator   : true
    // };

    // var user = {
    //     fullName    : 'Isaac Lewis',
    //     twitterId   : '217607250',
    //     twitter     : '_crossdiver',
    //     twavatar    : 'https://pbs.twimg.com/profile_images/468983792628011008/bmZ6KUyZ_400x400.jpeg',
    //     website     : 'https://github.com/one000mph',
    //     about       : 'AdventurerLearnerDiscipleProgrammerConnoisseurOfFineTeasMathLoverYogiYeti',
    //     hasLoggedIn : true,
    //     approved    : true,
    //     admin       : false,
    //     moderator   : false
    // }; 

    lab.test('load home page', function (done) {
        var request = { method: 'GET', url: '/' };
        server.inject(request, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    lab.test('404 error', function (done) {
        var request = { method: 'GET', url: '/chumbawumba' };
        server.inject(request, function (response) {
            expect(response.statusCode).to.equal(404);
            done();
        });
    });

    lab.test('load people list', function (done) {
        var request = { method: 'GET', url: '/people' };
        server.inject(request, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    lab.test('load places list', function (done) {
        var request = { method: 'GET', url: '/places' };
        server.inject(request, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    lab.test('load lists list', function (done) {
        var request = { method: 'GET', url: '/lists' };
        server.inject(request, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    lab.test('load groups list', function (done) {
        var request = { method: 'GET', url: '/groups' };
        server.inject(request, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    lab.test('admin can load add person form', function (done) {
        var request = { method: 'GET', url: '/people/add', credentials: admin };
        server.inject(request, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    lab.test('admin can load add place form', function (done) {
        var request = { method: 'GET', url: '/places/add', credentials: admin };
        server.inject(request, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    lab.test('admin can load app group form', function (done) {
        var request = { method: 'GET', url: '/groups/add', credentials: admin };
        server.inject(request, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

});    
