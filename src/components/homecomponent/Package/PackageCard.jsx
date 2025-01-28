import React from "react";
import Images from "../../../assets";
import SeerRating from "../SeerPopular/SeerRating";
import { useNavigate } from "react-router-dom"; // ✅ ใช้ useNavigate

const PackageCard = ({ packageInfo }) => {
    const navigate = useNavigate(); // ✅ ใช้ useNavigate

    const iconMap = {
        call: Images.call,
        chat: Images.ChatLine,
        video: Images.videocall,
    };

    // ✅ ฟังก์ชันนำทางไปยังหน้า BookingSeer
    const handleBooking = () => {
        navigate("/bookingseer", { state: { packageInfo } });
    };

    return (
        <div className="flex flex-col w-64 bg-[#E9E9EB] rounded-lg shadow-md overflow-hidden">
            {/* รูปภาพ + ป้ายกำกับ */}
            <div className="relative w-full h-40">
                <img src={Images.pic} alt={packageInfo.title} className="w-full h-full object-cover" />
                {/* หมวดหมู่แสดงที่มุมซ้ายล่าง */}
                <span className="absolute bottom-2 left-2 bg-[#8677A7] text-white px-3 py-1 rounded-full text-xs">
                    {packageInfo.category}
                </span>
            </div>

            {/* รายละเอียดแพ็กเกจ */}
            <div className="p-4">
                <h3 className="mt-2 font-semibold text-gray-800">{packageInfo.title}</h3>
                
                <div className="flex items-center mt-2">
                    <img src={Images.profileshot} alt={packageInfo.seer} className="w-6 h-6 rounded-full mr-2" />
                    <span className="text-sm text-gray-600">{packageInfo.seer}</span>
                </div>

                <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-700 font-semibold mr-1">{packageInfo.rating.toFixed(1)}</span>
                    <SeerRating rating={packageInfo.rating} />
                    <span className="text-sm text-gray-500 ml-1">{packageInfo.reviews} reviews</span>
                </div>

                {/* ราคา */}
                <div className="mt-3 text-2xl font-bold text-purple-900">{packageInfo.price} Coins</div>

                {/* ระยะเวลา + ปุ่มจอง */}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center text-gray-500 text-sm">
                        <img src={iconMap[packageInfo.icon]} alt="duration" className="w-8 h-8 mr-2" />
                        {packageInfo.duration} นาที
                    </div>
                    <button onClick={handleBooking} className="bg-[#8677A7] text-white px-4 py-2 rounded-md text-sm">
                        จองเลย
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PackageCard;
