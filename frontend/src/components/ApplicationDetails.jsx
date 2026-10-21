import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'
import './ApplicationDetails.css'

const ApplicationDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [application, setApplication] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

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

        const fetchApplication = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8000/api/v1/application/get',
                    { withCredentials: true }
                )

                const applications = response.data.application || []

                const selectedApplication = applications.find(
                    item => item._id === id
                )

                if (!selectedApplication) {
                    setError('Application not found.')
                    return
                }

                setApplication(selectedApplication)
            } catch (err) {
                console.error('APPLICATION DETAILS ERROR:', err)

                setError(
                    err.response?.data?.message ||
                    'Could not load application details.'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchApplication()
    }, [id, navigate])

    const status = (application?.status || 'pending').toLowerCase()
    const job = application?.job
    const company = job?.company

    return (
        <>
            <Navbar />

            <div className="application-details-container">
                <button
                    className="back-button"
                    onClick={() => navigate('/applied-jobs')}
                >
                    ← Back to Applied Jobs
                </button>

                {loading && <p>Loading application details...</p>}

                {!loading && error && (
                    <p className="details-error">{error}</p>
                )}

                {!loading && application && (
                    <>
                        <div className="application-status-banner">
                            <div>
                                <p>APPLICATION STATUS</p>
                                <h2>{status.toUpperCase()}</h2>
                            </div>

                            <span className={`status-badge ${status}`}>
                                {status.toUpperCase()}
                            </span>
                        </div>

                        <section className="details-section">
                            <h2>Job Details</h2>

                            <h3>{job?.title || 'Job title unavailable'}</h3>

                            <p>
                                <strong>Location:</strong>{' '}
                                {job?.location || 'Not available'}
                            </p>

                            <p>
                                <strong>Salary:</strong>{' '}
                                {job?.salary != null
                                    ? job.salary
                                    : 'Not available'}
                            </p>

                            <p>
                                <strong>Description:</strong>{' '}
                                {job?.description || 'Not available'}
                            </p>

                            {job?.requirements && (
                                <p>
                                    <strong>Requirements:</strong>{' '}
                                    {Array.isArray(job.requirements)
                                        ? job.requirements.join(', ')
                                        : job.requirements}
                                </p>
                            )}

                            <p>
                                <strong>Applied on:</strong>{' '}
                                {application.createdAt
                                    ? new Date(
                                        application.createdAt
                                    ).toLocaleDateString()
                                    : 'Not available'}
                            </p>
                        </section>

                        <section className="details-section">
                            <h2>Company Details</h2>

                            <h3>{company?.name || 'Company name unavailable'}</h3>

                            <p>
                                <strong>Location:</strong>{' '}
                                {company?.location || 'Not available'}
                            </p>

                            <p>
                                <strong>Description:</strong>{' '}
                                {company?.description || 'Not available'}
                            </p>

                            <p>
                                <strong>Website:</strong>{' '}
                                {company?.website ? (
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {company.website}
                                    </a>
                                ) : (
                                    'Not available'
                                )}
                            </p>

                            <p>
                                <strong>Email:</strong>{' '}
                                {company?.email || 'Not available'}
                            </p>

                            <p>
                                <strong>Phone:</strong>{' '}
                                {company?.phoneNumber || 'Not available'}
                            </p>
                        </section>
                    </>
                )}
            </div>
        </>
    )
}

export default ApplicationDetails