import React from "react";
import Images from "../../../assets";
import { useNavigate } from "react-router-dom"; // ✅ นำเข้า useNavigate

const PackageHeader = ({ onPrev, onNext, currentIndex, totalPackages }) => {
    const navigate = useNavigate(); // ✅ สร้าง instance navigate

    // ✅ ฟังก์ชันเมื่อกดปุ่ม "ทั้งหมด"
    const handleViewAll = () => {
        navigate("/search-booking"); // ไปหน้า search-booking
    };

    return (
        <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col">
                <h2 className="text-2xl font-bold flex items-center">
                    <span className="w-2 h-6 bg-purple-700 mr-2"></span> แพ็กเกจ
                </h2>
                <p className="text-gray-500 text-xl">เลือกแพ็กเกจที่คุณสนใจ</p>
            </div>

            {/* ปุ่มทั้งหมด และควบคุมเลื่อน */}
            <div className="hidden sm:flex items-center gap-4">
                <button
                    className="border border-gray-400 px-4 py-1 rounded-full text-purple-700 text-xl font-medium"
                    onClick={handleViewAll} // ✅ ไปหน้า search-booking
                >
                    ทั้งหมด
                </button>
                <div className="flex items-center gap-2">
                    <button onClick={onPrev} disabled={currentIndex === 0} className="p-2 rounded-full shadow-md">
                        <img
                            src={currentIndex === 0 ? Images.Arrowleft : Images.Arrowleftcolor}
                            alt="prev"
                            className="w-8 h-8"
                        />
                    </button>
                    <span className="text-gray-600 text-xl">
                        {currentIndex + 1} of {totalPackages}
                    </span>
                    <button
                        onClick={onNext}
                        disabled={currentIndex >= totalPackages - 4}
                        className="p-2 rounded-full shadow-md"
                    >
                        <img src={Images.ArrowRight} alt="next" className="w-8 h-8" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PackageHeader;
