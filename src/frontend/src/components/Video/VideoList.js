import React, {useEffect, useState} from 'react'
import axios from 'axios'
import './VideoList.css' // Optional: Add custom styles

const VideoList = () => {
  const [videos, setVideos] = useState([])
  const [filteredVideos, setFilteredVideos] = useState([])
  const [filter, setFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [videosPerPage] = useState(5) // Adjust this number for items per page
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get('/api/videos', {
          headers: {Authorization: `Bearer ${token}`},
        })
        setVideos(response.data)
        setFilteredVideos(response.data) // Initially, show all videos
      } catch (err) {
        setError('Failed to fetch videos. Please try again.')
      }
    }

    fetchVideos()
  }, [])

  const handleFilterChange = e => {
    setFilter(e.target.value)
    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(e.target.value.toLowerCase()),
    )
    setFilteredVideos(filtered)
    setCurrentPage(1) // Reset to the first page after filtering
  }

  // Pagination logic
  const indexOfLastVideo = currentPage * videosPerPage
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage
  const currentVideos = filteredVideos.slice(
    indexOfFirstVideo,
    indexOfLastVideo,
  )

  const paginate = pageNumber => setCurrentPage(pageNumber)

  return (
    <div className="video-list-container">
      <h2>My Videos</h2>
      {error && <p className="error-message">{error}</p>}

      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by title"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>

      {currentVideos.length > 0 ? (
        <div className="video-list">
          {currentVideos.map(video => (
            <div className="video-item" key={video._id}>
              <h3>{video.title}</h3>
              <p>{video.description}</p>
              <video controls width="100%" src={video.url} alt={video.title} />
            </div>
          ))}
        </div>
      ) : (
        <p>No videos found.</p>
      )}

      <div className="pagination">
        {Array.from(
          {length: Math.ceil(filteredVideos.length / videosPerPage)},
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ),
        )}
      </div>
    </div>
  )
}

export default VideoList
