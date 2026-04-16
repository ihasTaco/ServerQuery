# ServerQuery

## Who?

This is made for discord servers admins who happen to also host game servers. If you aren't one of those people, you can still use it, idk for what but you can. 

## What?

ServerQuery is a discord bot that queries game servers and displays current server information inside an embed in a specified discord channel.  
The bot is highly customizable and includes, graphs showing 24 hour historical player counts and 7 day player trend information, text variables to place a bunch of server information in static text, and custom notifications so you can get notified when servers hit certain states.
If I ever get around to it I will like to host the bot on my domain: [ServerQuery.gg](https://serverquery.gg)  
I am thinking about setting up a free tier on the publically hosted version of the bot and charge for more servers, similar to the other bots available, this will help pay for server hosting costs.  
The open source version will always be available, and the hosted version is more for convenience than anything.  

## When? 

tf? what do you mean when?

## Where?

wherever you want, except in the basement of a federal building. Apparently thats called trespassing and you can get "fined" for it, jokes on them though, I'm already fine.

## Why?

I made this for the [Royal Productions Discord](https://discord.gg/zMChfrghpM) that I help run, at the time we hosted 10+ game servers, so it was more cost effective to just make my own.  
Also, because I wanted to...

# Installation
> Note: The Server Setup instructions will run the server in dev mode, its not meant to be used in production. If you are the only one using it and its not on a public domain you can use that, but if you want to use it in production on a public domain, build it and host it using whatever web hosting sw/service you use, dont forget to set the settings in the .env as environment variables on whatever you use.

## Prerequisites 

Node.js 24+ (may work on different versions, but they are untested)  
A discord account

## Discord Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)  
2. Create a new application, set the name and team to whatever you want (personal is fine if you'll be self hosting)  
3. Go to the "OAuth2" button in the side nav.  
4. Under Client Information, copy both Client ID and Client Secret  
5. Under Redirects, add a new redirect, if you are self hosting and dont plan to make it public you can put `http://localhost:8081/callback` otherwise put your domain for the oauth2 callback. (This has to match exactly, or else you'll get an OAUTH error when you try to sign into the website or add the bot to servers)  
6. Go to the "Bot" button in the side nav, scroll down until you see "Token" and click Reset Token it will ask for MFA if set up. Copy this.  
7. Check "Public Bot" Otherwise you will need to add the bot to the servers manually. (You will have the option to add bot to guilds if this is set)  
8. Turn on Presence intent, Server Members intent, and Message Content intent.  

That should be it for the discord setup.

## Server Setup

Hopefully you copied all of those api secrets, well be using them here.  

``` bash
# Clone the repo and navigate to root
git clone https://github.com/ihasTaco/ServerQuery.git
cd /path/to/ServerQuery

# Run these in each of these folders: ./frontend ./backend ./discord
npm install
cp _example.env .env # Fill out the .env with the required information

# Start each server
npm start 
```

If I have time I will fix this so it's not so tedious to build. maybe just run a batch or bash file. 

If you need further support, create an issue here, or join the [Lockeworks Discord](https://discord.gg/uJ96tnTP6G) for a quicker response.

# Features

 * A frontend, backend, and discord bot included
 * Fully customizable discord embed system
 * Discord OAuth for login, and uses discord api to pull guilds and user information to be used in displaying info in frontend
 * Guild-owned server configuration
 * Supports more than 350 games and services [GameDig Game List](https://github.com/gamedig/node-gamedig/blob/master/GAMES_LIST.md)

# Known Issues

There is currently 215 vulnerabilities found in the codebase, do not use this in production until that is figured out. (most of it is solved by outdated dependencies but still)  
There is a memory leak somewhere in the bot that causes it to crash after running for a few days.  
Currently if you run the server and edit a server in the frontend, the bot will not update to use the new settings.  

# Todo
> Don't hold your breath on these, I will either complete all of these in a single weekend or none of these. ADHD is one hell of a drug.

 * Clean up codebase
 * Unify all arms of the application 
   - idk if this is possible without breaking everything. If I really wanted to do this, I'd recommend doing it now and not later.
 * Switch from JSON storage to an actual database. 
   - something like sqlite would prob be the easiest to set up
 * Fix a few bugs in the embed viewer, it works™ just annoying when you notice them.

Below would be cool features to add, but are 100% scope creep.
 * Add a console view in the servers config to see raw comms between bot, server and guild.
 * Additional graph types 
 * Add ability to create custom fields
   - The codebase is mostly set up for this since this was what was planned back in the olden days of 2023
 * Add more customizability options for alerts, rn it just fires if server changes power state from on to off or vice versa. 
 * A logging system, since the server configs are owned by the guild (not individual users), a logging system would be nice so it will log who changed what and when
 * Role based access control so guild owners can specify who can change what either through roles or specifying usernames.
 * A key-based api endpoint auth system.
   - honestly this should've been one of the first features... I wouldnt recommend this going on a public server until this is implemented 

# Showcase

TBD

# License
MIT license - do what you want with it, just add attribution somewhere pointing here!
