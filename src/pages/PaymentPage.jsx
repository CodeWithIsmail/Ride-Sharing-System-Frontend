import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { paymentService } from "../services/apiService";

const PaymentPage = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "cash",
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // In a real app, you'd fetch the ride details
    // For now, we'll simulate the ride data
    setRide({
      _id: rideId,
      pickupLocation: "Shahbag, Dhaka",
      dropoffLocation: "Dhanmondi, Dhaka",
      desiredFare: 150,
      targetTime: new Date().toISOString(),
      status: "completed",
    });

    setPaymentData((prev) => ({
      ...prev,
      amount: "150", // Set default amount from ride
    }));

    setLoading(false);
  }, [rideId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePayment = () => {
    const newErrors = {};

    if (!paymentData.amount || paymentData.amount <= 0) {
      newErrors.amount = "Please enter a valid payment amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!validatePayment()) return;

    setProcessing(true);

    try {
      // Record the payment
      const paymentResponse = await paymentService.recordPayment(
        rideId,
        Number(paymentData.amount)
      );

      // Generate receipt
      await paymentService.generateReceipt(paymentResponse.payment._id);

      // Navigate to success page or dashboard
      navigate("/passenger/my-rides", {
        state: {
          message: "Payment recorded successfully! Receipt has been generated.",
        },
      });
    } catch (error) {
      console.error("Payment error:", error);
      setErrors({
        submit:
          error.response?.data?.message || "Payment failed. Please try again.",
      });
    } finally {
      setProcessing(false);
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
            <p className="mt-2">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-success rounded-circle mb-3"
              style={{ width: "80px", height: "80px" }}
            >
              <i className="fas fa-credit-card text-white fs-3"></i>
            </div>
            <h1 className="display-6 fw-bold text-success">Complete Payment</h1>
            <p className="lead text-muted">
              Record your cash payment for the completed ride
            </p>
          </div>

          {/* Ride Summary Card */}
          <div className="card border-0 shadow-lg mb-4">
            <div className="card-header bg-primary text-white text-center py-3">
              <h4 className="mb-0">
                <i className="fas fa-route me-2"></i>
                Ride Summary
              </h4>
            </div>
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="mb-3">
                    <h5 className="fw-bold mb-1">
                      <i className="fas fa-map-marker-alt text-success me-2"></i>
                      {ride?.pickupLocation}
                    </h5>
                    <div className="text-muted mb-2">
                      <i className="fas fa-arrow-down me-2"></i>
                      to
                    </div>
                    <h5 className="fw-bold mb-0">
                      <i className="fas fa-map-marker-alt text-danger me-2"></i>
                      {ride?.dropoffLocation}
                    </h5>
                  </div>
                </div>
                <div className="col-md-4 text-center">
                  <div className="mb-2">
                    <span className="badge bg-success fs-6 px-3 py-2">
                      <i className="fas fa-check-circle me-2"></i>
                      Ride Completed
                    </span>
                  </div>
                  <div
                    className="text-success fw-bold"
                    style={{ fontSize: "2rem" }}
                  >
                    <i className="fas fa-dollar-sign"></i>
                    {ride?.desiredFare}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <i className="fas fa-money-bill-wave me-2 text-success"></i>
                Payment Details
              </h5>
            </div>
            <div className="card-body p-4">
              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmitPayment}>
                <div className="mb-4">
                  <label
                    htmlFor="paymentMethod"
                    className="form-label fw-semibold"
                  >
                    <i className="fas fa-credit-card me-2 text-muted"></i>
                    Payment Method
                  </label>
                  <select
                    className="form-select form-select-lg"
                    id="paymentMethod"
                    name="paymentMethod"
                    value={paymentData.paymentMethod}
                    onChange={handleInputChange}
                    disabled={processing}
                  >
                    <option value="cash">Cash Payment</option>
                  </select>
                  <div className="form-text">
                    <i className="fas fa-info-circle me-1"></i>
                    Currently, only cash payments are supported
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="amount" className="form-label fw-semibold">
                    <i className="fas fa-dollar-sign me-2 text-muted"></i>
                    Payment Amount
                  </label>
                  <div className="input-group input-group-lg">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.amount ? "is-invalid" : ""
                      }`}
                      id="amount"
                      name="amount"
                      value={paymentData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      disabled={processing}
                    />
                    {errors.amount && (
                      <div className="invalid-feedback">{errors.amount}</div>
                    )}
                  </div>
                  <div className="form-text">
                    <i className="fas fa-info-circle me-1"></i>
                    Confirm the exact amount paid to the driver
                  </div>
                </div>

                {/* Payment Confirmation */}
                <div className="alert alert-info" role="alert">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <i className="fas fa-info-circle fs-4"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="alert-heading">Payment Confirmation</h6>
                      <p className="mb-0">
                        By clicking "Record Payment", you confirm that you have
                        paid the driver in cash. A digital receipt will be
                        generated for your records.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-check-circle me-2"></i>
                        Record Cash Payment
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/passenger/my-rides")}
                    disabled={processing}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to My Rides
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Security Notice */}
          <div className="card border-0 bg-light mt-4">
            <div className="card-body">
              <h6 className="card-title text-primary">
                <i className="fas fa-shield-alt me-2"></i>
                Security & Privacy
              </h6>
              <p className="card-text small text-muted mb-0">
                Your payment information is securely processed. We only record
                the transaction for receipt generation and platform statistics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
