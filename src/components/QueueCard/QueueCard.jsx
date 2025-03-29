import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../assets";
import ReviewPopup from "./ReviewPopup";

const QueueCard = ({ 
  id, 
  image, 
  title, 
  categories, 
  fortuneTeller, 
  date, 
  time, 
  status,
  confirmation_code,
  raw_data // ข้อมูลทั้งหมดจาก API รวมถึง questions
}) => {
    const navigate = useNavigate();
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    // แก้ไขการนำทางไปยังหน้า QueueDetails เพื่อให้แน่ใจว่าส่งข้อมูลคำถามไปด้วย
    const handleViewDetails = () => {
        console.log("Navigating to queuedetails with data:", {
            id,
            raw_data: raw_data,
            has_questions: raw_data && raw_data.questions && Array.isArray(raw_data.questions)
        });
        
        navigate(`/queuedetails/${id}`, {
            state: { 
                appointmentData: raw_data,
                // ส่งข้อมูลสำหรับแสดงผลเพิ่มเติม
                displayData: {
                    image,
                    title,
                    categories,
                    fortuneTeller,
                    date,
                    time,
                    status,
                    confirmation_code
                }
            }
        });
    };

    return (
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 shadow-md p-5 mb-4 relative">
            {/* Image */}
            <img src={Images.tarotqueue} alt="tarotqueue" className="w-32 h-32 rounded-lg object-cover" />

            {/* Details */}
            <div className="ml-6 flex-1">
                {/* Title */}
                <h2 className="text-lg font-bold text-purple-800">{title}</h2>
                <p className="text-gray-500 text-sm">{categories}</p>

                {/* Info Section */}
                <div className="text-gray-600 text-sm flex flex-col mt-2 space-y-1">
                    <span className="flex items-center">
                        <img src={Images.UserProfile} alt="fortune teller" className="w-4 h-4 mr-2" />
                        {fortuneTeller}
                    </span>
                    <span className="flex items-center">
                        <img src={Images.CalendarMinimalistic} alt="date" className="w-4 h-4 mr-2" />
                        {date}
                    </span>
                    <span className="flex items-center">
                        <img src={Images.timer} alt="time" className="w-4 h-4 mr-2" />
                        {time}
                    </span>
                </div>

                {/* คำถาม (ถ้ามี) */}
                {raw_data && raw_data.questions && Array.isArray(raw_data.questions) && raw_data.questions.length > 0 && (
                    <p className="text-gray-500 text-sm mt-2">
                        มีคำถาม {raw_data.questions.length} ข้อ
                    </p>
                )}

                {/* More Details */}
                <p
                    className="text-gray-500 text-sm mt-3 cursor-pointer flex items-center hover:text-purple-600"
                    onClick={handleViewDetails}
                >
                    รายละเอียด
                    <img src={Images.next2} alt="details" className="w-2 h-3 ml-2" />
                </p>
            </div>

            {/* Status Button + รีวิวหมอดู */}
            <div className="flex flex-col items-center">
                <button
                    className={`px-5 py-2 rounded-lg text-sm font-semibold border transition ${
                        status === "รอเข้ารับบริการ"
                            ? "border-[#420F75] text-gray-500"
                            : status === "เข้ารับบริการสำเร็จ"
                            ? "bg-[#8677A7] text-white"
                            : "bg-red-600 text-white"
                    }`}
                >
                    {status}
                </button>

                {/* รีวิวหมอดู (เป็นข้อความ ไม่ใช่ปุ่ม) */}
                {status === "เข้ารับบริการสำเร็จ" && (
                    <p
                        className="text-purple-800 text-sm mt-1 underline cursor-pointer hover:text-purple-600"
                        onClick={() => setIsReviewOpen(true)}
                    >
                        รีวิวหมอดู
                    </p>
                )}
            </div>

            {/* Popup รีวิว */}
            <ReviewPopup
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                fortuneTeller={fortuneTeller}
            />
        </div>
    );
};

export default QueueCard;