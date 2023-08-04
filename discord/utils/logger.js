require('dotenv').config({path: '../.env'});
const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const chalk = require('chalk');

const logDir = path.join(`${__dirname}/../`, 'logs');
const logFile = path.join(logDir, '_latest.log');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Ensure _latest.txt exists
if (!fs.existsSync(logFile)) {
  fs.writeFileSync(logFile, '');
}

// Debug log function
/**
 * Debug log function
 * @param  {...any} messages
 */
function debug(...messages) {
  writeLog('DEBUG', messages, chalk.green);
}

/**
 * Info log function
 * @param  {...any} messages
 */
function info(...messages) {
  writeLog('INFO ', messages, chalk.white);
}

/**
 * Warning log function
 * @param  {...any} messages
 */
function warn(...messages) {
  writeLog('WARN ', messages, chalk.yellow);
}

/**
 * Error log function
 * @param  {...any} messages
 */
function error(...messages) {
  writeLog('ERROR', messages, chalk.red);
}

/**
 * Fatal log function
 * @param  {...any} messages
 */
function fatal(...messages) {
  writeLog('FATAL', messages, chalk.magenta);
}

// Function to write a log message with a given type
/**
 * Function to write a log message with a given type
 * @param {*} type
 * @param {*} messages
 * @param {*} color
 */
function writeLog(type, messages, color) {
  const date = new Date();
  const timestamp = chalk.cyan(`[ ${date.toISOString()} ]`);
  const coloredType = color(`[ ${type} ]`);
  const logMessage = messages.map((message) => {
    if (typeof message === 'object') {
      const cache = new Set();
      return JSON.stringify(message, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (cache.has(value)) {
            return;
          }
          // Store value in our collection
          cache.add(value);
        }
        return value;
      }, 2);
    } else {
      return message;
    }
  }).join(' ');
  if (type != 'DEBUG') {
    const consoleLogMessage = `${timestamp} | ${coloredType} | ${chalk.white(logMessage)}`;
    console.log(consoleLogMessage);
  } else if (process.env.USE_DEBUG === 'true' && type === 'DEBUG') {
    const consoleLogMessage = `${timestamp} | ${coloredType} | ${chalk.white(logMessage)}`;
    console.log(consoleLogMessage);
  }
  fs.appendFileSync(logFile, `[ ${date.toISOString()} ] | [ ${type} ] | ${logMessage}\n`);
}

/**
 * Schedule job to rotate logs
 */
schedule.scheduleJob('0 0 * * *', function() {
  const date = new Date();
  const filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.txt`;
  const newFilePath = path.join(logDir, filename);
  // Rename _latest.txt to the new file
  fs.renameSync(logFile, newFilePath);
  // Create a new _latest.txt for the next day's logs
  fs.writeFileSync(logFile, '');
});

module.exports = {
  debug,
  info,
  warn,
  error,
  fatal,
};
