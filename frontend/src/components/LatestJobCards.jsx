
import { useNavigate } from "react-router-dom";
import "./LatestJobCards.css";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  if (!job) return null;

  const companyName = job.company?.name || "Company Name";
  const companyLogo = job.company?.logo || "";

  const handleJobClick = () => {
    if (job._id) navigate("/description/" + job._id);
  };

  const handleLogoError = (event) => {
    event.currentTarget.style.display = "none";
    const fallback = event.currentTarget.nextElementSibling;
    if (fallback) fallback.style.display = "flex";
  };

  return (
    <article className="latest-job-card">
      <div className="latest-job-card-top">
        <div className="latest-job-company">
          {companyLogo && (
            <img
              src={companyLogo}
              alt={companyName + " logo"}
              className="latest-job-logo"
              onError={handleLogoError}
            />
          )}

          <div
            className="latest-job-logo latest-job-logo-fallback"
            style={{ display: companyLogo ? "none" : "flex" }}
            aria-hidden="true"
          >
            {companyName.charAt(0).toUpperCase()}
          </div>

          <div className="latest-job-company-text">
            <h3>{companyName}</h3>
            <span>Hiring company</span>
          </div>
        </div>

        <span className="latest-job-type">
          {job.jobType || "Full Time"}
        </span>
      </div>

      <div className="latest-job-details">
        <h2>{job.title || "Job Title"}</h2>
        <p className="latest-job-description">
          {job.description || "No description available."}
        </p>
      </div>

      <div className="latest-job-tags">
        <span className="latest-job-tag">
          <span aria-hidden="true">♙</span> {job.position ?? 0} Positions
        </span>
        <span className="latest-job-tag">
          <span aria-hidden="true">₹</span> {job.salary ?? 0} LPA
        </span>
      </div>

      <div className="latest-job-card-bottom">
        <p className="latest-job-location">
          <span aria-hidden="true">⌖</span> {job.location || "India"}
        </p>

        <button type="button" className="latest-job-button" onClick={handleJobClick}>
          View Details <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
};

export default LatestJobCards;
