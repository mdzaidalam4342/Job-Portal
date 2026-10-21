import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css'

const Login = () => {

  const [role, setRole] = useState('student')

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log("Login button clicked")
    console.log("Email:", formData.email)
    console.log("Role:", role)

    try {
      setLoading(true)

      const response = await axios.post(
        'http://localhost:8000/api/v1/user/login',
        {
          email: formData.email,
          password: formData.password,
          role: role
        },
        {
          withCredentials: true
        }
      )

      console.log("LOGIN RESPONSE:", response.data)

      const loggedInUser = response.data.user

      localStorage.setItem(
        'user',
        JSON.stringify(loggedInUser)
      )

      alert(response.data.message || 'Login successful')

      if (loggedInUser.role === 'recruiter') {
        navigate('/recruiter-dashboard')
      } else {
        navigate('/')
      }

      window.location.reload()

    } catch (error) {

      console.log("LOGIN ERROR:", error)
      console.log("SERVER RESPONSE:", error.response?.data)

      alert(
        error.response?.data?.message ||
        'Login failed'
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">

      <div className="login-box">

        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Login to your JobPortal account
        </p>

        <div className="role-selection">

          <button
            type="button"
            className={
              role === 'student'
                ? 'role active'
                : 'role'
            }
            onClick={() => setRole('student')}
          >
            Student
          </button>

          <button
            type="button"
            className={
              role === 'recruiter'
                ? 'role active'
                : 'role'
            }
            onClick={() => setRole('recruiter')}
          >
            Recruiter
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <p className="signup-link">
          Don't have an account?

          <Link to="/signup">
            Sign Up
          </Link>
        </p>

      </div>

    </div>
  )
}

export default Login