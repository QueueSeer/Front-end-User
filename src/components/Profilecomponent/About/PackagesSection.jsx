import React, { useState } from "react";
import PackagesHeader from "./PackagesHeader";
import TrendingPackageCard from "./AboutComponent/TrendingPackageCard";

const trendingPackages = [
  { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 935, price: 45, duration: 15, icon: "call", tags: ["ความรัก", "การเงิน"] },
  { title: "Package 2", seer: "หมอดูภาลัย", rating: 4.5, reviews: 810, price: 60, duration: 20, icon: "chat", tags: ["การงาน", "สุขภาพ"] },
  { title: "Package 3", seer: "หมอดูณัฐ", rating: 4.8, reviews: 1200, price: 99, duration: 25, icon: "video", tags: ["การงาน", "สุขภาพ"] },
  { title: "Package 4", seer: "หมอดูดิน", rating: 4.2, reviews: 540, price: 30, duration: 10, icon: "call", tags: ["ภาพรวม", "การเงิน"] },
  { title: "Package 5", seer: "หมอดูอิฐ", rating: 4.0, reviews: 450, price: 80, duration: 30, icon: "chat", tags: ["ความรัก", "ภาพรวม"] },
  { title: "Package 6", seer: "หมอดูไฟ", rating: 4.6, reviews: 900, price: 110, duration: 35, icon: "video", tags: ["สุขภาพ", "การเงิน"] },
  { title: "Package 7", seer: "หมอดูลม", rating: 4.3, reviews: 630, price: 55, duration: 18, icon: "call", tags: ["ความรัก", "การงาน"] },
  { title: "Package 8", seer: "หมอดูนที", rating: 4.9, reviews: 1500, price: 120, duration: 40, icon: "chat", tags: ["การเงิน", "สุขภาพ"] },
  { title: "Package 9", seer: "หมอดูชมพู", rating: 4.1, reviews: 510, price: 25, duration: 12, icon: "video", tags: ["ภาพรวม", "การเงิน"] },
  { title: "Package 10", seer: "หมอดูเขียว", rating: 4.7, reviews: 890, price: 95, duration: 28, icon: "call", tags: ["ความรัก", "ภาพรวม"] },
  { title: "Package 11", seer: "หมอดูฟ้า", rating: 4.5, reviews: 820, price: 50, duration: 22, icon: "chat", tags: ["การเงิน", "สุขภาพ"] },
  { title: "Package 12", seer: "หมอดูส้ม", rating: 4.4, reviews: 780, price: 75, duration: 30, icon: "video", tags: ["ภาพรวม", "การงาน"] },
];

const PackagesSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // แสดง 10 รายการต่อหน้า (5x2)
  const totalPages = Math.ceil(trendingPackages.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      {/* 🔹 ใช้ PackagesHeader ใหม่ */}
      <PackagesHeader
        onPrev={prevPage}
        onNext={nextPage}
        currentIndex={currentPage}
        totalPages={totalPages}
      />

      {/* 🔹 แสดงแพ็กเกจ (2 แถว, 5 คอลัมน์) */}
      <div className="grid grid-cols-5 gap-5  ">
        {trendingPackages
          .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
          .map((pkg, index) => (
            <TrendingPackageCard key={index} packageInfo={pkg} />
          ))}
      </div>
    </div>
  );
};

export default PackagesSection;
