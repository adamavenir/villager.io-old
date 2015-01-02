var server = require('../server');
var Lab = require('lab');
var Code = require('code');
var _ = require('underscore');

var lab = exports.lab = Lab.script();
var expect = Code.expect;

lab.experiment('page tests:', function () {

    lab.before(function (done) {
       done();
    });

    var items = {
        groups: { 
            one: 'group', 
            all: 'groups' 
        },
        events: { 
            one: 'event', 
            all: 'events' 
        },
        places: {
            one: 'event',
            all: 'events'
        },
        lists: {
            one: 'list',
            all: 'lists'
        },
        // activities: {
        //     one: 'activity',
        //     all: 'activities'
        // }
    };

    var users = {

        admin: {
            fullName    : 'Adam Brault',
            twitterId   : '1563',
            twitter     : 'adambrault',
            twavatar    : 'https://pbs.twimg.com/profile_images/474848741849968641/vN5qcXaZ_400x400.jpeg',
            website     : 'http://andyet.com',
            about       : 'Awkward but earnest',
            hasLoggedIn : true,
            approved    : true,
            admin       : true,
            moderator   : true,
            role        : 'admin'
        },

        moderator: {
            fullName    : 'Heather Seaman',
            twitterId   : '2511636140',
            twitter     : 'one000mph',
            twavatar    : 'https://pbs.twimg.com/profile_images/539962260580335616/8WPRGt7j.jpeg',
            website     : 'http://ike.io',
            about       : 'Orthodox Renaissance Kid. Artificer. Node Hobbit at @andyet. Producer at @muxtc. Peddler of bombast.',
            hasLoggedIn : true,
            approved    : true,
            admin       : false,
            moderator   : true,
            role        : 'moderator'
        },

        user: {
            fullName    : 'Isaac Lewis',
            twitterId   : '217607250',
            twitter     : '_crossdiver',
            twavatar    : 'https://pbs.twimg.com/profile_images/468983792628011008/bmZ6KUyZ_400x400.jpeg',
            website     : 'https://github.com/one000mph',
            about       : 'AdventurerLearnerDiscipleProgrammerConnoisseurOfFineTeasMathLoverYogiYeti',
            hasLoggedIn : true,
            approved    : true,
            admin       : false,
            moderator   : false,
            role        : 'user'
        }

    };

    ////////////////////////////////////////////// PAGES

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

    ////////////////////////////////////////////// ITEMS

    _.each(items, function (item) {
        
        lab.test('load ' + item.all + ' list', function (done) {
            var request = { method: 'GET', url: '/' + item.all };
            server.inject(request, function (response) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        _.each(users, function (user) {
            lab.test(user.role + 'users can load add ' + item.all + ' form', function (done) {
                var request = { method: 'GET', url: '/' + item.all + '/add', credentials: user };
                server.inject(request, function (response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });

        lab.test('non-users get redirected to login when attempting to access add ' + item.all + ' form', function (done) {
            var request = { method: 'GET', url: '/' + item.all + '/add', credentials: '' };
            server.inject(request, function (response) {
                expect(response.statusCode).to.equal(302);
                done();
            });
        });
    });

    ////////////////////////////////////////////// PEOPLE

    lab.test('load people list', function (done) {
        var request = { method: 'GET', url: '/people' };
        server.inject(request, function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    _.each(users, function (user) {
        lab.test(user.role + 'users can load add people form', function (done) {
            var request = { method: 'GET', url: '/people/add', credentials: user };
            server.inject(request, function (response) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });
    });

    lab.test('non-users get redirected to login when attempting to access add people form', function (done) {
        var request = { method: 'GET', url: '/people/add', credentials: '' };
        server.inject(request, function (response) {
            expect(response.statusCode).to.equal(302);
            done();
        });
    });

});    
