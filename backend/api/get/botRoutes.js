const express = require('express');
const axios = require('axios');
require('dotenv').config({ path: '../../../.env' });
const fs = require("fs");

const router = express.Router();

const { readJsonFile, paginateData } = require('./getFunctions');

router.get('/guilds', function(req, res) {
    readJsonFile('./public/servers.json')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error reading server data');
        });
});

router.get('/:guild_id/servers', function(req, res) {
    const { guild_id } = req.params;
  
    readJsonFile('./public/servers.json')
        .then(data => {
            if(data.hasOwnProperty(guild_id)){
                // Get server UUIDs for the guild
                const serverUUIDs = Object.keys(data[guild_id]);
                res.json(serverUUIDs);
            } else {
                res.status(404).send(`No servers found for guild ID: ${guild_id}`);
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error reading server data');
        });
});

router.get('/:guild_id/server/:server_uuid', function(req, res) {
    const { guild_id, server_uuid } = req.params;
  
    readJsonFile('./public/servers.json')
        .then(data => {
            if (data.hasOwnProperty(guild_id) && data[guild_id].hasOwnProperty(server_uuid)) {
                res.json(data[guild_id][server_uuid]);
            } else {
                res.status(404).send('Server not found in the specified guild');
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error reading server data');
        });
});

router.get('/:guild_id/serverInfo/:server_uuid', (req, res) => {
    const { guild_id, server_uuid } = req.params;

    fs.readFile('./public/server_info.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Server error');
        }

        try {
            const allServerInfos = JSON.parse(data);
            
            // get the info for the given guild_id
            const guildInfo = allServerInfos[guild_id];

            if (!guildInfo) {
                return res.status(404).send('No info found for the given guild_id');
            }

            // get the server info for the given server_uuid
            const serverInfo = guildInfo[server_uuid];

            if (!serverInfo) {
                return res.status(404).send('No server info found for the given server_uuid within the specified guild_id');
            }

            return res.json(serverInfo);
        } catch (err) {
            console.error('Error parsing JSON:', err);
            return res.status(400).send('Bad request');
        }
    });
});

module.exports = router;