import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'
import './AppliedJobs.css'

const AppliedJobs = () => {
    const navigate = useNavigate()

    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [refreshing, setRefreshing] = useState(false)

    const fetchApplications = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true)
            } else {
                setLoading(true)
            }

            setError('')

            const response = await axios.get(
                'http://localhost:8000/api/v1/application/get',
                { withCredentials: true }
            )

            if (response.data.success) {
                setApplications(response.data.application || [])
            } else {
                setError(
                    response.data.message ||
                    'Could not load your applications.'
                )
            }
        } catch (err) {
            console.error('FETCH APPLICATIONS ERROR:', err)

            setError(
                err.response?.data?.message ||
                'Could not load your applications.'
            )
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        const savedUser = localStorage.getItem('user')

        if (!savedUser) {
            navigate('/login')
            return
        }

        try {
            const user = JSON.parse(savedUser)

            if (user.role !== 'student') {
                navigate('/')
                return
            }
        } catch {
            navigate('/login')
            return
        }

        fetchApplications()
    }, [navigate])

    const getStatusClass = (status) => {
        return (status || 'pending').toLowerCase()
    }

    const openApplicationDetails = (application) => {
        navigate(`/application-details/${application._id}`)
    }

    return (
        <>
            <Navbar />

            <div className="applied-jobs-container">
                <div className="applied-jobs-header">
                    <div>
                        <h1>My Applied Jobs</h1>
                        <p>Track all your job applications and their status.</p>
                    </div>

                    <button
                        className="refresh-status-button"
                        onClick={() => fetchApplications(true)}
                        disabled={loading || refreshing}
                    >
                        {refreshing ? 'Refreshing...' : 'Refresh Status'}
                    </button>
                </div>

                {loading && <p>Loading applications...</p>}

                {!loading && error && (
                    <div className="applications-error">
                        <p>{error}</p>
                        <button onClick={() => fetchApplications(true)}>
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && applications.length === 0 && (
                    <div className="no-applications">
                        <h3>No applications yet</h3>
                        <p>Browse jobs and apply to get started.</p>

                        <button onClick={() => navigate('/jobs')}>
                            Browse Jobs
                        </button>
                    </div>
                )}

                {!loading && !error && applications.length > 0 && (
                    <div className="applied-jobs-list">
                        {applications.map((application) => {
                            const job = application.job

                            if (!job) return null

                            const company = job.company
                            const status = getStatusClass(application.status)

                            return (
                                <div
                                    className="applied-job-card clickable-card"
                                    key={application._id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() =>
                                        openApplicationDetails(application)
                                    }
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === 'Enter' ||
                                            event.key === ' '
                                        ) {
                                            event.preventDefault()
                                            openApplicationDetails(application)
                                        }
                                    }}
                                >
                                    <div className="applied-job-info">
                                        <h3>{job.title}</h3>

                                        <p>
                                            Company:{' '}
                                            {company?.name || 'Not available'}
                                        </p>

                                        <p>
                                            Applied on:{' '}
                                            {application.createdAt
                                                ? new Date(
                                                    application.createdAt
                                                ).toLocaleDateString()
                                                : 'Not available'}
                                        </p>

                                        <span className="view-details-text">
                                            Click to view full details →
                                        </span>
                                    </div>

                                    <div className="application-status">
                                        <span>Status</span>

                                        <strong
                                            className={`status-badge ${status}`}
                                        >
                                            {status.toUpperCase()}
                                        </strong>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </>
    )
}

export default AppliedJobs