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
    const visibleSeersDesktop = 5; // Desktop แสดง 5 คน
    const visibleSeersMobile = 3; // มือถือแสดง 3 คน

    const nextSlide = () => {
        if (currentIndex < seers.length - visibleSeersDesktop) {
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
            {/* Header พร้อมปุ่มเลื่อน */}
            <SeerHeader onPrev={prevSlide} onNext={nextSlide} currentIndex={currentIndex} totalSeers={seers.length} />

            {/* Desktop: Slide ได้, มือถือ & iPad: Scroll ขวาได้ */}
            <div className="w-full">
                {/*  Desktop: Slide ได้, ไม่มี Scroll */}
                <div className="hidden md:block overflow-hidden">
                    <div className="flex transition-transform duration-300"
                        style={{ transform: `translateX(-${currentIndex * 100 / visibleSeersDesktop}%)` }}>
                        {seers.map((seer, index) => (
                            <SeerCard key={index} seer={seer} />
                        ))}
                    </div>
                </div>

                {/*  มือถือ & iPad: Scroll ขวาได้ */}
                <div className="md:hidden flex overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {seers.map((seer, index) => (
                        <SeerCard key={index} seer={seer} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PopularSeers;
