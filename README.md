[![](http://upload.wikimedia.org/wikipedia/commons/1/14/Jane_Jacobs.jpg)](http://en.wikipedia.org/wiki/Jane_Jacobs)

> __“Cities have the capability of providing something for everybody, only because, and only when, they are created by everybody.”__ 
> — Jane Jacobs

villager.io (work in progress)
==============================
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

- Add yourself by logging in with Twitter
- List people, places, groups
- Add and pre-approve users by Twitter handle
- Add moderators
- List pending submissions
- Moderate submitted entries
- Probably some other stuff

## Todos for next release (early January):
- [x] Update to hapi 8
- [x] Update to bell
- [x] Update to dulcimer 2.5
- [x] Set up test scaffolding
- [x] Design cleanup
- [x] ★ star places and groups
- [ ] Curated lists of places and groups
- [ ] Add a place/group to a list from its page
- [ ] Show lists a place/group appears on
- [ ] Add and list upcoming events
- [ ] Basic RSVPs for events
- [ ] Show groups a person is a member of
- [ ] Show events a person has RSVP'd for
- [ ] Add links
- [ ] Add posts
- [ ] Ability to be a member or admin of a group or place
- [ ] Write more tests
- [ ] Make some things not suck as much
- [ ] Design polish

## Future todos
- Fallback avatars
- Custom avatars, upload images
- CSRF
- Suggest changes
- Email notifications
- Alternative methods of login / account creation
- Improved calendar
