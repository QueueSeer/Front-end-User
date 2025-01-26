import React from "react";
import Images from "../../../assets";
import SeerRating from "../SeerPopular/SeerRating";
import PackageLabel from "./PackageLabel"; // Import Component ใหม่

const packagecard = ({ packageInfo }) => {
  const iconMap = {
    call: Images.call,
    chat: Images.ChatLine,
    video: Images.videocall,
  };

  return (
    <div className="relative flex flex-col w-64 bg-[#E9E9EB] rounded-lg shadow-md overflow-hidden">
      {/* ภาพ + ป้ายโปรโมชั่น */}
      <div className="relative w-full h-40">
        <img src={Images.pic} alt={packageInfo.title} className="w-full h-full object-cover" />
        {packageInfo.isPromotion && <PackageLabel type="promotion" />}
        {packageInfo.isNew && <PackageLabel type="new" />}
        {packageInfo.isDiscount && <PackageLabel type="discount" />}
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
        <div className="mt-3 text-2xl font-bold text-purple-900">{packageInfo.price} Coins</div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-gray-500 text-sm">
            <img src={iconMap[packageInfo.icon]} alt="duration" className="w-8 h-8 mr-2" />
            {packageInfo.duration} นาที
          </div>
          <button className="bg-[#8677A7] text-white px-4 py-2 rounded-md text-sm">จองเลย</button>
        </div>
      </div>
    </div>
  );
};

export default packagecard;
