import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { rideService } from "../../services/apiService";

const DriverDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    availableRides: 0,
    myApplications: 0,
    confirmedRides: 0,
    completedRides: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all rides
      const response = await rideService.getAvailableRides();
      const allRides = response.rides || [];

      // Calculate stats
      const availableRides = allRides.filter(
        (ride) => ride.status === "posted"
      ).length;

      // Get rides where this driver has applied
      const myApplicationRides = allRides.filter(
        (ride) =>
          ride.applications &&
          ride.applications.some((app) => app.driverId === user._id)
      );

      // Get confirmed rides for this driver
      const confirmedRides = allRides.filter(
        (ride) => ride.status === "confirmed" && ride.driverId === user._id
      ).length;

      // Get completed rides for this driver
      const completedRides = allRides.filter(
        (ride) => ride.status === "completed" && ride.driverId === user._id
      ).length;

      setStats({
        availableRides,
        myApplications: myApplicationRides.length,
        confirmedRides,
        completedRides,
      });

      // Set recent activity (last 5 rides driver is involved with)
      const driverRides = allRides
        .filter(
          (ride) =>
            ride.driverId === user._id ||
            (ride.applications &&
              ride.applications.some((app) => app.driverId === user._id))
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentActivity(driverRides);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status, driverId) => {
    if (status === "posted") {
      return <span className="badge bg-info text-white">Applied</span>;
    }

    const statusConfig = {
      confirmed: { class: "bg-warning", text: "Confirmed" },
      completed: { class: "bg-success", text: "Completed" },
      cancelled: { class: "bg-danger", text: "Cancelled" },
    };

    const config = statusConfig[status] || {
      class: "bg-secondary",
      text: status,
    };

    return (
      <span className={`badge ${config.class} text-white`}>{config.text}</span>
    );
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-6 fw-bold text-success">
                Welcome back, {user?.name}!
              </h1>
              <p className="lead text-muted">
                Find rides and grow your earnings
              </p>
            </div>
            <div>
              <Link
                to="/driver/available-rides"
                className="btn btn-success btn-lg"
              >
                <i className="fas fa-search me-2"></i>
                Find Rides
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-info bg-gradient rounded-circle mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="fas fa-search text-white fs-4"></i>
              </div>
              <h3 className="fw-bold text-info">{stats.availableRides}</h3>
              <p className="text-muted mb-0">Available Rides</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-primary bg-gradient rounded-circle mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="fas fa-paper-plane text-white fs-4"></i>
              </div>
              <h3 className="fw-bold text-primary">{stats.myApplications}</h3>
              <p className="text-muted mb-0">My Applications</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-warning bg-gradient rounded-circle mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="fas fa-user-check text-white fs-4"></i>
              </div>
              <h3 className="fw-bold text-warning">{stats.confirmedRides}</h3>
              <p className="text-muted mb-0">Confirmed Rides</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-success bg-gradient rounded-circle mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="fas fa-check-circle text-white fs-4"></i>
              </div>
              <h3 className="fw-bold text-success">{stats.completedRides}</h3>
              <p className="text-muted mb-0">Completed Rides</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-5">
        <div className="col">
          <h3 className="fw-bold mb-3">Quick Actions</h3>
          <div className="row g-3">
            <div className="col-md-4">
              <Link
                to="/driver/available-rides"
                className="card border-0 shadow-sm h-100 text-decoration-none"
              >
                <div className="card-body text-center p-4">
                  <i className="fas fa-search text-info fs-1 mb-3"></i>
                  <h5 className="fw-bold text-dark">Find Rides</h5>
                  <p className="text-muted mb-0">
                    Browse available ride requests
                  </p>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link
                to="/driver/my-rides"
                className="card border-0 shadow-sm h-100 text-decoration-none"
              >
                <div className="card-body text-center p-4">
                  <i className="fas fa-car text-success fs-1 mb-3"></i>
                  <h5 className="fw-bold text-dark">My Rides</h5>
                  <p className="text-muted mb-0">
                    View your confirmed and completed rides
                  </p>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link
                to="/profile"
                className="card border-0 shadow-sm h-100 text-decoration-none"
              >
                <div className="card-body text-center p-4">
                  <i className="fas fa-user text-primary fs-1 mb-3"></i>
                  <h5 className="fw-bold text-dark">Profile</h5>
                  <p className="text-muted mb-0">Update your driver profile</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold">Recent Activity</h3>
            <Link to="/driver/my-rides" className="btn btn-outline-primary">
              View All <i className="fas fa-arrow-right ms-1"></i>
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="fas fa-car text-muted fs-1 mb-3"></i>
                <h5 className="text-muted">No activity yet</h5>
                <p className="text-muted mb-4">
                  Start by browsing available rides and applying for ones that
                  match your route!
                </p>
                <Link to="/driver/available-rides" className="btn btn-success">
                  <i className="fas fa-search me-2"></i>
                  Browse Available Rides
                </Link>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 px-4 py-3">Route</th>
                        <th className="border-0 px-4 py-3">Date & Time</th>
                        <th className="border-0 px-4 py-3">Fare</th>
                        <th className="border-0 px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivity.map((ride) => (
                        <tr key={ride._id}>
                          <td className="px-4 py-3">
                            <div>
                              <div className="fw-semibold">
                                {ride.pickupLocation}
                              </div>
                              <div className="text-muted small">
                                to {ride.dropoffLocation}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-muted small">
                              {new Date(ride.targetTime).toLocaleDateString()}
                            </div>
                            <div className="text-muted small">
                              {new Date(ride.targetTime).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="fw-semibold">
                              ${ride.desiredFare}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(ride.status, ride.driverId)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Driver Tips */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title text-success">
            <i className="fas fa-lightbulb me-2"></i>
            Driver Tips
          </h5>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="d-flex align-items-start">
                <i className="fas fa-clock text-primary me-3 mt-1"></i>
                <div>
                  <h6 className="fw-semibold">Be Responsive</h6>
                  <small className="text-muted">
                    Apply quickly to increase your chances
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-start">
                <i className="fas fa-route text-success me-3 mt-1"></i>
                <div>
                  <h6 className="fw-semibold">Choose Your Route</h6>
                  <small className="text-muted">
                    Apply for rides along your planned route
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-start">
                <i className="fas fa-star text-warning me-3 mt-1"></i>
                <div>
                  <h6 className="fw-semibold">Provide Great Service</h6>
                  <small className="text-muted">
                    Professional service leads to more opportunities
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
