const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

module.exports = app;

app.use(express.json());

app.get('/api/get/access-token', (req, res) => {
    const jwtToken = req.cookies.AuthenticationToken;
  
    if (!jwtToken) {
        return res.status(401).json({ message: 'No JWT found.' });
    }
  
    try {
        // Verify and decode the JWT
        const decodedToken = jwt.verify(jwtToken, secretKey);
        
        // Access the encrypted access token within the JWT payload
        const accessToken = decodedToken.accessToken;
        
        res.json({ accessToken });
    } catch (error) {
        console.error('Error verifying JWT:', error);
        res.status(500).send('An error occurred while verifying the JWT.');
    }
});
  
app.get('/api/get/user-data', async (req, res) => {
    console.log('test')
    const jwtToken = req.cookies.AuthenticationToken;
  
    if (!jwtToken) {
        return res.status(401).json({ message: 'No JWT found.' });
    }
  
    try {
        // Verify and decode the JWT
        const decodedToken = jwt.verify(jwtToken, secretKey);
  
        // Access the encrypted access token within the JWT payload
        const accessToken = decodedToken.accessToken;
  
        try {
            const response = await axios.get(`https://discord.com/api/user/${ accessToken }`,
            {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            });
  
            res.json({ response });
      } catch (error) {
            console.error('Error GET user data:', error);
            res.status(500).send('An error occurred while getting user data.');
      }
    } catch (error) {
        console.error('Error verifying JWT:', error);
        res.status(500).send('An error occurred while verifying the JWT.');
    }
});