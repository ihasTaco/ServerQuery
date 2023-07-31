# ServerQuery Backend
This is the backend part of the Discord bot project, which is responsible for handling server-side logic and serving API endpoints. It uses Express.js for the server and Axios for making HTTP requests.

## Table of Contents
* [Installation](https://github.com/ihasTaco/ServerQuery-Node/tree/main/backend#installation)
* [Configuration](https://github.com/ihasTaco/ServerQuery-Node/tree/main/backend#configuration)
* [API Endpoints](https://github.com/ihasTaco/ServerQuery-Node/tree/main/backend#api-endpoints)
* [Upcoming Features](https://github.com/ihasTaco/ServerQuery-Node/tree/main/backend#upcoming-features)
* [Contributions](https://github.com/ihasTaco/ServerQuery-Node/tree/main/backend#contributions)
* [License](https://github.com/ihasTaco/ServerQuery-Node/tree/main/backend#license)


## Installation
To install the backend server's dependencies, navigate to the 'backend' directory in your terminal and run `npm install`. This command will install all the necessary dependencies listed in the package.json file.

## Configuration
Configuration settings for the backend are stored in a .env file. For guidance on how to fill in this file, refer to the _example.env file included in this directory.

## API Endpoints
The backend server provides a number of API endpoints for interacting with the Discord bot, Discord's REST API, and local files:

### GET Requests
#### Bot
* `/api/get/bot/guilds`: Retrieves all guilds in the servers.json file.
* `/api/get/bot/:guild_id/servers`: Retrieves all servers in the specified guild.
* `/api/get/bot/:guild_id/server/:server_uuid`: Retrieves server settings inside the specified guild for a specified server using the server uuid.
* `/api/get/bot/:guild_id/serverInfo/:server_uuid`: Retrieves the server info for the specified server using the uuid.
#### Discord
* `/api/get/discord/user`: Retrieves user information, such as the user's access token.
* `/api/get/discord/user/guilds`: Retrieves the guilds the user is in, and filters to only send back guilds where the user is an admin or owner.
* `/api/get/discord/guild/:serverId`: Retrieves information about a specified guild, like banner, icon, etc.
* `/api/get/discord/guild/:serverId/presence`: Checks if the bot is in the specified Discord server and returns a true/false statement.
* `/api/get/discord/guild/:guildId/emojis`: Retrieves all the custom emojis from the specified guild.
* `/api/get/discord/guild/:guildId/channels`: Retrieves all the channel names and channel IDs from within the specified guild.
#### Local
* `/api/get/local/authenticatedToken`: Checks if the browser has a token, if it doesn't, sends a 401 status, otherwise decrypts the authenticated token and sends it back.
* `/api/get/local/invite-bot/:serverId`: Writes the guild to the servers.json file then redirects to the Discord authorize page to invite the bot to the guild. (NOTE: This should be a POST API and not a GET API, and it will be changed in an upcoming update.)
* `/api/get/local/check-server/:serverId`: Checks if the guild is in the servers.json file, if it isn't, it writes it to the file. If it is, sends back a 'Server already exists' message. (NOTE: This should also be a POST API.)
* `/api/get/local/generate-uuid/:guild_id`: Generates a new ID in the servers.json file under the specified guild_id. (NOTE: This should be a POST API.)
* `/api/get/local/servers/:guildId`: Gets the servers for a specified guild and will send a 404 if there are no guilds, or will send the server objects.
### POST Requests
* `/api/post/write-bot-settings/:guildID/:serverUUID`: Updates bot settings for a specified server.
* `/api/post/write-server-settings/:guildID/:serverUUID`: Updates server settings for a specified server.
* `/api/post/write-embed-settings/:guildID/:serverUUID`: Updates embed settings for a specified server.
* `/api/post/write-embed-field-settings/:guildID/:serverUUID`: Updates embed field settings for a specified server.
* `/api/post/write-graph-settings/:guildID/:serverUUID`: Updates graph settings for a specified server.
* `/api/post/write-notification-settings/:guildID/:serverUUID`: Updates notification settings for a specified server.
* `/api/post/write-server-info`: Takes in the guild_id, server_id, and the server_info and writes it to the server_info.json file.
* `/api/post/delete-server`: Takes in the guild_id and the server_id, finds the specified server UUID in the server_info.json and servers.json files, and deletes it.
## Upcoming Features

* **Key-Based Authorization API Endpoint System**: A specific configurable key will be required to run any of the API endpoints. This will enhance the security of the backend and ensure that only authorized requests are processed.

## Contributions
Contributions to this project are welcome! If you have a feature you'd like to add, or if you've found a bug and know how to fix it, feel free to make a pull request.

## License
This project is licensed under the Mozilla Public License 2.0 (MPL-2.0). This means you can freely use, modify, distribute, and display the project, but you must disclose the source and any changes you've made if you distribute modified versions of this software. For more details, please see the [LICENSE]() file in this repository or read the [full text of the MPL-2.0](https://www.mozilla.org/en-US/MPL/2.0/).
