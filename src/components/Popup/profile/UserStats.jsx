import React from "react";
import Images from "../../../assets";

const UserStats = () => {
  return (
    <div className="w-full">
      <h2 className="text-xl text-gray-800 font-semibold mb-4">สถิติการดูดวงโดยรวม</h2>

      <div className="flex gap-5">
        {/* ชั่วโมงดูดวงสะสม */}
        <div className="border-2 px-6 py-4 rounded-md w-full flex items-center gap-4">
          <img src={Images.ClockIcon} alt="Clock" className="w-8 h-8" />
          <div>
            <p className="text-lg font-semibold">ชั่วโมงดูดวงสะสม</p>
            <p className="text-gray-500">1 ชั่วโมง</p>
          </div>
        </div>

        {/* จำนวนแพ็กเกจที่ซื้อ */}
        <div className="border-2 px-6 py-4 rounded-md w-full flex items-center gap-4">
          <img src={Images.PackageIcon} alt="Package" className="w-8 h-8" />
          <div>
            <p className="text-lg font-semibold">แพ็กเกจที่ซื้อ</p>
            <p className="text-gray-500">1</p>
          </div>
        </div>

        {/* จำนวนการดูดวงสำเร็จ */}
        <div className="border-2 px-6 py-4 rounded-md w-full flex items-center gap-4">
          <img src={Images.CheckIcon} alt="Check" className="w-8 h-8" />
          <div>
            <p className="text-lg font-semibold">ได้รับบริการสำเร็จ</p>
            <p className="text-gray-500">1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
