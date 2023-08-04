const Gamedig = require('gamedig');
const packageData = require('./packageData');
const logger = require('../utils/logger');

/**
 *
 * @param {*} ip
 * @param {*} queryPort
 * @param {*} queryProtocol
 * @param {*} guildID
 * @param {*} serverUUID
 * @return {object}
 */
async function serverQuery(ip, queryPort, queryProtocol, guildID, serverUUID) {
  logger.debug('Starting server query...');
  const maxRetries = 5;
  let retries = 0;
  let state;
  while (retries < maxRetries) {
    logger.debug(`Attempting to query server. Attempt: ${retries + 1}`);
    try {
      logger.debug(`Querying game server with UUID: ${serverUUID}`);
      state = await Gamedig.query({
        type: queryProtocol,
        host: ip,
        port: queryPort,
      });
      logger.debug(`Successfully queried game server with UUID: ${serverUUID}`);
      break;
    } catch (error) {
      logger.warn(`Failed to query game server with UUID: ${serverUUID}. Error: ${error}`);
      retries++;
      if (retries < maxRetries) {
        logger.warn(`Retrying query (${retries}/${maxRetries})...`);
      }
    }
  }
  logger.debug('Finished querying game server.');
  if (!state) {
    logger.warn('Server query failed after maximum retries. Treating server as offline.');
    state = undefined;
  }
  logger.debug('Sending info to packageData!');
  const packagedData = await packageData(state, guildID, serverUUID);
  logger.debug('Data packaged successfully. Sending data to handleServer.');
  return packagedData;
}

module.exports = serverQuery;
