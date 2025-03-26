import React from "react";
import { FaSearch } from "react-icons/fa";

const ActionSearchBar = ({ searchTerm, setSearchTerm, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSearch === 'function') {
      onSearch();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (typeof onSearch === 'function') {
        onSearch();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex justify-center">
      <div className="flex items-center bg-white border border-gray-300 rounded-full w-full max-w-3xl px-4 py-3 mt-10">
        {/* ไอคอนค้นหา */}
        <FaSearch className="text-gray-400 ml-2" />

        {/* ช่องค้นหา */}
        <input
          type="text"
          placeholder="ชื่อหมอดู, แพ็กเกจ, หมวดหมู่"
          className="w-full text-gray-500 placeholder-gray-400 focus:outline-none px-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        {/* ปุ่มค้นหา */}
        <button 
          type="submit"
          className="bg-[#4C1D95] text-white font-semibold px-6 py-2 rounded-full"
        >
          ค้นหา
        </button>
      </div>
    </form>
  );
};

export default ActionSearchBar;