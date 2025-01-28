import React from "react";


const Header = ({ profileImageUrl }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Qseer</h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <i className="fas fa-bell"></i>
        </button>
        <img src={profileImageUrl} alt="Profile" className="w-10 h-10 rounded-full border-2 border-gray-300" />
      </div>
    </div>
  );
};

export default Header;
