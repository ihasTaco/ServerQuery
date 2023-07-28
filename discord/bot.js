require('dotenv').config({ path: '../.env' });
const { Client, GatewayIntentBits } = require('discord.js');
const { getGuilds, getServerUUIDsForGuild, getServerDetails, writeServerInfo, getServerInfo } = require('./api');
const queryServer = require('./query');
const createGraph = require('./graphs');
const { createEmbed } = require('./embeds');
const async = require('async');

const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds] });

const serverQueue = async.queue((task, callback) => {
    handleServer(task.guild_id, task.server, task.server_settings).then(callback);
}, 2);  // '2' is the number of simultaneous tasks allowed.

client.on('ready', async () => {
    console.log(`Shard ${client.shard.ids[0]} is ready`);
    manageServers();
    setInterval(manageServers, 30 * 1000);
});

async function manageServers() {
    console.log('Getting New Servers')
    let response = await getGuilds();
    let guild_info = response.data;
    const managedGuilds = client.guilds.cache.filter(guild => guild_info[guild.id]);

    console.log(`Shard ${client.shard.ids[0]} is managing ${managedGuilds.size} guild(s)`);

    for (const guild of managedGuilds.values()) {
        const server_uuids = await getServerUUIDsForGuild(guild.id);
        
        for (const server of server_uuids.data) {
            let response = await getServerDetails(guild.id, server);
            let server_settings = response.data;

            // Convert refresh interval to milliseconds
            let interval = server_settings.bot_settings.refresh_interval * 1000;

            // Start an independent interval for each server
            startInterval(guild.id, server, server_settings, interval);
        }
    }
}

async function startInterval(guild_id, server, server_settings, interval) {
    serverQueue.push({
        guild_id,
        server,
        server_settings
    });

    setTimeout(() => startInterval(guild_id, server, server_settings, interval), interval);
}

async function handleServer(guild_id, server_uuid, server_settings) {
    try {
        console.log(`\n-- Handle Server --`)
        console.log(`Server in Guild: ${guild_id}`)
        console.log(`Server UUID: ${server_uuid}`)
        console.log(`Querying Server: ${server_settings.bot_settings.server_name}`)

        // Get the guild object
        const guild = client.guilds.cache.get(guild_id);
        // Check if the guild exists
        if (!guild) {
            console.log(`Guild ${guild_id} not found`);
            return;
        }

        // Get the channel object
        const channel = guild.channels.cache.get(server_settings.bot_settings.channel_id);
        // Check if the channel exists
        if (!channel) {
            console.log(`Channel with ID ${server_settings.bot_settings.channel_id} not found in guild ${guild_id}`);
            return;
        }

        // Query the server
        const { server_info: server_query } = await queryServer(server_settings.server_settings.ip, server_settings.server_settings.query_port,server_settings.server_settings.query_protocol, guild_id, server_uuid);

        // Create the Player Graph
        if (!server_settings.graph_settings.disable) {
            graph_url = await createGraph(guild_id, server_uuid);
        }

        if (server_query.message_id === null) {
            const [embed, attachment] = await createEmbed(server_settings, graph_url, server_query);
        
            // Send the embed to the channel, then get the message id and write it to the server_info.json file
            const message = await channel.send({ embeds: [embed], files: [attachment] }).catch(console.error);
            server_query.message_id = message.id;
            await writeServerInfo(guild_id, server_uuid, server_query);
        } else {
            // Try to fetch the existing message
            let message;
            try {
                message = await channel.messages.fetch(server_query.message_id);
            } catch (err) {
                console.error(`Failed to fetch message with ID ${server_query.message_id}\nCreating a new message!`);
            }
        
            // If the message exists, edit it
            if (message) {
                const [embed, attachment] = await createEmbed(server_settings, graph_url, server_query);
            
                // Edit the message
                await message.edit({ embeds: [embed], files: [attachment] }).catch(console.error);
            } else {
                // Send a new message if the old one does not exist or could not be fetched
                const [embed, attachment] = await createEmbed(server_settings, graph_url, server_query);
            
                // Send the embed to the channel, then get the message id and write it to the server_info.json file
                const newMessage = await channel.send({ embeds: [embed], files: [attachment] }).catch(console.error);
                server_query.message_id = newMessage.id;
                await writeServerInfo(guild_id, server_uuid, server_query);
            }
        }
    } catch (err) {
        console.error(`Error handling server: ${err}`);
    }
}

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);
