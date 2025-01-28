import React, { useState } from "react";
import ReviewHeader from "./Reviewcomponent/ReviewHeader";
import ReviewList from "./Reviewcomponent/ReviewList";

const ReviewsSection = () => {
  const [filteredReviews, setFilteredReviews] = useState([]);  // ✅ กำหนดค่าเริ่มต้นเป็น []

  return (
    <div>
      <h2 className="text-2xl font-bold flex items-center">
        <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>รีวิว
      </h2>

      {/* ส่ง setFilteredReviews ไปที่ ReviewHeader เพื่อให้ตัวกรองทำงาน */}
      <ReviewHeader setFilteredReviews={setFilteredReviews} />

      {/* ส่ง filteredReviews ไปให้ ReviewList เพื่อแสดงผล */}
      <ReviewList filteredReviews={filteredReviews} />
    </div>
  );
};

export default ReviewsSection;
