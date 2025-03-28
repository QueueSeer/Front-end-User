import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import BackButton from "../../components/bookingcomponent/BackButton";
import BookingSteps from "../../components/bookingcomponent/BookingSteps";
import FullCalendarPage from "../../components/bookingcomponent/FullCalendarPage";
import HeaderSection from "../../components/bookingcomponent/HeaderSection";
import Navbar from "../../components/navbar";
import NextButton from "../../components/bookingcomponent/NextButton";

const BookingSeer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [packageInfo, setPackageInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [numQuestions, setNumQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ฟังก์ชันจัด format description ให้อ่านง่าย
  const formatDescription = (desc) => {
    if (!desc || desc.trim() === "") return "ไม่มีคำอธิบายแพ็กเกจ";
    const lines = desc.split(/(?:\r\n|\r|\n)|(?:\d+\.)|(?:•)/).filter(line => line.trim() !== "");
    return lines.map((line, index) => `${index + 1}. ${line.trim()}`).join("\n");
  };

  useEffect(() => {
    const statePackageInfo = location.state?.packageInfo;
    const seerId = statePackageInfo.seer_id;
    const packageId = statePackageInfo.id;
    const fetchPackage = async() => {
      await fetch(`https://backend.qseer.app/api/seer/${seerId}/package/fortune/${packageId}`,{
        method: "GET",
        headers: {
          "Content-type": "application/json"
        }
      })
      .then((res)=>res.json())
      .then((res)=>setPackageInfo(res))
      setLoading(false);
    }
    fetchPackage();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNextButtonClick = () => {
    navigate("/bookingSeer_2", {
      state: {
        packageInfo,
        selectedDate: selectedDate instanceof Date ? selectedDate.toISOString() : selectedDate,
        selectedTime
      }
    });
  };

  if (loading) return <p className="text-center text-gray-500">กำลังโหลดแพ็กเกจ...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      <div className="p-6 mt-8">
        <BackButton />
        <BookingSteps />
        <HeaderSection packageInfo={packageInfo} />

        <div className="w-full">
          <FullCalendarPage 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        </div>

        {/* Next Button: กดได้ก็ต่อเมื่อเลือกวันและเวลาแล้ว */}
        <div className="fixed bottom-4 right-4">
          <NextButton 
            onClick={handleNextButtonClick} 
            disabled={!selectedDate || !selectedTime}
          />
        </div>
      </div>
    </>
  );
};

export default BookingSeer;
