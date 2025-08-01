import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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

  // Logout function (defined early to avoid reference issues)
  const logout = useCallback(async () => {
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
  }, [token]);

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

          console.log("Token verification response:", response.data);

          // Handle different possible response structures for verification
          let userData = null;
          if (response.data.user) {
            userData = response.data.user;
          } else {
            // If user data is directly in response
            userData = response.data;
          }

          setUser(userData);
        } catch (error) {
          console.error("Token verification failed:", error);

          // If token is invalid or expired, clear it
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            console.log("Token expired or invalid, logging out...");
            logout();
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
          } else {
            // For other errors, also logout
            logout();
          }
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token, logout]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("Login response:", response.data);

      const { token: newToken, userId, role } = response.data;

      // Validate that we have the required data
      if (!newToken) {
        throw new Error("No token received from server");
      }

      if (!userId) {
        throw new Error("No userId received from server");
      }

      if (!role) {
        throw new Error("No role received from server");
      }

      // Create user object from login response
      const userData = {
        userId,
        role,
        email, // We know the email from the login request
      };

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

      // Handle other HTTP errors
      if (error.response) {
        return {
          success: false,
          error:
            error.response?.data?.message ||
            `Server error (${error.response.status}). Please try again.`,
        };
      }

      return {
        success: false,
        error: "Login failed. Please try again.",
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

      // Handle validation errors (400)
      if (error.response?.status === 400) {
        return {
          success: false,
          error:
            error.response?.data?.message ||
            "Invalid data provided. Please check your information.",
        };
      }

      // Handle conflict errors (409) - user already exists
      if (error.response?.status === 409) {
        return {
          success: false,
          error:
            "An account with this email already exists. Please use a different email or try logging in.",
        };
      }

      // Handle other HTTP errors
      if (error.response) {
        return {
          success: false,
          error:
            error.response?.data?.message ||
            `Server error (${error.response.status}). Please try again.`,
        };
      }

      return {
        success: false,
        error: "Registration failed. Please try again.",
      };
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
