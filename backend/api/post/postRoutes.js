const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const async = require('async');

const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

const secretKey = process.env.SESSION_SECRET;
const forceHttps = process.env.FORCE_HTTPS === 'true';

router.post('/write-bot-settings/:guildID/:serverUUID', (req, res) => {
    const { guildID, serverUUID } = req.params;
    const { settings } = req.body;

    fs.readFile('./public/servers.json', 'utf8', (err, data) => {
        if (err) throw err;

        let servers = JSON.parse(data || '{}');
        if (!servers[guildID]) servers[guildID] = {};
        if (!servers[guildID][serverUUID]) servers[guildID][serverUUID] = {};
        if (!servers[guildID][serverUUID]['bot_settings']) servers[guildID][serverUUID]['bot_settings'] = {};
        
        servers[guildID][serverUUID]['bot_settings'] = settings;

        fs.writeFile('./public/servers.json', JSON.stringify(servers, null, 2), 'utf8', (err) => {
            if (err) throw err;

            res.json({ message: 'Bot settings written.' });
        });
    });
});

router.post('/write-server-settings/:guildID/:serverUUID', (req, res) => {
    const { guildID, serverUUID } = req.params;
    const { settings } = req.body;

    fs.readFile('./public/servers.json', 'utf8', (err, data) => {
        if (err) throw err;

        let servers = JSON.parse(data || '{}');
        if (!servers[guildID]) servers[guildID] = {};
        if (!servers[guildID][serverUUID]) servers[guildID][serverUUID] = {};
        if (!servers[guildID][serverUUID]['server_settings']) servers[guildID][serverUUID]['server_settings'] = {};
        
        servers[guildID][serverUUID]['server_settings'] = settings;

        fs.writeFile('./public/servers.json', JSON.stringify(servers, null, 2), 'utf8', (err) => {
            if (err) throw err;

            res.json({ message: 'Server settings written.' });
        });
    });
});

router.post('/write-embed-settings/:guildID/:serverUUID', (req, res) => {
    const { guildID, serverUUID } = req.params;
    const { settings } = req.body;

    fs.readFile('./public/servers.json', 'utf8', (err, data) => {
        if (err) throw err;

        let servers = JSON.parse(data || '{}');
        if (!servers[guildID]) servers[guildID] = {};
        if (!servers[guildID][serverUUID]) servers[guildID][serverUUID] = {};
        if (!servers[guildID][serverUUID]['embed_settings']) servers[guildID][serverUUID]['embed_settings'] = {};
        if (!servers[guildID][serverUUID]['embed_settings']['thumbnail_settings']) servers[guildID][serverUUID]['embed_settings']['thumbnail_settings'] = {};
        if (!servers[guildID][serverUUID]['embed_settings']['footer_settings']) servers[guildID][serverUUID]['embed_settings']['footer_settings'] = {};
        
        servers[guildID][serverUUID]['embed_settings'] = settings;

        fs.writeFile('./public/servers.json', JSON.stringify(servers, null, 2), 'utf8', (err) => {
            if (err) throw err;

            res.json({ message: 'Embed settings written.' });
        });
    });
});

router.post('/write-embed-field-settings/:guildID/:serverUUID', (req, res) => {
    const { guildID, serverUUID } = req.params;
    const { settings } = req.body;

    fs.readFile('./public/servers.json', 'utf8', (err, data) => {
        if (err) throw err;

        let servers = JSON.parse(data || '{}');
        if (!servers[guildID]) servers[guildID] = {};
        if (!servers[guildID][serverUUID]) servers[guildID][serverUUID] = {};
        
        servers[guildID][serverUUID]['embed_field_settings'] = settings;

        fs.writeFile('./public/servers.json', JSON.stringify(servers, null, 2), 'utf8', (err) => {
            if (err) throw err;

            res.json({ message: 'Embed field settings written.' });
        });
    });
});

router.post('/write-graph-settings/:guildID/:serverUUID', (req, res) => {
    const { guildID, serverUUID } = req.params;
    const graphSettings = req.body;

    fs.readFile('./public/servers.json', 'utf8', (err, data) => {
        if (err) throw err;

        let servers = JSON.parse(data || '{}');
        if (!servers[guildID]) servers[guildID] = {};
        if (!servers[guildID][serverUUID]) servers[guildID][serverUUID] = {};
        
        servers[guildID][serverUUID]['graph_settings'] = graphSettings.settings;

        fs.writeFile('./public/servers.json', JSON.stringify(servers, null, 2), 'utf8', (err) => {
            if (err) throw err;

            res.json({ message: 'Graph settings written.' });
        });
    });
});

