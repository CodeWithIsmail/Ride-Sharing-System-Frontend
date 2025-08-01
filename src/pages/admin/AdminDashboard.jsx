import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../../services/apiService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    passengers: 0,
    drivers: 0,
    totalRides: 0,
    completedRides: 0,
    activeRides: 0,
    totalRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch users and rides data
      const [usersResponse, ridesResponse] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllRides(),
      ]);

      const users = usersResponse.users || [];
      const rides = ridesResponse.rides || [];

      // Calculate user stats
      const totalUsers = users.length;
      const passengers = users.filter(
        (user) => user.role === "passenger"
      ).length;
      const drivers = users.filter((user) => user.role === "driver").length;

      // Calculate ride stats
      const totalRides = rides.length;
      const completedRides = rides.filter(
        (ride) => ride.status === "completed"
      ).length;
      const activeRides = rides.filter((ride) =>
        ["posted", "confirmed"].includes(ride.status)
      ).length;
      const totalRevenue = rides
        .filter((ride) => ride.status === "completed")
        .reduce((sum, ride) => sum + ride.desiredFare, 0);

      setStats({
        totalUsers,
        passengers,
        drivers,
        totalRides,
        completedRides,
        activeRides,
        totalRevenue,
      });

      // Set recent activity (last 10 rides)
      const sortedRides = rides
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

      setRecentActivity(sortedRides);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      posted: { class: "bg-info", text: "Posted", icon: "fa-search" },
      confirmed: {
        class: "bg-warning",
        text: "Confirmed",
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

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading admin dashboard...</p>
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
          <h1 className="display-6 fw-bold text-primary">Admin Dashboard</h1>
          <p className="lead text-muted">
            Monitor and manage your ride-sharing platform
          </p>
        </div>
      </div>

      {/* Stats Cards Row 1 */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-primary bg-gradient rounded-circle mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="fas fa-users text-white fs-4"></i>
              </div>
              <h3 className="fw-bold text-primary">{stats.totalUsers}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-info bg-gradient rounded-circle mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="fas fa-user-friends text-white fs-4"></i>
              </div>
              <h3 className="fw-bold text-info">{stats.passengers}</h3>
              <p className="text-muted mb-0">Passengers</p>
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
                <i className="fas fa-car text-white fs-4"></i>
              </div>
              <h3 className="fw-bold text-success">{stats.drivers}</h3>
              <p className="text-muted mb-0">Drivers</p>
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
                <i className="fas fa-route text-white fs-4"></i>
              </div>
              <h3 className="fw-bold text-warning">{stats.totalRides}</h3>
              <p className="text-muted mb-0">Total Rides</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Row 2 */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
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

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-info bg-gradient rounded-circle mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="fas fa-clock text-white fs-4"></i>
              </div>
              <h3 className="fw-bold text-info">{stats.activeRides}</h3>
              <p className="text-muted mb-0">Active Rides</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-warning bg-gradient rounded-circle mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="fas fa-dollar-sign text-white fs-4"></i>
              </div>
              <h3 className="fw-bold text-warning">${stats.totalRevenue}</h3>
              <p className="text-muted mb-0">Platform Revenue</p>
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
                to="/admin/users"
                className="card border-0 shadow-sm h-100 text-decoration-none"
              >
                <div className="card-body text-center p-4">
                  <i className="fas fa-users text-primary fs-1 mb-3"></i>
                  <h5 className="fw-bold text-dark">Manage Users</h5>
                  <p className="text-muted mb-0">
                    View and manage user accounts
                  </p>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link
                to="/admin/rides"
                className="card border-0 shadow-sm h-100 text-decoration-none"
              >
                <div className="card-body text-center p-4">
                  <i className="fas fa-route text-success fs-1 mb-3"></i>
                  <h5 className="fw-bold text-dark">Manage Rides</h5>
                  <p className="text-muted mb-0">
                    Monitor ride requests and activity
                  </p>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <i className="fas fa-chart-bar text-info fs-1 mb-3"></i>
                  <h5 className="fw-bold text-dark">Analytics</h5>
                  <p className="text-muted mb-0">
                    View detailed platform analytics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="fw-bold">Recent Ride Activity</h3>
            <div>
              <Link to="/admin/rides" className="btn btn-outline-primary me-2">
                View All Rides <i className="fas fa-arrow-right ms-1"></i>
              </Link>
              <button
                className="btn btn-outline-secondary"
                onClick={fetchDashboardData}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </button>
            </div>
          </div>

          {recentActivity.length === 0 ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <i className="fas fa-chart-bar text-muted fs-1 mb-3"></i>
                <h5 className="text-muted">No recent activity</h5>
                <p className="text-muted mb-0">
                  Ride activity will appear here as users interact with the
                  platform
                </p>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 px-4 py-3">Ride ID</th>
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
                            <span className="font-monospace text-muted">
                              {ride._id.slice(-8)}
                            </span>
                          </td>
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
                            {getStatusBadge(ride.status)}
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

      {/* Platform Health */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title text-primary">
            <i className="fas fa-heartbeat me-2"></i>
            Platform Health
          </h5>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div
                    className="bg-success rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="fas fa-check text-white"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-0">System Status</h6>
                  <small className="text-success">
                    All systems operational
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div
                    className="bg-info rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="fas fa-percentage text-white"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-0">Completion Rate</h6>
                  <small className="text-info">
                    {stats.totalRides > 0
                      ? Math.round(
                          (stats.completedRides / stats.totalRides) * 100
                        )
                      : 0}
                    % rides completed
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div
                    className="bg-warning rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i className="fas fa-chart-line text-white"></i>
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="mb-0">Growth</h6>
                  <small className="text-warning">
                    Platform growing steadily
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

export default AdminDashboard;
