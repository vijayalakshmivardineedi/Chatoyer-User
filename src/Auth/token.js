import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Token = () => {
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleBeforeUnload = () => {
    if (performance.navigation.type === 1) {
    } else {
      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
      localStorage.clear();
    }
  };

  const handleUserActivity = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    setLogoutTimer(
      setTimeout(() => {
        setShowModal(true);
      }, 300000)
    );
  };

  const handleLogout = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    localStorage.clear();
    setShowModal(false);
    navigate('/');
  };

  const handleClose = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    setShowModal(false);
  };

  useEffect(() => {
    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart'];

    const handleUserActivityWrapper = () => {
      handleUserActivity();
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivityWrapper);
    });

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivityWrapper);
      });
      window.removeEventListener('beforeunload', handleBeforeUnload);

      if (logoutTimer) {
        clearTimeout(logoutTimer);
      }
    };
  }, [logoutTimer]);

  return (
    <div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Session expired</p>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Token;
