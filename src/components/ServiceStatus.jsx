import axios from "axios";
import { useEffect, useState } from "react";

const ServiceStatus = () => {
  const [services, setServices] = useState({
    userService: { status: "checking", url: "http://localhost:3001" },
    rideService: { status: "checking", url: "http://localhost:3002" },
    paymentService: { status: "checking", url: "http://localhost:3003" },
    adminService: { status: "checking", url: "http://localhost:3004" },
  });

  useEffect(() => {
    checkServices();
  }, []);

  const checkServices = async () => {
    const serviceChecks = Object.keys(services).map(async (serviceName) => {
      const service = services[serviceName];
      try {
        // Try to ping the health endpoint or base URL
        await axios.get(`${service.url}/health`, { timeout: 3000 });
        return { name: serviceName, status: "online" };
      } catch (error) {
        // If /health doesn't exist, try the base URL
        try {
          await axios.get(service.url, { timeout: 3000 });
          return { name: serviceName, status: "online" };
        } catch (secondError) {
          return { name: serviceName, status: "offline" };
        }
      }
    });

    try {
      const results = await Promise.all(serviceChecks);
      const updatedServices = { ...services };

      results.forEach((result) => {
        updatedServices[result.name].status = result.status;
      });

      setServices(updatedServices);
    } catch (error) {
      console.error("Error checking services:", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "online":
        return <span className="badge bg-success">Online</span>;
      case "offline":
        return <span className="badge bg-danger">Offline</span>;
      case "checking":
        return <span className="badge bg-warning">Checking...</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
  };

  const getServiceName = (key) => {
    const names = {
      userService: "User Service",
      rideService: "Ride Service",
      paymentService: "Payment Service",
      adminService: "Admin Service",
    };
    return names[key] || key;
  };

  const allOffline = Object.values(services).every(
    (service) => service.status === "offline"
  );

  if (allOffline) {
    return (
      <div
        className="alert alert-warning alert-dismissible fade show"
        role="alert"
      >
        <h6 className="alert-heading">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Backend Services Unavailable
        </h6>
        <p className="mb-2">
          All backend services appear to be offline. Please ensure the backend
          services are running:
        </p>
        <ul className="mb-2">
          <li>User Service on port 3001</li>
          <li>Ride Service on port 3002</li>
          <li>Payment Service on port 3003</li>
          <li>Admin Service on port 3004</li>
        </ul>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={checkServices}
        >
          <i className="fas fa-sync-alt me-1"></i>
          Retry Connection
        </button>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
        ></button>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-header bg-white py-2">
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">
            <i className="fas fa-server me-2 text-primary"></i>
            Service Status
          </h6>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={checkServices}
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
      <div className="card-body py-2">
        <div className="row g-2">
          {Object.entries(services).map(([key, service]) => (
            <div key={key} className="col-md-3">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">{getServiceName(key)}</small>
                {getStatusBadge(service.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceStatus;
