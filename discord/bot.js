require('dotenv').config({path: './.env'});
const {Client, GatewayIntentBits} = require('discord.js');
const {getGuilds, getServerUUIDsForGuild, getServerSettings, writeMessageID, getServerInfo} = require('./api');
const serverQuery = require('./query');
const createGraph = require('./graphs');
const createEmbed = require('./embeds');
const logger = require('./utils/logger');

const client = new Client({intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds]});

/**
 * Retrieves the guild object from the Discord API using a specified guild ID.
 * If the guild is not found, a warning is logged, and the function returns null.
 *
 * @async
 * @param {string} guildID - The ID of the guild to retrieve.
 * @return {Object | null} - The object if found, or null if the guild with the given ID does not exist.
 */
async function getGuild(guildID) {
  logger.debug(`Checking guild ${guildID}`);
  const guild = client.guilds.cache.get(guildID);
  if (!guild) {
    logger.warn(`Guild with ID ${guildID} not found`);

    return null;
  }
  logger.debug(`Finished checking guild ${guildID}`);

  return guild;
}

/**
 * Retrieves a specific channel from a given guild using the channel ID found in the server settings.
 * The function logs the process of checking the channel and returns the channel object if found.
 * If the channel is not found within the guild, a warning is logged, and the function returns null.
 *
 * @param {Object} guild - The guild object where the channel is expected to be found.
 * @param {String} guildID - The ID of the guild associated with the channel.
 * @param {Object} serverCustomizationSettings - The server settings containing the channel ID for retrieval.
 * @return {Object | null} - The channel object if found, or null if the channel with the given ID does not exist in the guild.
 */
async function getChannel(guild, guildID, serverCustomizationSettings) {
  logger.debug(`Checking channel ${serverCustomizationSettings.bot_settings.channel_id} in guild ${guildID}`);
  const channel = await guild.channels.cache.get(serverCustomizationSettings.bot_settings.channel_id);
  if (!channel) {
    logger.warn(`Channel with ID ${serverCustomizationSettings.bot_settings.channel_id} not found in guild ${guildID}`);

    return null;
  }
  logger.debug(`Finished checking guild ${guildID}`);

  return channel;
}

/**
 * Retrieves a specific message from a given channel using the message ID found in the server state.
 * The function logs the process of checking the channel and returns the message object if found.
 * If the message is not found within the channel, an error is logged, and the function returns null.
 *
 * @param {Object} channel - The channel object where the message is expected to be found.
 * @param {String} guildID - The ID of the guild associated with the channel.
 * @param {Object} serverCustomizationSettings - The server customization settings containing the channel ID for verification.
 * @param {Object} serverInfo - The current state of the server, including the message ID to be fetched.
 * @return {Object | null} - The message object if found, or null if the message with the given ID does not exist in the channel.
 */
async function getMessage(channel, guildID, serverCustomizationSettings, serverInfo) {
  logger.debug(`Checking channel ${serverCustomizationSettings.bot_settings.channel_id} in guild ${guildID}`);
  const message = await channel.messages.fetch(serverInfo.data.message_id);
  if (!message) {
    logger.error(`Message with ID ${queryState.message_id} not found in channel ${channel.id} in guild ${guildID}`);

    return null;
  }
  logger.debug(`Finished getting message: ${message.id}`);

  return message;
}

/**
 * Queries a specific game server using the provided customization settings, guild ID, and server UUID.
 * The server's IP, query port, and query protocol are extracted from the customization settings and used
 * to perform the query. The result of the query is an object containing the current state of the server.
 * If an error occurs during the query process, it is logged, and the function may return undefined.
 *
 * @param {String} guildID - The ID of the guild associated with the server being queried.
 * @param {String} serverUUID - The unique identifier for the server being queried.
 * @param {Object} serverCustomizationSettings - The server customization settings containing the IP, query port, and query protocol.
 * @return {Object} - An object representing the current state of the queried server, or undefined if an error occurred.
 */
async function queryServer(guildID, serverUUID, serverCustomizationSettings ) {
  logger.debug(`Querying server for guild ${guildID} and server ${serverUUID}`);
  let queryState;
  try {
    queryState = await serverQuery(
        serverCustomizationSettings.server_settings.ip,
        serverCustomizationSettings.server_settings.query_port,
        serverCustomizationSettings.server_settings.query_protocol,
        guildID,
        serverUUID,
    );
  } catch (err) {
    logger.error(`There was an error while querying server for guild ${guildID} and server ${serverUUID}`);
    logger.error(`Error: ${err}`);
  }
  logger.debug(`Finished querying server for guild ${guildID} and server ${serverUUID}`);
  return queryState;
}

/**
 * Generates a graph for a specific server within a guild based on the server customization settings.
 * The graph is created by calling an external function `createGraph`, and the URL of the generated graph is returned.
 * Any errors encountered during the graph generation process are logged.
 *
 * @param {String} guildID - The ID of the guild for which the graph is being generated.
 * @param {String} serverUUID - The unique identifier for the server associated with the graph.
 * @param {Object} serverCustomizationSettings - Customization settings for the graph, such as title, labels, colors, etc.
 * @return {string} - The URL of the generated graph, or undefined if an error occurred.
 */
