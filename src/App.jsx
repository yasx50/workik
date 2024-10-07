import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code'); // Get the authorization code from URL

    if (code) {
      // Send the authorization code to the backend to exchange for an access token
      fetchAccessToken(code);
    }
  }, []);

  const fetchAccessToken = async (code) => {
    try {
      const response = await axios.post('http://localhost:4000/callback', { code });
      const accessToken = response.data.token;
      
      setToken(accessToken); // Store the token in state
      console.log('Access Token:', accessToken);
    } catch (error) {
      console.error('Error fetching access token:', error.response?.data || error.message);
    }
  };

  const fetchGithubData = async () => {
    if (token) {
      try {
        const response = await axios.get('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${token}`, // Use Bearer token for authorization
          },
        });
        setUserData(response.data);
        console.log('GitHub User Data:', response.data);
      } catch (error) {
        console.error('Error fetching GitHub data:', error.response?.data || error.message);
      }
    } else {
      console.warn('No token available to fetch GitHub data');
    }
  };

  const connectToGithub = () => {
    // Redirect to your backend to start GitHub OAuth process
    window.location.href = 'http://localhost:4000/github-login';
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Connect to GitHub</h1>
        <button
          onClick={connectToGithub}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Connect GitHub
        </button>

        {token && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">You are connected!</h2>
            <button
              onClick={fetchGithubData}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              Get GitHub User Info
            </button>
          </div>
        )}

        {userData && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">GitHub User Info:</h2>
            <p>Username: {userData.login}</p>
            <p>Name: {userData.name}</p>
            <img src={userData.avatar_url} alt="Avatar" width="100" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
