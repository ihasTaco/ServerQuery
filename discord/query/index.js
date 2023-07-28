const Gamedig = require('gamedig');
const packageData = require('./packageData');

async function queryServer(ip, query_port, query_protocol, guild_id, server_uuid) {
    console.log(`\n-- Query --`)
    console.log(`Guild ID: ${guild_id}`)
    console.log(`Server UUID: ${server_uuid}`)
    console.log(`IP: ${ip}`)
    console.log(`Query Port: ${query_port}`)
    console.log(`Query Protocol: ${query_protocol}`)

    const maxRetries = 5;
    let retries = 0;
    let state;
    while (retries < maxRetries) {
        try {
            console.log(`Trying to Query Game Server: ${server_uuid}`)
            state = await Gamedig.query({
                type: query_protocol,
                host: ip,
                port: query_port
            });
            console.log(`Finished Querying Game Server: ${server_uuid}`)
            break;
        } catch (error) {
            console.log(`Failed to Query Game Server: ${server_uuid}`)
            //console.error('Error querying server:', error);
            retries++;
            if (retries < maxRetries) {
                console.log(`Retrying query (${retries}/${maxRetries})...`);
            }
        }
    }
    if (!state) {
        console.log('Server query failed after maximum retries. Treating server as offline.');
        state = undefined;
    }
    const packagedData = await packageData(state, guild_id, server_uuid);
    return packagedData;
}

module.exports = queryServer;