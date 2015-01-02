[![](http://upload.wikimedia.org/wikipedia/commons/1/14/Jane_Jacobs.jpg)](http://en.wikipedia.org/wiki/Jane_Jacobs)

> __“Cities have the capability of providing something for everybody, only because, and only when, they are created by everybody.”__ 
> — Jane Jacobs

villager (work in progress)
===========================
__Forget massive corporate social networks. Let's build villages.__

First implementation will be [triciti.es](http://triciti.es), successor to [WeCreate TC](http://wecreate.tc).

The project takes its name from [Jane Jacobs](http://en.wikipedia.org/wiki/Jane_Jacobs) (above) and her work on the [urban village](http://en.wikipedia.org/wiki/Urban_village). The underlying thesis of this project is that our online connectedness can be a tool to help overcome the tragic disconnectedness of suburbia.

## Setup

Want to contribute? Here's what you need to do to run this app locally.

1. Go [configure a Twitter app](https://apps.twitter.com/app/new)

  - Make sure to check *Allow this application to be used to Sign in with Twitter*
  - It doesn't matter what you put in the callback URL.
  
2. Copy ``sample_config.json`` to ``dev_config.json`` and edit accordingly:

  - Grab the *Consumer Key (API Key)* and set it as ``ClientId``
  - Grab the *Consumer Secret (API Secret)* and set it as ``ClientSecret``

3. ``npm i`` to install dependencies.

4. ``npm start`` to run.

__Important note:__ I just realized this app *temporarily* requires a nlfpm account in order to compile CSS. This app uses [yeti.css](http://yeticss.com) by [Karolina](https://github.com/thefoxis), which is not published publically yet.


## Done:

- Twitter authentication
- Create, Get, List, Update, Approve, Star:
  - People
  - Places
  - Groups
  - Events
  - Lists
- Pending submissions, approve/delete submitted entries
- Curated lists of places and groups

## Todos for 1.0 release (early January):
- [ ] Tests for all routes
- [ ] Flesh out seed data
- [ ] Log all the things
- [ ] Add activities
- [ ] List upcoming events by date
- [ ] Ability to be an admin of a group or place
- [ ] Check whether you're an admin to edit it
- [ ] Interface to add/remove admins to a group or place
- [ ] Pagination for all the things
- [ ] Welcome page
- [ ] Log in with SMS or Twitter
- [ ] Add Twitter or SMS to your account

## Future todos
- Basic RSVPs for events
- Request to join a group as a member, have requests be moderated
- Show people who are members of groups
- Links 
- Posts
- Fallback avatars
- Custom avatars, upload images
- CSRF
- Suggest changes
- Email notifications
- Alternative methods of login / account creation
- Improved calendar
