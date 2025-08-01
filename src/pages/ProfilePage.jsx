import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // In a real app, you'd make an API call here to update the profile
    setIsEditing(false);
    // Show success message
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "passenger":
        return "fas fa-user";
      case "driver":
        return "fas fa-car";
      case "admin":
        return "fas fa-crown";
      default:
        return "fas fa-user";
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "passenger":
        return "bg-primary";
      case "driver":
        return "bg-success";
      case "admin":
        return "bg-warning";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-header bg-primary text-white text-center py-4 rounded-top-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle mb-3"
                style={{ width: "100px", height: "100px" }}
              >
                <i
                  className={`${getRoleIcon(user?.role)} text-primary`}
                  style={{ fontSize: "3rem" }}
                ></i>
              </div>
              <h2 className="fw-bold mb-1">{user?.name}</h2>
              <span
                className={`badge ${getRoleBadgeClass(
                  user?.role
                )} fs-6 px-3 py-2`}
              >
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
            </div>

            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Profile Information</h4>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <i
                    className={`fas ${isEditing ? "fa-times" : "fa-edit"} me-2`}
                  ></i>
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-user me-2 text-muted"></i>
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="form-control form-control-lg bg-light">
                      {user?.name}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-envelope me-2 text-muted"></i>
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  ) : (
                    <div className="form-control form-control-lg bg-light">
                      {user?.email}
                    </div>
                  )}
                </div>

                {user?.role === "driver" && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-phone me-2 text-muted"></i>
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        className="form-control form-control-lg"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="form-control form-control-lg bg-light">
                        {user?.phone || "Not provided"}
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-calendar me-2 text-muted"></i>
                    Member Since
                  </label>
                  <div className="form-control form-control-lg bg-light">
                    {new Date(
                      user?.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </div>
                </div>

                {isEditing && (
                  <div className="d-grid gap-2 mb-3">
                    <button type="submit" className="btn btn-primary btn-lg">
                      <i className="fas fa-save me-2"></i>
                      Save Changes
                    </button>
                  </div>
                )}
              </form>

              <hr className="my-4" />

              <div className="d-grid">
                <button
                  className="btn btn-outline-danger btn-lg"
                  onClick={logout}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
