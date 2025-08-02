import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { rideService, userService } from "../../services/apiService";

const RideDetail = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [applications, setApplications] = useState([]);
  const [applicantDetails, setApplicantDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch ride details
        try {
          const rideResponse = await rideService.getRideById(rideId);
          const rideData = rideResponse.ride || rideResponse;
          setRide(rideData);
        } catch (rideError) {
          console.log("Fetching from all rides...", rideError);
          const allRides = await rideService.getPassengerRides();
          const ridesArray = Array.isArray(allRides) ? allRides : [];
          const currentRide = ridesArray.find(
            (r) => r.rideRequestId === rideId
          );
          setRide(currentRide);
        }

        // Fetch applications only if ride is in "looking" state
        const response = await rideService.getPassengerRides();
        const ridesArray = Array.isArray(response) ? response : [];
        const currentRide = ridesArray.find((r) => r.rideRequestId === rideId);

        if (
          currentRide &&
          (currentRide.status === "posted" || currentRide.status === "pending")
        ) {
          try {
            const applicationsResponse = await rideService.getRideApplications(
              rideId
            );
            const apps = applicationsResponse.applications || [];
            setApplications(apps);

            // Fetch applicant details
            const applicantDetailsMap = {};
            for (const app of apps) {
              try {
                const userResponse = await userService.getUserById(
                  app.driverId
                );
                applicantDetailsMap[app.driverId] =
                  userResponse.user || userResponse;
              } catch (userError) {
                console.error(
                  `Error fetching user ${app.driverId}:`,
                  userError
                );
              }
            }
            setApplicantDetails(applicantDetailsMap);
          } catch (appError) {
            console.error("Error fetching applications:", appError);
          }
        }
      } catch (error) {
        console.error("Error fetching ride details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (rideId) {
      fetchData();
    }
  }, [rideId]);

  const handleSelectDriver = async (driverId) => {
    if (!window.confirm("Are you sure you want to select this driver?")) {
      return;
    }

    setSelecting(true);
    try {
      await rideService.selectDriver(rideId, driverId);
      navigate("/passenger/my-ride-history", {
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

  const handleCancelRide = async () => {
    if (!window.confirm("Are you sure you want to cancel this ride?")) {
      return;
    }

    try {
      await rideService.cancelRide(rideId);
      navigate("/passenger/my-rides", {
        state: {
          message: "Ride cancelled successfully.",
        },
      });
    } catch (error) {
      console.error("Error cancelling ride:", error);
      alert("Failed to cancel ride. Please try again.");
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      posted: {
        label: "Looking for Driver",
        color: "bg-blue-100 text-blue-800",
        icon: "🔍",
      },
      pending: {
        label: "Looking for Driver",
        color: "bg-blue-100 text-blue-800",
        icon: "🔍",
      },
      confirmed: {
        label: "Driver Confirmed",
        color: "bg-yellow-100 text-yellow-800",
        icon: "✅",
      },
      completed: {
        label: "Ride Completed",
        color: "bg-green-100 text-green-800",
        icon: "🎉",
      },
      cancelled: {
        label: "Ride Cancelled",
        color: "bg-red-100 text-red-800",
        icon: "❌",
      },
    };
    return statusMap[status] || statusMap.posted;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ride Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The ride you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/passenger/my-rides")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            Back to My Rides
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(ride.status);
  const isLookingForDriver =
    ride.status === "posted" || ride.status === "pending";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/passenger/my-rides")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Back to My Rides
            </button>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${statusInfo.color}`}
            >
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ride Details
          </h1>
          <p className="text-gray-600">Ride ID: {ride.rideRequestId}</p>
        </div>

        {/* Ride Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Trip Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Route */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-900 font-medium">
                    {ride.pickupLocation}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-900 font-medium">
                    {ride.dropoffLocation}
                  </span>
                </div>
              </div>
            </div>

            {/* Time and Fare */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time
                </label>
                <div className="flex items-center space-x-2">
                  <span>📅</span>
                  <span className="text-gray-900">
                    {new Date(ride.targetTime).toLocaleDateString()} at{" "}
                    {new Date(ride.targetTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fare
                </label>
                <div className="flex items-center space-x-2">
                  <span>💰</span>
                  <span className="text-gray-900 font-semibold text-lg">
                    ৳{ride.desiredFare}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isLookingForDriver && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancelRide}
                className="bg-red-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors"
              >
                Cancel Ride
              </button>
            </div>
          )}
        </div>

        {/* Driver Applications (only for looking status) */}
        {isLookingForDriver && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Driver Applications ({applications.length})
            </h2>

            {applications.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-600">
                  Drivers haven't applied for this ride yet. Please wait for
                  applications.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => {
                  const driver = applicantDetails[application.driverId];
                  return (
                    <div
                      key={application.driverId}
                      className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">
                            {driver?.name?.charAt(0) || "D"}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {driver?.name || "Driver"}
                            </h3>
                            <p className="text-gray-600">{driver?.email}</p>
                            {driver?.phone && (
                              <p className="text-gray-600 text-sm">
                                📱 {driver.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                            Available
                          </div>
                          <p className="text-gray-500 text-sm">
                            Applied:{" "}
                            {new Date(
                              application.appliedAt || Date.now()
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-50 rounded-lg px-3 py-2">
                            <span className="text-blue-600 text-sm font-medium">
                              ⭐ Rating: 4.8/5
                            </span>
                          </div>
                          <div className="bg-green-50 rounded-lg px-3 py-2">
                            <span className="text-green-600 text-sm font-medium">
                              🚗 150+ Rides
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            handleSelectDriver(application.driverId)
                          }
                          disabled={selecting}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {selecting ? "Selecting..." : "Select This Driver"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Ride Details for other statuses */}
        {!isLookingForDriver && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Ride Status
            </h2>

            <div className="text-center py-8">
              <div className="text-6xl mb-4">{statusInfo.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {statusInfo.label}
              </h3>

              {ride.status === "confirmed" && (
                <div className="bg-yellow-50 rounded-xl p-6 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Your Driver
                  </h4>
                  <p className="text-gray-600">
                    Driver details will be shown here
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => navigate(`/payment/${ride.rideRequestId}`)}
                      className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                    >
                      Complete Payment
                    </button>
                  </div>
                </div>
              )}

              {ride.status === "completed" && (
                <div className="bg-green-50 rounded-xl p-6 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Trip Completed!
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Thank you for using our service
                  </p>
                  <button
                    onClick={() => navigate(`/payment/${ride.rideRequestId}`)}
                    className="bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                  >
                    View Receipt
                  </button>
                </div>
              )}

              {ride.status === "cancelled" && (
                <div className="bg-red-50 rounded-xl p-6 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Ride Cancelled
                  </h4>
                  <p className="text-gray-600">This ride has been cancelled</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RideDetail;
