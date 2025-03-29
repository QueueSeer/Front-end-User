import React, { useState, useEffect } from "react";
import ReviewHeader from "./Reviewcomponent/ReviewHeader";
import ReviewList from "./Reviewcomponent/ReviewList";
import axios from "axios";

const API_BASE_URL = "https://backend.qseer.app";

const ReviewsSection = ({ seerId }) => {
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    averageScore: 0,
    totalReviews: 0
  });

  // ฟังก์ชั่นสำหรับดึงข้อมูลรีวิวจาก API
  const fetchReviews = async (filterParams = {}) => {
    if (!seerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params = {
        limit: 100, // ดึงมาเยอะๆ
        ...filterParams
      };

      const response = await axios.get(`${API_BASE_URL}/api/review/seer/${seerId}`, { params });
      
      // แปลงข้อมูลจาก API เป็นรูปแบบที่ใช้ใน component
      const formattedReviews = response.data.map(review => ({
        id: review.id,
        name: review.client.display_name,
        date: formatDate(review.date_created),
        package: review.package.name,
        text: review.text,
        stars: review.score,
      }));

      setAllReviews(formattedReviews);
      setFilteredReviews(formattedReviews);
      
      // คำนวณคะแนนเฉลี่ยและจำนวนรีวิวทั้งหมด
      const totalScore = formattedReviews.reduce((sum, review) => sum + review.stars, 0);
      const avgScore = formattedReviews.length > 0 ? (totalScore / formattedReviews.length).toFixed(1) : 0;
      
      setStats({
        averageScore: avgScore,
        totalReviews: formattedReviews.length
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("ไม่สามารถโหลดข้อมูลรีวิวได้");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชั่นสำหรับแปลงวันที่เป็นรูปแบบไทย
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    
    // ชื่อเดือนภาษาไทย
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
    
    return `${day} ${month} ${year}`;
  };

  // เรียกข้อมูลรีวิวเมื่อ component โหลดหรือเมื่อ seerId เปลี่ยน
  useEffect(() => {
    fetchReviews();
  }, [seerId]);

  // ฟังก์ชั่นสำหรับกรองรีวิวตามคะแนน
  const filterReviewsByScore = (filterValue) => {
    if (filterValue === "ทั้งหมด") {
      setFilteredReviews(allReviews);
    } else {
      const scoreFilter = parseInt(filterValue);
      
      // ใช้ API ในการกรองแทนการกรองในแอพ
      fetchReviews({
        min_score: scoreFilter,
        max_score: scoreFilter
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold flex items-center">
        <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>รีวิว
      </h2>

      {/* ส่งทั้ง stats และฟังก์ชั่นสำหรับการกรองไปที่ ReviewHeader */}
      <ReviewHeader 
        setFilteredReviews={setFilteredReviews} 
        filterReviewsByScore={filterReviewsByScore}
        stats={stats}
      />

      {/* ส่งรีวิวและสถานะการโหลดไปให้ ReviewList */}
      <ReviewList 
        filteredReviews={filteredReviews} 
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default ReviewsSection;