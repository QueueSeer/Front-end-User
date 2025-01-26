import React from "react";
import Images from "../../../assets";


const SocialLinks = () => {
  return (
    <div className="flex space-x-4 mt-4">
      <img src={Images.Facebook} alt="Facebook" className="w-6 h-6 cursor-pointer" />
      <img src={Images.X} alt="X" className="w-6 h-6 cursor-pointer" />
      <img src={Images.Instagram} alt="Instagram" className="w-6 h-6 cursor-pointer" />
      <img src={Images.Youtube} alt="YouTube" className="w-6 h-6 cursor-pointer" />
      <img src={Images.Tiktok} alt="TikTok" className="w-6 h-6 cursor-pointer" />
    </div>
  );
};

export default SocialLinks;
