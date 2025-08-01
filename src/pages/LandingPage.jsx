// src/pages/LandingPage.js
import React from 'react';
import './LandingPage.css';

const LandingPage = () => (
  <div className="landing d-flex align-items-center justify-content-center text-center text-white">
    <div>
      <h1 className="display-3 fw-bold animate__animated animate__fadeInDown">Welcome to RideShare</h1>
      <p className="lead animate__animated animate__fadeInUp">Book rides, earn money, travel smart.</p>
      <a href="/register" className="btn btn-lg btn-light mt-3 shadow">Get Started</a>
    </div>
  </div>
);

export default LandingPage;
