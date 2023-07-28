const { writeServerInfo, getServerInfo } = require('../api/index');

async function packageData(state, guild_id, server_uuid) {
    console.log(`\n-- Packaging Data --`)
    console.log(`Guild ID: ${guild_id}`)
    console.log(`Server UUID: ${server_uuid}`)
    console.log(`State: `, state)

    let server_info = {};
    let info = {};
    let did_restart = '';
    let map = '';

    await getServerInfo(guild_id, server_uuid)
        .then(response => {
            info = response.data;
        })
        .catch(console.error);

    console.log(`API Server Info: `, info)

    if (!info.status && state) {
        did_restart = new Date().toISOString();
    } else {
        did_restart = info.last_restart;
    }
    if (!state) {  // server is offline
        if (info.map) {
            map = info.map;
        } else {
            map = 'Unavailable';
        }
    } else {  // server is online
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

    console.log(`Generated Server Info: `, server_info)
    
    await writeServerInfo(guild_id, server_uuid, server_info);

    return { server_info };
}

module.exports = packageData;