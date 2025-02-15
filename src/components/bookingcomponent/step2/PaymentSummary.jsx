import React from "react";
import dayjs from "dayjs";
import { FaRegFileAlt } from "react-icons/fa"; // ไอคอนเอกสาร
import Images from "../../../assets"; // ✅ ใช้ Images จาก assets
import { useNavigate } from "react-router-dom";

const PaymentSummary = ({ packageInfo, selectedDate, paymentMethod, useCoins, setUseCoins }) => {
  const navigate = useNavigate(); // ✅ ใช้ useNavigate()
  const date = selectedDate ? dayjs(selectedDate) : null;
  const totalPrice = packageInfo?.price || 0;
  const userCoins = 300; // จำนวนโชคคอยน์ที่มี
  const maxCoinUsage = 200; // หักได้สูงสุด 200 คอยน์
  const discount = useCoins ? Math.min(maxCoinUsage, totalPrice) : 0; // หักลบจากยอดรวม
  const finalPrice = totalPrice - discount; // ยอดชำระหลังหัก

  // ✅ ฟังก์ชันสำหรับเปลี่ยนหน้าไป BookingSeer3
  const handlePayment = () => {
    navigate("/bookingSeer3", {
      state: {
        packageInfo,
        selectedDate,
        paymentMethod,
        useCoins,
        finalPrice,
      },
    });
  };

  return (
    <div className="mt-6 border p-5 rounded-lg w-full max-w-4xl shadow-md bg-white">
      {/* ✅ หัวข้อรายการชำระเงิน */}
      <h4 className="text-md font-semibold flex items-center">
        <FaRegFileAlt className="mr-2 text-gray-600" /> รายการชำระเงิน
      </h4>

      {/* ✅ รายการแพ็กเกจ */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm font-semibold">
          <p className="text-gray-900">ชื่อแพคเกจ</p>
          <p className="text-gray-900">ราคา</p>
        </div>

        <hr className="my-2 border-gray-300" />

        <div className="flex items-center space-x-3 mt-2">
          <img src={Images.picbill} alt="Package" className="w-20 h-20 rounded-md object-cover" />
          <div className="flex-1">
            <p className="text-[#65558F] font-semibold text-sm leading-tight">
              {packageInfo?.title || "แพ็กเกจที่เลือก"}
            </p>
            <div className="flex items-center text-gray-600 text-xs mt-1">
              <img src={Images.User} alt="Fortune Teller" className="w-4 h-4 mr-1" />
              <span>{packageInfo?.fortuneTellerName || "หมอดูเพียงฟ้า พาขวัญ"}</span>
            </div>
          </div>
          <p className="text-gray-800 font-semibold">{totalPrice} คอยน์</p>
        </div>
      </div>

      {/* ✅ วันที่และเวลานัดหมาย */}
      <div className="mt-3 text-gray-700 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <p className="font-medium">วันที่นัดหมาย</p>
          <p className="text-right">{date ? date.format("D MMMM YYYY") : "9 กันยายน 2567"}</p>
          <p className="font-medium">เวลาที่นัดหมาย</p>
          <p className="text-right">13:35 น.</p>
        </div>
      </div>

      {/* ✅ ช่องทางการชำระเงิน */}
      <div className="mt-3 text-gray-700 text-sm">
        <div className="grid grid-cols-2">
          <p className="font-medium">ช่องทางการชำระเงิน</p>
          <p className="text-right">{paymentMethod === "coins" ? "โชคคอยน์" : "QR Code Promptpay"}</p>
        </div>
      </div>

      {/* ✅ เงื่อนไข PromptPay - แสดง Toggle ใช้โชคคอยน์ได้ */}
      {paymentMethod === "promptpay" && (
        <div className="mt-2 flex justify-between items-center text-sm">
          <p className="text-gray-700">สามารถใช้ โชคคอยน์ {maxCoinUsage} คอยน์ ได้</p>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={useCoins}
              onChange={() => setUseCoins(!useCoins)}
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 
                rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                peer-checked:bg-[#65558F]"></div>
          </label>
        </div>
      )}

      {/* ✅ เงื่อนไข Coins - แสดงจำนวนโชคคอยน์ที่มี */}
      {paymentMethod === "coins" && (
        <div className="mt-2 text-sm text-gray-700">
          <p className="text-right">คุณมีโชคคอยน์ {userCoins} คอยน์</p>
        </div>
      )}

      <hr className="my-3 border-gray-300" />

      {/* ✅ ยอดรวม */}
      <div className="text-sm">
        <p className="font-semibold text-gray-900 mt-3">ยอดรวม</p>
        <div className="grid grid-cols-2">
          <p className="text-gray-700">รวมค่าบริการ</p>
          <p className="text-right">{totalPrice} คอยน์</p>
          {useCoins && paymentMethod === "promptpay" && (
            <>
              <p className="text-gray-700">ใช้ โชคคอยน์ แล้ว</p>
              <p className="text-right text-red-500">- {discount} คอยน์</p>
            </>
          )}
          <p className="font-bold text-gray-900 mt-1">รวมทั้งหมด</p>
          <p className="text-right font-bold">{finalPrice} คอยน์</p>
        </div>
      </div>

      {/* ✅ ปุ่มชำระเงิน */}
      <div className="mt-4 flex justify-center">
        <button
          className="w-full bg-[#65558F] text-white p-3 rounded-md font-semibold text-lg hover:bg-[#564477]"
          onClick={handlePayment} // ✅ ใช้ handlePayment เพื่อนำทางไปหน้า BookingSeer3
        >
          ชำระเงิน
        </button>
      </div>
    </div>
  );
};

export default PaymentSummary;
