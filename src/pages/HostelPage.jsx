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

// fallback images
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

  // ⭐ Dummy Reviews
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

  // ✅ FIX IMAGE URL FUNCTION
  const fixImageUrl = (img) => {
    if (!img) return pg1;

    // already full url
    if (img.startsWith("http")) return img;

    // remove any double slashes
    const cleaned = img.startsWith("/") ? img : `/${img}`;

    // IMPORTANT: this should match your backend domain
    // api.defaults.baseURL is your backend url
    return `${api.defaults.baseURL}${cleaned}`;
  };

  // ===================== FETCH HOSTEL =====================
  useEffect(() => {
    const fetchHostel = async () => {
      try {
        setLoading(true);

        console.log("🏠 Fetching hostel ID:", hostelId);

        const res = await api.get(`/hostel/${hostelId}`);
        console.log("📡 Hostel Response:", res.data);

        if (res.data.success) {
          const data = res.data.data;

          // if backend gives images array
          if (data.images && Array.isArray(data.images) && data.images.length > 0) {
            data.images = data.images.map((img) => fixImageUrl(img));
          }
          // if backend gives only img
          else if (data.img) {
            data.images = [fixImageUrl(data.img)];
          }
          // fallback
          else {
            data.images = [pg1, pg2, pg3, pg4, pg5];
          }

          setHostelData(data);
        } else {
          setHostelData(null);
        }
      } catch (err) {
        console.error("❌ Hostel fetch error:", err.response?.data || err.message);
        setHostelData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
  }, [hostelId]);

  // ===================== FETCH FOOD MENU =====================
  useEffect(() => {
    const fetchFoodMenu = async () => {
      try {
        setMenuLoading(true);

        const endpoints = [
          `/hostel/food_menu/${hostelId}`,
          `/food_menu/${hostelId}`,
          `/hostel/${hostelId}/food_menu`
        ];

        let menuData = null;

        for (const endpoint of endpoints) {
          try {
            console.log("🍽️ Trying food menu endpoint:", endpoint);

            const res = await api.get(endpoint);

            if (res.data.success) {
              menuData = res.data.data;
              break;
            }
          } catch (err) {
            console.log("❌ Failed:", endpoint);
          }
        }

        if (!menuData) {
          setFoodMenu([]);
          return;
        }

        // if string JSON
        if (typeof menuData === "string") {
          menuData = JSON.parse(menuData);
        }

        // if array
        if (Array.isArray(menuData)) {
          setFoodMenu(menuData);
          return;
        }

        // if object weekly menu
        if (typeof menuData === "object") {
          const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

          const processed = days.map((day) => ({
            day: day.charAt(0).toUpperCase() + day.slice(1),
            breakfast: menuData.breakfast?.[day] || "-",
            lunch: menuData.lunch?.[day] || "-",
            dinner: menuData.dinner?.[day] || "-"
          }));

          setFoodMenu(processed);
          return;
        }

        setFoodMenu([]);
      } catch (err) {
        console.error("❌ Food menu error:", err.response?.data || err.message);
        setFoodMenu([]);
      } finally {
        setMenuLoading(false);
      }
    };

    if (hostelId) fetchFoodMenu();
  }, [hostelId]);

  // ===================== IMAGE CAROUSEL =====================
  const images =
    hostelData?.images?.length > 0 ? hostelData.images : [pg1, pg2, pg3, pg4, pg5];

  const prevImage = () => {
    setMainImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setMainImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // ===================== BOOK NOW =====================
  const handleBookNow = () => {
    const token = localStorage.getItem("hlopgToken");
    const owner = localStorage.getItem("hlopgOwner");

    if (owner) {
      alert("You are logged in as Hostel Owner. Not authorized to book.");
      return;
    }

    if (!token) {
      alert("Please login to book.");
      navigate("/StudentLogin", { state: { from: location.pathname } });
      return;
    }

    setIsPopupOpen(true);

    const cachedUser = localStorage.getItem("hlopgUser");
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        setUser(null);
      }
    }
  };

  // ===================== CREATE BOOKING =====================
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

      console.log("📤 Booking payload:", bookingPayload);

      const res = await api.post("/booking/request", bookingPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("✅ Booking response:", res.data);

      if (res.data.success) {
        alert("✅ Booking Request Sent Successfully! Owner will contact you soon.");
        setIsPopupOpen(false);
      } else {
        alert(res.data.message || "Booking failed");
      }
    } catch (err) {
      console.error("❌ Booking error:", err.response?.data || err.message);
      alert("Booking request failed. Try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // ===================== BOOKING POPUP =====================
  const BookingPopup = ({ onClose, onSubmit }) => {
    const [selectedSharing, setSelectedSharing] = useState("single");
    const [userPhone, setUserPhone] = useState(user?.phone || "");
    const [userName, setUserName] = useState(user?.name || "");
    const [userEmail, setUserEmail] = useState(user?.email || "");

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!userName.trim()) return alert("Enter name");
      if (!userEmail.trim()) return alert("Enter email");
      if (!userPhone.trim() || userPhone.length < 10) return alert("Enter valid phone number");

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
            <button className="close-popup" onClick={onClose}>×</button>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your Name"
              required
            />

            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Your Email"
              required
            />

            <input
              type="tel"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="Phone Number"
              required
            />

            <label>Select Sharing Type:</label>
            <select value={selectedSharing} onChange={(e) => setSelectedSharing(e.target.value)}>
              <option value="single">1-Sharing</option>
              <option value="double">2-Sharing</option>
              <option value="triple">3-Sharing</option>
              <option value="four">4-Sharing</option>
            </select>

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

  // ===================== LOADING =====================
  if (loading) return <div className="loading">Loading hostel details...</div>;
  if (!hostelData) return <div className="error">No hostel found.</div>;

  return (
    <div className="hostel-page">
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
              <span><FaWifi /> Free WiFi</span>
            )}
            {hostelData.facilities?.parking && (
              <span><FaParking /> Parking</span>
            )}
            {hostelData.facilities?.fan && (
              <span><FaFan /> Fan</span>
            )}
            {hostelData.facilities?.bed && (
              <span><FaBed /> Bed</span>
            )}
            {hostelData.facilities?.tv && (
              <span><FaTv /> TV</span>
            )}
            {hostelData.facilities?.geyser && (
              <span><FaShower /> Hot Water</span>
            )}
            {hostelData.facilities?.clean && (
              <span><FaBroom /> Cleaning</span>
            )}
            {hostelData.facilities?.lights && (
              <span><FaLightbulb /> Lights</span>
            )}
            {hostelData.facilities?.cupboard && (
              <span><FaDoorClosed /> Cupboard</span>
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
              {dummyReviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="reviewer-info">
                    <img src={review.avatar} alt={review.name} className="reviewer-avatar" />
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

      {/* FOOD MENU */}
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
                  <td><b>{day.day}</b></td>
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

      {/* BOOK NOW */}
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
