import React from 'react'
import {Link} from 'react-router-dom'
import './Home.css' // Optional: Add custom styles

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Video Management App</h1>
      <p>
        This is a platform where you can upload, view, and manage your videos.
        Get started by logging in or registering an account.
      </p>

      <div className="action-buttons">
        <Link to="/login" className="login-button">
          Login
        </Link>
        <Link to="/register" className="register-button">
          Register
        </Link>
      </div>

      <h3>Featured Videos</h3>
      <div className="featured-videos">
        <div className="video-item">
          <h4>Sample Video 1</h4>
          <p>A description of the first sample video.</p>
          <Link to="/video/1" className="view-button">
            View Video
          </Link>
        </div>
        <div className="video-item">
          <h4>Sample Video 2</h4>
          <p>A description of the second sample video.</p>
          <Link to="/video/2" className="view-button">
            View Video
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
