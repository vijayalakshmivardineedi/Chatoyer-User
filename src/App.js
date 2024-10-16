import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Earrings from "./categories/Earrings";
import Signup from "./Auth/Signup";
import ForgotPassword from "./Auth/ForgotPassword";
import Login from "./Auth/Login";
import Token from "./Auth/token";
import Home from "./components/HomePage/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Bangles from "./categories/Bangles";
import Pendants from "./categories/Pendants";
import Chains from "./categories/Chains";
import AboutPage from "./Policypages/AboutPage";
import WishList from "./components/Wishlist/WishList";
import Rings from "./categories/Rings";
import Cart from "./components/Cart/Cart";
import ShippingPolicy from "./Policypages/ShippingPolicy";
import Disclaimer from "./Policypages/Disclaimer";
import PrivacyPolicy from "./Policypages/PrivacyPolicy";
import ReturnPolicy from "./Policypages/ReturnPolicy";
import TermsCon from "./Policypages/TermsCon";
import Checkout from "./Order/Checkout";
import Profile from "./User/Profile";
import ProtectRoute from './components/HOC/ProtectRoute';
import Description from "./description/description";
import MyOrders from "./User/MyOrders";
import Order from "./Order/Order";
import Success from "./Order/Success";
import SearchBar from "./components/Header/SearchBar";


const App = () => {
  const [cart, setCart] = useState([]);
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (product) => {
    const updatedCart = cart.filter((item) => item.id !== product.id);
    setCart(updatedCart);
  };

  const [order, setOrder] = useState([]);
  const addToOrder = (product) => {
    setOrder([...order, product]);
  };

  const removeFromOrder = (product) => {
    const updatedOrder = order.filter((item) => item.id !== product.id);
    setOrder(updatedOrder);
  };

  const [wishlist, setwishlist] = useState([]);

  const addToWishlist = (product) => {
    setwishlist([...wishlist, product]);
  };

  const removeFromwishlist = (product) => {
    const updatedwishlist = wishlist.filter((item) => item.id !== product.id);
    setwishlist(updatedwishlist);
  };



  return (
    <BrowserRouter>
     <Token />
      <Header />
      <Routes>
        {/*auth */}
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />

        {/* components */}
        <Route path="/Cart" element={<Cart cart={cart} removeFromCart={removeFromCart} addToWishlist={addToWishlist} addToOrder={addToOrder} />} />
        <Route element={<ProtectRoute />} />
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Home addToWishlist={addToWishlist} />} />
        <Route path="/WishList" element={<WishList wishlist={wishlist} removeFromwishlist={removeFromwishlist} addToCart={addToCart} />} />
        <Route path="/SearchBar" element={<SearchBar />} />
        
        {/* description */}
        <Route path="/description/:_id" element={<Description />} />

        {/* categories */}
        <Route path="/Bangles" element={<Bangles addToWishlist={addToWishlist} />} />   
        <Route path="/Chains" element={<Chains addToWishlist={addToWishlist} />} />
        <Route path="/Earrings" element={<Earrings addToWishlist={addToWishlist} />} />
        <Route path="/Pendants" element={<Pendants addToWishlist={addToWishlist} />} />
        <Route path="/Rings" element={<Rings addToWishlist={addToWishlist} />} />

        {/* pages */}
        <Route path="/AboutUs" element={<AboutPage />} />
        <Route path="/Disclaimer" element={<Disclaimer />} />
        <Route path="/TermsCondition" element={<TermsCon />} />
        <Route path="/ReturnPolicy" element={<ReturnPolicy />} />
        <Route path="/ShippingPolicy" element={<ShippingPolicy />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/Buy" element={<Checkout order={order} removeFromOrder={removeFromOrder} />} />



        

        {/* userPannel */}
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Myorders" element={<MyOrders />} />


        {/* order */}
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/Order" element={<Order />} />
        <Route path="/Success" element={<Success />} />
        

      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
