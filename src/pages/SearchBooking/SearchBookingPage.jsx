import React, { useEffect, useState } from "react";

import ActionSearchBar from "../../components/Searchbar/ActionsearchBar";
import Navbar from "../../components/navbar/index";
import PackageCard from "../../components/homecomponent/Package/PackageCard";
import SidebarFilter from "../../components/Searchbar/SidebarFilter";
import { useNavigate } from "react-router-dom";

const SearchBookingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ฟิลเตอร์ที่ใช้ในการค้นหา
  const [filters, setFilters] = useState({
    name: "", // ชื่อแพ็คเกจ
    category: "", // หมวดหมู่
    reading_type: "", // ประเภทการอ่าน
    foretell_channel: "", // ช่องทางการดูดวง (chat, phone, video)
    price_min: "", // ราคาต่ำสุด
    price_max: "", // ราคาสูงสุด
  });

  // ✅ Scroll to top เมื่อเข้าหน้า
  useEffect(() => {
    window.scrollTo(0, 0);
    // เรียก API ครั้งแรกเมื่อโหลดหน้า
    fetchPackages();
  }, []);

  // ฟังก์ชันค้นหาแพ็คเกจ
  const handleSearch = () => {
    console.log("กำลังค้นหา:", searchTerm);
    
    // ตั้งค่าฟิลเตอร์ตามคำค้นหา (เราจะค้นหาตามชื่อแพ็คเกจ)
    setFilters({
      ...filters,
      name: searchTerm.trim()
    });
    
    // เรียก API ใหม่ด้วยฟิลเตอร์ที่อัปเดต
    fetchPackages({
      ...filters,
      name: searchTerm.trim()
    });
  };

  // รับฟิลเตอร์จาก SidebarFilter
  const handleFilterChange = (newFilters) => {
    console.log("ฟิลเตอร์ใหม่:", newFilters);
    setFilters({...filters, ...newFilters});
    fetchPackages({...filters, ...newFilters});
  };

  // ฟังก์ชันดึงข้อมูลแพ็คเกจจาก API
  const fetchPackages = async (customFilters = null) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // ใช้ฟิลเตอร์ที่ส่งมาหรือใช้ state ปัจจุบัน
        const activeFilters = customFilters || filters;
        
        const params = new URLSearchParams();
        params.append("limit", 20); // จำนวนแพ็คเกจที่ต้องการดึง
        params.append("direction", "asc");
        
        // เพิ่มพารามิเตอร์สำหรับการค้นหาตามที่ API รองรับ
        if (activeFilters.name) {
          params.append("name", activeFilters.name);
        }
        if (activeFilters.category) {
          params.append("category", activeFilters.category);
        }
        if (activeFilters.reading_type) {
          params.append("reading_type", activeFilters.reading_type);
        }
        if (activeFilters.foretell_channel) {
          params.append("foretell_channel", activeFilters.foretell_channel);
        }
        if (activeFilters.price_min) {
          params.append("price_min", activeFilters.price_min);
        }
        if (activeFilters.price_max) {
          params.append("price_max", activeFilters.price_max);
        }
        
        const apiUrl = `https://backend.qseer.app/api/seer/package/fortune/search?${params}`;
        console.log("เรียก API URL:", apiUrl);
        
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const apiResponse = await response.json();
        console.log("ผลลัพธ์จาก API:", apiResponse);
        
        if (apiResponse && apiResponse.packages && apiResponse.packages.length > 0) {
          console.log(`พบข้อมูลแพ็คเกจจาก API จำนวน ${apiResponse.packages.length} รายการ`);
          setPackages(apiResponse.packages);
        } else {
          console.log("ไม่พบข้อมูลจาก API ใช้ข้อมูลจำลองแทน");
          setPackages([]);
        }
      } catch (apiError) {
        console.error("เกิดข้อผิดพลาดในการเรียก API:", apiError);
      } finally {
        setLoading(false);
      }
      
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลแพ็คเกจ:", error);
      setError("ไม่สามารถโหลดข้อมูลแพ็คเกจได้");
      setLoading(false);
    }
  };

  // แปลงข้อมูลจาก API ให้เข้ากับรูปแบบที่ PackageCard ต้องการ
  const mapPackageToCardProps = (pkg) => ({
    id: pkg.id,
    title: pkg.name,
    category: pkg.category,
    seer: pkg.seer_display_name,
    rating: pkg.seer_rating || 0,
    reviews: pkg.seer_review_count,
    price: parseFloat(pkg.price),
    duration: pkg.duration,
    icon: pkg.foretell_channel === "chat" ? "chat" : 
          pkg.foretell_channel === "phone" ? "call" : "video",
    image: pkg.image,
    seerImage: pkg.seer_image
  });

  // จัดการเมื่อคลิกที่การ์ด
  const handleCardClick = (pkg) => {
    navigate("/bookingSeer", { 
      state: { 
        packageInfo: mapPackageToCardProps(pkg) 
      } 
    });
  };

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>

      {/* Headline + Search */}
      <div className="bg-gray-100 pt-24 pb-6 px-4 lg:px-12 text-center">
        <h1 className="text-4xl font-extrabold text-[#420F75]">
          จองคิวดูดวงออนไลน์
        </h1>
        <p className="text-gray-600 mt-2 text-lg">เลือกแพ็กเกจที่คุณสนใจ</p>
        <div className="w-full mx-auto">
          <ActionSearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gray-100 px-4 lg:px-12 pb-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
       
        {/* Package Cards */}
        <div className="w-full">
          {loading ? (
            <div className="text-center py-12">กำลังโหลดข้อมูล...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12">
              {searchTerm ? 
                `ไม่พบแพ็คเกจที่ตรงกับการค้นหา "${searchTerm}"` : 
                "ไม่พบแพ็คเกจที่ตรงกับเงื่อนไข"
              }
            </div>
          ) : (
            <>
              {searchTerm && (
                <div className="mb-6 text-lg">
                  พบ <span className="font-bold">{packages.length}</span> รายการสำหรับ "{searchTerm}"
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                {packages.map((pkg) => (
                  <div 
                    key={pkg.id} 
                    className="card-container" 
                    style={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                    }}
                    onClick={() => handleCardClick(pkg)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <PackageCard packageInfo={pkg} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* CSS สำหรับ Hover Effect */}
      <style jsx>{`
        .card-container:hover > * {
          border-color: #420F75;
        }
      `}</style>
    </>
  );
};

export default SearchBookingPage;