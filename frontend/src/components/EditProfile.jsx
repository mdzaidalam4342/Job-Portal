import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './EditProfile.css'

const EditProfile = () => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        bio: '',
        skills: '',
        education: '',
        experience: '',
        github: '',
        linkedin: ''
    })

    const [resume, setResume] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        const savedUser = localStorage.getItem('user')

        if (!savedUser) {
            navigate('/login')
            return
        }

        const user = JSON.parse(savedUser)

        setFormData({
            fullname: user.fullname || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            bio: user.profile?.bio || '',
            skills: user.profile?.skills?.join(', ') || '',
            education: user.profile?.education?.join(', ') || '',
            experience: user.profile?.experience?.join(', ') || '',
            github: user.profile?.github || '',
            linkedin: user.profile?.linkedin || ''
        })

    }, [navigate])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            setLoading(true)

            const data = new FormData()

            data.append('fullname', formData.fullname)
            data.append('email', formData.email)
            data.append('phoneNumber', formData.phoneNumber)
            data.append('bio', formData.bio)
            data.append('skills', formData.skills)
            data.append('education', formData.education)
            data.append('experience', formData.experience)
            data.append('github', formData.github)
            data.append('linkedin', formData.linkedin)

            if (resume) {
                data.append('file', resume)
            }

            const response = await axios.post(
                'http://localhost:8000/api/v1/user/profile/update',
                data,
                {
                    withCredentials: true
                }
            )

            localStorage.setItem(
                'user',
                JSON.stringify(response.data.user)
            )

            alert(response.data.message)

            navigate('/profile')

        } catch (error) {

            console.log('PROFILE UPDATE ERROR:', error)

            alert(
                error.response?.data?.message ||
                'Profile update failed'
            )

        } finally {

            setLoading(false)

        }
    }

    return (
        <div className="edit-profile-page">

            <div className="edit-profile-card">

                <h1>Edit Profile</h1>

                <p>
                    Add your personal and professional details
                </p>

                <form onSubmit={handleSubmit}>

                    <label>Full Name</label>

                    <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />

                    <label>Phone Number</label>

                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        required
                    />

                    <label>Bio</label>

                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Write something about yourself"
                    />

                    <label>Skills</label>

                    <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="C++, DSA, React, Node.js"
                    />

                    <label>Education</label>

                    <textarea
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        placeholder="B.E. Information Science, NMIT"
                    />

                    <label>Work Experience</label>

                    <textarea
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Software Developer Intern"
                    />

                    <label>GitHub</label>

                    <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        placeholder="https://github.com/username"
                    />

                    <label>LinkedIn</label>

                    <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/username"
                    />

                    <label>Resume</label>

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                            setResume(e.target.files[0])
                        }
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? 'Saving...'
                            : 'Save Profile'}
                    </button>

                </form>

            </div>

        </div>
    )
}

export default EditProfile