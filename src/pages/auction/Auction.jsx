import React, { useState, useEffect } from "react";
import Images from "../../assets";
import AuctionSearchBar from "../../components/Auctioncomponent/AuctionSearchBar";
import AuctionCard from "../../components/Auctioncomponent/AuctionCard";
import Pagination from "../../components/Auctioncomponent/Pagination";
import Navbar from "../../components/navbar";

const Auction = () => {
  // สถานะสำหรับการค้นหา
  const [searchTerm, setSearchTerm] = useState("");
  
  // สถานะสำหรับการแบ่งหน้า
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [page3, setPage3] = useState(1);
  const totalPages = 10;
  
  // สถานะสำหรับข้อมูลประมูล
  const [ongoingAuctions, setOngoingAuctions] = useState([]);
  const [trendingAuctions, setTrendingAuctions] = useState([]);
  const [upcomingAuctions, setUpcomingAuctions] = useState([]);
  
  // สถานะสำหรับการโหลดและข้อผิดพลาด
  const [loading, setLoading] = useState({
    ongoing: false,
    trending: false,
    upcoming: false,
    search: false
  });
  const [error, setError] = useState({
    ongoing: null,
    trending: null,
    upcoming: null,
    search: null
  });
  
  // สถานะสำหรับผลการค้นหา
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // ฟังก์ชันสำหรับเรียกข้อมูลประมูลจาก API
  const fetchAuctions = async (type, page, params = {}) => {
    // ตั้งค่าสถานะการโหลดสำหรับส่วนนั้นๆ
    setLoading(prev => ({ ...prev, [type]: true }));
    setError(prev => ({ ...prev, [type]: null }));
    
    try {
      // สร้างพารามิเตอร์ query
      const queryParams = new URLSearchParams();
      
      // ใช้ last_id ในกรณีที่เปลี่ยนหน้า (pagination)
      if (page > 1) {
        // ใช้ค่าสุดท้ายจากข้อมูลปัจจุบันเป็น last_id
        let lastId = null;
        switch (type) {
          case 'ongoing':
            lastId = ongoingAuctions.length > 0 ? ongoingAuctions[ongoingAuctions.length - 1].id : null;
            break;
          case 'trending':
            lastId = trendingAuctions.length > 0 ? trendingAuctions[trendingAuctions.length - 1].id : null;
            break;
          case 'upcoming':
            lastId = upcomingAuctions.length > 0 ? upcomingAuctions[upcomingAuctions.length - 1].id : null;
            break;
          default:
            break;
        }
        if (lastId) {
          queryParams.append("last_id", lastId);
        }
      }
      
      // เพิ่มพารามิเตอร์ทั้งหมดที่ระบุใน params
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.append(key, params[key]);
        }
      });
      
      // กำหนดค่าเริ่มต้นถ้าไม่ได้ระบุ
      if (!params.limit) queryParams.append("limit", 3);
      
      // กำหนดค่าเฉพาะตามประเภท
      switch (type) {
        case 'ongoing':
          // กำลังดำเนินอยู่: ต้องไม่สิ้นสุดแล้ว
          if (!params.exclude_ended) queryParams.append("exclude_ended", true);
          break;
        case 'upcoming':
          // กำลังจะมาถึง: ควรมีวันเริ่มต้นในอนาคต
          const now = new Date().toISOString();
          if (!params.start_time_after) queryParams.append("start_time_after", now);
          break;
        default:
          break;
      }
      
      // URL ของ API
      const API_BASE_URL = 'https://backend.qseer.app';
      const url = `${API_BASE_URL}/api/auction/search?${queryParams.toString()}`;
      
      console.log(`กำลังเรียกข้อมูลประมูลประเภท ${type} จาก: ${url}`);
      
      // ทำการเรียก API
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`เกิดข้อผิดพลาดจาก API: ${response.status}`);
      }
      
      let data = await response.json();
      console.log(`ได้รับข้อมูลประมูลประเภท ${type}:`, data);
      
      // ตรวจสอบและแก้ไขโครงสร้างข้อมูล
      // บางครั้ง API อาจส่งคืนข้อมูลที่ไม่ใช่อาร์เรย์ แต่ส่งมาเป็นออบเจ็กต์ที่มี "items" เป็นอาร์เรย์
      if (!Array.isArray(data)) {
        if (data && data.items && Array.isArray(data.items)) {
          data = data.items;
        } else if (data && data.data && Array.isArray(data.data)) {
          data = data.data;
        } else if (data && typeof data === 'object') {
          // อาจเป็นออบเจ็กต์เดี่ยว แปลงเป็นอาร์เรย์
          data = [data];
        } else {
          console.warn(`ข้อมูลที่ได้รับไม่ใช่อาร์เรย์และไม่สามารถแปลงได้:`, data);
          data = [];
        }
      }
      
      // แปลงข้อมูล API เป็นรูปแบบที่ AuctionCard ต้องการ
      const transformedData = transformApiData(data);
      
      // อัปเดตข้อมูลตามประเภท
      switch (type) {
        case 'ongoing':
          setOngoingAuctions(transformedData);
          break;
        case 'trending':
          setTrendingAuctions(transformedData);
          break;
        case 'upcoming':
          setUpcomingAuctions(transformedData);
          break;
        case 'search':
          setSearchResults(transformedData);
          setShowSearchResults(true);
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`เกิดข้อผิดพลาดในการเรียกข้อมูลประมูลประเภท ${type}:`, err);
      setError(prev => ({ ...prev, [type]: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  // แปลงข้อมูล API เป็นรูปแบบที่ AuctionCard ต้องการ
  const transformApiData = (apiData) => {
    if (!Array.isArray(apiData)) {
      console.error("ข้อมูลที่ได้รับไม่ใช่อาร์เรย์:", apiData);
      return [];
    }
    
    return apiData.map(auction => ({
      id: auction.id || Math.random().toString(), // ใช้ค่าสุ่มถ้าไม่มี ID
      image: auction.image || Images.auctionImages, // ใช้รูปเริ่มต้นถ้าไม่มีรูป
      title: auction.name || "ไม่มีชื่อรายการ",
      description: auction.short_description || "ไม่มีคำอธิบาย",
      startDate: auction.start_time ? new Date(auction.start_time).toLocaleString('th-TH') : "ไม่ระบุ",
      endDate: auction.end_time ? new Date(auction.end_time).toLocaleString('th-TH') : "ไม่ระบุ",
      profileImage: Images.profileSmall, // ใช้รูปโปรไฟล์เริ่มต้น
      astrologer: auction.seer?.display_name || "ไม่ระบุชื่อหมอดู",
    }));
  };

  // จัดการการส่งคำค้นหา
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setShowSearchResults(false);
      return;
    }
    
    // เรียกข้อมูลผลการค้นหา
    fetchAuctions('search', 1, {
      name: searchTerm,
      seer_display_name: searchTerm,
      limit: 9,
      order_by: "id",
      direction: "desc"
    });
  };

  // เรียกข้อมูลเริ่มต้นเมื่อโหลดคอมโพเนนต์
  useEffect(() => {
    // เรียกข้อมูลประมูลที่กำลังดำเนินอยู่
    fetchAuctions('ongoing', page1, {
      order_by: "end_time",
      direction: "asc", // เรียงจากใกล้จบก่อน
      limit: 10 // เพิ่มจำนวนรายการที่เรียกเพื่อให้มีโอกาสได้ข้อมูลมากขึ้น
    });
    
    // เรียกข้อมูลประมูลที่กำลังมาแรง
    fetchAuctions('trending', page2, {
      order_by: "id", // เรียงตาม ID ล่าสุดก่อน
      direction: "desc",
      limit: 10
    });
    
    // เรียกข้อมูลประมูลที่กำลังจะถึง
    const now = new Date().toISOString();
    fetchAuctions('upcoming', page3, {
      order_by: "start_time",
      direction: "asc", // เรียงจากใกล้เริ่มก่อน
      limit: 10
    });
  }, []);

  // อัปเดตเมื่อมีการเปลี่ยนหน้า
  useEffect(() => {
    fetchAuctions('ongoing', page1, {
      exclude_ended: true,
      order_by: "end_time",
      direction: "asc"
    });
  }, [page1]);

  useEffect(() => {
    fetchAuctions('trending', page2, {
      order_by: "id",
      direction: "desc"
    });
  }, [page2]);

  useEffect(() => {
    fetchAuctions('upcoming', page3, {
      order_by: "start_time",
      direction: "asc"
    });
  }, [page3]);
  
  // แสดงข้อมูลจริงแบบไม่ใช้ข้อมูลทดสอบ
  const getAuctionData = (section) => {
    switch (section) {
      case 'ongoing':
        return ongoingAuctions;
      case 'trending':
        return trendingAuctions; 
      case 'upcoming':
        return upcomingAuctions;
      
      default:
        return [];
    }
  };
  
  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      {/* เนื้อหาหลักของหน้า */}
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center pt-20 mt-10">
        {/* ส่วนหัวของหน้า */}
        <h1 className="text-4xl font-bold text-[#420F75]">ประมูลดูดวงออนไลน์</h1>
        <p className="text-gray-600 mt-2">เลือกหมวดหมู่ที่คุณสนใจ</p>

        {/* คอมโพเนนต์กล่องค้นหา */}
        <AuctionSearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          onSearch={handleSearch} 
        />

        {/* ==================== Section: ผลการค้นหา (แสดงเมื่อมีการค้นหา) ==================== */}
        {showSearchResults && (
          <>
            <div className="w-full max-w-6xl mt-8">
              <h2 className="text-2xl font-bold text-[#420F75]">ผลการค้นหา</h2>
              <p className="text-gray-600">สำหรับ: "{searchTerm}"</p>
            </div>
            
            {loading.search ? (
              <div className="w-full max-w-6xl flex justify-center my-8">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="w-full max-w-6xl text-center my-8">
                <p className="text-gray-500">ไม่พบรายการประมูลที่ตรงกับการค้นหา</p>
              </div>
            ) : (
              <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {searchResults.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ==================== Section: ประมูลที่กำลังดำเนินอยู่ ==================== */}
        <Pagination
          title="ประมูลที่กำลังดำเนินอยู่"
          subtitle="เลือกประมูลที่คุณต้องการ"
          page={page1}
          setPage={setPage1}
          totalPages={totalPages}
        />
        
        {loading.ongoing ? (
          <div className="w-full max-w-6xl flex justify-center my-8">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
          </div>
        ) : ongoingAuctions.length === 0 ? (
          <div className="w-full max-w-6xl text-center my-8">
            <p className="text-gray-500">ไม่พบรายการประมูลที่กำลังดำเนินอยู่</p>
            
          </div>
        ) : (
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {getAuctionData('ongoing').map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}

        {/* ==================== Section: ประมูลที่กำลังมาแรง ==================== */}
        <Pagination
          title="ประมูลที่กำลังมาแรง"
          subtitle="ประมูลยอดนิยมในขณะนี้"
          page={page2}
          setPage={setPage2}
          totalPages={totalPages}
        />
        
        {loading.trending ? (
          <div className="w-full max-w-6xl flex justify-center my-8">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
          </div>
        ) : trendingAuctions.length === 0 ? (
          <div className="w-full max-w-6xl text-center my-8">
            <p className="text-gray-500">ไม่พบรายการประมูลที่กำลังมาแรง</p>
           
          </div>
        ) : (
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {getAuctionData('trending').map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}

        {/* ==================== Section: ประมูลที่กำลังจะถึง ==================== */}
        <Pagination
          title="ประมูลที่กำลังจะถึง"
          subtitle="เตรียมตัวให้พร้อมกับประมูลใหม่"
          page={page3}
          setPage={setPage3}
          totalPages={totalPages}
        />
        
        {loading.upcoming ? (
          <div className="w-full max-w-6xl flex justify-center my-8">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
          </div>
        ) : upcomingAuctions.length === 0 ? (
          <div className="w-full max-w-6xl text-center my-8">
            <p className="text-gray-500">ไม่พบรายการประมูลที่กำลังจะถึง</p>
            
          </div>
        ) : (
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {getAuctionData('upcoming').map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Auction;