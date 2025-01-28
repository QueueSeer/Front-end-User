import React from "react";
import { useLocation } from "react-router-dom";

const BookingSeer = () => {
  const location = useLocation();
  const packageInfo = location.state?.packageInfo; // ✅ รับค่า packageInfo จาก state

  if (!packageInfo) {
    return <p>ไม่พบแพ็กเกจที่เลือก</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{packageInfo.title}</h1>
      <p className="text-gray-600">หมอดู: {packageInfo.seer}</p>
      <p className="text-purple-900 font-bold">{packageInfo.price} Coins</p>
      <p className="text-gray-500">ระยะเวลา: {packageInfo.duration} นาที</p>
    </div>
  );
};

export default BookingSeer;
