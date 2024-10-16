import React, { useEffect, useState } from "react";
import axiosInstance, { ImagebaseURL } from "../helpers/axios";
import jsPDF from "jspdf";
import "./MyOrders.css";
import "jspdf-autotable";
import { IoMdDownload } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const Useremail = JSON.parse(localStorage.getItem("User"));
  const userId = Useremail._id;
  const fullName = Useremail.fullName;
  const email = Useremail.email;
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchMyOrders();
  }, [userId]);

  const fetchMyOrders = async () => {
    try {
      const response = await axiosInstance.get(`/getOrdersByUser/${userId}`);
      if (response.status === 201) {
        if (response.data && response.data.length > 0) {
          setOrders(response.data);
        } else {
          setMessage("No orders found");
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
          }, 1500);
        }
      } else {
        setMessage(response.data.message);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 1500);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to fetch orders"
      );
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 1500);
    }
  };

  const itemColumns = [
    { header: "Item", dataKey: "item" },
    { header: "Product Code", dataKey: "productCode" },
    { header: "Product By", dataKey: "productBy" },
    { header: "Dimensions", dataKey: "dimensions" },
    { header: "Quantity", dataKey: "quantity" },
    { header: "Gold Type", dataKey: "goldType" },
    { header: "Gold Kt", dataKey: "goldKt" },
    { header: "Diamond Details", dataKey: "diamondDetails" },
    { header: "Stone Details", dataKey: "stoneType" },
  ];


  const generateInvoice = (order) => {
    const doc = new jsPDF();

    const title = "Invoice";
    doc.setFontSize(18);
    const titleWidth = doc.getStringUnitWidth(title) * doc.internal.scaleFactor;
    const pageWidth = doc.internal.pageSize.getWidth();
    const xPosition = (pageWidth - titleWidth) / 2;
    doc.text(title, xPosition, 10);

    doc.setFontSize(12);
    const utcDate = order.orderStatus && order.orderStatus[0] ? order.orderStatus[0].date : 'N/A';
    const localDate = new Date(utcDate).toLocaleString(); // Convert to local time
    doc.text(`Date: ${localDate}`, 10, 20);

    doc.text(`Order ID: ${order._id || 'N/A'}`, 10, 30);

    doc.text(`Customer: ${fullName}`, 10, 40);
    doc.text(`Email: ${email}`, 10, 50);

    const tableData = order.items.map((item, index) => {
      const { productCode, productBy, height, width } = item.productId || {};

      return {
        item: index + 1,
        productCode: productCode || '-',
        productBy: productBy || '-',
        quantity: `${item.quantity}`,
        dimensions: `${height ? height + 'h' : '-'} * ${width ? width + 'w' : '-'}`,
        goldType: item.goldType ? `${item.goldType} \n ${item.goldTypePrice || '-'}` : '-',
        goldKt: item.goldKt ? `${item.goldKt} \n ${item.goldKtPrice || '-'}` : '-',
        diamondDetails: item.diamondType ? `${item.diamondType} \n ${item.diamondTypePrice || '-'}` : '-',
        stoneType: item.stoneType ? `${item.stoneType} \n ${item.stonePrice || '-'}` : '-',
      };
    });

    doc.autoTable({
      startY: 60,
      head: [itemColumns.map(col => col.header)],
      body: tableData.map(row => itemColumns.map(col => row[col.dataKey])),
      theme: 'striped',
      margin: { top: 10 },
      styles: {
        cellPadding: 3,
        valign: 'top',
        overflow: 'linebreak',
        halign: 'left'
      },
      columnStyles: {
        4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' },
        6: { cellWidth: 'auto' }
      }
    });

    const paymentStartY = doc.lastAutoTable.finalY + 10;
    doc.text(`Total: ${order.totalAmount || '0'} Rs/-`, 10, paymentStartY);
    doc.text(`Payment Status: ${order.paymentStatus || 'N/A'}`, 10, paymentStartY + 10);
    doc.text(`Payment Method: ${order.paymentMethod || 'N/A'}`, 10, paymentStartY + 20);
    doc.text(`Order Status: ${order.orderStatus && order.orderStatus[0] ? order.orderStatus[0].type : 'N/A'}`, 10, paymentStartY + 30);

    doc.save(`invoice_${order._id || 'unknown'}.pdf`);
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
    <div className="main-container">
      <h3 className="MyOrder-Header">My Orders</h3>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div className="order-container" key={order._id}>
            <h3 style={{ fontSize: "20px", color: "#4f3267" }}><strong>Order ID : </strong>{order._id}</h3>
            <div className="order-items">
              {order.items &&
                order.items.map((item) => (
                  <div className="order-item" key={item._id}>
                    <div>
                      {item.productId &&
                        item.productId.productPictures &&
                        item.productId.productPictures.length > 0 && (
                          <img
                            src={`${ImagebaseURL}${item.productId.productPictures[0].img}`}
                            style={{
                              width: "220px",
                              height: "220px",
                              borderRadius: "10px",
                              margin: '30px',
                              cursor: 'pointer'
                            }}
                            alt={item.productId.name}
                            onClick={() => navigate(`/description/${item.productId._id}`)}
                          />
                        )}
                    </div>
                    <div style={{ marginLeft: '20px' }}>
                      <p style={{ fontSize: "18px" }}><strong>Product Name : </strong>{item.productId && item.productId.name}</p>
                      <p style={{ fontSize: "18px" }}><strong>Payable Price : </strong>{convertToIndianFormat(order.totalAmount)}/-</p>
                      <p style={{ fontSize: "18px" }}><strong>Payment Status : </strong>{order.paymentStatus}</p>
                      <p style={{ fontSize: "18px" }}><strong>Payment Type : </strong>{order.paymentMethod}</p>
                      <p style={{ fontSize: "18px" }}><strong>Order Status : </strong>{order.orderStatus[0].type}</p>
                      <button className="orderbutton" onClick={() => generateInvoice(order)}> 
                        <IoMdDownload style={{marginRight: '10px'}}/>
                        <strong>Invoice</strong>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))
      ) : (
        <p>No orders found</p>
      )}
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
  );
};

export default MyOrders;