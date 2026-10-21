import { useNavigate } from 'react-router-dom'
import './job.css'

const Job = ({ job }) => {

    const navigate = useNavigate()

    const daysAgoFunction = (mongodbTime) => {

        const createdAt = new Date(mongodbTime)

        const currentTime = new Date()

        const timeDifference =
            currentTime - createdAt

        return Math.floor(
            timeDifference /
            (1000 * 24 * 60 * 60)
        )

    }

    return (

        <div className="job-card">

            <div className="job-top">

                <p className="days-ago">

                    {daysAgoFunction(
                        job?.createdAt
                    ) === 0

                        ? 'Today'

                        : `${daysAgoFunction(
                            job?.createdAt
                        )} days ago`

                    }

                </p>

                <button
                    className="bookmark-btn"
                >
                    🔖
                </button>

            </div>


            <div className="company-info">

                <div className="company-logo">

                    {job?.company?.logo ? (

                        <img
                            src={job.company.logo}
                            alt="Company"
                        />

                    ) : (

                        job?.company?.name
                            ?.charAt(0)
                            ?.toUpperCase() || 'C'

                    )}

                </div>


                <div>

                    <h3>
                        {job?.company?.name ||
                            'Company Name'}
                    </h3>

                    <p>
                        {job?.location ||
                            'India'}
                    </p>

                </div>

            </div>


            <div className="job-info">

                <h2>
                    {job?.title ||
                        'Job Title'}
                </h2>

                <p>
                    {job?.description ||
                        'Job description will appear here.'}
                </p>

            </div>


            <div className="job-tags">

                <span className="position">

                    {job?.position || 0}
                    {' '}
                    Positions

                </span>


                <span className="job-type">

                    {job?.jobType ||
                        'Full Time'}

                </span>


                <span className="salary">

                    {job?.salary || 0}
                    {' '}
                    LPA

                </span>

            </div>


            <div className="job-actions">

                <button
                    className="details-btn"
                    onClick={() =>
                        navigate(
                            `/description/${job?._id}`
                        )
                    }
                >
                    Details
                </button>


                <button
                    className="save-btn"
                >
                    Save For Later
                </button>

            </div>

        </div>

    )

}

export default Job