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
import OngoingAuctions from "../../components/homecomponent/OngoingAuctions"; // ✅ นำเข้า Component ใหม่
import Images from "../../assets"; // ✅ นำเข้า Images

const Homepage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ โหลดข้อมูลประมูลจาก localStorage (ถ้ามี)
  const [ongoingAuctions, setOngoingAuctions] = useState(() => {
    return JSON.parse(localStorage.getItem("ongoingAuctions")) || [];
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ เพิ่ม Card การประมูลเฉพาะเมื่อ `joinedAuction` เป็น `true`
  useEffect(() => {
    if (location.state?.joinedAuction) {
      const exampleAuctions = [
        {
          id: "auction-1",
          title: "กำลังเข้าร่วมประมูล",
          description: "ดูดวงความรัก สุขภาพ การงาน ภาพรวมประจำปี",
          timeLeft: "00:00:05:00",
          seerName: "หมอดู เพียงฟ้า",
          seerImage: Images.profileSmall,
          isWinner: null,
        },
        {
          id: "auction-2",
          title: "สิ้นสุดการประมูล",
          description: "ดูดวงความรัก สุขภาพ การงาน ภาพรวมประจำปี",
          timeLeft: "00:00:00:00",
          seerName: "หมอดู เพียงฟ้า",
          seerImage: Images.profileSmall,
          isWinner: false, // ✅ แพ้ประมูล
        },
        {
          id: "auction-3",
          title: "สิ้นสุดการประมูล",
          description: "ดูดวงความรัก สุขภาพ การงาน ภาพรวมประจำปี",
          timeLeft: "00:00:00:00",
          seerName: "หมอดู เพียงฟ้า",
          seerImage: Images.profileSmall,
          isWinner: true, // ✅ ชนะประมูล
        }
      ];

      // ✅ เช็คว่าไม่เพิ่มการ์ดซ้ำ
      const exists = ongoingAuctions.some((auction) => auction.id === "auction-1");
      if (!exists) {
        const updatedAuctions = [...ongoingAuctions, ...exampleAuctions];
        setOngoingAuctions(updatedAuctions);
        localStorage.setItem("ongoingAuctions", JSON.stringify(updatedAuctions));
      }

      // ✅ รีเซ็ต `joinedAuction` เพื่อไม่ให้เพิ่มซ้ำเมื่อรีเฟรช
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.joinedAuction, navigate, ongoingAuctions]);

  return (
    <>
      <Fillterbar />
      <div className="w-full">
        <HeroSection />
        <div className="p-8">
          <SearchBar />
          <IconSection />
          {/* ✅ แสดง `OngoingAuctions` เฉพาะเมื่อมีข้อมูล */}
          {ongoingAuctions.length > 0 && <OngoingAuctions auctions={ongoingAuctions} />}
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
