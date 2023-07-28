const express = require('express');
const axios = require('axios');
require('dotenv').config({ path: '../../../.env' });

const { verifyToken } = require('./getFunctions');

const router = express.Router();

router.get('/user', async (req, res) => {
    accessToken = verifyToken(req, res);

    if (accessToken != null) {
        try {
            const response = await axios.get(`https://discord.com/api/users/@me`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                }
            });
        
                const userData = response.data;
        
                res.json(userData);
        } catch (error) {
            console.error('Error GET user data:', error);
            res.status(500).send('An error occurred while getting user data.');
        }
    } else {
        return;
    }
});

router.get('/user/guilds', async (req, res) => {
    accessToken = verifyToken(req, res);

    if (accessToken != null) {
        try {
            const response = await axios.get('https://discord.com/api/users/@me/guilds', {
                headers: {
                Authorization: `Bearer ${accessToken}`,
                },
            });
    
            const guilds = response.data;
    
            const filteredGuilds = guilds.filter(guilds => guilds.permissions == '2147483647');
    
            res.json(filteredGuilds);
        } catch (error) {
            console.error('Error GET user guilds:', error);
            res.status(500).send('An error occurred while getting user guilds.');
        }
    } else {
        return;
    }
});

router.get('/guild/:serverId', async (req, res) => {
    const serverId = req.params.serverId;
    const botToken = process.env.BOT_TOKEN;

    try {
        const response = await axios.get(`https://discord.com/api/v10/guilds/${serverId}`, {
            headers: {
                Authorization: `Bot ${botToken}`,
            },
        });

        guild = response.data;

        res.json({ guild });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.json(error.response.data);
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

router.get('/guild/:serverId/presence', async (req, res) => {
    const serverId = req.params.serverId;
    const botToken = process.env.BOT_TOKEN;
    const clientID = process.env.CLIENT_ID;

    try {
        const response = await axios.get(`https://discord.com/api/guilds/${serverId}/members/${clientID}`, {
          headers: {
            Authorization: `Bot ${botToken}`,
          },
        });
    
        const botPresent = response.status === 200;

        res.json({ botPresent });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.json({ botPresent: false });
        } else {
            console.error('Error checking bot presence:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

router.get('/guild/:guildId/emojis/', async (req, res) => {
    const { guildId } = req.params;
    const botToken = process.env.BOT_TOKEN;
    
    try {
        const response = await axios.get(`https://discord.com/api/guilds/${guildId}/emojis`, {
            headers: {
                'Authorization': `Bot ${botToken}`
            }
        });

        const emojis = response.data;

        res.json(emojis);
    } catch (error) {
        console.error('Error GET server emojis:', error);
        res.status(500).send('An error occurred while getting server emojis.');
    }
});

router.get('/guild/:guildId/channels/', async (req, res) => {
    const { guildId } = req.params;
    const botToken = process.env.BOT_TOKEN;
    
    try {
        const response = await axios.get(`https://discord.com/api/guilds/${guildId}/channels`, {
            headers: {
                'Authorization': `Bot ${botToken}`
            }
        });

        const channels = response.data;

        res.json(channels);
    } catch (error) {
        console.error('Error GET server emojis:', error);
        res.status(500).send('An error occurred while getting server emojis.');
    }
});

module.exports = router;