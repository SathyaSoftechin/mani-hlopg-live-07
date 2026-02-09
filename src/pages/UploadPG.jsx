import React, { useState } from "react";
import "./UploadPG.css";
import api from "../api";
import RoomSetupPopup from "../components/RoomSetupPopup";

import {
  FaWifi,
  FaFan,
  FaBed,
  FaUtensils,
  FaBroom,
  FaShower,
  FaPlusCircle,
  FaTrash,
  FaUpload,
} from "react-icons/fa";

const UploadPG = () => {
  const ownerId = localStorage.getItem("ownerId"); // Make sure ownerId exists
  const ownerName = localStorage.getItem("ownerName") || "Owner";

  const [showRoomPopup, setShowRoomPopup] = useState(false);

  // Basic fields
  const [hostelName, setHostelName] = useState("");
  const [description, setDescription] = useState("");
  const [pgType, setPgType] = useState("Men");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // Rooms and rent
  const [rent, setRent] = useState("");
  const [price, setPrice] = useState(""); // optional if backend uses it
  const [advanceAmount, setAdvanceAmount] = useState("");

  // Rooms details
  const [totalRooms, setTotalRooms] = useState(20);
  const [occupiedRooms, setOccupiedRooms] = useState(0);
  const [vacantRooms, setVacantRooms] = useState(20);

  // Facilities
  const [facilities, setFacilities] = useState({
    wifi: false,
    fan: false,
    bed: false,
    food: false,
    cleaning: false,
    bathroom: false,
  });

  // Rules
  const [rules, setRules] = useState(["No Alcohol"]);

  // Sharing type data
  const [sharingData, setSharingData] = useState({
    single: "",
    double: "",
    triple: "",
    four: "",
  });

  // Food Menu
  const [foodMenu, setFoodMenu] = useState({
    monday: { breakfast: "", lunch: "", dinner: "" },
    tuesday: { breakfast: "", lunch: "", dinner: "" },
    wednesday: { breakfast: "", lunch: "", dinner: "" },
    thursday: { breakfast: "", lunch: "", dinner: "" },
    friday: { breakfast: "", lunch: "", dinner: "" },
    saturday: { breakfast: "", lunch: "", dinner: "" },
    sunday: { breakfast: "", lunch: "", dinner: "" },
  });

  // Images
  const [pgImageFiles, setPgImageFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  // Handle facility toggle
  const handleFacilityChange = (key) => {
    setFacilities((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle rules add/remove
  const addRule = () => {
    setRules((prev) => [...prev, ""]);
  };

  const removeRule = (index) => {
    const updated = rules.filter((_, i) => i !== index);
    setRules(updated);
  };

  const updateRule = (index, value) => {
    const updated = [...rules];
    updated[index] = value;
    setRules(updated);
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setPgImageFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Handle sharing price update
  const handleSharingChange = (key, value) => {
    setSharingData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle food menu update
  const handleFoodMenuChange = (day, meal, value) => {
    setFoodMenu((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: value,
      },
    }));
  };

  // Submit Hostel
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ownerId) {
      alert("Owner ID missing! Please login again.");
      return;
    }

    if (!hostelName || !address || !city || !state || !rent) {
      alert("Please fill required fields!");
      return;
    }

    try {
      const formData = new FormData();

      // Basic fields
      formData.append("hostelName", hostelName);
      formData.append("description", description);
      formData.append("pgType", pgType);

      formData.append("address", address);
      formData.append("area", area);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("pincode", pincode);

      // Rent details
      formData.append("rent", rent);
      formData.append("price", price || rent);
      formData.append("advanceAmount", advanceAmount || "0");

      // Owner details
      formData.append("ownerId", ownerId);
      formData.append("ownerName", ownerName);

      // Rooms
      formData.append("totalRooms", totalRooms);
      formData.append("occupiedRooms", occupiedRooms);
      formData.append("vacantRooms", vacantRooms);

      // JSON data
      formData.append("facilities", JSON.stringify(facilities));
      formData.append("sharingData", JSON.stringify(sharingData));
      formData.append("foodMenu", JSON.stringify(foodMenu));
      formData.append("rules", JSON.stringify(rules));

      // Images upload (IMPORTANT)
      pgImageFiles.forEach((file) => {
        formData.append("images", file); // backend should accept MultipartFile[] images
      });

      // Debug check
      console.log("📌 FormData values:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // API call
      const res = await api.post("/hostel/addhostel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Hostel uploaded:", res.data);
      alert("Hostel Uploaded Successfully!");

      // Reset all fields
      setHostelName("");
      setDescription("");
      setPgType("Men");
      setAddress("");
      setArea("");
      setCity("");
      setState("");
      setPincode("");
      setRent("");
      setPrice("");
      setAdvanceAmount("");
      setTotalRooms(20);
      setOccupiedRooms(0);
      setVacantRooms(20);

      setFacilities({
        wifi: false,
        fan: false,
        bed: false,
        food: false,
        cleaning: false,
        bathroom: false,
      });

      setRules(["No Alcohol"]);

      setSharingData({
        single: "",
        double: "",
        triple: "",
        four: "",
      });

      setFoodMenu({
        monday: { breakfast: "", lunch: "", dinner: "" },
        tuesday: { breakfast: "", lunch: "", dinner: "" },
        wednesday: { breakfast: "", lunch: "", dinner: "" },
        thursday: { breakfast: "", lunch: "", dinner: "" },
        friday: { breakfast: "", lunch: "", dinner: "" },
        saturday: { breakfast: "", lunch: "", dinner: "" },
        sunday: { breakfast: "", lunch: "", dinner: "" },
      });

      setPgImageFiles([]);
      setPreviewImages([]);
    } catch (error) {
      console.error("❌ Upload error:", error);
      alert("Upload Failed! Check console.");
    }
  };

  return (
    <div className="uploadpg-container">
      <h2 className="uploadpg-title">Upload PG / Hostel</h2>

      <form className="uploadpg-form" onSubmit={handleSubmit}>
        {/* Hostel Name */}
        <label>Hostel Name *</label>
        <input
          type="text"
          value={hostelName}
          onChange={(e) => setHostelName(e.target.value)}
          placeholder="Enter hostel name"
          required
        />

        {/* Description */}
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />

        {/* PG Type */}
        <label>PG Type</label>
        <select value={pgType} onChange={(e) => setPgType(e.target.value)}>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Both">Both</option>
        </select>

        {/* Address */}
        <label>Address *</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter address"
          required
        />

        <label>Area</label>
        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Enter area"
        />

        <label>City *</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          required
        />

        <label>State *</label>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="Enter state"
          required
        />

        <label>Pincode</label>
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter pincode"
        />

        {/* Rent */}
        <label>Rent *</label>
        <input
          type="number"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          placeholder="Enter rent amount"
          required
        />

        <label>Advance Amount</label>
        <input
          type="number"
          value={advanceAmount}
          onChange={(e) => setAdvanceAmount(e.target.value)}
          placeholder="Enter advance amount"
        />

        {/* Rooms */}
        <label>Total Rooms</label>
        <input
          type="number"
          value={totalRooms}
          onChange={(e) => setTotalRooms(e.target.value)}
        />

        <label>Occupied Rooms</label>
        <input
          type="number"
          value={occupiedRooms}
          onChange={(e) => setOccupiedRooms(e.target.value)}
        />

        <label>Vacant Rooms</label>
        <input
          type="number"
          value={vacantRooms}
          onChange={(e) => setVacantRooms(e.target.value)}
        />

        {/* Facilities */}
        <h3>Facilities</h3>
        <div className="facilities-box">
          <button type="button" onClick={() => handleFacilityChange("wifi")}>
            <FaWifi /> Wifi {facilities.wifi ? "✅" : "❌"}
          </button>

          <button type="button" onClick={() => handleFacilityChange("fan")}>
            <FaFan /> Fan {facilities.fan ? "✅" : "❌"}
          </button>

          <button type="button" onClick={() => handleFacilityChange("bed")}>
            <FaBed /> Bed {facilities.bed ? "✅" : "❌"}
          </button>

          <button type="button" onClick={() => handleFacilityChange("food")}>
            <FaUtensils /> Food {facilities.food ? "✅" : "❌"}
          </button>

          <button type="button" onClick={() => handleFacilityChange("cleaning")}>
            <FaBroom /> Cleaning {facilities.cleaning ? "✅" : "❌"}
          </button>

          <button type="button" onClick={() => handleFacilityChange("bathroom")}>
            <FaShower /> Bathroom {facilities.bathroom ? "✅" : "❌"}
          </button>
        </div>

        {/* Sharing */}
        <h3>Sharing Prices</h3>
        <div className="sharing-box">
          <label>Single</label>
          <input
            type="number"
            value={sharingData.single}
            onChange={(e) => handleSharingChange("single", e.target.value)}
          />

          <label>Double</label>
          <input
            type="number"
            value={sharingData.double}
            onChange={(e) => handleSharingChange("double", e.target.value)}
          />

          <label>Triple</label>
          <input
            type="number"
            value={sharingData.triple}
            onChange={(e) => handleSharingChange("triple", e.target.value)}
          />

          <label>Four Sharing</label>
          <input
            type="number"
            value={sharingData.four}
            onChange={(e) => handleSharingChange("four", e.target.value)}
          />
        </div>

        {/* Rules */}
        <h3>Rules</h3>
        <div className="rules-box">
          {rules.map((rule, index) => (
            <div key={index} className="rule-row">
              <input
                type="text"
                value={rule}
                onChange={(e) => updateRule(index, e.target.value)}
                placeholder="Enter rule"
              />
              <button type="button" onClick={() => removeRule(index)}>
                <FaTrash />
              </button>
            </div>
          ))}

          <button type="button" onClick={addRule} className="add-rule-btn">
            <FaPlusCircle /> Add Rule
          </button>
        </div>

        {/* Food Menu */}
        <h3>Food Menu</h3>
        {Object.keys(foodMenu).map((day) => (
          <div key={day} className="food-day-box">
            <h4>{day.toUpperCase()}</h4>

            <input
              type="text"
              placeholder="Breakfast"
              value={foodMenu[day].breakfast}
              onChange={(e) =>
                handleFoodMenuChange(day, "breakfast", e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Lunch"
              value={foodMenu[day].lunch}
              onChange={(e) =>
                handleFoodMenuChange(day, "lunch", e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Dinner"
              value={foodMenu[day].dinner}
              onChange={(e) =>
                handleFoodMenuChange(day, "dinner", e.target.value)
              }
            />
          </div>
        ))}

        {/* Images */}
        <h3>Upload Images</h3>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />

        <div className="preview-box">
          {previewImages.map((img, index) => (
            <img key={index} src={img} alt="preview" className="preview-img" />
          ))}
        </div>

        {/* Submit */}
        <button type="submit" className="upload-btn">
          <FaUpload /> Upload Hostel
        </button>
      </form>

      {/* Popup (optional) */}
      {showRoomPopup && (
        <RoomSetupPopup
          onClose={() => setShowRoomPopup(false)}
          totalRooms={totalRooms}
        />
      )}
    </div>
  );
};

export default UploadPG;
