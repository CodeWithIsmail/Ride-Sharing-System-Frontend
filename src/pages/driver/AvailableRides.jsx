import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { rideService } from "../../services/apiService";

const AvailableRides = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingRideId, setApplyingRideId] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    minFare: "",
    maxFare: "",
  });

  useEffect(() => {
    fetchAvailableRides();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rides, searchFilters]);

  const fetchAvailableRides = async () => {
    try {
      setLoading(true);
      const response = await rideService.getAvailableRides("posted");
      const availableRides = response.rides || [];

      // Filter out rides where this driver has already applied
      const ridesNotApplied = availableRides.filter(
        (ride) => !ride.applications?.some((app) => app.driverId === user._id)
      );

      setRides(ridesNotApplied);
    } catch (error) {
      console.error("Error fetching available rides:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = rides;

    if (searchFilters.pickupLocation) {
      filtered = filtered.filter((ride) =>
        ride.pickupLocation
          .toLowerCase()
          .includes(searchFilters.pickupLocation.toLowerCase())
      );
    }

    if (searchFilters.dropoffLocation) {
      filtered = filtered.filter((ride) =>
        ride.dropoffLocation
          .toLowerCase()
          .includes(searchFilters.dropoffLocation.toLowerCase())
      );
    }

    if (searchFilters.minFare) {
      filtered = filtered.filter(
        (ride) => ride.desiredFare >= Number(searchFilters.minFare)
      );
    }

    if (searchFilters.maxFare) {
      filtered = filtered.filter(
        (ride) => ride.desiredFare <= Number(searchFilters.maxFare)
      );
    }

    setFilteredRides(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      pickupLocation: "",
      dropoffLocation: "",
      minFare: "",
      maxFare: "",
    });
  };

  const handleApplyForRide = async (rideId) => {
    if (!window.confirm("Are you sure you want to apply for this ride?")) {
      return;
    }

    setApplyingRideId(rideId);

    try {
      await rideService.applyForRide(rideId);

      // Remove the ride from available rides since driver has now applied
      setRides((prev) => prev.filter((ride) => ride._id !== rideId));

      alert(
        "Application submitted successfully! The passenger will review your application."
      );
    } catch (error) {
      console.error("Error applying for ride:", error);
      alert("Failed to apply for ride. Please try again.");
    } finally {
      setApplyingRideId(null);
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
            <p className="mt-2">Loading available rides...</p>
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
          <h1 className="display-6 fw-bold text-success">Available Rides</h1>
          <p className="lead text-muted">
            Find rides that match your route and apply to earn
          </p>
        </div>
      </div>

      {/* Search Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <i className="fas fa-filter me-2"></i>
            Filter Rides
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Pickup Location</label>
              <input
                type="text"
                className="form-control"
                name="pickupLocation"
                value={searchFilters.pickupLocation}
                onChange={handleFilterChange}
                placeholder="Enter pickup location"
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Drop-off Location</label>
              <input
                type="text"
                className="form-control"
                name="dropoffLocation"
                value={searchFilters.dropoffLocation}
                onChange={handleFilterChange}
                placeholder="Enter destination"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Min Fare ($)</label>
              <input
                type="number"
                className="form-control"
                name="minFare"
                value={searchFilters.minFare}
                onChange={handleFilterChange}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Max Fare ($)</label>
              <input
                type="number"
                className="form-control"
                name="maxFare"
                value={searchFilters.maxFare}
                onChange={handleFilterChange}
                placeholder="1000"
                min="0"
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
              >
                <i className="fas fa-times me-2"></i>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          {filteredRides.length} Ride{filteredRides.length !== 1 ? "s" : ""}{" "}
          Available
        </h4>
        <button
          className="btn btn-outline-primary"
          onClick={fetchAvailableRides}
        >
          <i className="fas fa-sync-alt me-2"></i>
          Refresh
        </button>
      </div>

      {/* Rides List */}
      {filteredRides.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            {rides.length === 0 ? (
              <>
                <i
                  className="fas fa-car text-muted"
                  style={{ fontSize: "4rem" }}
                ></i>
                <h4 className="text-muted mt-3">No Rides Available</h4>
                <p className="text-muted mb-4">
                  There are currently no ride requests available. Check back
                  later for new opportunities!
                </p>
              </>
            ) : (
              <>
                <i
                  className="fas fa-search text-muted"
                  style={{ fontSize: "4rem" }}
                ></i>
                <h4 className="text-muted mt-3">No Matching Rides</h4>
                <p className="text-muted mb-4">
                  No rides match your current filters. Try adjusting your search
                  criteria.
                </p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </>
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
                      <div className="mb-3">
                        <span className="badge bg-info text-white fs-6 px-3 py-2">
                          <i className="fas fa-search me-2"></i>
                          Looking for Driver
                        </span>
                      </div>

                      <div className="d-grid">
                        <button
                          className="btn btn-success btn-lg"
                          onClick={() => handleApplyForRide(ride._id)}
                          disabled={applyingRideId === ride._id}
                        >
                          {applyingRideId === ride._id ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              ></span>
                              Applying...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane me-2"></i>
                              Apply for Ride
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <hr className="my-3" />

                  <div className="row text-muted small">
                    <div className="col-md-6">
                      <i className="fas fa-clock me-2"></i>
                      Posted: {new Date(ride.createdAt).toLocaleString()}
                    </div>
                    <div className="col-md-6 text-md-end">
                      <i className="fas fa-users me-2"></i>
                      {ride.applications?.length || 0} application
                      {(ride.applications?.length || 0) !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips Section */}
      <div className="card border-0 shadow-sm mt-5">
        <div className="card-body">
          <h5 className="card-title text-success">
            <i className="fas fa-lightbulb me-2"></i>
            Application Tips
          </h5>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="d-flex align-items-start">
                <i className="fas fa-clock text-primary me-3 mt-1"></i>
                <div>
                  <h6 className="fw-semibold">Apply Quickly</h6>
                  <small className="text-muted">
                    Early applications get more attention from passengers
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-start">
                <i className="fas fa-route text-success me-3 mt-1"></i>
                <div>
                  <h6 className="fw-semibold">Match Your Route</h6>
                  <small className="text-muted">
                    Choose rides that align with your planned journey
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-start">
                <i className="fas fa-star text-warning me-3 mt-1"></i>
                <div>
                  <h6 className="fw-semibold">Be Professional</h6>
                  <small className="text-muted">
                    Maintain a complete and professional profile
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

export default AvailableRides;
