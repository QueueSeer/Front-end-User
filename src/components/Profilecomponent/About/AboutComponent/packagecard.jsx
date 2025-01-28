import React from "react";
import { useNavigate } from "react-router-dom";  // ✅ นำเข้า useNavigate
import Images from "../../../../assets";
import SeerRating from "../../../homecomponent/SeerPopular/SeerRating";

const PackageLabel = ({ type }) => {
  const labelStyles = {
    promotion: { text: "โปรโมชัน", bgColor: "bg-[#8677A7]" },
    new: { text: "มาใหม่", bgColor: "bg-[#8677A7]" },
    discount: { text: "-45%", bgColor: "bg-red-600" },
  };

  return type && labelStyles[type] ? (
    <span className={`text-white text-xs font-bold px-2 py-1 rounded-full ${labelStyles[type].bgColor}`}>
      {labelStyles[type].text}
    </span>
  ) : null;
};

const PackageCard = ({ packageInfo }) => {
  const navigate = useNavigate();  // ✅ ใช้ useNavigate

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
    <div className="relative flex flex-col w-64 bg-[#E9E9EB] rounded-lg shadow-md overflow-hidden">
      {/* รูปภาพ + ป้ายกำกับ */}
      <div className="relative w-full h-40">
        <img src={Images.pic} alt={packageInfo.title} className="w-full h-full object-cover" />

        {/* ป้ายมุมขวาบน */}
        {packageInfo.isDiscount && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            -45%
          </div>
        )}
        {packageInfo.isNew && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            มาใหม่
          </div>
        )}

        {/* ป้าย "โปรโมชัน" (มุมซ้ายล่าง) */}
        {(packageInfo.isPromotion || packageInfo.isNew || packageInfo.isDiscount) && (
          <div className="absolute bottom-2 left-2">
            <PackageLabel type="promotion" />
          </div>
        )}
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

        {/* ราคาใหม่ + ราคาเก่าขีดฆ่า */}
        <div className="mt-3 text-2xl font-bold text-purple-900">
          {packageInfo.price} Coins
          {packageInfo.oldPrice && (
            <span className="text-gray-500 line-through text-lg ml-2">{packageInfo.oldPrice} Coins</span>
          )}
        </div>

        {/* ระยะเวลา + ปุ่มจอง */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-gray-500 text-sm">
            <img src={iconMap[packageInfo.icon]} alt="duration" className="w-8 h-8 mr-2" />
            {packageInfo.duration} นาที
          </div>
          {/* ✅ ปุ่มจองเชื่อมไป BookingSeer */}
          <button onClick={handleBooking} className="bg-[#8677A7] text-white px-4 py-2 rounded-md text-sm">
            จองเลย
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
