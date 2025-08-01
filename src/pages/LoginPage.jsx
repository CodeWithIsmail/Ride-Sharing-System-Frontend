// src/pages/LoginPage.js
import React from 'react';

const LoginPage = () => (
  <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
    <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
      <h3 className="text-center mb-4 text-primary">Login</h3>
      <form>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" placeholder="you@example.com" />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" placeholder="••••••" />
        </div>
        <button className="btn btn-primary w-100">Login</button>
      </form>
      <div className="text-center mt-3">
        <a href="/register">Don’t have an account? Sign up</a>
      </div>
    </div>
  </div>
);

export default LoginPage;
