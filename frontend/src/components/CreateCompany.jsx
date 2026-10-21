import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './CreateCompany.css'

const CreateCompany = () => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        companyName: '',
        description: '',
        website: '',
        location: ''
    })

    const [loading, setLoading] = useState(false)

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

            const response = await axios.post(
                'http://localhost:8000/api/v1/company/register',
                formData,
                {
                    withCredentials: true
                }
            )

            console.log('COMPANY RESPONSE:', response.data)

            alert(response.data.message)

            navigate('/recruiter-dashboard')

        } catch (error) {

            console.log('CREATE COMPANY ERROR:', error)
            console.log('SERVER RESPONSE:', error.response?.data)

            alert(
                error.response?.data?.message ||
                'Company creation failed'
            )

        } finally {

            setLoading(false)

        }
    }

    return (
        <div className="create-company">

            <div className="company-box">

                <h1>Create Company</h1>

                <p>Add your company details</p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="companyName"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Company Description"
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <input
                        type="url"
                        name="website"
                        placeholder="Company Website"
                        value={formData.website}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        name="location"
                        placeholder="Company Location"
                        value={formData.location}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? 'Creating...'
                            : 'Create Company'}
                    </button>

                </form>

            </div>

        </div>
    )
}

export default CreateCompany