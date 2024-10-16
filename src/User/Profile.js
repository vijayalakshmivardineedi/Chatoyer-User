import React, { useState, useEffect } from 'react';
import axiosInstance, { ImagebaseURL } from '../helpers/axios';
import './Profile.css';

const Profile = () => {
  const Useremail = JSON.parse(localStorage.getItem('User'));
  const UserId = Useremail._id;

  const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuEiaDNDqRo6K0Zn_NlRJjAde-B1zommEhIg&s';
  const email = Useremail.email;
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    contactNumber: '',
    address: [
      {
        name:'',
        plotNo: '',
        streetName: '',
        district: '',
        state: '',
        country: '',
        pincode: '',
        contactNumber: '',
      }
    ],
    profilePicture: null
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get(`/getUserByEmail/${email}`);
      const userData = response.data.user;
      setFormData({
        firstName: userData.firstName,
        secondName: userData.secondName,
        contactNumber: userData.contactNumber,
        address: userData.address || [],
        profilePicture: userData.profilePicture 
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (index === undefined) {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else {
      const updatedAddress = [...formData.address];
      updatedAddress[index] = {
        ...updatedAddress[index],
        [name]: value
      };
      setFormData(prevState => ({
        ...prevState,
        address: updatedAddress
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        userId: UserId,
        firstName: formData.firstName,
        secondName: formData.secondName,
        contactNumber: formData.contactNumber,
        address: JSON.stringify(formData.address)
      };

      if (formData.profilePicture) {
        await uploadProfilePicture(formData.profilePicture);
      }

      const response = await axiosInstance.put("/updateProfile", userData);
      if (response.status === 201) {
        setMessage(response.data.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          fetchUserData();
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

  const uploadProfilePicture = async (file) => {
    console.log(UserId);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await axiosInstance.put(`/uploadOrChangeImage/${UserId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        setMessage(response.data.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
        fetchUserData();
      }
    } catch (error) {
      setMessage(error.response.data.message || error.response.data.error);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1500);
    }
  };

  const deleteProfilePicture = async () => {
    try {
      const response = await axiosInstance.delete(`/deleteProfileImage/${UserId}`);
      if (response.status === 200) {
        setMessage(response.data.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
        fetchUserData();
      }
    } catch (error) {
      setMessage(error.response.data.message || error.response.data.error);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1500);
    }
  };

  const addAddress = () => {
    setFormData({
      ...formData,
      address: [...formData.address, {
        name: '',
        plotNo: '',
        streetName: '',
        district: '',
        state: '',
        country: '',
        pincode: '',
        contactNumber: ''
      }]
    });
  };

  const removeAddress = (index) => {
    const updatedAddress = [...formData.address];
    updatedAddress.splice(index, 1);
    setFormData({ ...formData, address: updatedAddress });
  };

  return (
    <div className="Form">
      <div className="profile-image-container">
          <img
            className="profile-image"
            src={formData.profilePicture ? `${ImagebaseURL}${formData.profilePicture}`:defaultAvatar}
            alt="Selected Image"
          />
      </div>
      <div>
          <button className="update-button" onClick={() => document.getElementById('choose-file').click()}>
            Update Picture
          </button>
        <input
          id="choose-file"
          type="file"
          name="profilePicture"
          onChange={e => uploadProfilePicture(e.target.files[0])}
          accept="image/*"
          style={{ display: 'none' }}
        />
        {formData.profilePicture && (
          <button className="update-button" onClick={deleteProfilePicture}>
            Delete Picture
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-column">
          
            <input
              type="text"
              name="firstName"
              label ="First Name"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              style={{padding:'5px'}}
            />
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Contact Number"
              required
              style={{padding:'5px'}}
            />
          </div>
          <div className="form-column">
            <input
              type="text"
              name="secondName"
              value={formData.secondName}
              onChange={handleChange}
              placeholder="Second Name"
              required
              style={{padding:'5px'}}
            />
            <input
              type="text"
              name="email"
              defaultValue={email}
              placeholder="Email"
              readOnly
              style={{padding:'5px'}}
            />
          </div>
        </div>
        <div style={{ margin: "20px 0" }}>
          {formData.address[0] && (
            <div>
              <h1>Address :  </h1>
              <div className="form-grid" >
                <div className="form-column">
                <input
                    type="text"
                    name="name"
                    value={formData.address[0].name}
                    onChange={(e) => handleChange(e, 0)}
                    placeholder="Building Name"
                    required
                    style={{padding:'5px'}}
                  />
                  <input
                    type="text"
                    name="plotNo"
                    value={formData.address[0].plotNo}
                    onChange={(e) => handleChange(e, 0)}
                    placeholder="Plot No"
                    required
                    style={{padding:'5px'}}
                  />
                  <input
                    type="text"
                    name="district"
                    value={formData.address[0].district}
                    onChange={(e) => handleChange(e,0)}
                    placeholder="District"
                    required
                    style={{padding:'5px'}}
                  />
                  <input
                    type="text"
                    name="country"
                    value={formData.address[0].country}
                    onChange={(e) => handleChange(e, 0)}
                    placeholder="Country"
                    required
                    style={{padding:'5px'}}
                  />
                  
                </div>
                <div className="form-column">
                  <input
                    type="text"
                    name="streetName"
                    value={formData.address[0].streetName}
                    onChange={(e) => handleChange(e, 0)}
                    placeholder="Street Name"
                    required
                    style={{padding:'5px'}}
                  />
                  
                  <input
                    type="text"
                    name="pincode"
                    value={formData.address[0].pincode}
                    onChange={(e) => handleChange(e, 0)}
                    placeholder="Pincode"
                    required
                    style={{padding:'5px'}}
                  />
                  <input
                    type="text"
                    name="state"
                    value={formData.address[0].state}
                    onChange={(e) => handleChange(e, 0)}
                    placeholder="State"
                    required
                    style={{padding:'5px'}}
                  />
                 
                </div>
              </div>
              </div>
          )}
        </div>
        <div className="form-column">
          <button className="update-profile-button" type="submit">Update Profile</button>
        </div>
      </form>
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

export default Profile;