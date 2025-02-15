import React, { useState } from "react";

const SlotComponent = ({ selectedDate }) => {
  if (!selectedDate) return null; // ไม่แสดงถ้ายังไม่มีการเลือกวัน

  // Mock Data: เวลาที่ถูกจองไปแล้ว
  const bookedTimes = ["09:30", "10:30", "11:00", "13:00", "14:15"];

  // เก็บสถานะเวลาที่เลือก
  const [selectedTime, setSelectedTime] = useState(null);
  const [timePeriod, setTimePeriod] = useState("morning"); // ค่าเริ่มต้นเป็นช่วงเช้า

  const handleSelectTime = (time) => {
    if (!bookedTimes.includes(time)) {
      setSelectedTime(time);
    }
  };

  const morningSlots = ["09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45"];
  const afternoonSlots = ["13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15"];

  return (
    <div className="w-[650px] mt-5">
      {/* ปุ่มเลือกช่วงเวลา */}
      <div className="flex items-center space-x-6 mb-4">
        <button
          className={`flex items-center space-x-2 ${
            timePeriod === "morning" ? "text-[#6B5B95] font-semibold" : "text-gray-500"
          }`}
          onClick={() => setTimePeriod("morning")}
        >
          <div
            className={`w-4 h-4 rounded-full ${
              timePeriod === "morning" ? "bg-[#6B5B95]" : "bg-gray-300"
            }`}
          ></div>
          <span>ช่วงเช้า</span>
        </button>

        <button
          className={`flex items-center space-x-2 ${
            timePeriod === "afternoon" ? "text-[#6B5B95] font-semibold" : "text-gray-500"
          }`}
          onClick={() => setTimePeriod("afternoon")}
        >
          <div
            className={`w-4 h-4 rounded-full ${
              timePeriod === "afternoon" ? "bg-[#6B5B95]" : "bg-gray-300"
            }`}
          ></div>
          <span>ช่วงบ่าย</span>
        </button>
      </div>

      {/* แสดงเวลาตามช่วงที่เลือก */}
      <div className="grid grid-cols-4 gap-3 mt-5">
        {(timePeriod === "morning" ? morningSlots : afternoonSlots).map((time) => (
          <button
            key={time}
            className={`px-6 py-2 border rounded-full text-center transition ${
              bookedTimes.includes(time)
                ? "bg-gray-400 text-white cursor-not-allowed" // เวลาที่ถูกจองแล้ว (เทา)
                : selectedTime === time
                ? "bg-[#420F75] text-white" // เวลาที่เลือก (ม่วง)
                : "text-gray-700 border-gray-300 hover:bg-gray-100" // เวลาที่ยังว่าง
            }`}
            onClick={() => handleSelectTime(time)}
            disabled={bookedTimes.includes(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SlotComponent;