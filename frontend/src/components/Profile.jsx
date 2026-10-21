import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

const Profile = () => {

  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {

    const savedUser = localStorage.getItem('user')

    if (!savedUser) {
      navigate('/login')
      return
    }

    setUser(JSON.parse(savedUser))

  }, [navigate])

  if (!user) {
    return null
  }

  return (
    <div className="profile-page">

      <div className="profile-card">

        <img
          src={
            user.profile?.profilePhoto ||
            'https://github.com/shadcn.png'
          }
          alt="Profile"
          className="profile-large"
        />

        <h1>{user.fullname}</h1>

        <p>{user.email}</p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>

      </div>

    </div>
  )
}

export default Profile