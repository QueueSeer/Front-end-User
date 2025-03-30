import React, { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import Images from "../../assets";

const ReviewPopup = ({ isOpen, onClose, fortuneTeller, appointmentId }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        // ตรวจสอบข้อมูลก่อนส่ง
        if (rating === 0) {
            setError("กรุณาให้คะแนน");
            return;
        }
        
        if (comment.trim().length === 0) {
            setError("กรุณาเขียนความคิดเห็น");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");

            // แสดงข้อมูลที่จะส่งในคอนโซล (สำหรับการทดสอบ)
            console.log("ข้อมูลรีวิวที่จะส่ง:", {
                id: appointmentId,
                score: rating,
                text: comment.trim()
            });
            
            // URL ของ API
            const API_URL = 'https://backend.qseer.app';
            
            // สำคัญ: ตั้งค่า axios ให้ส่ง cookies ไปด้วย (สำหรับ session-based authentication)
            axios.defaults.withCredentials = true;
            
            // ส่งข้อมูลไปยัง API
            const response = await axios.post(`${API_URL}/api/review`, {
                id: appointmentId,
                score: rating,
                text: comment.trim()
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true // ยืนยันว่าส่ง cookies ไปด้วย
            });

            console.log("API ตอบกลับ:", response);

            // ตรวจสอบสถานะการตอบกลับ
            if (response.status === 201 || response.status === 200) {
                setSuccess(true);
                setTimeout(() => {
                    // ส่งค่า true กลับไปยัง parent component เพื่อแจ้งว่ารีวิวสำเร็จ
                    onClose(true);
                }, 1500);
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            console.error("Response data:", err.response?.data);
            
            // แสดงข้อความผิดพลาดที่เฉพาะเจาะจงมากขึ้น
            if (err.response?.status === 400) {
                // พยายามแสดงข้อความผิดพลาดจาก API ถ้ามี
                const errMsg = err.response?.data?.detail || "ข้อมูลไม่ถูกต้อง";
                
                if (errMsg.includes("Not client")) {
                    setError("คุณไม่ใช่ลูกค้าของการนัดหมายนี้");
                } else if (errMsg.includes("Appointment not ended")) {
                    setError("การนัดหมายยังไม่จบ จึงไม่สามารถรีวิวได้");
                } else if (errMsg.includes("Already reviewed")) {
                    setError("คุณได้รีวิวหมอดูท่านนี้ไปแล้ว");
                    // แจ้ง parent component ว่ามีการรีวิวแล้ว
                    setTimeout(() => onClose(true), 1500);
                } else {
                    setError(errMsg);
                }
            } else if (err.response?.status === 401 || err.response?.status === 403) {
                // ข้อผิดพลาดการยืนยันตัวตน
                setError("กรุณาเข้าสู่ระบบใหม่อีกครั้ง เซสชันของคุณอาจหมดอายุ");
                
                // อาจจะต้องเพิ่มการ redirect ไปหน้าล็อกอินที่นี่
                // window.location.href = '/login';
            } else if (err.response?.status === 409) {
                // ข้อผิดพลาดการขัดแย้งของข้อมูล (เช่น รีวิวซ้ำ)
                setError("คุณได้รีวิวหมอดูท่านนี้ไปแล้ว");
                // แจ้ง parent component ว่ามีการรีวิวแล้ว
                setTimeout(() => onClose(true), 1500);
            } else {
                // ข้อผิดพลาดทั่วไป
                setError("เกิดข้อผิดพลาดในการส่งรีวิว โปรดลองอีกครั้งในภายหลัง");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // สีและรูปภาพ Star
    const getStarImage = (position) => {
        return rating >= position ? Images.StarOutline : Images.StarFilled;
    };

    return createPortal(
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
                <h2 className="text-xl font-semibold text-center mb-4">รีวิว {fortuneTeller}</h2>
                
                {success ? (
                    <div className="text-center py-6">
                        <div className="text-green-500 text-xl mb-2">✓</div>
                        <p className="text-green-600">ขอบคุณสำหรับรีวิวของคุณ</p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 text-center mb-4">ระดับความพึงพอใจ</p>

                        {/* ⭐⭐⭐⭐⭐ ระบบให้คะแนน */}
                        <div className="flex justify-center mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                    key={star} 
                                    onClick={() => setRating(star)}
                                    className="mx-1"
                                >
                                    <img
                                        src={getStarImage(star)}
                                        alt={`star-${star}`}
                                        className="w-8 h-8"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* กล่องเขียนความคิดเห็น */}
                        <textarea
                            className="border rounded-md px-3 py-2 w-full h-24 resize-none bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-300"
                            placeholder="เขียนความคิดเห็น"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            maxLength={1000}
                        ></textarea>

                        <div className="text-right text-xs text-gray-500 mt-1">
                            {comment.length}/1000
                        </div>

                        {/* ข้อความ error */}
                        {error && (
                            <div className="bg-red-50 text-red-500 text-sm mt-2 p-2 rounded">
                                {error}
                            </div>
                        )}

                        {/* ปุ่มส่งรีวิว */}
                        <div className="mt-6 flex">
                            <button
                                className="flex-1 py-2 rounded-md border border-gray-300 mr-2 hover:bg-gray-50"
                                onClick={() => onClose(false)}
                                disabled={isSubmitting}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className={`flex-1 py-2 rounded-md ${
                                    isSubmitting
                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                        : "bg-purple-800 text-white hover:bg-purple-900"
                                }`}
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "กำลังส่ง..." : "ส่งรีวิว"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
};

export default ReviewPopup;