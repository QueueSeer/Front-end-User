import React from "react";
import Images from "../../../assets";

const PopularCategoriesHeader = () => {
    return (
        <div className="flex justify-between items-center mb-6">
            {/* หัวข้อหมวดหมู่ */}
            <div className="flex flex-col">
                <h2 className="text-2xl font-bold flex items-center">
                    <span className="w-2 h-6 bg-purple-700 mr-2"></span> หมวดหมู่ยอดนิยม
                </h2>
                <p className="text-gray-500 text-lg">เข้าชมบทความดูดวง ค้นหาเส้นทางที่ใช่สำหรับคุณ!</p>
            </div>
        </div>
    );
};

export default PopularCategoriesHeader;
