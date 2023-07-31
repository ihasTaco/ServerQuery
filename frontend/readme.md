# ServerQuery Frontend
This is an essential part of the ServerQuery bot project. The frontend dashboard allows users to customize the bot's settings and interact with the Discord bot in a user-friendly manner.

## Table of Contents
* [Installation](https://github.com/ihasTaco/ServerQuery-Node/tree/main/frontend#installation)
* [Configuration](https://github.com/ihasTaco/ServerQuery-Node/tree/main/frontend#configuration)
* [Features](https://github.com/ihasTaco/ServerQuery-Node/tree/main/frontend#features)
* [Upcoming Features](https://github.com/ihasTaco/ServerQuery-Node/tree/main/frontend#upcoming-features)
* [Contributions](https://github.com/ihasTaco/ServerQuery-Node/tree/main/frontend#contributions)
* [License](https://github.com/ihasTaco/ServerQuery-Node/tree/main/frontend#license)


## Installation
To install the frontend server's dependencies, navigate to the 'frontend' directory in your terminal and run `npm install`. This command will install all the necessary dependencies listed in the package.json file.

Before running the server, edit the .env file with your information. Then, run `npm run build` to build the server for the static version, or for testing purposes, run `npm run serve` (not server).

> :warning: Important: If you're preparing this application for a production environment, remember not to use `npm run serve` as it's intended for development and testing purposes only. For a production-ready setup, use `npm run build` to create a static build of the application. The resulting static files will be located in the 'dist' folder within the frontend directory.

## Configuration
Configuration settings for the frontend are stored in a .env file. For guidance on how to fill in this file, refer to the _example.env file included in this directory.

> :warning: Important: If you're planning to use this application in a production environment, it's crucial not to use the .env file for storing sensitive configuration data. This practice can expose your application to security risks. Instead, please use environment variables provided by your operating system. If you're unsure how to set environment variables, a quick online search should yield tutorials for your specific operating system (e.g., 'Setting environment variables in Windows 11' or 'Setting environment variables in Ubuntu 22.x.x').

## Features

* **User and Guild Information**: Fetches user information like servers they administer or own, their Discord avatar, banner, and banner color. It also retrieves guild avatars and banners.
* **Server Management**: Provides the ability to create and delete servers.
* **Embed Customization**: It offers a high level of customization, down to the tiniest detail, to meet the user's needs and personality.
* **Field Management**: Users can simply drag and drop the fields to set their indices. They can also disable fields and set whether a field is inline or not.
* **Text Variables**: Allows users to use text variables to customize the title, description, field contents, and footer of the embed. Users can also set the footer image and thumbnail, enable/disable the graph, and set up notifications.
* **Channel Selection**: Users can specify which channel the bot embed is sent to.
Timestamp Management: Users can enable/disable the timestamp in the embed.
* **Server Passwords**: By default, server passwords are hidden, but users can enable the display of server passwords.

These are just a few of the many features of the frontend dashboard, which offers a myriad of customization options.

## Upcoming Features
* **Additional Graph Types**: We plan to add more graph types to better cater to data visualization needs. This will include stacked area graphs, line graphs, bar graphs, scatter plots, bubble charts, density plots, and candlestick charts.
* **Server Timezone Configuration**: We aim to allow users to set the server's timezone. The current default is UTC.
* **Custom Fields**: We plan to provide the functionality for users to set up custom fields.
* **Role-Based Access Control**: Guild owners will be able to control who has access to a server, enhancing security and control over server management.
* **Statistics**: The dashboard will show stats like the number of guilds the bot is in, the number of bot instances in a certain guild, the total number of users playing on servers hosted by a guild, the number of players on a specific server, and more.
* **(Potential) Server Console**: We're considering adding a server console that can be viewed in the server dashboard, allowing users to see what actions the bot is taking on the game server.
* **Discord Embed Simulator**: This feature will allow users to preview what the embed will look like before making any updates, ensuring they can get it just right before committing changes.
* **Support for More Games**: Our ongoing work aims to extend the bot's compatibility with a broader range of games. We utilize [GameDig](https://github.com/gamedig/node-gamedig) as our primary game server query library. If you possess coding skills and would like to contribute to the ServerQuery community and the wider game server query ecosystem, we encourage you to submit any [custom query protocols](https://github.com/gamedig/node-gamedig#not-supported-yet) directly to GameDig. Your contributions will help enrich our project and the broader gaming community.

We're excited about these upcoming enhancements and are actively working on their development. We appreciate your patience as we strive to make our bot even better!

Remember to keep an eye on this section for updates on new features and improvements. And as always, if you have an idea for a feature you'd like to see, don't hesitate to suggest it!

## Contributions
Contributions to this project are welcome! If you have a feature you'd like to add, or if you've found a bug and know how to fix it, feel free to make a pull request.

We use [GameDig](https://github.com/gamedig/node-gamedig) to query all game servers, so a big thanks to them. If you want to contribute custom query libraries to help ServerQuery, we highly recommend submitting it directly to GameDig! Not only will it help us out, but it will also benefit the greater game server query community!

## License
ServerQuery is licensed under the Mozilla Public License 2.0 (MPL-2.0). This means you can freely use, modify, distribute, and display the project. However, if you distribute modified versions of this software, you must disclose the source and any changes you've made. For more details, please see the [LICENSE](https://github.com/ihasTaco/ServerQuery-Node/blob/main/LICENSE) file in this repository or read the [full text of the MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/).
