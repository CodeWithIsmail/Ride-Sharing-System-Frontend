import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { rideService, userService } from "../../services/apiService";

const RideApplications = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applicantDetails, setApplicantDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    fetchRideAndApplications();
  }, [rideId]);

  const fetchRideAndApplications = async () => {
    try {
      setLoading(true);

      // Fetch ride details and applications
      const [applicationsResponse] = await Promise.all([
        rideService.getRideApplications(rideId),
      ]);

      const apps = applicationsResponse.applications || [];
      setApplications(apps);

      // Fetch applicant details
      const applicantDetailsMap = {};
      for (const app of apps) {
        try {
          const userResponse = await userService.getUserById(app.driverId);
          applicantDetailsMap[app.driverId] = userResponse.user;
        } catch (error) {
          console.error(`Error fetching user ${app.driverId}:`, error);
        }
      }
      setApplicantDetails(applicantDetailsMap);
    } catch (error) {
      console.error("Error fetching ride applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDriver = async (driverId) => {
    if (!window.confirm("Are you sure you want to select this driver?")) {
      return;
    }

    setSelecting(true);

    try {
      await rideService.selectDriver(rideId, driverId);

      // Navigate back to rides with success message
      navigate("/passenger/my-rides", {
        state: {
          message: "Driver selected successfully! Your ride is now confirmed.",
        },
      });
    } catch (error) {
      console.error("Error selecting driver:", error);
      alert("Failed to select driver. Please try again.");
    } finally {
      setSelecting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading applications...</p>
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
          <div className="d-flex align-items-center mb-3">
            <button
              className="btn btn-outline-secondary me-3"
              onClick={() => navigate("/passenger/my-rides")}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h1 className="display-6 fw-bold text-primary mb-1">
                Driver Applications
              </h1>
              <p className="lead text-muted mb-0">
                Choose the best driver for your ride
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ride Details Card */}
      {ride && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <i className="fas fa-route text-primary fs-3"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">
                      <i className="fas fa-map-marker-alt text-success me-2"></i>
                      {ride.pickupLocation}
                    </h5>
                    <div className="text-muted mb-1">
                      <i className="fas fa-arrow-down me-2"></i>
                      to
                    </div>
                    <h5 className="fw-bold mb-0">
                      <i className="fas fa-map-marker-alt text-danger me-2"></i>
                      {ride.dropoffLocation}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-md-end">
                <div className="mb-2">
                  <i className="fas fa-calendar text-primary me-2"></i>
                  {new Date(ride.targetTime).toLocaleDateString()}
                </div>
                <div className="mb-2">
                  <i className="fas fa-clock text-primary me-2"></i>
                  {new Date(ride.targetTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="text-warning fw-bold fs-4">
                  <i className="fas fa-dollar-sign me-1"></i>
                  {ride.desiredFare}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications */}
      {applications.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <i
              className="fas fa-users text-muted"
              style={{ fontSize: "4rem" }}
            ></i>
            <h4 className="text-muted mt-3">No Applications Yet</h4>
            <p className="text-muted mb-4">
              No drivers have applied for this ride yet. Please wait for drivers
              to discover your ride request.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate("/passenger/my-rides")}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to My Rides
              </button>
              <button
                className="btn btn-primary"
                onClick={fetchRideAndApplications}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold">
              <i className="fas fa-users me-2 text-primary"></i>
              {applications.length} Driver{applications.length !== 1 ? "s" : ""}{" "}
              Applied
            </h3>
            <button
              className="btn btn-outline-primary"
              onClick={fetchRideAndApplications}
            >
              <i className="fas fa-sync-alt me-2"></i>
              Refresh
            </button>
          </div>

          <div className="row g-4">
            {applications.map((application) => {
              const driver = applicantDetails[application.driverId];

              return (
                <div key={application._id} className="col-12">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        <div className="col-md-2 text-center">
                          <div
                            className="d-inline-flex align-items-center justify-content-center bg-success bg-gradient rounded-circle mb-2"
                            style={{ width: "80px", height: "80px" }}
                          >
                            <i className="fas fa-user text-white fs-3"></i>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="driver-info">
                            <h4 className="fw-bold text-dark mb-2">
                              {driver?.name || "Loading..."}
                            </h4>

                            {driver && (
                              <>
                                <div className="mb-2">
                                  <i className="fas fa-envelope text-muted me-2"></i>
                                  <span>{driver.email}</span>
                                </div>

                                {driver.phone && (
                                  <div className="mb-2">
                                    <i className="fas fa-phone text-muted me-2"></i>
                                    <span>{driver.phone}</span>
                                  </div>
                                )}

                                <div className="mb-2">
                                  <i className="fas fa-calendar text-muted me-2"></i>
                                  <span className="text-muted">
                                    Member since{" "}
                                    {new Date(
                                      driver.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="col-md-4 text-center">
                          <div className="mb-3">
                            <div className="text-muted small mb-1">Applied</div>
                            <div className="fw-semibold">
                              {new Date(
                                application.appliedAt
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-muted small">
                              {new Date(
                                application.appliedAt
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>

                          <div className="d-grid">
                            <button
                              className="btn btn-success btn-lg"
                              onClick={() =>
                                handleSelectDriver(application.driverId)
                              }
                              disabled={selecting}
                            >
                              {selecting ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                  ></span>
                                  Selecting...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-user-check me-2"></i>
                                  Select This Driver
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <hr className="my-3" />

                      <div className="row text-muted small">
                        <div className="col-md-6">
                          <i className="fas fa-star me-2"></i>
                          Professional driver ready to serve
                        </div>
                        <div className="col-md-6 text-md-end">
                          <i className="fas fa-shield-alt me-2"></i>
                          Verified driver account
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info Section */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <h5 className="card-title text-primary">
                <i className="fas fa-info-circle me-2"></i>
                Selection Tips
              </h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-clock text-primary me-3 mt-1"></i>
                    <div>
                      <h6 className="fw-semibold">Response Time</h6>
                      <small className="text-muted">
                        Consider how quickly they applied
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-user-friends text-success me-3 mt-1"></i>
                    <div>
                      <h6 className="fw-semibold">Communication</h6>
                      <small className="text-muted">
                        Contact them if you have questions
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-handshake text-warning me-3 mt-1"></i>
                    <div>
                      <h6 className="fw-semibold">Trust Your Instinct</h6>
                      <small className="text-muted">
                        Choose who you feel most comfortable with
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RideApplications;
