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
    
}]).then(() => {
    
    server.bind({ db : db });
    
    server.route({ method: 'GET', path: '/places', config: Controllers.places.list });
    server.route({ method: 'GET', path: '/places/{id}', config: Controllers.places.get });
    server.route({ method: 'POST', path: '/places/new', config: Controllers.places.create });
    server.route({ method: 'PUT', path: '/places/{id}', config: Controllers.places.update });
    server.route({ method: 'DELETE', path: '/places/{id}', config: Controllers.places.delete });
    
    if (module.parent) {
        return;
    }
    
    return server.start(console.log('server running at http://localhost:' + Config.connection.public.port))
    
}).catch((err) => {
    console.error(err.stack)
    process.exit(1);
});