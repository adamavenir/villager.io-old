[![](http://upload.wikimedia.org/wikipedia/commons/1/14/Jane_Jacobs.jpg)](http://en.wikipedia.org/wiki/Jane_Jacobs)

> __“Cities have the capability of providing something for everybody, only because, and only when, they are created by everybody.”__
> — Jane Jacobs

villager (work in progress)
===========================
__Forget massive corporate social networks. Let's build villages.__

![](https://img.shields.io/travis/adambrault/villager.svg)
![](https://img.shields.io/david/adambrault/villager.svg)

The project takes its name from [Jane Jacobs](http://en.wikipedia.org/wiki/Jane_Jacobs) (above) and her work on the [urban village](http://en.wikipedia.org/wiki/Urban_village). The underlying thesis of this project is that our online connectedness can be a tool to help overcome the tragic disconnectedness of suburbia.

---

## The problem

Right now, good things in our local community have a real discoverability problem. I have lived here my entire life and I'm still finding out new and interesting people and places, and finding new things to do and stuff to get involved in.

And that's *me* saying that. Most people know me as a reasonably well-connected person—someone new to the area doesn't even stand a chance.

But most information regarding "things to do", "places to go", "ways to contribute", "interesting things happening" is ferreted away in a thousand places.

And, no, corporate social networks aren't good enough. Facebook is now the default place for most of this stuff, but it only helps provide useful information as an unintentional bug on its main feature: endless distractibility. If you're actually *looking* for something to do or somewhere to get involved, tough luck.

And the result is this complete contrast between reality and people's experience—folks whining there's nothing to do while there are tons of interesting things going on.

We can do better.

## The solution

An open API and a simple website.

No, seriously. I actually believe software can be useful to people, and I believe that, in this case, software could be part of solving a real problem of disconnectedness in our suburban community.

## Here's the vision

People will be able to add and keep up to date things like:

- Places (restaurants, parks)
- Groups (non-profits, organizations, teams, clubs)
- Events (music shows, theatre, meetups, political rallies, workshops)
- Activities ("things to do" like "climb Badger Mountain", "swim across the river", or "go roller skating")

We'll allow anyone to submit new things, but they'll all be moderated by an ever-growing group of people who want to garden the quality of the site.

Users will be able to star their favorites and make and share lists of them as a way of organizing their recommendations.

Groups and places will have their own pages that will allow them to show upcoming events.

## Why an open API?

There are a number of sites out there already aiming to do this kind of thing, and they're all completely centralized and controlled by one person or at least a *very small* number of people. And most of them have extremely cluttered interfaces.

We need a resource that is contributed to and maintained by the entire community. Building an API ensures that everyone can contribute to the same data, but if they want to embed the same information on their own site, they can do so, without having to maintain their own copy of the data.

Allowing people to build on and embed this information in their own sites will increase the likelihood that we'll actually have something close to a thorough resource.

## So what's the current status?

About 80% of this functionality was already built in a version which has since been deprecated. The reason for that deprecation is it wasn't built on an API.

It's currently being redeveloped as an API, then we'll create an initial client for it.

## Contributors welcome!

If you're interested in contributing to this effort, your involvement would be enthusiastically welcomed. <a href="mailto:adam@welp.email">Ping me</a> and I'll buy you lunch or coffee and we can talk about it.

----

# Running the code

Want to contribute? Here's what you need to do to run the API locally.

1. ``cd api``

2. ``npm i`` to install dependencies

3. ``npm run createdb`` to set up db

4. ``npm run migratedb`` to create tables

5. ``npm start`` to run
