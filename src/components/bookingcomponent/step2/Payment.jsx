import React, { useState } from "react";
import dayjs from "dayjs";
import { FaRegFileAlt } from "react-icons/fa";
import Images from "../../../assets";
import { useNavigate } from "react-router-dom";

const Payment = ({ packageInfo, selectedDate }) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [useCoins, setUseCoins] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ เพิ่ม state กันกดซ้ำ

  const date = selectedDate ? dayjs(selectedDate) : null;
  const totalPrice = packageInfo?.price || 0;
  const userCoins = 300; // จำนวนโชคคอยน์ที่มี
  const maxCoinUsage = 247; // หักได้สูงสุด 200 คอยน์
  const discount = useCoins && paymentMethod === "promptpay" ? Math.min(maxCoinUsage, totalPrice) : 0;
  const finalPrice = totalPrice - discount;

  // ✅ Mock API สำหรับสร้าง bookingId
  const createBooking = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bookingId = `BK-${Math.floor(Math.random() * 1000000)}`;
        resolve({ bookingId });
      }, 1000);
    });
  };

  const handlePayment = async () => {
    if (!paymentMethod) return;

    setLoading(true);
    const { bookingId } = await createBooking();

    const paymentData = {
      bookingId,
      packageInfo,
      selectedDate,
      paymentMethod,
      useCoins,
      finalPrice: totalPrice - discount, // ✅ ส่งค่า finalPrice ให้ชัวร์
    };

    if (paymentMethod === "promptpay") {
      console.log("Navigating to BookingSeer3 with data:", paymentData); // ✅ Debug
      navigate("/bookingSeer3", { state: paymentData });
    } else if (paymentMethod === "coins") {
      navigate("/bookingSeer4", { state: paymentData });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto flex gap-6">
      {/* ✅ ซ้าย: เลือกช่องทางชำระเงิน */}
      <div className="w-1/2">
        <h3 className="text-lg font-semibold mb-3">เลือกช่องทางชำระเงิน</h3>
        <div className="flex flex-col space-y-4">
          {/* ✅ ปุ่ม PromptPay */}
          <button
            className={`flex justify-between items-center w-full p-5 border rounded-lg shadow-sm transition 
              ${paymentMethod === "promptpay" ? "bg-[#65558F] text-white border-[#65558F]" : "bg-white text-gray-800 border-gray-300"} 
              hover:bg-[#65558F] hover:text-white`}
            onClick={() => setPaymentMethod("promptpay")}
          >
            <span className="font-medium">QR Code PromptPay</span>
            <img src={Images.PromptpayMoney} alt="PromptPay" className="w-20" />
          </button>

          {/* ✅ ปุ่ม Coins */}
          <button
            className={`flex justify-between items-center w-full p-5 border rounded-lg shadow-sm transition 
              ${paymentMethod === "coins" ? "bg-[#65558F] text-white border-[#65558F]" : "bg-white text-gray-800 border-gray-300"} 
              hover:bg-[#65558F] hover:text-white`}
            onClick={() => setPaymentMethod("coins")}
          >
            <span className="font-medium">โชคคอยน์</span>
            <div className="flex items-center space-x-2">
              <img src={Images.CoinMoney} alt="Coins" className="w-20 pl-3" />
              <span className={paymentMethod === "coins" ? "text-white" : "text-[#65558F] font-semibold"}>Coins</span>
            </div>
          </button>
        </div>
      </div>

      {/* ✅ ขวา: Summary การชำระเงิน */}
      <div className="w-1/2 border p-5 rounded-lg shadow-md bg-white">
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
            <p className="text-right">{date ? date.format("D MMMM YYYY") : "25 กุมภาพันธ์ 2568"}</p>
            <p className="font-medium">เวลาที่นัดหมาย</p>
            <p className="text-right">10:45 น.</p>
          </div>
        </div>

        {/* ✅ ช่องทางการชำระเงิน (แสดงเฉพาะเมื่อเลือกแล้ว) */}
        {paymentMethod && (
          <div className="mt-3 text-gray-700 text-sm">
            <div className="grid grid-cols-2">
              <p className="font-medium">ช่องทางการชำระเงิน</p>
              <p className="text-right">{paymentMethod === "coins" ? "โชคคอยน์" : "QR Code PromptPay"}</p>
            </div>
          </div>
        )}

        {/* ✅ เงื่อนไข PromptPay (เพิ่ม Switch Button ใช้คอยน์) */}
        {paymentMethod === "promptpay" && (
          <div className="mt-2 flex justify-between items-center text-sm">
            <p className="text-gray-700">สามารถใช้ โชคคอยน์ {maxCoinUsage} คอยน์ ได้</p>
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

        {/*  เงื่อนไข Coins */}
        {paymentMethod === "coins" && (
          <div className="mt-2 text-sm text-gray-700">
            <p className="text-right">คุณมีโชคคอยน์ {userCoins} คอยน์</p>
          </div>
        )}

        <hr className="my-3 border-gray-300" />

        {/*  ยอดรวม */}
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
            onClick={handlePayment}
            disabled={!paymentMethod || loading}
          >
            {loading ? "กำลังดำเนินการ..." : "ชำระเงิน"}
          </button>
        </div>
      </div>
    
    </div>
  );
};

export default Payment;
