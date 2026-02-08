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
  FaRegStar,
} from "react-icons/fa";

import api from "../api";

// Fallback images
import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";
import pg4 from "../assets/pg4.jpg";
import pg5 from "../assets/pg5.png";

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

  const [user, setUser] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const dummyReviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 4.5,
      comment:
        "Great PG, clean facilities and friendly staff. Food quality is excellent!",
      date: "2 weeks ago",
    },
    {
      id: 2,
      name: "Priya Patel",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 4.0,
      comment:
        "Good location and well-maintained rooms. WiFi could be better though.",
      date: "1 month ago",
    },
    {
      id: 3,
      name: "Amit Kumar",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 5.0,
      comment: "Best PG in the area! Owner is very cooperative and helpful.",
      date: "3 days ago",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 3.5,
      comment: "Affordable price but need more parking space.",
      date: "2 months ago",
    },
    {
      id: 5,
      name: "Vikram Singh",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 4.0,
      comment: "Clean rooms and good food. Would recommend!",
      date: "1 week ago",
    },
  ];

  const avgRating =
    dummyReviews.reduce((sum, r) => sum + r.rating, 0) / dummyReviews.length;
  const totalReviews = dummyReviews.length;

  // ================= FETCH HOSTEL DETAILS =================
  useEffect(() => {
    const fetchHostel = async () => {
      try {
        console.log("🏠 Fetching hostel with ID:", hostelId);

        const res = await api.get(`/hostel/${hostelId}`);
        console.log("✅ Hostel API response:", res.data);

        if (res.data.success) {
          const data = res.data.data;

          // Fix image URLs
          if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            data.images = data.images.map((img) => {
              if (!img) return pg1;
              if (img.startsWith("http")) return img;
              if (img.startsWith("/uploads")) return `https://hlopg.com${img}`;
              return `https://hlopg.com/uploads/${img}`;
            });
          } else if (data.img) {
            const mainImg = data.img.startsWith("http")
              ? data.img
              : data.img.startsWith("/uploads")
              ? `https://hlopg.com${data.img}`
              : `https://hlopg.com/uploads/${data.img}`;

            data.images = [mainImg];
          } else {
            data.images = [pg1, pg2, pg3, pg4, pg5];
          }

          setHostelData(data);
        } else {
          setHostelData(null);
        }
      } catch (err) {
        console.error("❌ Error fetching hostel:", err);
        setHostelData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
  }, [hostelId]);

  // ================= FETCH FOOD MENU (FIXED) =================
  useEffect(() => {
    const fetchFoodMenu = async () => {
      try {
        setMenuLoading(true);

        console.log("🍽️ Fetching food menu for hostel:", hostelId);

        // ONLY correct backend endpoint
        const res = await api.get(`/hostel/food_menu/${hostelId}`);

        console.log("✅ Food menu response:", res.data);

        if (res.data.success && res.data.data) {
          setFoodMenu(res.data.data); // expecting array from backend
        } else {
          setFoodMenu([]);
        }
      } catch (err) {
        console.error("❌ Error fetching food menu:", err);
        setFoodMenu([]);
      } finally {
        setMenuLoading(false);
      }
    };

    if (hostelId) fetchFoodMenu();
  }, [hostelId]);

  // ================= IMAGE CAROUSEL =================
  const images =
    hostelData?.images && hostelData.images.length > 0
      ? hostelData.images
      : [pg1, pg2, pg3, pg4, pg5];

  const prevImage = () =>
    setMainImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const nextImage = () =>
    setMainImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // ================= BOOK NOW BUTTON =================
  const handleBookNow = async () => {
    try {
      const token = localStorage.getItem("hlopgToken");
      const owner = localStorage.getItem("hlopgOwner");

      if (owner) {
        alert("You are logged in as Hostel Owner. Not authorized to book.");
        return;
      }

      if (!token) {
        alert("Please log in to send booking request.");
        navigate("/StudentLogin", { state: { from: location.pathname } });
        return;
      }

      setIsPopupOpen(true);

      const userStr = localStorage.getItem("hlopgUser");
      if (userStr && userStr !== "undefined" && userStr !== "null") {
        try {
          const cachedUser = JSON.parse(userStr);
          setUser(cachedUser);
          return;
        } catch (e) {
          console.log("⚠️ Could not parse cached user");
        }
      }

      const res = await api.get("/auth/userid", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        const formattedUser = {
          id: res.data.id || Date.now(),
          name: res.data.name || "User",
          email: res.data.email || "",
          phone: res.data.phone || "",
          userType: res.data.userType || "USER",
        };

        setUser(formattedUser);
        localStorage.setItem("hlopgUser", JSON.stringify(formattedUser));
      }
    } catch (err) {
      console.error("❌ Error in handleBookNow:", err);
      setUser({
        id: Date.now(),
        name: "User",
        email: "",
        phone: "",
        userType: "USER",
      });
      setIsPopupOpen(true);
    }
  };

  // ================= CREATE BOOKING REQUEST =================
  const handleCreateBooking = async (bookingData) => {
    try {
      setBookingLoading(true);

      if (!bookingData.user) {
        alert("Please provide your information");
        return;
      }

      const currentUser = bookingData.user;

      const bookingPayload = {
        hostel_id: parseInt(hostelId),
        user_name: currentUser.name,
        user_email: currentUser.email,
        user_phone: currentUser.phone,
        sharing_type: bookingData.sharing,
        booking_date: new Date().toISOString().split("T")[0],
      };

      console.log("📤 Sending booking payload:", bookingPayload);

      const token = localStorage.getItem("hlopgToken");

      const bookingRes = await api.post("/booking/request", bookingPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Booking response:", bookingRes.data);

      if (bookingRes.data.success) {
        alert(
          `✅ Booking Request Sent Successfully!\n\n🏠 PG: ${hostelData.hostel_name}\n📍 Location: ${
            hostelData.address || hostelData.city
          }\n🛏️ Sharing: ${bookingData.sharing}\n\n📞 Owner will contact you soon.`
        );

        localStorage.setItem("hlopgUser", JSON.stringify(currentUser));
        setIsPopupOpen(false);
      } else {
        alert("Booking failed: " + (bookingRes.data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("❌ Booking error:", err);
      alert("Booking request failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // ================= BOOKING POPUP =================
  const BookingPopup = ({ onClose, onSubmit }) => {
    const [selectedSharing, setSelectedSharing] = useState("single");
    const [userPhone, setUserPhone] = useState(user?.phone || "");
    const [userName, setUserName] = useState(user?.name || "");
    const [userEmail, setUserEmail] = useState(user?.email || "");

    const sharingOptions = hostelData?.sharing_data
      ? Object.entries(hostelData.sharing_data).map(([type, price]) => ({
          value: type,
          label: `${type.toUpperCase()} - ₹${price}/month`,
        }))
      : [
          { value: "single", label: "Single Sharing" },
          { value: "double", label: "Double Sharing" },
          { value: "triple", label: "Triple Sharing" },
        ];

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!userName.trim()) {
        alert("Please enter your name");
        return;
      }
      if (!userEmail.trim()) {
        alert("Please enter your email");
        return;
      }
      if (!userPhone.trim() || userPhone.length < 10) {
        alert("Please enter valid phone number");
        return;
      }

      const bookingUser = {
        id: user?.id || Date.now(),
        name: userName,
        email: userEmail,
        phone: userPhone,
      };

      onSubmit({
        sharing: selectedSharing,
        user: bookingUser,
      });
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

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="Enter your phone"
                required
              />
            </div>

            <div className="form-group">
              <label>Sharing Type *</label>
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
    );
  };

  // ================= LOADING / ERROR =================
  if (loading) return <div className="loading">Loading hostel details...</div>;
  if (!hostelData) return <div className="error">No hostel found.</div>;

  return (
    <div className="hostel-page">
      {/* MAIN SECTION */}
      <div className="hostel-main">
        {/* LEFT IMAGES */}
        <div className="hostel-images">
          <div className="main-img">
            <button className="arrow-left" onClick={prevImage}>
              <FaChevronLeft />
            </button>

            <img
              src={images[mainImageIndex]}
              alt="Room"
              onError={(e) => {
                e.target.src = pg1;
              }}
            />

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
                onError={(e) => {
                  e.target.src = pg1;
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div className="hostel-details">
          <h2 className="black-text">{hostelData.hostel_name}</h2>
          <p className="black-text">{hostelData.address}</p>

          <h3 className="black-text">Amenities</h3>
          <div className="furnished-icons">
            {hostelData.facilities?.wifi && (
              <span>
                <FaWifi /> Free WiFi
              </span>
            )}
            {hostelData.facilities?.parking && (
              <span>
                <FaParking /> Parking
              </span>
            )}
            {hostelData.facilities?.ac && (
              <span>
                <FaFan /> AC
              </span>
            )}
            {hostelData.facilities?.tv && (
              <span>
                <FaTv /> TV
              </span>
            )}
            {hostelData.facilities?.geyser && (
              <span>
                <FaShower /> Hot Water
              </span>
            )}
            {hostelData.facilities?.bed && (
              <span>
                <FaBed /> Bed
              </span>
            )}
            {hostelData.facilities?.lights && (
              <span>
                <FaLightbulb /> Lights
              </span>
            )}
            {hostelData.facilities?.clean && (
              <span>
                <FaBroom /> Cleaning
              </span>
            )}
          </div>

          {/* REVIEWS */}
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
              {dummyReviews.slice(0, 1).map((review) => (
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
        </div>
      </div>

      {/* FOOD MENU SECTION */}
      <div className="food-menu">
        <h2 className="black-text">Food Menu</h2>

        {menuLoading ? (
          <div className="loading-food">Loading food menu...</div>
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
                  <td>{day.breakfast}</td>
                  <td>{day.lunch}</td>
                  <td>{day.dinner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-food-menu">
            <p>🍽️ No food menu available</p>
          </div>
        )}
      </div>

      {/* BOOK NOW BUTTON */}
      <div className="book-now">
        <button className="book-now-btn" onClick={handleBookNow}>
          Book Now
        </button>
        <p className="booking-note-small">
          No payment required. Owner will contact you directly.
        </p>
      </div>

      {/* POPUP */}
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
