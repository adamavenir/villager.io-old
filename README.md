[![](http://upload.wikimedia.org/wikipedia/commons/1/14/Jane_Jacobs.jpg)](http://en.wikipedia.org/wiki/Jane_Jacobs)

> __“Cities have the capability of providing something for everybody, only because, and only when, they are created by everybody.”__
> — Jane Jacobs

villager (work in progress)
===========================
__Forget massive corporate social networks. Let's build villages.__

![](https://img.shields.io/travis/adambrault/villager.svg)
![](https://img.shields.io/david/adambrault/villager.svg)

The project takes its name from [Jane Jacobs](http://en.wikipedia.org/wiki/Jane_Jacobs) (above) and her work on the [urban village](http://en.wikipedia.org/wiki/Urban_village). The underlying thesis of this project is that our online connectedness can be a tool to help overcome the tragic disconnectedness of suburbia.

__This project is being rebuilt from a full-stack application into an API. See the `api` folder for current work in progress.__

Original deprecated code in `deprecated` folder.

## Setup

Want to contribute? Here's what you need to do to run the API locally.

1. ``cd api``

2. ``npm i`` to install dependencies

3. ``npm run createdb`` to set up db

4. ``npm run migratedb`` to create tables

5. ``npm start`` to run 


## Target feature list

- Create, Get, List, Update, Approve, Star:
  - People
  - Places
  - Groups
  - Events
  - Activities
  - Lists
- Pending submissions, approve/delete submitted entries
- Set people as moderators
