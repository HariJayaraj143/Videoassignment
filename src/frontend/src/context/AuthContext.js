import React, {createContext, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

// Create a context for authentication
export const AuthContext = createContext()

// Provider component that wraps the app and provides auth state
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null) // Stores the authenticated user's data
  const [loading, setLoading] = useState(true) // Indicates whether the app is loading user info
  const [error, setError] = useState(null) // Stores any errors related to authentication
  const navigate = useNavigate()

  useEffect(() => {
    // Check if a JWT token is stored in localStorage
    const token = localStorage.getItem('token')

    if (token) {
      // If there's a token, attempt to fetch user data
      axios
        .get('/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          setUser(response.data)
          setLoading(false)
        })
        .catch(err => {
          setError('Authentication failed')
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', {email, password})
      const {token} = response.data
      localStorage.setItem('token', token)

      const userResponse = await axios.get('/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setUser(userResponse.data)
      setError(null) // Clear any previous error
      navigate('/dashboard') // Redirect to the dashboard after login
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
