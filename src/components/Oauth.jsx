import React from 'react';
import { GitHubLogin } from 'react-oauth';

const Oauth = () => {
  const handleSuccess = (response) => {
    console.log('GitHub OAuth Success:', response);
    // Handle success response and get access token
  };

  const handleError = (error) => {
    console.error('GitHub OAuth Error:', error);
    // Handle error
  };

  return (
    <div className="oauth-container">
      <h2>Login with GitHub</h2>
      <GitHubLogin
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default Oauth;
