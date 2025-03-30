import { useEffect, useState } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import SlotComponent from "./SlotComponent";
import dayjs from "dayjs";

dayjs.locale("th");

const FullCalendarPage = ({ seerId, packageId, selectedDate, setSelectedDate, selectedTime, setSelectedTime }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [showDropdown, setShowDropdown] = useState(false);
  const [availableDay, setAvailableDay] = useState(new Set([]));
  const [loading, setLoading] = useState(false);
  const [seerCalendar, setSeerCalendar] = useState([]);

  const handleSelectDate = (date) => {
    setSelectedDate(dayjs(date).startOf("day"));
  };

  const setSeerCalendarAndAvailableDay = (data) => {
    setSeerCalendar(data);
    const availableDaySet = new Set();
    data.forEach((t)=>{
      const day = dayjs(t.start_time).get('D');
      availableDaySet.add(day);
    });
    setAvailableDay(availableDaySet);
  }
  
  const fetchSeerCalendar = async(date) => {
    const endDate = dayjs(date).endOf("month");
    const startDate = endDate.isSame(dayjs(), 'month') ? dayjs() : date;
    if (endDate.isBefore(dayjs(), 'month')) {
      setLoading(false)
      setSeerCalendarAndAvailableDay([])
      return
    } 
    
    const params = new URLSearchParams();
    params.append("start_date", startDate.format('YYYY-MM-DD'));
    params.append("end_date", endDate.format('YYYY-MM-DD'));
    
    await fetch(`https://backend.qseer.app/api/seer/${seerId}/package/fortune/${packageId}/time-slots?${params}`,{
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    })
    .then((res)=>res.json())
    .then((res)=>setSeerCalendarAndAvailableDay(res))
    .finally(()=>setLoading(false));
  }

  useEffect(()=>{
    fetchSeerCalendar(dayjs());
  },[]);
  
  return (
    <div className="flex flex-col items-center mb-6">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="relative bg-white border border-gray-200 rounded-lg p-6 shadow-md min-h-[480px] w-[650px]">
          {/* Header เลือกเดือน-ปี */}
          <div className="flex items-center justify-center gap-5 mb-8">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1 border-none bg-transparent text-[#615E83] text-lg font-semibold focus:outline-none"
              >
                {currentDate.format("MMMM YYYY")}
                <span className="text-sm">▼</span>
              </button>
              {showDropdown && (
                <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
                  <DateCalendar 
                    value={currentDate} 
                    onChange={async(date)=>{
                      setCurrentDate(date.startOf("month"));
                      setShowDropdown(false);
                      setLoading(true);
                      await fetchSeerCalendar(date.startOf('month'));
                    }} 
                    views={["year", "month"]} 
                    openTo="month" 
                  />
                </div>
              )}
            </div>
          </div>

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
          
          <div className="grid grid-cols-7 text-center mb-2">
            {["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."].map((day, index) => (
              <div key={index} className="text-[#8677A7] text-sm font-medium flex items-center justify-center h-10 w-14">
                {day}
              </div>
            ))}
          </div>
          
          {loading ? (
            <p className="text-center text-gray-500">กำลังโหลดข้อมูลปฏิทิน...</p>
          ) : (
            <div className="grid grid-cols-7 text-center pl-4">
              {Array.from({ length: currentDate.startOf("month").day() }).map((_, index) => (
                <div key={`empty-${index}`} className="w-12 h-12"></div>
              ))}
              {Array.from({ length: currentDate.daysInMonth() }, (_, index) => {
                const day = index + 1;
                const date = currentDate.date(day);
                const isSelected = selectedDate && selectedDate.isSame(date, "day");
                const isAvailable = availableDay.has(day);

                return (
                  <div key={day} className="relative flex flex-col items-center justify-center w-14 h-14">
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center z-0">
                        <span className="w-12 h-12 border-2 border-[#420F75] rounded-full"></span>
                      </span>
                    )}
                    <span
                      className={`relative w-10 h-10 flex items-center justify-center rounded-full transition 
                      ${isAvailable ? "text-gray-800" : "text-gray-500" } 
                      ${isAvailable ? "cursor-pointer" : "cursor-default"}`}
                      onClick={() => isAvailable && handleSelectDate(date)}
                    >
                      {day}
                      {isAvailable && (
                        <span className="absolute bottom-0 w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )} 
        </div>
      </LocalizationProvider>

      {selectedDate && (
        <>
          <div className="mt-6">
            <SlotComponent 
              seerCalendar={seerCalendar}
              selectedDate={selectedDate} 
              setSelectedTime={setSelectedTime} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FullCalendarPage;