const jwt = require('jsonwebtoken');
const fs = require("fs");
require('dotenv').config({ path: '../../../.env' });

function verifyToken(req, res) {
    const jwtToken = req.cookies.AuthenticationToken;

    accessToken = null;
  
    if (!jwtToken) {
        res.status(401).json({ message: 'No JWT found.' });
        return;
    }
  
    try {
        const decodedToken = jwt.verify(jwtToken, process.env.SESSION_SECRET);
        const accessToken = decodedToken.accessToken;
        
        return accessToken;
    } catch (error) {
        res.status(500).send('An error occurred while verifying the JWT.');
    }
}

function readJsonFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8', (err, data) => {
            if (err) reject(err);
            else resolve(JSON.parse(data));
        });
    });
}

function paginateData(data, page, pageSize) {
    // Convert the data object into an array of [key, value] pairs
    const entries = Object.entries(data);
  
    // Paginate the array
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedEntries = entries.slice(start, end);
  
    // Convert the array back into an object
    const paginatedData = {};
    for (const [key, value] of paginatedEntries) {
      paginatedData[key] = Object.keys(value);  // This will give you the UUIDs
    }
  
    return paginatedData;
  }

module.exports = {
    verifyToken,
    readJsonFile,
    paginateData
};