async function generateGraph(guildID, serverUUID, serverCustomizationSettings) {
  logger.debug(`Generating graph for guild ${guildID} and server ${serverUUID}`);
  let graphURL;
  try {
    graphURL = createGraph(guildID, serverUUID, serverCustomizationSettings);
  } catch (err) {
    logger.error(`There was an error while generating graph for guild ${guildID} and server ${serverUUID}`);
    logger.error(`Error: ${err}`);
  }
  logger.debug(`Finished generating graph for guild ${guildID} and server ${serverUUID}`);

  return graphURL;
}

/**
 * Creates a new message in a specified channel within a guild. The message includes an embed
 * and an attachment, generated based on the server customization settings, server profile, and graph URL.
 * The newly created message's ID is then updated in the server state and written to the server info.
 *
 * @param {String} guildID - The ID of the guild where the message will be posted.
 * @param {String} serverUUID - The unique identifier for the server associated with the message.
 * @param {Object} channel - The channel object where the message will be posted.
 * @param {Object} serverCustomizationSettings - Customization settings for the bot's behavior and appearance.
 * @param {String} graphURL - The URL of the graph to be embedded in the message.
 * @param {Object} queryState - The state of the server, which will be updated with the new message's ID.
 * @return {Object | null} - The created message object if successful, or null if an error occurred (e.g., missing permissions, rate-limited).
 */
async function createMessage(guildID, serverUUID, channel, serverCustomizationSettings, graphURL, queryState) {
  logger.debug(`Creating a new message for guild ${guildID} and server ${serverUUID} in channel: ${channel.id}`);
  let message;
  try {
    const [embed, attachment] = await createEmbed(serverCustomizationSettings, graphURL, queryState);

    message = await channel.send({embeds: [embed], files: [attachment]});
    await writeMessageID(guildID, serverUUID, message.id);
    logger.debug(`Finished creating a new message for guild ${guildID} and server ${serverUUID} in channel: ${channel.id}`);

    return message;
  } catch (err) {
    if (err.message.includes('Missing Permissions')) {
      logger.error(`Missing permissions to send message in channel ${channel.id} in guild ${guildID}`);
    } else if (err.code === 429) { // Rate limited
      logger.error(`Rate limited while sending message in channel ${channel.id} in guild ${guildID}`);
    } else {
      logger.error(`An error occurred while sending the message in channel ${channel.id} in guild ${guildID}: ${err}`);
    }

    return null;
  }
}

/**
 * Edits an existing message in a specified channel within a guild. The message is modified
 * to include a newly created embed and attachment, both of which are generated based on the
 * provided bot settings, server information, and graph URL.
 *
 * @param {String} guildID - The ID of the guild where the message is located.
 * @param {String} serverUUID - The unique identifier for the server associated with the message.
 * @param {Object} channel - The channel object where the message is posted.
 * @param {Object} serverCustomizationSettings - Customization settings for the bot's behavior and appearance.
 * @param {String} graphURL - The URL of the graph to be embedded in the message.
 * @param {Object} queryState - Information related to the server, such as map, players, etc.
 * @param {Object} serverInfo - Information related to the server, such as map, players, etc.
 * @return {Object | null} - The edited message object if successful, or null if an error occurred (e.g., missing permissions, rate-limited).
 */
async function editMessage(guildID, serverUUID, channel, serverCustomizationSettings, graphURL, queryState, serverInfo) {
  logger.debug(`Editing message for guild ${guildID} and server ${serverUUID} in channel: ${channel.id}`);
  try {
    const message = await getMessage(channel, guildID, serverCustomizationSettings, serverInfo);
    const [embed, attachment] = await createEmbed(serverCustomizationSettings, graphURL, queryState);
    await message.edit({embeds: [embed], files: [attachment]});
    logger.debug(`Finished editing message for guild ${guildID} and server ${serverUUID} in channel: ${channel.id}`);

    return message;
  } catch (err) {
    if (err.message.includes('Missing Permissions')) {
      logger.error(`Missing permissions to edit message in channel ${channel.id} in guild ${guildID}`);
    } else if (err.code === 429) { // Rate limited
      logger.error(`Rate limited while editing message in channel ${channel.id} in guild ${guildID}`);
    } else {
      logger.error(`An error occurred while editing the message in channel ${channel.id} in guild ${guildID}: ${err.message}`);
    }

    return null;
  }
}

client.on('ready', async () => {
  const guilds = Object.keys(await getGuilds());
  for (const guild of guilds) {
    const guildID = guild;
    const servers = await getServerUUIDsForGuild(guildID);
    if (Object.keys(servers.data).length > 0) {
      for (const server of servers.data) {
        const serverUUID = server;
        const serverCustomizationSettings = await getServerSettings(guildID, serverUUID);
        const serverInfo = await getServerInfo(guildID, serverUUID);
        const guild = await getGuild(guildID);
        const channel = await getChannel(guild, guildID, serverCustomizationSettings);
        const queryState = await queryServer(guildID, serverUUID, serverCustomizationSettings);
        const graphURL = await generateGraph(guildID, serverUUID, serverCustomizationSettings);
        if (serverInfo.data.message_id) {
          await editMessage(guildID, serverUUID, channel, serverCustomizationSettings, graphURL, queryState, serverInfo);
        } else {
          await createMessage(guildID, serverUUID, channel, serverCustomizationSettings, graphURL, queryState);
        }
      }
    } else {
      continue;
    }
  }
});

client.login(process.env.BOT_TOKEN);
