import React from "react";
import { useMediaQuery } from "react-responsive";
import Images from "../../../assets";

const CategoryCard = ({ category }) => {
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const isLastCard = category.title === "อื่น ๆ"; // ตรวจสอบว่าเป็น "อื่น ๆ"

    return (
        <div className={`relative w-full h-52 rounded-lg overflow-hidden shadow-md ${isMobile ? "mb-4" : ""}`}>
            {/* รูปพื้นหลัง */}
            <img src={Images.pic} alt={category.title} className="w-full h-full object-cover" />

            {/* Overlay สำหรับ Card ทั่วไป (ทำให้ภาพหม่นลง) */}
            {!isLastCard && <div className="absolute inset-0 bg-black opacity-20"></div>}

            {/* Overlay สำหรับ Card "อื่น ๆ" เท่านั้น (พื้นหลังมืดสนิท) */}
            {isLastCard && (
                <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center">
                    <h3 className={`text-white font-semibold ${isMobile ? "text-xs" : "text-lg"}`}>
                        {category.title}
                    </h3>
                </div>
            )}

            {/* ข้อความวางไว้ที่มุมซ้ายบนสำหรับ Card อื่น ๆ */}
            {!isLastCard && (
                <div className="absolute top-3 left-3">
                    <h3 className={`text-white font-semibold ${isMobile ? "text-xs" : "text-lg"}`}>
                        {category.title}
                    </h3>
                </div>
            )}
        </div>
    );
};

export default CategoryCard;
