import React from "react";
import PromotionPackageCard from "./PromotionPackageCard";
import NewPackageCard from "./NewPackageCard";
import TrendingPackageCard from "./TrendingPackageCard";

const PackageSection = ({ selectedTag }) => {
  // 📌 ฟังก์ชันกรองแพ็กเกจตามแท็กที่เลือก
  const filterPackages = (packages) => {
    return selectedTag === ""
      ? packages // ❗ ถ้าไม่มีแท็กที่เลือก แสดงทั้งหมด
      : packages.filter((pkg) => pkg.tags.includes(selectedTag)); // ✅ กรองตามแท็กที่เลือก
  };

  // 📌 ข้อมูลแพ็กเกจที่ถูกกรอง
  const promotionPackages = filterPackages([
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 10, price: 45, oldPrice: 99, duration: 15, icon: "call", tags: ["ความรัก", "การเงิน"] },
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 10, price: 45, oldPrice: 99, duration: 15, icon: "chat", tags: ["ความรัก", "การเงิน"] },
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 10, price: 45, oldPrice: 99, duration: 15, icon: "video", tags: ["การงาน", "สุขภาพ"] },
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 10, price: 45, oldPrice: 99, duration: 15, icon: "call", tags: ["ความรัก", "ภาพรวม"] },
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 10, price: 45, oldPrice: 99, duration: 15, icon: "call", tags: ["ภาพรวม", "การเงิน"] },
  ]);

  const newPackages = filterPackages([
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 12, price: 45, duration: 15, icon: "call", tags: ["ความรัก", "การเงิน"] },
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 12, price: 45, duration: 15, icon: "chat", tags: ["ภาพรวม", "การเงิน"] },
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 12, price: 45, duration: 15, icon: "video", tags: ["การงาน", "สุขภาพ"] },
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 12, price: 45, duration: 15, icon: "call", tags: ["การงาน", "สุขภาพ"] },
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 12, price: 45, duration: 15, icon: "call", tags: ["ความรัก", "ภาพรวม"] },
  ]);

  const trendingPackages = filterPackages([
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 935, price: 45, duration: 15, icon: "call", tags: ["ความรัก", "การเงิน"] },
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 935, price: 45, duration: 15, icon: "chat", tags: ["การงาน", "สุขภาพ"] },
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 935, price: 45, duration: 15, icon: "video", tags: ["การงาน", "สุขภาพ"] },
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 935, price: 45, duration: 15, icon: "call", tags: ["ภาพรวม", "การเงิน"] },
    { title: "Package 1", seer: "หมอดูเพียงฟ้า", rating: 4.0, reviews: 12, price: 45, duration: 15, icon: "call", tags: ["ความรัก", "ภาพรวม"] },
  ]);

  return (
    <div className="space-y-10 mt-10">
      {promotionPackages.length === 0 && newPackages.length === 0 && trendingPackages.length === 0 ? (
        <p className="text-gray-600 text-center mt-5">ไม่มีแพ็กเกจที่ตรงกับแท็ก "{selectedTag}"</p>
      ) : (
        <>
          {/* 🔹 โปรโมชัน แพ็กเกจพิเศษ */}
          <section>
            <h2 className="text-2xl font-bold flex items-center">
              <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>
              โปรโมชัน แพ็กเกจพิเศษ
            </h2>
            <div className="grid grid-cols-5 mt-5 pl-5">
              {promotionPackages.map((pkg, index) => (
                <PromotionPackageCard key={index} packageInfo={pkg} />
              ))}
            </div>
          </section>

          {/* 🔹 แพ็กเกจมาใหม่ */}
          <section>
            <h2 className="text-2xl font-bold flex items-center">
              <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>
              แพ็กเกจมาใหม่
            </h2>
            <div className="grid grid-cols-5 mt-5 pl-5">
              {newPackages.map((pkg, index) => (
                <NewPackageCard key={index} packageInfo={pkg} />
              ))}
            </div>
          </section>

          {/* 🔹 แพ็กเกจมาแรง */}
          <section>
            
         

            <h2 className="text-2xl font-bold flex items-center">
              <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>
              แพ็กเกจมาแรง
            </h2>
            <div className="grid grid-cols-5 mt-5 pl-5">
              {trendingPackages.map((pkg, index) => (
                <TrendingPackageCard key={index} packageInfo={pkg} />
              ))}
            </div>

          </section>
        </>
      )}
    </div>
  );
};

export default PackageSection;
