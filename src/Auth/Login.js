import React, { useState } from 'react';
import './Login.css';
import { Api } from '../helpers/axios';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import './PopStyles.css';
const Login = () => {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false); 
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Api.post('/signin', formData);
            if (response.status === 201) {
                setMessage(response.data.message);
                setShowPopup(true);
                localStorage.setItem('UserToken', response.data.token);
                localStorage.setItem('User', JSON.stringify(response.data.user));
                setTimeout(() => {
                    setShowPopup(false); 
                    navigate('/'); 
                }, 1500);
            }
        } catch (error) {
            setMessage(error.response.data.message || error.response.data.error);
            setShowPopup(true); 
            setTimeout(() => {
                setShowPopup(false);
            }, 1500);
            console.error('Signin Error:', error);
        }
    };

    return (
        <div className='login-container'>
            <div className="login-box">
                <h2 className="login-title">Sign In</h2>
                <form onSubmit={handleSubmit}>
                <div className="login-box1">
                    <div className="input-group">
                        <label style={{ fontWeight: 'bold' }}>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="input-field" required />
                    </div>
                    <div className="input-group">
                        <label style={{ fontWeight: 'bold' }}>Password:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="input-field" required />
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px"}}>
                        <Link to="/Forgotpassword" className="link">Forgot Password?</Link>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <button type="submit" className="submit-button">Sign In</button>
                    </div>
                    </div>
                </form>
                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", fontSize: '18px' }}>
                    <p style={{marginRight: '5px'}}>Don't You Have Account?</p>
                    <Link to="/signup">Create Account</Link>
                </div>
                {showPopup && (
        <div className="popup">
          <div className="popup-content-big">
            <span className="close" onClick={() => setShowPopup(false)}>
              &times;
            </span>
            <p>{message}</p>
          </div>
        </div>
      )}
            </div>
        </div>
    );
};

export default Login;