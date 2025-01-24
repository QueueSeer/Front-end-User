import React from "react";
import Images from "../../assets";

const SearchBar = () => {
  return (
    <div className="relative -mt-16 flex justify-center w-full max-w-3xl mx-auto border-2 rounded-lg overflow-hidden shadow-xl bg-white p-3">
      <div className="flex items-center px-3 bg-white border-r">
        
      <img src={Images.Searchicon} alt="Search" className="w-6 h-6 text-gray-500" />
      </div>
      <input
        type="text"
        placeholder="ชื่อหมอดู, แพคเกจ, หมวดหมู่"
        className="p-2 flex-grow text-gray-500 focus:outline-none"
      />
      <button className="bg-purple-900 text-white px-6 py-2 font-semibold rounded-lg">ค้นหา</button>
    </div>
  );
};

export default SearchBar;
