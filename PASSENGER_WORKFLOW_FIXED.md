# Passenger Workflow - Complete Guide

## Overview

The passenger system has been completely fixed to work with the correct API endpoints and field names. Here's the complete workflow:

## ✅ Fixed Issues

### 1. **API Field Names**

- **User ID**: Now correctly uses `userId` (not `_id` or `id`)
- **Ride ID**: Now correctly uses `rideRequestId` (not `_id` or `id`)
- **Response Format**: Handles direct array responses from API
- **Navigation**: All links use correct `rideRequestId`

### 2. **API Response Handling**

- **GET /rides**: Returns direct array for passengers (no `.data` or `.rides` wrapper)
- **Passenger Filtering**: Backend already filters, no frontend filtering needed
- **Sorting**: Uses `targetTime` for chronological order

## 🔄 Complete Passenger Workflow

### Step 1: Registration & Login

```
POST http://localhost:3001/api/auth/register
Body: {
  "name": "Passenger 1",
  "email": "passenger1@example.com",
  "password": "passenger1",
  "role": "passenger"
}
Response: {
  "userId": "688d37d2435f612b9bc5a8ba",
  "email": "passenger1@example.com",
  "name": "Passenger 1",
  "role": "passenger"
}

POST http://localhost:3001/api/auth/login
Body: {
  "email": "passenger1@example.com",
  "password": "passenger1"
}
Response: {
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "688d37d2435f612b9bc5a8ba",
  "role": "passenger"
}
```

### Step 2: Create Ride Request

```
POST http://localhost:3002/api/rides
Headers: Authorization: Bearer <token>
Body: {
  "pickupLocation": "Dhaka University, Dhaka",
  "dropoffLocation": "Mirpur 10, Dhaka",
  "targetTime": "2024-01-15T10:00:00.000Z",
  "desiredFare": 150
}
Response: {
  "rideRequestId": "688d58e4fa37c0f353d2bbac",
  "pickupLocation": "Dhaka University, Dhaka",
  "dropoffLocation": "Mirpur 10, Dhaka",
  "targetTime": "2024-01-15T10:00:00.000Z",
  "desiredFare": 150
}
```

### Step 3: View My Rides

```
GET http://localhost:3002/api/rides
Headers: Authorization: Bearer <token>
Response: [
  {
    "rideRequestId": "688d58e4fa37c0f353d2bbac",
    "pickupLocation": "Dhaka University, Dhaka",
    "dropoffLocation": "Mirpur 10, Dhaka",
    "targetTime": "2024-01-15T10:00:00.000Z",
    "desiredFare": 150,
    "passengerId": "688d37d2435f612b9bc5a8ba",
    "passengerName": "Passenger 1"
  }
]
```

### Step 4: View Applications

```
GET http://localhost:3002/api/rides/{rideRequestId}/applications
Headers: Authorization: Bearer <token>
Response: {
  "applications": [
    {
      "driverId": "688d...",
      "appliedAt": "2024-01-15T09:00:00.000Z"
    }
  ]
}
```

### Step 5: Select Driver

```
POST http://localhost:3002/api/rides/{rideRequestId}/select
Headers: Authorization: Bearer <token>
Body: {
  "driverId": "688d..."
}
```

### Step 6: Complete Payment

```
POST http://localhost:3003/api/payments/{rideRequestId}
Headers: Authorization: Bearer <token>
Body: {
  "amount": 150
}

POST http://localhost:3003/api/payments/{paymentId}/receipt
Headers: Authorization: Bearer <token>
```

## 🔧 Fixed Components

### 1. **PassengerDashboard.jsx**

- ✅ Correct API response handling (direct array)
- ✅ Proper statistics calculation
- ✅ Navigation links use `rideRequestId`

### 2. **PassengerRides.jsx**

- ✅ Direct array handling from API
- ✅ No unnecessary filtering (backend handles it)
- ✅ All buttons use `rideRequestId`
- ✅ Proper sorting by `targetTime`

### 3. **RideApplications.jsx**

- ✅ Correct ride lookup by `rideRequestId`
- ✅ Proper driver selection flow
- ✅ Enhanced error handling and fallbacks

### 4. **RequestRide.jsx**

- ✅ Correct API format for ride creation
- ✅ Proper navigation after success

### 5. **PaymentPage.jsx**

- ✅ Integration with actual ride data
- ✅ Fallback for missing ride information

### 6. **apiService.js**

- ✅ Added `getRideById` method
- ✅ Correct endpoint handling

## 🎯 User Journey Flow

1. **Login/Register** → Dashboard
2. **Dashboard** → "Request a Ride" → RequestRide Page
3. **RequestRide** → Submit → "My Rides" Page
4. **My Rides** → "View Applications" → RideApplications Page
5. **RideApplications** → Select Driver → Back to "My Rides"
6. **My Rides** → "Record Payment" → PaymentPage
7. **PaymentPage** → Submit → Back to "My Rides" with success

## 🔍 Status Flow

- **posted** → Looking for drivers (can view applications, cancel)
- **confirmed** → Driver selected (can record payment)
- **completed** → Ride finished (view receipt)
- **cancelled** → Ride cancelled

## 📱 Navigation Routes

- `/passenger/dashboard` - Main dashboard
- `/passenger/request-ride` - Create new ride
- `/passenger/my-rides` - View all rides
- `/passenger/ride/{rideRequestId}/applications` - View applications
- `/payment/{rideRequestId}` - Record payment

## ✅ All API Calls Working

The system now correctly handles:

- ✅ User registration/login with proper field names
- ✅ Ride creation and listing
- ✅ Application viewing and driver selection
- ✅ Payment recording and receipt generation
- ✅ Proper error handling and fallbacks
- ✅ Correct navigation between pages

## 🎉 Ready to Test

The passenger workflow is now fully functional and ready for testing with the backend APIs!
