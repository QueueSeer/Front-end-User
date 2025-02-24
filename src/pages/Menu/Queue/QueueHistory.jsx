import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import QueueCard from "../../../components/QueueCard/QueueCard";
import Images from "../../../assets";
import Navbar from "../../../components/navbar"; // เรียกใช้ path ที่ถูกต้อง
import Layout from "./Layout";
const QueueHistoryPage = () => {
  // State สำหรับ Tab ที่เลือก
  const [activeTab, setActiveTab] = useState("รอเข้ารับบริการ");

  // ข้อมูลจองคิว
  const allQueueData = {
    รอเข้ารับบริการ: [
      {
        image: "/images/tarot.jpg",
        title: "Package 1",
        categories: "ดวงความรัก การเงิน สุขภาพ",
        fortuneTeller: "หมอดูเพียงฟ้า",
        date: "อังคาร 25 ก.พ. 2568",
        time: "13.00 น.",
      },
   
    ],
    เข้ารับบริการสำเร็จ: [
      {
        image: "/images/tarot.jpg",
        title: "ดูดวงรายเดือน",
        categories: "ดวงชะตา การงาน การเงิน",
        fortuneTeller: "หมอดูเพียงฟ้า พาขวัญ",
        date: "ศุกร์ 05 ก.ย. 2567",
        time: "10.00 น.",
      },
    ],
    บริการที่ยกเลิก: [
      {
        image: "/images/tarot.jpg",
        title: "ดูดวงสุขภาพ",
        categories: "สุขภาพ โชคลาภ",
        fortuneTeller: "หมอดูสายสมร",
        date: "พฤหัสบดี 03 ก.ย. 2567",
        time: "15.00 น.",
      },
    ],
  };

  return (
    <Layout>
        
        {/* Tab Selection */}
        <div className="flex justify-center gap-4 my-6">
          {["รอเข้ารับบริการ", "เข้ารับบริการสำเร็จ", "บริการที่ยกเลิก"].map(
            (tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  activeTab === tab
                    ? "bg-[#420F75] text-white"
                    : "border border-gray-400 text-gray-600"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Queue List */}
        {allQueueData[activeTab].map((item, index) => (
          <QueueCard key={index} {...item} status={activeTab} />
        ))}
    </Layout>
  );
};

export default QueueHistoryPage;
