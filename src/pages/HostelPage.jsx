import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./HostelPage.css";

import {
  FaWifi,
  FaFan,
  FaBed,
  FaTv,
  FaLightbulb,
  FaDoorClosed,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaShower,
  FaParking,
  FaBroom,
  FaStarHalfAlt,
  FaRegStar
} from "react-icons/fa";

import api from "../api";

// Fallback images
import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";
import pg4 from "../assets/pg4.jpg";
import pg5 from "../assets/pg5.png";

const BASE_URL = "https://hlopg.com"; 
// If backend is running with IP use like:
// const BASE_URL = "http://72.61.241.195:8080";

/* ⭐ Render Star Ratings */
const renderStars = (rating = 0) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="review-star" />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" className="review-star" />);
  }

  while (stars.length < 5) {
    stars.push(
      <FaRegStar key={`empty-${stars.length}`} className="review-star" />
    );
  }

  return <div className="stars-container">{stars}</div>;
};

const HostelPage = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [hostelData, setHostelData] = useState(null);
  const [foodMenu, setFoodMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(true);

  const [mainImageIndex, setMainImageIndex] = useState(0);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [user, setUser] = useState(null);

  // Dummy Reviews
  const dummyReviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 4.5,
      comment: "Great PG, clean facilities and friendly staff. Food quality is excellent!",
      date: "2 weeks ago"
    }
  ];

  const avgRating =
    dummyReviews.reduce((sum, r) => sum + r.rating, 0) / dummyReviews.length;

  const totalReviews = dummyReviews.length;

  // Fix Image URL function
  const fixImageUrl = (img) => {
    if (!img) return pg1;
    if (img.startsWith("http")) return img;

    if (img.startsWith("/uploads")) return `${BASE_URL}${img}`;
    if (img.startsWith("uploads")) return `${BASE_URL}/${img}`;

    return `${BASE_URL}/uploads/${img}`;
  };

  // Fetch hostel data
  useEffect(() => {
    const fetchHostel = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/hostel/${hostelId}`);

        if (res.data.success) {
          const data = res.data.data;

          // Fix images
          if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            data.images = data.images.map(fixImageUrl);
          } else if (data.img) {
            data.images = [fixImageUrl(data.img)];
          } else {
            data.images = [pg1, pg2, pg3, pg4, pg5];
          }

          setHostelData(data);
        } else {
          setHostelData(null);
        }
      } catch (err) {
        console.error("Error fetching hostel:", err);
        setHostelData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
  }, [hostelId]);

  // Fetch Food Menu (ONLY CORRECT ENDPOINT)
  useEffect(() => {
    const fetchFoodMenu = async () => {
      try {
        setMenuLoading(true);

        const res = await api.get(`/hostel/food_menu/${hostelId}`);

        if (res.data && res.data.data) {
          const menuData = res.data.data;

          if (Array.isArray(menuData)) {
            setFoodMenu(menuData);
          } else if (typeof menuData === "object") {
            // Convert object to array format
            const formatted = Object.entries(menuData).map(([day, meals]) => ({
              day: day.charAt(0).toUpperCase() + day.slice(1),
              breakfast: meals.breakfast || "-",
              lunch: meals.lunch || "-",
              dinner: meals.dinner || "-"
            }));
            setFoodMenu(formatted);
          } else {
            setFoodMenu([]);
          }
        } else {
          setFoodMenu([]);
        }
      } catch (err) {
        console.error("Food menu fetch error:", err);
        setFoodMenu([]);
      } finally {
        setMenuLoading(false);
      }
    };

    if (hostelId) fetchFoodMenu();
  }, [hostelId]);

  // Image carousel
  const images = hostelData?.images?.length
    ? hostelData.images
    : [pg1, pg2, pg3, pg4, pg5];

  const prevImage = () => {
    setMainImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setMainImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Booking Popup Component
  const BookingPopup = ({ onClose, onSubmit }) => {
    const [selectedSharing, setSelectedSharing] = useState("single");
    const [userPhone, setUserPhone] = useState(user?.phone || "");
    const [userName, setUserName] = useState(user?.name || "");
    const [userEmail, setUserEmail] = useState(user?.email || "");

    const sharingOptions = hostelData?.sharing_data
      ? Object.entries(hostelData.sharing_data).map(([type, price]) => ({
          value: type,
          label: `${type} - ₹${price}/month`
        }))
      : [
          { value: "single", label: "Single Sharing" },
          { value: "double", label: "Double Sharing" }
        ];

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!userName.trim()) {
        alert("Enter your name");
        return;
      }

      if (!userEmail.trim()) {
        alert("Enter your email");
        return;
      }

      if (!userPhone.trim() || userPhone.length < 10) {
        alert("Enter valid phone number");
        return;
      }

      const bookingUser = {
        id: user?.id || Date.now(),
        name: userName,
        email: userEmail,
        phone: userPhone
      };

      const bookingData = {
        sharing: selectedSharing,
        user: bookingUser
      };

      onSubmit(bookingData);
    };

    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="booking-popup" onClick={(e) => e.stopPropagation()}>
          <div className="popup-header">
            <h3>Book {hostelData?.hostel_name}</h3>
            <button className="close-popup" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="popup-content">
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label>Name*</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email*</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone*</label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label>Sharing Type*</label>
                <select
                  value={selectedSharing}
                  onChange={(e) => setSelectedSharing(e.target.value)}
                >
                  {sharingOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>
                  Cancel
                </button>

                <button type="submit" className="submit-btn" disabled={bookingLoading}>
                  {bookingLoading ? "Sending..." : "Send Booking Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Create booking
  const handleCreateBooking = async (bookingData) => {
    try {
      setBookingLoading(true);

      const token = localStorage.getItem("hlopgToken");

      const bookingPayload = {
        hostel_id: parseInt(hostelId),
        user_name: bookingData.user.name,
        user_email: bookingData.user.email,
        user_phone: bookingData.user.phone,
        sharing_type: bookingData.sharing,
        booking_date: new Date().toISOString().split("T")[0]
      };

      const res = await api.post("/booking/request", bookingPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.data.success) {
        alert("✅ Booking request sent! Owner will contact you soon.");
        setIsPopupOpen(false);
      } else {
        alert("❌ Booking failed: " + (res.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("❌ Booking request failed. Try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Book now
  const handleBookNow = () => {
    const token = localStorage.getItem("hlopgToken");
    const owner = localStorage.getItem("hlopgOwner");

    if (owner) {
      alert("Hostel owner cannot book PG.");
      return;
    }

    if (!token) {
      alert("Please login first");
      navigate("/StudentLogin", { state: { from: location.pathname } });
      return;
    }

    setIsPopupOpen(true);
  };

  // Loading
  if (loading) return <div className="loading">Loading hostel details...</div>;
  if (!hostelData) return <div className="error">No hostel found.</div>;

  return (
    <div className="hostel-page">
      <div className="hostel-main">
        {/* Left Images */}
        <div className="hostel-images">
          <div className="main-img">
            <button className="arrow-left" onClick={prevImage}>
              <FaChevronLeft />
            </button>

            <img src={images[mainImageIndex]} alt="Room" />

            <button className="arrow-right" onClick={nextImage}>
              <FaChevronRight />
            </button>
          </div>

          <div className="thumbnail-container">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumb ${idx}`}
                className={mainImageIndex === idx ? "active-thumb" : ""}
                onClick={() => setMainImageIndex(idx)}
              />
            ))}
          </div>
        </div>

        {/* Right Details */}
        <div className="hostel-details">
          <h2 className="black-text">{hostelData.hostel_name}</h2>
          <p className="black-text">{hostelData.address}</p>

          <h3 className="black-text">Amenities</h3>
          <div className="furnished-icons">
            {hostelData.facilities?.wifi && (
              <span>
                <FaWifi /> WiFi
              </span>
            )}
            {hostelData.facilities?.parking && (
              <span>
                <FaParking /> Parking
              </span>
            )}
            {hostelData.facilities?.fan && (
              <span>
                <FaFan /> Fan
              </span>
            )}
            {hostelData.facilities?.bed && (
              <span>
                <FaBed /> Bed
              </span>
            )}
            {hostelData.facilities?.tv && (
              <span>
                <FaTv /> TV
              </span>
            )}
            {hostelData.facilities?.lights && (
              <span>
                <FaLightbulb /> Lights
              </span>
            )}
            {hostelData.facilities?.geyser && (
              <span>
                <FaShower /> Hot Water
              </span>
            )}
            {hostelData.facilities?.clean && (
              <span>
                <FaBroom /> Cleaning
              </span>
            )}
            {hostelData.facilities?.cupboard && (
              <span>
                <FaDoorClosed /> Cupboard
              </span>
            )}
          </div>

          {/* Reviews */}
          <div className="reviews-section">
            <h2 className="black-text">PG Reviews</h2>
            <div className="rating-overviews">
              <div className="avg-rating">
                <span className="rating-number">{avgRating.toFixed(1)}</span>
                {renderStars(avgRating)}
                <span className="total-reviews">({totalReviews} reviews)</span>
              </div>
            </div>

            <div className="reviews-list">
              {dummyReviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="reviewer-info">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="reviewer-avatar"
                    />
                    <div>
                      <h4 className="reviewer-name">{review.name}</h4>
                      <p className="review-date">{review.date}</p>
                    </div>
                  </div>
                  <div className="review-content">
                    {renderStars(review.rating)}
                    <p className="review-text">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Book Button */}
          <div className="book-now">
            <button className="book-now-btn" onClick={handleBookNow}>
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Food Menu */}
      <div className="food-menu">
        <h2 className="black-text">Food Menu</h2>

        {menuLoading ? (
          <p>Loading food menu...</p>
        ) : foodMenu.length > 0 ? (
          <table className="food-table">
            <thead>
              <tr>
                <th>DAY</th>
                <th>BREAKFAST</th>
                <th>LUNCH</th>
                <th>DINNER</th>
              </tr>
            </thead>
            <tbody>
              {foodMenu.map((day, idx) => (
                <tr key={idx}>
                  <td>{day.day}</td>
                  <td>{day.breakfast || "-"}</td>
                  <td>{day.lunch || "-"}</td>
                  <td>{day.dinner || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No food menu available.</p>
        )}
      </div>

      {/* Booking Popup */}
      {isPopupOpen && (
        <BookingPopup
          onClose={() => setIsPopupOpen(false)}
          onSubmit={handleCreateBooking}
        />
      )}
    </div>
  );
};

export default HostelPage;
