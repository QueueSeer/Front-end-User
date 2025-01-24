import React, { useState } from "react";
import Images from "../../../assets";
import SeerHeader from "./SeerHeader";
import SeerCard from "./SeerCard";

const PopularSeers = () => {
    const seers = [
        { name: "หมอดูเพียงฟ้า พาขวัญ", category: "ศาสตร์ไพ่ยิปซี", rating: 4.0 },
        { name: "หมอดูเจนรบ", category: "โหราศาสตร์ไทย", rating: 4.0 },
        { name: "หมอเบียร์คนตื่นธรรม", category: "โหราศาสตร์", rating: 4.0 },
        { name: "หมอเจนนี่ ดวงดาว", category: "ศาสตร์ไพ่ยิปซี", rating: 4.0 },
        { name: "หมอดูภาลัย", category: "โหงวเฮ้ง", rating: 4.0 },
        { name: "หมอดูสุดา", category: "ศาสตร์ไพ่ยิปซี", rating: 4.0 },
        { name: "หมอดูสุดา", category: "ศาสตร์ไพ่ยิปซี", rating: 4.0 },
        { name: "หมอดูสุดา", category: "ศาสตร์ไพ่ยิปซี", rating: 4.0 },
        { name: "หมอดูสุดา", category: "ศาสตร์ไพ่ยิปซี", rating: 4.0 },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleSeers = 5; // เพิ่มจำนวนหมอดูที่แสดงเป็น 5 คนแทน 3

    const nextSlide = () => {
        if (currentIndex < seers.length - visibleSeers) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="p-12">
            <SeerHeader onPrev={prevSlide} onNext={nextSlide} currentIndex={currentIndex} totalSeers={seers.length} />
            <div className="overflow-hidden w-full">
                <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentIndex * 100 / visibleSeers}%)` }}>
                    {seers.map((seer, index) => (
                        <SeerCard key={index} seer={seer} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PopularSeers;
