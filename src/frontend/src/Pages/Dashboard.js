import React, {useContext, useEffect, useState} from 'react'
import {AuthContext} from './AuthContext'
import axios from 'axios'
import {Link} from 'react-router-dom'
import './Dashboard.css' // Optional: Add custom styles

const Dashboard = () => {
  const {user, logout} = useContext(AuthContext)
  const [videos, setVideos] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    // Fetch the user's uploaded videos after they log in
    if (user) {
      const fetchVideos = async () => {
        try {
          const token = localStorage.getItem('token')
          const response = await axios.get('/api/videos', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          setVideos(response.data)
        } catch (err) {
          setError('Failed to fetch videos. Please try again later.')
        }
      }
      fetchVideos()
    }
  }, [user])

  const handleLogout = () => {
    logout() // Logout the user and redirect them to login page
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user ? user.name : 'User'}!</h2>

      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>

      {error && <p className="error-message">{error}</p>}

      <h3>Your Videos</h3>

      <div className="video-list">
        {videos.length > 0 ? (
          videos.map(video => (
            <div className="video-item" key={video._id}>
              <h4>{video.title}</h4>
              <p>{video.description}</p>
              <Link to={`/video/${video._id}`} className="view-button">
                View Video
              </Link>
              {/* Optionally, you can add a delete button here */}
            </div>
          ))
        ) : (
          <p>No videos uploaded yet.</p>
        )}
      </div>

      <Link to="/upload" className="upload-button">
        Upload New Video
      </Link>
    </div>
  )
}

export default Dashboard
