import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ViewProfile.css'

const ViewProfile = () => {

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

  const profile = user.profile || {}

  return (
    <div className="view-profile-page">

      <div className="view-profile-card">

        <div className="profile-header">

          <img
            src={
              profile.profilePhoto ||
              'https://github.com/shadcn.png'
            }
            alt="Profile"
            className="profile-photo"
          />

          <div>
            <h1>{user.fullname}</h1>
            <p>{user.email}</p>
            <span>{user.role}</span>
          </div>

        </div>

        <div className="profile-section">

          <h2>Personal Information</h2>

          <div className="profile-grid">

            <div>
              <label>Full Name</label>
              <p>{user.fullname || 'Not added'}</p>
            </div>

            <div>
              <label>Email</label>
              <p>{user.email || 'Not added'}</p>
            </div>

            <div>
              <label>Phone Number</label>
              <p>{user.phoneNumber || 'Not added'}</p>
            </div>

            <div>
              <label>Role</label>
              <p>{user.role || 'Not added'}</p>
            </div>

          </div>

        </div>

        <div className="profile-section">

          <h2>About Me</h2>

          <p>
            {profile.bio || 'No bio added yet.'}
          </p>

        </div>

        <div className="profile-section">

          <h2>Skills</h2>

          {profile.skills && profile.skills.length > 0 ? (
            <div className="skills-container">
              {profile.skills.map((skill, index) => (
                <span key={index}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p>No skills added yet.</p>
          )}

        </div>

        <div className="profile-section">

          <h2>Education</h2>

          {profile.education &&
          profile.education.length > 0 ? (

            <ul>
              {profile.education.map((item, index) => (
                <li key={index}>
                  {item}
                </li>
              ))}
            </ul>

          ) : (
            <p>No education details added yet.</p>
          )}

        </div>

        <div className="profile-section">

          <h2>Work Experience</h2>

          {profile.experience &&
          profile.experience.length > 0 ? (

            <ul>
              {profile.experience.map((item, index) => (
                <li key={index}>
                  {item}
                </li>
              ))}
            </ul>

          ) : (
            <p>No work experience added yet.</p>
          )}

        </div>

        <div className="profile-section">

          <h2>Links</h2>

          <div className="profile-links">

            {profile.github ? (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            ) : (
              <p>GitHub not added</p>
            )}

            {profile.linkedin ? (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            ) : (
              <p>LinkedIn not added</p>
            )}

          </div>

        </div>

        <div className="profile-section">

          <h2>Resume</h2>

          {profile.resume ? (

            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="resume-button"
            >
              View Resume
            </a>

          ) : (
            <p>No resume uploaded yet.</p>
          )}

        </div>

        <button
          className="edit-profile-button"
          onClick={() => navigate('/edit-profile')}
        >
          Edit Profile
        </button>

      </div>

    </div>
  )
}

export default ViewProfile