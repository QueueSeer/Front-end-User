import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuctionHeader from "../../components/Auctioncomponent/Detail/AuctionHeader";
import AuctionInfoBox from "../../components/Auctioncomponent/Detail/AuctionInfoBox";
import AuctionDetailSection from "../../components/Auctioncomponent/Detail/AuctionDetailSection";
import ProfileCard from "../../components/Profilecomponent/ProfileCard";
import Navbar from "../../components/navbar";
import Images from "../../assets";

const DetailAuction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ฟังก์ชันเลื่อนไปยังด้านบนสุดของหน้า
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // เลื่อนไปที่ด้านบนของหน้าเมื่อโหลดครั้งแรก
    window.scrollTo(0, 0);
    
    // เรียกข้อมูลประมูลจาก API
    const fetchAuctionDetail = async () => {
      setLoading(true);
      
      try {
        const API_BASE_URL = 'https://backend.qseer.app';
        const response = await fetch(`${API_BASE_URL}/api/auction/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("ไม่พบข้อมูลประมูล");
          }
          throw new Error(`เกิดข้อผิดพลาดจาก API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // แปลงข้อมูลจาก API เป็นรูปแบบที่ต้องการใช้ในคอมโพเนนต์
        const formattedAuction = {
          id: data.id,
          title: data.name,
          image: data.image || Images.auctionImages,
          description: data.description || "ไม่มีคำอธิบาย",
          shortDescription: data.short_description || "ไม่มีคำอธิบายสั้น",
          startDate: data.start_time ? new Date(data.start_time).toLocaleString('th-TH') : "ไม่ระบุ",
          endDate: data.end_time ? new Date(data.end_time).toLocaleString('th-TH') : "ไม่ระบุ",
          appointStartTime: data.appoint_start_time ? new Date(data.appoint_start_time).toLocaleString('th-TH') : "ไม่ระบุ",
          appointEndTime: data.appoint_end_time ? new Date(data.appoint_end_time).toLocaleString('th-TH') : "ไม่ระบุ",
          initialBid: data.initial_bid || 0,
          minIncrement: data.min_increment || 0,
          dateCreated: data.date_created ? new Date(data.date_created).toLocaleString('th-TH') : "ไม่ระบุ",
          astrologer: {
            id: data.seer?.id,
            name: data.seer?.display_name || "ไม่ระบุชื่อหมอดู",
            image: data.seer?.image || Images.profileSmall,
            subtitle: data.seer?.category, // ข้อมูลเพิ่มเติม
            rating: 0, // จะถูกแทนที่ด้วยข้อมูลจริงในคอมโพเนนต์ ProfileCard
          },
          // เก็บข้อมูลดิบจาก API เผื่อใช้
          originalData: data
        };
        
        console.log("ข้อมูลประมูลที่แปลงแล้ว:", formattedAuction);
        setAuction(formattedAuction);
        setError(null);
      } catch (err) {
        console.error("Error fetching auction detail:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuctionDetail();
  }, [id]);

  // แสดง loading state
  if (loading) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
          <Navbar />
        </div>
        <div className="min-h-screen bg-gray-100 flex justify-center items-center pt-20">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 rounded-full border-t-transparent"></div>
        </div>
      </>
    );
  }

  // แสดงข้อความเมื่อเกิดข้อผิดพลาด
  if (error || !auction) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
          <Navbar />
        </div>
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center pt-20">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-red-500 text-xl mb-4">{error || "ไม่พบข้อมูลประมูล"}</p>
            <button 
              onClick={() => navigate('/auction')} 
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              กลับไปหน้าประมูล
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ปุ่มเลื่อนขึ้นบนสุด */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-[#420F75] text-white p-3 rounded-full shadow-lg z-50 hover:bg-purple-800 transition-all"
        aria-label="เลื่อนขึ้นด้านบน"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl mt-20">
          {/* ส่วนหัว */}
          <AuctionHeader auction={auction} onBack={() => navigate(-1)} />

          {/* กล่องข้อมูลหลัก */}
          <div className="bg-white shadow-lg rounded-lg p-6 mt-4">
            <AuctionInfoBox auction={auction} />
            <AuctionDetailSection auction={auction} />
            <div className="w-2/3 mt-6">
              <p className="text-lg font-bold border-l-4 border-[#8677A7] pl-3 mb-2">โดย</p>
              <ProfileCard 
                seerId={auction.astrologer.id}
                profileImageUrl={auction.astrologer.image}
                name={auction.astrologer.name}
                category={auction.astrologer.subtitle}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailAuction;