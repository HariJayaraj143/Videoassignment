import React, {useState} from 'react'
import axios from 'axios'
import './VideoUpload.css' // Optional: Add custom styles

const VideoUpload = () => {
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Handle file selection
  const handleFileChange = e => {
    setFile(e.target.files[0])
  }

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault()
    if (!file || !title || !description) {
      setError('All fields are required.')
      return
    }
    setError('')
    setSuccess('')
    setProgress(0)

    const formData = new FormData()
    formData.append('video', file)
    formData.append('title', title)
    formData.append('description', description)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post('/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: progressEvent => {
          const percent = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100,
          )
          setProgress(percent)
        },
      })
      setSuccess('Video uploaded successfully!')
      setTitle('')
      setDescription('')
      setFile(null)
      setProgress(0)
    } catch (err) {
      setError('Failed to upload video. Please try again.')
    }
  }

  return (
    <div className="upload-container">
      <h2>Upload Video</h2>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="Enter video title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            placeholder="Enter video description"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="file">Select Video File</label>
          <input
            type="file"
            id="file"
            accept="video/*"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="upload-button">
          Upload Video
        </button>
      </form>

      {progress > 0 && (
        <div className="progress-container">
          <div className="progress-bar" style={{width: `${progress}%`}}></div>
        </div>
      )}
    </div>
  )
}

export default VideoUpload
