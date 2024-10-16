import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import axiosInstance, { ImagebaseURL } from "../../helpers/axios";
import { IoGiftSharp } from "react-icons/io5";
import { Modal, Button } from "react-bootstrap";

const Cart = () => {
  const { _id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItem, setCartItem] = useState([]);
  const userId = JSON.parse(localStorage.getItem("User"));
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);
  const [showVoucherInput, setShowVoucherInput] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [finalTotal, setFinalTotal] = useState({});
  const [finalQuanTotal, setFinalQuanTotal] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedGoldType, setSelectedGoldType] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedDiamondType, setSelectedDiamondType] = useState(null);
  const [selectedGoldKt, setSelectedGoldKt] = useState("");
  const [selectedStoneType, setSelectedStoneType] = useState("");

  console.log(selectedGoldType, selectedSize, selectedDiamondType, selectedGoldKt, selectedStoneType)
  console.log(cartItem);
  console.log(quantity)


  const fetchCartItems = async () => {
    try {
      const response = await axiosInstance.get("/getCartItems");
      if (response.status === 201) {
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const cartItemsData = response.data;
          setCartItem(cartItemsData);


          let selectedGoldTypes = {};
          let selectedSizes = {};
          let selectedDiamondTypes = {};
          let selectedGoldKts = {};
          let selectedStoneTypes = {};

          cartItemsData.forEach(item => {
            const productId = item.product._id;
            selectedGoldTypes[productId] = item.goldType;
            selectedSizes[productId] = item.sizes;
            selectedDiamondTypes[productId] = item.diamondType;
            selectedGoldKts[productId] = item.goldKt;
            selectedStoneTypes[productId] = item.stoneType;
          });

          setSelectedGoldType(selectedGoldTypes);
          setSelectedSize(selectedSizes);
          setSelectedDiamondType(selectedDiamondTypes);
          setSelectedGoldKt(selectedGoldKts);
          setSelectedStoneType(selectedStoneTypes);
        } else {
          setMessage("No products in your cart");
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
          }, 1500);
        }
      } else if (response.status === 201) {
        setMessage(response.data.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.response?.data?.error || "No products in your cart"
      );
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1500);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [_id]);

  const handleQuantityUpdate = async (productId, action) => {
    try {
      if (action === 'increase') {
        await axiosInstance.post("/increaseCartItemQuantity", { userId: userId._id, productId });
      } else if (action === 'decrease') {
        await axiosInstance.post("/decreaseCartItemQuantity", { userId: userId._id, productId });
      }
      fetchCartItems();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "An error occurred while updating quantity"
      );
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1500);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const calculateFinalTotals = async () => {
      const newFinalTotals = {};
      const newFinalQuanTotals = {};
      for (const curElm of cartItem) {
        const { finalTotal, finalQuanTotal } = calculateFinalTotal(curElm);
        newFinalTotals[curElm.product._id] = finalTotal;
        newFinalQuanTotals[curElm.product._id] = finalQuanTotal;
      }
      setFinalTotal(newFinalTotals);
      setFinalQuanTotal(newFinalQuanTotals);
    };
    calculateFinalTotals();
  }, [cartItem]);


  const calculateFinalTotal = (curElm) => {
    if (!curElm.product) {
      return { finalTotal: 0, finalQuanTotal: 0 };
    }

    let goldKtPrice = 0;
    let goldTypePrice = 0;
    let diamondTypePrice = 0;
    let sizePrice = 0;
    let makingCharges = 0;
    let gst = 0;
    let offer = 0;
    let stonePrice = 0;
    let quantity = 1;

    if (curElm.product.goldKt && curElm.product.goldKt.length > 0) {
      const selectedGoldKtValue = selectedGoldKt[curElm.product._id];
      const matchedGoldKt = curElm.product.goldKt.find(gold => gold.goldKt === selectedGoldKtValue);
      if (matchedGoldKt) {
        goldKtPrice = parseFloat(matchedGoldKt.price);
      }
    }

    if (curElm.product.goldType && curElm.product.goldType.length > 0) {
      const selectedGoldTypeValue = selectedGoldType[curElm.product._id];
      console.log(selectedGoldTypeValue)
      const matchedGoldType = curElm.product.goldType.find(type => type.goldtype === selectedGoldTypeValue);
      console.log(matchedGoldType)
      if (matchedGoldType) {
        goldTypePrice = parseFloat(matchedGoldType.price);
      }
    }

    if (curElm.product.diamondType && curElm.product.diamondType.length > 0) {
      const selectedDiamondTypeValue = selectedDiamondType[curElm.product._id];
      console.log(selectedDiamondTypeValue)
      const matchedDiamondType = curElm.product.diamondType.find(diamond => diamond.type === selectedDiamondTypeValue);
      console.log(matchedDiamondType)
      if (matchedDiamondType) {
        diamondTypePrice = parseFloat(matchedDiamondType.price);
      }
    }

    if (curElm.product.sizes && curElm.product.sizes.length > 0) {
      const selectedSizeValue = selectedSize[curElm.product._id];
      console.log(selectedSizeValue)
      const matchedSize = curElm.product.sizes.find(size => size.size === selectedSizeValue);
      console.log(matchedSize)
      if (matchedSize) {
        sizePrice = parseFloat(matchedSize.price);

      }
    }

    if (curElm.product.stoneType && curElm.product.stoneType.length > 0) {
      const selectedStoneTypeValue = selectedStoneType[curElm.product._id]; console.log(selectedStoneTypeValue)
      const matchedStoneType = curElm.product.stoneType.find(stone => stone.stone === selectedStoneTypeValue);
      console.log(matchedStoneType)
      if (matchedStoneType) {
        stonePrice = parseFloat(matchedStoneType.price);
      }
    }

    makingCharges = parseFloat(curElm.product.makingCharges);
    gst = parseFloat(curElm.product.gst);
    offer = parseFloat(curElm.product.offer);
    quantity = curElm.quantity
    console.log(quantity)
    console.log(goldKtPrice, goldTypePrice, diamondTypePrice, sizePrice, makingCharges, gst, offer, stonePrice)

    const finalTotal = goldKtPrice + goldTypePrice + diamondTypePrice + sizePrice + makingCharges + gst + offer + stonePrice;
    console.log(finalTotal)
    console.log(quantity)
    const finalQuanTotal = finalTotal * quantity;

    console.log(finalQuanTotal)
    return {
      finalTotal: parseFloat(finalTotal.toFixed(2)),
      finalQuanTotal: parseFloat(finalQuanTotal.toFixed(2))
    };

  };

  const handleUpdate = async (curElm, updateData) => {
    console.log(curElm.product && curElm.product._id);
    try {
      if (!userId) {
        navigate("/Login");
      } else {
        const requestBody = {
          cartItems: [
            {
              product: curElm.product._id,
            },
          ],
        };
        Object.keys(updateData).forEach(key => {
          requestBody.cartItems[0][key] = updateData[key];
        });

        const response = await axiosInstance.put("/updateCartItem", requestBody);
        if (response.status === 201) {
          setMessage(response.data.message);
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
          }, 1500);
          fetchCartItems();
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

  const handleRemoveFromCart = async (curElm) => {
    const productId = curElm.product && curElm.product._id;
    try {
      const response = await axiosInstance.delete("/removeCartItems", { data: { userId: userId._id, productId } });
      if (response.status === 201) {
        setMessage(response.data.message);
        console.log(response.data.message)
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
        fetchCartItems();
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || "An error occurred while removing item from cart");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1500);
      console.error("Error:", error);
    }
  };

  const handleAddToWishlist = async (curElm) => {
    try {
      if (!userId) {
        navigate("/Login");
      } else {
        const requestBody = {
          user: userId._id,
          wishlistItem: [
            {
              product: curElm.product._id,
              sizes: selectedSize[curElm.product._id],
              goldType: selectedGoldType[curElm.product._id],
              goldKt: selectedGoldKt[curElm.product._id],
              diamondType: selectedDiamondType[curElm.product._id],
              stoneType: selectedStoneType[curElm.product._id],
            },
          ],
        };

        const response = await axiosInstance.post("/addItemToWishlist",
          requestBody,
        );
        if (response.status === 201) {
          setMessage(response.data.message);
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            navigate("/Wishlist");
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

  const productsTotal = Object.values(finalQuanTotal).reduce((total, curTotal) => {
    console.log(`FinalQuanTotal: ${curTotal.toFixed(2)}`);

    return total + curTotal;
  }, 0).toFixed(2);;

  const handleApplyVoucher = () => {
    console.log("Applying voucher code:", voucherCode);
    setShowVoucherInput(false);
  };

  const handleCheckout = () => {
    navigate("/Checkout");
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
    <div className="cart container-fluid">
      <div className="row">
        <h1 className="cart-header">My Shopping Cart</h1>
        <div className="col-md-7">
          {cartItem.map((curElm) => (
            <div className="cart-box" key={curElm.product._id}>
              <div className="row">
                <div className="col-md-5">
                  <a href={`/description/${curElm.product._id}`}>
                    <img
                      className="image"
                      src={`${ImagebaseURL}${curElm.product.productPictures[0].img}`}
                      alt={curElm.product.name}
                      style={{ width: "100%" }}
                    />
                  </a>
                </div>
                <div className="col-md-7">
                  <div className="row">
                    <div className="col-md-12">
                      <h1 className="card-content">{curElm.product.name}</h1>
                    </div>
                    <h3>{curElm.Cat}</h3>
                  </div>
                  {/* <div className="col-md-6">
                    <div className="cart-size1">
                      <label className="card-content fs-2 p-3">Size:</label>
                      <select
                        className="size-select"
                        value={selectedSize[curElm.product._id] || ''}
                        onChange={(e) => {
                          const newSize = e.target.value;
                          handleUpdate(curElm, { sizes: newSize });
                        }}
                      >
                        <option value="">Select Size</option>
                        {curElm.product.sizes.map((size) => (
                          <option key={size._id} value={size.size}>
                            {size.size}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div> */}

                  <div className="cart-size">
                    <label className="card-content fs-2 p-3">Size:</label>
                    <select
                      className="size-select"
                      style={{ width: "40%", fontSize: "15px" }}
                      value={selectedSize[curElm.product._id] || ''}
                      onChange={(e) => {
                        const newSize = e.target.value;
                        handleUpdate(curElm, { sizes: newSize });
                      }}
                    >
                      <option value="">Select Size</option>
                      {curElm.product.sizes.map((size) => (
                        <option key={size._id} value={size.size}>
                          {size.size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-md-8">
                      <div className="cart-size">
                        <label className="card-content fs-2 p-3">Gold Type:</label>
                        <select
                          className="gold-type-select"
                          value={selectedGoldType[curElm.product._id] || ''}
                          onChange={(e) => {
                            const newGoldType = e.target.value;
                            handleUpdate(curElm, { goldType: newGoldType });
                          }}
                        >
                          <option value="">Select Gold Type</option>
                          {curElm.product.goldType.map((goldType) => (
                            <option key={goldType._id} value={goldType.goldtype}>
                              {goldType.goldtype}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="cart-size">
                        <label className="card-content fs-2 p-3">Gold Karat:</label>
                        <select
                          className="gold-kt-select"
                          value={selectedGoldKt[curElm.product._id] || ''}
                          onChange={(e) => {
                            const newGoldKt = e.target.value;
                            handleUpdate(curElm, { goldKt: newGoldKt });
                          }}
                        >
                          <option value="">Select Gold Karat</option>
                          {curElm.product.goldKt.map((goldKt) => (
                            <option key={goldKt._id} value={goldKt.goldKt}>
                              {goldKt.goldKt}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="cart-size">
                        <label className="card-content fs-2 p-3">Diamond Type:</label>
                        <select
                          className="diamond-type-select"
                          value={selectedDiamondType[curElm.product._id] || ''}
                          onChange={(e) => {
                            const newDiamondType = e.target.value;
                            handleUpdate(curElm, { diamondType: newDiamondType });
                          }}
                        >
                          <option value="">Select Diamond Type</option>
                          {curElm.product.diamondType.map((diamondType) => (
                            <option key={diamondType._id} value={diamondType.type}>
                              {diamondType.type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row mt-3">
                      <div className="col-md-4">
                        <div className="cart-quantity">
                          <label className="card-content fs-2 p-3">Quantity: </label>
                          <button
                            className="quantity-button"
                            onClick={() => handleQuantityUpdate(curElm.product._id, 'decrease')}
                          >
                            -
                          </button>
                          <span className="quantity fs-3">{curElm.quantity}</span>
                          <button
                            className="quantity-button"
                            onClick={() => handleQuantityUpdate(curElm.product._id, 'increase')}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="row mt-3 p-2">
                      <div className="col-md-6">
                        <h1 className="price">
                          Total: {convertToIndianFormat(finalQuanTotal[curElm.product._id])}/-
                        </h1>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-md-6">
                      <Link to="/wishlist">
                        <button
                          className="wishlist-button fs-3"
                          onClick={() => handleAddToWishlist(curElm)}
                        >
                          Add to Wishlist
                        </button>
                      </Link>
                    </div>
                    <div className="col-md-6">
                      <button
                        className="remove-button"
                        onClick={() => {
                          handleRemoveFromCart(curElm);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
        <div className="col-md-5">
          <div className="order-summary-box">
            <h3 className="order1">
              <b>Order Summary</b>
            </h3>
            <p className="length" style={{ fontFamily: 'Domine, serif' }}>
              Total Products: {cartItem.length}
            </p>
            <p className="length" style={{ fontFamily: 'Domine, serif' }}>
              Total of all products: {productsTotal}
            </p>
            {/* <div className="Voucher" onClick={() => setShowVoucherInput(!showVoucherInput)}>
              <p style={{ display: "flex", alignItems: "center", fontSize: "16px" }}>
                I have a voucher code / gift card
                <button style={{ border: "none", background: "none", cursor: "pointer" }}>
                  <IoGiftSharp style={{ fontSize: "30px", color: "#4f3267", }} />
                </button>
              </p>
              {showVoucherInput && (
                <div className="Voucher-Card" style={{ fontFamily: 'Domine, serif' }}>
                  <input
                    placeholder="Enter voucher code"
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    style={{
                      width: "300px",
                      padding: "10px",
                      fontSize: "16px",
                      border: "1px solid #DE57E5",
                      borderRadius: "10px 0 0 10px",

                    }}
                  />
                  <button
                    onClick={handleApplyVoucher}
                    className="voucher-apply-button"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div> */}
            <button className="placeorder-button" onClick={handleCheckout}>CHECK OUT</button>
            <div className="Vocher">
              <p style={{ marginTop: "30px", }}>
                <b>Any Questions?</b> <br />
                Please call us at <b>18001236547</b>{" "}
              </p>{" "}
              <br />
            </div>
          </div>
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
    </div>
  );
};


export default Cart;