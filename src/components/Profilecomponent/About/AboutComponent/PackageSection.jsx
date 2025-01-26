import React, { useState } from "react";
import PackageCard from "../../../homecomponent/Package/PackageCard";

const PackageSection = ({ selectedTag }) => {
  const allPackages = [
    { title: "ความรักในปีนี้จะเป็นอย่างไร", category: "ความรัก", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 935, price: 49, duration: 15, icon: "call", isPromotion: true },
    { title: "ดวงการเงินเดือนนี้", category: "การเงิน", seer: "หมอดูภาลัย", rating: 4.5, reviews: 1020, price: 79, duration: 20, icon: "chat", isNew: true },
    { title: "ความสัมพันธ์ไปต่อหรือพอแค่นี้", category: "ความรัก", seer: "หมอเบียร์", rating: 4.0, reviews: 935, price: 199, duration: 30, icon: "video", isDiscount: true },
    { title: "ดูดวงการงานในปีนี้", category: "การงาน", seer: "หมอดูเจนรบ", rating: 4.0, reviews: 935, price: 59, duration: 15, icon: "call" },
  ];

  // กรองแพ็กเกจตามแท็กที่เลือก
  const filteredPackages = selectedTag ? allPackages.filter(pkg => pkg.category === selectedTag) : allPackages;

  return (
    <div>
      <h2 className="text-2xl font-bold flex items-center mt-10">
          <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>โปรโมชัน แพ็กเกจพิเศษ
        </h2>
      <div className="grid grid-cols-3  mt-5">
        {filteredPackages.map((pkg, index) => (
          <PackageCard key={index} packageInfo={pkg} />
        ))}
        
      </div>
      
      </div>
      
 
  );
};

export default PackageSection;
