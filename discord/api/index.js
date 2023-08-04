const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config({path: './.env'});

/**
 *
 * @return {object}
 */
async function getGuilds() {
  logger.debug(`Fetching guilds`);
  const guilds = await axios.get(`${process.env.BACKEND_URL}api/get/bot/guilds`);
  return guilds.data;
}

/**
 *
 * @param {string} guildID
 * @return {object}
 */
async function getServerUUIDsForGuild(guildID) {
  logger.debug(`Fetching server UUIDs for guild: ${guildID}`);
  const servers = await axios.get(`${process.env.BACKEND_URL}api/get/bot/${guildID}/servers`, {});
  return servers;
}

/**
 *
 * @param {string} guildID
 * @param {string} serverUUID
 * @return {object}
 */
async function getServerSettings(guildID, serverUUID) {
  logger.debug(`Fetching server details for guild: ${guildID} and server UUID: ${serverUUID}`);
  const settings = await axios.get(`${process.env.BACKEND_URL}api/get/bot/${guildID}/server/${serverUUID}`, {});
  return settings.data;
}

/**
 *
 * @param {string} guildID
 * @param {string} serverUUID
 * @return {object}
 */
async function getServerInfo(guildID, serverUUID) {
  logger.debug(`Fetching server info for guild: ${guildID} and server UUID: ${serverUUID}`);
  let serverInfo;
  try {
    serverInfo = await axios.get(`${process.env.BACKEND_URL}api/get/bot/${guildID}/serverInfo/${serverUUID}`, {});
  } catch {
    logger.warn(`Couldn't find info for guild: ${guildID} and server UUID: ${serverUUID}`);
    logger.info(`Creating new info for guild: ${guildID} and server UUID: ${serverUUID}`);
    serverInfo = {'players': 0, 'ping': 0, 'map': null, 'status': null, 'last_restart': null, 'message_id': null};
    writeServerInfo(guildID, serverUUID, serverInfo);
  }
  return serverInfo;
}

/**
 *
 * @param {string} guildID
 * @param {string} serverUUID
 * @param {object} queryState
 */
async function writeServerInfo(guildID, serverUUID, queryState) {
  try {
    logger.debug(`Writing server info for guild: ${guildID} and server UUID: ${serverUUID}`);
    await axios.post(`${process.env.BACKEND_URL}api/post/write-server-info`, {
      guildID,
      serverUUID,
      queryState,
    });
  } catch (error) {
    logger.error(`Error writing server info for guild: ${guildID} and server UUID: ${serverUUID}, error: ${error}`);
  }
}
/**
 *
 * @param {string} guildID
 * @param {string} serverUUID
 * @param {object} messageID
 */
async function writeMessageID(guildID, serverUUID, messageID) {
  try {
    logger.debug(`Writing server info for guild: ${guildID} and server UUID: ${serverUUID}`);
    await axios.post(`${process.env.BACKEND_URL}api/post/write-message-id`, {
      guildID,
      serverUUID,
      messageID,
    });
  } catch (error) {
    logger.error(`Error writing server info for guild: ${guildID} and server UUID: ${serverUUID}, error: ${error}`);
  }
}

module.exports = {
  getGuilds,
  getServerUUIDsForGuild,
  getServerSettings,
  getServerInfo,
  writeServerInfo,
  writeMessageID,
};
