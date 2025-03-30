import React from "react";
import Images from "../../../assets";
import SeerRating from "./SeerRating";
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from "react-router-dom"; // ✅ ใช้ useNavigate

const SeerCard = ({ seer }) => {
    const isMobile = useMediaQuery({ maxWidth: 640 }); // สำหรับโทรศัพท์
    const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 }); // สำหรับ iPad
    const navigate = useNavigate(); // ✅ ใช้ navigate

    // ตรวจสอบว่า seer และ seer.rating มีค่าหรือไม่
    const rating = seer?.rating !== undefined && seer?.rating !== null ? seer.rating : 0;
    
    // ✅ ฟังก์ชันนำทางไปยังหน้า QseerSchedulePage
    const handleClick = () => {
        navigate("/qseerSchedulePage", { state: { seer } });
    };

    return (
        <div
            className={`flex flex-col items-center flex-none cursor-pointer transition-transform transform hover:scale-105 
                        ${isMobile ? "w-2/5 h-48 scale-90 mx-3" : isTablet ? "w-1/4 h-52 mx-2" : "w-1/6 h-60"} 
                        px-1 mt-5`}
            onClick={handleClick} // ✅ คลิกแล้วเปลี่ยนหน้า
        >
            <div className={`${isMobile ? "w-24 h-24" : isTablet ? "w-28 h-28" : "w-36 h-36"} rounded-full flex items-center justify-center overflow-hidden`}>
                <img 
                    src={seer?.image || Images.profile} 
                    alt={seer?.name || "หมอดู"} 
                    className="w-full h-full object-cover object-top" 
                />
            </div>
            <p className={`${isMobile ? "text-sm" : isTablet ? "text-base" : "text-lg"} mt-2 font-semibold text-center text-purple-700`}>
                {seer?.name || "หมอดู"}
            </p>
            <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}>{seer?.category || ""}</p>
            
        </div>
    );
};

export default SeerCard;