const { ShardingManager } = require('discord.js');
const { getGuildCount } = require('./bot');

const SHARDING_THRESHOLD = 2500; // Number of guilds to enable sharding

async function startBot() {
     const guildCount = await getGuildCount();

    if (guildCount < SHARDING_THRESHOLD) {
        // Run without sharding
        require('./bot');
    } else {
        // Run with sharding
        const manager = new ShardingManager('./bot.js', {
            totalShards: 'auto',
        });

        manager.on('shardCreate', shard => {
            console.log(`Launched shard ${shard.id}`);
        });

        manager.spawn();
    }
}

startBot();