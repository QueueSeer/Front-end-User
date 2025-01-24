import React from "react";
import Images from "../../assets";

const SearchBar = () => {
  return (
    <div className="relative -mt-16 flex justify-center w-full max-w-3xl mx-auto border-2 rounded-lg overflow-hidden shadow-xl bg-white p-3 
      sm:p-2 sm:max-w-xl md:max-w-3xl">
      
      {/* ไอคอน Search */}
      <div className="flex items-center px-3 bg-white border-r 
        sm:px-2 sm:w-10 sm:flex sm:items-center">
        <img src={Images.Searchicon} alt="Search" className="w-6 h-6 sm:w-5 sm:h-5 text-gray-500 sm:block" />
      </div>

      {/* ช่อง Input */}
      <input
        type="text"
        placeholder="ชื่อหมอดู, แพคเกจ, หมวดหมู่"
        className="p-3 flex-grow text-gray-500 focus:outline-none 
        sm:p-2 sm:text-sm"
      />

      {/* ปุ่มค้นหา */}
      <button className="bg-purple-900 text-white px-6 py-2 font-semibold rounded-lg 
        sm:px-3 sm:py-1 sm:text-sm">
        ค้นหา
      </button>
    </div>
  );
};

export default SearchBar;
