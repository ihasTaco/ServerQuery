require('dotenv').config({ path: '../.env' });
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
function debug(...messages) {
    writeLog('DEBUG', messages, chalk.green);
}

// Info log function
function info(...messages) {
    writeLog('INFO ', messages, chalk.white);
}

// Warning log function
function warn(...messages) {
    writeLog('WARN ', messages, chalk.yellow);
}

// Error log function
function error(...messages) {
    writeLog('ERROR', messages, chalk.red);
}

// Fatal log function
function fatal(...messages) {
    writeLog('FATAL', messages, chalk.magenta);
}

// Function to write a log message with a given type
function writeLog(type, messages, color) {
    let date = new Date();
    let timestamp = chalk.cyan(`[ ${date.toISOString()} ]`);
    let coloredType = color(`[ ${type} ]`);
    let logMessage = messages.map(message => {
        if (typeof message === 'object') {
            const cache = new Set();
            return JSON.stringify(message, (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (cache.has(value)) {
                        // Duplicate reference found, discard key
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
        let consoleLogMessage = `${timestamp} | ${coloredType} | ${chalk.white(logMessage)}`;
        console.log(consoleLogMessage);
    } else if (process.env.USE_DEBUG === 'true' && type === 'DEBUG') {
        let consoleLogMessage = `${timestamp} | ${coloredType} | ${chalk.white(logMessage)}`;
        console.log(consoleLogMessage);
    }

    fs.appendFileSync(logFile, `[ ${date.toISOString()} ] | [ ${type} ] | ${logMessage}\n`);
}

// Schedule job to rotate logs
schedule.scheduleJob('0 0 * * *', function(){
    let date = new Date();
    let filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.txt`;
    let newFilePath = path.join(logDir, filename);

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
    fatal
};