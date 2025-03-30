import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Fillterbar from "../../components/fillterbar";
import HeroSection from "../../components/homecomponent/HeroSection";
import SearchBar from "../../components/homecomponent/SearchBar";
import IconSection from "../../components/homecomponent/IconSection";
import FeatureSection from "../../components/homecomponent/FeatureSection";
import PopularSeers from "../../components/homecomponent/SeerPopular/PopularSeers";
import PackageSection from "../../components/homecomponent/Package/PackageSection";
import PopularCategories from "../../components/homecomponent/PopularCategories/PopularCategories";
import OngoingAuctions from "../../components/homecomponent/OngoingAuctions"; 
import Images from "../../assets"; 
import Navbar from "../../components/navbar";

const Homepage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // สร้าง state เพื่อเก็บข้อมูลหมอดูและแพ็คเกจที่จะส่งให้ SearchBar
  const [seersData, setSeersData] = useState([]);
  const [packagesData, setPackagesData] = useState([]);

  // เรียกข้อมูลการประมูลที่ผู้ใช้กำลังเข้าร่วมจาก localStorage
  const [ongoingAuctions, setOngoingAuctions] = useState(() => {
    const storedAuctions = localStorage.getItem("ongoingAuctions");
    return storedAuctions ? JSON.parse(storedAuctions) : [];
  });

  // เลื่อนไปด้านบนเมื่อโหลดหน้า
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ฟังก์ชันสำหรับดึงข้อมูลหมอดู
  const fetchSeersData = async () => {
    try {
      const params = new URLSearchParams();
      params.append("limit", 15);
      params.append("direction", "asc");
      params.append("is_available", true);

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
      
      // ตรวจสอบและทำให้แน่ใจว่าข้อมูลที่ได้เป็น array
      if (Array.isArray(data)) {
        setSeersData(data);
      } else if (data && Array.isArray(data.seers)) {
        setSeersData(data.seers);
      } else {
        // กรณีไม่ได้รับข้อมูลในรูปแบบที่คาดหวัง ใช้ข้อมูลจำลอง
        setSeersData([
          { id: 1, display_name: "หมอดูเพียงฟ้า พาขวัญ", primary_skill: "ศาสตร์ไพ่ยิปซี", rating: 4.0, review_count: 125 },
          { id: 2, display_name: "หมอดูเจนรบ", primary_skill: "โหราศาสตร์ไทย", rating: 4.5, review_count: 98 },
          { id: 3, display_name: "หมอเบียร์คนตื่นธรรม", primary_skill: "โหราศาสตร์", rating: 4.7, review_count: 203 },
          { id: 4, display_name: "หมอเจนนี่ ดวงดาว", primary_skill: "ศาสตร์ไพ่ยิปซี", rating: 4.2, review_count: 87 },
          { id: 5, display_name: "หมอดูภาลัย", primary_skill: "โหงวเฮ้ง", rating: 4.8, review_count: 156 },
          { id: 6, display_name: "หมอดูสุดารัตน์", primary_skill: "ศาสตร์ไพ่ยิปซี", rating: 4.1, review_count: 67 },
          { id: 7, display_name: "หมอมุกดา", primary_skill: "ไพ่ทาโรต์", rating: 4.3, review_count: 112 },
          { id: 8, display_name: "อาจารย์วิเชียร", primary_skill: "โหราศาสตร์ยูเรเนียน", rating: 4.6, review_count: 143 },
          { id: 9, display_name: "หมอพิมพ์นารา", primary_skill: "ศาสตร์ไพ่ยิปซี", rating: 4.2, review_count: 89 },
        ]);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลหมอดู:", error);
      // กรณีเกิดข้อผิดพลาด ใช้ข้อมูลจำลอง
      setSeersData([
        { id: 1, display_name: "หมอดูเพียงฟ้า พาขวัญ", primary_skill: "ศาสตร์ไพ่ยิปซี", rating: 4.0, review_count: 125 },
        { id: 2, display_name: "หมอดูเจนรบ", primary_skill: "โหราศาสตร์ไทย", rating: 4.5, review_count: 98 },
        { id: 3, display_name: "หมอเบียร์คนตื่นธรรม", primary_skill: "โหราศาสตร์", rating: 4.7, review_count: 203 },
      ]);
    }
  };

  // ฟังก์ชันสำหรับดึงข้อมูลแพ็คเกจ
  const fetchPackagesData = async () => {
    try {
      const params = new URLSearchParams();
      params.append("limit", 15);
      params.append("direction", "asc");
      
      const response = await fetch(`https://backend.qseer.app/api/seer/package/fortune/search?${params}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("ไม่สามารถโหลดข้อมูลแพ็คเกจได้");
      }

      const data = await response.json();
      
      if (data && Array.isArray(data.packages)) {
        setPackagesData(data.packages);
      } else {
        // ใช้ข้อมูลจำลองถ้าไม่ได้รับข้อมูลในรูปแบบที่คาดหวัง
        setPackagesData([
          { id: 1, name: "ดูดวงความรัก", seer_display_name: "หมอดูเพียงฟ้า", category: "ความรัก", price: "299" },
          { id: 2, name: "ดูดวงการงาน", seer_display_name: "หมอดูเจนรบ", category: "การงาน", price: "350" },
          { id: 3, name: "ดูดวงการเงิน", seer_display_name: "หมอเบียร์", category: "การเงิน", price: "400" },
        ]);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลแพ็คเกจ:", error);
      // ใช้ข้อมูลจำลองในกรณีเกิดข้อผิดพลาด
      setPackagesData([
        { id: 1, name: "ดูดวงความรัก", seer_display_name: "หมอดูเพียงฟ้า", category: "ความรัก", price: "299" },
        { id: 2, name: "ดูดวงการงาน", seer_display_name: "หมอดูเจนรบ", category: "การงาน", price: "350" },
        { id: 3, name: "ดูดวงการเงิน", seer_display_name: "หมอเบียร์", category: "การเงิน", price: "400" },
      ]);
    }
  };

  // ดึงข้อมูลเมื่อโหลดคอมโพเนนต์
  useEffect(() => {
    fetchSeersData();
    fetchPackagesData();
  }, []);

  // เพิ่มข้อมูลการประมูลเมื่อกลับมาจากหน้า BidAuction
  useEffect(() => {
    // ตรวจสอบว่ามีการส่ง joinedAuction=true มาหรือไม่
    if (location.state?.joinedAuction) {
      // ตรวจสอบว่ามี auctionId ส่งมาด้วยหรือไม่
      const auctionId = location.state?.auctionId;
      
      // ถ้ามี auctionId แสดงว่าผู้ใช้เพิ่งเข้าร่วมการประมูลนี้
      if (auctionId) {
        // เช็คว่าเคยมีการประมูลนี้อยู่แล้วหรือไม่
        const existingAuctionIndex = ongoingAuctions.findIndex(
          auction => auction.id === auctionId
        );
        
        if (existingAuctionIndex === -1) {
          // ถ้ายังไม่มี สร้างข้อมูลการประมูลใหม่
          const newAuction = {
            id: auctionId,
            title: location.state?.auctionTitle || "กำลังเข้าร่วมประมูล",
            description: location.state?.auctionDescription || "ดูดวงความรัก สุขภาพ การงาน ภาพรวมประจำปี",
            timeLeft: location.state?.timeLeft || "00:00:05:00",
            seerName: location.state?.seerName || "หมอดู เพียงฟ้า",
            seerImage: location.state?.seerImage || Images.profileSmall,
            isWinner: null,
          };
          
          // อัปเดต state และ localStorage
          setOngoingAuctions(prevAuctions => {
            const updatedAuctions = [...prevAuctions, newAuction];
            localStorage.setItem("ongoingAuctions", JSON.stringify(updatedAuctions));
            return updatedAuctions;
          });
        }
      } else {
        // ถ้าไม่มี auctionId แต่มี joinedAuction=true ให้ใช้ข้อมูลตัวอย่าง
        const exampleAuction = {
          id: `auction-${Date.now()}`,
          title: "กำลังเข้าร่วมประมูล",
          description: "ดูดวงความรัก สุขภาพ การงาน ภาพรวมประจำปี",
          timeLeft: "00:00:05:00",
          seerName: "หมอดู เพียงฟ้า",
          seerImage: Images.profileSmall,
          isWinner: null,
        };
        
        setOngoingAuctions(prevAuctions => {
          const updatedAuctions = [...prevAuctions, exampleAuction];
          localStorage.setItem("ongoingAuctions", JSON.stringify(updatedAuctions));
          return updatedAuctions;
        });
      }
      
      // ล้าง state หลังจากจัดการแล้ว
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.joinedAuction, navigate]);

  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>
     
      <div className="w-full mt-5">
        <HeroSection />
        <div className="p-8">
          {/* ส่งข้อมูลหมอดูและแพ็คเกจให้ SearchBar */}
          <SearchBar seersData={seersData} packagesData={packagesData} />
          <IconSection />
          
          <FeatureSection />
          <PopularSeers />
          <PackageSection />
          <PopularCategories />
        </div>
      </div>
    </>
  );
};

export default Homepage;