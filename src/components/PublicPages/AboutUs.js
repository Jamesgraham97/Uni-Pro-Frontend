import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AboutUs.css';  // Custom CSS for additional styling

const AboutUs = () => (
  <div className="about-us-container container mt-4">
    <h1 className="text-center mb-4">About Us</h1>
    <section className="mb-4">
      <h2>Our Mission</h2>
      <p>
        At UniPro, our mission is to simplify project management for students. We believe that managing your academic projects should be intuitive and straightforward, not a cumbersome task that adds to your stress.
      </p>
    </section>
    <section className="mb-4">
      <h2>Why UniPro?</h2>
      <p>
        UniPro was developed as an alternative to complex project management tools like Jira, which can be overwhelming and difficult to learn. Our platform offers an easy-to-use interface that helps students get up and running quickly, so they can focus on what really matters: their projects.
      </p>
    </section>
    <section className="mb-4">
      <h2>Our Vision</h2>
      <p>
        We envision a world where students are well-equipped with the skills needed to thrive in their careers. By using UniPro, students gain hands-on experience with project management tools, preparing them for the professional environment. Our aim is to make the transition from academic to professional life as seamless as possible.
      </p>
    </section>
    <section className="mb-4">
      <h2>Features of UniPro</h2>
      <ul>
        <li>Intuitive and user-friendly interface</li>
        <li>Real-time collaboration with team members</li>
        <li>Task tracking and milestone management</li>
        <li>Interactive Kanban boards for better task visualization</li>
        
      </ul>
    </section>
    <section className="mb-4">
      <h2>Join Us</h2>
      <p>
        Ready to take control of your projects? Join UniPro today and discover how easy and efficient project management can be.
      </p>
      <div className="text-center mt-4">
        <a href="/register" className="btn btn-primary btn-lg mx-2">Sign Up</a>
        <a href="/login" className="btn btn-outline-secondary btn-lg mx-2">Log In</a>
      </div>
    </section>
  </div>
);

export default AboutUs;
