import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import the main App component
import './index.css'; // Import global CSS styles

// Create a root element to render the app into
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component into the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
