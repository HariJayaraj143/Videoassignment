import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import './Login.css' // Optional: Add custom styles

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('') // Clear any previous errors

    try {
      const response = await axios.post('/api/auth/login', {email, password})
      localStorage.setItem('token', response.data.token) // Store the JWT token
      navigate('/dashboard') // Redirect to dashboard after successful login
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Login failed. Please try again.',
      )
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <p>
        Don't have an account? <a href="/register">Sign Up</a>
      </p>
    </div>
  )
}

export default Login
