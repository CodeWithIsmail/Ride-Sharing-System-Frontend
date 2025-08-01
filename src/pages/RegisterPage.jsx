// src/pages/RegisterPage.js
import React from 'react';

const RegisterPage = () => (
  <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
    <div className="card p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
      <h3 className="text-center mb-4 text-success">Create Account</h3>
      <form>
        <div className="mb-3">
          <label>Name</label>
          <input type="text" className="form-control" placeholder="John Doe" />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" placeholder="you@example.com" />
        </div>
        <div className="mb-3">
          <label>Phone (for drivers)</label>
          <input type="text" className="form-control" placeholder="+880..." />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select className="form-select">
            <option value="passenger">Passenger</option>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button className="btn btn-success w-100">Sign Up</button>
      </form>
      <div className="text-center mt-3">
        <a href="/login">Already have an account? Login</a>
      </div>
    </div>
  </div>
);

export default RegisterPage;
