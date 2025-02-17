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

const Homepage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [ongoingAuctions, setOngoingAuctions] = useState(() => {
    return JSON.parse(localStorage.getItem("ongoingAuctions")) || [];
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.state?.joinedAuction) {
      const exampleAuctions = [
        {
          id: `auction-${Date.now()}-1`,
          title: "กำลังเข้าร่วมประมูล",
          description: "ดูดวงความรัก สุขภาพ การงาน ภาพรวมประจำปี",
          timeLeft: "00:00:05:00",
          seerName: "หมอดู เพียงฟ้า",
          seerImage: Images.profileSmall,
          isWinner: null,
        },
        {
          id: `auction-${Date.now()}-2`,
          title: "สิ้นสุดการประมูล",
          description: "ดูดวงความรัก สุขภาพ การงาน ภาพรวมประจำปี",
          timeLeft: "00:00:00:00",
          seerName: "หมอดู เพียงฟ้า",
          seerImage: Images.profileSmall,
          isWinner: false, // แพ้ประมูล
        },
        {
          id: `auction-${Date.now()}-3`,
          title: "สิ้นสุดการประมูล",
          description: "ดูดวงความรัก สุขภาพ การงาน ภาพรวมประจำปี",
          timeLeft: "00:00:00:00",
          seerName: "หมอดู เพียงฟ้า",
          seerImage: Images.profileSmall,
          isWinner: true, // ชนะประมูล
        }
      ];

      // ✅ ล้างค่าการประมูลเก่าใน localStorage ก่อนเพิ่มใหม่
      localStorage.removeItem("ongoingAuctions");

      // ✅ ใช้ callback function ใน `setOngoingAuctions` เพื่ออัปเดตให้ทันที
      setOngoingAuctions((prevAuctions) => {
        const updatedAuctions = [...prevAuctions, ...exampleAuctions];
        localStorage.setItem("ongoingAuctions", JSON.stringify(updatedAuctions));
        return updatedAuctions;
      });

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.joinedAuction, navigate]);

  return (
    <>
      <Fillterbar />
      <div className="w-full">
        <HeroSection />
        <div className="p-8">
          <SearchBar />
          <IconSection />
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
