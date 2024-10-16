import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import { Link, useNavigate } from "react-router-dom";
import ImageGallery from "./ImageGallery";
import "./Home.css";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "bootstrap-icons/font/bootstrap-icons.css";
import axiosInstance, { Api, ImagebaseURL } from "../../helpers/axios";
import firstBanner from "../../assets/banners/first_banner.jpg";
import secondBanner from "../../assets/banners/banner_image2.jpg";
import thirdBanner from "../../assets/banners/Banner3.jpg";
import fourthBanner from "../../assets/banners/Banner-4.jpg";
import fifthBanner from "../../assets/banners/Banner-5.jpg";
function Home({ addToWishlist }) {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("User"));

  console.log(finalTotal);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await Api.get("/getAllProducts");
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
        console.log(requestBody)
        const response = await axiosInstance.post("/addItemToWishlist", requestBody);
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

  useEffect(() => {
    const calculateFinalTotals = async () => {
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

  const convertToNumericValue = (formattedValue) => {
    const numericString = formattedValue.replace(/,/g, '');
    const numericValue = parseFloat(numericString);
    return numericValue;
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


  const calculateFinalTotal = (curElm) => {
    let goldKtPrice = 0;
    let goldTypePrice = 0;
    let diamondTypePrice = 0;
    let sizePrice = 0;
    let makingCharges = 0;
    let gst = 0;
    let offer = 0;
    let stonePrice = 0;

    if (curElm.goldKt && curElm.goldKt.length > 0) {
      const lastGoldKt = curElm.goldKt[curElm.goldKt.length - 1];
      goldKtPrice = parseFloat(lastGoldKt.price);
    }

    if (curElm.goldType && curElm.goldType.length > 0) {
      goldTypePrice = parseFloat(curElm.goldType[0].price);
    }


    if (curElm.diamondType && curElm.diamondType.length > 0) {
      diamondTypePrice = parseFloat(curElm.diamondType[0].price);
    }

    if (curElm.sizes && curElm.sizes.length > 0) {
      const middleIndex = Math.floor(curElm.sizes.length / 2);
      sizePrice = parseFloat(curElm.sizes[middleIndex].price);
    }

    makingCharges = parseFloat(curElm.makingCharges);
    gst = parseFloat(curElm.gst);
    offer = parseFloat(curElm.offer);

    if (curElm.stoneType && curElm.stoneType.length > 0) {
      const lastStone = curElm.stoneType[curElm.stoneType.length - 1];
      stonePrice = parseFloat(lastStone.price);
    }

    const finalTotal = goldKtPrice + goldTypePrice + diamondTypePrice + sizePrice + makingCharges + gst + offer + stonePrice;

    return parseFloat(finalTotal.toFixed(2));
  };


  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product._id === productId);
  };


  return (
    <>
    <Carousel interval={3000} pause={false} fade={false}>
  <Carousel.Item className="carousel-item zoom-in">
    <img
      className="d-block w-100"
      src= {firstBanner}
      alt="First slide"
      style={{ height: "460px" }}
    />
  </Carousel.Item>
  <Carousel.Item className="carousel-item flip-in">
    <img
      className="d-block w-100"
      src={secondBanner}
      alt="Second slide"
      style={{ height: "460px" }}
    />
  </Carousel.Item>
  <Carousel.Item className="carousel-item slide-in">
    <img
      className="d-block w-100"
      src={thirdBanner}
      alt="Third slide"
      style={{ height: "460px" }}
    />
  </Carousel.Item>
  <Carousel.Item className="carousel-item rotate-in">
    <img
      className="d-block w-100"
      src={fourthBanner}
      alt="Fourth slide"
      style={{ height: "460px" }}
    />
  </Carousel.Item>
  <Carousel.Item className="carousel-item fade-in">
    <img
      className="d-block w-100"
      src={fifthBanner}
      alt="Fifth slide"
      style={{ height: "460px" }}
    />
  </Carousel.Item>
</Carousel>

      <center className="home-headings mt-2">
        <h1>Product Category</h1>
        <h4>So that you don't run out of options to choose from!</h4>
        <hr />
      </center>
      <div className="App">
        <ImageGallery />
      </div>
      <center className="home-headings mt-2">
        <h1> Delight Deals of the Day</h1>
        <hr />
      </center>
      <div className="product">
        <div className="container">
          {products.map((curElm) => {
            return (
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
                      <AiFillHeart style={{ color: 'red', fontSize: '20px' }} />
                    </li>
                  ) : (
                    <li>
                      <AiOutlineHeart style={{ fontSize: '20px' }} />
                    </li>
                  )}
                </div>
                <div className="detail">
                  <h3 className="product-name">{curElm.name}</h3>
                  <h4>{convertToIndianFormat(finalTotal[curElm._id]) || 'Price not available'}/-</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <table className="d-flex justify-content-center">
        <tr>
          <td>
            <div className="Offer">
              <img
                style={{ height: 405 }}
                src="https://www.candere.com/media/catalog/category/Deals.jpg"
                className="d-block p-2 w-100"
                alt="Rings"
              />
            </div>
          </td>
          <td>
            <img
              style={{ height: 405 }}
              src="https://www.candere.com/media/catalog/category/Offer-T_26C.jpg"
              className="d-block p-2 w-100"
              alt="Rings"
            />
          </td>
        </tr>
      </table>

      <center className="home-headings mt-3">
        <h1>Collection You Love!</h1>
        <hr />
      </center>

      <div className="Banner">
        <img
          style={{ height: 400 }}
          src="https://www.reeds.com/media/wysiwyg/homepage-L1-assets/LooseDiamond_Bridal_Gif_D.gif"
          className="d-block w-100"
          alt="Rings"
        />
      </div>


      <center className="home-headings mt-2">
        <h1>Our Promises</h1>
        <hr />
      </center>
      <div className="brand container-xxl">
        <div className="row justify-content-center justify-content-md-center mt-5">
          <div className="col-md-4 col-lg-2 mb-4 mb-md-0 ">
            <img
              src="https://www.josalukkasonline.com/assets/images/certified-images/icon1.webp"
              alt=""
            />
            <span className="promises-text fs-4">Safe & Secure </span>
          </div>
          <div className="col-md-4 col-lg-2 mb-4 mb-md-0 ">
            <img
              src="https://www.josalukkasonline.com/assets/images/certified-images/icon2.webp"
              alt=""
            />
            <span className="promises-text fs-4">Free Shipping</span>
          </div>
          <div className="col-md-4 col-lg-2 mb-4 mb-md-0 ">
            <img
              src="https://www.josalukkasonline.com/assets/images/certified-images/icon3.webp"
              alt=""
            />
            <span className="promises-text fs-4">30-days Return</span>
          </div>
          <div className="col-md-4 col-lg-2 mb-4 mb-md-0 ">
            <img
              src="https://www.josalukkasonline.com/assets/images/certified-images/icon4.webp"
              alt=""
            />
            <span className="promises-text fs-4">Certified Diamonds</span>
          </div>

          <div className="col-md-4 col-lg-2 mb-4 mb-md-0 ">
            <img
              src="https://www.josalukkasonline.com/assets/images/certified-images/icon5.webp"
              alt=""
            />
            <span className="promises-text fs-4">Bis Hallmarked</span>
          </div>
          <div className="col-md-4 col-lg-2 mb-4 mb-md-0">
            <img
              src="https://www.josalukkasonline.com/assets/images/certified-images/icon6.webp"
              alt=""
            />
            <span className="promises-text fs-4">Easy Exchange</span>
          </div>
        </div>
      </div>
      <div className="banner">
        <img
          style={{ height: 400 }}
          src="https://www.candere.com/static/version1692754909/frontend/Codilar/candere_desktop/en_US/Magento_Cms/images/experience_store/Experience_Centre.jpg"
          className="d-block w-100"
          alt="Rings"
        />
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
    </>
  );
}

export default Home;
