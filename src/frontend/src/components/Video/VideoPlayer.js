import React, {useState, useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'
import './VideoPlayer.css' // Optional: Add custom styles

const VideoPlayer = () => {
  const {videoId} = useParams() // Get the video ID from the URL params
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`/api/videos/${videoId}`, {
          headers: {Authorization: `Bearer ${token}`},
        })
        setVideo(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load the video. Please try again.')
        setLoading(false)
      }
    }

    fetchVideo()
  }, [videoId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="video-player-container">
      <h2>{video.title}</h2>
      <p>{video.description}</p>

      <div className="video-player">
        <video controls width="100%" src={video.url} alt={video.title} />
      </div>

      <div className="actions">
        <button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

export default VideoPlayer
