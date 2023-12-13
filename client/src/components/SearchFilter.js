// SearchFilter.js
import React from "react";

const SearchFilter = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search..."
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchFilter;
