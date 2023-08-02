require('dotenv').config({ path: '../.env' });
const { Client, GatewayIntentBits, DiscordAPIError, RateLimitError, HTTPError } = require('discord.js');
const { getGuilds, getServerUUIDsForGuild, getServerDetails, writeServerInfo, getServerInfo } = require('./api');
const queryServer = require('./query');
const createGraph = require('./graphs');
const { createEmbed } = require('./embeds');
const async = require('async');
const logger = require('./utils/logger');

const client = new Client({ intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds] });

const serverQueue = async.queue((task, callback) => {
    handleServer(task.guild_id, task.server, task.server_settings).then(callback);
}, 1);  // '1' is the number of simultaneous tasks allowed.

client.on('ready', async () => {
    logger.info(`Shard ${client.shard.ids[0]} is ready`);
    manageServers();
    setInterval(manageServers, 30 * 1000);
});

async function manageServers() {
    logger.debug('Getting New Servers')
    let response = await getGuilds();
    let guild_info = response.data;
    const managedGuilds = client.guilds.cache.filter(guild => guild_info[guild.id]);

    logger.info(`Shard ${client.shard.ids[0]} is managing ${managedGuilds.size} guild(s)`);

    for (const guild of managedGuilds.values()) {
        const server_uuids = await getServerUUIDsForGuild(guild.id);
        
        for (const server of server_uuids.data) {
            let response = await getServerDetails(guild.id, server);
            let server_settings = response.data;

            // Check if the server has been deleted
            if (!server_settings) {
                logger.warn(`Server with UUID ${server} in guild ${guild.id} has been deleted.`);
                continue;  // Skip to the next server
            }

            // Convert refresh interval to milliseconds
            let interval = server_settings.bot_settings.refresh_interval * 1000;
            //let interval = 30 * 1000;

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
    logger.debug('handleServer');
    try {
        // Get the guild object
        const guild = client.guilds.cache.get(guild_id);
        logger.debug(`Getting Guild with Guild ID: ${guild_id}`);

        // Check if the guild exists
        if (!guild) {
            logger.warn(`Guild ${guild_id} not found`);
            return;
        }

        // Get the channel object
        const channel = guild.channels.cache.get(server_settings.bot_settings.channel_id);
        logger.debug(`Getting Channel with Channel ID: ${server_settings.bot_settings.channel_id}`);

        // Check if the channel exists
        if (!channel) {
            logger.warn(`Channel with ID ${server_settings.bot_settings.channel_id} not found in guild ${guild_id}`);
            return;
        }

        // Query the server
        const { server_info: server_query } = await queryServer(server_settings.server_settings.ip, server_settings.server_settings.query_port,server_settings.server_settings.query_protocol, guild_id, server_uuid);
        
        let graph_url;
        // Create the Player Graph
        if (!server_settings.graph_settings.disable) {
            graph_url = await createGraph(guild_id, server_uuid);
            logger.debug(`Done! Graph can be found here`);
            logger.debug(`${graph_url}`);
        }

        let message;
        if (server_query.message_id === null) {
            const [embed, attachment] = await createEmbed(server_settings, graph_url, server_query);
        
            message = await channel.send({ embeds: [embed], files: [attachment] }).catch(logger.error);
            
            server_query.message_id = message.id;
            
            await writeServerInfo(guild_id, server_uuid, server_query);
        } else {
            let message = null;
            let attempts = 0;
            let shouldSendNewMessage = false;
                        
            while (!message && attempts < 5) {
                try {
                    message = await channel.messages.fetch(server_query.message_id);
                    const [embed, attachment] = await createEmbed(server_settings, graph_url, server_query);
                    await message.edit({ embeds: [embed], files: [attachment] }).catch(logger.error);
                } catch (err) {
                    logger.error(`Error fetching message: ${err}`);
                    if (err instanceof DiscordAPIError) {
                        if (err.code === 10008) {  // 'Unknown Message' error
                            logger.error('Message not found, it might have been deleted.');
                            shouldSendNewMessage = true;
                            break;
                        } else if (err.code === 50001) {  // 'Missing Access' error
                            logger.error('Bot does not have access to the channel.');
                            break;
                        } else if (err.code === 50013) {  // 'Missing Permissions' error
                            logger.error('Bot does not have permission to read the message.');
                            break;
                        }
                    }
            
                    // If it's a RateLimitError, you can wait for the duration specified by the 'retry_after' property before trying again
                    if (err instanceof RateLimitError) {
                        await new Promise(resolve => setTimeout(resolve, err.retry_after * 1000));
                        continue;
                    }
            
                    // If it's a HTTPError (like a network error), you can wait for a bit before trying again
                    if (err instanceof HTTPError) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        continue;
                    }
            
                    // If it's some other type of error, you might not know how to handle it, so just log it and exit the loop
                    logger.error('Unknown error type, not retrying.');
                    break;
                }
            
                attempts += 1;
            }
        
            if (!message && shouldSendNewMessage) {
                const [embed, attachment] = await createEmbed(server_settings, graph_url, server_query);
                            
                message = await channel.send({ embeds: [embed], files: [attachment] }).catch(logger.error);

                server_query.message_id = message.id;
                await writeServerInfo(guild_id, server_uuid, server_query);
            }
        }
    } catch (err) {
        logger.error(`Error handling server: ${err}`);
    }
}

client.on('error', logger.error);

client.login(process.env.BOT_TOKEN);