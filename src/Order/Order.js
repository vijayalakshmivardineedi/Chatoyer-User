import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Order.css";
import { useNavigate } from "react-router-dom";
import { IoGiftSharp } from "react-icons/io5";
import { Modal, Button } from "react-bootstrap";
import axiosInstance, { ImagebaseURL } from "../helpers/axios";
import amazonImage from "../Order/payment/amazon.png";
import bharatImage from "../Order/payment/bharat_pay.png";
import codImage from "../Order/payment/cod.jpg";
import creditImage from "../Order/payment/credit.png";
import debitImage from "../Order/payment/debit.png";
import googleImage from "../Order/payment/google_pay.jpg";
import paytmImage from "../Order/payment/paytm.png";
import phonePayImage from "../Order/payment/phone_pay.png";
import { AiOutlineCreditCard } from 'react-icons/ai';
import { FaMoneyBill } from 'react-icons/fa';
import { RiBankLine } from 'react-icons/ri';

const Order = () => {
    const { _id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [cartItem, setCartItem] = useState([]);
    const userId = JSON.parse(localStorage.getItem("User"));
    const user = userId._id
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedSubOption, setSelectedSubOption] = useState(null);
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const [show, setShow] = useState(false);
    const [showVoucherInput, setShowVoucherInput] = useState(false);
    const [voucherCode, setVoucherCode] = useState("");
    const [couponData, setCouponData] = useState("");
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentStatus, setPaymentStatus] = useState("");
    const [finalTotal, setFinalTotal] = useState({});
    const [finalQuanTotal, setFinalQuanTotal] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedGoldType, setSelectedGoldType] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedDiamondType, setSelectedDiamondType] = useState("");
    const [selectedGoldKt, setSelectedGoldKt] = useState("");
    const [selectedStoneType, setSelectedStoneType] = useState("");

    const [goldKtPrice, setGoldKtPrice] = useState("");
    const [goldTypePrice, setGoldTypePrice] = useState("");
    const [diamondTypePrice, setDiamondTypePrice] = useState("");
    const [sizePrice, setSizePrice] = useState("");
    const [stonePrice, setStonePrice] = useState("");
    const [finalPayment, setFinalPayment] = useState("");


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
        fetchAddress(user);
    }, [user, _id]);

    

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
            console.log(matchedGoldKt)
            if (matchedGoldKt) {
                goldKtPrice = parseFloat(matchedGoldKt.price);
                console.log(goldKtPrice)
                setGoldKtPrice(prevState => {
                    return {
                        ...prevState,
                        [curElm.product._id]: goldKtPrice
                    };
                });
            }
        }

        if (curElm.product.goldType && curElm.product.goldType.length > 0) {
            const selectedGoldTypeValue = selectedGoldType[curElm.product._id];
            const matchedGoldType = curElm.product.goldType.find(type => type.goldtype === selectedGoldTypeValue);
            if (matchedGoldType) {
                goldTypePrice = parseFloat(matchedGoldType.price);
                console.log(goldTypePrice)
                setGoldTypePrice(prevState => {
                    return {
                        ...prevState,
                        [curElm.product._id]: goldTypePrice
                    };
                });
            }
        }

        if (curElm.product.diamondType && curElm.product.diamondType.length > 0) {
            const selectedDiamondTypeValue = selectedDiamondType[curElm.product._id];
            const matchedDiamondType = curElm.product.diamondType.find(diamond => diamond.type === selectedDiamondTypeValue);
            if (matchedDiamondType) {
                diamondTypePrice = parseFloat(matchedDiamondType.price);
                console.log(diamondTypePrice)
                setDiamondTypePrice(prevState => {
                    return {
                        ...prevState,
                        [curElm.product._id]: diamondTypePrice
                    };
                });
            }
        }

        if (curElm.product.sizes && curElm.product.sizes.length > 0) {
            const selectedSizeValue = selectedSize[curElm.product._id];
            const matchedSize = curElm.product.sizes.find(size => size.size === selectedSizeValue);
            if (matchedSize) {
                sizePrice = parseFloat(matchedSize.price);
                console.log(sizePrice)
                setSizePrice(prevState => {
                    return {
                        ...prevState,
                        [curElm.product._id]: sizePrice
                    };
                });
            }
        }

        if (curElm.product.stoneType && curElm.product.stoneType.length > 0) {
            const selectedStoneTypeValue = selectedStoneType[curElm.product._id];
            const matchedStoneType = curElm.product.stoneType.find(stone => stone.stone === selectedStoneTypeValue);
            if (matchedStoneType) {
                stonePrice = parseFloat(matchedStoneType.price);
                console.log(stonePrice)
                setStonePrice(prevState => {
                    return {
                        ...prevState,
                        [curElm.product._id]: stonePrice
                    };
                });
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

    useEffect(() => {
        if (couponData) {
            console.log("productsTotal", productsTotal)
            console.log("couponData.offerAmount", couponData.offerAmount)
            setFinalPayment(productsTotal - couponData.offerAmount);
            console.log("setFinalPayment", setFinalPayment)
        } else {
            setFinalPayment(productsTotal);
        }
    }, [productsTotal, couponData]);

    const handleApplyVoucher = async () => {
        console.log("Applying voucher code:", voucherCode)
        try {
            const response = await axiosInstance.get(`/getCouponsByCouponId/${voucherCode}`);
            if (response.status === 200 && response.data.success) {
                console.log("Voucher applied successfully:", response.data.coupon);
                setCouponData(response.data.coupon)
                setVoucherCode('');
            }
        } catch (error) {
            setMessage(error.response.data.message || error.response.data.error);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                setVoucherCode('');
            }, 1500);

        }
    };


    const fetchAddress = async (user) => {
        try {
            const response = await axiosInstance.get(`/getCheckoutDetails/${user}`);
            if (response.data) {
                const data = response.data.checkout;
                setAddress(data.address);
                setPaymentStatus(data.paymentStatus);

            } else {
                console.error("Select Address");
            }
        } catch (error) {
            console.error("No Address Found:", error);
        }
    };

    // const handleBuy = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const itemsData = cartItem.map(item => {
    //             const {
    //                 product,
    //                 quantity,
    //                 sizes,
    //                 makingCharges,
    //                 gst,
    //                 offer
    //             } = item;

    //             const orderItem = {
    //                 productId: product._id,
    //                 quantity,
    //                 sizes,
    //                 sizePrice: sizePrice[product._id],
    //                 goldType: selectedGoldType[product._id],
    //                 goldTypePrice: goldTypePrice[product._id],
    //                 goldKt: selectedGoldKt[product._id],
    //                 goldKtPrice: goldKtPrice[product._id],
    //                 diamondType: selectedDiamondType[product._id],
    //                 diamondTypePrice: diamondTypePrice[product._id],
    //                 stoneType: selectedStoneType[product._id],
    //                 stonePrice: stonePrice[product._id],
    //                 makingCharges,
    //                 gst,
    //                 offer
    //             };

    //             console.log(orderItem);
    //             return orderItem;
    //         });

    //         const orderData = {
    //             user: user,
    //             address,
    //             totalAmount: finalPayment,
    //             items: itemsData,
    //             paymentStatus,
    //             paymentMethod,
    //             orderStatus: [{ type: 'ordered', date: new Date(), isCompleted: false }]
    //         };

    //         console.log(orderData);
    //         const response = await axiosInstance.post('/addOrder', orderData);
    //         if (response.status === 201) {
    //             navigate("/Success")
    //         }

    //     } catch (error) {
    //         setMessage(error.response.data.message || error.response.data.error);
    //         setShowPopup(true);
    //         setTimeout(() => {
    //             setShowPopup(false);
    //         }, 1500);
    //     }
    // };

    const handleBuy = async (e) => {
        e.preventDefault();
        try {
            const itemsData = cartItem.map(item => {
                const {
                    product,
                    quantity,
                    sizes,
                    makingCharges,
                    gst,
                    offer
                } = item;
    
                return {
                    productId: product._id,
                    quantity,
                    sizes,
                    sizePrice: sizePrice[product._id],
                    goldType: selectedGoldType[product._id],
                    goldTypePrice: goldTypePrice[product._id],
                    goldKt: selectedGoldKt[product._id],
                    goldKtPrice: goldKtPrice[product._id],
                    diamondType: selectedDiamondType[product._id],
                    diamondTypePrice: diamondTypePrice[product._id],
                    stoneType: selectedStoneType[product._id],
                    stonePrice: stonePrice[product._id],
                    makingCharges,
                    gst,
                    offer
                };
            });
    
            const orderData = {
                user: user,
                address,
                totalAmount: finalPayment,
                items: itemsData,
                paymentStatus,
                paymentMethod,
                orderStatus: [{ type: 'ordered', date: new Date(), isCompleted: false }]
            };
    
            console.log("Order Data:", orderData);
    
            const response = await axiosInstance.post('/addOrder', orderData);
    
            if (response.status === 201) {
                console.log("Order placed successfully");
    
                if (couponData && couponData._id) {
                    try {
                        const couponResponse = await axiosInstance.put(`/editCoupons/${couponData._id}`, {
                            isUsed: true
                        });
    
                        if (couponResponse.status === 200) {
                            console.log("Coupon successfully marked as used");
                        } else {
                            console.error("Failed to update coupon:", couponResponse.data);
                        }
                    } catch (error) {
                        console.error("Error updating coupon:", error.response?.data || error.message);
                    }
                }
    
                // Navigate to the success page
                navigate("/Success");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            setMessage(error.response?.data?.message || "An error occurred while placing the order.");
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 1500);
        }
    };
    
    

    const paymentOptionsData = [
        {
            name: "Card",
            icon: <AiOutlineCreditCard size={30} />,
            description: "Pay with your card securely.",
            subOptions: [
                { name: "Credit", method: "Credit Card" },
                { name: "Debit", method: "Debit Card" }
            ]
        },
        {
            name: "UPI",
            icon: <RiBankLine size={30} />,
            description: "Pay using UPI.",
            subOptions: [
                { name: "PhonePe", method: "PhonePe" },
                { name: "Paytm", method: "Paytm" },
                { name: "Google Pay", method: "Google Pay" },
                { name: "Amazon Pay", method: "Amazon Pay" },
                { name: "Bharat Pay", method: "Bharat Pay" }
            ]
        },
        {
            name: "Cash on Delivery",
            icon: <FaMoneyBill size={30} />,
            description: "Pay with cash when your order is delivered.",
            subOptions: [
                { name: "Cash on Delivery", method: "Cash on Delivery" },
            ]
        },
    ];

    const getImageForSubOption = (method) => {
        switch (method) {
            case "Google Pay":
                return googleImage;
            case "PhonePe":
                return phonePayImage;
            case "Paytm":
                return paytmImage;
            case "Bharat Pay":
                return bharatImage;
            case "Amazon Pay":
                return amazonImage;
            case "Cash on Delivery":
                return codImage;
            case "Credit Card":
                return creditImage;
            case "Debit Card":
                return debitImage;
            default:
                return "";
        }
    };

    const handleOptionSelect = async (optionName) => {
        setSelectedOption(optionName);
        setSelectedSubOption(null);
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
                <h1 className="cart-header">Place Your Order</h1>
                <div className="col-md-6">
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
                                                    style={{ width: "35%", fontSize: "15px" }}
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
                                                    style={{ width: "35%", fontSize: "15px" }}
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
                                                    style={{ width: "35%", fontSize: "15px" }}
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
                                            <div className="row mt-3">
                                                <div className="col-md-4">

                                                    <div className="cart-quantity">
                                                        <label className="card-content fs-2 p-3">
                                                            Quantity:{" "}
                                                        </label>
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
                                                <div className="col-md-12">
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
                        </div>
                    ))}
                </div>
                <div className="col-md-6">
                    <div className="order-summary-box">
                        <h2 className="order1">
                            <b>Order Summary</b>
                        </h2>
                        <p className="length">
                            Total Products: {cartItem.length}
                        </p>
                        {couponData && (
                        <p className="length">
                            Products Amount:  {convertToIndianFormat(productsTotal)}/-
                        </p>
                        )}
                        {couponData && (
                            <p className="length">
                                Offer:  {convertToIndianFormat(couponData.offerAmount)}/-
                            </p>
                        )}
                        {finalPayment && (
                            <p className="length">
                                Final Payment:  {convertToIndianFormat(finalPayment)}/-
                            </p>
                        )}
                        <br />
                        <div>
                            <p className="length">
                                <b style={{ color: '#4f3267', fontSize: "20px" }}>Address:</b>
                                <div className="address-box">
                                    {address && address.name ? ` ${address.name},` : ""}
                                    {address && address.plotNo ? ` ${address.plotNo}, ` : ""}
                                    {address && address.streetName ? `${address.streetName}, ` : ""}
                                    {address && address.district ? `${address.district}, ` : ""}
                                    {address && address.state ? `${address.state}, ` : ""}
                                    {address && address.pincode ? `${address.pincode}` : ""}
                                    {address && address.country ? `, ${address.country}` : ""}
                                    {address && address.contactNumber ? `, ${address.contactNumber}` : ""}

                                    {(!address || (!address.plotNo && !address.streetName && !address.district && !address.state && !address.pincode)) && "No Address Found"}
                                    <br />
                                    <button className="wishlist-buttons fs-3" onClick={() => navigate("/Checkout")}>Change Address</button>
                                </div>
                            </p>
                        </div>
                        <br />
                        <b style={{ display: 'flex', justifyContent: "left", color: '#4f3267', fontSize: "20px" }}>Vocher / Coupon:</b>
                        <div className="address-box">
                            {!couponData && (
                                <div className="Voucher" onClick={() => setShowVoucherInput(!showVoucherInput)}>
                                    <p style={{ display: "flex", alignItems: "center", fontSize: "16px" }}>
                                        I have a voucher code / gift card
                                        <button style={{ border: "none", background: "none", cursor: "pointer" }}>
                                            <IoGiftSharp style={{ fontSize: "30px", color: "#4f3267" }} />
                                        </button>
                                    </p>
                                    {showVoucherInput && (
                                        <div
                                            className="Voucher-Card"
                                            style={{ fontFamily: 'Domine, serif' }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
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
                                                onClick={(e) => e.stopPropagation()}
                                            />

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleApplyVoucher();
                                                }}
                                                className="voucher-apply-button"
                                            >
                                                Apply
                                            </button>

                                        </div>
                                    )}
                                </div>
                            )}
                            {couponData && (
                               <div className="voucher-details-container">
                               <div className="voucher-item">
                                   <div style={{marginRight: "43%"}}><strong>Name:</strong> {couponData.offerName}</div>
                                   <div><strong>Offer Amount:</strong> {couponData.offerAmount}</div>
                               </div>
                               <button
                                   onClick={(e) => {
                                       e.stopPropagation();
                                       setCouponData('');
                                       setVoucherCode('')
                                   }}
                                   className="voucher-remove-button"
                               >
                                   Remove
                               </button>
                           </div>
                            )}
                        </div>
                        <br />
                        <p className="length" style={{ color: '#4f3267', fontSize: "20px" }}>Selected Payment Option:</p>
                        <div className="payment-container">
                            <div className="payment-options">
                                <div className="options-column">
                                    {paymentOptionsData.map((option) => (
                                        <div
                                            key={option.name}
                                            className={`payment-option ${selectedOption === option.name ? "selected" : ""}`}
                                        >
                                            <div onClick={() => handleOptionSelect(option.name)} className="option-selector">
                                                <div className="option-icon">{option.icon}</div>
                                                <div className="option-details">
                                                    <span style={{ fontWeight: "bold", fontSize: 16 }}>{option.name}</span>
                                                    <p>{option.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="sub-options-column">
                                    {selectedOption && paymentOptionsData.find(option => option.name === selectedOption) && paymentOptionsData.find(option => option.name === selectedOption).subOptions && (
                                        <div className="sub-options-container">
                                            {paymentOptionsData.find(option => option.name === selectedOption).subOptions.map(subOption => (
                                                <div
                                                    key={subOption.name}
                                                    className={`sub-option ${paymentMethod === subOption.method ? "selected" : ""}`}
                                                    onClick={() => setPaymentMethod(subOption.method)}
                                                >
                                                    <img
                                                        src={getImageForSubOption(subOption.method)}
                                                        alt={subOption.name}
                                                        style={{ width: "50px", height: "50px", marginRight: '10px' }}
                                                    />
                                                    <span style={{ fontWeight: "bold", fontSize: 16 }}>{subOption.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        <button className="placeorder-button" onClick={handleBuy}>Place Order</button>
                        <div>
                            <p style={{ marginTop: "30px", fontSize: "20px" }}>
                                <b>Any Questions?</b> <br />
                                Please call us at <b>18004190066</b>{" "}
                            </p>{" "}
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

export default Order;