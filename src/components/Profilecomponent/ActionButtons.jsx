import Images from "../../assets";
import React from "react";

const ActionButtons = () => {
  return (
    <div className="mt-6 space-y-4">
      {/* ดูดวงทันที */}
      <div className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center border border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-black">ดูดวงทันที</h3>
          <p className="text-gray-500 flex items-center mt-1">
            <img src={Images.time} alt="time icon" className="w-4 h-4 mr-2" /> เปิด: 25 กุมภาพันธ์ 2568, 09:30 น.
          </p>
        </div>
        <div>ยังไม่เปิดทำการ</div>
        {/* <button className="w-32 px-4 py-2 rounded-lg text-white bg-[#8677A7]">
          เริ่มดูดวง
        </button> */}
      </div>
      {/* ประมูล */}
      <div className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center border border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-black">ประมูล</h3>
          <p className="text-gray-500 flex items-center mt-1">
            <img src={Images.time} alt="time icon" className="w-4 h-4 mr-2" /> เปิด: 25 กุมภาพันธ์ 2568, 13:30 น.
          </p>
        </div>
        <div>ยังไม่เปิดทำการ</div>
        {/* <button className="w-32 px-4 py-2 rounded-lg text-white bg-[#8677A7]">
          เริ่มประมูล
        </button> */}
      </div>
    </div>
  );
};

export default ActionButtons;
