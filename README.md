# ServerQuery
![GitHub all releases](https://img.shields.io/github/downloads/ihasTaco/ServerQuery/total)
![GitHub contributors](https://img.shields.io/github/contributors/ihasTaco/ServerQuery)
![GitHub forks](https://img.shields.io/github/forks/ihasTaco/ServerQuery)
![GitHub stars](https://img.shields.io/github/stars/ihasTaco/ServerQuery)

ServerQuery stands as the most advanced and customizable Discord game server query bot currently available. With the ability to fine-tune virtually every aspect of the embed - from color, title, and description, to field positions, graph colors, and more - ServerQuery empowers you to create a bot experience that truly resonates with your community.

This is the third iteration of ServerQuery, each version built from the ground up with a distinct goal in mind. The first version was born out of a desire to learn Python and recreate my favorite query bot, [GameStatus](https://gamestatus.nexeumstudios.com/). The second was an endeavor to enhance reliability and customizability, with a dash of user interface improvements. But while they were steps in the right direction, they weren't perfect. I wanted more, and so, this latest iteration of ServerQuery was born - more powerful, more customizable, and more user-friendly than ever before.

Fueled by enthusiasm and a relentless drive for perfection (~~and ritalin~~), we dared to dream bigger for this version. We imagined a bot with a user-friendly dashboard, utilizing Discord's authentication system for login and providing an unparalleled level of customization. And when we say customization, we're not just talking about minor tweaks - we're talking about the power to transform the bot's presentation down to the most minute detail.

Want to adjust the color of the tick marks on the graph's x-axis? You can do that. Fancy changing the format of the field content? Absolutely, go for it. Prefer a different title or the fields positioned just so? Consider it done. With ServerQuery, you can customize things like the title, field positions, and even the color of the tick marks on the graph.

And we didn't stop there. We introduced variables™<sup>/™</sup> - variables are powerful tools that let you decide what information is displayed and where. Want to highlight certain data? You can. Want to move some details around? Go ahead. With these variables, you control your server's narrative.

If you can imagine it, ServerQuery can make it happen. It's your server. Make it yours, down to the last pixel!

Now, let's dive into what ServerQuery can do for you.

## Table of Contents
* [Features](https://github.com/ihasTaco/ServerQuery-Node/tree/main#features)
* [Upcoming Features](https://github.com/ihasTaco/ServerQuery-Node/tree/main#upcoming-features)
* [Installation](https://github.com/ihasTaco/ServerQuery-Node/tree/main#installation)
* [Configuration](https://github.com/ihasTaco/ServerQuery-Node/tree/main#configuration)
* [Contributions](https://github.com/ihasTaco/ServerQuery-Node/tree/main#contributions)
* [License](https://github.com/ihasTaco/ServerQuery-Node/tree/main#license)

## Features
### ServerQuery Bot
The ServerQuery Bot is designed to provide a wealth of information about game servers in an engaging and user-friendly format:

* **Sharding**: The bot uses Discord's Shard Manager to efficiently handle a large number of servers.
* **Server Information**: The bot communicates with our backend server to fetch up-to-date game server information.
* **Customizable Embeds**: The bot generates visually appealing graphs and highly customizable Discord embeds, presenting server statistics in an engaging format.
* **Text Variables**: The bot supports a variety of text variables for customizing the format of the fields in the embed.
* **Channel Delivery**: The bot delivers the embeds to specified Discord channels.

For a more detailed list of features, please refer to the bot's [README](https://github.com/ihasTaco/ServerQuery-Node/blob/main/discord/readme.md).

### ServerQuery Frontend
The frontend dashboard offers a high degree of customization and an intuitive user interface:

* **User and Guild Information**: The dashboard fetches user and guild information from the Discord REST API.
* **Server Management**: Users can create and delete servers directly from the dashboard.
* **Embed Customization**: The dashboard offers detailed customization options for the Discord embeds, including field positions, colors, titles, descriptions, and much, much more.
* **Field Management**: Users can easily manage the fields in the embed, including their positions and visibility.
* **Text Variables**: The dashboard supports text variables for further customization of the embed's title, description, field contents, and footer.

For a more detailed list of features, please refer to the frontend's [README](https://github.com/ihasTaco/ServerQuery-Node/blob/main/frontend/readme.md).

### ServerQuery Backend
The backend server is the bridge between the frontend, the bot, and the Discord REST API:

* **Axios for HTTP Requests**: The backend server uses Axios for making HTTP requests, handling all reading and writing operations for the frontend and bot.
* **Session Storage and Cookies**: The backend uses session storage and cookies for user authentication. The tokens are encrypted and can be decrypted to check the user's authentication status.
* **Server Settings Management**: The backend reads and writes the server settings, providing a seamless interaction between the frontend and the bot.

For a more detailed list of features, please refer to the backend's [README](https://github.com/ihasTaco/ServerQuery-Node/blob/main/backend/readme.md).

Features are cool and all but what else? What's next?

## Upcoming Features
### ServerQuery Bot
* **Additional Graph Types**: We're planning to introduce more graph types, including stacked area graphs, line graphs, bar graphs, scatter plots, bubble charts, density plots, and candlestick charts.
* **Logging System**: We're developing a new logging system that will send updates to a specified channel whenever anything changes in the dashboard.
* **Alerts**: We aim to introduce a comprehensive alert system, including activity alerts, server uptime alerts, server restart suggestions, latency alerts, server health metrics alerts, rate limit alerts, and bot error alerts.
* **Automated Server & Guild Reports**: Users will be able to customize and receive daily, weekly, and monthly reports about their servers and guilds.
* **Commands**: We will be introducing a wide range of commands for more interaction with the servers, including:
    * /ping <server_uuid>: Get the current ping of a server.
    * /players <server_uuid>: Get the current player counts of a server.
    * /connect <server_uuid>: Receive a clickable Steam connect link for most servers.
    * /status <server_uuid>: Get the current status of the server.
    * /info <server_uuid>: Receive the server embed in an ephemeral message.
    * /uptime <server_uuid>: Get the current uptime of the server.
    * /health <server_uuid>: Receive a detailed health report of the server.
    * /servers: Get a full list of all the servers in the current Discord guild with connection info, server UUID, game, map, active players, etc.

### ServerQuery Frontend
* **Additional Graph Types**: We're working to support more graph types for data visualization, such as stacked area graphs, line graphs, bar graphs, scatter plots, bubble charts, density plots, and candlestick charts.
* **Server Timezone Settings**: We're introducing the ability for users to set their server's timezone (UTC by default).
* **Role-Based Access Control (RBAC)**: Soon, guild owners will be able to set access permissions for each server, providing more granular control over who can access what.
* **Server Console**: We're exploring the idea of providing a server console viewable in the server dashboard, allowing users to see what the bot is doing in real-time.
* **Discord Embed Simulator**: We plan to implement a feature that will show users what the embed will look like before any updates are made, allowing for better customization.

### ServerQuery Backend
* **Key-Based Authorization API Endpoint System**: We're developing a specific configurable key required for running any API endpoints. This will enhance the security of the backend, ensuring that only authorized requests are processed.


We're excited about these enhancements and are actively working on them. Stay tuned for updates and don't hesitate to suggest new features!

## Installation
To install the dependencies, navigate to each section's directories in your terminal and run `npm install`. This command will install all the necessary dependencies listed in each sections package.json file.

To run the servers, use the following commands:
* **Backend/Discord Bot**: 'cd' to the correct directory, and use this command: `node .` this will start the scripts.
* **Frontend Server**: 'cd' to the correct directory, and use one of these commands: `npm run serve` or `npm run build`, see warning for details on which one to use.

> :warning: Important: Frontend Only: If you're preparing this application for a production environment, remember not to use `npm run serve` as it's intended for development and testing purposes only. For a production-ready setup, use `npm run build` to create a static build of the application. The resulting static files will be located in the 'dist' folder within the frontend directory.

## Configuration
All configuration settings are stored in a .env file inside each sections directory. For guidance on how to fill in this file, refer to the _example.env file included in this directory.

You will need to fill in each setting in order for the bot, frontend server, and backend server to work properly, there are no optional settings!

> :warning: Important: If you're planning to use this application in a production environment, it's crucial not to use the .env file for storing sensitive configuration data. This practice can expose your application to security risks. Instead, please use environment variables provided by your operating system. If you're unsure how to set environment variables, a quick online search should yield tutorials for your specific operating system (e.g., 'Setting environment variables in Windows 11' or 'Setting environment variables in Ubuntu 22.x.x').

## Contributions
Contributions to this project are welcome! If you have a feature you'd like to add, or if you've found a bug and know how to fix it, feel free to make a pull request.

We use [GameDig](https://github.com/gamedig/node-gamedig) to query all game servers, so a big thanks to them. If you want to contribute custom query libraries to help ServerQuery, we highly recommend submitting it directly to GameDig! Not only will it help us out, but it will also benefit the greater game server query community!

## License
ServerQuery is licensed under the Mozilla Public License 2.0 (MPL-2.0). This means you can freely use, modify, distribute, and display the project. However, if you distribute modified versions of this software, you must disclose the source and any changes you've made. For more details, please see the [LICENSE](https://github.com/ihasTaco/ServerQuery-Node/blob/main/LICENSE) file in this repository or read the [full text of the MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/).
