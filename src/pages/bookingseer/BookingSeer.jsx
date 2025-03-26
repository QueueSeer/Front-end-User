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
  const [packageInfo, setPackageInfo] = useState(location.state?.packageInfo || null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [numQuestions, setNumQuestions] = useState(4);
  const [loading, setLoading] = useState(!packageInfo);
  const [error, setError] = useState(null);
  
  // โหลด `packageInfo` จาก API ถ้าไม่มีค่าเข้ามา
  useEffect(() => {
    if (!packageInfo) {
    /* packageInfo = {
        seer_id: 1,
        id: 1,
        name: "Fate Seeker",
        price: "100.00",
        duration: 3600,
        description: "Knowing won't change.",
        question_limit: 0,
        status: "published",
        foretell_channel: "video",
        reading_type: "tarot",
        category: "love",
        required_data: [
          "name",
          "birthdate"
        ],
        image: "",
        date_created: "2025-02-23T23:47:22.149309+07:00"
      }*/
    fetch("http://localhost:5000/api/package/1") // เปลี่ยนเป็น API จริงเมื่อพร้อม
      .then((response) => {
        if (!response.ok) throw new Error("โหลดแพ็กเกจล้มเหลว");
        return response.json();
      })
      .then((data) => {
        setPackageInfo(data);
        setNumQuestions(data.numQuestions || 4);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching package:", err);
        setError("ไม่สามารถโหลดแพ็กเกจได้");
        setLoading(false);
      });
    } 
  }, [packageInfo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Debug logging to see the values before navigation
  const handleNextButtonClick = () => {
    console.log("Before navigation - selectedDate:", selectedDate);
    console.log("Before navigation - selectedTime:", selectedTime);
    console.log("Before navigation - packageInfo:", packageInfo);
    
    navigate("/bookingSeer2", { 
      state: { 
        packageInfo, 
        selectedDate: selectedDate instanceof Date ? selectedDate.toISOString() : selectedDate, 
        selectedTime, 
        numQuestions 
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
        <HeaderSection packageInfo={packageInfo} setNumQuestions={setNumQuestions} />

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