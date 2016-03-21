'use strict';

exports.up = function(knex) {

    return knex.schema
        .createTable('users', (table) => {

            table.increments('id').primary();
            table.string('name');
            table.string('email');
            table.string('password');
            table.string('slug').unique();
        })
        .createTable('places', (table) => {

            table.increments('id').primary();
            table.string('slug').unique();
            table.string('name');
            // table.specificType('type', 'text[]');
            table.string('type');
            table.string('phone');
            table.string('address');
            table.string('city');
            table.string('state');
            table.string('map');
            table.string('image');
            table.string('website');
            table.text('about');
            table.boolean('approved');
            // table.uuid.('created_by').references.('users.id').onDelete('CASCADE');
            table.timestamp('date_updated').defaultTo(knex.fn.now());
        })
        .createTable('lists', (table) => {

            table.increments('id').primary();
            table.string('slug').unique();
            table.string('name');
            table.string('image');
            table.text('about');
            // table.uuid.('created_by').references.('users.id').onDelete('CASCADE');
            table.uuid.('starred_by').references.('users.id').onDelete('CASCADE');
            table.uuid.('listed_by').references.('users.id').onDelete('CASCADE');
            table.timestamp('date_updated').defaultTo(knex.fn.now());
        })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('places')
        .dropTableIfExists('users')
};
