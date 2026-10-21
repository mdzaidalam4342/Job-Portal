import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Signup.css'

const Signup = () => {

  const [role, setRole] = useState('student')

  const [formData, setFormData] = useState({
    fullname: '',
    phoneNumber: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('Signup form submitted')
    console.log('Full Name:', formData.fullname)
    console.log('Phone Number:', formData.phoneNumber)
    console.log('Email:', formData.email)
    console.log('Password:', formData.password)
    console.log('Role:', role)

    try {

      const response = await axios.post(
        'http://localhost:8000/api/v1/user/register',
        {
          fullname: formData.fullname,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
          role: role
        }
      )

      console.log('SIGNUP RESPONSE:', response.data)

      alert(response.data.message)

    } catch (error) {

      console.log('SIGNUP ERROR:', error)
      console.log('SERVER RESPONSE:', error.response?.data)

      alert(
        error.response?.data?.message ||
        'Signup failed'
      )
    }
  }

  return (
    <div className="signup-container">

      <div className="signup-box">

        <h1>Create Account</h1>

        <p className="signup-subtitle">
          Join JobPortal today
        </p>

        {/* Role Selection */}
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

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />

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
            className="signup-submit"
          >
            Sign Up
          </button>

        </form>

        <p className="login-link">
          Already have an account?

          <Link to="/login">
            {' '}Login
          </Link>
        </p>

      </div>

    </div>
  )
}

export default Signup