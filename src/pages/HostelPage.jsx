import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "./HostelPage.css";

const HostelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hostel, setHostel] = useState(null);
  const [foodMenu, setFoodMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");
  const [allImages, setAllImages] = useState([]);

  // ✅ Backend Base URL
  const BACKEND_URL = "https://www.hlopg.com";

  // ✅ Fix Image URL
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";

    // If already full URL return as it is
    if (imgPath.startsWith("http")) return imgPath;

    // If backend sends "/uploads/xxx.jpg"
    if (imgPath.startsWith("/uploads/")) return `${BACKEND_URL}${imgPath}`;

    // If backend sends "uploads/xxx.jpg"
    if (imgPath.startsWith("uploads/")) return `${BACKEND_URL}/${imgPath}`;

    // If backend sends only file name like "abc.jpg"
    return `${BACKEND_URL}/uploads/${imgPath}`;
  };

  // ✅ Convert backend image field to array safely
  const extractImages = (hostelData) => {
    if (!hostelData) return [];

    // Most common field names
    const possibleFields = [
      hostelData.image,
      hostelData.images,
      hostelData.imageUrl,
      hostelData.imageUrls,
      hostelData.photos,
      hostelData.photo,
      hostelData.hostelImages,
    ];

    for (let field of possibleFields) {
      if (!field) continue;

      // If already array
      if (Array.isArray(field)) return field;

      // If string with commas
      if (typeof field === "string" && field.includes(",")) {
        return field.split(",").map((x) => x.trim());
      }

      // If single string
      if (typeof field === "string") return [field];
    }

    return [];
  };

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        setLoading(true);

        console.log("📌 Hostel ID:", id);

        // ✅ Hostel Data
        const hostelRes = await api.get(`/api/hostel/${id}`);
        console.log("✅ Hostel API Response:", hostelRes.data);

        setHostel(hostelRes.data);

        // ✅ Extract images properly
        const imgs = extractImages(hostelRes.data);
        console.log("🖼 Extracted Images:", imgs);

        const fixedUrls = imgs.map((img) => getImageUrl(img));
        setAllImages(fixedUrls);

        if (fixedUrls.length > 0) {
          setSelectedImage(fixedUrls[0]);
        }

        // ✅ Food Menu API
        const foodRes = await api.get(`/api/hostel/food_menu/${id}`);
        console.log("✅ Food Menu Response:", foodRes.data);

        if (foodRes.data && foodRes.data.menu) {
          setFoodMenu(foodRes.data.menu);
        } else if (Array.isArray(foodRes.data)) {
          setFoodMenu(foodRes.data);
        } else {
          setFoodMenu([]);
        }
      } catch (error) {
        console.error("❌ Error fetching hostel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHostelDetails();
  }, [id]);

  const nextImage = () => {
    if (allImages.length === 0) return;

    const currentIndex = allImages.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
  };

  const prevImage = () => {
    if (allImages.length === 0) return;

    const currentIndex = allImages.indexOf(selectedImage);
    const prevIndex =
      (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
  };

  if (loading) {
    return (
      <div className="hostel-page-loading">
        <h2>Loading Hostel Details...</h2>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="hostel-page-loading">
        <h2>Hostel Not Found ❌</h2>
      </div>
    );
  }

  return (
    <div className="hostel-page-container">
      {/* 🔙 Back Button */}
      <button className="hostel-back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      {/* 🏠 Hostel Name */}
      <h1 className="hostel-title">{hostel.name || "Hostel"}</h1>

      {/* 🖼 Image Section */}
      <div className="hostel-image-section">
        <div className="main-image-box">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Hostel"
              className="main-hostel-image"
              onError={(e) => {
                e.target.src =
                  "https://dummyimage.com/800x500/cccccc/000000&text=No+Image";
              }}
            />
          ) : (
            <div className="no-image-box">
              <h3>No Image Available</h3>
            </div>
          )}

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button className="img-arrow left" onClick={prevImage}>
                ❮
              </button>
              <button className="img-arrow right" onClick={nextImage}>
                ❯
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Images */}
        <div className="thumbnail-row">
          {allImages.length > 0 ? (
            allImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumb ${index}`}
                className={`thumbnail-img ${
                  selectedImage === img ? "active-thumb" : ""
                }`}
                onClick={() => setSelectedImage(img)}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ))
          ) : (
            <p style={{ padding: "10px", color: "gray" }}>
              No images found for this hostel.
            </p>
          )}
        </div>
      </div>

      {/* 📍 Hostel Details */}
      <div className="hostel-details-box">
        <p>
          <b>City:</b> {hostel.city || "N/A"}
        </p>
        <p>
          <b>Location:</b> {hostel.location || "N/A"}
        </p>
        <p>
          <b>Rent:</b> ₹{hostel.rent || "N/A"}
        </p>
        <p>
          <b>Rating:</b> ⭐ {hostel.rating || "N/A"}
        </p>
      </div>

      {/* 🍛 Food Menu */}
      <div className="food-menu-box">
        <h2>Food Menu</h2>

        {foodMenu.length > 0 ? (
          <ul>
            {foodMenu.map((item, index) => (
              <li key={index}>
                <b>{item.day}</b> - {item.breakfast}, {item.lunch},{" "}
                {item.dinner}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Food Menu Available</p>
        )}
      </div>
    </div>
  );
};

export default HostelPage;
