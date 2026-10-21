
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("user");
    setUser(null);
    setShowMenu(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link
        to={user?.role === "recruiter" ? "/recruiter-dashboard" : "/"}
        className="logo"
      >
        <span className="job">job</span>
        <span className="portal">Portal</span>
      </Link>

      <div className="nav-right">
        <ul className="nav-links">
          {user?.role === "recruiter" ? (
            <>
              <li><Link to="/recruiter-dashboard">Dashboard</Link></li>
              <li><Link to="/my-jobs">My Jobs</Link></li>
              <li><Link to="/applications">Applications</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/jobs">Jobs</Link></li>
              <li><Link to="/browse">Browse</Link></li>
            </>
          )}
        </ul>

        {!user ? (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Get Started</Link>
          </div>
        ) : (
          <div className="profile-container">
            <button
              type="button"
              className="profile-trigger"
              onClick={() => setShowMenu((prev) => !prev)}
              aria-expanded={showMenu}
              aria-label="Toggle profile menu"
            >
              <img
                src={
                  user.profile?.profilePhoto ||
                  "https://github.com/shadcn.png"
                }
                alt=""
                className="profile-img"
              />
              <span className="profile-chevron">⌄</span>
            </button>

            {showMenu && (
              <div className="profile-menu">
                <p className="profile-menu-name">{user.fullname}</p>
                <Link to="/profile" onClick={() => setShowMenu(false)}>
                  View Profile
                </Link>

                {user.role === "student" && (
                  <Link to="/applied-jobs" onClick={() => setShowMenu(false)}>
                    Applied Jobs
                  </Link>
                )}

                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
