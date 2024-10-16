import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaPlus, FaMinus } from 'react-icons/fa';
import { AiOutlineHeart } from "react-icons/ai";
import { IoDiamondSharp } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import "./description.css"
import "react-multi-carousel/lib/styles.css";
import Pincode from "../components/Pincode";
import Carousel from "react-multi-carousel"; // Import Carousel from the correct package
import "react-multi-carousel/lib/styles.css"; // Import carousel styles
import ReactImageMagnify from "react-image-magnify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance, { ImagebaseURL } from "../helpers/axios";
import "./PopStyles.css";
import { AiFillGold } from 'react-icons/ai';

const Description = ({ addToCart, addToWishlist, addToOrder }) => {
  const { _id } = useParams();
  const userId = JSON.parse(localStorage.getItem("User"));
  const [product, setProduct] = useState({});
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();  
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const location = useLocation();
  const [isCustomized, setIsCustomized] = useState(false);
  const categoryId = product.category;
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedGoldType, setSelectedGoldType] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedDiamondType, setSelectedDiamondType] = useState("");
  const [selectedGoldKt, setSelectedGoldKt] = useState("");
  const [selectedStoneType, setSelectedStoneType] = useState("");
  const [WishlistItems, setWishlistItems] = useState(""); 
  const [finalTotal, setfinalTotal] = useState(0);
  console.log(selectedGoldType, selectedGoldKt, selectedSize, selectedDiamondType, selectedStoneType)

  const toggleCustomization = () => {
    setIsCustomized(!isCustomized);
  };

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, [location.pathname]);

  useEffect(() => { 
    async function fetchProduct() {
      try {
        const response = await axiosInstance.get(`/getDetailsByProductId/${_id}`);
        if (response && response.data.product) {
          const productData = response.data.product;
          setProduct(productData);

          if (productData.goldType && productData.goldType.length > 0) {
            setSelectedGoldType(productData.goldType[productData.goldType.length - 1].goldtype);
          }

          if (productData.goldKt && productData.goldKt.length > 0) {
            setSelectedGoldKt(productData.goldKt[productData.goldKt.length - 1].goldKt);
          }

          if (productData.diamondType && productData.diamondType.length > 0) {
            setSelectedDiamondType(productData.diamondType[0].type);
          }
          if (productData.stoneType && productData.stoneType.length > 0) {
            setSelectedStoneType(productData.stoneType[0].stone);  
          }
          if (productData.sizes && productData.sizes.length > 0) {
            setSelectedSize(productData.sizes[10].size);
          }
        } else {
          console.error("Product not found!");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    } 
    async function fetchSimilarProducts() {
      try {
        const response = await axiosInstance.get(`/getSimilarProducts/${categoryId}`);
        if (response && response.data.similarProducts) {
          setSimilarProducts(response.data.similarProducts);
        } else {
          console.error("Similar products not found!");
        }
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    }

    fetchProduct();
    fetchSimilarProducts();
    fetchWishlistItems();
  }, [_id, categoryId]);

  const fetchWishlistItems = async () => {
    try {
      const response = await axiosInstance.get("/getWishlistForDCP");
      if (response.status === 201) {
        setWishlistItems(response.data);  
      } else {
        console.error("Failed to fetch wishlist items");
      }
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      if (!userId) {
        navigate("/Login");
      } else {
        const requestBody = {
          user: userId._id,
          wishlistItem: [
            {
              product: product._id,
              sizes: selectedSize,
              goldType: selectedGoldType,
              goldKt: selectedGoldKt,
              diamondType: selectedDiamondType,
              stoneType: selectedStoneType
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

  const handleAddToCart = async () => {
    try {
      if (!userId) {
        navigate("/Login");
      } else {
        const requestBody = {
          user: userId._id,
          cartItem: [
            {
              quantity,
              product: product._id,
              sizes: selectedSize,  
              goldType: selectedGoldType,  
              goldKt: selectedGoldKt,
              diamondType: selectedDiamondType,
              stoneType: selectedStoneType  
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

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const calculateFinalTotal = () => {
    let goldKtPrice = 0;
    let goldTypePrice = 0;
    let diamondTypePrice = 0;
    let sizePrice = 0;
    const makingCharges = parseFloat(product.makingCharges);
    const gst = parseFloat(product.gst);
    const offer = parseFloat(product.offer);
    const stoneIndex = 0;
    const stonePrice = product.stoneType && product.stoneType[stoneIndex]?.price
      ? parseFloat(product.stoneType[stoneIndex].price)
      : 0;
    console.log(makingCharges, gst, offer, stonePrice);

    if (selectedGoldKt) {
      const selectedGoldKtObj = product.goldKt.find(karat => karat.goldKt === selectedGoldKt);
      if (selectedGoldKtObj) {
        goldKtPrice = parseFloat(selectedGoldKtObj.price);
      }
    }
    if (selectedGoldType) {
      const selectedGoldTypeObj = product.goldType.find(type => type.goldtype === selectedGoldType);
      if (selectedGoldTypeObj) {
        goldTypePrice = parseFloat(selectedGoldTypeObj.price); // Parse as float
      }
    }
    if (selectedDiamondType) {
      const selectedDiamondTypeObj = product.diamondType.find(type => type.type === selectedDiamondType);
      if (selectedDiamondTypeObj) {
        diamondTypePrice = parseFloat(selectedDiamondTypeObj.price); // Parse as float
      }
    }

    if (selectedSize) {
      const selectedSizeObj = product.sizes.find(sizeObj => sizeObj.size === selectedSize);
      if (selectedSizeObj) {
        sizePrice = parseFloat(selectedSizeObj.price);
      }
    }
    console.log(goldTypePrice, goldKtPrice, diamondTypePrice, stonePrice, sizePrice, makingCharges, gst, offer)
    let newFinalTotal = goldTypePrice + goldKtPrice + diamondTypePrice + stonePrice + sizePrice + makingCharges + gst + offer;
    console.log(newFinalTotal);
    const roundedFinalTotal = parseFloat(newFinalTotal.toFixed(2));
    setfinalTotal(roundedFinalTotal);
  };

  useEffect(() => {
    calculateFinalTotal();
  }, [selectedGoldKt, selectedGoldType, selectedDiamondType, selectedSize]);

  const handleGoldTypeChange = (e) => {
    setSelectedGoldType(e.target.value);
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
    <div className="description">
      <div>
        <div className="details" key={product._id}>
          <div onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
            <IoArrowBack style={{ fontSize: "30px", cursor: "pointer" }} />
          </div>

          <div className="big-img">
            {selectedThumbnail === product.productPictures?.length ? (
              product.productVideo && (
                <div className="product-video">
                  <video
                    controls
                    autoPlay
                    style={{ width: 400, height: 400, }}
                    src={`${ImagebaseURL}${product.productVideo}`}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )
            ) : (
              product.productPictures && product.productPictures.length > 0 && (
                <ReactImageMagnify
                  smallImage={{
                    alt: product.name,
                    isFluidWidth: true,
                    src: `${ImagebaseURL}${product.productPictures[selectedThumbnail]?.img}`,
                    width: 400,
                    height: 400,
                  }}
                  largeImage={{
                    src: `${ImagebaseURL}${product.productPictures[selectedThumbnail]?.img}`,
                    width: 800,
                    height: 800,
                  }}
                  enlargedImagePosition="over"
                />
              )
            )}
          </div>
          <div>
            <button
              className="wishlist-icon fs-1"
              onClick={handleAddToWishlist}
            >
              <AiOutlineHeart />
            </button>
          </div>
          <div className="box1">
            <div className="row">
              <h2 className="header" style={{ fontWeight: "bold" }}>{product.name}</h2>
            </div>
            <div className="product-description">
              {finalTotal !== 0 ? (
                <>
                  <p className="Pprice"> {convertToIndianFormat(finalTotal)}/-</p>
                  <p style={{ marginTop: "-17px", fontSize: "17px", color: "#4d4d4d", fontFamily: "Domine, serif" }}>MRP Incl. of all taxes</p>
                </>
              ) : (
                <>
                  <p className="Pprice"> {convertToIndianFormat(product.total)}/-</p>
                  <p style={{ marginTop: "-17px", fontSize: "13px", color: "#4d4d4d", fontFamily: "Domine, serif" }}>MRP Incl. of all taxes</p>
                </>
              )}
            </div>

            <div className="thumb">
              {product.productPictures &&
                product.productPictures.map((picture, idx) => (
                  <img
                    key={idx}
                    alt={product.name}
                    src={`${ImagebaseURL}${picture.img}`}
                    width={100}
                    height={100}
                    onClick={() => setSelectedThumbnail(idx)}
                    className={selectedThumbnail === idx ? "active" : ""}
                  />
                ))}

              {product.productVideo && (
                <video
                  key={product.productPictures?.length || 0}
                  src={`${ImagebaseURL}${product.productVideo}`}
                  width={100}
                  height={100}
                  onClick={() => setSelectedThumbnail(product.productPictures?.length || 0)}
                  className={selectedThumbnail === (product.productPictures?.length || 0) ? "active" : ""}
                />
              )}
            </div>


            <div>
              <p className="product-discription1">{product.description}</p>
            </div>
            <div className="boxed-text">
              <Pincode />
              <p className="dotted-border">
                (Order before 4pm for same-day-delivery)
              </p>
            </div>
            <div style={{ borderBottom: "1px solid #888" }}>
              <div className="customize-header" onClick={toggleCustomization} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p >
                  {isCustomized ? 'Hide Customize' : 'Customize this product'}
                </p>
                {isCustomized ? <FaMinus /> : <FaPlus />}
              </div>

              {isCustomized && (<>
                <div className="row">
                  <div className="col-md-3 cutomize-goldtype">
                    <select id="goldType" name="goldType" className="form-control" value={selectedGoldType} onChange={handleGoldTypeChange}>
                      {product.goldType && product.goldType.map((type, index) => (
                        <option key={index} value={type.goldtype}>{type.goldtype}</option>
                      ))}
                    </select>
                  </div>
                  <div className="customize-gold">
                    <AiFillGold size={24} />
                    <b style={{ fontSize: "16px", fontFamily: 'Domine, serif' }}>GOLD KARAT :</b>
                    {product.goldKt && product.goldKt.map((karat, index) => (
                      <label key={index} className="radio-inline">
                        <input
                          type="radio"
                          name="goldKarat"
                          value={karat.goldKt}
                          checked={selectedGoldKt === karat.goldKt} 
                          onChange={() => setSelectedGoldKt(karat.goldKt)} 
                        />
                        {karat.goldKt}
                      </label>
                    ))}
                  </div>


                </div>
                {/* DiamondType */}
                <div className="customize-diamond">
                  <IoDiamondSharp /> DIAMOND :
                  {product.diamondType && product.diamondType.map((type, index) => (
                    <label key={index} className="radio-inline">
                      <input
                        type="radio"
                        name="diamondType"
                        value={type.type}
                        checked={selectedDiamondType === type.type}
                        onChange={() => setSelectedDiamondType(type.type)} 
                      />
                      {type.type}
                    </label>
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: "18px", fontFamily: 'Domine, serif', fontWeight: "bold" }}>
                    Available Sizes:
                  </p>

                  <div className="radio-group">
                    {product.sizes && product.sizes.map((sizeObj, index) => (
                      <label key={index} className="radio-inline">
                        <input
                          type="radio"
                          name="productSize"
                          value={sizeObj.size}
                          checked={selectedSize === sizeObj.size}
                          onChange={() => setSelectedSize(sizeObj.size)}
                        />
                        {sizeObj.size}
                      </label>
                    ))}
                  </div>
                </div>
              </>)}
            </div>
            <button className="cart fs-3 " onClick={handleAddToCart}>
              ADD TO CART
            </button>
            <p className="query">
              Any Questions? Please feel free to reach us at:
              <b>18001236547</b>
            </p>
          </div>
        </div>
        <h1 className="similar1">Similar Products</h1>
        <div className="similarproducts3">
          <Carousel showDots={true} responsive={responsive}>
            {similarProducts.map((item) => (
              <div className="Scard">
                <Link to={`/description/${item._id}`} key={item._id}>
                  <img
                    className="product--image"
                    src={`${ImagebaseURL}${item.productPictures[0].img}`}
                    alt={item.name}
                    style={{ maxWidth: "5000%", height: "auto" }}
                  />
                </Link>
                <h2 style={{ fontSize: "18px", fontFamily: 'Domine, serif', fontWeight: "bold" }}>{item.name}</h2>
                <br/>
                <br/>
              </div>
            ))}
          </Carousel>
        </div>
        <div className="product-details-container m-4">
          <table className="product-details-table fs-4" style={{ borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }} >
            <tbody>
              <tr>
                <th colSpan="2">PRODUCT DETAILS</th>
              </tr>
              {product.productCode && (
                <tr>
                  <td className="col-md-6">Product Code</td>
                  <td className="col-md-6">{product.productCode}</td>
                </tr>
              )}
              {product.height && (
                <tr>
                  <td className="col-md-6">Height</td>
                  <td className="col-md-6">{product.height}</td>
                </tr>
              )}
              {product.width && (
                <tr>
                  <td className="col-md-6">Width</td>
                  <td className="col-md-6">{product.width}</td>
                </tr>
              )}
              {product.totalProductWeight && (
                <tr>
                  <td className="col-md-6">Product Weight</td>
                  <td className="col-md-6">{product.totalProductWeight}</td>
                </tr>
              )}
              <tr>
                <th colSpan="2">DIAMOND DETAILS</th>
              </tr>
              {product.diamondType && product.diamondType
                .filter(diamond => diamond.type === selectedDiamondType)
                .map((diamond, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td className="col-md-6">Type</td>
                      <td className="col-md-6">{diamond.type}</td>
                    </tr>
                    <tr>
                      <td className="col-md-6">Price</td>
                      <td className="col-md-6"> {convertToIndianFormat(diamond.price)}/-</td>
                    </tr>
                    <tr>
                      <td className="col-md-6">Total Weight</td>
                      <td className="col-md-6">{diamond.diamondWeight}</td>
                    </tr>
                    <tr>
                      <td className="col-md-6">Total No. Of Diamonds</td>
                      <td className="col-md-6">{diamond.diamondCount}</td>
                    </tr>
                    <tr>
                      <td className="col-md-3">Clarity</td>
                      <td className="col-md-3">{diamond.diamondClarity}</td>
                    </tr>
                    <tr>
                      <td className="col-md-3">Color</td>
                      <td className="col-md-6">{diamond.diamondColour}</td>
                    </tr>
                    <tr>
                      <td className="col-md-3">Shape</td>
                      <td className="col-md-6">{diamond.diamondShape}</td>
                    </tr>
                    <tr>
                      <td className="col-md-3">Setting Type</td>
                      <td className="col-md-6">{diamond.diamondSettingType}</td>
                    </tr>
                  </React.Fragment>
                ))}
              <tr>
                <th colSpan="2">STONE DETAILS</th>
              </tr>
              {product.stoneType && product.stoneType.map((stone, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td className="col-md-6">Stone</td>
                    <td className="col-md-6">{stone.stone}</td>
                  </tr>
                  <tr>
                    <td className="col-md-6">Price</td>
                    <td className="col-md-6"> {convertToIndianFormat(stone.price)}/-</td>
                  </tr>
                  <tr>
                    <td className="col-md-6">Stone Size</td>
                    <td className="col-md-6">{stone.stoneSize}</td>
                  </tr>
                  <tr>
                    <td className="col-md-3">Stone Shape</td>
                    <td className="col-md-3">{stone.stoneShape}</td>
                  </tr>
                  <tr>
                    <td className="col-md-3">Stones Count</td>
                    <td className="col-md-6">{stone.stonesCount}</td>
                  </tr>
                  <tr>
                    <td className="col-md-3">Stone Colour</td>
                    <td className="col-md-6">{stone.stoneColour}</td>
                  </tr>
                  <tr>
                    <td className="col-md-3">Stone Weight</td>
                    <td className="col-md-6">{stone.stoneWeight}</td>
                  </tr>
                  <tr>
                    <td className="col-md-3">Stone Setting Type</td>
                    <td className="col-md-6">{stone.stoneSettingtype}</td>
                  </tr>
                </React.Fragment>
              ))}

              <tr>
                <th colSpan="2">METAL DETAILS</th>
              </tr>
              {product.goldKt && product.goldKt
                .filter(gold => gold.goldKt === selectedGoldKt) 
                .map((gold, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td className="col-md-6">Gold Karat</td>
                      <td className="col-md-6">{gold.goldKt}</td>
                    </tr>
                    <tr>
                      <td className="col-md-6">Price</td>
                      <td className="col-md-6"> {convertToIndianFormat(gold.price)}/-</td>
                    </tr>
                    <tr>
                      <td className="col-md-6">Gold Weight</td>
                      <td className="col-md-6">{gold.goldWeight}</td>
                    </tr>
                  </React.Fragment>
                ))}
              <tr>
                <th colSpan="2">PRICE BREAKUP</th>
              </tr>
              {product.goldKt && product.goldKt
                .filter(gold => gold.goldKt === selectedGoldKt) 
                .map((gold, index) => (
                  <tr>
                    <td className="col-md-6">Gold Price</td>
                    <td className="col-md-6"> {convertToIndianFormat(gold.price)}/-</td>
                  </tr>
                ))}
              {product.diamondType && product.diamondType
                .filter(diamond => diamond.type === selectedDiamondType) 
                .map((diamond, index) => (
                  <tr>
                    <td className="col-md-6">Diamond Price</td>
                    <td className="col-md-6"> {convertToIndianFormat(diamond.price)}/-</td>
                  </tr>
                ))}
              {product.stoneType && product.stoneType.map((stone, index) => (
                <tr>
                  <td className="col-md-6">{stone.stone}</td>
                  <td className="col-md-6"> {convertToIndianFormat(stone.price)}/-</td>
                </tr>
              ))}
              {product.makingCharges && (
                <tr>
                  <td className="col-md-6">Making Charges</td>
                  <td className="col-md-6"> {convertToIndianFormat(product.makingCharges)}/-</td>
                </tr>
              )}
              {product.gst && (
                <tr>
                  <td className="col-md-6">GST</td>
                  <td className="col-md-6"> {convertToIndianFormat(product.gst)}/-</td>
                </tr>
              )}
              {
                <tr>
                  <td className="col-md-6">Total</td>
                  <td className="col-md-6"> {convertToIndianFormat(finalTotal)}/-</td>
                </tr>
              }
            </tbody>
          </table>
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

export default Description;