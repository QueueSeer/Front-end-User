import React, { useState } from "react";
import PackageHeader from "./PackageHeader";
import PackageCard from "./PackageCard";

const PackageSection = () => {
    const packages = [
        { title: "ความรักในปีนี้จะเป็นอย่างไร", category: "ดูดวงไพ่ยิปซี", seer: "หมอดูเพียงฟ้า พาขวัญ", rating: 4.0, reviews: 935, price: 49, duration: 15, icon: "call" },
        { title: "ภาพรวมดวงรายเดือนนี้", category: "ดูดวงไพ่ยิปซี", seer: "หมอดูเพียงฟ้า พาขวัญ", rating: 4.0, reviews: 935, price: 99, duration: 15, icon: "chat" },
        { title: "ความสัมพันธ์ไปต่อหรือพอแค่นี้", category: "โหราศาสตร์ลัคกาล", seer: "หมอเบียร์คนตื่นธรรม", rating: 4.0, reviews: 935, price: 199, duration: 30, icon: "video" },
        { title: "ดูดวงการงานในปีนี้", category: "โหราศาสตร์ไทย", seer: "หมอดูเจนรบ", rating: 4.0, reviews: 935, price: 59, duration: 15, icon: "call" },
        { title: "ดวงการเงินเดือนนี้", category: "ดูดวงไพ่ยิปซี", seer: "หมอดูภาลัย", rating: 4.5, reviews: 1020, price: 79, duration: 20, icon: "chat" },
        
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const visiblePackages = 5; // ขยายเป็น 5 Card ต่อหน้า

    const nextSlide = () => {
        if (currentIndex < packages.length - visiblePackages) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="p-12 translate-y-[-60px]  ">
            <PackageHeader onPrev={prevSlide} onNext={nextSlide} currentIndex={currentIndex} totalPackages={packages.length} />
            <div className="overflow-hidden w-full">
                <div className="flex transition-transform duration-300 gap-6" style={{ transform: `translateX(-${currentIndex * 100 / visiblePackages}%)` }}>
                    {packages.map((pkg, index) => (
                        <PackageCard key={index} packageInfo={pkg} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PackageSection;
