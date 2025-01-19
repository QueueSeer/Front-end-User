// logonavbar.jsx

import React from 'react';
import Images from '../../../assets'; // Replace with the actual path to your Images module

const LogoNavbar = () => {
  return (
    <div className="flex-1 flex items-center gap-4">
      <img
        src={Images.logo}
        alt="Logo"
        className="w-10 h-10 rounded-md mt-2"
      />
      <span
        className="text-2xl font-extrabold text-purple-800"
        style={{ fontFamily: "Playfair Display", fontSize: "32px" }}
      >
        Qseer
      </span>
    </div>
  );
};

export default LogoNavbar;