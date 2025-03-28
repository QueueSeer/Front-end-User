import Images from "../../../assets";
import React from "react";
import SeerRating from "../SeerPopular/SeerRating";
import { useNavigate } from "react-router-dom";

const PackageCard = ({ packageInfo }) => {
    const navigate = useNavigate();


    const adaptedPackage = packageInfo; // ใช้ข้อมูล API ตามที่ส่งมา

    // แปลง foretell_channel เป็นไอคอน
    const getIcon = (channel) => {
        switch(channel) {
            case "phone": return Images.call;
            case "chat": return Images.ChatLine;
            case "video": return Images.videocall;
            default: return Images.call;
        }
    };

    // ฟังก์ชันนำทางไปยังหน้า BookingSeer
    const handleBooking = () => {
        navigate("/bookingseer", { 
            state: { 
                packageInfo: adaptedPackage 
            } 
        });
    };

    return (
        <div className="flex flex-col w-64 bg-[#E9E9EB] rounded-lg shadow-md overflow-hidden">
            {/* รูปภาพ + ป้ายกำกับ */}
            <div className="relative w-full h-40">
                <img 
                    src={adaptedPackage.image || Images.pic} 
                    alt={adaptedPackage.name} 
                    className="w-full h-full object-cover" 
                />
                {/* หมวดหมู่แสดงที่มุมซ้ายล่าง */}
                <span className="absolute bottom-2 left-2 bg-[#8677A7] text-white px-3 py-1 rounded-full text-xs">
                    {adaptedPackage.category || adaptedPackage.reading_type}
                </span>
            </div>

            {/* รายละเอียดแพ็กเกจ */}
            <div className="p-4">
                <h3 className="mt-2 font-semibold text-gray-800">{adaptedPackage.name}</h3>
                
                <div className="flex items-center mt-2">
                    <img 
                        src={adaptedPackage.seer_image || Images.profileshot} 
                        alt={adaptedPackage.seer_display_name} 
                        className="w-6 h-6 rounded-full mr-2" 
                    />
                    <span className="text-sm text-gray-600">{adaptedPackage.seer_display_name}</span>
                </div>

                <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-700 font-semibold mr-1">
                        {parseFloat(adaptedPackage.seer_rating).toFixed(1)}
                    </span>
                    <SeerRating rating={parseFloat(adaptedPackage.seer_rating)} />
                    <span className="text-sm text-gray-500 ml-1">{adaptedPackage.seer_review_count} reviews</span>
                </div>

                {/* ราคา */}
                <div className="mt-3 text-2xl font-bold text-purple-900">
                    {parseFloat(adaptedPackage.price)} Coins
                </div>

                {/* ระยะเวลา + ปุ่มจอง */}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center text-gray-500 text-sm">
                        <img 
                            src={getIcon(adaptedPackage.foretell_channel)} 
                            alt="duration" 
                            className="w-8 h-8 mr-2" 
                        />
                        {adaptedPackage.duration} นาที
                    </div>
                    <button 
                        onClick={handleBooking} 
                        className="bg-[#8677A7] text-white px-4 py-2 rounded-md text-sm"
                    >
                        จองเลย
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PackageCard;