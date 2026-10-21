import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import './Browse.css'

const sampleJobs = [
  {
    _id: '1',
    title: 'Frontend Developer Intern',
    company: 'Tech Solutions',
    location: 'Bangalore',
    type: 'Internship',
    salary: '₹15,000/month',
    description: 'Work with React, JavaScript and modern web technologies.'
  },
  {
    _id: '2',
    title: 'MERN Stack Developer',
    company: 'Innovate Labs',
    location: 'Remote',
    type: 'Full-time',
    salary: '₹5–8 LPA',
    description: 'Build web applications using MongoDB, Express, React and Node.js.'
  },
  {
    _id: '3',
    title: 'Software Engineer Intern',
    company: 'CodeCraft',
    location: 'Hyderabad',
    type: 'Internship',
    salary: '₹20,000/month',
    description: 'Solve programming problems and contribute to software projects.'
  },
  {
    _id: '4',
    title: 'Backend Developer',
    company: 'CloudTech',
    location: 'Pune',
    type: 'Full-time',
    salary: '₹6–10 LPA',
    description: 'Develop APIs and server-side applications using Node.js.'
  },
  {
    _id: '5',
    title: 'Python Developer Intern',
    company: 'DataWorks',
    location: 'Delhi',
    type: 'Internship',
    salary: '₹12,000/month',
    description: 'Work on Python applications, databases and backend services.'
  },
  {
    _id: '6',
    title: 'Junior Software Developer',
    company: 'NextGen Systems',
    location: 'Bangalore',
    type: 'Full-time',
    salary: '₹4–6 LPA',
    description: 'Collaborate with developers to build and maintain applications.'
  }
]

const Browse = () => {
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('All')

  const filteredJobs = sampleJobs.filter((job) => {
    const searchText = search.toLowerCase().trim()
    const locationText = location.toLowerCase().trim()

    const matchesSearch =
      job.title.toLowerCase().includes(searchText) ||
      job.company.toLowerCase().includes(searchText)

    const matchesLocation =
      job.location.toLowerCase().includes(locationText)

    const matchesType =
      jobType === 'All' || job.type === jobType

    return matchesSearch && matchesLocation && matchesType
  })

  return (
    <div className="browse-page">
      <Navbar />

      {/* Hero Section */}
      <section className="browse-hero">
        <div className="hero-content">
          <span className="browse-tag">
            YOUR NEXT OPPORTUNITY STARTS HERE
          </span>

          <h1>
            Find a job you'll <span>love.</span>
          </h1>

          <p>
            Explore opportunities, discover companies and take the next step
            in your career.
          </p>
        </div>

        <div className="hero-illustration" aria-hidden="true">
          <div className="illustration-circle">⌕</div>
          <div className="laptop">
            <div className="laptop-screen">
              <div className="briefcase">▰</div>
            </div>
            <div className="laptop-base"></div>
          </div>
          <div className="code-symbol">&lt;/&gt;</div>
          <div className="document-symbol">▤</div>
          <div className="plant">❧</div>
        </div>

        {/* Search Bar */}
        <form
          className="browse-search"
          onSubmit={(e) => {
            e.preventDefault()
            document.getElementById('job-listings')?.scrollIntoView({
              behavior: 'smooth'
            })
          }}
        >
          <div className="search-field">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              placeholder="Job title or company"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Job title or company"
            />
          </div>

          <div className="search-field">
            <span className="search-icon">⌖</span>
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label="Location"
            />
          </div>

          <button type="submit" className="search-button">
            <span>⌕</span> Search Jobs
          </button>
        </form>
      </section>

      {/* Job Listings */}
      <main className="browse-container" id="job-listings">
        <div className="browse-heading-row">
          <div>
            <h2>Explore opportunities</h2>
            <p>Discover jobs that match your interests.</p>
          </div>

          <span className="job-count">
            {filteredJobs.length} jobs found
          </span>
        </div>

        {/* Job Type Filters */}
        <div className="job-filters">
          {['All', 'Internship', 'Full-time'].map((type) => (
            <button
              key={type}
              type="button"
              className={
                jobType === type ? 'filter-btn active' : 'filter-btn'
              }
              onClick={() => setJobType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {filteredJobs.length > 0 ? (
          <div className="browse-grid">
            {filteredJobs.map((job) => (
              <article className="job-card" key={job._id}>
                <div className="job-card-top">
                  <div className="company-icon">
                    {job.company
                      .split(' ')
                      .map((word) => word[0])
                      .join('')
                      .slice(0, 2)}
                  </div>

                  <span
                    className={
                      job.type === 'Internship'
                        ? 'job-type internship'
                        : 'job-type full-time'
                    }
                  >
                    {job.type}
                  </span>
                </div>

                <h3>{job.title}</h3>
                <p className="company-name">{job.company}</p>

                <div className="job-details">
                  <span>
                    <span className="detail-icon">⌖</span>
                    {job.location}
                  </span>
                  <span className="detail-divider">|</span>
                  <span>
                    <span className="detail-icon">₹</span>
                    {job.salary}
                  </span>
                </div>

                <p className="job-description">{job.description}</p>

                <div className="job-card-footer">
                  <Link
                    to="/login"
                    className="view-job-link"
                  >
                    View Details <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-jobs">
            <div className="empty-icon">⌕</div>
            <h3>No matching jobs found</h3>
            <p>Try changing your search or location.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setLocation('')
                setJobType('All')
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default Browse