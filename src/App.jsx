import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('token');

    if (accessToken) {
      setToken(accessToken);
      // Store the token in localStorage or state if needed
    }
  }, []);

  const connectToGithub = () => {
    // Make the request to your backend to start GitHub OAuth process
    window.location.href = 'http://localhost:4000/github-login';
  };

  const fetchGithubData = async () => {
    if (token) {
      try {
        const response = await axios.get('https://api.github.com/user', {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        console.log(response.data); // Handle the user data
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
      }
    }
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
      </div>
    </div>
  );
}

export default App;
