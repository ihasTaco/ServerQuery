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

* 

## Contributions
Contributions to this project are welcome! If you have a feature you'd like to add, or if you've found a bug and know how to fix it, feel free to make a pull request.

## License
