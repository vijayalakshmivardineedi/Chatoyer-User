import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axiosInstance, { ImagebaseURL } from "../helpers/axios";
import "./All.css";

const Pendants = ({ addToWishlist }) => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [finalTotal, setFinalTotal] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("User"));
  console.log(finalTotal)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axiosInstance.get("/getProductByCategory/Pendants");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    async function wishlist() {
      try {
        const response = await axiosInstance.get("/getWishlistItems");
        setWishlist(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    wishlist();
  }, []);

  const handleAddToWishlist = async (curElm) => {
    try {
      if (!userId) {
        navigate("/Login");
      } else {
        const requestBody = {
          user: userId._id,
          wishlistItem: [
            {
              product: curElm._id,
              sizes: curElm.sizes && curElm.sizes.length > 10 ? curElm.sizes[10].size : '',
              goldType: curElm.goldType && curElm.goldType.length > 0 ? curElm.goldType[0].goldtype : '',
              goldKt: curElm.goldKt && curElm.goldKt.length > 0 ? curElm.goldKt[curElm.goldKt.length - 1].goldKt : '',
              diamondType: curElm.diamondType && curElm.diamondType.length > 0 ? curElm.diamondType[0].type : '',
              stoneType: curElm.stoneType && curElm.stoneType.length > 0 ? curElm.stoneType[0].stone : '',
            },
          ],
        };
        const response = await axiosInstance.post("/addItemToWishlist", requestBody);
        if (response.status === 201) {
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate("/Wishlist");
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  useEffect(() => {
    const calculateFinalTotals = () => {
      const newFinalTotals = {};
      for (const curElm of products) {
        const total = calculateFinalTotal(curElm);
        newFinalTotals[curElm._id] = total;
      }
      setFinalTotal(newFinalTotals);
    };

    if (products.length > 0) {
      calculateFinalTotals();
    }
  }, [products]);

  const calculateFinalTotal = (curElm) => {
    let goldKtPrice = 0;
    let goldTypePrice = 0;
    let diamondTypePrice = 0;
    let sizePrice = 0;
    let makingCharges = 0;
    let gst = 0;
    let offer = 0;
    let stonePrice = 0;

    // Calculate goldKtPrice based on the last element of goldKt
    if (curElm.goldKt && curElm.goldKt.length > 0) {
        const lastGoldKt = curElm.goldKt[curElm.goldKt.length - 1];
        goldKtPrice = parseFloat(lastGoldKt.price);
    }
  
    // Calculate goldTypePrice based on the selected goldType
    if (curElm.goldType && curElm.goldType.length > 0) {
        goldTypePrice = parseFloat(curElm.goldType[0].price);
    }
  
    // Calculate diamondTypePrice based on the selected diamondType
    if (curElm.diamondType && curElm.diamondType.length > 0) {
        diamondTypePrice = parseFloat(curElm.diamondType[0].price);
    }
  
    if (curElm.sizes && curElm.sizes.length > 0) {
      const middleIndex = Math.floor(curElm.sizes.length / 2);
      sizePrice = parseFloat(curElm.sizes[middleIndex].price);
    }
  
    // Set other costs directly from the product data
    makingCharges = parseFloat(curElm.makingCharges);
    gst = parseFloat(curElm.gst);
    offer = parseFloat(curElm.offer);
  
    // Calculate stonePrice if applicable
    if (curElm.stoneType && curElm.stoneType.length > 0) {
        const lastStone = curElm.stoneType[curElm.stoneType.length - 1];
        stonePrice = parseFloat(lastStone.price);
    }
 
    // Sum up all the prices to get the final total
    const finalTotal = goldKtPrice + goldTypePrice + diamondTypePrice + sizePrice + makingCharges + gst + offer + stonePrice;
    console.log(finalTotal)
    // Round the final total to two decimal places and return
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

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product._id === productId);
  };

  return (
    <div>
      <div className="Banner">
        <img
          style={{ height: "auto" }}
          src="https://static.malabargoldanddiamonds.com/media/catalog/category/diamond_pendant_MBPD00310M2.jpg"
          className="d-block w-100 "
          alt="Pendants"
        />
      </div>
      <div className="product">
        <div className="container">
          {products.map((curElm) => (
            <div className="box" key={curElm._id}>
              <Link to={`/description/${curElm._id}`}>
                <div className="img_box">
                  {curElm.productPictures.length > 0 && (
                    <img
                      src={`${ImagebaseURL}${curElm.productPictures[0].img}`}
                      alt={curElm.name}
                    />
                  )}
                </div>
              </Link>
              <div className="icon" onClick={() => handleAddToWishlist(curElm)} >
                {isInWishlist(curElm._id) ? (
                    <li>
                      <AiFillHeart  className="heart-icons" style={{ color: 'red' }}  />
                    </li>
                ) : (
                  <div className="icon-item">
                    <li>
                      <AiOutlineHeart className="heart-icon" />
                    </li>
                  </div>
                )}
              </div>
              <div className="detail">
                <h3 className="product-name">{curElm.name}</h3>
                <h4>{convertToIndianFormat(finalTotal[curElm._id]) || 'Price not available'}/-</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="Banner">
        <img
          style={{ height: 350 }}
          src="https://www.shilpalifestyle.com/assets/category/9_WOMEN_DIAMOND_(Pendant_Earring_Set).jpg"
          className="d-block w-100"
          alt="Pendants"
        />
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content-big">
            <span className="close" onClick={() => setShowPopup(false)}>&times;</span>
            <p>Item added to wishlist successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pendants;
