const express = require("express");
const cors = require("cors");

// Create multiple apps for different services
const userApp = express();
const rideApp = express();
const paymentApp = express();
const adminApp = express();

// Middleware
const setupApp = (app) => {
  app.use(cors());
  app.use(express.json());
};

[userApp, rideApp, paymentApp, adminApp].forEach(setupApp);

// Mock data
const users = [
  {
    _id: "60f7b3b3b3b3b3b3b3b3b3b1",
    name: "Test Passenger",
    email: "passenger@test.com",
    role: "passenger",
    isActive: true,
    createdAt: new Date("2023-01-01"),
  },
  {
    _id: "60f7b3b3b3b3b3b3b3b3b3b2",
    name: "Test Driver",
    email: "driver@test.com",
    role: "driver",
    isActive: true,
    createdAt: new Date("2023-01-01"),
  },
  {
    _id: "60f7b3b3b3b3b3b3b3b3b3b3",
    name: "Test Admin",
    email: "admin@test.com",
    role: "admin",
    isActive: true,
    createdAt: new Date("2023-01-01"),
  },
];

const rides = [
  {
    _id: "60f7b3b3b3b3b3b3b3b3b3r1",
    passengerId: "60f7b3b3b3b3b3b3b3b3b3b1",
    pickupLocation: "Downtown Mall",
    dropoffLocation: "Airport Terminal",
    targetTime: new Date(Date.now() + 86400000), // Tomorrow
    seatsNeeded: 2,
    desiredFare: 45,
    status: "posted",
    createdAt: new Date(),
  },
  {
    _id: "60f7b3b3b3b3b3b3b3b3b3r2",
    passengerId: "60f7b3b3b3b3b3b3b3b3b3b1",
    pickupLocation: "University Campus",
    dropoffLocation: "City Center",
    targetTime: new Date(Date.now() + 172800000), // Day after tomorrow
    seatsNeeded: 1,
    desiredFare: 25,
    status: "confirmed",
    driverId: "60f7b3b3b3b3b3b3b3b3b3b2",
    createdAt: new Date(),
  },
];

const applications = [
  {
    _id: "60f7b3b3b3b3b3b3b3b3a1",
    rideId: "60f7b3b3b3b3b3b3b3b3b3r1",
    driverId: "60f7b3b3b3b3b3b3b3b3b3b2",
    status: "pending",
    message: "I can pick you up at the specified time.",
    appliedAt: new Date(),
  },
];

// USER SERVICE (Port 3001)
userApp.get("/health", (req, res) => {
  res.json({ status: "OK", service: "User Service" });
});

userApp.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Simple mock authentication
  const user = users.find((u) => u.email === email);

  if (user && password === "password123") {
    res.json({
      success: true,
      token: "mock-jwt-token-" + user._id,
      user: user,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
});

userApp.post("/api/auth/register", (req, res) => {
  const { name, email, role, password } = req.body;

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const newUser = {
    _id: "new-user-" + Date.now(),
    name,
    email,
    role: role || "passenger",
    isActive: true,
    createdAt: new Date(),
  };

  users.push(newUser);

  res.json({
    success: true,
    message: "User registered successfully",
    user: newUser,
  });
});

userApp.get("/api/users/verify", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token && token.startsWith("mock-jwt-token-")) {
    const userId = token.replace("mock-jwt-token-", "");
    const user = users.find((u) => u._id === userId);

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  } else {
    res.status(401).json({ success: false, message: "No token provided" });
  }
});

userApp.post("/api/auth/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

// RIDE SERVICE (Port 3002)
rideApp.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Ride Service" });
});

rideApp.get("/api/rides", (req, res) => {
  const { status, passengerId, driverId } = req.query;
  let filteredRides = [...rides];

  if (status) {
    filteredRides = filteredRides.filter((r) => r.status === status);
  }
  if (passengerId) {
    filteredRides = filteredRides.filter((r) => r.passengerId === passengerId);
  }
  if (driverId) {
    filteredRides = filteredRides.filter((r) => r.driverId === driverId);
  }

  res.json({ success: true, rides: filteredRides });
});

