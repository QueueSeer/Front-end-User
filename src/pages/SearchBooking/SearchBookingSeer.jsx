import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/navbar/index"; // เรียกใช้ path ที่ถูกต้อง
import AuctionSearchBar from "../../components/Auctioncomponent/AuctionSearchBar";
import SidebarFilter from "../../components/Searchbar/SidebarFilter";
import SeerCard from "../../components/homecomponent/SeerPopular/SeerCard";

const SearchBookingSeer = () => {
  const location = useLocation();
  const categoryFromState = location.state?.category;

  const [searchTerm, setSearchTerm] = useState("");
  const [seers, setSeers] = useState([]);
  const [filteredSeers, setFilteredSeers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("desc"); // มากไปน้อย เป็นค่าเริ่มต้น

  // ฟังก์ชันสำหรับโหลดข้อมูลหมอดูจาก API
  const fetchSeers = async () => {
    try {
      setLoading(true);
      
      // สร้าง query params
      const params = new URLSearchParams();
      params.append("limit", 100); // เพิ่มจำนวนเพื่อให้แสดงหมอดูได้มากขึ้น
      params.append("direction", sortBy === "asc" ? "asc" : "desc");
      params.append("is_available", true);

      // ถ้ามีหมวดหมู่จาก state
      if (categoryFromState) {
        // หมายเหตุ: ถ้า API รองรับการค้นหาตามหมวดหมู่ สามารถเพิ่มพารามิเตอร์ตรงนี้
        // params.append("category", categoryFromState);
      }

      const response = await fetch(`https://backend.qseer.app/api/seer/search?${params}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("ไม่สามารถโหลดข้อมูลหมอดูได้");
      }

      const data = await response.json();
      console.log("ข้อมูลหมอดูที่ได้จาก API:", data);
      
      // ตรวจสอบและทำให้แน่ใจว่าข้อมูลที่ได้เป็น array
      let seersList = [];
      if (Array.isArray(data)) {
        seersList = data;
      } else if (data && Array.isArray(data.seers)) {
        // กรณี API อาจส่งข้อมูลในรูปแบบ { seers: [...] }
        seersList = data.seers;
      } else {
        // กรณีไม่ได้รับข้อมูลในรูปแบบที่คาดหวัง
        throw new Error("รูปแบบข้อมูลที่ได้รับไม่ถูกต้อง");
      }
      
      setSeers(seersList);
      setFilteredSeers(seersList); // เริ่มต้นโดยแสดงหมอดูทั้งหมด
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลหมอดู:", err);
      
      // สร้างข้อมูลจำลองในกรณีที่ API ล้มเหลว
      const mockSeers = Array.from({ length: 16 }).map((_, index) => ({
        id: index + 1,
        display_name: `หมอดู ${index + 1}`,
        primary_skill: ["ไพ่ทาโรต์", "โหราศาสตร์ไทย", "ไพ่ยิปซี", "โหงวเฮ้ง", "ศาสตร์ยูเรเนียน"][index % 5],
        rating: 4.2 + (index % 3) * 0.1,
        review_count: 50 + index * 5,
        image: null,
        is_available: true
      }));
      
      setSeers(mockSeers);
      setFilteredSeers(mockSeers); // เริ่มต้นโดยแสดงหมอดูทั้งหมด
      setError("ไม่สามารถโหลดข้อมูลหมอดูได้ แสดงข้อมูลจำลองแทน");
      setLoading(false);
    }
  };

  // ฟังก์ชันสำหรับการค้นหาและกรองข้อมูล
  const handleSearch = () => {
    console.log("ค้นหา:", searchTerm);
    
    if (!searchTerm.trim()) {
      // ถ้าไม่มีคำค้นหา ให้แสดงหมอดูทั้งหมด
      setFilteredSeers(seers);
      return;
    }
    
    // ทำการค้นหาทั้งจากชื่อและศาสตร์
    const searchTermLower = searchTerm.toLowerCase().trim();
    const filtered = seers.filter(seer => 
      (seer.display_name && seer.display_name.toLowerCase().includes(searchTermLower)) ||
      (seer.primary_skill && seer.primary_skill.toLowerCase().includes(searchTermLower))
    );
    
    setFilteredSeers(filtered);
  };

  // ฟังก์ชันสำหรับการเรียงลำดับ
  const handleSort = (e) => {
    const value = e.target.value;
    setSortBy(value);
    
    // เรียงลำดับข้อมูลที่กรองแล้ว
    const sorted = [...filteredSeers];
    
    if (value === "asc") {
      // เรียงจากน้อยไปมาก (ตามชื่อ)
      sorted.sort((a, b) => 
        (a.display_name || "").localeCompare(b.display_name || "")
      );
    } else if (value === "desc") {
      // เรียงจากมากไปน้อย (ตามชื่อ)
      sorted.sort((a, b) => 
        (b.display_name || "").localeCompare(a.display_name || "")
      );
    } else if (value === "rating") {
      // เรียงตามเรตติ้ง
      sorted.sort((a, b) => 
        (b.rating || 0) - (a.rating || 0)
      );
    }
    
    setFilteredSeers(sorted);
  };

  // แปลงข้อมูลจาก API ให้เข้ากับรูปแบบที่ SeerCard ต้องการ
  const mapSeerToCardProps = (seer) => {
    // ตรวจสอบว่า seer เป็น object และมีค่าก่อน
    if (!seer || typeof seer !== 'object') {
      return {
        id: 0,
        name: "ไม่มีข้อมูล",
        category: "",
        rating: 0,
        reviewCount: 0,
        image: null,
        isAvailable: false
      };
    }
    
    return {
      id: seer.id || 0,
      name: seer.display_name || "ไม่ระบุชื่อ",
      category: seer.primary_skill || "",
      rating: seer.rating !== undefined && seer.rating !== null ? seer.rating : 0,
      reviewCount: seer.review_count || 0,
      image: seer.image || null,
      isAvailable: seer.is_available !== undefined ? seer.is_available : false
    };
  };

  // เมื่อ component โหลดครั้งแรก
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSeers();
  }, []);

  // ฟังก์ชันรีเซ็ตการค้นหา
  const handleReset = () => {
    setSearchTerm("");
    setFilteredSeers(seers);
  };

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      {/* Header */}
      <div className="bg-gray-100 pt-24 pb-6 px-4 lg:px-12 text-center">
        <h1 className="text-4xl font-extrabold text-[#420F75]">
          {categoryFromState ? `หมอดู${categoryFromState}` : "ค้นหาหมอดู"}
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          {categoryFromState
            ? `เรียงตามหมวดหมู่: ${categoryFromState}`
            : "เลือกหมอดูที่คุณไว้วางใจ"}
        </p>
        <div className="max-w-xl mx-auto mt-4">
          <AuctionSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
            placeholder="ค้นหาตามชื่อหมอดูหรือศาสตร์ที่ใช้..."
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-100 px-4 lg:px-12 pb-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
       

        {/* Content */}
        <div className="w-full">
          {/* Header: หมอดูทั้งหมด */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[#2D2D2D]">
              {loading ? (
                "กำลังโหลดข้อมูล..."
              ) : (
                `หมอดูทั้งหมด - ${filteredSeers.length} คน`
              )}
              {searchTerm && (
                <span className="ml-2 text-sm text-gray-500">
                  (ค้นหา: "{searchTerm}")
                </span>
              )}
            </h2>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-700">
                เรียงจาก
              </label>
              <select
                id="sort"
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                value={sortBy}
                onChange={handleSort}
              >
                <option value="desc">มากไปน้อย</option>
                <option value="asc">น้อยไปมาก</option>
                <option value="rating">เรตติ้งสูงสุด</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-600 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}

          {/* Seer Cards */}
          {!loading && (
            <div className="flex flex-wrap justify-start gap-y-4">
              {filteredSeers.length > 0 ? (
                filteredSeers.map((seer, index) => (
                  <SeerCard key={seer.id || index} seer={mapSeerToCardProps(seer)} />
                ))
              ) : (
                <div className="w-full py-12 text-center">
                  <p className="text-gray-500 text-lg">ไม่พบข้อมูลหมอดูที่คุณค้นหา</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    onClick={handleReset}
                  >
                    ดูหมอดูทั้งหมด
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchBookingSeer;