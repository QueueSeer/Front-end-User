import React from "react";
import Images from "../../../assets";
import SeerRating from "./SeerRating";

const SeerCard = ({ seer }) => {
    return (
        <div className="flex flex-col items-center flex-none w-1/6 px-1 scale-110 mt-5 h-60"> {/* ปรับให้แสดง 6 คนต่อหน้าและขยายขนาด */}
            <div className="w-36 h-36 rounded-full flex items-center justify-center overflow-hidden"> {/* ปรับขนาดและป้องกันภาพถูกตัด */}
                <img src={Images.profile} alt={seer.name} className="w-full h-full object-cover object-top" />
            </div>
            <p className="mt-2 font-semibold text-center text-purple-700 text-lg">{seer.name}</p>
            <p className="text-sm text-gray-500">{seer.category}</p>
            <div className="mt-2 flex items-center justify-center w-full gap-2 align-middle"> {/* จัดให้อยู่แนวเดียวกัน */}
            <span className="text-gray-700 font-semibold text-sm flex items-center">{seer.rating.toFixed(1)}</span>
                <SeerRating rating={seer.rating} />
            </div>
        </div>
    );
};
export default SeerCard;
