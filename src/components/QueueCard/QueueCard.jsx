import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../assets";
import ReviewPopup from "./ReviewPopup";
import axios from "axios";

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
  raw_data, // ข้อมูลทั้งหมดจาก API รวมถึง questions
  onReviewStatusChange, // callback เมื่อสถานะการรีวิวเปลี่ยน
  onMoveToBottom // callback สำหรับย้ายการ์ดที่รีวิวแล้วไปด้านล่าง
}) => {
    const navigate = useNavigate();
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [checkingReviewStatus, setCheckingReviewStatus] = useState(true); // สถานะการตรวจสอบ
    const [imageError, setImageError] = useState(false);

  // ตรวจสอบสถานะการรีวิวเมื่อโหลดคอมโพเนนต์
useEffect(() => {
    const checkReviewStatus = async () => {
        try {
            setCheckingReviewStatus(true);
            
            // ตรวจสอบจาก localStorage ก่อนเสมอ
            const reviewStateKey = `review_state_${id}`;
            const savedReviewState = localStorage.getItem(reviewStateKey);
            
            if (savedReviewState === 'true') {
                setHasReviewed(true);
                if (onReviewStatusChange) {
                    onReviewStatusChange(id, true);
                }
                if (onMoveToBottom) {
                    onMoveToBottom(id);
                }
                return; // ออกจากฟังก์ชันทันทีถ้าพบใน localStorage
            } else if (savedReviewState === 'false') {
                // ถ้าเคยตรวจสอบแล้วว่าไม่มี ก็ไม่ต้องเรียก API อีก
                setHasReviewed(false);
                return;
            } else if (raw_data?.has_reviewed) {
                // ถ้ามีข้อมูล has_reviewed จาก API
                setHasReviewed(true);
                localStorage.setItem(reviewStateKey, 'true');
                if (onReviewStatusChange) {
                    onReviewStatusChange(id, true);
                }
                if (onMoveToBottom) {
                    onMoveToBottom(id);
                }
                return; // ออกจากฟังก์ชันทันทีถ้าพบใน raw_data
            }
            
            // ตรวจสอบกับ API พร้อมกำหนด timeout 3 วินาที
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('API timeout')), 3000);
            });
            
            try {
                // ใช้ Promise.race เพื่อแข่งกันระหว่าง API และ timeout
                const response = await Promise.race([
                    axios.get(`https://backend.qseer.app/api/appointment/${id}/review`, {
                        withCredentials: true
                    }),
                    timeoutPromise
                ]);
                
                // ถ้ามีข้อมูลรีวิวแล้ว
                if (response.data && response.data.id) {
                    setHasReviewed(true);
                    localStorage.setItem(reviewStateKey, 'true');
                    if (onReviewStatusChange) {
                        onReviewStatusChange(id, true);
                    }
                    if (onMoveToBottom) {
                        onMoveToBottom(id);
                    }
                }
            } catch (error) {
                // ถ้าเกิด timeout หรือข้อผิดพลาดอื่นๆ
                if (error.message === 'API timeout') {
                    console.log(`API timeout for appointment ${id}, assuming not reviewed`);
                    setHasReviewed(false);
                    localStorage.setItem(reviewStateKey, 'false');
                }
                // ถ้าไม่พบข้อมูลรีวิว แสดงว่ายังไม่ได้รีวิว (404)
                else if (error.response && error.response.status === 404) {
                    setHasReviewed(false);
                    localStorage.setItem(reviewStateKey, 'false');
                } else {
                    console.error("Error checking review status:", error);
                    // สันนิษฐานว่ายังไม่ได้รีวิว หากเกิดข้อผิดพลาด
                    setHasReviewed(false);
                }
            }
        } finally {
            setCheckingReviewStatus(false);
        }
    };


        if (status === "เข้ารับบริการสำเร็จ") {
            checkReviewStatus();
        } else {
            setCheckingReviewStatus(false);
        }
    }, [id, raw_data, status, onReviewStatusChange, onMoveToBottom]);

    // แก้ไขการนำทางไปยังหน้า QueueDetails เพื่อให้แน่ใจว่าส่งข้อมูลคำถามไปด้วย
    const handleViewDetails = () => {
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
                    confirmation_code,
                    hasReviewed: hasReviewed
                }
            }
        });
    };

    // เปิด popup รีวิว
    const handleOpenReview = () => {
        setIsReviewOpen(true);
    };

    // ปิด popup รีวิว
    const handleCloseReview = (success = false) => {
        setIsReviewOpen(false);
        
        // ถ้ารีวิวสำเร็จ ให้อัพเดทสถานะและย้ายไปล่างสุด
        if (success) {
            setHasReviewed(true);
            // บันทึกสถานะการรีวิวใน localStorage
            localStorage.setItem(`review_state_${id}`, 'true');
            
            // แจ้งให้คอมโพเนนต์แม่รู้ว่ามีการรีวิวแล้ว
            if (onReviewStatusChange) {
                onReviewStatusChange(id, true);
            }
            
            // ย้ายการ์ดไปล่างสุด
            if (onMoveToBottom) {
                onMoveToBottom(id);
            }
        }
    };

    // จัดการรูปภาพที่โหลดไม่สำเร็จ
    const handleImageError = () => {
        setImageError(true);
    };

    // เลือกรูปภาพที่จะแสดง
    const getImageToDisplay = () => {
        if (imageError || !image) {
            // หากมีปัญหากับรูปภาพหรือไม่มีรูปภาพ ใช้รูปจาก assets
            return Images.tarotqueue;
        }
        // ตรวจสอบว่า image เป็น URL เต็มหรือไม่
        if (image.startsWith('http')) {
            return image;
        }
        // ถ้าเป็นเพียงเส้นทาง ให้ใช้รูปจาก assets
        return Images.tarotqueue;
    };

    return (
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 shadow-md p-5 mb-4 relative">
            {/* Image */}
            <img 
                src={getImageToDisplay()} 
                alt={title || "รายการดูดวง"}
                className="w-32 h-32 rounded-lg object-cover" 
                onError={handleImageError}
            />

            {/* Details */}
            <div className="ml-6 flex-1">
                {/* Title */}
                <h2 className="text-lg font-bold text-purple-800">{title || "ไม่ระบุรายการ"}</h2>
                <p className="text-gray-500 text-sm">{categories || "ไม่ระบุประเภท"}</p>

                {/* Info Section */}
                <div className="text-gray-600 text-sm flex flex-col mt-2 space-y-1">
                    <span className="flex items-center">
                        <img src={Images.UserProfile} alt="fortune teller" className="w-4 h-4 mr-2" />
                        {fortuneTeller || "ไม่ระบุหมอดู"}
                    </span>
                    <span className="flex items-center">
                        <img src={Images.CalendarMinimalistic} alt="date" className="w-4 h-4 mr-2" />
                        {date || "ไม่ระบุวันที่"}
                    </span>
                    <span className="flex items-center">
                        <img src={Images.timer} alt="time" className="w-4 h-4 mr-2" />
                        {time || "ไม่ระบุเวลา"}
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

                {/* แสดงตัวโหลดในขณะตรวจสอบสถานะรีวิว */}
                {status === "เข้ารับบริการสำเร็จ" && checkingReviewStatus && (
                    <div className="mt-2 w-4 h-4 border-2 border-t-transparent border-purple-600 rounded-full animate-spin"></div>
                )}

                {/* รีวิวหมอดู (แสดงเฉพาะเมื่อยังไม่ได้รีวิว) */}
                {status === "เข้ารับบริการสำเร็จ" && !checkingReviewStatus && !hasReviewed && (
                    <p
                        className="text-purple-800 text-sm mt-1 underline cursor-pointer hover:text-purple-600"
                        onClick={handleOpenReview}
                    >
                        รีวิวหมอดู
                    </p>
                )}
                
                {/* แสดงข้อความเมื่อรีวิวแล้ว */}
                {status === "เข้ารับบริการสำเร็จ" && !checkingReviewStatus && hasReviewed && (
                    <p className="text-gray-400 text-sm mt-1">
                        ได้รีวิวแล้ว
                    </p>
                )}
            </div>

            {/* Popup รีวิว */}
            <ReviewPopup
                isOpen={isReviewOpen}
                onClose={handleCloseReview}
                fortuneTeller={fortuneTeller}
                appointmentId={id}
            />
        </div>
    );
};

export default QueueCard;