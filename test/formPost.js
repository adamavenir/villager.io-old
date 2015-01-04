var server = require('../server');
var Lab = require('lab');
var Code = require('code');
var _ = require('underscore');

var lab = exports.lab = Lab.script();
var expect = Code.expect;

lab.experiment('can post forms:', function () {

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
            one: 'place',
            all: 'places'
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

    var forms = {

        place:  {
            itemType  : 'place',
            itemPlural: 'places',
            type    : 'place',
            category: 'Public',
            name    : 'Howard Amon Park',
            phone   : '5095551212',
            address : '900 Amon Park Road North',
            city    : 'Richland',
            image   : 'http://www.gonorthwest.com/Washington/southeast/Richland/images/IMG_1026_walkingpath.jpg',
            website : 'http://www.richlandparksandrec.com/Facilities/Facility/Details/26',
            about   : 'Nice big park in Richland.'
        },

        event: {
            itemType  : 'event',
            itemPlural: 'events',
            type    : 'event',
            category: 'Music',
            name    : 'Exciting musical event',
            email   : 'you@reaweso.me',
            phone   : '5095551212',
            date    : 'June 2',
            time    : '5:00 p.m.',
            image   : 'http://www.gonorthwest.com/Washington/southeast/Richland/images/IMG_1026_walkingpath.jpg',
            website : 'http://mux.tc',
            about   : 'Gonna be a great show.'
        },

        group: {
            itemType  : 'group',
            itemPlural: 'groups',
            type    : 'group',
            category: 'Meetup',
            name    : 'Fun group',
            image   : 'http://www.gonorthwest.com/Washington/southeast/Richland/images/IMG_1026_walkingpath.jpg',
            website : 'http://google.com',
            about   : 'You are welcome to come to our group.'
        },

        // activity: {
        //     type    : 'activity',
        //     category: 'Family',
        //     name    : 'Fun times',
        //     image   : 'http://www.gonorthwest.com/Washington/southeast/Richland/images/IMG_1026_walkingpath.jpg',
        //     website : 'http://google.com',
        //     about   : 'This is a pretty fun thing to do.'
        // },

        list: {
            itemType  : 'list',
            itemPlural: 'lists',
            type    : 'list',
            name    : 'My list of parks',
            about   : 'Nice list of a few places to sit outside.',
            image   : 'http://www.gonorthwest.com/Washington/southeast/Richland/images/IMG_1026_walkingpath.jpg'
        }
    };

    var expectedMap = {

        place:  {
            itemType  : 'place',
            itemPlural: 'places',
            type    : 'place',
            name    : 'Howard Amon Park',
            slug    : 'howard-amon-park',
            url     : '/places/howard-amon-park',
            phone   : '5095551212',
            address : '900 Amon Park Road North',
            city    : 'Richland',
            map     : 'http://maps.google.com/?q=900 Amon Park Road North Richland',
            image   : 'http://www.gonorthwest.com/Washington/southeast/Richland/images/IMG_1026_walkingpath.jpg',
            website : 'http://www.richlandparksandrec.com/Facilities/Facility/Details/26',
            about   : 'Park in Richland'
        },

        event: {
            itemType  : 'event',
            itemPlural: 'events',
            type    : 'event',
            name    : 'Exciting musical event',
            slug    : 'exciting-musical-event',
            email   : 'you@reaweso.me',
            phone   : '5095551212',
            date    : 'June 2',
            time    : '5:00 p.m.',
            image   : 'http://www.gonorthwest.com/Washington/southeast/Richland/images/IMG_1026_walkingpath.jpg',
            website : 'http://mux.tc',
            about   : 'Gonna be a great show'
        },

        group: {
            itemType  : 'group',
            itemPlural: 'groups',
            type    : 'group',
            name    : 'Fun group',
            slug    : 'fun-group',
            url     : '/groups/fun-group',
            image   : 'http://www.gonorthwest.com/Washington/southeast/Richland/images/IMG_1026_walkingpath.jpg',
            website : 'http://google.com',
            about   : 'You are welcome to come to our group'
        },

        // activity: {
        //     itemType  : 'activity',
        //     itemPlural: 'activities',
        //     type    : 'activity',
        //     category: 'Family',
        //     name    : 'Fun times',
        //     slug    : 'fun-times',
        //     url     : '/activities/fun-times',
        //     image   : 'http://www.gonorthwest.com/Washington/southeast/Richland/images/IMG_1026_walkingpath.jpg',
        //     website : 'http://google.com',
        //     about   : 'This is a pretty fun thing to do.'
        // },

        list: {
            itemType  : 'list',
            itemPlural: 'lists',
            type    : 'places',
            name    : 'My list of parks',
            slug    : 'my-list-of-parks',
            about   : 'Nice list of a few places to sit outside',
            image   : 'http://www.gonorthwest.com/Washington/southeast/Richland/images/IMG_1026_walkingpath.jpg'
        },
    };

    var users = {

        admin: {
            fullName: 'Adam Brault',
            slug: 'adam-brault',
            userid: 1,
            twitterId: '1563',
            twitter: 'adambrault',
            twavatar: 'https://pbs.twimg.com/profile_images/474848741849968641/vN5qcXaZ_400x400.jpeg',
            website: 'http://andyet.com',
            about: 'Awkward but earnest',
            hasLoggedIn: true,
            approved: true,
            admin: true,
            moderator: true,
            role: 'admin',
        },

        moderator: {
            fullName: 'Heather Seaman',
            slug: 'heather-seaman',
            userid: 2,
            twitterId: '2511636140',
            twitter: 'one000mph',
            twavatar: 'https://pbs.twimg.com/profile_images/539962260580335616/8WPRGt7j.jpeg',
            website: 'http://ike.io',
            about: 'Orthodox Renaissance Kid. Artificer. Node Hobbit at @andyet. Producer at @muxtc. Peddler of bombast.',
            hasLoggedIn: true,
            approved: true,
            admin: false,
            moderator: true,
            role: 'moderator'
        },

        user: {
            fullName: 'Isaac Lewis',
            slug: 'isaac-lewis',
            userid: 3,
            twitterId: '217607250',
            twitter: '_crossdiver',
            twavatar: 'https://pbs.twimg.com/profile_images/468983792628011008/bmZ6KUyZ_400x400.jpeg',
            website: 'https://github.com/one000mph',
            about: 'AdventurerLearnerDiscipleProgrammerConnoisseurOfFineTeasMathLoverYogiYeti',
            hasLoggedIn: true,
            approved: true,
            admin: false,
            moderator: false,
            role: 'user'
        }

    };

    _.each(items, function (item) {

        _.each(users, function (user) {
            lab.test(user.role + 's can post add ' + item.all + ' form', function (done) {
                var request = { method: 'POST', url: '/' + item.all + '/add', credentials: user, payload: forms[item] };
                server.inject(request, function (response) {
                    expect(response.statusCode).to.equal(302);
                    done();
                });
            });
        });

        _.each(users, function (user) {
            console.log('item', item.one);
            lab.test('can retrieve new ' + item.all + ' after adding "' + forms[item.one].name + '"', function (done) {
                var request = { method: 'GET', url: '/' + item.all + '/' + expectedMap[item.one].slug, credentials: user };
                server.inject(request, function (response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
            });
        });
    });

});    
