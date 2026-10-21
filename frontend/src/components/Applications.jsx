
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'
import './Applications.css'

const Applications = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const jobId = searchParams.get('jobId')

    const [job, setJob] = useState(null)
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState('')
    const [updatingId, setUpdatingId] = useState(null)

    useEffect(() => {
        const savedUser = localStorage.getItem('user')

        if (!savedUser) {
            navigate('/login')
            return
        }

        try {
            const user = JSON.parse(savedUser)

            if (user.role !== 'recruiter') {
                navigate('/')
                return
            }
        } catch {
            navigate('/login')
            return
        }

        if (!jobId) {
            setLoading(false)
            setErrorMessage(
                'Please open My Jobs and click View Applicants.'
            )
            return
        }

        const getApplicants = async () => {
            try {
                setLoading(true)
                setErrorMessage('')

                const response = await axios.get(
                    `http://localhost:8000/api/v1/application/${jobId}/applicants`,
                    { withCredentials: true }
                )

                console.log('APPLICANTS API RESPONSE:', response.data)

                const fetchedJob = response.data.job

                if (!fetchedJob) {
                    setErrorMessage(
                        'Job information was not returned by the server.'
                    )
                    return
                }

                setJob(fetchedJob)
                setApplications(fetchedJob.applications || [])

                console.log(
                    'APPLICANT DETAILS:',
                    (fetchedJob.applications || []).map(
                        application => application.applicant
                    )
                )
            } catch (error) {
                console.error('GET APPLICANTS ERROR:', error)

                setErrorMessage(
                    error.response?.data?.message ||
                    'Could not load applicants. Please try again.'
                )
            } finally {
                setLoading(false)
            }
        }

        getApplicants()
    }, [jobId, navigate])

    const updateStatus = async (applicationId, status) => {
        try {
            setUpdatingId(applicationId)

            const response = await axios.post(
                `http://localhost:8000/api/v1/application/status/${applicationId}/update`,
                { status },
                { withCredentials: true }
            )

            if (
                !response.data.success ||
                !response.data.application
            ) {
                alert(
                    response.data.message ||
                    'Application status update failed.'
                )
                return
            }

            const updatedApplication = response.data.application

            setApplications(current =>
                current.map(application =>
                    application._id === applicationId
                        ? {
                            ...application,
                            status: updatedApplication.status
                        }
                        : application
                )
            )

            alert(
                response.data.message ||
                'Application status updated successfully.'
            )
        } catch (error) {
            console.error('UPDATE STATUS ERROR:', error)

            alert(
                error.response?.data?.message ||
                'Could not update application status.'
            )
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <>
            <Navbar />

            <div className="applications-page">
                <button
                    className="applications-back"
                    onClick={() => navigate('/my-jobs')}
                >
                    ← Back to My Jobs
                </button>

                <h1>Job Applications</h1>

                {loading ? (
                    <p>Loading applicants...</p>
                ) : errorMessage ? (
                    <p>{errorMessage}</p>
                ) : job ? (
                    <>
                        <div className="applications-job-info">
                            <h2>{job.title}</h2>

                            <p>
                                {job.company?.name || 'Company'}
                            </p>

                            <p>
                                Total applicants: {applications.length}
                            </p>
                        </div>

                        {applications.length === 0 ? (
                            <p>
                                No students have applied for this job yet.
                            </p>
                        ) : (
                            <div className="applications-list">
                                {applications.map(application => {
                                    const applicant =
                                        application.applicant || null

                                    const status =
                                        application.status || 'pending'

                                    return (
                                        <div
                                            className="applicant-card"
                                            key={application._id}
                                        >
                                            {applicant ? (
                                                <>
                                                    <h3>
                                                        {applicant.fullname ||
                                                            'Student'}
                                                    </h3>

                                                    <p>
                                                        Email:{' '}
                                                        {applicant.email ||
                                                            'Not provided'}
                                                    </p>

                                                    <p>
                                                        Phone:{' '}
                                                        {applicant.phoneNumber ||
                                                            'Not provided'}
                                                    </p>

                                                    {applicant.profile?.resume && (
                                                        <p>
                                                            <a
                                                                href={applicant.profile.resume}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                            >
                                                                View Resume
                                                            </a>
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <div>
                                                    <h3>
                                                        Applicant details unavailable
                                                    </h3>

                                                    <p>
                                                        The application exists,
                                                        but the student details
                                                        could not be found.
                                                        Check the applicant
                                                        reference in MongoDB.
                                                    </p>
                                                </div>
                                            )}

                                            <p>
                                                Applied:{' '}
                                                {application.createdAt
                                                    ? new Date(
                                                        application.createdAt
                                                    ).toLocaleDateString()
                                                    : 'N/A'}
                                            </p>

                                            <p>
                                                Status: {status.toUpperCase()}
                                            </p>

                                            <div className="applicant-actions">
                                                <button
                                                    onClick={() =>
                                                        updateStatus(
                                                            application._id,
                                                            'accepted'
                                                        )
                                                    }
                                                    disabled={
                                                        !applicant ||
                                                        status === 'accepted' ||
                                                        updatingId === application._id
                                                    }
                                                >
                                                    {updatingId === application._id
                                                        ? 'Updating...'
                                                        : status === 'accepted'
                                                            ? 'Accepted'
                                                            : 'Accept'}
                                                </button>

                                                <button
                                                    className="reject-applicant"
                                                    onClick={() =>
                                                        updateStatus(
                                                            application._id,
                                                            'rejected'
                                                        )
                                                    }
                                                    disabled={
                                                        !applicant ||
                                                        status === 'rejected' ||
                                                        updatingId === application._id
                                                    }
                                                >
                                                    {updatingId === application._id
                                                        ? 'Updating...'
                                                        : status === 'rejected'
                                                            ? 'Rejected'
                                                            : 'Reject'}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                ) : (
                    <p>Job not found.</p>
                )}
            </div>
        </>
    )
}

export default Applications