import React, { useEffect, useState } from "react";

import { FaRegFileAlt } from "react-icons/fa";
import Images from "../../../assets";
import dayjs from "dayjs";

const Payment = ({ 
  packageInfo, 
  selectedDate, 
  selectedTime, 
  paymentMethod, 
  setPaymentMethod, 
  useCoins, 
  setUseCoins, 
  userCoins = 0,
  onPayment,  // รับฟังก์ชันจาก BookingSeer2
  isLoading = false  // รับสถานะโหลดจาก BookingSeer2
}) => {
  // Format date safely
  const formatDate = (date) => {
    if (!date) return "ไม่ระบุวันที่";
    
    try {
      // Make sure it's a valid Date object
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
      }
      
      return "ไม่ระบุวันที่";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "ไม่ระบุวันที่";
    }
  };

  const formattedDate = formatDate(selectedDate);
  const formattedTime = selectedTime || "ไม่ระบุเวลา";

  const totalPrice = packageInfo?.price ?? 0;
  const isFree = totalPrice === 0;

  // ใช้คอยน์ตามที่ผู้ใช้มีจริง
  const discount = useCoins && paymentMethod === "promptpay" ? Math.min(userCoins, totalPrice) : 0;
  const finalPrice = Math.max(0, totalPrice - discount);
  
  // ตรวจสอบว่าเหรียญเพียงพอหรือไม่
  const isCoinsEnough = userCoins >= totalPrice;
  
  // ตรวจสอบเมื่อเลือกวิธีชำระเงินแบบ "coins"
  useEffect(() => {
    if (paymentMethod === "coins" && !isCoinsEnough) {
      alert("คุณมีโชคคอยน์ไม่เพียงพอสำหรับการชำระเงินด้วยคอยน์ทั้งหมด กรุณาเลือกวิธีการชำระเงินอื่น");
      setPaymentMethod(null);
    }
  }, [paymentMethod, isCoinsEnough, setPaymentMethod]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
      {/* ซ้าย: เลือกช่องทางชำระเงิน */}
      <div className="w-full md:w-1/2">
        <h3 className="text-lg font-semibold mb-3">เลือกช่องทางชำระเงิน</h3>
        
        <div className="flex flex-col space-y-4">
          {/* ปุ่ม PromptPay */}
          <button
            className={`flex justify-between items-center w-full p-5 border rounded-lg shadow-sm transition 
              ${paymentMethod === "promptpay" ? "bg-[#65558F] text-white border-[#65558F]" : "bg-white text-gray-800 border-gray-300"} 
              hover:bg-[#65558F] hover:text-white`}
            onClick={() => setPaymentMethod("promptpay")}
          >
            <span className="font-medium">QR Code PromptPay</span>
            <img src={Images.PromptpayMoney} alt="PromptPay" className="w-20" />
          </button>

          {/* ปุ่ม Coins - ถ้าคอยน์ไม่พอ ให้ปุ่มไม่สามารถกดได้ */}
          <button
            className={`flex justify-between items-center w-full p-5 border rounded-lg shadow-sm transition 
              ${paymentMethod === "coins" ? "bg-[#65558F] text-white border-[#65558F]" : "bg-white text-gray-800 border-gray-300"} 
              ${!isCoinsEnough ? "opacity-50 cursor-not-allowed" : "hover:bg-[#65558F] hover:text-white"}`}
            onClick={() => isCoinsEnough ? setPaymentMethod("coins") : alert("คุณมีโชคคอยน์ไม่เพียงพอ")}
            disabled={!isCoinsEnough}
          >
            <span className="font-medium">โชคคอยน์</span>
        
            <div className="flex items-center space-x-2">
            <img src={Images.CoinMoney} alt="Coins" className="w-20 pl-3" />
            <span className={paymentMethod === "coins" ? "text-white" : "text-[#65558F] font-semibold"}>Coins</span>
          </div>
        </button>
      </div>
    </div>

    {/* ขวา: Summary การชำระเงิน */}
   <div className="w-full md:w-1/2 border p-5 rounded-lg shadow-md bg-white">
      <h4 className="text-md font-semibold flex items-center">
        <FaRegFileAlt className="mr-2 text-gray-600" /> รายการชำระเงิน
      </h4>

      <div className="mt-4">
        <div className="flex items-center justify-between text-sm font-semibold">
          <p className="text-gray-900">ชื่อแพคเกจ</p>
          <p className="text-gray-900">ราคา</p>
        </div>
        <hr className="my-2 border-gray-300" />
        <div className="flex items-center space-x-3 mt-2">
        <img 
  src={(packageInfo.image === "" || packageInfo.image === null) ? Images.pic : packageInfo.image}
  alt="Package" 
  className="w-20 h-20 rounded-md object-cover" 
/>

          <div className="flex-1">
            <p className="text-[#65558F] font-semibold text-sm leading-tight">
              {packageInfo?.name || packageInfo?.title || ""}
            </p>
            <div className="flex items-center text-gray-600 text-xs mt-1">
              <img src={Images.User} alt="Fortune Teller" className="w-4 h-4 mr-1" />
              <span>{packageInfo?.fortuneTellerName || packageInfo?.seer || ""}</span>
            </div>
          </div>
          <p className="text-gray-800 font-semibold">
  {isFree ? "ฟรี" : `${totalPrice} คอยน์`}
</p>

        </div>
      </div>

       {/* วันที่และเวลานัดหมาย */}
       <div className="mt-3 text-gray-700 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <p className="font-medium">วันที่นัดหมาย</p>
          <p className="text-right">{formattedDate}</p>
          <p className="font-medium">เวลาที่นัดหมาย</p>
          <p className="text-right">{formattedTime}</p>
        </div>
      </div>

      {/* ช่องทางการชำระเงิน (แสดงเฉพาะเมื่อเลือกแล้ว) */}
      {paymentMethod && (
        <div className="mt-3 text-gray-700 text-sm">
          <div className="grid grid-cols-2">
            <p className="font-medium">ช่องทางการชำระเงิน</p>
            <p className="text-right">{paymentMethod === "coins" ? "โชคคอยน์" : "QR Code PromptPay"}</p>
          </div>
        </div>
      )}

      {/* เงื่อนไข PromptPay (เพิ่ม Switch Button ใช้คอยน์) */}
      {paymentMethod === "promptpay" && (
        <div className="mt-2 flex justify-between items-center text-sm">
          <div>
            <p className="text-gray-700">สามารถใช้ โชคคอยน์ {userCoins} คอยน์ ได้</p>
            {useCoins && !isCoinsEnough && (
              <p className="text-yellow-600 text-xs mt-1">เหรียญไม่พอจ่ายเต็มจำนวน จะใช้เป็นส่วนลดเท่านั้น</p>
            )}
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={useCoins}
              onChange={() => setUseCoins(!useCoins)}
            />
            <div 
              className={`w-14 h-8 rounded-full transition-all duration-300 
                          ${useCoins ? "bg-[#65558F]" : "bg-gray-300"} relative`}
            >
              <div 
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 
                            ${useCoins ? "translate-x-6" : "translate-x-1"}`}
              />
            </div>
          </label>
        </div>
      )}

      {/* เงื่อนไข Coins */}
      {paymentMethod === "coins" && (
        <div className="mt-2 text-sm text-gray-700">
          <p className="text-right">คุณมีโชคคอยน์ {userCoins} คอยน์</p>
        </div>
      )}

      <hr className="my-3 border-gray-300" />

      {/* ยอดรวม */}
      <div className="text-sm">
        <p className="font-semibold text-gray-900 mt-3">ยอดรวม</p>
        <div className="grid grid-cols-2">
          <p className="text-gray-700">รวมค่าบริการ</p>
          <p className="text-right">{totalPrice} คอยน์</p>
          {useCoins && paymentMethod === "promptpay" && discount > 0 && (
            <>
              <p className="text-gray-700">ใช้ โชคคอยน์ แล้ว</p>
              <p className="text-right text-red-500">- {discount} คอยน์</p>
            </>
          )}
          <p className="font-bold text-gray-900 mt-1">รวมทั้งหมด</p>
          <p className="text-right font-bold">
  {isFree ? "ฟรี" : `${finalPrice} คอยน์`}
</p>

        </div>
      </div>

            {/* ปุ่มชำระเงิน - ใช้ฟังก์ชัน onPayment ที่รับมาจาก BookingSeer2 */}
        <div className="mt-4 flex justify-center">
          <button
            className={`w-full p-3 rounded-md font-semibold text-lg 
              ${!paymentMethod ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#65558F] text-white hover:bg-[#564477]'}`}
            onClick={onPayment}
            disabled={!paymentMethod || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <span className="mr-2">กำลังดำเนินการ</span>
                <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
              </div>
            ) : (
              "ชำระเงิน"
            )}
          </button>
        </div>
    </div>
  </div>
);
};

export default Payment;