const {ShardingManager} = require('discord.js');
const {getGuildCount} = require('./bot');

const SHARDING_THRESHOLD = 2500;

/**
 * Checks if the bot is more than 2500 guilds, and will start the bot with sharding or not
 */
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
    manager.on('shardCreate', (shard) => {
      console.log(`Launched shard ${shard.id}`);
    });
    manager.spawn();
  }
}

startBot();
