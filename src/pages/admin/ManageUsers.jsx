import { useEffect, useState } from "react";
import { adminService } from "../../services/apiService";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.includes(searchTerm)
      );
    }

    // Filter by role
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => {
        if (statusFilter === "active") return user.isActive !== false;
        if (statusFilter === "inactive") return user.isActive === false;
        return true;
      });
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (userId, action) => {
    try {
      setActionLoading(true);

      switch (action) {
        case "activate":
          await adminService.updateUserStatus(userId, { isActive: true });
          break;
        case "deactivate":
          await adminService.updateUserStatus(userId, { isActive: false });
          break;
        case "delete":
          if (
            window.confirm(
              "Are you sure you want to delete this user? This action cannot be undone."
            )
          ) {
            await adminService.deleteUser(userId);
          } else {
            return;
          }
          break;
        default:
          return;
      }

      await fetchUsers();
      setShowUserModal(false);
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      alert(`Failed to ${action} user. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { class: "bg-danger", text: "Admin", icon: "fa-user-shield" },
      driver: { class: "bg-success", text: "Driver", icon: "fa-car" },
      passenger: { class: "bg-primary", text: "Passenger", icon: "fa-user" },
    };

    const config = roleConfig[role] || {
      class: "bg-secondary",
      text: role,
      icon: "fa-user",
    };

    return (
      <span
        className={`badge ${config.class} text-white d-inline-flex align-items-center`}
      >
        <i className={`fas ${config.icon} me-1`}></i>
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span
        className={`badge ${
          isActive !== false ? "bg-success" : "bg-secondary"
        } text-white`}
      >
        {isActive !== false ? "Active" : "Inactive"}
      </span>
    );
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="display-6 fw-bold text-primary">Manage Users</h1>
          <p className="lead text-muted">
            Monitor and manage user accounts on your platform
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="fw-bold text-primary">{users.length}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="fw-bold text-info">
                {users.filter((u) => u.role === "passenger").length}
              </h3>
              <p className="text-muted mb-0">Passengers</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="fw-bold text-success">
                {users.filter((u) => u.role === "driver").length}
              </h3>
              <p className="text-muted mb-0">Drivers</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h3 className="fw-bold text-warning">
                {users.filter((u) => u.isActive !== false).length}
              </h3>
              <p className="text-muted mb-0">Active Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Search Users</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Filter by Role</label>
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="passenger">Passengers</option>
                <option value="driver">Drivers</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label fw-semibold">Filter by Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">&nbsp;</label>
              <button
                className="btn btn-outline-secondary w-100"
                onClick={fetchUsers}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">
              User List ({filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "user" : "users"})
            </h5>
          </div>
        </div>
        <div className="card-body p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-users text-muted fs-1 mb-3"></i>
              <h5 className="text-muted">No users found</h5>
              <p className="text-muted mb-0">
                {searchTerm || roleFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No users have registered yet"}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0 px-4 py-3">User</th>
                    <th className="border-0 px-4 py-3">Contact</th>
                    <th className="border-0 px-4 py-3">Role</th>
                    <th className="border-0 px-4 py-3">Status</th>
                    <th className="border-0 px-4 py-3">Joined</th>
                    <th className="border-0 px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ width: "40px", height: "40px" }}
                          >
                            <span className="text-white fw-bold">
                              {user.name
                                ? user.name.charAt(0).toUpperCase()
                                : "U"}
                            </span>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-semibold">
                              {user.name || "N/A"}
                            </h6>
                            <small className="text-muted">
                              ID: {user._id.slice(-8)}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="fw-semibold">{user.email}</div>
                          <small className="text-muted">
                            {user.phone || "No phone"}
                          </small>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getRoleBadge(user.role)}</td>
                      <td className="px-4 py-3">
                        {getStatusBadge(user.isActive)}
                      </td>
                      <td className="px-4 py-3">
                        <small className="text-muted">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </small>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => openUserModal(user)}
                        >
                          <i className="fas fa-cog me-1"></i>
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Management Modal */}
      {showUserModal && selectedUser && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user-cog me-2"></i>
                  Manage User: {selectedUser.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUserModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* User Details */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="fw-bold text-primary mb-3">
                      User Information
                    </h6>
                    <div className="mb-2">
                      <strong>Name:</strong> {selectedUser.name || "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Email:</strong> {selectedUser.email}
                    </div>
                    <div className="mb-2">
                      <strong>Phone:</strong> {selectedUser.phone || "N/A"}
                    </div>
                    <div className="mb-2">
                      <strong>Role:</strong> {getRoleBadge(selectedUser.role)}
                    </div>
                    <div className="mb-2">
                      <strong>Status:</strong>{" "}
                      {getStatusBadge(selectedUser.isActive)}
                    </div>
                    <div className="mb-2">
                      <strong>Joined:</strong>{" "}
                      {selectedUser.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold text-primary mb-3">
                      Account Statistics
                    </h6>
                    <div className="mb-2">
                      <strong>User ID:</strong>{" "}
                      <span className="font-monospace">{selectedUser._id}</span>
                    </div>
                    <div className="mb-2">
                      <strong>Last Updated:</strong>{" "}
                      {selectedUser.updatedAt
                        ? new Date(selectedUser.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex gap-2 justify-content-center">
                  {selectedUser.isActive !== false ? (
                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        handleUserAction(selectedUser._id, "deactivate")
                      }
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : (
                        <i className="fas fa-user-slash me-2"></i>
                      )}
                      Deactivate User
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={() =>
                        handleUserAction(selectedUser._id, "activate")
                      }
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : (
                        <i className="fas fa-user-check me-2"></i>
                      )}
                      Activate User
                    </button>
                  )}

                  <button
                    className="btn btn-danger"
                    onClick={() => handleUserAction(selectedUser._id, "delete")}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <span className="spinner-border spinner-border-sm me-2"></span>
                    ) : (
                      <i className="fas fa-trash me-2"></i>
                    )}
                    Delete User
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowUserModal(false)}
                  disabled={actionLoading}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
