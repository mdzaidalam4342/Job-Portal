
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-main">
          <div className="footer-info">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-job">job</span>
              <span className="footer-logo-portal">Portal</span>
            </Link>

            <p className="footer-description">
              Find opportunities, discover your potential, and take
              the next step toward your dream career.
            </p>

            <div className="footer-social-links">
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Explore</h3>
            <Link to="/">Home</Link>
            <Link to="/jobs">Find Jobs</Link>
            <Link to="/browse">Browse Jobs</Link>
          </div>

          <div className="footer-column">
            <h3>For Candidates</h3>
            <Link to="/login">Sign In</Link>
            <Link to="/signup">Create Account</Link>
            <Link to="/applied-jobs">Applied Jobs</Link>
          </div>

          <div className="footer-cta">
            <span className="footer-cta-icon">✦</span>
            <h3>Your next chapter starts here.</h3>
            <p>Discover opportunities that match your skills and ambitions.</p>
            <Link to="/jobs" className="footer-cta-button">
              Explore Jobs <span>→</span>
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} JobPortal. All rights reserved.</p>
          <a href="#top" className="footer-back-top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
