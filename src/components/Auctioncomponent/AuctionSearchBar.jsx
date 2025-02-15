import React from "react";
import { FaSearch } from "react-icons/fa";

const AuctionSearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center bg-white border border-gray-300 rounded-full w-full max-w-2xl px-4 py-3 mt-10">
      {/* ไอคอนค้นหา */}
      <FaSearch className="text-gray-400 ml-2" />

      {/* ช่องค้นหา */}
      <input
        type="text"
        placeholder="ชื่อหมอดู, แพ็กเกจ, หมวดหมู่"
        className="w-full text-gray-500 placeholder-gray-400 focus:outline-none px-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* ปุ่มค้นหา */}
      <button className="bg-[#4C1D95] text-white font-semibold px-6 py-2 rounded-full">
        ค้นหา
      </button>
    </div>
  );
};

export default AuctionSearchBar;
