import React, { useState, useEffect } from 'react';
import axiosInstance, { ImagebaseURL } from '../../helpers/axios';
import './ImageGallery.css';

const ImageGallery = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/getCategory");
        setData(response.data.categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="image-gallery">
      {data.map((category, index) => (
        <div className="image-card" key={index}>
          <a href={`/${category.name}`} rel="noopener noreferrer">
            <img className="Cimage" alt={category.name} src={`${ImagebaseURL}${category.categoryImage}`} />
          </a>
          <h4 className="image-title">{category.name}</h4>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
