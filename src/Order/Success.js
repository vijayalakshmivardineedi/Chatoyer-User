import React, { useEffect, useState } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import "./Success.css"; // Import CSS file for additional styling

const Success = () => {
  const [redirect, setRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRedirect(true); // Set redirect to true after 2000ms (2 seconds)
    }, 2000);

    return () => clearTimeout(timeout); // Clear the timeout if the component unmounts
  }, []);

  if (redirect) {
    navigate("/"); // Render a Link component to navigate after 2 seconds
    return null; // Return null to avoid rendering anything else while navigating
  }

  return (
    <div className="success-container">
      <div className="row justify-content-center">
        <div className="col text-center">
          <div className="check-icon">
            <BiCheckCircle />
          </div>
          <h4 className="success-heading">Payment Successful</h4>
          <h5 className="thank-you-text">Thank you for your order.</h5>
          <p className="update-text">
            We will send you an update from the Service Center on your
            Appointment.
          </p>
          <div className="back-to-home-link">
            <Link to="/">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
