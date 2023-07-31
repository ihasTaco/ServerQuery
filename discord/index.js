const { ShardingManager } = require('discord.js');
const path = require('path');
const { getGuilds } = require('./api');
require('dotenv').config({ path: '../.env' });

process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});

process.on('error', (error) => {
    console.error('Unhandled error:', error);
});

async function setup() {

    // Guild threshold before sharding
    const guildThreshold = 2500;

    let guilds = await getGuilds();
    let numGuilds = Object.keys(guilds.data).length;

    // Calculate the number of shards we need
    let numShards = Math.ceil(numGuilds / guildThreshold);

    // Start the sharding manager
    const manager = new ShardingManager(path.join(__dirname, 'bot.js'), { 
        token: process.env.BOT_TOKEN,
        totalShards: numShards 
    });

    // Spawn shards
    manager.spawn();

    // Log when a shard is created
    manager.on('shardCreate', shard => console.log(`Shard ${shard.id} created`));
}

setup();