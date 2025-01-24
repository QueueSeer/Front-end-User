import React from "react";
import Images from "../../assets";

const IconSection = () => {
  const icons = [
    { img: Images.discount, label: "ลดราคา" },
    { img: Images.Dailyhoroscope, label: "ดูดวงรายวัน" },
    { img: Images.Monthlyhoroscope, label: "ดูดวงรายเดือน" },
    { img: Images.Gypsycards, label: "ไพ่ยิปซี" },
    { img: Images.astrology, label: "โหราศาสตร์" },
    { img: Images.Lovehoroscope, label: "ดูดวงความรัก" },
    { img: Images.more, label: "เพิ่มเติม" },
  ];

  return (
    <div className="relative p-4">
      {/* บนมือถือให้เลื่อนข้างได้ */}
      <div className="flex sm:grid sm:grid-cols-7 gap-2 text-center overflow-x-auto sm:overflow-visible scrollbar-hide">
        {icons.map((icon, index) => (
          <div key={index} className="flex flex-col items-center shrink-0 w-[70px] sm:w-auto">
            <div className="w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center bg-[#8B7EB4] rounded-full">
              <img src={icon.img} alt={icon.label} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
            </div>
            <p className="text-xs sm:text-xl mt-1 text-gray-700 font-medium">{icon.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconSection;