router.post('/write-notification-settings/:guildID/:serverUUID', (req, res) => {
    const { guildID, serverUUID } = req.params;
    const notificationSettings = req.body;

    fs.readFile('./public/servers.json', 'utf8', (err, data) => {
        if (err) throw err;

        let servers = JSON.parse(data || '{}');
        if (!servers[guildID]) servers[guildID] = {};
        if (!servers[guildID][serverUUID]) servers[guildID][serverUUID] = {};
        
        servers[guildID][serverUUID]['notification_settings'] = notificationSettings.settings;

        fs.writeFile('./public/servers.json', JSON.stringify(servers, null, 2), 'utf8', (err) => {
            if (err) throw err;

            res.json({ message: 'Notification settings written.' });
        });
    });
});

const queue = async.queue((task, callback) => {
    // fs.writeFile('./public/server_info.json', JSON.stringify(task.data), (err) => {
    fs.writeFile('./public/server_info.json', JSON.stringify(task.data, null, 2), (err) => {
        if (err) {
            console.log(`Error writing file: ${err}`);
            task.res.status(500).send(err.message);
        } else {
            task.res.sendStatus(200);
        }
        callback();
    });
}, 1);

function queueWrite(data, res) {
    queue.push({data: data, res: res}, (err) => {
        if (err) {
            console.log(`Error queuing write operation: ${err}`);
        }
    });
}

router.post('/write-server-info', async (req, res) => {
    const { guild_id, server_uuid, server_info } = req.body;

    try {
        let data = null;
        let attempts = 0;
        
        while (!data && attempts < 5) {
            data = await fs.promises.readFile('./public/server_info.json', 'utf8');
            attempts += 1;
            
            // If data is still null, wait a bit before trying again
            if (!data) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
            }
        }
        
        // If data is still null after 5 attempts, handle the error
        if (!data) {
            console.error('Failed to read file after 5 attempts');
        }
        
        const jsonData = JSON.parse(data || '{}');

        if (!(guild_id in jsonData)) {
            jsonData[guild_id] = {};
        }

        if (!(server_uuid in jsonData[guild_id])) {
            jsonData[guild_id][server_uuid] = {
                map: null,
                players: [],
                ping: [],
                status: null,
                last_restart: null,
                message_id: null,
            };
        }

        jsonData[guild_id][server_uuid].map = server_info.map;
        jsonData[guild_id][server_uuid].players.push(server_info.active_players);
        jsonData[guild_id][server_uuid].ping.push(server_info.ping);
        jsonData[guild_id][server_uuid].status = server_info.status;
        jsonData[guild_id][server_uuid].last_restart = server_info.last_restart;
        jsonData[guild_id][server_uuid].message_id = server_info.message_id;

        queueWrite(jsonData, res);
    } catch (err) {
        console.log(`Error reading or processing file: ${err}`);
        res.status(500).send(err.message);
    }
});

router.delete('/delete-server', async (req, res) => {
    const { guild_id, server_uuid } = req.body;

    if (!guild_id || !server_uuid) {
        return res.status(400).json({ error: 'guild_id and server_uuid are required.' });
    }

    try {
        // Read and parse server_info.json
        let serverInfoData = JSON.parse(await fs.readFile('./public/server_info.json', 'utf8'));
        // Delete server_uuid
        if (serverInfoData[guild_id]) {
            delete serverInfoData[guild_id][server_uuid];
        }
        // Write the modified data back to server_info.json
        await fs.writeFile('./public/server_info.json', JSON.stringify(serverInfoData, null, 2));

        // Read and parse servers.json
        let serversData = JSON.parse(await fs.readFile('./public/servers.json', 'utf8'));
        // Delete server_uuid
        if (serversData[guild_id]) {
            delete serversData[guild_id][server_uuid];
        }
        // Write the modified data back to servers.json
        await fs.writeFile('./public/servers.json', JSON.stringify(serversData, null, 2));

        res.json({ message: 'Server UUID deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete server UUID.' });
    }
});

module.exports = router;