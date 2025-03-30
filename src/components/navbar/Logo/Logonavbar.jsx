import React from 'react';
import Images from '../../../assets'; // Replace with the actual path to your Images module
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const LogoNavbar = () => {
  const navigate = useNavigate(); // Initialize the navigate function
  
  // Function to handle clicking on the logo or text
  const handleLogoClick = () => {
    navigate('/homepage'); // Navigate to homepage
  };

  return (
    <div className="flex-1 flex items-center gap-4">
      <div 
        className="flex items-center gap-4 cursor-pointer" 
        onClick={handleLogoClick}
      >
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
    </div>
  );
};

export default LogoNavbar;