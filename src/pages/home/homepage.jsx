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

  // เรียกข้อมูลการประมูลที่ผู้ใช้กำลังเข้าร่วมจาก localStorage
  const [ongoingAuctions, setOngoingAuctions] = useState(() => {
    const storedAuctions = localStorage.getItem("ongoingAuctions");
    return storedAuctions ? JSON.parse(storedAuctions) : [];
  });

  // เลื่อนไปด้านบนเมื่อโหลดหน้า
  useEffect(() => {
    window.scrollTo(0, 0);
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
        // ถ้าไม่มี auctionId แต่มี joinedAuction=true ให้ใช้ข้อมูลตัวอย่าง (สำหรับการทดสอบเท่านั้น)
        // ในการใช้งานจริง ควรส่ง auctionId มาด้วยเสมอ
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
          <SearchBar />
          <IconSection />
          {/* แสดงเฉพาะเมื่อมีการประมูลที่เข้าร่วม */}
          
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