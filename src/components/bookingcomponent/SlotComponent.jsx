import React, { useEffect, useState } from "react";

import dayjs from "dayjs";

const SlotComponent = ({seerCalendar, selectedDate, setSelectedTime }) => { 
  if (!selectedDate) return null; 

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTime, setLocalSelectedTime] = useState(null);
  const [timePeriod, setTimePeriod] = useState("morning"); 

  useEffect(() => {
    if (!selectedDate || !selectedDate.isValid()) return;

    const slots = []
    seerCalendar.forEach((data)=>{
      if(dayjs(selectedDate).isSame(data.start_time, 'day')){
        slots.push(dayjs(data.start_time).format("HH:mm"));
      }
    })
    setAvailableSlots(slots);
    setLoading(false);
  }, []);
  
  
  const handleSelectTime = (time) => {
    setLocalSelectedTime(time);
    setSelectedTime(time);
  };

  const morningSlots = availableSlots.filter(time => time >= "09:00" && time < "13:00");
  const afternoonSlots = availableSlots.filter(time => !(time >= "09:00" && time < "13:00"));

  return (
    <div className="w-[650px] mt-5">
      {/* ปุ่มเลือกช่วงเวลา */}
      <div className="flex items-center space-x-6 mb-4">
        {morningSlots.length > 0 && (
          <button
            className={`flex items-center space-x-2 ${timePeriod === "morning" ? "text-[#6B5B95] font-semibold" : "text-gray-500"}`}
            onClick={() => setTimePeriod("morning")}
          >
            <div className={`w-4 h-4 rounded-full ${timePeriod === "morning" ? "bg-[#6B5B95]" : "bg-gray-300"}`}></div>
            <span>ช่วงเช้า</span>
          </button>
        )}

        {afternoonSlots.length > 0 && (
          <button
            className={`flex items-center space-x-2 ${timePeriod === "afternoon" ? "text-[#6B5B95] font-semibold" : "text-gray-500"}`}
            onClick={() => setTimePeriod("afternoon")}
          >
            <div className={`w-4 h-4 rounded-full ${timePeriod === "afternoon" ? "bg-[#6B5B95]" : "bg-gray-300"}`}></div>
            <span>ช่วงบ่าย</span>
          </button>
        )}
      </div>

      {/* แสดงสถานะโหลดข้อมูล */}
      {loading ? (
        <p className="text-center text-gray-500">กำลังโหลดข้อมูลเวลา...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-4 gap-3 mt-5">
          {(timePeriod === "morning" ? morningSlots : afternoonSlots).map((time) => (
            <button
              key={time}
              className={`px-6 py-2 border rounded-full text-center transition ${
                selectedTime === time
                  ? "bg-[#420F75] text-white" // เวลาที่เลือก (ม่วง)
                  : "text-gray-700 border-gray-300 hover:bg-gray-100" // เวลาที่ยังว่าง
              }`}
              onClick={() => handleSelectTime(time)} // ✅ ใช้ฟังก์ชันที่ถูกต้อง
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlotComponent;
