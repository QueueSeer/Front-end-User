import React, { useState } from "react";
import Images from "../../../../assets";
import ReviewFilter from "./ReviewFilter";

const ReviewHeader = ({ filterReviewsByScore, stats = { averageScore: 0, totalReviews: 0 } }) => {
  const [activeFilter, setActiveFilter] = useState("ทั้งหมด");

  // ฟังก์ชั่นจัดการเมื่อมีการเปลี่ยนฟิลเตอร์
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    filterReviewsByScore(filter);
  };

  // แสดงดาวตามคะแนนเฉลี่ย
  const renderStars = () => {
    const avgScore = parseFloat(stats.averageScore);
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= avgScore) {
        // ดาวเต็ม
        stars.push(<img key={i} src={Images.Starcolor} alt="Star" className="w-6 h-6" />);
      } else if (i - 0.5 <= avgScore) {
        // ดาวครึ่ง (ถ้ามีฟังก์ชั่นนี้)
        stars.push(<img key={i} src={Images.StarHalf || Images.Starcolor} alt="Half Star" className="w-6 h-6" />);
      } else {
        // ดาวว่าง
        stars.push(<img key={i} src={Images.StarYellow} alt="Empty Star" className="w-6 h-6" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1">
            {renderStars()}
          </div>
          <div className="text-lg font-bold text-[#F59E0B]">
            โดยเฉลี่ย {stats.averageScore}
          </div>
          <div className="hidden sm:block text-gray-500">
            ({stats.totalReviews} รีวิว)
          </div>
        </div>
        
        <div>
          <ReviewFilter 
            activeFilter={activeFilter} 
            setActiveFilter={handleFilterChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewHeader;