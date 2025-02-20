import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import QueueCard from "../../components/QueueCard/QueueCard"; 
import Images from "../../assets";

const QueueHistoryPage = () => {
  // State สำหรับ Tab ที่เลือก
  const [activeTab, setActiveTab] = useState("รอเข้ารับบริการ");

  // ข้อมูลจองคิว
  const allQueueData = {
    "รอเข้ารับบริการ": [
      {
        image: "/images/tarot.jpg",
        title: "แพคเกจดูดวงรายเดือน",
        categories: "ดวงความรัก การเงิน สุขภาพ",
        fortuneTeller: "หมอดูเพียงฟ้า",
        date: "จันทร์ 09 ก.ย. 2567",
        time: "13.00 น.",
      },
      {
        image: "/images/tarot.jpg",
        title: "ดูดวงทันที",
        categories: "ดวงความรัก การเงิน สุขภาพ",
        fortuneTeller: "หมอดูเพียงฟ้า",
        date: "อังคาร 10 ก.ย. 2567",
        time: "13.00 น.",
      },
    ],
    "เข้ารับบริการสำเร็จ": [
      {
        image: "/images/tarot.jpg",
        title: "ดูดวงโชคชะตาปีนี้",
        categories: "ดวงชะตา การงาน การเงิน",
        fortuneTeller: "หมอดูลินดา",
        date: "ศุกร์ 05 ก.ย. 2567",
        time: "10.00 น.",
      },
    ],
    "บริการที่ยกเลิก": [
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
    <div className="min-h-screen dark:bg-gray-900 flex flex-col">
      {/* Layout */}
      <div className="flex px-12 pt-12 gap-14">
        {/* Sidebar */}
        <div className="hidden lg:block w-72">
          <Sidebar active="จองคิว" />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-4">
            <img src={Images.calendarIcon} alt="calendarIcon" className="w-7 h-7" />
            <h1 className="text-xl font-bold" style={{ color: '#65558F' }}>จองคิว</h1>
        
           
            
          </div>
          <hr className="border-gray-300 mb-4" />
          {/* Tab Selection */}
          <div className="flex justify-center gap-4 mb-6">
            {["รอเข้ารับบริการ", "เข้ารับบริการสำเร็จ", "บริการที่ยกเลิก"].map((tab) => (
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
            ))}
          </div>

          {/* Queue List */}
          {allQueueData[activeTab].map((item, index) => (
            <QueueCard key={index} {...item} status={activeTab} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QueueHistoryPage;