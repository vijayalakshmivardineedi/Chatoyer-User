import React, { useState, useEffect } from "react";
import axiosInstance from "../helpers/axios";
import './Checkout.css';
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const Useremail = JSON.parse(localStorage.getItem('User'));
  const email = Useremail.email;
  const userId = Useremail._id;
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [newAddress, setNewAddress] = useState({
    plotNo: "",
    streetName: "",
    district: "",
    state: "",
    country: "",
    pincode: "",
    contactNumber: "",
    name: "",
  });
  const [addingAddress, setAddingAddress] = useState(false);

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const fetchUserAddresses = async () => {
    try {
      const response = await axiosInstance.get(`/getUserByEmail/${email}`);
      console.log(response.data.user.address);
      setAddresses(response.data.user.address || []);
    } catch (error) {
      console.error("Error fetching user addresses:", error);
    }
  };

  const handleAddressChange = (index) => {
    setSelectedAddressIndex(index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleAddAddress = () => {
    setAddingAddress(true);
  };

  const handleSaveAddress = async () => {
    try {
      const response = await axiosInstance.put("/addAddress", { address: newAddress, userId });
      if (response.status === 201) {
        setMessage(response.data.message);
        setShowPopup(true);
        setNewAddress({
          plotNo: "",
          streetName: "",
          district: "",
          state: "",
          country: "",
          pincode: "",
          contactNumber: "",
          name: "",
        });
        setAddingAddress(false);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
        fetchUserAddresses();
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || "An error occurred while adding the address");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1500);
      console.error("Error:", error);
    }
  };

  const handleNext = async () => {
    try {
      const selectedAddress = addresses[selectedAddressIndex];
      const response = await axiosInstance.put("/updateCheckoutAddress", { userId, newAddress: selectedAddress });
      if (response.status === 201) {
        setMessage(response.data.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/Order");
        }, 1500);
      }
    } catch (error) {
      setMessage(error.response.data.message || error.response.data.error);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1500);
    }
  };

  return (
    <div className="Checkout-Form">
      <h1 style={{fontSize:'30px', fontWeight:'600',color:'#4f3267' }}>Select Delivery Address</h1>
      <div>
        {addresses.map((address, index) => (
          <div className="select-container" key={index}>
            <label>
              <input
                type="radio"
                name="address"
                value={index}
                checked={selectedAddressIndex === index}
                onChange={() => handleAddressChange(index)}
              />
              <b style={{fontFamily: "Domine, serif"}}>Address-{index + 1}:</b> {address.plotNo}, {address.streetName}, {address.district},<br />
              {address.state}, {address.country}, {address.pincode}<br />
              {address.contactNumber}, {address.name}
            </label>
          </div>
        ))}
      </div>
      <div >
        {addingAddress && (
          <div className="add-container">
            <h3 style={{fontFamily:"Domine, serif", fontWeight:'bold',fontSize: '20px'}}>Add Address</h3>
            <div className="form-grid">
              <input
                type="text"
                name="plotNo"
                placeholder="Plot No"
                value={newAddress.plotNo}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="streetName"
                placeholder="Street Name"
                value={newAddress.streetName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="district"
                placeholder="District"
                value={newAddress.district}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={newAddress.state}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={newAddress.pincode}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={newAddress.country}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                value={newAddress.contactNumber}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={newAddress.name}
                onChange={handleInputChange}
              />
            </div>
            <button className="button" onClick={handleSaveAddress}>Save Address</button>
          </div>
        )}
      </div>
      <div className="button-container">
        <button className="button" onClick={handleAddAddress}>Add Address</button>
        <button className="button" onClick={handleNext}>Update</button>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content-big">
            <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
            <p>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;