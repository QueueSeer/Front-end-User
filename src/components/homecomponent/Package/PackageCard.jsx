import React from "react";
import Images from "../../../assets";
import SeerRating from "../SeerPopular/SeerRating";
import { useNavigate } from "react-router-dom";

const PackageCard = ({ packageInfo }) => {
    const navigate = useNavigate();

    // ตรวจสอบว่า packageInfo มีโครงสร้างเดิมหรือโครงสร้าง API
    const isApiFormat = packageInfo.hasOwnProperty('seer_display_name');
    
    // แปลงข้อมูลให้เข้ากับรูปแบบที่ต้องการ
    const packageData = isApiFormat 
        ? {
            id: packageInfo.id,
            title: packageInfo.name,
            category: packageInfo.category || packageInfo.reading_type,
            seer: packageInfo.seer_display_name,
            rating: parseFloat(packageInfo.seer_rating),
            reviews: packageInfo.seer_review_count,
            price: parseFloat(packageInfo.price),
            duration: packageInfo.duration,
            icon: packageInfo.foretell_channel === "chat" ? "chat" : 
                  packageInfo.foretell_channel === "phone" ? "call" : "video",
            image: packageInfo.image,
            seerImage: packageInfo.seer_image
        }
        : packageInfo; // ใช้ข้อมูลเดิมถ้าไม่ใช่รูปแบบ API

    const iconMap = {
        call: Images.call,
        chat: Images.ChatLine,
        video: Images.videocall,
    };

    // ฟังก์ชันนำทางไปยังหน้า BookingSeer
    const handleBooking = () => {
        // ส่งข้อมูลในรูปแบบเดิมเพื่อรักษาความเข้ากันได้กับหน้า BookingSeer
        navigate("/bookingseer", { 
            state: { 
                packageInfo: isApiFormat ? packageData : packageInfo 
            } 
        });
    };

    return (
        <div className="flex flex-col w-64 bg-[#E9E9EB] rounded-lg shadow-md overflow-hidden">
            {/* รูปภาพ + ป้ายกำกับ */}
            <div className="relative w-full h-40">
                <img 
                    src={packageData.image || Images.pic} 
                    alt={packageData.title} 
                    className="w-full h-full object-cover" 
                />
                {/* หมวดหมู่แสดงที่มุมซ้ายล่าง */}
                <span className="absolute bottom-2 left-2 bg-[#8677A7] text-white px-3 py-1 rounded-full text-xs">
                    {packageData.category}
                </span>
            </div>

            {/* รายละเอียดแพ็กเกจ */}
            <div className="p-4">
                <h3 className="mt-2 font-semibold text-gray-800">{packageData.title}</h3>
                
                <div className="flex items-center mt-2">
                    <img 
                        src={packageData.seerImage || Images.profileshot} 
                        alt={packageData.seer} 
                        className="w-6 h-6 rounded-full mr-2" 
                    />
                    <span className="text-sm text-gray-600">{packageData.seer}</span>
                </div>

                <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-700 font-semibold mr-1">
                        {typeof packageData.rating === 'number' ? packageData.rating.toFixed(1) : parseFloat(packageData.rating).toFixed(1)}
                    </span>
                    <SeerRating rating={packageData.rating} />
                    <span className="text-sm text-gray-500 ml-1">{packageData.reviews} reviews</span>
                </div>

                {/* ราคา */}
                <div className="mt-3 text-2xl font-bold text-purple-900">
                    {typeof packageData.price === 'number' ? packageData.price : parseFloat(packageData.price)} Coins
                </div>

                {/* ระยะเวลา + ปุ่มจอง */}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center text-gray-500 text-sm">
                        <img 
                            src={iconMap[packageData.icon]} 
                            alt="duration" 
                            className="w-8 h-8 mr-2" 
                        />
                        {packageData.duration} นาที
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