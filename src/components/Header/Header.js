import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import "./PopStyles.css";
import Dropdown from "react-bootstrap/Dropdown";
import { BiSolidCart, BiSolidUserCircle } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import LogoImage from "../../images/Logo/Logo.png";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import axiosInstance from "../../helpers/axios";
import Marquee from "react-fast-marquee";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermId, setSearchTermId] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();

  const auth = localStorage.getItem("UserToken") ? true : false;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/getProductNamesAndId");
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearchInputChange = (value) => {
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    if (Array.isArray(products)) {
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredProducts);
    }
  };

  const handleSuggestionClick = (id, name) => {
    navigate(`/description/${id}`);
    setSearchTerm("");
    setSearchTermId("");
    setSuggestions([]);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setSuggestions([]);
      setShowUserDropdown(false);
    }
  };

  const renderSuggestions = () => {
    if (suggestions.length === 0) {
      return null;
    }

    const limitedSuggestions = suggestions.slice(0, 10);

    return (
      <Dropdown.Menu show={limitedSuggestions.length > 0} 
      ref={dropdownRef}
      className="suggestions-dropdown"
   
      >
        {limitedSuggestions.map((suggestion) => {
          const index = suggestion.name.toLowerCase().indexOf(searchTerm.toLowerCase());
          const prefix = suggestion.name.slice(0, index);
          const highlight = suggestion.name.slice(index, index + searchTerm.length);
          const suffix = suggestion.name.slice(index + searchTerm.length);

          return (
            <Dropdown.Item
              key={suggestion._id}
              onClick={() => handleSuggestionClick(suggestion._id, suggestion.name)}
              className="text-dark"
            >
              {prefix}<span className="highlight">{highlight}</span>{suffix}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    );
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      setMessage("Logged out successfully.");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleWishlistClick = () => {
    if (!auth) {
      alert("Please log in to access Wishlist.");
      return;
    }
    navigate("/Wishlist");
  };
  const handleSignup = () => {
    navigate("/Signup");
    setShowUserDropdown(false);
  };
  const handleLogin = () => {
    navigate("/Login");
    setShowUserDropdown(false);
  };

  const handleCartClick = () => {
    if (!auth) {
      alert("Please log in to access Cart.");
      return;
    }
    navigate("/Cart");
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const isActive = (category) => {
    const path = location.pathname.toLowerCase();
    const categoryPath = `/${category.toLowerCase()}`;
    return path === categoryPath || path.startsWith(`${categoryPath}/`);
  };
  return (
    <>
      <nav className="custom-navbar">
        <div className="marginnav p-4 text-white text-center fs-5" style={{ marginLeft: '108px' }}>
          <Marquee speed={100} gradient={false}>
            <h3 className="announcement">
              <span>Today: Gold 18kt/gram = &#x20B9; 5,498.87/- </span>
              <span> Gold 22kt/gram = &#x20B9; 6,695.36/- </span>
              <span> Gold 24kt/gram = &#x20B9; 7,175.36/-</span>
            </h3>
          </Marquee>
        </div>
      </nav>

      <div className="navbar">
        <Navbar expand="lg" bg="white" className="py-2 shadow-sm">
          <div className="container-fluid">
            <Navbar.Brand className="fs-3">
              <div className="logo-container">
                <Nav.Link as={Link} to="/">
                  <img className="Logo" src={LogoImage} alt="logo" />
                </Nav.Link>
              </div>
            </Navbar.Brand>
            <div className="chatoyer">
              <Nav.Link as={Link} to="/">
                Chatoyer
              </Nav.Link>
            </div>
            <Navbar.Toggle aria-controls="navbarSupportedContent" />
            <Navbar.Collapse id="navbarSupportedContent">
              <Nav className="p-2 mx-auto mb-0 mb-lg-0">
                <Nav.Item className="navbar-nav fs-4 p-2">
                  <Nav.Link as={Link} to="/Rings" className="nav-link fs-4">
                    <p className={`headercat ${isActive("rings") ? "active" : ""}`}>RINGS</p>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="navbar-nav fs-4 p-2">
                  <Nav.Link as={Link} to="/Earrings" className="nav-link fs-4">
                    <p className={`headercat ${isActive("earrings") ? "active" : ""}`}>EARRINGS</p>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="navbar-nav fs-4 p-2">
                  <Nav.Link as={Link} to="/Pendants" className="nav-link fs-4">
                    <p className={`headercat ${isActive("pendants") ? "active" : ""}`}>PENDANTS</p>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="navbar-nav fs-4 p-2">
                  <Nav.Link as={Link} to="/Chains" className="nav-link fs-4">
                    <p className={`headercat ${isActive("chains") ? "active" : ""}`}>CHAINS</p>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="navbar-nav fs-4 p-2">
                  <Nav.Link as={Link} to="/Bangles" className="nav-link fs-4">
                    <p className={`headercat ${isActive("bangles") ? "active" : ""}`}>BANGLES</p>
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <div className="search-container">
                <input
                  type="text"
                  className="search-bar"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    handleSearchInputChange(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSuggestionClick(searchTermId, searchTerm);
                    }
                  }}
                />
                {renderSuggestions()}
              </div>
              <div className="menu p-2">
                <Dropdown show={showUserDropdown} onToggle={toggleUserDropdown}>
                  <Dropdown.Toggle variant="light" id="user-dropdown" className="header-buttons p-2">
                    <BiSolidUserCircle className="react-icon-header" style={{ fontSize: '28px' }} />
                  </Dropdown.Toggle>
                  {auth ? (
                    <Dropdown.Menu className="drop-menu fs-2" style={{ width: "100px", right: 50, transform: "translateX(-70%) translateY(10%)" }}>
                    <Dropdown.Item as={Link} to="/Profile" className="custom-dropdown-item">Profile</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/MyOrders" className="custom-dropdown-item">MyOrders</Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout} className="custom-dropdown-item">Logout</Dropdown.Item>
                  </Dropdown.Menu>
                  
                  ) : (
                    <Dropdown.Menu className="drop-menu fs-2" style={{ width: "400px", right: 50, transform: "translateX(-70%) translateY(10%)" }}>
                      <h1 style={{ textAlign: "center", fontWeight: "600", fontSize: "30px" }}>Your Account</h1>
                      <h2 style={{ textAlign: "center" }}>Access account & manage your orders.</h2>

                      <button className="header-LS-button" onClick={handleSignup}>
                        Sign Up
                      </button>
                      <button className="header-LS-button" onClick={handleLogin}>
                        Log In
                      </button>
                    </Dropdown.Menu>
                  )}
                </Dropdown>
              </div>
              <div className="menu p-2">
                <button onClick={handleWishlistClick} className="header-buttons">
                  <AiFillHeart className="react-icon-header" />
                </button>
              </div>
              <div className="menu p-2">
                <button onClick={handleCartClick} className="header-buttons">
                  <BiSolidCart className="react-icon-header" />
                </button>
              </div>
            </Navbar.Collapse>
          </div>
        </Navbar>
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
    </>
  );
};

export default Header;
