const {writeServerInfo, getServerInfo} = require('../api/index');
const logger = require('../utils/logger');

/**
 *
 * @param {*} guildID
 * @param {*} serverUUID
 * @return {object}
 */
async function fetchServerInfo(guildID, serverUUID) {
  try {
    const response = await getServerInfo(guildID, serverUUID);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      logger.warn('Server info not found, initializing new server info.');
      return {
        map: null,
        players: [],
        ping: [],
        status: null,
        last_restart: null,
      };
    }
    logger.error(`Error getting server info: ${error}`);
    throw error;
  }
}

/**
 *
 * @param {*} serverInfo
 * @param {*} state
 * @return {object}
 */
function buildQueryState(serverInfo, state) {
  const didRestart = !serverInfo.status && state ? new Date().toISOString() : serverInfo.last_restart;
  const map = (!state ? serverInfo.map || 'Unavailable' : state.map);

  return state ? {
    name: state.name,
    map: map,
    active_players: state.players.length,
    max_players: state.maxplayers,
    players: state.players.map((player) => player),
    ping: state.ping,
    status: true,
    last_restart: didRestart,
  } : {
    name: null,
    map: map,
    active_players: -1,
    max_players: -1,
    players: null,
    ping: -1,
    status: false,
    last_restart: 'Offline',
  };
}

/**
 *
 * @param {*} state
 * @param {*} guildID
 * @param {*} serverUUID
 * @return {object}
 */
async function packageData(state, guildID, serverUUID) {
  logger.debug('Packaging data...');
  const serverInfo = await fetchServerInfo(guildID, serverUUID);
  const queryState = buildQueryState(serverInfo, state);
  logger.debug('Writing server info to server info JSON...');
  await writeServerInfo(guildID, serverUUID, queryState);
  logger.debug('Finished writing server info to server info JSON.');
  logger.debug('Packaged data successfully. Sending data back to queryServer.');
  return queryState;
}

module.exports = packageData;
