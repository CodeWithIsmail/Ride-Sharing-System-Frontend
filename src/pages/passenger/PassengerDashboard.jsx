import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { rideService } from "../../services/apiService";

const PassengerDashboard = () => {
  const [stats, setStats] = useState({
    totalRides: 0,
    lookingRides: 0,
    confirmedRides: 0,
    completedRides: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const rides = await rideService.getPassengerRides();
      
      const stats = {
        totalRides: rides.length,
        lookingRides: rides.filter(ride => ride.status === 'posted' || ride.status === 'pending').length,
        confirmedRides: rides.filter(ride => ride.status === 'confirmed').length,
        completedRides: rides.filter(ride => ride.status === 'completed').length,
      };
      
      setStats(stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Passenger Dashboard</h1>
          <p className="text-gray-600">Welcome back! Manage your rides and travel requests.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.totalRides}</p>
                <p className="text-gray-600">Total Rides</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.lookingRides}</p>
                <p className="text-gray-600">Looking for Drivers</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.confirmedRides}</p>
                <p className="text-gray-600">Confirmed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">{stats.completedRides}</p>
                <p className="text-gray-600">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Request Ride Card */}
          <Link 
            to="/passenger/request-ride" 
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Request a Ride</h3>
              <p className="text-gray-600 leading-relaxed">
                Post a new ride request and find drivers who can take you to your destination.
              </p>
              <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
                <span className="text-sm font-medium">Create Request</span>
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* My Ride History Card */}
          <Link 
            to="/passenger/my-rides" 
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-6 group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">My Ride History</h3>
              <p className="text-gray-600 leading-relaxed">
                View all your rides organized by status: looking, confirmed, completed, and cancelled.
              </p>
              <div className="mt-4 flex items-center text-green-600 group-hover:text-green-700">
                <span className="text-sm font-medium">View History</span>
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Profile Management Card */}
          <Link 
            to="/profile" 
            className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-6 group-hover:bg-purple-200 transition-colors">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">My Profile</h3>
              <p className="text-gray-600 leading-relaxed">
                Manage your account information, preferences, and settings.
              </p>
              <div className="mt-4 flex items-center text-purple-600 group-hover:text-purple-700">
                <span className="text-sm font-medium">Edit Profile</span>
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/passenger/request-ride" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Ride Request
            </Link>
            <Link 
              to="/passenger/my-rides" 
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View All Rides
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDashboard;
