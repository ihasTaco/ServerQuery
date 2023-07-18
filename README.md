# ServerQuery
A Discord Bot that queries game servers made with node.js

# Features
### Added Features
#### Dashboard
* Frontend/Backend Server
* No Database required (database support coming soon)
* Cookie based login system
* Beautiful User Interface
* Uses Discord REST API for user login and to get user data and guilds
* Automatically detects if the bot is present in discord guilds, and routes the user based on bot presence
#### ServerQuery Bot
Fully Customize the bot for every server, right from inside the dashboard!<br>
Here are the customizations available:
* Bot Settings
  * Channel ID
  * Refresh Interval (How often the bot queries the server)
* Server Info
  * IP
  * Connection Port
  * Query Port
  * Game and Query Protocol
* Embed Setting
  * Embed Color
  * Embed Title [(See Text Variables in Planned Features)](#planned-features)
  * Embed Description [(See Text Variables in Planned Features)](#planned-features)
  * Disable Timestamp
  * Thumbnail Settings
    * Disable Thumbnail
    * Thumbnail URL
  * Footer Settings
    * Disable Footer
    * Footer Text
    * Footer URL
  * Field Settings
    * Status
      * Disable Status
      * Index (Index will be handled by a drag and drop feature on the dashboard)
      * Offline Emoji
      * Online Emoji
      * Offline Text [(See Text Variables in Planned Features)](#planned-features)
      * Online Text [(See Text Variables in Planned Features)](#planned-features)
    * Connection
      * Disable Connection
      * Index (Index will be handled by a drag and drop feature on the dashboard)
      * Connection Text [(See Text Variables in Planned Features)](#planned-features)
    * Location
      * Disable
      * Index (Index will be handled by a drag and drop feature on the dashboard)
      * Location Emoji
      * Location Text [(See Text Variables in Planned Features)](#planned-features)
    * Game
      * Disable 
      * Index (Index will be handled by a drag and drop feature on the dashboard)
      * Game Text [(See Text Variables in Planned Features)](#planned-features)
    * Map
      * Disable
      * Index (Index will be handled by a drag and drop feature on the dashboard)
      * Map Text [(See Text Variables in Planned Features)](#planned-features)
    * Players
      * Disable
      * Index (Index will be handled by a drag and drop feature on the dashboard)
      * Players Text [(See Text Variables in Planned Features)](#planned-features)
    * Password Protected
      * Disable
      * Index (Index will be handled by a drag and drop feature on the dashboard)
      * Password Protected Emoji
      * Password Protected Text
    * Password
      * Disable
      * Index (Index will be handled by a drag and drop feature on the dashboard)
      * Password Text
    * Custom Field [(See Custom Fields in Planned Features)](#planned-features)
    * Disable Player Names
* Graph Settings
  * Graph Type [(See Graph Type in Planned Features)](#planned-features)
  * Disable Graph
  * Title Settings
    * Title Text
    * Title Color
  * Label Settings
    * X Label
      * Label Text
      * Label Color
    * Y Label 
      * Label Text
      * Label Color
  * Tick Settings
    * X Tick Color
    * Y Tick Color
  * Graph Line Settings
    * Player Settings
      * Line Color
      * Disable Fill
      * Fill Color
    * Trend Settings
      * Disable Trend Line
      * Trend Line Style
      * Trend Line Color
    * Grid Settings
      * Disable Grid
      * Grid Color
      * Grid Opacity
  * Legend Settings
    * Disable Legend
    * Background Color
    * Background Opacity
    * Border Color
    * Border Opacity
* Notification Settings
  * Disable Notifications
  * Disable Timestamps
  * Channel ID (Where the bot should send the notification embed)
  * Embed Settings
    * Embed Title [(See Text Variables in Planned Features)](#planned-features)
    * Embed Description [(See Text Variables in Planned Features)](#planned-features)
    * Embed Color
      * Offline Color
      * Online Color
    * Thumbnail Settings
      * Disable Thumbnail
      * Thumbnail URL
    * Footer Settings
      * Disable Footer
      * Footer Text
      * Footer URL
    * Field Settings
      * Status
        * Disable Status
        * Index (Index will be handled by a drag and drop feature on the dashboard)
        * Offline Emoji
        * Online Emoji
        * Offline Text [(See Text Variables in Planned Features)](#planned-features)
        * Online Text [(See Text Variables in Planned Features)](#planned-features)
  * Ping Settings
    * Disable Ping
    * Ping Role/User
      
### Planned Features
* Text Variables
  - I want to be able to use 'variables' in text inputs that the bot will automatically fill in with the correct information<br>
    Here is some of the variables I am thinking about adding
    * { IP } (ex. output: (String) 127.0.0.1)
    * { Connection_Port } (ex. output: (Integer) 12345)
    * { Query_Port } (ex. output: (Integer) 12345)
    * { Game } (ex. output: (String) 7 Days to Die)
    * { Query_Protocol } (ex. output: (String) A2S)
    * { Map } (ex. output: (String) ChernarusPlus)
    * { Active_Players } (ex. output: (Integer) 14)
    * { Max_Players } (ex. output: (Integer) 50)
    * { Server_Status } (ex. output: (Boolean) True)
* Custom Fields
  - I want users to be able to create as many Custom Fields as they want, that the bot will be able to read, and add it to the embed just like the rest of the predetermined fields
    Here is an example custom field
    * Custom Field
      * Disable
      * Index
      * Title
      * Content
        * Emoji
        * Text
* Graph Types
  - While line graphs are super helpful in displaying numbers, but if you want to 'spice' your graph up a bit<br>
    Here is some example graph types
    * [Area Graph](https://datavizcatalogue.com/methods/area_graph.html) (Default)
    * [Stacked Area Graph](https://datavizcatalogue.com/methods/stacked_area_graph.html) (Adds Fill to Trend Line)
    * [Line Graph](https://datavizcatalogue.com/methods/line_graph.html) (Removes Fill)
    * [Bar Graph](https://datavizcatalogue.com/methods/bar_chart.html)
    * [Scatter Plot](https://datavizcatalogue.com/methods/scatterplot.html)
    * [Heat Map](https://datavizcatalogue.com/methods/heatmap.html) 
      - The Heat Map may be a bit difficult to do using a single server, but I may be able to figure out how to group all servers into a single graph and then display it that way, I'm going to keep it here, and see what others think...
    * [Bubble Chart](https://datavizcatalogue.com/methods/bubble_chart.html)
      - I could probably use this one to show change in player activity during certain times...
    * [Density Plot](https://datavizcatalogue.com/methods/density_plot.html)
      - This is an Area Graph with smoother transitions
    * [Candlestick Chart](https://datavizcatalogue.com/methods/candlestick_chart.html)
      - This one is hard maybe, I could use this one to display changes in player activity

* Dashboard
  * Database Support
    * SQLite
    * MongoDB
    * MySQL
    * PostgreSQL
  * Role Based Access Control
    - Discord Guild Owners can customize what server admins can change and see
  * Bot Activity Status
    - This is a maybe, for instances when the bot is being hosted for others to use, think 'enterprise', this may be a feature that is turned off, as only one status can be set. Or I can make it so the 'enterprise' can set the activity status only in a .env config
  * Bot Statistics, Guild Statistics, and Server Statistics inside the dashboard
    - bot statistics can be shown in the user dashboard, it will show how many bot instances are active, how many servers the bot is in using the users guilds, how many total active players the bot can see using the users guilds, etc.
    - Guild Statistics can be shown in the guild dashboard, this will show how many 'servers' the bot is querying, the average players for all servers, the total active players for the guild, etc.
    - Server Statistics will be shown in the server dashboard, this will show how many active players are in the server, the average players for that specific time, etc.
  * Server Console
    - this may be a lot, but. with the bot moving from a command line tool, like my past bots, to a web based dashboard, I want to implement a way that users and server owners can see what the bot is doing at that very moment. this may be a horrible idea, but I will at least try to implement it. 
* Bot
  * Cluster Support
    - I want to be able to use this across multiple servers
  * Shard Support
    - I was thinking having 1 shard for 1 discord guild, but I think that will be too many shards, so probably stick to default 1 shard for ~2000-2500 guilds
  * Log Channel
    - I can use this to send bot updates (server settings updates, i.e. the server name has been changed from XYZ to ZYX) to a specific channel
  * Smart Alerts
    - Activity Alerts
      - I can use the available trend data to get a rough idea of how many players are usually in the server at any given time, if the active player count goes above a certain threshold, it will automatically send an alert to a user specified channel (this may use similar settings as the notification settings)
      - I can also add a setting into the dashboard that the user can set a hard threshold for, and if the active player counts go above that, it will send an alert
    - Server Uptime / Server Restart
      - this will pretty much send an alert to a specified channel, if the server has been running for X amount of days/hours that it would probably be a good idea to restart it.
      - this will rely heavily on how often the bot queries game servers, because if the bot queries the server, and then the server restarts and is up and running before the bot queries the server, the bot will 'think' the server never restarted, and could cause a headache. I will need to make an option that will allow guild owners and admins to turn this off
    - Latency Alerts
      - I can make a function that will set a 'timer' before the bot sends a query, and stops it the moment it receives the data from the game server. using this, the bot can analyze the past latency of the server, and if the latency is higher than normal it will send an alert to a specified channel
    - Server Health Metrics
      - This could Include Uptime Time, Uptime Percentage, Last Restart, Ping, Packet Loss, etc. and will be packaged in a neat embed and sent to a specified channel
    - Rate Limit Alerts
      - If the bot receives a rate limit from the discord api, it could send a message to a specified channel (obviously after the rate limit is over)
    - Bot Errors
      - If the bot has an error, it can send the error to a specified channel with all the information needed to successfully find and fix the bug
  * Automated Server/Guild Reports
    - This could be used to give daily/weekly/monthly reports on the activity of the server, this could includ:
      - average players
      - average peak times
      - average peak player counts
      - Changes in players trends
      - if the guild host many servers the bot can make a comparison chart, and compare the servers to each other
      - Alert Summaries
      - player count predictions
  * Commands
    - /ping <server uuid>
      - This will ping the game server and return the current ping
    - /players <active|max> <server uuid>
      - this could return active or max player counts
    - /connect <server uuid>
      - this could send a steam connect url so the user can quickly connect to the given server (if the server is a2s, if not it will display a 'this server doesnt support this feature', or something)
    - /status <server uuid>
      - will get the current status of the server
    - /info <server uuid> 
      - this can get all the information about the server (i.e. IP, Connection port, Query Port, Active Players, Max Players, Map, Game, etc.)
    - /uptime <server uuid>
      - This will send back the current uptime of the server
    - /health <server uuid>
      - This could provide a summarized version of the health metric report
    - /servers
      - This could send a list of all the servers, with connection info, game, map, active players, etc.
