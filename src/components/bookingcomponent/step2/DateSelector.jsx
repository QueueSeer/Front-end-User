import React from "react";
import dayjs from "dayjs";

const DateSelector = ({ selectedDate, setSelectedDate }) => {
  // Make sure selectedDate is a proper Date object
  const date = selectedDate instanceof Date ? selectedDate : new Date();
  
  // Generate days of the week in Thai
  const thaiDays = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  
  // Get the current date and the next 6 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() + i);
      dates.push(currentDate);
    }
    return dates;
  };

  const dates = generateDates();

  // Check if a date is selected
  const isSelected = (date) => {
    if (!selectedDate) return false;
    
    return date.getDate() === selectedDate.getDate() && 
           date.getMonth() === selectedDate.getMonth() && 
           date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className="mb-6">
      <h4 className="text-base font-medium mb-3">เลือกวันที่ต้องการนัดหมาย</h4>
      <div className="flex overflow-x-auto pb-2 space-x-2">
        {dates.map((dateObj, index) => {
          const day = thaiDays[dateObj.getDay()];
          const isToday = dateObj.getDate() === new Date().getDate() && 
                          dateObj.getMonth() === new Date().getMonth() && 
                          dateObj.getFullYear() === new Date().getFullYear();
                          
          return (
            <button
              key={index}
              className={`flex-none text-center p-3 rounded-lg transition ${
                isSelected(dateObj)
                  ? "bg-[#65558F] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-[#65558F]"
              }`}
              onClick={() => setSelectedDate(dateObj)}
            >
              <div className="w-12">
                <p className="text-xs font-semibold mb-1">{day}</p>
                <p className={`text-lg font-bold ${isToday ? "text-red-500" : ""} ${
                  isSelected(dateObj) ? "text-white" : ""
                }`}>
                  {dateObj.getDate()}
                </p>
                <p className="text-xs">
                  {dayjs(dateObj).format("MMM")}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;