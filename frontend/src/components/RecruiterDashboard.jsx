
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from './Navbar'
import {
    LayoutDashboard,
    BriefcaseBusiness,
    Users,
    Plus,
    Building2,
    MapPin,
    Globe,
    ArrowUpRight,
    Eye,
    ChevronRight,
    Menu,
    X,
    FileText,
    CircleCheck,
    TrendingUp
} from 'lucide-react'
import './RecruiterDashboard.css'

const RecruiterDashboard = () => {
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [company, setCompany] = useState(null)
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const savedUser = localStorage.getItem('user')

        if (!savedUser) {
            navigate('/login')
            return
        }

        let loggedInUser

        try {
            loggedInUser = JSON.parse(savedUser)
        } catch {
            localStorage.removeItem('user')
            navigate('/login')
            return
        }

        if (loggedInUser.role !== 'recruiter') {
            navigate('/')
            return
        }

        setUser(loggedInUser)

        const getData = async () => {
            try {
                setErrorMessage('')

                const companyResponse = await axios.get(
                    'http://localhost:8000/api/v1/company/get',
                    { withCredentials: true }
                )

                const companies = companyResponse.data.companies || []
                setCompany(companies[0] || null)

                const jobsResponse = await axios.get(
                    'http://localhost:8000/api/v1/job/getadminjobs',
                    { withCredentials: true }
                )

                setJobs(jobsResponse.data.jobs || [])
            } catch (error) {
                console.error('Dashboard error:', error)

                setErrorMessage(
                    error.response?.data?.message ||
                    'Unable to load dashboard data. Please try again.'
                )
            } finally {
                setLoading(false)
            }
        }

        getData()
    }, [navigate])

    if (!user) return null

    // All applications, including pending, accepted and rejected.
    const applicationCount = jobs.reduce(
        (total, job) =>
            total + (job.applications?.length || 0),
        0
    )

    const activeJobs = jobs.filter(
        job =>
            job.status?.toLowerCase() !== 'closed' &&
            job.status?.toLowerCase() !== 'inactive'
    ).length

    // Count accepted or hired applications for the hiring statistic.
    const hiredCount = jobs.reduce(
        (total, job) =>
            total +
            (job.applications || []).filter(application => {
                const status = application.status?.toLowerCase()

                return status === 'accepted' || status === 'hired'
            }).length,
        0
    )

    const recentJobs = [...jobs]
        .sort(
            (a, b) =>
                new Date(b.createdAt || 0) -
                new Date(a.createdAt || 0)
        )
        .slice(0, 5)

    // Count only accepted applications for each job in the chart.
    const getAcceptedCount = job =>
        (job.applications || []).filter(
            application =>
                application.status?.toLowerCase() === 'accepted'
        ).length

    const maxApplications = Math.max(
        1,
        ...recentJobs.map(getAcceptedCount)
    )

    const stats = [
        {
            title: 'Total Jobs Posted',
            value: jobs.length,
            icon: BriefcaseBusiness,
            color: 'orange',
            note: 'Across your job listings'
        },
        {
            title: 'Total Applications',
            value: applicationCount,
            icon: Users,
            color: 'blue',
            note: 'Applications received'
        },
        {
            title: 'Students Hired',
            value: hiredCount,
            icon: CircleCheck,
            color: 'green',
            note: 'Accepted or hired applications'
        },
        {
            title: 'Active Job Listings',
            value: activeJobs,
            icon: FileText,
            color: 'purple',
            note: 'Jobs not marked closed'
        }
    ]

    const menuItems = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            action: () => navigate('/recruiter-dashboard'),
            active: true
        },
        {
            label: 'My Jobs',
            icon: BriefcaseBusiness,
            action: () => navigate('/my-jobs')
        },
        {
            label: 'Applications',
            icon: Users,
            action: () => navigate('/applications')
        },
        {
            label: 'Post Job',
            icon: Plus,
            action: () => navigate('/post-job')
        },
        {
            label: 'Company Profile',
            icon: Building2,
            action: () => navigate('/create-company')
        }
    ]

    return (
        <>
            <Navbar />

            <div className="rd-layout">
                {sidebarOpen && (
                    <button
                        className="rd-sidebar-overlay"
                        aria-label="Close navigation"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <aside
                    className={`rd-sidebar ${
                        sidebarOpen ? 'rd-sidebar-open' : ''
                    }`}
                >
                    <div className="rd-brand">
                        <span className="rd-brand-icon">
                            <BriefcaseBusiness size={22} />
                        </span>

                        <span>
                            job<span>Portal</span>
                        </span>

                        <button
                            className="rd-mobile-close"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close sidebar"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <p className="rd-menu-label">WORKSPACE</p>

                    <nav className="rd-navigation">
                        {menuItems.map(item => {
                            const Icon = item.icon

                            return (
                                <button
                                    key={item.label}
                                    className={`rd-nav-item ${
                                        item.active ? 'rd-nav-active' : ''
                                    }`}
                                    onClick={() => {
                                        item.action()
                                        setSidebarOpen(false)
                                    }}
                                >
                                    <Icon size={19} />
                                    <span>{item.label}</span>

                                    {item.label === 'Applications' &&
                                        applicationCount > 0 && (
                                            <span className="rd-nav-count">
                                                {applicationCount}
                                            </span>
                                        )}
                                </button>
                            )
                        })}
                    </nav>

                    <div className="rd-sidebar-bottom">
                        <div className="rd-help-card">
                            <span className="rd-help-icon">
                                <TrendingUp size={20} />
                            </span>

                            <strong>Build your team</strong>
                            <p>
                                Post a new job to find your next great hire.
                            </p>

                            <button onClick={() => navigate('/post-job')}>
                                Post a job <ArrowUpRight size={15} />
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="rd-main">
                    <header className="rd-topbar">
                        <button
                            className="rd-menu-toggle"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open navigation"
                        >
                            <Menu size={22} />
                        </button>

                        <div className="rd-breadcrumb">
                            Workspace <ChevronRight size={15} />
                            <strong>Dashboard</strong>
                        </div>

                        <div className="rd-user">
                            <div className="rd-avatar">
                                {(user.fullname || 'R')
                                    .charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div>
                                <strong>
                                    {user.fullname || 'Recruiter'}
                                </strong>
                                <span>Recruiter account</span>
                            </div>
                        </div>
                    </header>

                    <div className="rd-content">
                        <section className="rd-page-heading">
                            <div>
                                <span className="rd-eyebrow">OVERVIEW</span>
                                <h1>Recruiter Dashboard</h1>
                                <p>
                                    Welcome back, {user.fullname || 'Recruiter'}!
                                    Here's an overview of your hiring activity.
                                </p>
                            </div>

                            <button
                                className="rd-primary-button"
                                onClick={() => navigate('/post-job')}
                            >
                                <Plus size={18} /> Post a Job
                            </button>
                        </section>

                        {errorMessage && (
                            <div className="rd-error">
                                <p>{errorMessage}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        {loading ? (
                            <div className="rd-loading">
                                <div className="rd-spinner" />
                                <p>Loading your recruiter dashboard...</p>
                            </div>
                        ) : (
                            <>
                                <section className="rd-stats-grid">
                                    {stats.map(stat => {
                                        const Icon = stat.icon

                                        return (
                                            <article
                                                className="rd-stat-card"
                                                key={stat.title}
                                            >
                                                <div className="rd-stat-top">
                                                    <span
                                                        className={`rd-stat-icon ${stat.color}`}
                                                    >
                                                        <Icon size={22} />
                                                    </span>
                                                    <span className="rd-stat-menu">
                                                        •••
                                                    </span>
                                                </div>

                                                <p className="rd-stat-title">
                                                    {stat.title}
                                                </p>
                                                <h2>{stat.value}</h2>

                                                <span className="rd-stat-note">
                                                    {stat.note}
                                                </span>
                                            </article>
                                        )
                                    })}
                                </section>

                                <section className="rd-middle-grid">
                                    <article className="rd-panel rd-company-panel">
                                        <div className="rd-panel-heading">
                                            <div>
                                                <span className="rd-eyebrow">
                                                    YOUR ORGANIZATION
                                                </span>
                                                <h2>Company Profile</h2>
                                            </div>

                                            <Building2
                                                size={21}
                                                className="rd-muted-icon"
                                            />
                                        </div>

                                        {company ? (
                                            <>
                                                <div className="rd-company-info">
                                                    <div className="rd-company-logo">
                                                        {company.logo ? (
                                                            <img
                                                                src={company.logo}
                                                                alt={`${company.name} logo`}
                                                            />
                                                        ) : (
                                                            <Building2 size={30} />
                                                        )}
                                                    </div>

                                                    <div className="rd-company-title">
                                                        <h3>
                                                            {company.name ||
                                                                'Your Company'}
                                                        </h3>

                                                        <span className="rd-status-badge">
                                                            <span />
                                                            Company created
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="rd-company-description">
                                                    <h4>About Company</h4>
                                                    <p>
                                                        {company.description?.trim()
                                                            ? company.description
                                                            : 'No company description added yet. Update your company profile to add one.'}
                                                    </p>
                                                </div>

                                                <div className="rd-company-detail">
                                                    <MapPin size={17} />
                                                    <span>
                                                        {company.location ||
                                                            'Location not provided'}
                                                    </span>
                                                </div>

                                                <div className="rd-company-detail">
                                                    <Globe size={17} />

                                                    {company.website ? (
                                                        <a
                                                            href={
                                                                company.website.startsWith(
                                                                    'http'
                                                                )
                                                                    ? company.website
                                                                    : `https://${company.website}`
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            {company.website}
                                                        </a>
                                                    ) : (
                                                        <span>
                                                            Website not provided
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    className="rd-secondary-button"
                                                    onClick={() =>
                                                        navigate('/create-company')
                                                    }
                                                >
                                                    Manage Company
                                                    <ArrowUpRight size={16} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="rd-empty-company">
                                                <div className="rd-empty-icon">
                                                    <Building2 size={30} />
                                                </div>

                                                <h3>
                                                    Create your company profile
                                                </h3>
                                                <p>
                                                    Set up your organization
                                                    before posting jobs and
                                                    attracting candidates.
                                                </p>

                                                <button
                                                    className="rd-primary-button"
                                                    onClick={() =>
                                                        navigate('/create-company')
                                                    }
                                                >
                                                    <Plus size={17} />
                                                    Create Company
                                                </button>
                                            </div>
                                        )}
                                    </article>

                                    <article className="rd-panel rd-chart-panel">
                                        <div className="rd-panel-heading">
                                            <div>
                                                <span className="rd-eyebrow">
                                                    HIRING ACTIVITY
                                                </span>
                                                <h2>Accepted Applications by Job</h2>
                                            </div>

                                            <span className="rd-chart-label">
                                                Current listings
                                            </span>
                                        </div>

                                        {recentJobs.length > 0 ? (
                                            <div className="rd-chart">
                                                {recentJobs.map(job => {
                                                    const count =
                                                        getAcceptedCount(job)

                                                    const width =
                                                        (count /
                                                            maxApplications) *
                                                        100

                                                    return (
                                                        <div
                                                            className="rd-chart-row"
                                                            key={job._id}
                                                        >
                                                            <div className="rd-chart-label-row">
                                                                <span title={job.title}>
                                                                    {job.title ||
                                                                        'Untitled job'}
                                                                </span>
                                                                <strong>{count}</strong>
                                                            </div>

                                                            <div className="rd-bar-track">
                                                                <div
                                                                    className="rd-bar-fill"
                                                                    style={{
                                                                        width: `${width}%`
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <div className="rd-chart-empty">
                                                <TrendingUp size={32} />
                                                <h3>
                                                    Your hiring activity starts
                                                    here
                                                </h3>
                                                <p>
                                                    Post your first job to see
                                                    applications here.
                                                </p>
                                            </div>
                                        )}

                                        <div className="rd-chart-footer">
                                            <span>
                                                <span className="rd-legend-dot" />
                                                Accepted applications per job
                                            </span>
                                        </div>
                                    </article>
                                </section>

                                <section className="rd-bottom-grid">
                                    <article className="rd-panel rd-jobs-panel">
                                        <div className="rd-panel-heading">
                                            <div>
                                                <span className="rd-eyebrow">
                                                    YOUR OPENINGS
                                                </span>
                                                <h2>Recent Jobs</h2>
                                            </div>

                                            <button
                                                className="rd-text-button"
                                                onClick={() =>
                                                    navigate('/my-jobs')
                                                }
                                            >
                                                View all
                                                <ChevronRight size={17} />
                                            </button>
                                        </div>

                                        {recentJobs.length > 0 ? (
                                            <div className="rd-table-wrapper">
                                                <table className="rd-jobs-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Job title</th>
                                                            <th>Location</th>
                                                            <th>Applicants</th>
                                                            <th>Status</th>
                                                            <th>View</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {recentJobs.map(job => {
                                                            const isClosed =
                                                                job.status?.toLowerCase() ===
                                                                    'closed' ||
                                                                job.status?.toLowerCase() ===
                                                                    'inactive'

                                                            return (
                                                                <tr key={job._id}>
                                                                    <td>
                                                                        <div className="rd-job-name">
                                                                            <span className="rd-job-icon">
                                                                                <BriefcaseBusiness size={18} />
                                                                            </span>

                                                                            <div>
                                                                                <strong>
                                                                                    {job.title ||
                                                                                        'Untitled job'}
                                                                                </strong>
                                                                                <span>
                                                                                    {company?.name ||
                                                                                        'Your company'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </td>

                                                                    <td>
                                                                        <span className="rd-table-location">
                                                                            <MapPin size={14} />
                                                                            {job.location ||
                                                                                'Not specified'}
                                                                        </span>
                                                                    </td>

                                                                    <td>
                                                                        <span className="rd-applicant-number">
                                                                            <Users size={15} />
                                                                            {job.applications?.length ||
                                                                                0}
                                                                        </span>
                                                                    </td>

                                                                    <td>
                                                                        <span
                                                                            className={`rd-job-status ${
                                                                                isClosed
                                                                                    ? 'closed'
                                                                                    : 'active'
                                                                            }`}
                                                                        >
                                                                            <span />
                                                                            {isClosed
                                                                                ? 'Closed'
                                                                                : 'Active'}
                                                                        </span>
                                                                    </td>

                                                                    <td>
                                                                        <button
                                                                            className="rd-view-button"
                                                                            aria-label={`View ${job.title || 'job'}`}
                                                                            onClick={() =>
                                                                                navigate(
                                                                                    `/description/${job._id}`
                                                                                )
                                                                            }
                                                                        >
                                                                            <Eye size={17} />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="rd-empty-jobs">
                                                <BriefcaseBusiness size={34} />
                                                <h3>No jobs posted yet</h3>
                                                <p>
                                                    Your published jobs will
                                                    appear here.
                                                </p>

                                                <button
                                                    className="rd-primary-button"
                                                    onClick={() =>
                                                        navigate('/post-job')
                                                    }
                                                >
                                                    <Plus size={17} />
                                                    Post your first job
                                                </button>
                                            </div>
                                        )}
                                    </article>

                                    <article className="rd-panel rd-actions-panel">
                                        <div className="rd-panel-heading">
                                            <div>
                                                <span className="rd-eyebrow">
                                                    GET THINGS DONE
                                                </span>
                                                <h2>Quick Actions</h2>
                                            </div>
                                        </div>

                                        <div className="rd-quick-actions">
                                            <button
                                                onClick={() =>
                                                    navigate('/create-company')
                                                }
                                            >
                                                <span className="rd-quick-icon orange">
                                                    <Building2 size={19} />
                                                </span>
                                                <span>
                                                    <strong>Manage Company</strong>
                                                    <small>Update company details</small>
                                                </span>
                                                <ChevronRight size={18} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    navigate('/post-job')
                                                }
                                            >
                                                <span className="rd-quick-icon blue">
                                                    <Plus size={20} />
                                                </span>
                                                <span>
                                                    <strong>Post a Job</strong>
                                                    <small>Find your next hire</small>
                                                </span>
                                                <ChevronRight size={18} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    navigate('/my-jobs')
                                                }
                                            >
                                                <span className="rd-quick-icon purple">
                                                    <BriefcaseBusiness size={19} />
                                                </span>
                                                <span>
                                                    <strong>Manage Jobs</strong>
                                                    <small>Edit your job listings</small>
                                                </span>
                                                <ChevronRight size={18} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    navigate('/applications')
                                                }
                                            >
                                                <span className="rd-quick-icon green">
                                                    <Users size={19} />
                                                </span>
                                                <span>
                                                    <strong>Applications</strong>
                                                    <small>Review candidates</small>
                                                </span>
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </article>
                                </section>
                            </>
                        )}

                        <footer className="rd-footer">
                            <span>jobPortal Recruiter Workspace</span>
                            <span>Manage your hiring, all in one place.</span>
                        </footer>
                    </div>
                </main>
            </div>
        </>
    )
}

export default RecruiterDashboard
