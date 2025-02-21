import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import PaymentTable from "../../components/PaymentHistory/PaymentTable";
import Images from "../../assets"; // ✅ ตรวจสอบให้แน่ใจว่า import Images

const PaymentHistoryPage = () => {
  // ตัวอย่างข้อมูลการชำระเงิน
  const payments = [
    {
      purchaseDate: "09 กันยายน 2567 13.45 น.",
      packageName: "แพคเกจดูดวงรายเดือน",
     
      status: "รอเข้ารับบริการ",
      fortuneTeller: "หมอดู จัสมิน",
      coinAmount: 99,
    },
    {
      purchaseDate: "09 กันยายน 2567 13.45 น.",
      packageName: "ประมูลดูดวงออนไลน์",
     
      status: "รอเข้ารับบริการ",
      fortuneTeller: "หมอดู จัสมิน",
      coinAmount: 100,
    },
    {
      purchaseDate: "09 กันยายน 2567 13.45 น.",
      packageName: "แพคเกจดูดวงรายเดือน",
     
      status: "เกินเวลาที่กำหนด",
      fortuneTeller: "หมอดู จัสมิน",
      coinAmount: 99,
    },
    {
      purchaseDate: "09 กันยายน 2567 13.45 น.",
      packageName: "แพคเกจดูดวงรายเดือน",
    
      status: "บริการสำเร็จ",
      fortuneTeller: "หมอดู จัสมิน",
      coinAmount: 99,
    },
  ];

  return (
    <div className="min-h-screen dark:bg-gray-900 flex flex-col">
      {/* Layout */}
      <div className="flex px-12 pt-12 gap-14">
        {/* Sidebar */}
        <div className="hidden lg:block w-72">
          <Sidebar active="การชำระเงิน" />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            {/* หัวข้อ */}
            <div className="flex items-center space-x-2">
              <img src={Images.OutlineIcon} alt="OutlineIcon" className="w-7 h-7" />
              <h1 className="text-xl font-bold text-purple-800">การชำระเงิน</h1>
            </div>

            {/* Dropdown เดือน */}
            <div className="relative">
              <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
                <option>กันยายน 2567</option>
                <option>สิงหาคม 2567</option>
                <option>กรกฎาคม 2567</option>
              </select>
            </div>
          </div>

          {/* เส้นแบ่ง */}
          <hr className="border-gray-300 mb-4" />

          {/* Payment Table */}
          <PaymentTable payments={payments} />
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;
