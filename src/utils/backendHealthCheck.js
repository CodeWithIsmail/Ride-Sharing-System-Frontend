import axios from "axios";

export const checkBackendHealth = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/health", {
      timeout: 5000, // 5 second timeout
    });
    return {
      status: "online",
      message: "Backend is running",
      data: response.data,
    };
  } catch (error) {
    console.error("Backend health check failed:", error);

    if (
      error.code === "ERR_NETWORK" ||
      error.message.includes("Network Error")
    ) {
      return {
        status: "offline",
        message: "Backend server is not running on port 3001",
        error: error.message,
      };
    }

    if (error.code === "ECONNABORTED") {
      return {
        status: "timeout",
        message: "Backend server is not responding (timeout)",
        error: error.message,
      };
    }

    return {
      status: "error",
      message: "Backend server error",
      error: error.message,
      status_code: error.response?.status,
    };
  }
};

// Simple test function to check all required endpoints
export const testAuthEndpoints = async () => {
  const endpoints = [
    {
      name: "Health Check",
      url: "http://localhost:3001/api/health",
      method: "GET",
    },
    {
      name: "Login Endpoint",
      url: "http://localhost:3001/api/auth/login",
      method: "POST",
    },
    {
      name: "Register Endpoint",
      url: "http://localhost:3001/api/auth/register",
      method: "POST",
    },
  ];

  const results = {};

  for (const endpoint of endpoints) {
    try {
      if (endpoint.method === "GET") {
        await axios.get(endpoint.url, { timeout: 3000 });
        results[endpoint.name] = "✅ Available";
      } else {
        // For POST endpoints, we expect them to respond even with bad data
        // A 400 or 422 error means the endpoint exists
        try {
          await axios.post(endpoint.url, {}, { timeout: 3000 });
          results[endpoint.name] = "✅ Available";
        } catch (error) {
          if (
            error.response &&
            [400, 401, 422].includes(error.response.status)
          ) {
            results[endpoint.name] =
              "✅ Available (responds with validation error as expected)";
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        results[endpoint.name] = "❌ Not reachable (server not running)";
      } else if (error.code === "ECONNABORTED") {
        results[endpoint.name] = "❌ Timeout";
      } else {
        results[endpoint.name] = `❌ Error: ${error.message}`;
      }
    }
  }

  return results;
};
