const axios = require('axios');
const logger = require('../utils/logger');
require('dotenv').config({ path: './.env' });

async function getGuilds(page = 0, pageSize = 10) {
    logger.debug(`Fetching guilds with page: ${page} and pageSize: ${pageSize}`);
    const guilds = await axios.get(`${process.env.BACKEND_URL}api/get/bot/guilds`, {
        params: {
            page: page,
            pageSize: pageSize
        }
    });
    return guilds;
}

async function getServerUUIDsForGuild(guild_id) {
    logger.debug(`Fetching server UUIDs for guild: ${guild_id}`);
    const servers = await axios.get(`${process.env.BACKEND_URL}api/get/bot/${guild_id}/servers`, {});
    return servers;
}

async function getServerDetails(guild_id, server_uuid) {
    logger.debug(`Fetching server details for guild: ${guild_id} and server UUID: ${server_uuid}`);
    const details = await axios.get(`${process.env.BACKEND_URL}api/get/bot/${guild_id}/server/${server_uuid}`, {});
    return details;
}

async function getServerInfo(guild_id, server_uuid) {
    logger.debug(`Fetching server info for guild: ${guild_id} and server UUID: ${server_uuid}`);
    const serverInfo = await axios.get(`${process.env.BACKEND_URL}api/get/bot/${guild_id}/serverInfo/${server_uuid}`, {});
    return serverInfo;
}

async function writeServerInfo(guild_id, server_uuid, server_info) {
    try {
        logger.debug(`Writing server info for guild: ${guild_id} and server UUID: ${server_uuid}`);
        const response = await axios.post(`${process.env.BACKEND_URL}api/post/write-server-info`, {
            guild_id,
            server_uuid,
            server_info,
        });
    } catch (error) {
        logger.error(`Error writing server info for guild: ${guild_id} and server UUID: ${server_uuid}, error: ${error}`);
    }
}

module.exports = {
    getGuilds,
    getServerUUIDsForGuild,
    getServerDetails,
    getServerInfo,
    writeServerInfo
};