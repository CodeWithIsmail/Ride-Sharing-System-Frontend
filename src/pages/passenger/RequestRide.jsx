import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { rideService } from "../../services/apiService";

const RequestRide = () => {
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    targetDate: "",
    targetTime: "",
    desiredFare: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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

    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = "Pickup location is required";
    }

    if (!formData.dropoffLocation.trim()) {
      newErrors.dropoffLocation = "Drop-off location is required";
    }

    if (!formData.targetDate) {
      newErrors.targetDate = "Date is required";
    } else {
      const selectedDate = new Date(formData.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.targetDate = "Date cannot be in the past";
      }
    }

    if (!formData.targetTime) {
      newErrors.targetTime = "Time is required";
    }

    if (!formData.desiredFare) {
      newErrors.desiredFare = "Fare is required";
    } else if (
      isNaN(formData.desiredFare) ||
      Number(formData.desiredFare) <= 0
    ) {
      newErrors.desiredFare = "Please enter a valid fare amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Combine date and time
      const targetDateTime = new Date(
        `${formData.targetDate}T${formData.targetTime}`
      );

      const rideData = {
        pickupLocation: formData.pickupLocation.trim(),
        dropoffLocation: formData.dropoffLocation.trim(),
        targetTime: targetDateTime.toISOString(),
        desiredFare: Number(formData.desiredFare),
      };

      await rideService.createRide(rideData);

      // Navigate to rides page with success message
      navigate("/passenger/my-rides", {
        state: {
          message:
            "Ride request created successfully! Drivers can now apply for your ride.",
        },
      });
    } catch (error) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "Failed to create ride request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-header bg-primary text-white text-center py-4 rounded-top-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                <i className="fas fa-plus-circle text-primary fs-3"></i>
              </div>
              <h2 className="fw-bold mb-1">Request a Ride</h2>
              <p className="mb-0 opacity-75">Tell us where you want to go</p>
            </div>

            <div className="card-body p-4">
              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="pickupLocation"
                    className="form-label fw-semibold"
                  >
                    <i className="fas fa-map-marker-alt me-2 text-success"></i>
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${
                      errors.pickupLocation ? "is-invalid" : ""
                    }`}
                    id="pickupLocation"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    placeholder="Enter pickup location (e.g., Shahbag, Dhaka)"
                    disabled={loading}
                  />
                  {errors.pickupLocation && (
                    <div className="invalid-feedback">
                      {errors.pickupLocation}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="dropoffLocation"
                    className="form-label fw-semibold"
                  >
                    <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                    Drop-off Location
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${
                      errors.dropoffLocation ? "is-invalid" : ""
                    }`}
                    id="dropoffLocation"
                    name="dropoffLocation"
                    value={formData.dropoffLocation}
                    onChange={handleChange}
                    placeholder="Enter destination (e.g., Dhanmondi, Dhaka)"
                    disabled={loading}
                  />
                  {errors.dropoffLocation && (
                    <div className="invalid-feedback">
                      {errors.dropoffLocation}
                    </div>
                  )}
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label
                      htmlFor="targetDate"
                      className="form-label fw-semibold"
                    >
                      <i className="fas fa-calendar me-2 text-primary"></i>
                      Date
                    </label>
                    <input
                      type="date"
                      className={`form-control form-control-lg ${
                        errors.targetDate ? "is-invalid" : ""
                      }`}
                      id="targetDate"
                      name="targetDate"
                      value={formData.targetDate}
                      onChange={handleChange}
                      min={getMinDate()}
                      disabled={loading}
                    />
                    {errors.targetDate && (
                      <div className="invalid-feedback">
                        {errors.targetDate}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label
                      htmlFor="targetTime"
                      className="form-label fw-semibold"
                    >
                      <i className="fas fa-clock me-2 text-primary"></i>
                      Time
                    </label>
                    <input
                      type="time"
                      className={`form-control form-control-lg ${
                        errors.targetTime ? "is-invalid" : ""
                      }`}
                      id="targetTime"
                      name="targetTime"
                      value={formData.targetTime}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    {errors.targetTime && (
                      <div className="invalid-feedback">
                        {errors.targetTime}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="desiredFare"
                    className="form-label fw-semibold"
                  >
                    <i className="fas fa-dollar-sign me-2 text-warning"></i>
                    Desired Fare (USD)
                  </label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.desiredFare ? "is-invalid" : ""
                      }`}
                      id="desiredFare"
                      name="desiredFare"
                      value={formData.desiredFare}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      disabled={loading}
                    />
                    {errors.desiredFare && (
                      <div className="invalid-feedback">
                        {errors.desiredFare}
                      </div>
                    )}
                  </div>
                  <div className="form-text">
                    <i className="fas fa-info-circle me-1"></i>
                    Set a fair price to attract drivers
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Creating Request...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Submit Ride Request
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/passenger/dashboard")}
                    disabled={loading}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Dashboard
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Card */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <h5 className="card-title text-primary">
                <i className="fas fa-lightbulb me-2"></i>
                How it works
              </h5>
              <div className="row g-3">
                <div className="col-md-4 text-center">
                  <div className="mb-2">
                    <i className="fas fa-map-marked-alt text-primary fs-3"></i>
                  </div>
                  <h6>1. Set your route</h6>
                  <small className="text-muted">
                    Enter pickup and drop-off locations
                  </small>
                </div>
                <div className="col-md-4 text-center">
                  <div className="mb-2">
                    <i className="fas fa-users text-success fs-3"></i>
                  </div>
                  <h6>2. Get applications</h6>
                  <small className="text-muted">
                    Drivers will apply for your ride
                  </small>
                </div>
                <div className="col-md-4 text-center">
                  <div className="mb-2">
                    <i className="fas fa-handshake text-warning fs-3"></i>
                  </div>
                  <h6>3. Choose & ride</h6>
                  <small className="text-muted">
                    Select a driver and enjoy your trip
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

export default RequestRide;
