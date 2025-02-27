import React from "react";
import "./ShippingPolicy.css";

const ShippingPolicy = () => {
  return (
    <div className="disclaimer_header">
      <div className="Shipping">
      <h1 style={{ color: "#4f3267", fontFamily: "'Domine', serif", }}><b>SHIPPING POLICY</b></h1>
      </div>
      <div className="Shipping-content">
        <p>
          Thank you for shopping with  <span style={{ color: '#de57e5' }}>Chatoyer</span>. We want to ensure that your shopping experience is as smooth and enjoyable as possible. Please take a moment to review our shipping policy.
        </p>
        <p>
          All orders are typically processed within 7 business days (excluding weekends and holidays) after payment confirmation. We make every effort to process and ship your order as quickly as possible.
        </p>
        <h2 className="section-header">Shipping Methods</h2>
        <p>We offer the following shipping options:</p>
        <ul>
          <li>
            <b className="boldcontent">Standard Shipping:</b> Estimated delivery within 1 to 7 business days.
          </li>
          <li>
            <b className="boldcontent">Express Shipping:</b> Estimated delivery within 3 business days.
          </li>
        </ul>
        <h2 className="section-header">Shipping Fees</h2>
        <p>
          Shipping fees are calculated based on your order's weight, dimensions, shipping method selected, and your delivery address. You can view the shipping cost during the checkout process before completing your purchase.
        </p>
        <h2 className="section-header">Tracking Your Order</h2>
        <p>
          Once your order is shipped, you will receive a shipping confirmation email with a tracking number. You can use this tracking number to monitor the status and delivery progress of your order.
        </p>
        <h2 className="section-header">Delivery</h2>
        <p>
          We rely on trusted and reputable shipping carriers to deliver your orders. While we make every effort to ensure timely delivery, please note that delivery times may vary based on your location, shipping method, and any unforeseen circumstances.
        </p>
        <h2 className="section-header">Delayed or Lost Shipments</h2>
        <p>
          In the rare event of a delayed or lost shipment, please contact our customer support team at support@chatoyer.net We will work diligently to resolve the issue and provide you with updates on your order's status.
        </p>
        <h2 className="section-header">Shipping Restrictions</h2>
        <p>
          Some products may have shipping restrictions due to their materials or value. We will notify you if any items in your order are subject to such restrictions.
        </p>
        <h2 className="section-header">Address Accuracy</h2>
        <p>
          Please ensure that your shipping address is accurate and complete to prevent delays or delivery issues. We are not responsible for orders shipped to incorrect or incomplete addresses provided by the customer.
        </p>
        <p>
          If you have any questions, concerns, or special requests regarding shipping, please feel free to contact our customer support team at support@chatoyer.net
        </p>
        <p>
          By placing an order with  <span style={{ color: '#de57e5' }}>Chatoyer</span>, you agree to comply with our shipping policy. We appreciate your business and are committed to providing you with high-quality jewellery and excellent service.
        </p>
      </div>
      <div className="Shipping-content1">
        <p>
          <b className="boldcontent">ADDRESS:</b> Banjara Hills, Hyd 8-2-626/2 Road No. 10, Banjara Hills, Hyderabad-500034, Telangana, India
        </p>
        <p>
          <b className="boldcontent">CONTACT NUMBER:</b> +91 98456 23985
        </p>
        <p>
          <b className="boldcontent">EMAIL:</b>support@chatoyer.net
        </p>
      </div>
    </div>
  );
};

export default ShippingPolicy;
