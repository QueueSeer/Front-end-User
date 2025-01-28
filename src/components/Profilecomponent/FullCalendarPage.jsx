import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import Images from "../../assets";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

dayjs.locale("th");

const FullCalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [calendarData, setCalendarData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Mock Data สำหรับสถานะวัน (ว่าง / เต็ม / วันหยุด)
    const mockData = [
      { date: "2025-01-14", status: "available" },
      { date: "2025-01-15", status: "full" },
      { date: "2025-01-16", status: "holiday" },
    ];
    setCalendarData(mockData);
  }, []);

  const getStatus = (date) => {
    const dayData = calendarData.find((item) => item.date === date.format("YYYY-MM-DD"));
    return dayData ? dayData.status : null;
  };

  const handleDateChange = (date) => {
    setCurrentDate(date.startOf("month"));
    setShowDropdown(false);
  };

  return (
    <div className="mb-6">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="mb-6">
          <div className="relative bg-white border border-gray-200 rounded-lg p-6 shadow-md min-h-[390px]">
            {/* Header เลือกเดือน-ปี */}
            <div className="flex items-center justify-center gap-5 mb-8">
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 border-none bg-transparent text-[#615E83] text-lg font-semibold focus:outline-none"
                >
                  {`${currentDate.format("MMMM YYYY")}`}
                  <span className="text-sm">▼</span>
                </button>
                {showDropdown && (
                  <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <DateCalendar value={currentDate} onChange={handleDateChange} views={["year", "month"]} openTo="month" />
                  </div>
                )}
              </div>
            </div>

            {/* คำอธิบายสถานะในมุมขวา */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2 text-sm text-gray-700">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span>ว่าง</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span>เต็ม</span>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 text-center">
              {["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."].map((day, index) => (
                <div key={index} className="text-[#8677A7] text-sm font-medium flex items-center justify-center h-10">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 text-center">
              {/* ช่องว่างก่อนวันที่ 1 ของเดือน */}
              {Array.from({ length: currentDate.startOf("month").day() }).map((_, index) => (
                <div key={`empty-${index}`} className="w-10 h-10"></div>
              ))}
              {/* วันที่ในเดือน */}
              {Array.from({ length: currentDate.daysInMonth() }, (_, index) => {
                const day = index + 1;
                const date = currentDate.date(day);
                const status = getStatus(date);
                const isToday = dayjs().isSame(date, "day");

                return (
                  <div key={day} className="relative flex flex-col items-center justify-center w-12 h-12 ml-5">
                    {/* วันที่ */}
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        status === "holiday"
                          ? "text-gray-400" // ตัวหนังสือสีเทา ถ้าเป็นวันหยุด
                          : isToday
                          ? "bg-[#420F75] text-white font-semibold" // พื้นหลังสีม่วงสำหรับวันนี้
                          : "text-gray-800"
                      }`}
                    >
                      {day}
                    </span>
                    {/* วงกลมสีสถานะใต้วันที่ (ไม่แสดงถ้าเป็นวันหยุด) */}
                    {status !== "holiday" && status === "available" && (
                      <span className="absolute bottom-0 w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                    {status !== "holiday" && status === "full" && (
                      <span className="absolute bottom-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </LocalizationProvider>
    </div>
  );
};

export default FullCalendarPage;
