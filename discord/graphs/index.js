/* eslint-disable no-extend-native */
const {ChartJSNodeCanvas} = require('chartjs-node-canvas');
const {sma} = require('moving-averages');
const {join} = require('path');
const {writeFile} = require('fs');
const logger = require('../utils/logger');
const {getServerInfo} = require('../api');

// Graph Configurations
const graphArea = require('./graph_area');

/**
 *
 * @param {string} guildID
 * @param {string} serverUUID
 * @return {object}
 */
async function getServerPlayers(guildID, serverUUID) {
  logger.debug(`Getting server players for guild: ${guildID}, server: ${serverUUID}`);
  return getServerInfo(guildID, serverUUID)
      .then((response) => {
        logger.debug(`Server players retrieved`);
        return response.data.players;
      })
      .catch((error) => {
        logger.error(`Error getting server players: ${error}`);
      });
}

/**
 *
 * @param {*} guildID
 * @param {*} serverUUID
 * @param {*} serverCustomizationSettings
 * @return {string}
 */
async function createGraph(guildID, serverUUID, serverCustomizationSettings) {
  logger.debug(`Creating graph for guild: ${guildID}, server: ${serverUUID}`);
  Array.prototype.sma = require('moving-averages').sma;
  const width = 700;
  const height = 500;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({width, height});
  // Set up Player Data, Server Data, and Player Trends Data
  const playerData = await getServerPlayers(guildID, serverUUID);

  const secondsInDay = 24 * 60 * 60;
  const entriesPerDay = Math.round(secondsInDay / serverCustomizationSettings.bot_settings.refresh_interval);
  let players;
  let trendData;
  if (Array.isArray(playerData)) {
    trendData = playerData;
    players = playerData.slice(-entriesPerDay);
  } else {
    logger.warn('playerData is not an array');
  }

  if (players.length != entriesPerDay) {
    logger.debug(`entriesPerDay: ${entriesPerDay}, players.length: ${players.length}`);
    players = Array(entriesPerDay - players.length).fill(0).concat(players);
    logger.debug(`players.length after padding: ${players.length}`);
  }
  if (trendData.length != entriesPerDay) {
    logger.debug(`entriesPerDay: ${entriesPerDay}, trendData.length: ${trendData.length}`);
    trendData = Array(entriesPerDay - trendData.length).fill(0).concat(trendData);
    logger.debug(`trend_data.length after padding: ${trendData.length}`);
  }
  const playersTrend = sma(trendData, 60 / serverCustomizationSettings.bot_settings.refresh_interval);

  // LABELS //
  // This makes labels for every hour of the day the latest (right) value being the current time
  // Will add a customization in the dashboard so the user can select their timezone, for now though, we will use UTC
  const userTimezone = 'UTC'; // Default Option: UTC
  const use12Format = true;
  // Get the current time in the user's timezone
  const date = new Date();
  const formatter = new Intl.DateTimeFormat([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Keep this false, if set to true 12 hour format wont work...
    timeZone: userTimezone,
  });
  const timeParts = formatter.format(date).split(':');
  const currentHour = Number(timeParts[0]);
  const currentMinute = Number(timeParts[1]);
  const currentSecond = Number(timeParts[2]);
  const currentTimeInSeconds = (currentHour * 3600) + (currentMinute * 60) + currentSecond;

  // Generate Labels 1 label for every hour
  let labels = [];
  // I will add a customization that will switch between 12-24 hour formats
  if (use12Format) {
    labels = Array.from({length: 24 * 60 * 60 / serverCustomizationSettings.bot_settings.refresh_interval}, (v, i) => {
      const totalSeconds = ((i * serverCustomizationSettings.bot_settings.refresh_interval) + currentTimeInSeconds) % (24 * 60 * 60);
      const hour24 = Math.floor(totalSeconds / 3600) % 24;
      const hour = hour24 % 12 || 12;
      const ampm = hour24 < 12 ? 'AM' : 'PM';
      const minute = Math.floor((totalSeconds / 60) % 60);
      return (minute % 60 === 0) ? `${hour}:00 ${ampm}` : '';
    });
  } else {
    labels = Array.from({length: 24 * 60 * 60 / serverCustomizationSettings.bot_settings.refresh_interval}, (v, i) => {
      const totalSeconds = ((i * serverCustomizationSettings.bot_settings.refresh_interval) + currentTimeInSeconds) % (24 * 60 * 60);
      const hour = Math.floor(totalSeconds / 3600) % 24;
      const minute = Math.floor((totalSeconds / 60) % 60);
      return (minute % 60 === 0) ? `${hour}:00` : '';
    });
  }

  let configuration = {};
  // Once the graph types are implemented, i will change this so it will check which graph to use based on user input
  if (true) {
    configuration = graphArea(serverCustomizationSettings.graph_settings, players, playersTrend, labels, serverCustomizationSettings.bot_settings.refresh_interval);
  }
  return chartJSNodeCanvas.renderToBuffer(configuration)
      .then((buffer) => {
        const outputPath = join(process.cwd(), `./images/${guildID}.${serverUUID}.png`);
        return new Promise((resolve, reject) => {
          writeFile(outputPath, buffer, (err) => {
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
      .catch((error) => {
        logger.error(`Error creating graph: ${error}`);
      });
}


module.exports = createGraph;
