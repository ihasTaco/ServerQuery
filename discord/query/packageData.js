const { writeServerInfo, getServerInfo } = require('../api/index');
const logger = require('../utils/logger');

async function packageData(state, guild_id, server_uuid) {
    logger.debug('Packaging data...');

    let server_info = {};
    let info = {};
    let did_restart = '';
    let map = '';

    logger.debug('Getting server info...');
    await getServerInfo(guild_id, server_uuid)
        .then(response => {
            info = response.data;
            logger.debug('Got server info.');
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                logger.warn('Server info not found, initializing new server info.');
                info = {
                    map: null,
                    players: [],
                    ping: [],
                    status: null,
                    last_restart: null,
                    message_id: null,
                };
            } else {
                logger.error(`Error getting server info: ${error}`);
                throw error;
            }
        });

    logger.debug('Setting server info details...');
    if (!info.status && state) {
        did_restart = new Date().toISOString();
    } else {
        did_restart = info.last_restart;
    }
    if (!state) {
        if (info.map) {
            map = info.map;
        } else {
            map = 'Unavailable';
        }
    } else {
        map = state.map;
    }

    if (!state) {
        server_info = {
            name: null,
            map: map,
            active_players: -1,
            max_players: -1,
            players: null,
            ping: -1,
            status: false,
            last_restart: 'Offline',
            message_id: info.message_id ? info.message_id : null,
        };
    } else {
        server_info = {
            name: state.name,
            map: map,
            active_players: state.players.length,
            max_players: state.maxplayers,
            players: state.players.map(player => player),
            ping: state.ping,
            status: true,
            last_restart: did_restart,
            message_id: info.message_id ? info.message_id : null,
        };
    }

    logger.debug('Writing server info to server info JSON...');
    await writeServerInfo(guild_id, server_uuid, server_info);
    logger.debug('Finished writing server info to server info JSON.');
    logger.debug('Packaged data successfully. Sending data back to queryServer.');
    return { server_info };
}

module.exports = packageData;