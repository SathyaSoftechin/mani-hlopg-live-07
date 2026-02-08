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

// Fallback images (make sure these exist)
import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";
import pg4 from "../assets/pg4.jpg";

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
  const { hostelId } = useParams();   // ✅ MUST MATCH ROUTE
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

  const dummyReviews = [
    {
      id: 1,
      name: "Rahul Sharma",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 4.5,
      comment: "Great PG, clean facilities and friendly staff. Food quality is excellent!",
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Priya Patel",
      avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      rating: 4.0,
      comment: "Good location and well-maintained rooms. WiFi could be better though.",
      date: "1 month ago"
    }
  ];

  const avgRating =
    dummyReviews.reduce((sum, r) => sum + r.rating, 0) / dummyReviews.length;

  const totalReviews = dummyReviews.length;

  // ✅ HOSTEL FETCH
  useEffect(() => {
    const fetchHostel = async () => {
      try {
        console.log("📌 Hostel ID:", hostelId);

        const res = await api.get(`/hostel/${hostelId}`);
        console.log("📌 Hostel API Response:", res.data);

        if (res.data.success) {
          const data = res.data.data;

          // ✅ Fix images
          if (data.images && Array.isArray(data.images)) {
            data.images = data.images.map((img) => {
              if (!img) return pg1;
              if (img.startsWith("http")) return img;
              if (img.startsWith("/uploads")) return `https://hlopg.com${img}`;
              return `https://hlopg.com/uploads/${img}`;
            });
          } else if (data.img) {
            let mainImg = data.img;
            if (!mainImg.startsWith("http")) {
              if (mainImg.startsWith("/uploads")) {
                mainImg = `https://hlopg.com${mainImg}`;
              } else {
                mainImg = `https://hlopg.com/uploads/${mainImg}`;
              }
            }
            data.images = [mainImg];
          } else {
            data.images = [pg1, pg2, pg3, pg4];
          }

          setHostelData(data);
        } else {
          setHostelData(null);
        }
      } catch (err) {
        console.error("❌ Hostel fetch error:", err);
        setHostelData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHostel();
  }, [hostelId]);

  // ✅ FOOD MENU FETCH
  useEffect(() => {
    const fetchFoodMenu = async () => {
      try {
        setMenuLoading(true);

        const res = await api.get(`/hostel/food_menu/${hostelId}`);
        console.log("🍽️ Food Menu Response:", res.data);

        if (res.data.success && res.data.data) {
          const menuData = res.data.data;

          if (Array.isArray(menuData)) {
            setFoodMenu(menuData);
          } else if (typeof menuData === "object") {
            const days = Object.keys(menuData);

            const processed = days.map((day) => ({
              day: day.toUpperCase(),
              breakfast: menuData[day].breakfast || "-",
              lunch: menuData[day].lunch || "-",
              dinner: menuData[day].dinner || "-"
            }));

            setFoodMenu(processed);
          } else {
            setFoodMenu([]);
          }
        } else {
          setFoodMenu([]);
        }
      } catch (err) {
        console.error("❌ Food menu error:", err);
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
    : [pg1, pg2, pg3, pg4];

  const prevImage = () => {
    setMainImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setMainImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // ✅ BOOK NOW CLICK
  const handleBookNow = () => {
    const token = localStorage.getItem("hlopgToken");
    const owner = localStorage.getItem("hlopgOwner");

    if (owner) {
      alert("You are logged in as Owner. You cannot book.");
      return;
    }

    if (!token) {
      alert("Please login first!");
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

  // ✅ CREATE BOOKING
  const handleCreateBooking = async (bookingData) => {
    try {
      setBookingLoading(true);

      const token = localStorage.getItem("hlopgToken");

      const payload = {
        hostel_id: parseInt(hostelId),
        user_name: bookingData.user.name,
        user_email: bookingData.user.email,
        user_phone: bookingData.user.phone,
        sharing_type: bookingData.sharing,
        booking_date: new Date().toISOString().split("T")[0]
      };

      console.log("📤 Booking Payload:", payload);

      const res = await api.post("/booking/request", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("📌 Booking Response:", res.data);

      if (res.data.success) {
        alert(
          `✅ Booking Request Sent!\n\nPG Owner will contact you soon.\n\nSharing: ${payload.sharing_type}`
        );

        localStorage.setItem("hlopgUser", JSON.stringify(bookingData.user));

        setIsPopupOpen(false);
      } else {
        alert("Booking failed: " + res.data.message);
      }
    } catch (err) {
      console.error("❌ Booking Error:", err);
      alert("Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  // ✅ BOOKING POPUP
  const BookingPopup = ({ onClose, onSubmit }) => {
    const [selectedSharing, setSelectedSharing] = useState("single");
    const [userName, setUserName] = useState(user?.name || "");
    const [userEmail, setUserEmail] = useState(user?.email || "");
    const [userPhone, setUserPhone] = useState(user?.phone || "");

    const handleSubmit = (e) => {
      e.preventDefault();

      if (!userName.trim()) {
        alert("Enter Name");
        return;
      }

      if (!userEmail.trim()) {
        alert("Enter Email");
        return;
      }

      if (!userPhone.trim() || userPhone.length < 10) {
        alert("Enter valid Phone Number");
        return;
      }

      const bookingUser = {
        id: user?.id || Date.now(),
        name: userName,
        email: userEmail,
        phone: userPhone
      };

      onSubmit({
        sharing: selectedSharing,
        user: bookingUser
      });
    };

    return (
      <div className="popup-overlay" onClick={onClose}>
        <div className="booking-popup" onClick={(e) => e.stopPropagation()}>
          <div className="popup-header">
            <h3>Send Booking Request</h3>
            <button className="close-popup" onClick={onClose}>
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            <label>Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter name"
            />

            <label>Email</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter email"
            />

            <label>Phone</label>
            <input
              type="tel"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="Enter phone"
            />

            <label>Select Sharing</label>
            <select
              value={selectedSharing}
              onChange={(e) => setSelectedSharing(e.target.value)}
            >
              <option value="single">1 Sharing</option>
              <option value="double">2 Sharing</option>
              <option value="triple">3 Sharing</option>
              <option value="four">4 Sharing</option>
              <option value="five">5 Sharing</option>
              <option value="six">6 Sharing</option>
            </select>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>

              <button type="submit" className="submit-btn" disabled={bookingLoading}>
                {bookingLoading ? "Sending..." : "Send Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // LOADING
  if (loading) return <div className="loading">Loading hostel details...</div>;
  if (!hostelData) return <div className="error">Hostel Not Found</div>;

  return (
    <div className="hostel-page">
      <div className="hostel-main">
        {/* LEFT IMAGES */}
        <div className="hostel-images">
          <div className="main-img">
            <button className="arrow-left" onClick={prevImage}>
              <FaChevronLeft />
            </button>

            <img src={images[mainImageIndex]} alt="Hostel" />

            <button className="arrow-right" onClick={nextImage}>
              <FaChevronRight />
            </button>
          </div>

          <div className="thumbnail-container">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumb"
                className={mainImageIndex === idx ? "active-thumb" : ""}
                onClick={() => setMainImageIndex(idx)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div className="hostel-details">
          <h2>{hostelData.hostel_name}</h2>
          <p>{hostelData.address}</p>

          <h3>Amenities</h3>

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
            {hostelData.facilities?.gym && (
              <span>
                <FaDoorClosed /> Gym
              </span>
            )}
          </div>

          {/* REVIEWS */}
          <div className="reviews-section">
            <h3>Reviews</h3>

            <div className="avg-rating">
              <span className="rating-number">{avgRating.toFixed(1)}</span>
              {renderStars(avgRating)}
              <span className="total-reviews">({totalReviews} reviews)</span>
            </div>

            {dummyReviews.map((review) => (
              <div key={review.id} className="review-item">
                <img src={review.avatar} alt="avatar" className="reviewer-avatar" />
                <div>
                  <h4>{review.name}</h4>
                  {renderStars(review.rating)}
                  <p>{review.comment}</p>
                  <small>{review.date}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOD MENU */}
      <div className="food-menu">
        <h2>Food Menu</h2>

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
              {foodMenu.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.day}</td>
                  <td>{item.breakfast}</td>
                  <td>{item.lunch}</td>
                  <td>{item.dinner}</td>
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
          No payment required. Owner will contact you.
        </p>
      </div>

      {/* POPUP */}
      {isPopupOpen && (
        <BookingPopup onClose={() => setIsPopupOpen(false)} onSubmit={handleCreateBooking} />
      )}
    </div>
  );
};

export default HostelPage;
