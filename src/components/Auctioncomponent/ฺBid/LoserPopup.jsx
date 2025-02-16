import React from "react";
import Images from "../../../assets"; // ✅ นำเข้า assets

const LoserPopup = ({ rank, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-purple-700 rounded-2xl p-6 w-[450px] shadow-lg text-center relative">
        {/* หัวข้อ */}
        <h2 className="text-xl font-bold text-white">ลำดับผลการประมูล</h2>

        {/* ไอคอนมงกุฎ + รูปโปรไฟล์ */}
        <div className="relative mt-4">
          {/*  มงกุฎ + เลขอันดับ */}
          <div className="relative w-12 mx-auto">
            <img src={Images.CrownOne} alt="Crown" className="w-12 mx-auto" />
            <span className="absolute top-[2px] left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {rank}
            </span>
          </div>

          <img src={Images.profilemam} alt="Profile" className="w-24 h-24 rounded-full mx-auto border-3 border-purple-300 pt-1" />
        </div>

        {/*  ปรับขนาดกรอบข้อมูลลำดับการประมูล */}
        <div className="bg-pink-500 text-white px-3 py-1 rounded-lg mt-3 w-[200px] mx-auto">
          <p className="text-xs font-bold">Su*******</p>
          <p className="text-md font-semibold">Km*****</p>
          <p className="text-sm font-bold">10,000 Coins</p>
        </div>

        {/* ปุ่มปิด */}
        <button
          className="mt-6 bg-white text-purple-700 font-medium px-8 py-1 rounded-full"
          onClick={onClose}
        >
          ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
};

export default LoserPopup;
