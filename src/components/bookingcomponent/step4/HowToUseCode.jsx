import React from "react";
import Images from "../../../assets";

const HowToUseCode = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl w-full mt-8 border">
      {/* ✅ หัวข้อ */}
      <h3 className="text-lg font-semibold mb-6 text-left px-6">วิธีการใช้ Code</h3>

      {/* ✅ กล่องสำหรับ 3 ขั้นตอน */}
      <div className="grid grid-cols-3 gap-6 items-center px-6">
        {/* ✅ ขั้นตอนที่ 1 */}
        <div className="flex flex-col items-center text-center relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-[#F4F4F6] w-8 h-8 rounded-full font-semibold text-[#65558F] flex items-center justify-center">
            1
          </div>
          <img src={Images.copytofolder} alt="Copy" className="w-16" />
          <p className="text-sm w-full mt-3">Copy code เอาไว้ หรือบันทึกภาพ และสามารถดูได้ที่ การจอง</p>
        </div>

        {/* ✅ ขั้นตอนที่ 2 */}
        <div className="flex flex-col items-center text-center relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-[#F4F4F6] w-8 h-8 rounded-full font-semibold text-[#65558F] flex items-center justify-center">
            2
          </div>
          <img src={Images.code} alt="Import" className="w-24" />
          <p className="text-sm w-full mt-2">เมื่อถึงคิวให้กดใช้ Code ที่ได้รับ ยืนยันกับหมอดูที่จองไว้</p>
        </div>

        {/* ✅ ขั้นตอนที่ 3 */}
        <div className="flex flex-col items-center text-center relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-[#F4F4F6] w-8 h-8 rounded-full font-semibold text-[#65558F] flex items-center justify-center">
            3
          </div>
          <img src={Images.Comfirm} alt="Confirm" className="w-12 mb-5" />
          <p className="text-sm w-full ">ยืนยันการดูดวง</p>
        </div>
      </div>
    </div>
  );
};

export default HowToUseCode;
