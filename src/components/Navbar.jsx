// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
    <div className="container">
      <Link className="navbar-brand fw-bold" to="/">🚗 RideShare</Link>
      <div>
        <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
        <Link className="btn btn-warning" to="/register">Sign Up</Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
