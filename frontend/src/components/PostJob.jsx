import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './PostJob.css'

const PostJob = () => {

    const navigate = useNavigate()

    const [company, setCompany] = useState(null)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        experience: '',
        location: '',
        jobType: '',
        position: ''
    })

    const [loading, setLoading] = useState(false)
    const [companyLoading, setCompanyLoading] = useState(true)

    useEffect(() => {

        const getCompany = async () => {

            try {

                const response = await axios.get(
                    'http://localhost:8000/api/v1/company/get',
                    {
                        withCredentials: true
                    }
                )

                console.log(
                    'COMPANY RESPONSE:',
                    response.data
                )

                if (
                    response.data.companies &&
                    response.data.companies.length > 0
                ) {

                    setCompany(
                        response.data.companies[0]
                    )

                }

            } catch (error) {

                console.log(
                    'GET COMPANY ERROR:',
                    error.response?.data
                )

            } finally {

                setCompanyLoading(false)

            }

        }

        getCompany()

    }, [])

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        })

    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (!company) {

            alert(
                'Please create a company first.'
            )

            navigate('/create-company')

            return

        }

        try {

            setLoading(true)

            const response = await axios.post(

                'http://localhost:8000/api/v1/job/post',

                {
                    title: formData.title,

                    description:
                        formData.description,

                    requirements:
                        formData.requirements,

                    salary:
                        formData.salary,

                    experience:
                        formData.experience,

                    location:
                        formData.location,

                    jobType:
                        formData.jobType,

                    position:
                        formData.position,

                    companyId:
                        company._id
                },

                {
                    withCredentials: true
                }

            )

            console.log(
                'POST JOB RESPONSE:',
                response.data
            )

            alert(
                response.data.message
            )

            navigate('/recruiter-dashboard')

        } catch (error) {

            console.log(
                'POST JOB ERROR:',
                error
            )

            console.log(
                'SERVER RESPONSE:',
                error.response?.data
            )

            alert(
                error.response?.data?.message ||
                'Job posting failed'
            )

        } finally {

            setLoading(false)

        }

    }

    if (companyLoading) {

        return (

            <div className="post-job">

                <div className="post-job-box">

                    <h1>
                        Post a Job
                    </h1>

                    <p>
                        Loading company...
                    </p>

                </div>

            </div>

        )

    }

    if (!company) {

        return (

            <div className="post-job">

                <div className="post-job-box">

                    <h1>
                        Post a Job
                    </h1>

                    <p>
                        You need to create a company
                        before posting a job.
                    </p>

                    <button
                        onClick={() =>
                            navigate('/create-company')
                        }
                    >
                        Create Company
                    </button>

                </div>

            </div>

        )

    }

    return (

        <div className="post-job">

            <div className="post-job-box">

                <h1>
                    Post a Job
                </h1>

                <p className="company-name">
                    Company: {company.name}
                </p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="title"
                        placeholder="Job Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Job Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="requirements"
                        placeholder="Requirements separated by commas"
                        value={formData.requirements}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="salary"
                        placeholder="Salary in LPA"
                        value={formData.salary}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="experience"
                        placeholder="Experience in years"
                        value={formData.experience}
                        onChange={handleChange}
                        min="0"
                        required
                    />

                    <input
                        type="text"
                        name="location"
                        placeholder="Job Location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select Job Type
                        </option>

                        <option value="Full Time">
                            Full Time
                        </option>

                        <option value="Part Time">
                            Part Time
                        </option>

                        <option value="Internship">
                            Internship
                        </option>

                    </select>

                    <input
                        type="number"
                        name="position"
                        placeholder="Number of Positions"
                        value={formData.position}
                        onChange={handleChange}
                        min="1"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? 'Posting...'
                            : 'Post Job'}
                    </button>

                </form>

            </div>

        </div>

    )

}

export default PostJob