require('dotenv').config();
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { AttachmentBuilder } = require('discord.js');
const logger = require('../utils/logger');

function replaceVariables(str, server_settings, server_query) {
    if (str) {
        let server_variables = {
            game: server_settings.server_settings.game.toString(),
            map: server_query.map.toString(),
            ip: server_settings.server_settings.ip.toString(),
            connection_port: server_settings.server_settings.connection_port.toString(),
            query_port: server_settings.server_settings.query_port.toString(),
            players_active: server_query.status ? server_query.active_players.toString() : "--",
            players_max: server_query.status ? server_query.max_players.toString() : "--",
            server_name: server_settings.bot_settings.server_name.toString(),
            server_status: server_query.status
        };

        return str.replace(/\{([a-z_]+)\}/gi, function(match, variable) {
            return server_variables[variable.toLowerCase()] || match;
        });
    } else {
        return;
    }
}

async function createEmbed(server_settings, graph_url, server_query) {
    logger.debug('Creating embed...');
    let embed = new EmbedBuilder()
      .setTitle(replaceVariables(server_settings.embed_settings.embed_title, server_settings, server_query))
      .setDescription(replaceVariables(server_settings.embed_settings.embed_description, server_settings, server_query))
      .setColor(server_settings.embed_settings.embed_color);
  
    if (!server_settings.embed_settings.disable_timestamp) {
        embed.setTimestamp();
    }
    if (!server_settings.embed_settings.thumbnail_settings.disable_thumbnail) {
        embed.setThumbnail(server_settings.embed_settings.thumbnail_settings.thumbnail_url);
    }
    if (!server_settings.embed_settings.footer_settings.disable_footer) {
        embed.setFooter({ text: server_settings.embed_settings.footer_settings.footer_text, iconURL: server_settings.embed_settings.footer_settings.footer_url })
    }

    // Field Assignment
    let fieldsArray = Object.entries(server_settings.embed_field_settings.embed_fields)
        .map(([key, value]) => ({ name: key, ...value }))
        .filter(field => !field.disable)
        .sort((a, b) => a.index - b.index);

    fieldsArray.forEach(field => {
        let fieldName = field.name;
        let fieldValue;
      
        if (field.name === 'status') {
          // For the status field, use online/offline text as the value
          fieldValue = server_query.status ? `${field.online_emoji}  ${replaceVariables(field.online_text, server_settings, server_query)}` : `${field.offline_emoji} ${replaceVariables(field.offline_text, server_settings, server_query)}` ;
        } else {
            fieldValue = '';
            if (field.emoji) {
                fieldValue = fieldValue + field.emoji;
            }
            if (field.text) {
                fieldValue = `${fieldValue} ${replaceVariables(field.text, server_settings, server_query)}`;
            }
        }
        fieldName = fieldName.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      
        // Check that both name and value are defined before adding the field
        if (fieldName && fieldValue) {
            embed.addFields({name: fieldName, value: fieldValue, inline: field.inline});
        }
    });

    if (!server_settings.embed_settings.disable_player_names) {
        if (server_query.players && server_query.players.length > 0) {
            const playerNames = server_query.players.map(player => player.name);
            const playerList = '\n' + playerNames.join('\n');
        
            embed.addFields({name: 'Online Players', value: `\`\`\`${playerList}\`\`\``, inline: false});
        }
    }

    logger.debug('Adding image to embed...');
    const attachment = new AttachmentBuilder(graph_url, { name: 'chart.png' });
    embed.setImage('attachment://chart.png');

    logger.debug('Embed created.');
    return [embed, attachment];
}

module.exports = {
    createEmbed
};