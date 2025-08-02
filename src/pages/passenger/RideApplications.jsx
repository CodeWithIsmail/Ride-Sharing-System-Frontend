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
    const fetchData = async () => {
      try {
        setLoading(true);

        // First, try to get the specific ride details
        try {
          const rideResponse = await rideService.getRideById(rideId);
          const currentRide = rideResponse.ride || rideResponse;
          setRide(currentRide);
        } catch (error) {
          console.log(
            "Specific ride not found, trying from all rides...",
            error
          );

          // Fallback: get all rides and find this one
          const allRides = await rideService.getMyRides();
          const ridesArray = Array.isArray(allRides) ? allRides : [];
          const currentRide = ridesArray.find(
            (r) => r.rideRequestId === rideId
          );
          setRide(currentRide);
        }

        // Fetch applications for this ride
        const applicationsResponse = await rideService.getRideApplications(
          rideId
        );
        const apps = applicationsResponse.applications || [];
        setApplications(apps);

        // Fetch applicant details
        const applicantDetailsMap = {};
        for (const app of apps) {
          try {
            const userResponse = await userService.getUserById(app.driverId);
            applicantDetailsMap[app.driverId] =
              userResponse.user || userResponse;
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

    if (rideId) {
      fetchData();
    }
  }, [rideId]);

  const fetchRideAndApplications = async () => {
    try {
      setLoading(true);

      // First, get the ride details by fetching all rides and finding this one
      const allRides = await rideService.getMyRides();
      const currentRide = allRides.find((r) => r.rideRequestId === rideId);
      setRide(currentRide);

      // Fetch applications for this ride
      const applicationsResponse = await rideService.getRideApplications(
        rideId
      );
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-indigo-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/passenger/my-rides")}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Driver Applications 🚗
              </h1>
              <p className="text-gray-600 mt-1">
                {ride
                  ? `${ride.pickupLocation} → ${ride.dropoffLocation}`
                  : "Choose your preferred driver"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ride Details */}
        {ride && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                📍 Ride Details
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-blue-600 text-sm font-medium">
                  Pickup Location
                </p>
                <p className="text-gray-900 font-semibold">
                  {ride.pickupLocation}
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-green-600 text-sm font-medium">
                  Dropoff Location
                </p>
                <p className="text-gray-900 font-semibold">
                  {ride.dropoffLocation}
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-purple-600 text-sm font-medium">
                  Desired Fare
                </p>
                <p className="text-gray-900 font-semibold">
                  ৳{ride.desiredFare}
                </p>
              </div>
            </div>
            <div className="mt-4 bg-orange-50 rounded-xl p-4">
              <p className="text-orange-600 text-sm font-medium">Target Time</p>
              <p className="text-gray-900 font-semibold">
                {new Date(ride.targetTime).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Applications */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              👥 Driver Applications ({applications.length})
            </span>
          </h2>

          {applications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-600 mb-6">
                Drivers haven't applied for this ride yet. Check back later!
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate("/passenger/my-rides")}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  ← Back to My Rides
                </button>
                <button
                  onClick={fetchRideAndApplications}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {applications.map((application) => {
                const driver = applicantDetails[application.driverId];
                return (
                  <div
                    key={application.driverId}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl">
                            {driver?.name?.charAt(0) || "D"}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
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

                      <div className="mt-6 flex items-center justify-between">
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
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {selecting ? (
                            <span className="flex items-center">
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Selecting...
                            </span>
                          ) : (
                            "Select This Driver 🎯"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideApplications;
