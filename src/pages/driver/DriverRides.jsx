import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { rideService } from "../../services/apiService";

const DriverRides = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [completingRideId, setCompletingRideId] = useState(null);

  useEffect(() => {
    fetchDriverRides();
  }, []);

  useEffect(() => {
    filterRides();
  }, [rides, activeFilter]);

  const fetchDriverRides = async () => {
    try {
      setLoading(true);
      const response = await rideService.getRides();
      const allRides = response.rides || [];

      // Get rides where this driver is involved (either confirmed/completed or applied)
      const driverRides = allRides.filter(
        (ride) =>
          ride.driverId === user._id ||
          (ride.applications &&
            ride.applications.some((app) => app.driverId === user._id))
      );

      // Sort by creation date (newest first)
      const sortedRides = driverRides.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setRides(sortedRides);
    } catch (error) {
      console.error("Error fetching driver rides:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRides = () => {
    let filtered = rides;

    if (activeFilter === "confirmed") {
      filtered = rides.filter(
        (ride) => ride.status === "confirmed" && ride.driverId === user._id
      );
    } else if (activeFilter === "completed") {
      filtered = rides.filter(
        (ride) => ride.status === "completed" && ride.driverId === user._id
      );
    } else if (activeFilter === "applied") {
      filtered = rides.filter(
        (ride) =>
          ride.status === "posted" &&
          ride.applications &&
          ride.applications.some((app) => app.driverId === user._id)
      );
    }

    setFilteredRides(filtered);
  };

  const handleCompleteRide = async (rideId) => {
    if (
      !window.confirm("Are you sure you want to mark this ride as completed?")
    ) {
      return;
    }

    setCompletingRideId(rideId);

    try {
      await rideService.completeRide(rideId);
      // Refresh rides
      fetchDriverRides();
      alert("Ride marked as completed successfully!");
    } catch (error) {
      console.error("Error completing ride:", error);
      alert("Failed to complete ride. Please try again.");
    } finally {
      setCompletingRideId(null);
    }
  };

  const getStatusBadge = (ride) => {
    if (ride.driverId === user._id) {
      const statusConfig = {
        confirmed: {
          class: "bg-warning",
          text: "Confirmed - Ready to Start",
          icon: "fa-user-check",
        },
        completed: {
          class: "bg-success",
          text: "Completed",
          icon: "fa-check-circle",
        },
      };

      const config = statusConfig[ride.status] || {
        class: "bg-secondary",
        text: ride.status,
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
    } else {
      // Driver has applied but not selected
      return (
        <span className="badge bg-info text-white d-inline-flex align-items-center">
          <i className="fas fa-clock me-1"></i>
          Application Pending
        </span>
      );
    }
  };

  const getFilterCount = (status) => {
    if (status === "all") return rides.length;
    if (status === "confirmed")
      return rides.filter(
        (ride) => ride.status === "confirmed" && ride.driverId === user._id
      ).length;
    if (status === "completed")
      return rides.filter(
        (ride) => ride.status === "completed" && ride.driverId === user._id
      ).length;
    if (status === "applied")
      return rides.filter(
        (ride) =>
          ride.status === "posted" &&
          ride.applications &&
          ride.applications.some((app) => app.driverId === user._id)
      ).length;
    return 0;
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
          <h1 className="display-6 fw-bold text-success">My Rides</h1>
          <p className="lead text-muted">
            Manage your confirmed rides and track your applications
          </p>
        </div>
      </div>

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
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeFilter === "applied" ? "active" : ""
                    }`}
                    onClick={() => setActiveFilter("applied")}
                  >
                    <i className="fas fa-clock me-2"></i>
                    Applications
                    <span className="badge bg-light text-dark ms-2">
                      {getFilterCount("applied")}
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
                ? "You haven't applied for any rides yet."
                : `You don't have any ${activeFilter} rides at the moment.`}
            </p>
            {(activeFilter === "all" || activeFilter === "applied") && (
              <a href="/driver/available-rides" className="btn btn-success">
                <i className="fas fa-search me-2"></i>
                Browse Available Rides
              </a>
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
                          <i className="fas fa-route text-success fs-4"></i>
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

                    <div className="col-md-3 text-center">
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
                      <div className="text-success fw-bold fs-4">
                        <i className="fas fa-dollar-sign me-1"></i>
                        {ride.desiredFare}
                      </div>
                    </div>

                    <div className="col-md-3 text-center">
                      <div className="mb-3">{getStatusBadge(ride)}</div>

                      <div className="d-grid">
                        {ride.status === "confirmed" &&
                          ride.driverId === user._id && (
                            <button
                              className="btn btn-success btn-lg"
                              onClick={() => handleCompleteRide(ride._id)}
                              disabled={completingRideId === ride._id}
                            >
                              {completingRideId === ride._id ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                  ></span>
                                  Completing...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-check me-2"></i>
                                  Complete Ride
                                </>
                              )}
                            </button>
                          )}

                        {ride.status === "completed" &&
                          ride.driverId === user._id && (
                            <button
                              className="btn btn-outline-success btn-lg"
                              disabled
                            >
                              <i className="fas fa-check-circle me-2"></i>
                              Ride Completed
                            </button>
                          )}

                        {ride.status === "posted" && (
                          <button
                            className="btn btn-outline-info btn-lg"
                            disabled
                          >
                            <i className="fas fa-clock me-2"></i>
                            Awaiting Selection
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr className="my-3" />

                  <div className="row text-muted small">
                    <div className="col-md-6">
                      <i className="fas fa-clock me-2"></i>
                      {ride.driverId === user._id
                        ? "Confirmed"
                        : "Applied"}:{" "}
                      {new Date(ride.createdAt).toLocaleString()}
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

      {/* Earnings Summary for Completed Rides */}
      {activeFilter === "completed" && filteredRides.length > 0 && (
        <div className="card border-0 shadow-sm mt-4">
          <div className="card-body">
            <h5 className="card-title text-success">
              <i className="fas fa-chart-line me-2"></i>
              Earnings Summary
            </h5>
            <div className="row g-3">
              <div className="col-md-4 text-center">
                <div className="mb-2">
                  <i className="fas fa-check-circle text-success fs-3"></i>
                </div>
                <h4 className="fw-bold text-success">{filteredRides.length}</h4>
                <small className="text-muted">Completed Rides</small>
              </div>
              <div className="col-md-4 text-center">
                <div className="mb-2">
                  <i className="fas fa-dollar-sign text-warning fs-3"></i>
                </div>
                <h4 className="fw-bold text-warning">
                  $
                  {filteredRides.reduce(
                    (total, ride) => total + ride.desiredFare,
                    0
                  )}
                </h4>
                <small className="text-muted">Total Earnings</small>
              </div>
              <div className="col-md-4 text-center">
                <div className="mb-2">
                  <i className="fas fa-calculator text-info fs-3"></i>
                </div>
                <h4 className="fw-bold text-info">
                  $
                  {filteredRides.length > 0
                    ? (
                        filteredRides.reduce(
                          (total, ride) => total + ride.desiredFare,
                          0
                        ) / filteredRides.length
                      ).toFixed(2)
                    : "0.00"}
                </h4>
                <small className="text-muted">Average per Ride</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverRides;
