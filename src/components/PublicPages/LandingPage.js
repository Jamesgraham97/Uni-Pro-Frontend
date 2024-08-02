import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './LandingPage.css';  // Custom CSS for additional styling

const LandingPage = () => (
  <>
    <header className="custom-header text-white text-center py-5">
      <div className="container">
        <h1 className="display-4">Welcome to UniPro</h1>
        <p className="lead">Your ultimate project management tool for students</p>
        <div className="mt-4">
          <Link to="/register" className="btn btn-primary btn-lg m-2">Sign Up</Link>
          <Link to="/login" className="btn btn-outline-light btn-lg m-2">Log In</Link>
        </div>
      </div>
    </header>

    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-4">Why Choose UniPro?</h2>
        <div className="row">
          <div className="col-md-4 text-center">
            <i className="bi bi-check-circle display-4 text-primary"></i>
            <h3 className="mt-3">Easy to Use</h3>
            <p>Manage your projects effortlessly with our user-friendly interface.</p>
          </div>
          <div className="col-md-4 text-center">
            <i className="bi bi-people display-4 text-primary"></i>
            <h3 className="mt-3">Collaborate</h3>
            <p>Work together with your team seamlessly and efficiently.</p>
          </div>
          <div className="col-md-4 text-center">
            <i className="bi bi-bar-chart display-4 text-primary"></i>
            <h3 className="mt-3">Track Progress</h3>
            <p>Stay on top of your project milestones and deadlines.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-light py-5">
      <div className="container">
        <h2 className="text-center mb-4">Features</h2>
        <div className="row">
          <div className="col-md-6">
            <div className="feature-image-wrapper">
              <img src="/src/assets/kanban.jpg" className="img-fluid mb-3" alt="Kanban Boards" />
            </div>
            <h3>Kanban Boards</h3>
            <p>Organize your tasks and projects using interactive Kanban boards.</p>
          </div>
          <div className="col-md-6">
            <div className="feature-image-wrapper">
              <img src="/src/assets/RealTime.jpg" className="img-fluid mb-3" alt="Real-Time Collaboration" />
            </div>
            <h3>Real-Time Collaboration</h3>
            <p>Collaborate in real-time with your team and keep everyone on the same page.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="py-5">
      <div className="container text-center">
        <h2 className="mb-4">Ready to get started?</h2>
        <p className="lead mb-4">Join UniPro today and streamline your project management process.</p>
        <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
      </div>
    </section>

    <footer className="bg-dark text-white text-center py-4">
      <div className="container">
        <p>&copy; 2024 UniPro. All rights reserved.</p>
        <p>
          <Link to="/about" className="text-white mx-2">About Us</Link> | 
          <Link to="/contact" className="text-white mx-2">Contact</Link>
        </p>
      </div>
    </footer>
  </>
);

export default LandingPage;
