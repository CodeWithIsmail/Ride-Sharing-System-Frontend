import axios from "axios";

// Base URLs for different services
const USER_SERVICE_URL = "http://localhost:3001/api";
const RIDE_SERVICE_URL = "http://localhost:3002/api";
const PAYMENT_SERVICE_URL = "http://localhost:3003/api";
const ADMIN_SERVICE_URL = "http://localhost:3004/api";

// User Service APIs
export const userService = {
  login: async (email, password) => {
    const response = await axios.post(`${USER_SERVICE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post(
      `${USER_SERVICE_URL}/auth/register`,
      userData
    );
    return response.data;
  },

  logout: async () => {
    const response = await axios.post(`${USER_SERVICE_URL}/auth/logout`);
    return response.data;
  },

  verifyToken: async () => {
    const response = await axios.get(`${USER_SERVICE_URL}/users/verify`);
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await axios.get(`${USER_SERVICE_URL}/users/${userId}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axios.put(
      `${USER_SERVICE_URL}/users/profile`,
      profileData
    );
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await axios.put(
      `${USER_SERVICE_URL}/users/password`,
      passwordData
    );
    return response.data;
  },
};

// Ride Service APIs
export const rideService = {
  createRide: async (rideData) => {
    const response = await axios.post(`${RIDE_SERVICE_URL}/rides`, rideData);
    return response.data;
  },

  getRides: async (status = "") => {
    const response = await axios.get(
      `${RIDE_SERVICE_URL}/rides${status ? `?status=${status}` : ""}`
    );
    return response.data;
  },

  applyForRide: async (rideRequestId) => {
    const response = await axios.post(
      `${RIDE_SERVICE_URL}/rides/${rideRequestId}/apply`
    );
    return response.data;
  },

  getRideApplications: async (rideRequestId) => {
    const response = await axios.get(
      `${RIDE_SERVICE_URL}/rides/${rideRequestId}/applications`
    );
    return response.data;
  },

  selectDriver: async (rideRequestId, driverId) => {
    const response = await axios.post(
      `${RIDE_SERVICE_URL}/rides/${rideRequestId}/select`,
      { driverId }
    );
    return response.data;
  },

  cancelRide: async (rideRequestId) => {
    const response = await axios.post(
      `${RIDE_SERVICE_URL}/rides/${rideRequestId}/cancel`
    );
    return response.data;
  },

  completeRide: async (rideRequestId) => {
    const response = await axios.post(
      `${RIDE_SERVICE_URL}/rides/${rideRequestId}/complete`
    );
    return response.data;
  },
};

// Payment Service APIs
export const paymentService = {
  recordPayment: async (rideRequestId, amount) => {
    const response = await axios.post(
      `${PAYMENT_SERVICE_URL}/payments/${rideRequestId}`,
      { amount }
    );
    return response.data;
  },

  generateReceipt: async (paymentId) => {
    const response = await axios.post(
      `${PAYMENT_SERVICE_URL}/payments/${paymentId}/receipt`
    );
    return response.data;
  },
};

// Admin Service APIs
export const adminService = {
  getAllUsers: async () => {
    const response = await axios.get(`${ADMIN_SERVICE_URL}/admin/users`);
    return response.data;
  },

  updateUserStatus: async (userId, statusData) => {
    const response = await axios.patch(
      `${ADMIN_SERVICE_URL}/admin/users/${userId}/status`,
      statusData
    );
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axios.delete(
      `${ADMIN_SERVICE_URL}/admin/users/${userId}`
    );
    return response.data;
  },

  getAllRides: async (status = "") => {
    const response = await axios.get(
      `${ADMIN_SERVICE_URL}/admin/rides${status ? `?status=${status}` : ""}`
    );
    return response.data;
  },

  updateRideStatus: async (rideId, statusData) => {
    const response = await axios.patch(
      `${ADMIN_SERVICE_URL}/admin/rides/${rideId}/status`,
      statusData
    );
    return response.data;
  },

  deleteRide: async (rideId) => {
    const response = await axios.delete(
      `${ADMIN_SERVICE_URL}/admin/rides/${rideId}`
    );
    return response.data;
  },
};
