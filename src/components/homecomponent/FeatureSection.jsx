import React from "react";
import Images from "../../assets";

const FeatureSection = () => {
    const features = [
      { img: Images.AuctionQueue },
      { img: Images.horoscope },
      { img: Images.Howto },
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {features.map((feature, index) => (
          <div key={index} className="relative max-w-xl mx-auto"> 
            <img src={feature.img} className="w-full h-auto rounded-lg shadow-lg max-h-60 object-cover" />
          </div>
        ))}
      </div>
    );
  };
  
export default FeatureSection;
