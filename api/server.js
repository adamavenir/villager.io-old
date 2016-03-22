'use strict';

const Config = require('getConfig');
const Controllers = require('./controllers');
const Hapi = require('hapi');

const server = new Hapi.Server(Config.hapi);
server.connection(Config.connection.public);

const Muckraker = require('muckraker');
const db = new Muckraker(Config.db);

server.register([{
    register: require('good'),
    options: Config.good
}, {
    register: require('hapi-auth-jwt')
}]).then(() => {

    server.auth.strategy('token', 'jwt', {
      key: new Buffer(Config.auth0.clientSecret, 'base64'),
      verifyOptions: {
        algorithms: [ Config.auth0.algorithm ],
        audience: Config.auth0.clientId
      }
    })

    server.bind({ db : db });

    server.route({ method: 'POST', path: '/api/users', config: Controllers.users.createUser });
    // server.route({ method: 'GET', path: '/api/users/{id}', config: Controllers.users.getUser });
    // server.route({ method: 'DELETE', path: '/api/users/{id}', config: Controllers.users.deleteUser });

    server.route({ method: 'GET', path: '/api/places', config: Controllers.places.listPlaces });
    server.route({ method: 'GET', path: '/api/places/{id}', config: Controllers.places.getPlace });
    server.route({ method: 'POST', path: '/api/places/new', config: Controllers.places.createPlace });
    server.route({ method: 'PUT', path: '/api/places/{id}', config: Controllers.places.updatePlace });
    server.route({ method: 'DELETE', path: '/api/places/{id}', config: Controllers.places.deletePlace });

    if (module.parent) {
        return;
    }

    return server.start(console.log('server running at http://localhost:' + Config.connection.public.port))

}).catch((err) => {
    console.error(err.stack)
    process.exit(1);
});
