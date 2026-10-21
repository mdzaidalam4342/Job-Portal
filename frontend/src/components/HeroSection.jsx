
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const searchJobHandler = (event) => {
    event.preventDefault();
    const searchQuery = query.trim();

    navigate(
      searchQuery
        ? "/jobs?search=" + encodeURIComponent(searchQuery)
        : "/jobs"
    );
  };

  const popularSearches = [
    "Frontend Developer",
    "Data Analyst",
    "UI/UX Designer",
  ];

  return (
    <section className="hero-section">
      <div className="hero-background-shape hero-shape-one" />
      <div className="hero-background-shape hero-shape-two" />

      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">
            <span className="hero-badge-dot" />
            Find Your Next Opportunity
          </span>

          <h1>
            Find work that
            <br />
            <span>moves you forward.</span>
          </h1>

          <p className="hero-description">
            Discover opportunities that match your skills, grow your
            potential, and take the next step in your career.
          </p>

          <form className="search-box" onSubmit={searchJobHandler}>
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="text"
              placeholder="Job title, skill, or keyword"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Search jobs"
            />
            <button type="submit">Search jobs <span>→</span></button>
          </form>

          <div className="popular-searches">
            <span>Popular:</span>
            {popularSearches.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => {
                  setQuery(item);
                  navigate("/jobs?search=" + encodeURIComponent(item));
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="hero-trust">
            <span className="hero-trust-icon">✓</span>
            <span>Explore opportunities and build your future</span>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-visual-glow" />
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />

          <div className="hero-main-card">
            <div className="hero-card-top">
              <div className="hero-card-symbol">J</div>
              <div>
                <span className="hero-card-eyebrow">YOUR NEXT CHAPTER</span>
                <h2>Career opportunities</h2>
              </div>
            </div>

            <div className="hero-card-divider" />

            {[
              ["SD", "Software Developer", "Technology · Full time", "hero-icon-blue"],
              ["UX", "UI/UX Designer", "Design · Full time", "hero-icon-purple"],
              ["DA", "Data Analyst", "Analytics · Full time", "hero-icon-green"],
            ].map(([icon, title, detail, style]) => (
              <div className="hero-opportunity" key={title}>
                <div className={`hero-opportunity-icon ${style}`}>{icon}</div>
                <div className="hero-opportunity-info">
                  <strong>{title}</strong>
                  <span>{detail}</span>
                </div>
                <span className="hero-opportunity-arrow">↗</span>
              </div>
            ))}

            <div className="hero-card-bottom">
              <span className="hero-card-bottom-dot" />
              Your next opportunity starts here
            </div>
          </div>

          <div className="hero-floating-card">
            <span className="hero-floating-icon">✦</span>
            <div>
              <strong>Find your fit</strong>
              <span>Make your next move</span>
            </div>
          </div>

          <div className="hero-floating-bubble">↗</div>
        </div>
      </div>

      <div className="hero-bottom-line" />
    </section>
  );
};

export default HeroSection;
