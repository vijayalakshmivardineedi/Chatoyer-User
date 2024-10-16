import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./WishList.css";
import { useNavigate } from "react-router-dom";
import axiosInstance, { ImagebaseURL } from "../../helpers/axios";

const WishList = () => {
  const { _id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const userId = JSON.parse(localStorage.getItem("User")); // Get userId from localStorage
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(''); // Define setMessage
  const [showPopup, setShowPopup] = useState(false); // Define setShowPopup
  const [finalTotal, setFinalTotal] = useState(0);
  const [selectedGoldType, setSelectedGoldType] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedDiamondType, setSelectedDiamondType] = useState(null);
  const [selectedGoldKt, setSelectedGoldKt] = useState("");
  const [selectedStoneType, setSelectedStoneType] = useState("");
  console.log(finalTotal)
  console.log(userId)
  console.log(selectedGoldType, selectedSize, selectedDiamondType, selectedGoldKt,selectedStoneType)

  const fetchWishlist = async () => {
    try {
      const response = await axiosInstance.get("/getWishlistItems");
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const wishlistData = response.data;
        setWishlistItems(wishlistData);
  
        // Initialize objects to store selected options for each product ID
        let selectedGoldTypes = {};
        let selectedSizes = {};
        let selectedDiamondTypes = {};
        let selectedGoldKts = {};
        let selectedStoneTypes = {};
  
        // Iterate over each item in the wishlist and update the selected options objects
        wishlistData.forEach(item => {
          const productId = item.product._id;
          selectedGoldTypes[productId] = item.goldType;
          selectedSizes[productId] = item.sizes;
          selectedDiamondTypes[productId] = item.diamondType;
          selectedGoldKts[productId] = item.goldKt;
          selectedStoneTypes[productId] = item.stoneType;
        });
  
        // Set state with the selected options objects
        setSelectedGoldType(selectedGoldTypes);
        setSelectedSize(selectedSizes);
        setSelectedDiamondType(selectedDiamondTypes);
        setSelectedGoldKt(selectedGoldKts);
        setSelectedStoneType(selectedStoneTypes);
  
      } else {
        console.error("Wishlist items not found!");
      }
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist(); // Initial fetch when component mounts
  }, [_id]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await axiosInstance.post("/removeWishlistItems", { productId });

      if (response.status === 201) {
        setMessage(response.data.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
        fetchWishlist();
      } else {
        // Handle unexpected response status
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An error occurred while removing from wishlist"
      );
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1500);
      console.error("Error:", error);
    }
  };

  const handleAddToCart = async (curElm) => {
    console.log(curElm.product && curElm.product._id);
    try {
      if (!userId) {
        navigate("/Login");
      } else {
        const requestBody = {
          user: userId._id,
          cartItem: [
            {
              quantity,
              product: curElm.product._id,
              sizes: selectedSize[curElm.product._id], // Include selected size value
              goldType: selectedGoldType[curElm.product._id], // Include selected gold type based on product ID
              goldKt: selectedGoldKt[curElm.product._id], // Include selected gold karat based on product ID
              diamondType: selectedDiamondType[curElm.product._id], // Include selected diamond type based on product ID
              stoneType: selectedStoneType[curElm.product._id], // Include selected stone type based on product ID
            },
          ],
        };
  
        const response = await axiosInstance.post("/addItemToCart", requestBody);
        if (response.status === 201) {
          setMessage(response.data.message);
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate("/Cart");
          }, 1500);
        }
      }
    } catch (error) {
      setMessage(error.response.data.message || error.response.data.error);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1500);
    }
  };
  

  useEffect(() => {
    const calculateFinalTotals = async () => {
      const newFinalTotals = {};
      for (const curElm of wishlistItems) {
        const total = calculateFinalTotal(curElm);
        newFinalTotals[curElm.product._id] = total;
      }
      setFinalTotal(newFinalTotals);
    };
    calculateFinalTotals();
  }, [wishlistItems]);

  const calculateFinalTotal = (curElm) => {
    if (!curElm.product) {
      return 0;
    }

    let goldKtPrice = 0;
    let goldTypePrice = 0;
    let diamondTypePrice = 0;
    let sizePrice = 0;
    let makingCharges = 0;
    let gst = 0;
    let offer = 0;
    let stonePrice = 0;

    if (curElm.product.goldKt && curElm.product.goldKt.length > 0) {
      const selectedGoldKtValue = selectedGoldKt[curElm.product._id]; // Extracting the selected gold karat value
      const matchedGoldKt = curElm.product.goldKt.find(gold => gold.goldKt === selectedGoldKtValue); // Finding the matching goldKt object
      if (matchedGoldKt) {
        goldKtPrice = parseFloat(matchedGoldKt.price); // Setting goldKtPrice based on the matched goldKt object
      }
    }

    if (curElm.product.goldType && curElm.product.goldType.length > 0) {
      const selectedGoldTypeValue = selectedGoldType[curElm.product._id];
      console.log(selectedGoldTypeValue)
      const matchedGoldType = curElm.product.goldType.find(type => type.goldtype === selectedGoldTypeValue); // Finding the matching goldType object
      console.log(matchedGoldType)
      if (matchedGoldType) {
        goldTypePrice = parseFloat(matchedGoldType.price); // Setting goldTypePrice based on the matched goldType object
      }
    }

    if (curElm.product.diamondType && curElm.product.diamondType.length > 0) {
      const selectedDiamondTypeValue = selectedDiamondType[curElm.product._id];
      console.log(selectedDiamondTypeValue)
      const matchedDiamondType = curElm.product.diamondType.find(diamond => diamond.type === selectedDiamondTypeValue); // Finding the matching diamondType object
      console.log(matchedDiamondType)
      if (matchedDiamondType) {
        diamondTypePrice = parseFloat(matchedDiamondType.price); // Setting diamondTypePrice based on the matched diamondType object
      }
    }

    if (curElm.product.sizes && curElm.product.sizes.length > 0) {
      const selectedSizeValue = selectedSize[curElm.product._id];
      console.log(selectedSizeValue)
      const matchedSize = curElm.product.sizes.find(size => size.size === selectedSizeValue); // Finding the matching size object
      console.log(matchedSize)
      if (matchedSize) {
        sizePrice = parseFloat(matchedSize.price); // Setting sizePrice based on the matched size object

      }
    }

    if (curElm.product.stoneType && curElm.product.stoneType.length > 0) {
      const selectedStoneTypeValue = selectedStoneType[curElm.product._id]; console.log(selectedStoneTypeValue)
      const matchedStoneType = curElm.product.stoneType.find(stone => stone.stone === selectedStoneTypeValue); // Finding the matching stoneType object
      console.log(matchedStoneType)
      if (matchedStoneType) {
        stonePrice = parseFloat(matchedStoneType.price); // Setting stonePrice based on the matched stoneType object
      }
    }

    makingCharges = parseFloat(curElm.product.makingCharges);
    gst = parseFloat(curElm.product.gst);
    offer = parseFloat(curElm.product.offer);

    console.log(goldKtPrice, goldTypePrice, diamondTypePrice, sizePrice, makingCharges, gst, offer, stonePrice)
    const finalTotal = goldKtPrice + goldTypePrice + diamondTypePrice + sizePrice + makingCharges + gst + offer + stonePrice;
    return parseFloat(finalTotal.toFixed(2));
  };

  const convertToIndianFormat = (value) => {
    if (value === "") return value;
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    
    const formatter = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    });
  
    return formatter.format(number).replace("₹", "₹ "); 
  };

  return (
    <div className="container-fluid">
      <div className="row ">
        <center>
          <h1 className="wishlist-heading"> Wishlist</h1>
        </center>
        {wishlistItems.map((curElm) => (
          <div className="wishlist-box" key={curElm._id}>
            <a href={`/description/${curElm.product._id}`}>
              <img
                className="image"
                src={`${ImagebaseURL}${curElm.product.productPictures[0].img}`}
                alt={curElm.product.name}
                style={{ width: "100%" }}
              />
            </a>
            <div className="row" style={{ marginLeft: "10px" }}>
              <h1 className="wishlist-header">{curElm.product.name}</h1>
            </div>
            <div className="row mt-3 p-2" style={{ marginLeft: "10px" }}>
              {finalTotal[curElm.product._id] && ( // Ensure final total exists for the current product
                <h1 className="wishlist-price">
                  <b>Total: {convertToIndianFormat(finalTotal[curElm.product._id])}/-</b> {/* Display final total for current product */}
                </h1>
              )}
            </div>
            <div className="buttons-wishlist">
              <button
                className="wishlist-remove-button"
                onClick={() => {
                  handleRemoveFromWishlist(curElm.product._id);
                }}
              >
                Remove
              </button>
              <button
                className="wishlist-cart"
                onClick={() => handleAddToCart(curElm)}
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
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

export default WishList;