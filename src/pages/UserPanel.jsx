import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserPanel.css";
import {
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaHeart,
} from "react-icons/fa";
import api from "../api";
import defaultPGImg from "../assets/pg1.jpg";

const UserPanel = ({ onSave, onLogout }) => {
  const [activeSection, setActiveSection] = useState("basic-info");
  const [user, setUser] = useState({});
  const [draftUser, setDraftUser] = useState({});
  const [message, setMessage] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [animateSidebar, setAnimateSidebar] = useState(false);
  const [animateGreeting, setAnimateGreeting] = useState(false);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  const [bookedPGs, setBookedPGs] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    letter: false,
    number: false,
    symbol: false,
  });

  const [confirmValid, setConfirmValid] = useState(true);

  const [likedHostels, setLikedHostels] = useState([]);
  const [loadingLiked, setLoadingLiked] = useState(false);

  const navigate = useNavigate();

  // ✅ Helper for image full url
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";

    if (imagePath.startsWith("http")) return imagePath;

    if (imagePath.startsWith("/uploads")) {
      return `https://hlopg.com${imagePath}`;
    }

    return `https://hlopg.com/uploads/${imagePath}`;
  };

  // ✅ Fetch user
  useEffect(() => {
    const verifyAndFetchUser = async () => {
      const token = localStorage.getItem("hlopgToken");
      const owner = localStorage.getItem("hlopgOwner");
      const userStr = localStorage.getItem("hlopgUser");

      if (!token) {
        navigate("/RoleSelection");
        return;
      }

      if (owner) {
        navigate("/owner-dashboard");
        return;
      }

      // ✅ Load user from localStorage first
      if (userStr && userStr !== "undefined" && userStr !== "null") {
        try {
          const userData = JSON.parse(userStr);

          if (userData.profileImage) {
            userData.profileImage = getFullImageUrl(userData.profileImage);
          }

          setUser(userData);
          setDraftUser(userData);
          return;
        } catch (e) {
          console.error("❌ Error parsing user:", e);
        }
      }

      // ✅ If no local user, fetch from backend
      try {
        const userRes = await api.get("/auth/userid", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.status === 200) {
          const userData = userRes.data.data || userRes.data;

          if (userData.profileImage) {
            userData.profileImage = getFullImageUrl(userData.profileImage);
          }

          setUser(userData);
          setDraftUser(userData);

          // ✅ FIX: store ONLY userData
          localStorage.setItem("hlopgUser", JSON.stringify(userData));
        }
      } catch (fetchErr) {
        console.log("⚠️ Couldn't fetch user from backend");

        const fallbackUser = {
          name: "User",
          email: "user@example.com",
          phone: "",
          gender: "",
          userType: "USER",
          profileImage: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
        };

        setUser(fallbackUser);
        setDraftUser(fallbackUser);
      }
    };

    verifyAndFetchUser();
  }, [navigate]);

  // ✅ Fetch booked PGs
  useEffect(() => {
    const fetchBookedPGs = async () => {
      const token = localStorage.getItem("hlopgToken");
      if (!token) return;

      try {
        setLoadingBookings(true);

        const res = await api.get("/booking/user-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setBookedPGs(res.data.bookings || []);
        }
      } catch (error) {
        console.error("Failed to fetch booked PGs:", error);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookedPGs();
  }, []);

  // ✅ Fetch liked hostels
  useEffect(() => {
    const fetchLikedHostels = async () => {
      const token = localStorage.getItem("hlopgToken");
      if (!token) return;

      try {
        setLoadingLiked(true);

        const res = await api.get("/hostel/liked-hostels", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && Array.isArray(res.data.data)) {
          const processedLiked = res.data.data.map((hostel) => {
            let displayImage = defaultPGImg;

            if (hostel.img) {
              displayImage = getFullImageUrl(hostel.img);
            } else if (
              hostel.images &&
              Array.isArray(hostel.images) &&
              hostel.images.length > 0
            ) {
              displayImage = getFullImageUrl(hostel.images[0]);
            }

            return {
              ...hostel,
              displayImage,
              id: hostel.hostel_id || hostel.id,
              name: hostel.hostel_name || hostel.name || "Unnamed Hostel",
              location: hostel.area || hostel.city || hostel.address || "Unknown Location",
              rating: hostel.rating || "N/A",
              price: hostel.price || hostel.rent || "N/A",
              pg_type: hostel.pg_type || "Hostel",
            };
          });

          setLikedHostels(processedLiked);
        } else {
          setLikedHostels([]);
        }
      } catch (err) {
        console.error("❌ Error fetching liked hostels:", err);
        setLikedHostels([]);
      } finally {
        setLoadingLiked(false);
      }
    };

    if (activeSection === "liked-pg") {
      fetchLikedHostels();
    }
  }, [activeSection]);

  // ✅ FIXED PROFILE IMAGE UPLOAD
  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Instant preview
    const previewUrl = URL.createObjectURL(file);

    setDraftUser((prev) => ({ ...prev, profileImage: previewUrl }));
    setUser((prev) => ({ ...prev, profileImage: previewUrl }));

    try {
      const token = localStorage.getItem("hlopgToken");
      const formData = new FormData();
      formData.append("profileImage", file);

      const res = await api.post("/auth/update-profile-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        const updatedUser = res.data.data;

        // ✅ Ensure correct full URL
        const finalImageUrl = getFullImageUrl(updatedUser.profileImage);

        const finalUser = {
          ...user,
          ...updatedUser,
          profileImage: finalImageUrl,
        };

        setUser(finalUser);
        setDraftUser(finalUser);

        // ✅ FIX: store finalUser properly
        localStorage.setItem("hlopgUser", JSON.stringify(finalUser));

        setMessage("✅ Profile image updated!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Upload failed");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage("❌ Upload failed");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordMsg("All fields are required");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setPasswordMsg("");

      const token = localStorage.getItem("hlopgToken");

      const res = await api.put(
        "/auth/change-password",
        {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPasswordMsg(res.data.message || "Password updated successfully");

      setTimeout(() => {
        setPasswords({ current: "", new: "", confirm: "" });
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
      }, 500);
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setDraftUser({ ...draftUser, [field]: value });
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("hlopgToken");

      const payload = {
        name: draftUser.name,
        gender: draftUser.gender,
      };

      const res = await api.put("/auth/update-basic-info", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const updatedUser = res.data.data;

        if (updatedUser.profileImage) {
          updatedUser.profileImage = getFullImageUrl(updatedUser.profileImage);
        }

        setUser(updatedUser);
        setDraftUser(updatedUser);

        // ✅ save into localstorage
        localStorage.setItem("hlopgUser", JSON.stringify(updatedUser));

        setAnimateSidebar(true);
        setAnimateGreeting(true);

        if (onSave) onSave(updatedUser);

        setMessage("Changes saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to update user info:", error);
      setMessage("Failed to save changes");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  useEffect(() => {
    if (animateSidebar) {
      const timer = setTimeout(() => setAnimateSidebar(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animateSidebar]);

  useEffect(() => {
    if (animateGreeting) {
      const timer = setTimeout(() => setAnimateGreeting(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animateAnimateGreeting]);

  const openLogoutModal = () => {
    setShowLogoutModal(true);
    setModalClosing(false);
  };

  const closeLogoutModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setShowLogoutModal(false);
      setModalClosing(false);
    }, 300);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();

    localStorage.removeItem("hlopgToken");
    localStorage.removeItem("hlopgUser");
    localStorage.removeItem("hlopgOwner");

    navigate("/");
    closeLogoutModal();
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) closeLogoutModal();
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "new") {
        setPasswordRules({
          length: value.length >= 6,
          letter: /[a-zA-Z]/.test(value),
          number: /\d/.test(value),
          symbol: /[^a-zA-Z0-9]/.test(value),
        });

        setConfirmValid(updated.confirm === "" || value === updated.confirm);
      }

      if (field === "confirm") {
        setConfirmValid(value === updated.new);
      }

      return updated;
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case "basic-info":
        return (
          <>
            <h3>USER INFORMATION</h3>
            <div className="info-section">
              <div className="profile">
                <div className="profile-image">
                  <img
                    src={getFullImageUrl(draftUser.profileImage || user.profileImage)}
                    alt="Profile"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";
                    }}
                  />
                </div>

                <label htmlFor="profileUpload" className="change-btn">
                  Change
                </label>

                <input
                  type="file"
                  id="profileUpload"
                  accept="image/*"
                  onChange={handleProfileChange}
                  hidden
                />
              </div>

              <div className="info-form">
                {[
                  { label: "Name", field: "name", type: "text", editable: true },
                  { label: "Email", field: "email", type: "email", editable: false },
                  { label: "Mobile Number", field: "phone", type: "text", editable: false },
                  { label: "Gender", field: "gender", type: "text", editable: true },
                ].map((f, idx) => (
                  <div className="form-group" key={idx}>
                    <label>{f.label}</label>
                    <input
                      type={f.type}
                      value={draftUser[f.field] || ""}
                      disabled={!f.editable}
                      className={!f.editable ? "readonly" : ""}
                      onChange={(e) =>
                        f.editable && handleInputChange(f.field, e.target.value)
                      }
                    />
                  </div>
                ))}

                <button className="save-btn" onClick={handleSaveChanges}>
                  Save Changes
                </button>

                {message && <p className="save-message">{message}</p>}
              </div>
            </div>
          </>
        );

      case "liked-pg":
        return (
          <>
            <h3>LIKED PG'S LIST</h3>
            {loadingLiked ? (
              <p>Loading your liked hostels...</p>
            ) : likedHostels.length > 0 ? (
              <div className="liked-pg-container">
                {likedHostels.map((hostel) => (
                  <div
                    className="liked-pg-card"
                    key={hostel.id}
                    onClick={() => navigate(`/hostel/${hostel.id}`)}
                  >
                    <div className="liked-pg-img-container">
                      <img
                        src={hostel.displayImage}
                        alt={hostel.name}
                        className="liked-pg-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";
                        }}
                      />
                      <div className="liked-heart-btn liked-active">
                        <FaHeart />
                      </div>
                    </div>

                    <div className="liked-pg-info">
                      <h4>{hostel.name}</h4>
                      <p className="liked-location">{hostel.location}</p>

                      <div className="liked-row">
                        <FaStar className="liked-star" />
                        <span>{hostel.rating}</span>
                        <span>•</span>
                        <span>{hostel.pg_type}</span>
                      </div>

                      <p className="liked-price">₹{hostel.price} / month</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-liked-hostels">
                <p>You haven't liked any hostels yet.</p>
              </div>
            )}
          </>
        );

      default:
        return <h3>Coming Soon...</h3>;
    }
  };

  return (
    <>
      <div className="account-container">
        <div className="sidebar">
          <div className={`sidebar-greeting ${animateGreeting ? "fade-greeting" : ""}`}>
            Hello, {user?.name || "User"}!
          </div>

          {[
            { id: "basic-info", label: "Basic Information" },
            { id: "liked-pg", label: "Liked PG’s List" },
            { id: "payment-history", label: "Payment History" },
            { id: "change-password", label: "Change Password" },
            { id: "terms", label: "Terms and Conditions" },
          ].map((section) => (
            <button
              key={section.id}
              className={activeSection === section.id ? "active" : ""}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}

          <button className="logout" onClick={openLogoutModal}>
            Logout
          </button>
        </div>

        <div className="main-content">{renderSection()}</div>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className={`modal ${modalClosing ? "fade-out" : ""}`}>
            <button className="modal-close" onClick={closeLogoutModal}>
              <FaTimes />
            </button>

            <p style={{ fontSize: 20, marginTop: 30 }}>
              Are you sure you want to logout?
            </p>

            <div className="modal-actions">
              <button className="modal-cancel" onClick={closeLogoutModal}>
                Cancel
              </button>
              <button className="modal-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPanel;
