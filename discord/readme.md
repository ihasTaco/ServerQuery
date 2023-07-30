# ServerQuery Bot
This is a key part of the overall ServerQuery project, you'll find everything related to the Discord bot itself below.

This directory contains everything related to the Discord bot. Here's a breakdown of its core functionalities:

* **Fetching Server Information**: The bot communicates directly with our backend server to retrieve up-to-date game embed settings and server information.
* **Game Server Querying**: Leveraging the power of [GameDig](https://github.com/gamedig/node-gamedig), the bot efficiently queries game servers, extracting essential data for the embed creation process.
* **Graph Generation and Embed Customization**: The bot creates visually appealing graphs and customizes Discord embeds, presenting server statistics in an engaging and easily digestible format.
* **Channel Delivery**: After packaging the data into a neat and engaging format, the bot delivers the embeds to your chosen Discord channels, keeping your community in the loop about the game server status.

This folder contains all the bot's code, including the commands it supports (coming soon), the methods it uses to interact with the backend server, and the logic for creating and customizing the embeds. Feel free to explore and get to know more about the ServerQuery Bot!

For specific details on how to install, configure, and use this Discord bot, refer to the sections below.

[Join our Royal Productions Bot Discord server!](https://discord.gg/uJ96tnTP6G)

## Installation
To install the bot's dependencies, navigate to the 'discord' directory in your terminal and run npm install. This command will install all the necessary dependencies listed in the package.json file.

## Configuration
The bot's configuration settings are stored in a .env file. For guidance on how to fill in this file, refer to the _example.env file included in this directory. The .env file will include settings like the bot token, as well as backend and frontend URI's.

## Features
* Discord Shard Manager: The bot uses the Discord Shard Manager to handle a large number of servers efficiently.
* **Backend Server Communication**: The bot fetches server information from the backend server, ensuring the most up-to-date details about the game servers are always available.
* **Text Variables**: Users can customize the format of the fields using the following variables:
    * **{ip}**
    * **{connection_port}**
    * **{query_port}**
    * **{game}**
    * **{map}**
    * **{players_active}**
    * **{players_max}**
    * **{server_name}**: This displays the name of the server configured in the bot settings section of the dashboard.
    * **{server_status}**
* **Field Index Configuration**: The bot uses the field indices configured via the dashboard to determine where to place the fields in the embed.
* **Local Storage for Graph Images**: Graph images are stored locally and automatically overwritten, preventing the creation of new images and saving storage space.
* **Error Handling**: Enhanced error handling mechanisms prevent the bot from sending redundant messages in channels when a message already exists.
* **Offline Server Detection for Graphs**: Graphs now detect when a server is offline and display a red bar at the top to indicate server downtime.
* **Offline Server Query Handling**: If a server is offline, the server query will not overwrite the server info, ensuring that all field contents remain filled with useful information.
* **Customizable Embeds**: The bot uses all elements from the server settings config to customize the embed. For example, if a user sets a specific emoji to display on a certain field, it will show up in that field.

These features makes ServerQuery versatile, user-friendly, and powerful in delivering comprehensive server information. As we continue to develop ServerQuery, we will add more features to enhance its capabilities and deliver an even better user experience.

Remember, if you have a feature you'd like to see, don't hesitate to contribute or suggest it! We're always open to new ideas and improvements.

## Contributions
[Contributions to this project are welcome!](https://github.com/ihasTaco/ServerQuery-Node/blob/main/CONTRIBUTING.md) If you have a feature you'd like to add, or if you've found a bug and know how to fix it, feel free to make a pull request.

## License
This project is licensed under the Mozilla Public License 2.0 (MPL-2.0). This means you can freely use, modify, distribute, and display the project, but you must disclose the source and any changes you've made if you distribute modified versions of this software. For more details, please see the [LICENSE]() file in this repository or read the [full text of the MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/).
