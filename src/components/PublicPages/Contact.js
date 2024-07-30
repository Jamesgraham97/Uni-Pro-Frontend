import React from 'react';
import './Contact.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

const Contact = () => (
  <div className="container mt-4 contact-container">
    <h1 className="contact-header">Contact Us</h1>
    <p className="contact-paragraph">If you have any questions, feel free to reach out to us!</p>
    <form>
      <div className="form-group contact-form-group">
        <label htmlFor="name" className="contact-form-label">Name</label>
        <input type="text" className="form-control contact-form-control" id="name" placeholder="Enter your name" />
      </div>
      <div className="form-group contact-form-group">
        <label htmlFor="email" className="contact-form-label">Email address</label>
        <input type="email" className="form-control contact-form-control" id="email" placeholder="Enter your email" />
      </div>
      <div className="form-group contact-form-group">
        <label htmlFor="message" className="contact-form-label">Message</label>
        <textarea className="form-control contact-form-control" id="message" rows="5" placeholder="Enter your message"></textarea>
      </div>
      <div className="text-center">
        <button type="submit" className="btn contact-btn-primary">Submit</button>
      </div>
    </form>
  </div>
);

export default Contact;
