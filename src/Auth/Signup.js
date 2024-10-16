import React, { useState } from 'react';
import './Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { Api } from '../helpers/axios';
import './PopStyles.css';
import { FcGoogle } from "react-icons/fc";
import { ImFacebook2 } from "react-icons/im";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        secondName: '',
        email: '',
        password: '',
        contactNumber: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.post('/signup', formData);
            if (response.status === 201) {
                setMessage(response.data.message);
                setShowPopup(true);
                setFormData({
                    firstName: '',
                    secondName: '',
                    email: '',
                    password: '',
                    contactNumber: '',
                    confirmPassword: ''
                });
                setTimeout(() => {
                    setShowPopup(false);
                    navigate('/login');
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
        <section className="login-wrapper p-5">
            <div className="container-xxl">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8 col-sm-10">
                        <div className="card-body p-5">
                            <h1 className="signup-header">Sign Up</h1>
                            <p className="text-center mb-3 fs-3">Join us in shopping!!</p>
                            <div className="Signup-box">
                                {showPopup && (
                                    <div className="popup">
                                        <div className="popup-content-big">
                                            <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
                                            <p>{message}</p>
                                        </div>
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="d-flex justify-content-center">
                                        <input
                                            type="text"
                                            placeholder="Firstname"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Lastname"
                                            name="secondName"
                                            value={formData.secondName}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <input
                                            type="number"
                                            placeholder="Mobile"
                                            name="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Enter Email Address"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center mb-3" style={{ marginTop: '20px' }}>
                                        <p className="form-link m-0" style={{ fontSize: "18px", color: "#333" }}>
                                            Have an account?
                                        </p>
                                        <Link to="/login" className="form-link ms-2" style={{ fontSize: "18px", color: "#de57e5" }}>
                                            Sign In
                                        </Link>
                                    </div>
                                    <h3 className="text-center">Or</h3>
                                    <div className="text-center mt-3">
                                        <button type="button" className="icon-button"><FcGoogle /></button>
                                        <button type="button" className="icon-button"><ImFacebook2 className="facebook-icon" /></button>
                                    </div>
                                    <div className="d-grid gap-2 mt-4">
                                        <button type="submit" className="signup-button">Sign Up</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Signup;