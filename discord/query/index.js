const Gamedig = require('gamedig');
const packageData = require('./packageData');
const logger = require('../utils/logger');

async function queryServer(ip, query_port, query_protocol, guild_id, server_uuid) {
    logger.debug('Starting server query...');

    const maxRetries = 5;
    let retries = 0;
    let state;
    while (retries < maxRetries) {
        logger.debug(`Attempting to query server. Attempt: ${retries + 1}`);
        try {
            logger.debug(`Querying game server with UUID: ${server_uuid}`);
            state = await Gamedig.query({
                type: query_protocol,
                host: ip,
                port: query_port
            });
            logger.debug(`Successfully queried game server with UUID: ${server_uuid}`);
            break;
        } catch (error) {
            logger.warn(`Failed to query game server with UUID: ${server_uuid}. Error: ${error}`);
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

    logger.debug('Packaging data...');
    const packagedData = await packageData(state, guild_id, server_uuid);
    logger.debug('Data packaged successfully. Sending data to handleServer.');
    return packagedData;
}

module.exports = queryServer;
