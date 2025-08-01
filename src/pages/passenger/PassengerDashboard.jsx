import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { rideService } from "../../services/apiService";

const PassengerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRides: 0,
    activeRides: 0,
    completedRides: 0,
    cancelledRides: 0,
  });
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all rides for the passenger
      const response = await rideService.getRides();
      const rides = response.rides || [];

      // Filter rides for current passenger
      const passengerRides = rides.filter(
        (ride) => ride.passengerId === user._id
      );

      // Calculate stats
      const totalRides = passengerRides.length;
      const activeRides = passengerRides.filter((ride) =>
        ["posted", "confirmed"].includes(ride.status)
      ).length;
      const completedRides = passengerRides.filter(
        (ride) => ride.status === "completed"
      ).length;
      const cancelledRides = passengerRides.filter(
        (ride) => ride.status === "cancelled"
      ).length;

      setStats({
        totalRides,
        activeRides,
        completedRides,
        cancelledRides,
      });

      // Get recent rides (last 5)
      const sortedRides = passengerRides
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setRecentRides(sortedRides);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      posted: { class: "bg-info", text: "Looking for Driver" },
      confirmed: { class: "bg-warning", text: "Driver Selected" },
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
              <h1 className="display-6 fw-bold text-primary">
                Welcome back, {user?.name}!
              </h1>
              <p className="lead text-muted">
                Manage your rides and travel requests
              </p>
            </div>
            <div>
              <Link
                to="/passenger/request-ride"
                className="btn btn-primary btn-lg"
              >
                <i className="fas fa-plus-circle me-2"></i>
                Request New Ride
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
                className="d-inline-flex align-items-center justify-content-center bg-primary bg-gradient rounded-circle mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="fas fa-list text-white fs-4"></i>
              </div>
              <h3 className="fw-bold text-primary">{stats.totalRides}</h3>
              <p className="text-muted mb-0">Total Rides</p>
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
                <i className="fas fa-clock text-white fs-4"></i>
              </div>
              <h3 className="fw-bold text-warning">{stats.activeRides}</h3>
              <p className="text-muted mb-0">Active Rides</p>
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
              <p className="text-muted mb-0">Completed</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-danger bg-gradient rounded-circle mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="fas fa-times-circle text-white fs-4"></i>
              </div>
              <h3 className="fw-bold text-danger">{stats.cancelledRides}</h3>
              <p className="text-muted mb-0">Cancelled</p>
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
                to="/passenger/request-ride"
                className="card border-0 shadow-sm h-100 text-decoration-none"
              >
                <div className="card-body text-center p-4">
                  <i className="fas fa-plus-circle text-primary fs-1 mb-3"></i>
                  <h5 className="fw-bold text-dark">Request Ride</h5>
                  <p className="text-muted mb-0">
                    Book a new ride to your destination
                  </p>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link
                to="/passenger/my-rides"
                className="card border-0 shadow-sm h-100 text-decoration-none"
              >
                <div className="card-body text-center p-4">
                  <i className="fas fa-list text-success fs-1 mb-3"></i>
                  <h5 className="fw-bold text-dark">My Rides</h5>
                  <p className="text-muted mb-0">View all your ride requests</p>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link
                to="/profile"
                className="card border-0 shadow-sm h-100 text-decoration-none"
              >
                <div className="card-body text-center p-4">
                  <i className="fas fa-user text-info fs-1 mb-3"></i>
                  <h5 className="fw-bold text-dark">Profile</h5>
                  <p className="text-muted mb-0">
                    Update your profile information
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Rides */}
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold">Recent Rides</h3>
            <Link to="/passenger/my-rides" className="btn btn-outline-primary">
              View All <i className="fas fa-arrow-right ms-1"></i>
            </Link>
          </div>

          {recentRides.length === 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="fas fa-car text-muted fs-1 mb-3"></i>
                <h5 className="text-muted">No rides yet</h5>
                <p className="text-muted mb-4">
                  You haven't requested any rides yet. Start by requesting your
                  first ride!
                </p>
                <Link to="/passenger/request-ride" className="btn btn-primary">
                  <i className="fas fa-plus-circle me-2"></i>
                  Request Your First Ride
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
                        <th className="border-0 px-4 py-3">Date</th>
                        <th className="border-0 px-4 py-3">Fare</th>
                        <th className="border-0 px-4 py-3">Status</th>
                        <th className="border-0 px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRides.map((ride) => (
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
                              {new Date(ride.targetTime).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="fw-semibold">
                              ${ride.desiredFare}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(ride.status)}
                          </td>
                          <td className="px-4 py-3">
                            {ride.status === "posted" && (
                              <Link
                                to={`/passenger/ride/${ride._id}/applications`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                View Applications
                              </Link>
                            )}
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
    </div>
  );
};

export default PassengerDashboard;
