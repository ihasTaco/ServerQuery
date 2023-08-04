require('dotenv').config({path: './.env'});
const {EmbedBuilder} = require('discord.js');
const {AttachmentBuilder} = require('discord.js');
const logger = require('../utils/logger');

/**
 * Replaces text variables within a string with specific server information.
 *
 * @param {string} str - The input string containing placeholders enclosed in curly braces.
 * @param {object} serverCustomizationSettings - The server settings object containing game, IP, port, and other details.
 * @param {object} queryState - The server query object containing information about the map, active players, max players, and server status.
 * @return {string} The input string with placeholders replaced with actual server information.
 */
function replaceVariables(str, serverCustomizationSettings, queryState) {
  if (str) {
    const serverVariables = {
      game: serverCustomizationSettings?.server_settings?.game?.toString() || '',
      map: queryState.map?.toString() || '',
      ip: serverCustomizationSettings?.server_settings?.ip?.toString() || '',
      connection_port: serverCustomizationSettings?.server_settings?.connection_port?.toString() || '',
      query_port: serverCustomizationSettings?.server_settings?.query_port?.toString() || '',
      players_active: queryState.status ? queryState.active_players?.toString() : '--',
      players_max: queryState.status ? queryState.max_players?.toString() : '--',
      server_name: serverCustomizationSettings?.bot_settings?.server_name?.toString() || '',
      server_status: queryState.status || '',
    };

    return str.replace(/\{([a-z_]+)\}/gi, function(match, variable) {
      return serverVariables[variable.toLowerCase()] || match;
    });
  }
}

/**
 * Creates an embed object with server details, including title, description, color, fields, and attachments.
 *
 * @async
 * @param {object} serverCustomizationSettings - The server settings object containing embed settings, field settings, thumbnail, footer, etc.
 * @param {string} graphURL - The URL for the graph image to be attached to the embed.
 * @param {object} queryState - The server query object containing information about the server status, players, etc.
 * @return {Array} An array containing the embed object and attachment (graph image).
 */
async function createEmbed(serverCustomizationSettings, graphURL, queryState) {
  logger.debug('Creating embed...');
  const embed = new EmbedBuilder();

  logger.debug(`Setting Embed Title: ${replaceVariables(serverCustomizationSettings.embed_settings.embed_title, serverCustomizationSettings, queryState)}`);
  embed.setTitle(replaceVariables(serverCustomizationSettings.embed_settings.embed_title, serverCustomizationSettings, queryState));
  logger.debug(`Setting Embed Description: ${serverCustomizationSettings.embed_settings.embed_description}`);
  embed.setDescription(replaceVariables(serverCustomizationSettings.embed_settings.embed_description, serverCustomizationSettings, queryState));
  logger.debug(`Setting Embed Color: ${serverCustomizationSettings.embed_settings.embed_color}`);
  embed.setColor(serverCustomizationSettings.embed_settings.embed_color);

  if (!serverCustomizationSettings.embed_settings.disable_timestamp) {
    logger.debug('Timestamp is enabled!');
    embed.setTimestamp();
  }
  if (!serverCustomizationSettings.embed_settings.thumbnail_settings.disable_thumbnail) {
    logger.debug('Thumbnail is enabled!');
    embed.setThumbnail(serverCustomizationSettings.embed_settings.thumbnail_settings.thumbnail_url);
  }
  if (!serverCustomizationSettings.embed_settings.footer_settings.disable_footer) {
    logger.debug('Footer is enabled!');
    embed.setFooter({text: serverCustomizationSettings.embed_settings.footer_settings.footer_text, iconURL: serverCustomizationSettings.embed_settings.footer_settings.footer_url});
  }

  // Field Assignment
  const fieldsArray = Object.entries(serverCustomizationSettings.embed_field_settings.embed_fields)
      .map(([key, value]) => ({name: key, ...value}))
      .filter((field) => !field.disable)
      .sort((a, b) => a.index - b.index);

  fieldsArray.forEach((field) => {
    let fieldName = field.name;
    let fieldValue;

    if (field.name === 'status') {
      // For the status field, use online/offline text as the value
      fieldValue = queryState.status ? `${field.online_emoji}  ${replaceVariables(field.online_text, serverCustomizationSettings, queryState)}` : `${field.offline_emoji} ${replaceVariables(field.offline_text, serverCustomizationSettings, queryState)}`;
    } else {
      fieldValue = '';
      if (field.emoji) {
        fieldValue = fieldValue + field.emoji;
      }
      if (field.text) {
        fieldValue = `${fieldValue} ${replaceVariables(field.text, serverCustomizationSettings, queryState)}`;
      }
    }
    fieldName = fieldName.replace(/_/g, ' ').split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    // Check that both name and value are defined before adding the field
    if (fieldName && fieldValue) {
      embed.addFields({name: fieldName, value: fieldValue, inline: field.inline});
    }
  });

  if (!serverCustomizationSettings.embed_settings.disable_player_names) {
    if (queryState.players && queryState.players.length > 0) {
      const playerNames = queryState.players.map((player) => player.name);
      const playerList = '\n' + playerNames.join('\n');

      embed.addFields({name: 'Online Players', value: `\`\`\`${playerList}\`\`\``, inline: false});
    }
  }

  logger.debug('Adding image to embed...');
  const attachment = new AttachmentBuilder()
      .setFile(graphURL)
      .setName('chart.png');

  embed.setImage('attachment://chart.png');

  logger.debug('Embed created.');
  return [embed, attachment];
}
module.exports = createEmbed;
