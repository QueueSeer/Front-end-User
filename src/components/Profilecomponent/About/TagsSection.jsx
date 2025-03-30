import React, { useState, useEffect } from "react";
import PackagesHeader from "./PackagesHeader";
import PackageCard from "../../homecomponent/Package/PackageCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://backend.qseer.app";

const TagsSection = ({ seerId }) => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // แสดง 10 รายการต่อหน้า (5x2)
  const [totalPages, setTotalPages] = useState(1);

  // กำหนดแท็กที่ใช้
  const tags = ["ความรัก", "การงาน", "การเงิน", "สุขภาพ", "ภาพรวม"];
  const [selectedTag, setSelectedTag] = useState(""); // state สำหรับแท็กที่เลือก

  // ดึงข้อมูลแพ็คเกจดูดวงของหมอดู
  useEffect(() => {
    const fetchPackages = async () => {
      if (!seerId) {
        setLoading(false);
        setError("ไม่พบรหัสหมอดู");
        return;
      }

      try {
        setLoading(true);
        
        // ตั้งค่าพารามิเตอร์สำหรับ API
        const params = new URLSearchParams();
        params.append("limit", 100); // ขอข้อมูลจำนวนมากเพื่อให้ได้ทั้งหมด
        params.append("last_id", 0); // เริ่มจาก ID แรก

        console.log(`Fetching packages for seer_id: ${seerId}`);
        const response = await axios.get(
          `${API_BASE_URL}/api/seer/${seerId}/package/fortune`,
          { params }
        );

        console.log("Package data from API:", response.data);

        // ตรวจสอบข้อมูลที่ได้
        if (response.data && response.data.packages) {
          // เตรียมข้อมูลรูปภาพ (ถ้าจำเป็น)
          const processedPackages = response.data.packages.map(pkg => {
            // ตรวจสอบว่า image และ seer_image เป็น URL เต็มหรือไม่
            if (pkg.image && !pkg.image.startsWith('http')) {
              // ถ้าไม่ใช่ URL เต็ม เติม base URL
              if (pkg.image.startsWith('/')) {
                pkg.image = `https://storage.qseer.app${pkg.image}`;
              } else {
                pkg.image = `https://storage.qseer.app/${pkg.image}`;
              }
            }
            
            if (pkg.seer_image && !pkg.seer_image.startsWith('http')) {
              // ถ้าไม่ใช่ URL เต็ม เติม base URL
              if (pkg.seer_image.startsWith('/')) {
                pkg.seer_image = `https://storage.qseer.app${pkg.seer_image}`;
              } else {
                pkg.seer_image = `https://storage.qseer.app/${pkg.seer_image}`;
              }
            }
            
            return pkg;
          });
          
          setPackages(processedPackages);
          setFilteredPackages(processedPackages); // เริ่มต้นแสดงทั้งหมด
          setTotalPages(Math.ceil(processedPackages.length / itemsPerPage));
          console.log("Processed packages:", processedPackages);
        } else {
          setPackages([]);
          setFilteredPackages([]);
          setTotalPages(0);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("ไม่สามารถโหลดข้อมูลแพ็คเกจได้");
        setPackages([]);
        setFilteredPackages([]);
        
        // ใช้ข้อมูลจำลองหากไม่สามารถโหลดข้อมูลได้
        mockData();
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [seerId]);

  // กรองแพ็คเกจตามแท็กที่เลือก
  useEffect(() => {
    if (selectedTag === "") {
      // ถ้าไม่เลือกแท็ก แสดงทั้งหมด
      setFilteredPackages(packages);
    } else {
      // กรองตามแท็กที่เลือก
      const filtered = packages.filter(pkg => {
        // ตรวจสอบจากทั้ง category และ reading_type
        const category = pkg.category ? pkg.category.toLowerCase() : "";
        const readingType = pkg.reading_type ? pkg.reading_type.toLowerCase() : "";
        const name = pkg.name ? pkg.name.toLowerCase() : "";
        
        const selectedTagLower = selectedTag.toLowerCase();
        
        return (
          category.includes(selectedTagLower) || 
          readingType.includes(selectedTagLower) || 
          name.includes(selectedTagLower)
        );
      });
      
      setFilteredPackages(filtered);
    }
    
    // รีเซ็ตหน้าเป็นหน้าแรกเมื่อเปลี่ยนแท็ก
    setCurrentPage(0);
    
    // คำนวณจำนวนหน้าทั้งหมดใหม่
    setTotalPages(Math.ceil(
      (selectedTag === "" ? packages.length : filteredPackages.length) / itemsPerPage
    ));
    
  }, [selectedTag, packages]);

  // ฟังก์ชันสำหรับจำลองข้อมูล (ในกรณีที่ API ไม่ทำงาน)
  const mockData = () => {
    const tagMap = {
      "ความรัก": "ความรัก",
      "การงาน": "การงาน",
      "การเงิน": "การเงิน",
      "สุขภาพ": "สุขภาพ",
      "ภาพรวม": "ภาพรวม"
    };

    const mockPackages = [
      { id: 1, name: "ดูดวงความรักในปีนี้", category: "ความรัก", seer_id: 101, seer_display_name: "หมอดูเพียงฟ้า พาขวัญ", seer_image: null, seer_rating: 4.0, seer_review_count: 935, price: "49.00", duration: 15, foretell_channel: "phone", reading_type: "ไพ่ยิปซี", status: "active", image: null, date_created: "2025-01-01T00:00:00Z" },
      { id: 2, name: "ดูดวงการงานและการเงิน", category: "การงาน", seer_id: 102, seer_display_name: "หมอดูภาลัย", seer_image: null, seer_rating: 4.5, seer_review_count: 810, price: "60.00", duration: 20, foretell_channel: "chat", reading_type: "โหราศาสตร์ไทย", status: "active", image: null, date_created: "2025-01-02T00:00:00Z" },
      { id: 3, name: "วิเคราะห์การเงินและภาพรวม", category: "การเงิน", seer_id: 103, seer_display_name: "หมอดูณัฐ", seer_image: null, seer_rating: 4.8, seer_review_count: 1200, price: "99.00", duration: 25, foretell_channel: "video", reading_type: "ไพ่ทาโรต์", status: "active", image: null, date_created: "2025-01-03T00:00:00Z" },
      { id: 4, name: "ดูดวงสุขภาพและความเจ็บป่วย", category: "สุขภาพ", seer_id: 104, seer_display_name: "หมอดูสุขใจ", seer_image: null, seer_rating: 4.2, seer_review_count: 540, price: "70.00", duration: 30, foretell_channel: "phone", reading_type: "โหราศาสตร์ไทย", status: "active", image: null, date_created: "2025-01-04T00:00:00Z" },
      { id: 5, name: "ภาพรวมชีวิตทั้งปี", category: "ภาพรวม", seer_id: 105, seer_display_name: "หมอดูวิทยา", seer_image: null, seer_rating: 4.6, seer_review_count: 780, price: "120.00", duration: 45, foretell_channel: "video", reading_type: "ไพ่ยิปซี", status: "active", image: null, date_created: "2025-01-05T00:00:00Z" },
    ];
    
    // สร้างข้อมูลเพิ่มเติมให้ครบทุกแท็ก
    const allMockPackages = [];
    
    // สร้างแพ็คเกจสำหรับแต่ละแท็ก
    tags.forEach((tag, tagIndex) => {
      mockPackages.forEach((pkg, pkgIndex) => {
        allMockPackages.push({
          ...pkg,
          id: pkg.id + (tagIndex * mockPackages.length) + (pkgIndex * tags.length),
          name: `${tag}: ${pkg.name}`,
          category: tagMap[tag] || tag,
        });
      });
    });
    
    setPackages(allMockPackages);
    setFilteredPackages(allMockPackages);
    setTotalPages(Math.ceil(allMockPackages.length / itemsPerPage));
  };

  // ฟังก์ชันเปลี่ยนหน้า
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // ฟังก์ชันสำหรับการคลิกที่แพ็กเกจ
  const handlePackageClick = (packageInfo) => {
    navigate("/bookingseer", { 
      state: { 
        packageInfo: packageInfo 
      } 
    });
  };

  // ฟังก์ชันสำหรับการเลือกแท็ก
  const handleTagSelect = (tag) => {
    // ถ้าคลิกแท็กที่เลือกอยู่แล้ว ให้ยกเลิกการเลือก
    if (selectedTag === tag) {
      setSelectedTag("");
    } else {
      setSelectedTag(tag);
    }
  };

  return (
    <div className="mt-10">
      {/* ส่วนแท็ก */}
      <h2 className="text-2xl font-bold flex items-center">
        <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>แท็ก
      </h2>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <button
            key={index}
            className={`px-4 py-2 border border-gray-400 rounded-full text-[#420F75] ${
              selectedTag === tag ? "bg-[#8677A7] text-white" : ""
            }`}
            onClick={() => handleTagSelect(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* ส่วนแสดงแพ็คเกจ */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold flex items-center mb-4">
          <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>
          {selectedTag ? `แพ็คเกจดูดวง${selectedTag}` : "แพ็คเกจดูดวงทั้งหมด"}
        </h2>

        {/* แสดงข้อความโหลดข้อมูล */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {/* แสดงข้อความเมื่อไม่มีข้อมูล */}
        {!loading && filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {error || (selectedTag 
                ? `ไม่พบแพ็คเกจดูดวง${selectedTag}` 
                : "ยังไม่มีแพ็คเกจดูดวงของหมอดูท่านนี้")}
            </p>
          </div>
        )}

        {/* แสดงข้อความ error (ถ้ามี) */}
        {error && filteredPackages.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* แสดงแพ็กเกจเมื่อมีข้อมูล */}
        {!loading && filteredPackages.length > 0 && (
          <>
            {/* ✅ แสดงส่วนหัวและปุ่มเปลี่ยนหน้า */}
           
            {/* ✅ แสดงแพ็กเกจ (grid รองรับ responsive) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredPackages
                .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                .map((pkg) => (
                  <div 
                    key={pkg.id}
                    className="cursor-pointer transition-transform transform hover:scale-105"
                    onClick={() => handlePackageClick(pkg)}
                  >
                    <PackageCard packageInfo={pkg} />
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TagsSection;