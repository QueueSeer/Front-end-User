import React, { useState, useEffect } from "react";
import PackagesHeader from "./PackagesHeader";
import PackageCard from "../../homecomponent/Package/PackageCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://backend.qseer.app";

const PackagesSection = ({ seerId }) => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // แสดง 10 รายการต่อหน้า (5x2)
  const [totalPages, setTotalPages] = useState(1);

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
          setTotalPages(Math.ceil(processedPackages.length / itemsPerPage));
          console.log("Processed packages:", processedPackages);
        } else {
          setPackages([]);
          setTotalPages(0);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching packages:", err);
        setError("ไม่สามารถโหลดข้อมูลแพ็คเกจได้");
        setPackages([]); // ล้างข้อมูลเก่า
        
        // ใช้ข้อมูลจำลองหากไม่สามารถโหลดข้อมูลได้
        mockData(); // เปิดใช้ข้อมูลจำลองในกรณีที่มีข้อผิดพลาด
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [seerId]);

  // ฟังก์ชันสำหรับจำลองข้อมูล (ในกรณีที่ API ไม่ทำงาน)
  const mockData = () => {
    const mockPackages = [
      { id: 1, name: "ดูดวงความรักในปีนี้", category: "ความรัก", seer_id: 101, seer_display_name: "หมอดูเพียงฟ้า พาขวัญ", seer_image: null, seer_rating: 4.0, seer_review_count: 935, price: "49.00", duration: 15, foretell_channel: "phone", reading_type: "ไพ่ยิปซี", status: "active", image: null, date_created: "2025-01-01T00:00:00Z" },
      { id: 2, name: "ดูดวงการงานและการเงิน", category: "การงาน", seer_id: 102, seer_display_name: "หมอดูภาลัย", seer_image: null, seer_rating: 4.5, seer_review_count: 810, price: "60.00", duration: 20, foretell_channel: "chat", reading_type: "โหราศาสตร์ไทย", status: "active", image: null, date_created: "2025-01-02T00:00:00Z" },
      { id: 3, name: "วิเคราะห์ชีวิตรอบด้าน", category: "ภาพรวม", seer_id: 103, seer_display_name: "หมอดูณัฐ", seer_image: null, seer_rating: 4.8, seer_review_count: 1200, price: "99.00", duration: 25, foretell_channel: "video", reading_type: "ไพ่ทาโรต์", status: "active", image: null, date_created: "2025-01-03T00:00:00Z" },
    ];
    
    // สร้างข้อมูลเพิ่มเติมเพื่อให้มีมากพอสำหรับการทดสอบการเปลี่ยนหน้า
    const duplicated = [];
    for (let i = 0; i < 4; i++) {
      mockPackages.forEach((pkg, index) => {
        duplicated.push({
          ...pkg,
          id: pkg.id + mockPackages.length * i,
          name: `${pkg.name} ${i+1}`
        });
      });
    }
    
    setPackages(duplicated);
    setTotalPages(Math.ceil(duplicated.length / itemsPerPage));
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

  // แสดงข้อความโหลดข้อมูล
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // แสดงข้อความเมื่อไม่มีข้อมูล
  if (!packages.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {error || "ยังไม่มีแพ็คเกจดูดวงของหมอดูท่านนี้"}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ✅ แสดงส่วนหัวและปุ่มเปลี่ยนหน้า */}
      <PackagesHeader
        onPrev={prevPage}
        onNext={nextPage}
        currentIndex={currentPage}
        totalPages={totalPages}
      />

      {/* ✅ แสดงข้อความ error (ถ้ามี) */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* ✅ แสดงแพ็กเกจ (grid รองรับ responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {packages
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
    </div>
  );
};

export default PackagesSection;