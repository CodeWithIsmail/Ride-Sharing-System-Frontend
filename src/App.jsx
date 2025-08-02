import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import DebugPage from "./pages/DebugPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPageNew";

// Passenger Pages
import MyRideHistory from "./pages/passenger/MyRideHistory";
import PassengerDashboard from "./pages/passenger/PassengerDashboard";
import RequestRide from "./pages/passenger/RequestRide";
import RideDetail from "./pages/passenger/RideDetail";

// Driver Pages
import AvailableRides from "./pages/driver/AvailableRides";
import DriverDashboard from "./pages/driver/DriverDashboard";
import DriverRides from "./pages/driver/DriverRides";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageRides from "./pages/admin/ManageRides";
import ManageUsers from "./pages/admin/ManageUsers";

// Payment Pages
import PaymentPage from "./pages/PaymentPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/debug" element={<DebugPage />} />

        {/* Protected Routes - All Users */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Passenger Routes */}
        <Route
          path="/passenger/dashboard"
          element={
            <ProtectedRoute roles={["passenger"]}>
              <PassengerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/request-ride"
          element={
            <ProtectedRoute roles={["passenger"]}>
              <RequestRide />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/my-rides"
          element={
            <ProtectedRoute roles={["passenger"]}>
              <PassengerRides />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/ride/:rideRequestId/applications"
          element={
            <ProtectedRoute roles={["passenger"]}>
              <RideApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passenger/ride/:rideRequestId"
          element={
            <ProtectedRoute roles={["passenger"]}>
              <RideDetail />
            </ProtectedRoute>
          }
        />

        {/* Driver Routes */}
        <Route
          path="/driver/dashboard"
          element={
            <ProtectedRoute roles={["driver"]}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/available-rides"
          element={
            <ProtectedRoute roles={["driver"]}>
              <AvailableRides />
            </ProtectedRoute>
          }
        />
        <Route
          path="/driver/my-rides"
          element={
            <ProtectedRoute roles={["driver"]}>
              <DriverRides />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rides"
          element={
            <ProtectedRoute roles={["admin"]}>
              <ManageRides />
            </ProtectedRoute>
          }
        />

        {/* Payment Routes */}
        <Route
          path="/payment/:rideId"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div className="container mt-5">
              <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                  <h1 className="display-1">404</h1>
                  <h2>Page Not Found</h2>
                  <p>The page you're looking for doesn't exist.</p>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
