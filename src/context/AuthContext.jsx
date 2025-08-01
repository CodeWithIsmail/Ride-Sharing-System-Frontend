import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Verify token on app load
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:3001/api/users/verify"
          );
          setUser(response.data.user);
        } catch (error) {
          console.error("Token verification failed:", error);

          // If token is invalid or expired, clear it
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            console.log("Token expired or invalid, logging out...");
          } else if (
            error.code === "ERR_NETWORK" ||
            error.message.includes("Network Error")
          ) {
            console.log(
              "Backend service unavailable, keeping token for retry..."
            );
            // Don't logout on network errors, keep token for when backend comes back
            setLoading(false);
            return;
          }

          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token: newToken, user: userData } = response.data;

      setToken(newToken);
      setUser(userData);
      localStorage.setItem("token", newToken);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);

      // Check if it's a network error (backend not running)
      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("Network Error")
      ) {
        return {
          success: false,
          error:
            "Unable to connect to the server. Please make sure the backend services are running on port 3001.",
        };
      }

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        return {
          success: false,
          error:
            "Invalid email or password. Please check your credentials and try again.",
        };
      }

      return {
        success: false,
        error:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/register",
        userData
      );
      return {
        success: true,
        message: "Registration successful",
        data: response.data,
      };
    } catch (error) {
      console.error("Registration error:", error);

      // Check if it's a network error (backend not running)
      if (
        error.code === "ERR_NETWORK" ||
        error.message.includes("Network Error")
      ) {
        return {
          success: false,
          error:
            "Unable to connect to the server. Please make sure the backend services are running on port 3001.",
        };
      }

      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post("http://localhost:3001/api/auth/logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isPassenger: user?.role === "passenger",
    isDriver: user?.role === "driver",
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
