const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const clientId = process.env.GITHUB_CLIENT_ID; // Ensure these are set in your .env file
const clientSecret = process.env.GITHUB_CLIENT_SECRET; // Ensure these are set in your .env file
const redirectUri = 'http://localhost:5173'; // Update this to match your React frontend

// Route to initiate the GitHub login process
app.get('/github-login', (req, res) => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}/callback`;
  console.log('Redirecting to GitHub for login');
  res.redirect(authUrl);
});

// Callback route after GitHub redirects back
app.get('/callback', async (req, res) => {
  const requestToken = req.query.code; // Get the authorization code from the query

  try {
    const response = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: clientId,
        client_secret: clientSecret,
        code: requestToken,
        redirect_uri: `${redirectUri}/callback`, // Ensure this matches what you set in GitHub
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = response.data.access_token; // Get the access token from the response

    
    if (accessToken) {
      // Redirect to the frontend with the token as a query parameter
      res.redirect(`${redirectUri}/?token=${accessToken}`);
      
    } else {
      console.log('token missing');
      
      res.status(500).send('Token not found');
    }
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).send('Error exchanging code for token');
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
