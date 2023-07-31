const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require("express-rate-limit");
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '/.env' });

// Routes
const getRoutes = require('./api/get/getRoutes');
const postRoutes = require('./api/post/postRoutes');

// Initializing express
const app = express();
const PORT = 8081;

const forceHttps = process.env.FORCE_HTTPS === 'true';

// Setting up CORS
app.use(
  cors({
    origin: process.env.CORS_URL, 
    credentials: true,
  })
);

app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 60 * 10,
    max: 1,
    message: "You are being rate limited! Please try again later!",
});

app.use(express.json());

app.use('/api/get', getRoutes);
app.use('/api/post', postRoutes);


// Other non-get/post routes
app.get('/login', (req, res) => {
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.BACKEND_URL}callback&response_type=code&scope=identify%20guilds`);
});

app.get('/logout', (req, res) => {
  try {
      res.clearCookie('AuthenticationToken', { secure: forceHttps, sameSite: 'Strict', httpOnly: true });
  } catch (error) {
      console.error('Error deleting cookie:', error);
  }
  try {
      res.clearCookie('Authenticated', { secure: forceHttps, sameSite: 'Lax', httpOnly: false });
  } catch (error) {
      console.error('Error deleting cookie:', error);
  }
  
  res.redirect(`${process.env.FRONTEND_URL}login`);
});

app.get('/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error === 'access_denied') {
    res.redirect(`${process.env.BACKEND_URL}login`);
      return;
  }
  
  try {
    const response = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.BACKEND_URL}callback`,
        code: code,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = response.data.access_token;

    const AuthenticationToken = jwt.sign({ accessToken }, process.env.SESSION_SECRET, { expiresIn: '1h' });
    const Authenticated = jwt.sign({ isAuthenticated: true } , process.env.SESSION_SECRET, { expiresIn: '1h' });

    res.cookie('AuthenticationToken', AuthenticationToken, {
      httpOnly: true,
      secure: forceHttps,
      sameSite: 'Strict',
    });

    res.cookie('Authenticated', Authenticated, {
      httpOnly: false,
      secure: forceHttps,
      sameSite: 'Lax',
    });

    res.redirect(`${process.env.FRONTEND_URL}dashboard`);
  } catch (error) {
    console.error('Error exchanging authorization code:', error);
    res.status(500).send('An error occurred during the login process.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});