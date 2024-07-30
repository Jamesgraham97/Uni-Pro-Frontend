import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthService from '../../services/api';
import './AuthenticatedNavbar.css';
import NotificationButton from './NotificationButton';
import SearchButton from './SearchButton';

const AuthenticatedNavbar = () => {
  const { logout } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = AuthService.getCurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const navbarStyle = {
    backgroundColor: '#4A4A4A',
    color: '#ffffff',
    height: '100vh', // Ensure the navbar takes full height
  };

  return (
    <div style={{ backgroundColor: '#002B5B', height: '100vh' }}>
      <div className="d-flex flex-sm-column flex-row flex-nowrap align-items-center sticky-top" style={navbarStyle}>
        <Link id="uni-pro-brand" className="navbar-brand nav-link" to="/">
          <strong>UNI-PRO</strong>
        </Link>
        <ul className="nav nav-pills nav-flush flex-sm-column flex-row flex-nowrap mb-auto mx-auto text-center justify-content-between w-100 px-3 align-items-center">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link py-3 px-2 link-light" title="dashboard" data-bs-toggle="tooltip" data-bs-placement="right">
              <i className="bi bi-house fs-1"></i>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/modules" className="nav-link py-3 px-2 link-light" title="Modules" data-bs-toggle="tooltip" data-bs-placement="right">
              <i className="bi bi-grid-fill fs-1"></i>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/assignments" className="nav-link py-3 px-2 link-light" title="Assignments" data-bs-toggle="tooltip" data-bs-placement="right">
              <i className="bi bi-card-checklist fs-1"></i>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/kanban" className="nav-link py-3 px-2 link-light" title="Kanban" data-bs-toggle="tooltip" data-bs-placement="right">
              <i className="bi bi-kanban fs-1"></i>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/teams" className="nav-link py-3 px-2 link-light" title="Teams" data-bs-toggle="tooltip" data-bs-placement="right">
              <i className="bi bi-people-fill fs-1"></i>
            </Link>
          </li>
          <NotificationButton />
          <SearchButton />
        </ul>
        <div className="dropdown">
          <button className="d-flex align-items-center justify-content-center p-3 link-light text-decoration-none dropdown-toggle" id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false" style={{ border: 'none', padding: 0, background: 'none' }}>
            {currentUser && currentUser.user.profile_picture_url ? (
              <img
                src={`http://localhost:3000${currentUser.user.profile_picture_url}`}
                alt="Profile"
                className="img-fluid"
                style={{ borderRadius: '50%', width: '40px', height: '40px', objectFit: 'cover' }}
              />
            ) : (
              <i className="bi-person-circle h2"></i>
            )}
          </button>
          <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser3">
            <li><Link className="dropdown-item" to="/settings">Settings</Link></li>
            <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button onClick={handleLogout} className="dropdown-item">Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedNavbar;
