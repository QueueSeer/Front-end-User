import React from "react";
import dayjs from "dayjs";

import Images from "../../../assets"; // ✅ Import assets

const PaymentSummary = ({ packageInfo, selectedDate }) => {
  // ✅ แปลง selectedDate ให้แน่ใจว่าเป็น dayjs object
  const date = selectedDate ? dayjs(selectedDate) : null;
<p>📅 วันที่เลือก: {date ? date.format("DD/MM/YYYY") : "ไม่ระบุ"}</p>


  return (
    <div className="mt-6 border p-4 rounded-md w-full max-w-sm shadow-md">
      <h4 className="text-md font-semibold flex items-center">
        <FaRegFileAlt className="mr-2" /> รายการชำระเงิน
      </h4>
      <div className="mt-2">
        <p>📌 <strong>{packageInfo.title}</strong> - {packageInfo.price} คอยน์</p>
        <p>📅 วันที่เลือก: {date.format("DD/MM/YYYY")}</p>
        <p>⌚ เวลาที่เลือก: 13:35 น.</p>
        <hr className="my-2" />
        <p>💰 ยอดรวม: {packageInfo.price} คอยน์</p>
        <p>💵 รวมทั้งหมด: {packageInfo.price} คอยน์</p>
      </div>

      {/* ✅ แสดงไอคอนหรือรูปจาก assets ถ้ามี */}
      <div className="flex justify-center mt-4">
        <img src={Images.paymentIcon} alt="Payment Method" className="w-10 h-10" />
      </div>

      <button className="w-full mt-4 bg-gray-300 p-2 rounded-md text-gray-600" disabled>
        ชำระเงิน
      </button>
    </div>
  );
};

export default PaymentSummary;
