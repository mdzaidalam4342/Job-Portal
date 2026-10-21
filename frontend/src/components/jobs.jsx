import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import Job from './Job'
import './Jobs.css'

const Jobs = () => {

    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const getJobs = async () => {

            try {

                const response = await axios.get(
                    'http://localhost:8000/api/v1/job/get',
                    {
                        withCredentials: true
                    }
                )

                console.log(
                    'JOBS RESPONSE:',
                    response.data
                )

                setJobs(
                    response.data.jobs || []
                )

            } catch (error) {

                console.log(
                    'GET JOBS ERROR:',
                    error
                )

                console.log(
                    'SERVER RESPONSE:',
                    error.response?.data
                )

            } finally {

                setLoading(false)

            }

        }

        getJobs()

    }, [])

    return (

        <>

            <Navbar />

            <div className="student-jobs-page">

                <h1>
                    Available Jobs
                </h1>

                {loading ? (

                    <div className="student-jobs-message">

                        <p>
                            Loading jobs...
                        </p>

                    </div>

                ) : jobs.length === 0 ? (

                    <div className="student-jobs-message">

                        <p>
                            No jobs available.
                        </p>

                    </div>

                ) : (

                    <div className="student-jobs-grid">

                        {jobs.map((job) => (

                            <Job
                                key={job._id}
                                job={job}
                            />

                        ))}

                    </div>

                )}

            </div>

        </>

    )

}

export default Jobs