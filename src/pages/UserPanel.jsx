import React, { useState } from "react";
import "./UserDashboard.css";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle, FaHeart, FaMoneyBillWave, FaLock } from "react-icons/fa";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("basic");

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <h2 className="dashboard-title">
          Hello, <span>{user?.name || "User"}!</span>
        </h2>

        <button
          className={`sidebar-btn ${activeTab === "basic" ? "active" : ""}`}
          onClick={() => setActiveTab("basic")}
        >
          <FaUserCircle className="sidebar-icon" />
          Basic Information
        </button>

        <button
          className={`sidebar-btn ${activeTab === "liked" ? "active" : ""}`}
          onClick={() => setActiveTab("liked")}
        >
          <FaHeart className="sidebar-icon" />
          Liked PG's List
        </button>

        <button
          className={`sidebar-btn ${activeTab === "payment" ? "active" : ""}`}
          onClick={() => setActiveTab("payment")}
        >
          <FaMoneyBillWave className="sidebar-icon" />
          Payment History
        </button>

        <button
          className={`sidebar-btn ${activeTab === "password" ? "active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          <FaLock className="sidebar-icon" />
          Change Password
        </button>

        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {activeTab === "basic" && (
          <div className="tab-box">
            <h2>USER INFORMATION</h2>

            <div className="profile-box">
              <div className="profile-image-wrapper">
                <img
                  src={
                    user?.profileImage
                      ? `https://www.hlopg.com/${user.profileImage}`
                      : "/default-user.png"
                  }
                  alt="Profile"
                  className="profile-image"
                />
              </div>

              <button className="profile-change-btn">Change</button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input type="text" defaultValue={user?.name || ""} />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="text" defaultValue={user?.email || ""} />
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <input type="text" defaultValue={user?.phone || ""} />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <input type="text" defaultValue={user?.gender || ""} />
              </div>
            </div>

            <button className="save-btn">Save Changes</button>
          </div>
        )}

        {activeTab === "liked" && (
          <div className="tab-box">
            <h2>Liked PG's List</h2>
            <p>No liked PGs yet.</p>
          </div>
        )}

        {activeTab === "payment" && (
          <div className="tab-box">
            <h2>Payment History</h2>
            <p>No payment history available.</p>
          </div>
        )}

        {activeTab === "password" && (
          <div className="tab-box">
            <h2>Change Password</h2>
            <p>Password section coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
