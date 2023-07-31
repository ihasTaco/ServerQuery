require('dotenv').config({ path: '../.env' });
const { Client, GatewayIntentBits, DiscordAPIError, RateLimitError, HTTPError } = require('discord.js');
const { getGuilds, getServerUUIDsForGuild, getServerDetails, writeServerInfo, getServerInfo } = require('./api');
const queryServer = require('./query');
const createGraph = require('./graphs');
const { createEmbed } = require('./embeds');
const async = require('async');

const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds] });

const serverQueue = async.queue((task, callback) => {
    handleServer(task.guild_id, task.server, task.server_settings).then(callback);
}, 1);  // '1' is the number of simultaneous tasks allowed.

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

            // Check if the server has been deleted
            if (!server_settings) {
                console.log(`Server with UUID ${server} in guild ${guild.id} has been deleted.`);
                continue;  // Skip to the next server
            }

            // Convert refresh interval to milliseconds
            //let interval = server_settings.bot_settings.refresh_interval * 1000;
            let interval = 30 * 1000;

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
    console.log('handleServer')
    try {
        // Get the guild object
        const guild = client.guilds.cache.get(guild_id);
        console.log('getting Guild with Guild ID: ', guild_id)

        console.log('Checking If Guild Exists...')

        // Check if the guild exists
        if (!guild) {
            console.log(`Guild ${guild_id} not found`);
            return;
        }

        console.log('Guild Exist\'s, moving on!')

        // Get the channel object
        const channel = guild.channels.cache.get(server_settings.bot_settings.channel_id);
        console.log('getting Channel with Channel ID: ', server_settings.bot_settings.channel_id)

        console.log('Checking If Channel Exists...')
        // Check if the channel exists
        if (!channel) {
            console.log(`Channel with ID ${server_settings.bot_settings.channel_id} not found in guild ${guild_id}`);
            return;
        }

        console.log('Channel Exist\'s, moving on!')

        console.log('Querying Game Server...')
        // Query the server
        const { server_info: server_query } = await queryServer(server_settings.server_settings.ip, server_settings.server_settings.query_port,server_settings.server_settings.query_protocol, guild_id, server_uuid);

        console.log('Finished Querying Game Server!')

        // Create the Player Graph
        if (!server_settings.graph_settings.disable) {
            console.log('Creating Player Graph!')
            graph_url = await createGraph(guild_id, server_uuid);
            console.log('Done! Graph can be found here: ', graph_url)
        }

        console.log('Attempting to build and send the discord embed')

        let message;
        if (server_query.message_id === null) {
            console.log('message_id is null, attempting to send a new one')

            const [embed, attachment] = await createEmbed(server_settings, graph_url, server_query);
        
            message = await channel.send({ embeds: [embed], files: [attachment] }).catch(console.error);
            
            console.log('New Message Sent! New message_id is: ', message)
            server_query.message_id = message.id;
            
            console.log('Attempting to write new message id to Server Info JSON file!')
            await writeServerInfo(guild_id, server_uuid, server_query);
            console.log('New message ID has been written to Server Info JSON file!')
        } else {
            let message = null;
            let attempts = 0;
            let shouldSendNewMessage = false;
                        
            while (!message && attempts < 5) {
                try {
                    message = await channel.messages.fetch(server_query.message_id);
                    const [embed, attachment] = await createEmbed(server_settings, graph_url, server_query);
                    await message.edit({ embeds: [embed], files: [attachment] }).catch(console.error);
                } catch (err) {
                    console.error(`Error fetching message: ${err}`);
                    if (err instanceof DiscordAPIError) {
                        console.log(err.code)
                        if (err.code === 10008) {  // 'Unknown Message' error
                            console.error('Message not found, it might have been deleted.');
                            shouldSendNewMessage = true;
                            break;
                        } else if (err.code === 50001) {  // 'Missing Access' error
                            console.error('Bot does not have access to the channel.');
                            break;
                        } else if (err.code === 50013) {  // 'Missing Permissions' error
                            console.error('Bot does not have permission to read the message.');
                            break;
                        }
                        // Add more error codes as needed based on your requirements
                    }
            
                    // If it's a RateLimitError, you can wait for the duration specified by the 'retry_after' property before trying again
                    if (err instanceof RateLimitError) {
                        await new Promise(resolve => setTimeout(resolve, err.retry_after * 1000));  // 'retry_after' is in seconds
                        continue;  // Try again
                    }
            
                    // If it's a HTTPError (like a network error), you can wait for a bit before trying again
                    if (err instanceof HTTPError) {
                        await new Promise(resolve => setTimeout(resolve, 1000));  // Wait for 1 second
                        continue;  // Try again
                    }
            
                    // If it's some other type of error, you might not know how to handle it, so just log it and exit the loop
                    console.error('Unknown error type, not retrying.');
                    break;
                }
            
                attempts += 1;
            }
        
            if (!message && shouldSendNewMessage) {
                console.log('the message is null, sending a new message')
                console.log('Creating embed...');
                const [embed, attachment] = await createEmbed(server_settings, graph_url, server_query);
                console.log('Embed created.');
                            
                console.log('Sending message...');
                message = await channel.send({ embeds: [embed], files: [attachment] }).catch(console.error);
                console.log('Message sent.');

                console.log('Attempting to write new message id to Server Info JSON file!')
                server_query.message_id = message.id;
                await writeServerInfo(guild_id, server_uuid, server_query);
                console.log('New message ID has been written to Server Info JSON file!')
            }
        }
    } catch (err) {
        console.error(`Error handling server: ${err}`);
    }
}

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);
