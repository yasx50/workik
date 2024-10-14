const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const { GITHUB_CLIENT_ID: clientId, GITHUB_CLIENT_SECRET: clientSecret } = process.env;
const redirectUri = 'https://3b68-2401-4900-54e7-97a0-68f0-43bb-44e0-575a.ngrok-free.app';
                                         


// Route to initiate the GitHub login process
app.get('/github-login', (req, res) => {
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}/webhook`;
  console.log('Redirecting to GitHub for login');
  res.redirect(authUrl);
});

app.get('/webhook',(req,res)=>{
  res.send("webhook is triggered")
})

app.post('/webhook', (req, res) => {
  const pr = req.body.pull_request;

  if (pr) {
    const prData = {
      title: pr.title,
      body: pr.body,
      number: pr.number,
      state: pr.state,
      author: pr.user.login,
      url: pr.html_url
    };


    
    res.status(200).send("Webhook received and processed pull request");
  } 
});



// Handle the callback after GitHub redirects back (change this to POST)
app.post('/callback', async (req, res) => {
  const { code } = req.body; // Get the authorization code from the frontend

  try {
    const response = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${redirectUri}/callback`,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = response.data.access_token;

    if (accessToken) {
      res.json({ token: accessToken }); // Send the access token back to the frontend
    } else {
      
      res.status(500).send('Token not found');
    }
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.status(500).send('Error exchanging code for token');
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
