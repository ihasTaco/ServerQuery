const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
require('dotenv').config({ path: './.env' });

const router = express.Router();

const defaultSettings = require('../../public/default_server.json');

router.get('/authenticatedToken', async (req, res) => {
    const jwtToken = req.cookies.Authenticated;

    token = null;
  
    if (!jwtToken) {
        res.status(401).json({ message: 'No Token found.' });
        return;
    }
  
    try {
        const decodedToken = jwt.verify(jwtToken, process.env.SESSION_SECRET);
        const token = decodedToken.isAuthenticated;
        res.json(token);
    } catch (error) {
        console.error('Error verifying Token:', error);
        res.status(500).send('An error occurred while verifying Authentication Token.');
    }
});

router.get('/invite-bot/:serverId', (req, res) => {
    const { serverId } = req.params;
    const botToken = process.env.CLIENT_ID;

    fs.readFile('./public/servers.json', 'utf8', (err, data) => {
        if (err) throw err;

        const servers = JSON.parse(data || '{}');
        if (!servers[serverId]) {
            servers[serverId] = {};
            fs.writeFile('./public/servers.json', JSON.stringify(servers, null, 2), 'utf8', (err) => {
                if (err) throw err;
            });
        }
    });

    res.redirect(`https://discord.com/oauth2/authorize?client_id=${botToken}&permissions=76800&scope=bot&guild_id=${serverId}&response_type=code&redirect_uri=${process.env.BACKEND_URL}callback`);
});

router.get('/check-server/:serverId', (req, res) => {
    const { serverId } = req.params;

    fs.readFile('./public/servers.json', 'utf8', (err, data) => {
        if (err) throw err;

        const servers = JSON.parse(data || '{}');
        if (!servers[serverId]) {
            servers[serverId] = {};
            fs.writeFile('./public/servers.json', JSON.stringify(servers, null, 2), 'utf8', (err) => {
                if (err) throw err;

                res.json({ message: 'Server added.' });
            });
        } else {
            res.json({ message: 'Server already exists.' });
        }
    });
});

router.get('/generate-uuid/:guild_id', (req, res) => {
    const { guild_id } = req.params;
    const server_uuid = uuidv4();

    fs.readFile('./public/servers.json', 'utf8', (err, data) => {
        if (err) throw err;

        const servers = JSON.parse(data || '{}');

        if (!servers[guild_id]) {
            servers[guild_id] = { [server_uuid]: defaultSettings };
        } else {
            servers[guild_id][server_uuid] = defaultSettings;
        }

        fs.writeFile('./public/servers.json', JSON.stringify(servers, null, 2), 'utf8', (err) => {
            if (err) throw err;
        });
    });

    fs.readFile('./public/server_info.json', 'utf8', (err, data) => {
        if (err) throw err;

        const serverInfo = JSON.parse(data || '{}');

        // Check if guild ID and server UUID are present, and initialize with default settings if not
        if (!serverInfo[guild_id]) {
            serverInfo[guild_id] = {};
        }
        if (!serverInfo[guild_id][server_uuid]) {
            serverInfo[guild_id][server_uuid] = {
                'players': [], 
                'ping': [], 
                'map': null, 
                'status': null, 
                'last_restart': null, 
                'message_id': null
            };
        }

        fs.writeFile('./public/server_info.json', JSON.stringify(serverInfo, null, 2), 'utf8', (err) => {
            if (err) throw err;
        });
    });
    
    res.json({ server_uuid })
});

router.get('/servers/:guildId', (req, res) => {
    const { guildId } = req.params;

    fs.readFile('./public/servers.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading servers.json:', err);
            res.status(500).send('An error occurred while reading the server data.');
            return;
        }

        const servers = JSON.parse(data || '{}');

        if (!servers[guildId]) {
            res.status(404).json({ message: 'No servers found for this guild.' });
            return;
        }

        res.json(servers[guildId]);
    });
});

module.exports = router;