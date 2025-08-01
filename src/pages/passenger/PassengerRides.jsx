import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { rideService } from "../../services/apiService";

const PassengerRides = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
    fetchRides();
  }, [location.state]);

  useEffect(() => {
    filterRides();
  }, [rides, activeFilter]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const response = await rideService.getRides();
      const allRides = response.rides || [];

      // Filter rides for current passenger
      const passengerRides = allRides.filter(
        (ride) => ride.passengerId === user._id
      );

      // Sort by creation date (newest first)
      const sortedRides = passengerRides.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setRides(sortedRides);
    } catch (error) {
      console.error("Error fetching rides:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRides = () => {
    let filtered = rides;

    if (activeFilter !== "all") {
      filtered = rides.filter((ride) => ride.status === activeFilter);
    }

    setFilteredRides(filtered);
  };

  const handleCancelRide = async (rideId) => {
    if (!window.confirm("Are you sure you want to cancel this ride?")) {
      return;
    }

    try {
      await rideService.cancelRide(rideId);
      // Refresh rides
      fetchRides();
    } catch (error) {
      console.error("Error cancelling ride:", error);
      alert("Failed to cancel ride. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      posted: {
        class: "bg-info",
        text: "Looking for Driver",
        icon: "fa-search",
      },
      confirmed: {
        class: "bg-warning",
        text: "Driver Selected",
        icon: "fa-user-check",
      },
      completed: {
        class: "bg-success",
        text: "Completed",
        icon: "fa-check-circle",
      },
      cancelled: {
        class: "bg-danger",
        text: "Cancelled",
        icon: "fa-times-circle",
      },
    };

    const config = statusConfig[status] || {
      class: "bg-secondary",
      text: status,
      icon: "fa-question",
    };

    return (
      <span
        className={`badge ${config.class} text-white d-inline-flex align-items-center`}
      >
        <i className={`fas ${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getFilterCount = (status) => {
    if (status === "all") return rides.length;
    return rides.filter((ride) => ride.status === status).length;
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading your rides...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-6 fw-bold text-primary">My Rides</h1>
              <p className="lead text-muted">
                Manage your ride requests and bookings
              </p>
            </div>
            <div>
              <Link to="/passenger/request-ride" className="btn btn-primary">
                <i className="fas fa-plus-circle me-2"></i>
                New Ride Request
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div
          className="alert alert-success alert-dismissible fade show"
          role="alert"
        >
          <i className="fas fa-check-circle me-2"></i>
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage("")}
          ></button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="row mb-4">
        <div className="col">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <ul className="nav nav-pills nav-fill">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeFilter === "all" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("all")}
                  >
                    <i className="fas fa-list me-2"></i>
                    All Rides
                    <span className="badge bg-light text-dark ms-2">
                      {getFilterCount("all")}
                    </span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeFilter === "posted" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("posted")}
                  >
                    <i className="fas fa-search me-2"></i>
                    Looking for Driver
                    <span className="badge bg-light text-dark ms-2">
                      {getFilterCount("posted")}
                    </span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeFilter === "confirmed" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("confirmed")}
                  >
                    <i className="fas fa-user-check me-2"></i>
                    Confirmed
                    <span className="badge bg-light text-dark ms-2">
                      {getFilterCount("confirmed")}
                    </span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeFilter === "completed" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("completed")}
                  >
                    <i className="fas fa-check-circle me-2"></i>
                    Completed
                    <span className="badge bg-light text-dark ms-2">
                      {getFilterCount("completed")}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Rides List */}
      {filteredRides.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i
              className="fas fa-car text-muted"
              style={{ fontSize: "4rem" }}
            ></i>
            <h4 className="text-muted mt-3">
              {activeFilter === "all"
                ? "No rides found"
                : `No ${activeFilter} rides`}
            </h4>
            <p className="text-muted mb-4">
              {activeFilter === "all"
                ? "You haven't requested any rides yet."
                : `You don't have any ${activeFilter} rides at the moment.`}
            </p>
            {activeFilter === "all" && (
              <Link to="/passenger/request-ride" className="btn btn-primary">
                <i className="fas fa-plus-circle me-2"></i>
                Request Your First Ride
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredRides.map((ride) => (
            <div key={ride._id} className="col-12">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <div className="d-flex align-items-start mb-3">
                        <div className="me-3">
                          <i className="fas fa-route text-primary fs-4"></i>
                        </div>
                        <div>
                          <h5 className="fw-bold mb-1">
                            <i className="fas fa-map-marker-alt text-success me-2"></i>
                            {ride.pickupLocation}
                          </h5>
                          <p className="text-muted mb-1">
                            <i className="fas fa-arrow-down text-muted me-2"></i>
                            to
                          </p>
                          <h5 className="fw-bold mb-0">
                            <i className="fas fa-map-marker-alt text-danger me-2"></i>
                            {ride.dropoffLocation}
                          </h5>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="mb-2">
                          <i className="fas fa-calendar text-primary me-2"></i>
                          <span className="fw-semibold">
                            {new Date(ride.targetTime).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mb-2">
                          <i className="fas fa-clock text-primary me-2"></i>
                          <span className="fw-semibold">
                            {new Date(ride.targetTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="mb-2">
                          <i className="fas fa-dollar-sign text-warning me-2"></i>
                          <span className="fw-bold fs-5">
                            ${ride.desiredFare}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="text-center">
                        <div className="mb-3">
                          {getStatusBadge(ride.status)}
                        </div>
                        <div className="d-grid gap-2">
                          {ride.status === "posted" && (
                            <>
                              <Link
                                to={`/passenger/ride/${ride._id}/applications`}
                                className="btn btn-primary btn-sm"
                              >
                                <i className="fas fa-users me-2"></i>
                                View Applications
                              </Link>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleCancelRide(ride._id)}
                              >
                                <i className="fas fa-times me-2"></i>
                                Cancel
                              </button>
                            </>
                          )}

                          {ride.status === "confirmed" && (
                            <Link
                              to={`/payment/${ride._id}`}
                              className="btn btn-success btn-sm"
                            >
                              <i className="fas fa-credit-card me-2"></i>
                              Make Payment
                            </Link>
                          )}

                          {ride.status === "completed" && (
                            <button
                              className="btn btn-outline-success btn-sm"
                              disabled
                            >
                              <i className="fas fa-check me-2"></i>
                              Trip Completed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="my-3" />

                  <div className="row text-muted small">
                    <div className="col-md-6">
                      <i className="fas fa-clock me-2"></i>
                      Created: {new Date(ride.createdAt).toLocaleString()}
                    </div>
                    <div className="col-md-6 text-md-end">
                      <i className="fas fa-hashtag me-2"></i>
                      Ride ID: {ride._id.slice(-8)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PassengerRides;
