
import { useEffect, useState } from "react";
import axios from "axios";
import LatestJobCards from "./LatestJobCards";
import "./LatestJobs.css";

const LatestJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:8000/api/v1/job/get"
        );

        setJobs(response.data.jobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Unable to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestJobs();
  }, []);

  return (
    <section className="latest-jobs-section">
      <div className="latest-jobs-container">
        <div className="latest-jobs-heading">
          <div>
            <span className="latest-jobs-eyebrow">CAREER OPPORTUNITIES</span>
            <h2>Latest <span>Job Openings</span></h2>
            <p>
              Discover exciting opportunities and find the next
              step in your professional journey.
            </p>
          </div>

          <a href="/jobs" className="latest-jobs-view-all">
            Explore all jobs <span>→</span>
          </a>
        </div>

        {loading ? (
          <div className="latest-jobs-grid">
            {[1, 2, 3].map((item) => (
              <div className="job-skeleton" key={item}>
                <div className="skeleton-line skeleton-title" />
                <div className="skeleton-line skeleton-company" />
                <div className="skeleton-line skeleton-description" />
                <div className="skeleton-line skeleton-tags" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="latest-jobs-message">
            <span className="latest-jobs-message-icon">!</span>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button
              type="button"
              className="latest-jobs-retry"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="latest-jobs-message">
            <span className="latest-jobs-message-icon">✦</span>
            <h3>No jobs available yet</h3>
            <p>New opportunities will appear here when available.</p>
          </div>
        ) : (
          <div className="latest-jobs-grid">
            {jobs.slice(0, 6).map((job) => (
              <LatestJobCards key={job._id} job={job} />
            ))}
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="latest-jobs-bottom">
            <span>
              Showing <strong>{Math.min(jobs.length, 6)}</strong> of{" "}
              <strong>{jobs.length}</strong> opportunities
            </span>
            <a href="/jobs" className="latest-jobs-bottom-link">
              Find more jobs <span>→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestJobs;
