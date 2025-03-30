import React, { useState, useEffect } from "react";
import SocialLinks from "./SocialLinks";
import TagsSection from "./TagsSection";
import axios from "axios";

const API_BASE_URL = "https://backend.qseer.app";

const AboutSection = ({ seerId }) => {
  const [seerInfo, setSeerInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("AboutSection - seerId:", seerId); // ตรวจสอบ seerId
    
    const fetchSeerInfo = async () => {
      if (!seerId) {
        console.log("No seerId provided");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log(`Fetching data from: ${API_BASE_URL}/api/seer/${seerId}`);
        
        const response = await axios.get(`${API_BASE_URL}/api/seer/${seerId}`);
        
        console.log("API Response:", response.data);
        setSeerInfo(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching seer info:", error);
        setError(`ไม่สามารถโหลดข้อมูลหมอดูได้: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSeerInfo();
  }, [seerId]);

  // แสดงข้อความกำลังโหลด
  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold flex items-center">
          <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>เกี่ยวกับเรา
        </h2>
        <p className="text-gray-500 mt-2">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  // แสดงข้อความเมื่อเกิดข้อผิดพลาด
  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold flex items-center">
          <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>เกี่ยวกับเรา
        </h2>
        <p className="text-red-500 mt-2">{error}</p>
      </div>
    );
  }

  // ถ้าไม่มีข้อมูล
  if (!seerInfo) {
    return (
      <div>
        <h2 className="text-2xl font-bold flex items-center">
          <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>เกี่ยวกับเรา
        </h2>
        <p className="text-gray-700 mt-2">ยังไม่มีข้อมูลเกี่ยวกับหมอดูท่านนี้</p>
      </div>
    );
  }

  // แสดงข้อมูลจาก API
  return (
    <div>
      <h2 className="text-2xl font-bold flex items-center">
        <span className="w-2 h-6 bg-[#8677A7] rounded-full mr-2"></span>เกี่ยวกับเรา
      </h2>
      
      <p className="text-gray-700 mt-2">
        {seerInfo.description || "ยังไม่มีข้อมูลคำอธิบาย"}
      </p>
      
      <SocialLinks 
        socialsName={seerInfo.socials_name} 
        socialsLink={seerInfo.socials_link} 
      />
      
      <TagsSection 
        primarySkill={seerInfo.primary_skill}
        seerId={seerId}  // เพิ่ม prop seerId
      />
    </div>
  );
};

export default AboutSection;