import React from "react";
import Images from "../../../assets"; // ✅ นำเข้า assets
import { useNavigate } from "react-router-dom";

const WinnerPopup = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-[450px] shadow-lg text-center relative">
        {/* หัวข้อ */}
        <h2 className="text-xl font-bold text-purple-800">ยินดีด้วย! คุณชนะการประมูล</h2>

        {/* ไอคอนมงกุฎ + รูปโปรไฟล์ */}
        <div className="relative mt-4">
          {/* ✅ มงกุฎ + เลข 1 ซ้อนกัน */}
          <div className="relative w-12 mx-auto">
            <img src={Images.CrownOne} alt="Crown" className="w-12 mx-auto" />
            <span className="absolute top-[2px] left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              1
            </span>
          </div>

          <img src={Images.profilemam} alt="Profile" className="w-24 h-24 rounded-full mx-auto border-4 border-purple-300 mb-2 pt-2" />
        </div>

        {/* ✅ ปรับขนาดกรอบข้อมูลผู้ชนะให้เล็กลง */}
        <div className="bg-pink-500 text-white px-3 py-1 rounded-lg  w-[180px] mx-auto mt-5  ">
          <p className="text-xs font-bold">แมมผู้ชอบดูดวง</p>
          <p className="text-md font-semibold">Manmkiti64</p>
          <p className="text-xs">10,000 Coins</p>
        </div>

        {/* รายละเอียดการประมูล */}
        <p className="text-lg font-semibold text-gray-800 mt-4">ดูดวงความรัก สุขภาพ การงาน ภาพรวมประจำปี</p>
        <p className="text-sm text-gray-600">หมอดู เพียงฟ้า พาพิชัย</p>

        {/* ลิงก์รายละเอียดเพิ่มเติม */}
        <button
          className="mt-4 text-purple-700 font-medium underline"
          onClick={() => navigate("/auction-details")}
        >
          สามารถดูรายละเอียดเพิ่มเติม
        </button>

        {/* ปุ่มปิด */}
        <button
          className="absolute top-2 right-2 text-gray-500 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default WinnerPopup;
