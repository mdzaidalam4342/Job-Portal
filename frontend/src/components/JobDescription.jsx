
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import './JobDescription.css'

const API = 'http://localhost:8000/api/v1'

const JobDescription = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [applying, setApplying] = useState(false)
    const [isApplied, setIsApplied] = useState(false)

    let user = null

    try {
        const savedUser = localStorage.getItem('user')
        user = savedUser ? JSON.parse(savedUser) : null
    } catch {
        user = null
    }

    const isStudent = user?.role === 'student'

    useEffect(() => {
        let cancelled = false

        const loadJobDetails = async () => {
            setLoading(true)
            setIsApplied(false)

            try {
                const jobResponse = await axios.get(
                    `${API}/job/get/${id}`,
                    { withCredentials: true }
                )

                if (cancelled) return

                setJob(jobResponse.data.job)

                // Check whether the student has already applied.
                if (isStudent) {
                    const applicationsResponse = await axios.get(
                        `${API}/application/get`,
                        { withCredentials: true }
                    )

                    if (cancelled) return

                    const applications =
                        applicationsResponse.data.application || []

                    const alreadyApplied = applications.some(
                        (application) => {
                            const appliedJobId =
                                application.job?._id ||
                                application.job

                            return String(appliedJobId) === String(id)
                        }
                    )

                    setIsApplied(alreadyApplied)
                }
            } catch (error) {
                console.error('LOAD JOB DETAILS ERROR:', error)
                console.error(
                    'SERVER RESPONSE:',
                    error.response?.data
                )
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadJobDetails()

        return () => {
            cancelled = true
        }
    }, [id, isStudent])

    const applyJobHandler = async () => {
        if (!user) {
            alert('Please log in to apply for this job.')
            navigate('/login')
            return
        }

        if (user.role !== 'student') {
            alert('Only students can apply for jobs.')
            return
        }

        if (isApplied || applying) return

        try {
            setApplying(true)

            const response = await axios.get(
                `${API}/application/apply/${id}`,
                { withCredentials: true }
            )

            setIsApplied(true)

            alert(response.data.message || 'Job applied successfully.')
        } catch (error) {
            console.error('APPLY JOB ERROR:', error)

            const message =
                error.response?.data?.message || ''

            if (message.toLowerCase().includes('already applied')) {
                setIsApplied(true)
            }

            alert(message || 'Application failed. Please try again.')
        } finally {
            setApplying(false)
        }
    }

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="job-description-container">
                    <h2>Loading job...</h2>
                </div>
            </>
        )
    }

    if (!job) {
        return (
            <>
                <Navbar />
                <div className="job-description-container">
                    <h2>Job not found</h2>
                    <button
                        className="back-button"
                        onClick={() => navigate('/jobs')}
                    >
                        Back to Jobs
                    </button>
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar />

            <div className="job-description-container">
                <button
                    className="back-button"
                    onClick={() => navigate(isStudent ? '/jobs' : '/my-jobs')}
                >
                    ← Back
                </button>

                <div className="job-description-card">
                    <div className="job-description-header">
                        <div>
                            <p className="description-company">
                                {job.company?.name || 'Company Name'}
                            </p>

                            <h1>{job.title || 'Job Title'}</h1>

                            <p className="description-location">
                                {job.location || 'Location'}
                            </p>
                        </div>

                        {isStudent && (
                            <button
                                className="apply-button"
                                onClick={applyJobHandler}
                                disabled={applying || isApplied}
                            >
                                {applying
                                    ? 'Applying...'
                                    : isApplied
                                        ? 'Applied'
                                        : 'Apply Now'}
                            </button>
                        )}
                    </div>

                    <div className="description-badges">
                        <span>{job.position || 0} Positions</span>
                        <span>{job.jobType || 'Full Time'}</span>
                        <span>{job.salary || 0} LPA</span>
                    </div>

                    <hr />

                    <h2>Job Description</h2>
                    <p className="description-text">
                        {job.description}
                    </p>

                    <div className="job-detail-row">
                        <strong>Role:</strong>
                        <span>{job.title}</span>
                    </div>

                    <div className="job-detail-row">
                        <strong>Location:</strong>
                        <span>{job.location}</span>
                    </div>

                    <div className="job-detail-row">
                        <strong>Experience:</strong>
                        <span>{job.experienceLevel} years</span>
                    </div>

                    <div className="job-detail-row">
                        <strong>Salary:</strong>
                        <span>{job.salary} LPA</span>
                    </div>

                    <div className="job-detail-row">
                        <strong>Posted Date:</strong>
                        <span>
                            {job.createdAt
                                ? new Date(job.createdAt).toLocaleDateString()
                                : 'N/A'}
                        </span>
                    </div>

                    <h2>Requirements</h2>

                    <ul className="requirements-list">
                        {job.requirements?.map((requirement, index) => (
                            <li key={index}>{requirement}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default JobDescription
