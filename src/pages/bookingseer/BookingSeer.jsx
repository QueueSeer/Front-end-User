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
  const [numQuestions, setNumQuestions] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ฟังก์ชันจัด format description ให้อ่านง่าย
  const formatDescription = (desc) => {
    if (!desc || desc.trim() === "") return "ไม่มีคำอธิบายแพ็กเกจ";
    const lines = desc.split(/(?:\r\n|\r|\n)|(?:\d+\.)|(?:•)/).filter(line => line.trim() !== "");
    return lines.map((line, index) => `${index + 1}. ${line.trim()}`).join("\n");
  };

  // ฟังก์ชันจัด format ข้อมูล package ทั้งชุด
  const formatPackageInfo = (raw) => {
    return {
      id: raw.id ?? 0,
      seer_id: raw.seer_id ?? 0,
      name: raw.name ?? "แพ็กเกจไม่มีชื่อ",
      price: raw.price != null ? parseFloat(raw.price) : 0,
      duration: raw.duration ?? 0,
      description: formatDescription(raw.description),
      image: raw.image || "/default-image.jpg",
      question_limit: raw.question_limit ?? 0,
      status: raw.status ?? "unknown",
      foretell_channel: raw.foretell_channel ?? "-",
      reading_type: raw.reading_type ?? "-",
      category: raw.category ?? "-",
      required_data: raw.required_data ?? [],
      date_created: raw.date_created ?? null
    };
  };

  // โหลดข้อมูลเมื่อเริ่มหน้า หรือรับจาก state
  useEffect(() => {
    const statePackageInfo = location.state?.packageInfo;
    if (statePackageInfo) {
      setPackageInfo(formatPackageInfo(statePackageInfo));
      setNumQuestions(statePackageInfo.question_limit || 4);
      setLoading(false);
    } else {
      fetch("http://localhost:5000/api/package/1")
        .then((response) => {
          if (!response.ok) throw new Error("โหลดแพ็กเกจล้มเหลว");
          return response.json();
        })
        .then((data) => {
          const formatted = formatPackageInfo(data);
          setPackageInfo(formatted);
          setNumQuestions(formatted.question_limit || 4);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching package:", err);
          setError("ไม่สามารถโหลดแพ็กเกจได้");
          setLoading(false);
        });
    }
  }, [location.state]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNextButtonClick = () => {
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
