import { useEffect, useState } from "react";
import { adminService } from "../../services/apiService";

const ManageRides = () => {
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedRide, setSelectedRide] = useState(null);
  const [showRideModal, setShowRideModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRides();
  }, []);

  useEffect(() => {
    filterRides();
  }, [rides, searchTerm, statusFilter, dateFilter]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllRides();
      setRides(response.rides || []);
    } catch (error) {
      console.error("Error fetching rides:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRides = () => {
    let filtered = [...rides];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (ride) =>
          ride.pickupLocation
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          ride.dropoffLocation
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          ride._id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((ride) => ride.status === statusFilter);
    }

    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date();
      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

      filtered = filtered.filter((ride) => {
        const rideDate = new Date(ride.targetTime);

        switch (dateFilter) {
          case "today":
            return (
              rideDate >= startOfToday &&
              rideDate < new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)
            );
          case "week":
            const startOfWeek = new Date(
              startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000
            );
            return rideDate >= startOfWeek;
          case "month":
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return rideDate >= startOfMonth;
          default:
            return true;
        }
      });
    }

    setFilteredRides(filtered);
  };

  const handleRideAction = async (rideId, action) => {
    try {
      setActionLoading(true);

      switch (action) {
        case "cancel":
          if (window.confirm("Are you sure you want to cancel this ride?")) {
            await adminService.updateRideStatus(rideId, {
              status: "cancelled",
            });
          } else {
            return;
          }
          break;
        case "delete":
          if (
            window.confirm(
              "Are you sure you want to delete this ride? This action cannot be undone."
            )
          ) {
            await adminService.deleteRide(rideId);
          } else {
            return;
          }
          break;
        default:
          return;
      }

      await fetchRides();
      setShowRideModal(false);
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      alert(`Failed to ${action} ride. Please try again.`);
    } finally {
      setActionLoading(false);
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

  const openRideModal = (ride) => {
    setSelectedRide(ride);
    setShowRideModal(true);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading rides...</p>
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
          <h1 className="display-6 fw-bold text-primary">Manage Rides</h1>
          <p className="lead text-muted">
            Monitor and manage ride requests on your platform
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="fw-bold text-primary">{rides.length}</h3>
              <p className="text-muted mb-0">Total Rides</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="fw-bold text-info">
                {rides.filter((r) => r.status === "posted").length}
              </h3>
              <p className="text-muted mb-0">Posted</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="fw-bold text-warning">
                {rides.filter((r) => r.status === "confirmed").length}
              </h3>
              <p className="text-muted mb-0">Confirmed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="fw-bold text-success">
                {rides.filter((r) => r.status === "completed").length}
              </h3>
              <p className="text-muted mb-0">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Search Rides</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by location or ride ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Filter by Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="posted">Posted</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Filter by Date</label>
              <select
                className="form-select"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">&nbsp;</label>
              <button
                className="btn btn-outline-secondary w-100"
                onClick={fetchRides}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rides Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">
              Ride Requests ({filteredRides.length}{" "}
              {filteredRides.length === 1 ? "ride" : "rides"})
            </h5>
          </div>
        </div>
        <div className="card-body p-0">
          {filteredRides.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-route text-muted fs-1 mb-3"></i>
              <h5 className="text-muted">No rides found</h5>
              <p className="text-muted mb-0">
                {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No rides have been posted yet"}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 px-4 py-3">Ride ID</th>
                    <th className="border-0 px-4 py-3">Route</th>
                    <th className="border-0 px-4 py-3">Date & Time</th>
                    <th className="border-0 px-4 py-3">Passengers</th>
                    <th className="border-0 px-4 py-3">Fare</th>
                    <th className="border-0 px-4 py-3">Status</th>
                    <th className="border-0 px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRides.map((ride) => {
                    const dateTime = formatDateTime(ride.targetTime);
                    return (
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
                              <i className="fas fa-arrow-down me-1"></i>
                              {ride.dropoffLocation}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-muted small">
                            {dateTime.date}
                          </div>
                          <div className="text-muted small">
                            {dateTime.time}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="fw-semibold">
                            {ride.seatsNeeded}
                          </span>
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
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => openRideModal(ride)}
                          >
                            <i className="fas fa-eye me-1"></i>
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Ride Details Modal */}
      {showRideModal && selectedRide && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-route me-2"></i>
                  Ride Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRideModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Ride Information */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="fw-bold text-primary mb-3">
                      Ride Information
                    </h6>
                    <div className="mb-2">
                      <strong>Ride ID:</strong>{" "}
                      <span className="font-monospace">{selectedRide._id}</span>
                    </div>
                    <div className="mb-2">
                      <strong>Pickup:</strong> {selectedRide.pickupLocation}
                    </div>
                    <div className="mb-2">
                      <strong>Dropoff:</strong> {selectedRide.dropoffLocation}
                    </div>
                    <div className="mb-2">
                      <strong>Date & Time:</strong>{" "}
                      {formatDateTime(selectedRide.targetTime).date} at{" "}
                      {formatDateTime(selectedRide.targetTime).time}
                    </div>
                    <div className="mb-2">
                      <strong>Passengers:</strong> {selectedRide.seatsNeeded}
                    </div>
                    <div className="mb-2">
                      <strong>Fare:</strong> ${selectedRide.desiredFare}
                    </div>
                    <div className="mb-2">
                      <strong>Status:</strong>{" "}
                      {getStatusBadge(selectedRide.status)}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold text-primary mb-3">
                      Additional Details
                    </h6>
                    <div className="mb-2">
                      <strong>Posted:</strong>{" "}
                      {selectedRide.createdAt
                        ? new Date(selectedRide.createdAt).toLocaleString()
                        : "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Last Updated:</strong>{" "}
                      {selectedRide.updatedAt
                        ? new Date(selectedRide.updatedAt).toLocaleString()
                        : "N/A"}
                    </div>
                    {selectedRide.description && (
                      <div className="mb-2">
                        <strong>Description:</strong>
                        <div className="mt-1 p-2 bg-light rounded">
                          {selectedRide.description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedRide.status !== "cancelled" &&
                  selectedRide.status !== "completed" && (
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        className="btn btn-warning"
                        onClick={() =>
                          handleRideAction(selectedRide._id, "cancel")
                        }
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : (
                          <i className="fas fa-times me-2"></i>
                        )}
                        Cancel Ride
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          handleRideAction(selectedRide._id, "delete")
                        }
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : (
                          <i className="fas fa-trash me-2"></i>
                        )}
                        Delete Ride
                      </button>
                    </div>
                  )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRideModal(false)}
                  disabled={actionLoading}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRides;
