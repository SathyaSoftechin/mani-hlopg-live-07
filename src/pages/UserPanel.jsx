import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserPanel.css";
import { FaPlus, FaTimes, FaEye, FaEyeSlash,FaStar,FaHeart,
  FaHome, 
  FaUserFriends, 
  FaCalendarAlt, 
  FaCheck, 
  FaCheckDouble, 
  FaClock,
  FaExclamationTriangle 
 } from "react-icons/fa";
 import { FaMapMarkerAlt } from "react-icons/fa";
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

  

useEffect(() => {
  const verifyAndFetchUser = async () => {
    const token = localStorage.getItem("hlopgToken");
    const owner = localStorage.getItem("hlopgOwner");
    const userStr = localStorage.getItem("hlopgUser");
    
    console.log("🔍 UserPanel - localStorage DEBUG:");
    console.log("🔑 Token:", token);
    console.log("👑 Owner:", owner);
    console.log("👤 User string:", userStr);
    console.log("👤 User type:", typeof userStr);
    
    // Check ALL localStorage items
    console.log("📦 ALL localStorage items:");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`  ${key}: ${value}`);
    }
    
    if (!token) {
      console.log("❌ No token, redirecting to RoleSelection");
      navigate("/RoleSelection");
      return;
    }
    
    if (owner) {
      console.log("👑 Owner detected, redirecting to owner dashboard");
      navigate("/owner-dashboard");
      return;
    }
    
    // Check if user data exists
    if (userStr && userStr !== "undefined" && userStr !== "null") {
      try {
        const userData = JSON.parse(userStr);
        console.log("✅ Parsed user from localStorage:", userData);
        console.log("✅ User name:", userData.name);
        setUser(userData);
        setDraftUser(userData);
      } catch (e) {
        console.error("❌ Error parsing user:", e);
      }
    } else {
      console.log("⚠️ No valid user data in localStorage");
      
      // Try to fetch user from backend
      try {
        console.log("🔄 Trying to fetch user from /auth/userid");
        const userRes = await api.get("/auth/userid", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (userRes.status === 200) {
          console.log("✅ Fetched user from backend:");
          const userData = userRes.data.data || userRes.data;

           if (userData.profileImage && !userData.profileImage.startsWith('http')) {
    userData.profileImage = `https://hlopg.com${userData.profileImage}`;
  }
          setUser(userData);
          setDraftUser(userData);
          // Save to localStorage for next time
          localStorage.setItem("hlopgUser", JSON.stringify(userRes.data));
        }
      } catch (fetchErr) {
        console.log("⚠️ Couldn't fetch user from backend");
        console.log("⚠️ Error:", fetchErr.message);
        
        // Create fallback user
        const fallbackUser = {
          name: "User",
          email: "user@example.com",
          phone: "",
          gender: "",
          userType: "USER"
        };
        setUser(fallbackUser);
        setDraftUser(fallbackUser);
      }
    }
  };

  verifyAndFetchUser();
}, [navigate]);

  useEffect(() => {
    const fetchBookedPGs = async () => {
      const token = localStorage.getItem("hlopgToken");
      if (!token) return;

      try {
        setLoadingBookings(true);

        const res = await api.get("/booking/user-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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


// Fetch liked hostels
useEffect(() => {
  const fetchLikedHostels = async () => {
    const token = localStorage.getItem("hlopgToken");
    if (!token) {
      console.log("No token, cannot fetch liked hostels");
      return;
    }

    try {
      setLoadingLiked(true);
      console.log("Fetching liked hostels from API...");

      const res = await api.get("/hostel/liked-hostels", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Liked hostels API response:", res.data);
      
      if (res.data.success && Array.isArray(res.data.data)) {
        // Process images for liked hostels
        const processedLiked = res.data.data.map(hostel => {
          // Get the first image
          let displayImage = defaultPGImg;
          
          if (hostel.img) {
            displayImage = getFullImageUrl(hostel.img);
          } else if (hostel.images && Array.isArray(hostel.images) && hostel.images.length > 0) {
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
            pg_type: hostel.pg_type || "Hostel"
          };
        });
        
        setLikedHostels(processedLiked);
        console.log("✅ Processed liked hostels:", processedLiked);
      } else {
        console.log("⚠️ No liked hostels data from API");
        setLikedHostels([]);
      }
    } catch (err) {
      console.error("❌ Error fetching liked hostels:", err);
      console.error("Error details:", err.response?.data);
      setLikedHostels([]);
    } finally {
      setLoadingLiked(false);
    }
  };

  // Fetch liked hostels when activeSection changes to "liked-pg"
  if (activeSection === "liked-pg") {
    fetchLikedHostels();
  }
}, [activeSection]);

// Add this helper function to UserPanel.js for consistent image URLs
const getFullImageUrl = (imagePath) => {
  if (!imagePath) return defaultPGImg; // Now defaultPGImg is defined
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/uploads')) {
    return `https://hlopg.com${imagePath}`;
  }
  
  if (imagePath) {
    return `https://hlopg.com/uploads/${imagePath}`;
  }
  
  return defaultPGImg; // This will now work
};

  const handleProfileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  // Create temporary preview
  const previewUrl = URL.createObjectURL(file);
  setDraftUser({ ...draftUser, profileImage: previewUrl });
  setUser({ ...user, profileImage: previewUrl }); 
  
  try {
    // ✅ Use POST not PUT
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
      
      // Ensure full URL
      let profileImageUrl = updatedUser.profileImage;
      if (profileImageUrl && !profileImageUrl.startsWith('http')) {
        profileImageUrl = `https://hlopg.com${profileImageUrl}`;
      }
      
      // 2. Update states with real URL
      setUser({ ...user, profileImage: profileImageUrl });
      setDraftUser({ ...draftUser, profileImage: profileImageUrl });
      
      // 3. Update localStorage immediately
      const currentUser = JSON.parse(localStorage.getItem("hlopgUser") || "{}");
      const mergedUser = { ...currentUser, profileImage: profileImageUrl };
      localStorage.setItem("hlopgUser", JSON.stringify(mergedUser));
      
      setMessage("Profile image updated!");
      setTimeout(() => setMessage(""), 3000);
    }
  } catch (error) {
    console.error("Upload failed:", error);
    setMessage("Upload failed");
    setTimeout(() => setMessage(""), 3000);
  }
};
    
//     if (res.data.success) {
//       const updatedUser = res.data.data;
      
//       // Ensure full URL for profile image
//       if (updatedUser.profileImage && !updatedUser.profileImage.startsWith('http')) {
//         updatedUser.profileImage = `https://hlopg.com${updatedUser.profileImage}`;
//       }
      
//       setUser(updatedUser);
//       setDraftUser(updatedUser);
      
//       // Save to localStorage
//       localStorage.setItem("hlopgUser", JSON.stringify(updatedUser));
      
//       setMessage("Profile image updated successfully!");
//       setTimeout(() => setMessage(""), 3000);
//     }
//   } catch (error) {
//     console.error("Failed to upload profile image:", error);
//     setMessage("Failed to update profile image");
//     setTimeout(() => setMessage(""), 3000);
//   }
// };
  const handleAadhaarChange = (side, e) => {
    const file = e.target.files[0];
    if (file) setDraftUser({ ...draftUser, [side]: URL.createObjectURL(file) });
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    setPasswordMsg(res.data.message || "Password updated successfully");

    // ✅ Clear ALL password fields and hide passwords
    setTimeout(() => {
      setPasswords({ current: "", new: "", confirm: "" });
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }, 500); // Small delay to show success message

  } catch (err) {
    setPasswordMsg(
      err.response?.data?.message || "Failed to update password",
    );
  } finally {
    setLoading(false);
  }
};
  const handleInputChange = (field, value) =>
    setDraftUser({ ...draftUser, [field]: value });

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("hlopgToken");

      const payload = {
        name: draftUser.name,
        gender: draftUser.gender,
      };

      const res = await api.put("/auth/update-basic-info", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        // Update local state with DB response
        const updatedUser = res.data.data;
        setUser(updatedUser);
      setDraftUser(updatedUser);

        // UI animations
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
  }, [animateGreeting]);

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

  const canUpdatePassword =
    passwordRules.length &&
    passwordRules.letter &&
    passwordRules.number &&
    passwordRules.symbol &&
    confirmValid;

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
                    src={
                      draftUser.profileImage ||
                       user?.profileImage ||
                      "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                    }
                    alt="Profile"
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
                  {
                    label: "Name",
                    field: "name",
                    type: "text",
                    editable: true,
                  },
                  {
                    label: "Email",
                    field: "email",
                    type: "email",
                    editable: false,
                  },
                  {
                    label: "Mobile Number",
                    field: "phone",
                    type: "text",
                    editable: false,
                  },
                  {
                    label: "Gender",
                    field: "gender",
                    type: "text",
                    editable: true,
                  },
                  // {
                  //   label: "City",
                  //   field: "city",
                  //   type: "text",
                  //   editable: false,
                  // },
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
        <div className="loading-container">
          <p>Loading your liked hostels...</p>
        </div>
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
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/4140/4140048.png";
                  }}
                />
                <div 
                  className="liked-heart-btn liked-active"
                  onClick={(e) => {
                    e.stopPropagation();
                    // You could add unlike functionality here
                  }}
                >
                   <FaHeart />
                </div>
              </div>
              <div className="liked-pg-info">
                <h4>{hostel.name}</h4>
                <p className="liked-location"> {hostel.location}</p>
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
          <p className="small-text">Like hostels by clicking the ❤️ icon on hostel cards.</p>
          <button 
            className="browse-hostels-btn"
            onClick={() => navigate("/")}
          >
            Browse Hostels
          </button>
        </div>
      )}
    </>
  );

      case "payment-history":
        return (
          <>
            <h3>PAYMENT HISTORY</h3>
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>PG Name</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {user?.payments?.length ? (
                  user.payments.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.date}</td>
                      <td>{p.pgName}</td>
                      <td>₹{p.amount}</td>
                      <td>{p.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No payments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        );

      case "change-password":
        return (
          <>
            <h3>CHANGE PASSWORD</h3>
            <div className="password-form">
              {[
                {
                  label: "Current Password",
                  field: "current",
                  show: showCurrent,
                  setShow: setShowCurrent,
                },
                {
                  label: "New Password",
                  field: "new",
                  show: showNew,
                  setShow: setShowNew,
                },
                {
                  label: "Confirm Password",
                  field: "confirm",
                  show: showConfirm,
                  setShow: setShowConfirm,
                },
              ].map((p, idx) => (
                <div className="form-group password-group" key={idx}>
                  <label>{p.label}</label>
                  <div className="password-input-wrapper">
                    <input
                      type={p.show ? "text" : "password"}
                      placeholder={`Enter ${p.label.toLowerCase()}`}
                      value={passwords[p.field]}
                      onChange={(e) =>
                        handlePasswordChange(p.field, e.target.value)
                      }
                      className={
                        p.field === "confirm" && !confirmValid ? "invalid" : ""
                      }
                    />
                    <span onClick={() => p.setShow(!p.show)}>
                      {p.show ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {p.field === "confirm" && !confirmValid && (
                    <p className="confirm-error">Passwords do not match</p>
                  )}
                </div>
              ))}
              {/* <div className="password-rules">
                <p className={passwordRules.length ? "valid" : ""}>
                  • At least 6 characters
                </p>
                <p className={passwordRules.letter ? "valid" : ""}>
                  • Includes letters
                </p>
                <p className={passwordRules.number ? "valid" : ""}>
                  • Includes numbers
                </p>
                <p className={passwordRules.symbol ? "valid" : ""}>
                  • Includes symbols
                </p>
              </div> */}
              <button
                className="save-btn"
                onClick={handleUpdatePassword}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
              {passwordMsg && (
                <p className="save-message">{passwordMsg}</p>
              )}{" "}
            </div>
          </>
        );

     case "terms":
  return (
    <>
      <h3>TERMS AND CONDITIONS</h3>
      <div className="terms-container">
        <div className="terms-box">
          <div className="terms-header">
            <h4>HloPG Terms of Service</h4>
            <p className="last-updated">Last Updated: February 2024</p>
          </div>
          
          <div className="terms-content">
            <div className="terms-section">
              <h5>1. Acceptance of Terms</h5>
              <p>
                By accessing and using HloPG services, you agree to be bound by these Terms and Conditions. 
                If you do not agree with any part of these terms, you must not use our services.
              </p>
            </div>

            <div className="terms-section">
              <h5>2. User Registration</h5>
              <p>
                • Users must provide accurate and complete information during registration.<br/>
                • You are responsible for maintaining the confidentiality of your account.<br/>
                • You must be at least 18 years old to use our booking services.
              </p>
            </div>

            <div className="terms-section">
              <h5>3. Booking and Payments</h5>
              <p>
                • All bookings are subject to availability and confirmation.<br/>
                • Security deposits are refundable subject to terms of the hostel.<br/>
                • Rent payments must be made on or before the due date.<br/>
                • Cancellation policies vary by hostel and are displayed during booking.
              </p>
            </div>

            <div className="terms-section">
              <h5>4. Hostel Rules and Regulations</h5>
              <p>
                • Users must comply with the rules of the hostel they stay in.<br/>
                • Damage to property will be charged to the user.<br/>
                • Illegal activities are strictly prohibited.<br/>
                • Visitors may be subject to hostel-specific visitor policies.
              </p>
            </div>

            <div className="terms-section">
              <h5>5. Privacy and Data Protection</h5>
              <p>
                • We collect personal information for service provision only.<br/>
                • Your data is protected and never shared without consent.<br/>
                • We use encryption to protect sensitive information.
              </p>
            </div>

            <div className="terms-section">
              <h5>6. Limitation of Liability</h5>
              <p>
                • HloPG acts as a platform connecting users with hostels.<br/>
                • We are not liable for disputes between users and hostel owners.<br/>
                • We recommend verifying hostel details before booking.
              </p>
            </div>

            <div className="terms-section">
              <h5>7. Changes to Terms</h5>
              <p>
                • We reserve the right to modify these terms at any time.<br/>
                • Continued use of the service constitutes acceptance of changes.<br/>
                • Users will be notified of significant changes.
              </p>
            </div>

            <div className="terms-section">
              <h5>8. Contact Information</h5>
              <p>
                For any questions about these Terms and Conditions, please contact us:<br/>
                • Email: support@hlopg.com<br/>
                • Phone: +91 9876543210<br/>
                • Address: HloPG Headquarters, Hyderabad, India
              </p>
            </div>
          </div>

          <div className="terms-footer">
            <div className="agreement-check">
              <input type="checkbox" id="agreeTerms" defaultChecked />
              <label htmlFor="agreeTerms">
                I have read and agree to the Terms and Conditions
              </label>
            </div>
            <p className="terms-note">
              By continuing to use our services, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="account-container">
        <div className="sidebar">
          <div
            className={`sidebar-preview ${animateSidebar ? "fade-update" : ""}`}
          >
            {/* <div className="sidebar-profile-image">
              <img
                src={
                  user.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                }
                alt="Profile"
              />
            </div> */}
          </div>

          <div
            className={`sidebar-greeting ${animateGreeting ? "fade-greeting" : ""}`}
          >
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
            <p style={{fontSize:20,marginTop:30}}>Are you sure you want to logout?</p>
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
