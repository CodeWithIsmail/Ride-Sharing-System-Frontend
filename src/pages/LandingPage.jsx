import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LandingPage.css";

const LandingPage = () => {
  const { isAuthenticated, isPassenger, isDriver, isAdmin } = useAuth();

  const getDashboardLink = () => {
    if (isPassenger) return "/passenger/dashboard";
    if (isDriver) return "/driver/dashboard";
    if (isAdmin) return "/admin/dashboard";
    return "/";
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="display-4 fw-bold text-white mb-4">
                  Your Journey Starts Here
                </h1>
                <p className="lead text-white-50 mb-4">
                  Connect with drivers and passengers in your area. Safe,
                  reliable, and affordable rides at your fingertips.
                </p>

                {isAuthenticated ? (
                  <div className="d-flex flex-wrap gap-3">
                    <Link
                      to={getDashboardLink()}
                      className="btn btn-primary btn-lg"
                    >
                      <i className="fas fa-tachometer-alt me-2"></i>
                      Go to Dashboard
                    </Link>
                    {isPassenger && (
                      <Link
                        to="/passenger/request-ride"
                        className="btn btn-outline-light btn-lg"
                      >
                        <i className="fas fa-plus-circle me-2"></i>
                        Request a Ride
                      </Link>
                    )}
                    {isDriver && (
                      <Link
                        to="/driver/available-rides"
                        className="btn btn-outline-light btn-lg"
                      >
                        <i className="fas fa-search me-2"></i>
                        Find Rides
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="d-flex flex-wrap gap-3">
                    <Link to="/register" className="btn btn-primary btn-lg">
                      <i className="fas fa-user-plus me-2"></i>
                      Get Started
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg">
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="hero-image text-center">
                <div className="feature-card bg-white rounded-4 shadow-lg p-5">
                  <i
                    className="fas fa-car text-primary mb-3"
                    style={{ fontSize: "4rem" }}
                  ></i>
                  <h3 className="h4 text-dark">Ready to ride?</h3>
                  <p className="text-muted">
                    Join thousands of users already using our platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col">
              <h2 className="display-5 fw-bold text-dark">
                Why Choose RideShare?
              </h2>
              <p className="lead text-muted">
                Experience the future of transportation
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card h-100 bg-white rounded-3 shadow-sm p-4 text-center">
                <div
                  className="feature-icon bg-primary bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="fas fa-shield-alt text-white fs-3"></i>
                </div>
                <h4>Safe & Secure</h4>
                <p className="text-muted">
                  All drivers are verified and rides are tracked for your safety
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card h-100 bg-white rounded-3 shadow-sm p-4 text-center">
                <div
                  className="feature-icon bg-success bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="fas fa-dollar-sign text-white fs-3"></i>
                </div>
                <h4>Affordable Prices</h4>
                <p className="text-muted">
                  Set your own fare and find rides that fit your budget
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="feature-card h-100 bg-white rounded-3 shadow-sm p-4 text-center">
                <div
                  className="feature-icon bg-info bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="fas fa-clock text-white fs-3"></i>
                </div>
                <h4>Available 24/7</h4>
                <p className="text-muted">
                  Find rides anytime, anywhere in your city
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col">
              <h2 className="display-5 fw-bold">How It Works</h2>
              <p className="lead text-muted">Simple steps to get you moving</p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <h3 className="h4 text-primary mb-4">
                <i className="fas fa-user-friends me-2"></i>
                For Passengers
              </h3>
              <div className="d-flex mb-3">
                <div className="flex-shrink-0">
                  <div
                    className="step-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    1
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>Post Your Ride Request</h5>
                  <p className="text-muted">
                    Enter pickup, destination, time, and your desired fare
                  </p>
                </div>
              </div>

              <div className="d-flex mb-3">
                <div className="flex-shrink-0">
                  <div
                    className="step-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    2
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>Review Driver Applications</h5>
                  <p className="text-muted">
                    See which drivers are interested in your ride
                  </p>
                </div>
              </div>

              <div className="d-flex mb-3">
                <div className="flex-shrink-0">
                  <div
                    className="step-number bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    3
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>Select & Pay</h5>
                  <p className="text-muted">
                    Choose your driver and pay after the ride
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <h3 className="h4 text-success mb-4">
                <i className="fas fa-car me-2"></i>
                For Drivers
              </h3>
              <div className="d-flex mb-3">
                <div className="flex-shrink-0">
                  <div
                    className="step-number bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    1
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>Browse Available Rides</h5>
                  <p className="text-muted">
                    Find ride requests that match your route
                  </p>
                </div>
              </div>

              <div className="d-flex mb-3">
                <div className="flex-shrink-0">
                  <div
                    className="step-number bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    2
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>Apply for Rides</h5>
                  <p className="text-muted">
                    Submit applications for rides you want to take
                  </p>
                </div>
              </div>

              <div className="d-flex mb-3">
                <div className="flex-shrink-0">
                  <div
                    className="step-number bg-success text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    3
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>Complete & Earn</h5>
                  <p className="text-muted">
                    Complete the ride and receive payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-5 bg-primary text-white">
          <div className="container text-center">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <h2 className="display-5 fw-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="lead mb-4">
                  Join our community of riders and drivers today. Safe,
                  reliable, and convenient transportation awaits!
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <Link to="/register" className="btn btn-light btn-lg">
                    <i className="fas fa-user-plus me-2"></i>
                    Sign Up Now
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg">
                    <i className="fas fa-sign-in-alt me-2"></i>I Have an Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default LandingPage;
