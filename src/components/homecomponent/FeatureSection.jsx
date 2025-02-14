import React from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../assets";

const FeatureSection = () => {
  const navigate = useNavigate();

  const features = [
    { img: Images.AuctionQueue, path: "/auction" },
    { img: Images.horoscope, path: "/horoscope" },
    { img: Images.Howto, path: "/landingPage" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {features.map((feature, index) => (
        <div key={index} className="relative max-w-xl mx-auto">
          <img
            src={feature.img}
            alt={`feature-${index}`}
            className="w-full h-auto rounded-lg shadow-lg max-h-60 object-cover cursor-pointer hover:opacity-80 transition"
            onClick={() => navigate(feature.path)} // นำทางไปหน้าที่กำหนด
          />
        </div>
      ))}
    </div>
  );
};

export default FeatureSection;
