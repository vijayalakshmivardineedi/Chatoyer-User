import React, { useState, useEffect } from 'react';
import './ForgotPassword.css'
import { Api } from '../helpers/axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const ForgotPassword = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1);
    const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the popup

    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false); // Hide the popup after 2 seconds
            }, 1500);

            return () => clearTimeout(timer); // Clear the timer when component unmounts
        }
    }, [showPopup]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        else if (name === 'code') setCode(value);
        else if (name === 'password') setPassword(value);
        else if (name === 'confirmPassword') setConfirmPassword(value);
    };

    const handleSendVerificationCode = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.post('/forgotPassword', { email });
            if (response.status === 201) {
                setStep(2); // Move to the next step
                setShowPopup(true); // Show the popup
                setMessage('Verification code sent to your email');
            }
        } catch (error) {
            setMessage('Error: Unable to send verification code');
            console.error('Send Verification Code Error:', error);
            setShowPopup(true); // Show the popup
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setShowPopup(true); // Show the popup
            return;
        }
        try {
            const response = await Api.post('/verifyCodeAndResetPassword', { email, code, newPassword: password });
            if (response.status === 201) {
                setMessage('Password reset successfully');
                setShowPopup(true); // Show the popup
                setTimeout(() => {
                    setShowPopup(false); // Hide the popup after 2 seconds
                    navigate('/Login'); // Navigate to Dashboard
                }, 1500);
            }
        } catch (error) {
            setMessage('Error: Unable to reset password');
            console.error('Reset Password Error:', error);
            setShowPopup(true); // Show the popup
        }
    };

    return (
        <div className="forgot-container">
            {step === 1 ? (
                <>
                  <div className='forgot-box '>
                    <h2 className='forgot-header'>Forgot Password?</h2>
                        <form onSubmit={handleSendVerificationCode}>
                            <div className="login-box1">
                            <div className="forgot-input-row">
                                <input className="forgot-input-field" type="email" name="email" value={email} onChange={handleChange} placeholder="Enter your email" required />
                            </div>
                            <div className="reset-button-row">
                                <button type="submit" className='reset-button'>Send Code</button>
                            </div>
                            </div>
                        </form>
                    </div>
                </>
            ) : (
                <>
                <div style={{backgroundColor:"white",height:"40vh",borderRadius:"10px",boxShadow:"0 0 15px rgba(0, 0, 0, 0.1)"
    }}> <div className='reset-box '>
                    <h3 style={{color:"#4F3267",fontSize:"30px",}}>Verify And Reset Password</h3>
                    <form onSubmit={handleResetPassword}>
                    <div className="login-box2">
                        <div className="forgot-input-row">
                            <input type="text" name="code" value={code} onChange={handleChange} className="forgot-input-field" placeholder="Enter verification code" required />
                        </div>
                        <div className="forgot-input-row">
                            <input type="password" name="password" value={password} onChange={handleChange} className="forgot-input-field" placeholder="Enter new password" required />
                        </div>
                        <div className="forgot-input-row">
                            <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleChange} className="forgot-input-field" placeholder="Re-enter new password" required />
                        </div>
                        <div className="reset-button-row">
                            <button type="submit" className="reset-button">Reset</button>
                        </div>
                        </div>
                    </form>
                    </div>
                    </div>

                </>
            )}
            {showPopup && ( // Display popup only if showPopup is true
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

export default ForgotPassword;