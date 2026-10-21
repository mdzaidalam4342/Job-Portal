
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'
import './MyJobs.css'

const MyJobs = () => {
    const navigate = useNavigate()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)

    const getJobs = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8000/api/v1/job/getadminjobs',
                { withCredentials: true }
            )

            setJobs(response.data.jobs || [])
        } catch (error) {
            console.log('GET MY JOBS ERROR:', error)
            alert(error.response?.data?.message || 'Could not load jobs')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const savedUser = localStorage.getItem('user')

        if (!savedUser) {
            navigate('/login')
            return
        }

        if (JSON.parse(savedUser).role !== 'recruiter') {
            navigate('/')
            return
        }

        getJobs()
    }, [navigate])

    const deleteJob = async (jobId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this job and its applications?'
        )

        if (!confirmed) return

        try {
            const response = await axios.delete(
                `http://localhost:8000/api/v1/job/delete/${jobId}`,
                { withCredentials: true }
            )

            alert(response.data.message)
            setJobs(currentJobs =>
                currentJobs.filter(job => job._id !== jobId)
            )
        } catch (error) {
            console.log('DELETE JOB ERROR:', error)
            alert(error.response?.data?.message || 'Could not delete job')
        }
    }

    return (
        <>
            <Navbar />

            <div className="my-jobs-page">
                <div className="my-jobs-header">
                    <h1>My Jobs</h1>
                    <button onClick={() => navigate('/post-job')}>
                        + Post a Job
                    </button>
                </div>

                {loading ? (
                    <p className="my-jobs-message">Loading jobs...</p>
                ) : jobs.length === 0 ? (
                    <div className="my-jobs-empty">
                        <h2>No jobs posted yet</h2>
                        <p>Create a job to start receiving applications.</p>
                        <button onClick={() => navigate('/post-job')}>
                            Post Your First Job
                        </button>
                    </div>
                ) : (
                    <div className="my-jobs-list">
                        {jobs.map(job => (
                            <div className="my-job-card" key={job._id}>
                                <div className="my-job-details">
                                    <h2>{job.title}</h2>
                                    <p>{job.company?.name || 'Company'}</p>
                                    <p>{job.location} · {job.jobType}</p>
                                    <p>Salary: {job.salary} LPA</p>
                                    <p>
                                        Applications: {job.applications?.length || 0}
                                    </p>
                                    <p>
                                        Posted: {new Date(job.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="my-job-actions">
                                    <button
                                        onClick={() =>
                                            navigate(`/description/${job._id}`)
                                        }
                                    >
                                        View Job
                                    </button>

                                    <button
                                        onClick={() =>
                                            navigate(`/applications?jobId=${job._id}`)
                                        }
                                    >
                                        View Applicants
                                    </button>

                                    <button
                                        className="delete-job-button"
                                        onClick={() => deleteJob(job._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default MyJobs