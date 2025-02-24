import React, { useState } from "react";
import { createPortal } from "react-dom";
import Images from "../../assets"; // เปลี่ยนเป็น path ที่ถูกต้อง

const ReviewPopup = ({ isOpen, onClose, fortuneTeller }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
                <h2 className="text-xl font-semibold text-center mb-4">รีวิว {fortuneTeller}</h2>
                <p className="text-gray-600 text-center mb-4">ระดับความพึงพอใจ</p>

                {/* ⭐⭐⭐⭐⭐ ระบบให้คะแนน */}
                <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)}>
                            <img
                                src={star <= rating ? Images.StarOutline : Images.StarFilled}
                                alt="star"
                                className="w-8 h-8"
                            />
                        </button>
                    ))}
                </div>

                {/* กล่องเขียนความคิดเห็น */}
                <textarea
                    className="border rounded-md px-3 py-2 w-full h-24 resize-none bg-gray-100"
                    placeholder="เขียนความคิดเห็น"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>

                {/* ปุ่มส่งรีวิว */}
                <div className="mt-6">
                    <button
                        className="bg-purple-800 text-white w-full py-2 rounded-md"
                        onClick={() => {
                            console.log({ rating, comment });
                            onClose();
                        }}
                    >
                        โพสต์
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ReviewPopup;