rideApp.post("/api/rides", (req, res) => {
  const newRide = {
    _id: "ride-" + Date.now(),
    ...req.body,
    status: "posted",
    createdAt: new Date(),
  };

  rides.push(newRide);
  res.json({ success: true, ride: newRide });
});

rideApp.get("/api/rides/:id/applications", (req, res) => {
  const rideApplications = applications.filter(
    (a) => a.rideId === req.params.id
  );
  res.json({ success: true, applications: rideApplications });
});

rideApp.post("/api/rides/:id/apply", (req, res) => {
  const newApplication = {
    _id: "app-" + Date.now(),
    rideId: req.params.id,
    driverId: req.body.driverId,
    status: "pending",
    message: req.body.message || "",
    appliedAt: new Date(),
  };

  applications.push(newApplication);
  res.json({ success: true, application: newApplication });
});

rideApp.put("/api/applications/:id/status", (req, res) => {
  const application = applications.find((a) => a._id === req.params.id);
  if (application) {
    application.status = req.body.status;

    // If approved, update ride status
    if (req.body.status === "approved") {
      const ride = rides.find((r) => r._id === application.rideId);
      if (ride) {
        ride.status = "confirmed";
        ride.driverId = application.driverId;
      }
    }

    res.json({ success: true, application });
  } else {
    res.status(404).json({ success: false, message: "Application not found" });
  }
});

// PAYMENT SERVICE (Port 3003)
paymentApp.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Payment Service" });
});

paymentApp.post("/api/payments", (req, res) => {
  const payment = {
    _id: "payment-" + Date.now(),
    rideId: req.body.rideId,
    amount: req.body.amount,
    paymentMethod: req.body.paymentMethod,
    status: "completed",
    transactionId: "txn-" + Date.now(),
    processedAt: new Date(),
  };

  res.json({ success: true, payment });
});

paymentApp.post("/api/payments/:id/receipt", (req, res) => {
  res.json({
    success: true,
    receipt: {
      receiptId: "receipt-" + Date.now(),
      paymentId: req.params.id,
      generatedAt: new Date(),
    },
  });
});

// ADMIN SERVICE (Port 3004)
adminApp.get("/health", (req, res) => {
  res.json({ status: "OK", service: "Admin Service" });
});

adminApp.get("/api/admin/users", (req, res) => {
  res.json({ success: true, users });
});

adminApp.get("/api/admin/rides", (req, res) => {
  res.json({ success: true, rides });
});

adminApp.patch("/api/admin/users/:id/status", (req, res) => {
  const user = users.find((u) => u._id === req.params.id);
  if (user) {
    user.isActive = req.body.isActive;
    res.json({ success: true, user });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

adminApp.delete("/api/admin/users/:id", (req, res) => {
  const index = users.findIndex((u) => u._id === req.params.id);
  if (index !== -1) {
    users.splice(index, 1);
    res.json({ success: true, message: "User deleted" });
  } else {
    res.status(404).json({ success: false, message: "User not found" });
  }
});

// Start servers
const ports = [
  { app: userApp, port: 3001, name: "User Service" },
  { app: rideApp, port: 3002, name: "Ride Service" },
  { app: paymentApp, port: 3003, name: "Payment Service" },
  { app: adminApp, port: 3004, name: "Admin Service" },
];

ports.forEach(({ app, port, name }) => {
  app.listen(port, () => {
    console.log(`🚀 ${name} running on http://localhost:${port}`);
  });
});

console.log("\n📱 Mock Backend Services Started!");
console.log("🔐 Test Credentials:");
console.log("   Passenger: passenger@test.com / password123");
console.log("   Driver: driver@test.com / password123");
console.log("   Admin: admin@test.com / password123");
console.log("\n⚠️  This is a mock server for development only!");
console.log("   Replace with actual backend services for production.\n");
