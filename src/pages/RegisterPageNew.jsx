import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "passenger",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.role === "driver" && !formData.phone.trim()) {
      newErrors.phone = "Phone number is required for drivers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const userData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === "driver") {
        userData.phone = formData.phone.trim();
      }

      const result = await register(userData);

      if (result.success) {
        navigate("/login", {
          state: {
            message: "Registration successful! Please sign in to continue.",
          },
        });
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      setErrors({ submit: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center bg-success rounded-circle mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="fas fa-user-plus text-white fs-3"></i>
                  </div>
                  <h2 className="fw-bold text-dark">Join RideShare</h2>
                  <p className="text-muted">
                    Create your account to get started
                  </p>
                </div>

                {errors.submit && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {errors.submit}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label fw-semibold">
                        <i className="fas fa-user me-2 text-muted"></i>
                        Full Name
                      </label>
                      <input
                        type="text"
                        className={`form-control form-control-lg ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        disabled={loading}
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        <i className="fas fa-envelope me-2 text-muted"></i>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className={`form-control form-control-lg ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        disabled={loading}
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="role" className="form-label fw-semibold">
                      <i className="fas fa-users me-2 text-muted"></i>I want to
                      join as
                    </label>
                    <select
                      className="form-select form-select-lg"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="passenger">
                        Passenger - Request rides
                      </option>
                      <option value="driver">Driver - Offer rides</option>
                    </select>
                  </div>

                  {formData.role === "driver" && (
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label fw-semibold">
                        <i className="fas fa-phone me-2 text-muted"></i>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className={`form-control form-control-lg ${
                          errors.phone ? "is-invalid" : ""
                        }`}
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        disabled={loading}
                      />
                      {errors.phone && (
                        <div className="invalid-feedback">{errors.phone}</div>
                      )}
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label
                        htmlFor="password"
                        className="form-label fw-semibold"
                      >
                        <i className="fas fa-lock me-2 text-muted"></i>
                        Password
                      </label>
                      <input
                        type="password"
                        className={`form-control form-control-lg ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        disabled={loading}
                      />
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-4">
                      <label
                        htmlFor="confirmPassword"
                        className="form-label fw-semibold"
                      >
                        <i className="fas fa-lock me-2 text-muted"></i>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className={`form-control form-control-lg ${
                          errors.confirmPassword ? "is-invalid" : ""
                        }`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        disabled={loading}
                      />
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success btn-lg w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary text-decoration-none fw-semibold"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
