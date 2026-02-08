// src/pages/HostelDetails.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "./HostelDetails.css";

// fallback images
import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";
import pg4 from "../assets/pg4.jpg";
import pg5 from "../assets/pg5.jpg";

const BASE_URL = "https://www.hlopg.com"; // IMPORTANT FIX

const HostelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hostel, setHostel] = useState(null);
  const [images, setImages] = useState([pg1, pg2, pg3, pg4, pg5]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [foodMenu, setFoodMenu] = useState([]);

  // ================= FETCH HOSTEL DETAILS =================
  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        console.log("📤 GET /api/hostel/" + id);

        const res = await api.get(`/hostel/${id}`);
        console.log("✅ Hostel API Response:", res.data);

        const data = res.data;

        // ---------- IMAGE FIX ----------
        let finalImages = [];

        if (data.images && Array.isArray(data.images) && data.images.length > 0) {
          finalImages = data.images.map((img) => {
            if (!img) return pg1;

            if (img.startsWith("http")) return img;

            if (img.startsWith("/uploads")) return `${BASE_URL}${img}`;

            return `${BASE_URL}/uploads/${img}`;
          });
        } else if (data.img) {
          const img = data.img;

          if (img.startsWith("http")) finalImages = [img];
          else if (img.startsWith("/uploads")) finalImages = [`${BASE_URL}${img}`];
          else finalImages = [`${BASE_URL}/uploads/${img}`];
        } else {
          finalImages = [pg1, pg2, pg3, pg4, pg5];
        }

        setHostel(data);
        setImages(finalImages);
        setMainImageIndex(0);
      } catch (err) {
        console.error("❌ Error fetching hostel details:", err);
      }
    };

    fetchHostelDetails();
  }, [id]);

  // ================= FETCH FOOD MENU =================
  useEffect(() => {
    const fetchFoodMenu = async () => {
      try {
        console.log("📤 GET /api/hostel/food_menu/" + id);

        const res = await api.get(`/hostel/food_menu/${id}`);
        console.log("✅ Food Menu API Response:", res.data);

        if (res.data && Array.isArray(res.data.menu)) {
          setFoodMenu(res.data.menu);
        } else if (Array.isArray(res.data)) {
          setFoodMenu(res.data);
        } else {
          setFoodMenu([]);
        }
      } catch (err) {
        console.error("❌ Error fetching food menu:", err);
        setFoodMenu([]);
      }
    };

    fetchFoodMenu();
  }, [id]);

  // ================= IMAGE NAVIGATION =================
  const nextImage = () => {
    setMainImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setMainImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // ================= UI =================
  if (!hostel) {
    return <div className="loading">Loading Hostel Details...</div>;
  }

  return (
    <div className="hostel-details-page">

      {/* ================= BACK BUTTON ================= */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      {/* ================= IMAGE SECTION ================= */}
      <div className="image-slider-container">

        <button className="slider-btn left" onClick={prevImage}>
          ❮
        </button>

        <img
          src={images[mainImageIndex]}
          alt="Room"
          className="main-hostel-image"
          onError={(e) => {
            e.target.src = pg1;
          }}
        />

        <button className="slider-btn right" onClick={nextImage}>
          ❯
        </button>
      </div>

      {/* ================= THUMBNAILS ================= */}
      <div className="thumbnail-container">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Thumb ${idx}`}
            className={`thumbnail-img ${
              mainImageIndex === idx ? "active-thumb" : ""
            }`}
            onClick={() => setMainImageIndex(idx)}
            onError={(e) => {
              e.target.src = pg1;
            }}
          />
        ))}
      </div>

      {/* ================= HOSTEL INFO ================= */}
      <div className="hostel-info">
        <h1 className="hostel-name">{hostel.name}</h1>

        <p className="hostel-location">
          📍 {hostel.city}, {hostel.area}
        </p>

        <p className="hostel-owner">👤 Owner: {hostel.ownerName}</p>

        <p className="hostel-price">💰 Price: ₹{hostel.price}</p>

        <p className="hostel-roomtype">🛏 Room Type: {hostel.roomType}</p>

        <p className="hostel-description">
          📝 {hostel.description || "No description available"}
        </p>
      </div>

      {/* ================= FOOD MENU ================= */}
      <div className="food-menu-section">
        <h2>🍽 Food Menu</h2>

        {foodMenu.length === 0 ? (
          <p>No food menu available</p>
        ) : (
          <ul className="food-menu-list">
            {foodMenu.map((item, idx) => (
              <li key={idx} className="food-menu-item">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HostelDetails;
