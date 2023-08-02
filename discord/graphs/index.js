const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { sma } = require('moving-averages');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

const { getServerDetails, getServerInfo } = require('../api');

// Graph Configurations
const graph_area = require('./graph_area');

async function getServerPlayers(guild_id, server_uuid) {
    logger.debug(`Getting server players for guild: ${guild_id}, server: ${server_uuid}`);
    return getServerInfo(guild_id, server_uuid)
        .then(response => {
            logger.debug(`Server players retrieved`);
            return response.data.players;
        })
        .catch(error => {
            logger.error(`Error getting server players: ${error}`);
        });
}

async function getServerData(guild_id, server_uuid) {
    logger.debug(`Getting server data for guild: ${guild_id}, server: ${server_uuid}`);
    return getServerDetails(guild_id, server_uuid)
        .then(response => {
            logger.debug(`Server data retrieved`);
            return response.data;
        })
        .catch(error => {
            logger.error(`Error getting server data: ${error}`);
        });
}

async function createGraph(guild_id, server_uuid) {
    logger.debug(`Creating graph for guild: ${guild_id}, server: ${server_uuid}`);
    Array.prototype.sma = require('moving-averages').sma;
    const width = 700;
    const height = 500;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    // Set up Player Data, Server Data, and Player Trends Data
    let player_data = await getServerPlayers(guild_id, server_uuid);
    const server_data = await getServerData(guild_id, server_uuid);
    
    const secondsInDay = 24 * 60 * 60;
    let entriesPerDay = Math.round(secondsInDay / server_data.bot_settings.refresh_interval);

    let players;
    let trend_data;
    if (Array.isArray(player_data)) {
        players = player_data.slice(-entriesPerDay);
        trend_data = player_data.slice(0, -entriesPerDay);
    } else {
        logger.warn('player_data is not an array');
    }

    let players_trend = sma(trend_data, 60 / server_data.bot_settings.refresh_interval);
    
    if (players != entriesPerDay) {
        logger.debug(`entriesPerDay: ${entriesPerDay}, players.length: ${players.length}`);
        players = Array(entriesPerDay - players.length).fill(0).concat(players);
    }
    if (trend_data != entriesPerDay) {
        logger.debug(`entriesPerDay: ${entriesPerDay}, trend_data.length: ${trend_data.length}`);
        trend_data = Array(entriesPerDay - trend_data.length).fill(0).concat(trend_data);
    }
    
    // LABELS //
    // This makes labels for every hour of the day the latest (right) value being the current time
    // Will add a customization in the dashboard so the user can select their timezone, for now though, we will use UTC
    let userTimezone = "UTC"; // Default Option: UTC
    let use12Format = true;

    // Get the current time in the user's timezone
    let date = new Date();
    let formatter = new Intl.DateTimeFormat([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false, // Keep this false, if set to true 12 hour format wont work...
        timeZone: userTimezone 
    });
    let timeParts = formatter.format(date).split(':');
    let currentHour = Number(timeParts[0]);
    let currentMinute = Number(timeParts[1]);
    let currentSecond = Number(timeParts[2]);

    let currentTimeInSeconds = (currentHour * 3600) + (currentMinute * 60) + currentSecond;
    
    // Generate Labels 1 label for every hour
    let labels = [];
    // I will add a customization that will switch between 12-24 hour formats
    if (use12Format) {
        labels = Array.from({ length: 24 * 60 * 60 / server_data.bot_settings.refresh_interval }, (v, i) => {
            let totalSeconds = ((i * server_data.bot_settings.refresh_interval) + currentTimeInSeconds) % (24 * 60 * 60);
            let hour24 = Math.floor(totalSeconds / 3600) % 24;
            let hour = hour24 % 12 || 12;
            let ampm = hour24 < 12 ? 'AM' : 'PM';
            let minute = Math.floor((totalSeconds / 60) % 60);
            return (minute % 60 === 0) ? `${hour}:00 ${ampm}` : '';
        });
    } else {
        labels = Array.from({ length: 24 * 60 * 60 / server_data.bot_settings.refresh_interval }, (v, i) => {
            let totalSeconds = ((i * server_data.bot_settings.refresh_interval) + currentTimeInSeconds) % (24 * 60 * 60);
            let hour = Math.floor(totalSeconds / 3600) % 24;
            let minute = Math.floor((totalSeconds / 60) % 60);
            return (minute % 60 === 0) ? `${hour}:00` : '';
        });
    }

    const graphSettings = server_data.graph_settings;
    let configuration = {};

    // Once the graph types are implemented, i will change this so it will check which graph to use based on user input
    // paddedPlayers is the player data after it has been padded with zero's 
    // I need to add the functionality to pad the player data.
    if (true) {
        configuration = graph_area(graphSettings, players, players_trend, labels, server_data.bot_settings.refresh_interval)
    }

    return chartJSNodeCanvas.renderToBuffer(configuration)
        .then((buffer) => {
            let outputPath = path.join(process.cwd(), `./images/${guild_id}.${server_uuid}.png`);
            return new Promise((resolve, reject) => {
                fs.writeFile(outputPath, buffer, (err) => {
                    if (err) {
                        logger.error(`Error writing graph to file: ${err}`);
                        reject(err);
                    } else {
                        logger.debug(`Graph written to file`);
                        resolve(outputPath);
                    }
                });
            });
        })
        .catch(error => {
            logger.error(`Error creating graph: ${error}`);
        });
}

module.exports = createGraph;





