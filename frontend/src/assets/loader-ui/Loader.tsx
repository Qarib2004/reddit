import React from 'react';
import './loader.css';

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <div className="wave-background">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <div className="reddit-logo">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Reddit_Logo_Icon.svg/220px-Reddit_Logo_Icon.svg.png"
          alt="Reddit Logo"
          className="logo-image"
        />
      </div>
    </div>
  );
};

export default Loader;