import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { rideService } from "../../services/apiService";

const MyRideHistory = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const response = await rideService.getPassengerRides();
      const myRides = Array.isArray(response) ? response : [];

      // Sort by targetTime (newest first)
      const sortedRides = myRides.sort(
        (a, b) => new Date(b.targetTime) - new Date(a.targetTime)
      );

      setRides(sortedRides);
    } catch (error) {
      console.error("Error fetching rides:", error);
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategorizedRides = () => {
    const categories = {
      all: rides,
      looking: rides.filter(
        (ride) => ride.status === "posted" || ride.status === "pending"
      ),
      confirmed: rides.filter((ride) => ride.status === "confirmed"),
      completed: rides.filter((ride) => ride.status === "completed"),
      cancelled: rides.filter((ride) => ride.status === "cancelled"),
    };
    return categories;
  };

  const categorizedRides = getCategorizedRides();
  const currentRides = categorizedRides[activeTab] || [];

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

  const handleRideClick = (ride) => {
    navigate(`/passenger/ride/${ride.rideRequestId}`);
  };

  const tabs = [
    { key: "all", label: "All", count: categorizedRides.all.length },
    {
      key: "looking",
      label: "Looking",
      count: categorizedRides.looking.length,
    },
    {
      key: "confirmed",
      label: "Confirmed",
      count: categorizedRides.confirmed.length,
    },
    {
      key: "completed",
      label: "Completed",
      count: categorizedRides.completed.length,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: categorizedRides.cancelled.length,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your rides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Ride History
              </h1>
              <p className="text-gray-600">
                Track and manage all your ride requests
              </p>
            </div>
            <Link
              to="/passenger/request-ride"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              + Request New Ride
            </Link>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                        activeTab === tab.key
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Rides List */}
          <div className="p-6">
            {currentRides.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No rides found
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === "all"
                    ? "You haven't requested any rides yet."
                    : `No rides in ${activeTab} category.`}
                </p>
                {activeTab === "all" && (
                  <Link
                    to="/passenger/request-ride"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Request Your First Ride
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {currentRides.map((ride) => {
                  const statusInfo = getStatusInfo(ride.status);
                  return (
                    <div
                      key={ride.rideRequestId}
                      onClick={() => handleRideClick(ride)}
                      className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          {/* Route Info */}
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">
                                From:
                              </span>
                              <span className="font-medium text-gray-900">
                                {ride.pickupLocation}
                              </span>
                            </div>
                            <div className="text-gray-400">→</div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">To:</span>
                              <span className="font-medium text-gray-900">
                                {ride.dropoffLocation}
                              </span>
                            </div>
                          </div>

                          {/* Time and Fare */}
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <span>📅</span>
                              <span>
                                {new Date(ride.targetTime).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>🕒</span>
                              <span>
                                {new Date(ride.targetTime).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>💰</span>
                              <span className="font-semibold">
                                ৳{ride.desiredFare}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                          >
                            {statusInfo.icon} {statusInfo.label}
                          </span>
                          <div className="text-gray-400">
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Ride ID */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="text-xs text-gray-500">
                          Ride ID: {ride.rideRequestId.slice(-8)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyRideHistory;
