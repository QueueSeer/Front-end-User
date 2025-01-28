import React from "react";
import Images from "../../../assets";
import SeerRating from "./SeerRating";
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from "react-router-dom"; // ✅ ใช้ useNavigate

const SeerCard = ({ seer }) => {
    const isMobile = useMediaQuery({ maxWidth: 640 }); // สำหรับโทรศัพท์
    const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 }); // สำหรับ iPad
    const navigate = useNavigate(); // ✅ ใช้ navigate

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
                <img src={Images.profile} alt={seer.name} className="w-full h-full object-cover object-top" />
            </div>
            <p className={`${isMobile ? "text-sm" : isTablet ? "text-base" : "text-lg"} mt-2 font-semibold text-center text-purple-700`}>
                {seer.name}
            </p>
            <p className={`${isMobile ? "text-xs" : "text-sm"} text-gray-500`}>{seer.category}</p>
            <div className="mt-2 flex items-center justify-center w-full gap-2 align-middle">
                <span className={`${isMobile ? "text-xs" : "text-sm"} text-gray-700 font-semibold flex items-center`}>
                    {seer.rating.toFixed(1)}
                </span>
                <SeerRating rating={seer.rating} />
            </div>
        </div>
    );
};

export default SeerCard;
