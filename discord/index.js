const { ShardingManager } = require('discord.js');
const path = require('path');
const { getGuilds } = require('./api');
require('dotenv').config({ path: '../.env' });
const logger = require('./utils/logger');

process.on('unhandledRejection', (error) => {
    logger.error('Unhandled promise rejection:', error);
});

process.on('error', (error) => {
    logger.error('Unhandled error:', error);
});

async function setup() {
    logger.info('Starting Server Query');
    logger.info('Version: v1.0.0-alpha.2');

    // Guild threshold before sharding
    const guildThreshold = 2500;
    logger.debug(`Guild Threshold: ${guildThreshold}`);

    let guilds = await getGuilds();
    let numGuilds = Object.keys(guilds.data).length;
    logger.debug(`Guilds : ${numGuilds}`);

    // Calculate the number of shards we need
    let numShards = Math.ceil(numGuilds / guildThreshold);
    logger.debug(`Number of Shards: ${numShards}`);

    // Start the sharding manager
    const manager = new ShardingManager(path.join(__dirname, 'bot.js'), { 
        token: process.env.BOT_TOKEN,
        totalShards: numShards 
    });

    logger.info('Starting the Sharding Manager');

    // Spawn shards
    manager.spawn();

    // Log when a shard is created
    manager.on('shardCreate', shard => logger.info(`Shard ${shard.id} created`));
}

setup();
