<img src="img/kaga-gh.png" align="center"></img>
<h3 align="center">A quick, multipurpose bot for discord.</h3>
<p align="center">
    <a title="DavidDM" href="https://david-dm.org/zetari/chiya.svg"><img src="https://img.shields.io/david/zetari/chiya.svg?style=flat" alt="DavidDM">
    <a title="Code Style" href="https://standardjs.com/"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Code Style">
    <a title="License" href="https://github.com/zetari/chiya/blob/master/LICENSE"><img src="https://img.shields.io/github/license/zetari/chiya.svg" alt="License"></a>
=======
    <a title="DavidDM" href="https://david-dm.org/minteeaa/kaga"><img src="https://img.shields.io/david/minteeaa/kaga.svg?style=flat-square" alt="DavidDM">
    <a title="Code Style" href="https://standardjs.com/"><img src="https://img.shields.io/badge/code_style-standard-blue.svg?style=flat-square" alt="Code Style">
    <a title="License" href="https://github.com/minteeaa/kaga/blob/master/LICENSE"><img src="https://img.shields.io/github/license/minteeaa/kaga.svg?style=flat-square" alt="License"></a>
</p>

---

Kaga is a discord bot created in Node.JS using the [Klasa](https://github.com/dirigeants/klasa) framework. Said framework relies on [Discord.js](https://discord.js.org/). It's a nice break from my schoolwork and it helps me learn JavaScript on my free time.

## Dev dependencies
* [Node.JS](https://nodejs.org/) (and clearly [NPM](https://www.npmjs.com) too)
* [Klasa](https://github.com/dirigeants/klasa), the framework the bot is built on.
* [StandardJS](https://standardjs.com/), the code style I use.
* [PM2](https://pm2.keymetrics.io/), a process manager for applications.

## Invite Kaga to your server
Well, as of right now, you can't. I spend a lot of time developing this bot to make it production ready and even at that, it still has bugs I find. As I try to add features as quickly as possible, I also encounter bugs at the same rate. I don't know how long it will take to fix all these bugs and add all the features I would like, but when I do, this bot will become public.

## The repo
I need a place to store this bot incase of any losses on my local end. It also helps with the organization of coding across multiple devices. Along with this, Kaga is free to use for your own server, or even to use for your own project. Please do give some credit to me somewhere in the project, though. The license is a thing and I have no issue taking copies of this repo down in accordance with it.

**What you can do**
* Commercially use this project
* Redistribute the code
* Make modifications to this code

**What you _have_ to do**
* Make any source code public
* Include a copy of this repo's license (AGPL-3.0)
* State any changes in the code

**Other stuff you should know**
* Don't drag me into anything you do wrong
* No, there isn't a warranty

## Development
You're interested, I see. In accordance with the license, you can help me build this bot!

### Installation
Clone the repo, either by downloading it or using the git command.
```
<<<<<<< Updated upstream
$ git clone https://github.com/zetari/chiya.git
$ cd chiya/
=======
$ git clone https://github.com/minteeaa/kaga.git
$ cd kaga/
>>>>>>> Stashed changes
$ npm i
```

### Code styling
Please, make my life easier by using the [StandardJS](https://standardjs.com/) code style. It has installations for Atom, VSCode, Sublime Text, or whatever code editor you use. I have also added a dependency in the package for the StandardJS server to use incase addons aren't your thing. I do this to keep code clean, and if you don't stick to it, it will be up to me to clean any PRs and additions before adding them.

## Setup and launch
Navigate to the repository folder and fill out the `.env.example` file accordingly. (it's pretty empty as of now... but that will change.)
```
# Bot keys

TOKEN=
```
Rename the example file to `.env`.

### Windows
```
$ rename ".env.example" ".env"
```
### Linux/WSL
```
$ mv ".env.example" ".env"
```

## Running the bot
Assuming your computer hasn't exploded yet, you can now run the bot. Go ahead and check out the `kaga.config.js` and edit it to your liking. You'll need to run this in PM2.
```
$ pm2 start kaga.config.js
```
To monitor the bot, you can leave the logs open...
```
$ pm2 logs
```
... or you can use the `monit` command.
```
$ pm2 monit
```

# License and the Author
<<<<<<< Updated upstream
**Chiya** © [Zetari](https://github.com/zetari)
=======
**Kaga** © [mintea](https://github.com/minteeaa)
>>>>>>> Stashed changes

Under the [AGPL-3.0 License](https://opensource.org/licenses/AGPL-3.0).

Made with ❤️ and a lot of coffee by Zetari.

> Github: [Zetari](https://github.com/zetari) | Twitter: [@Zetari](https://twitter.com/zetari_/) | Discord: ***mintea#0001***
