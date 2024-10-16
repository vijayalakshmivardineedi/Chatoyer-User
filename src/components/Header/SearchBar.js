import React, { useState } from 'react';
import axiosInstance from 'axios';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get("/getProductNamesAndId");
      if (response.data.success) {
        setSuggestions(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = async (e) => {
    setSearchTerm(e.target.value);
    await fetchProducts();
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search for products..."
        value={searchTerm}
        onChange={handleSearch}
      />
      <ul>
        {suggestions.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
