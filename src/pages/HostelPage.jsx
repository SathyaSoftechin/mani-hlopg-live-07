import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "./HostelPage.css";

const HostelPage = () => {
  const { id } = useParams();

  const [hostel, setHostel] = useState(null);
  const [foodMenu, setFoodMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ default fallback image (from public folder)
  const defaultImage = "/pg5.jpg";

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        setLoading(true);

        // ================== HOSTEL DETAILS ==================
        const hostelRes = await api.get(`/hostel/${id}`);
        console.log("🏠 Hostel Response:", hostelRes.data);

        if (hostelRes.data.success) {
          setHostel(hostelRes.data.data);
        }

        // ================== FOOD MENU ==================
        const foodRes = await api.get(`/hostel/food_menu/${id}`);
        console.log("🍲 Food Menu Response:", foodRes.data);

        if (foodRes.data.success) {
          setFoodMenu(foodRes.data.data || []);
        } else {
          setFoodMenu([]);
        }
      } catch (error) {
        console.log("❌ Error fetching hostel details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostelDetails();
  }, [id]);

  // ================== IMAGE URL HANDLER ==================
  const getImageUrl = (imagePath) => {
    if (!imagePath) return defaultImage;

    // if backend already sends full URL
    if (imagePath.startsWith("http")) return imagePath;

    // if backend sends "/uploads/xxx.jpg"
    if (imagePath.startsWith("/uploads")) {
      return `${import.meta.env.VITE_API_URL}${imagePath}`;
    }

    // if backend sends only filename "abc.jpg"
    return `${import.meta.env.VITE_API_URL}/uploads/${imagePath}`;
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Loading Hostel Details...</h2>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Hostel Not Found</h2>
      </div>
    );
  }

  return (
    <div className="hostel-page-container">
      {/* ================== HOSTEL IMAGE ================== */}
      <div className="hostel-banner">
        <img
          src={getImageUrl(hostel.image)}
          alt="Hostel"
          className="hostel-banner-img"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </div>

      {/* ================== HOSTEL DETAILS ================== */}
      <div className="hostel-details-card">
        <h1 className="hostel-title">{hostel.name}</h1>

        <p className="hostel-location">
          📍 {hostel.location || hostel.address || "Location not available"}
        </p>

        <p className="hostel-description">
          {hostel.description || "No description available"}
        </p>

        <div className="hostel-info-grid">
          <div className="hostel-info-box">
            <h4>💰 Rent</h4>
            <p>₹ {hostel.rent || hostel.price || "N/A"}</p>
          </div>

          <div className="hostel-info-box">
            <h4>🛏 Rooms</h4>
            <p>{hostel.rooms || "N/A"}</p>
          </div>

          <div className="hostel-info-box">
            <h4>📞 Contact</h4>
            <p>{hostel.phone || hostel.contact || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* ================== FOOD MENU ================== */}
      <div className="food-menu-card">
        <h2 className="food-menu-title">🍽 Food Menu</h2>

        {foodMenu.length === 0 ? (
          <p className="no-food-menu">Food menu not available.</p>
        ) : (
          <div className="food-menu-grid">
            {foodMenu.map((item, index) => (
              <div key={index} className="food-menu-item">
                <h4>{item.day || `Day ${index + 1}`}</h4>
                <p>
                  <b>Breakfast:</b> {item.breakfast || "N/A"}
                </p>
                <p>
                  <b>Lunch:</b> {item.lunch || "N/A"}
                </p>
                <p>
                  <b>Dinner:</b> {item.dinner || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelPage;
