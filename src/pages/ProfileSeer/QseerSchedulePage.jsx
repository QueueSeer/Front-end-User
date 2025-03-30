import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FullCalendarPage from "../../components/Profilecomponent/FullCalendarPage";
import ProfileCard from "../../components/Profilecomponent/ProfileCard";
import ActionButtons from "../../components/Profilecomponent/ActionButtons";
import ProfileTabs from "../../components/Profilecomponent/About/ProfileTabs";
import Navbar from "../../components/navbar/index"; // เรียกใช้ path ที่ถูกต้อง
import axios from "axios"; // เพิ่ม import axios

const API_BASE_URL = "https://backend.qseer.app"; // กำหนด Base URL

const QseerSchedulePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [seerData, setSeerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followersCount, setFollowersCount] = useState(0); // เพิ่ม state สำหรับเก็บจำนวนผู้ติดตาม
  const [reviewCount, setReviewCount] = useState(0); // เพิ่ม state สำหรับเก็บจำนวนรีวิว

  // รับข้อมูลหมอดูเบื้องต้นจาก state ของ location (ส่งมาจากหน้าก่อนหน้า)
  const seerFromState = location.state?.seer;

  // ✅ เพิ่ม useEffect เพื่อเลื่อนหน้ากลับด้านบนเมื่อเปลี่ยนหน้า
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ดึงข้อมูลจำนวนผู้ติดตามและรีวิวจาก API
  useEffect(() => {
    if (!seerFromState?.id) return;

    // ดึงข้อมูลจำนวนผู้ติดตาม
    const fetchFollowersCount = async () => {
      try {
        console.log("Fetching followers count for seer ID:", seerFromState.id);
        
        // ใช้ endpoint total_followers ที่ถูกต้อง
        const response = await axios.get(`${API_BASE_URL}/api/seer/${seerFromState.id}/total_followers`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        console.log("Followers API response:", response.data);
        
        // endpoint นี้ส่งค่า count กลับมาโดยตรง
        if (response.data && response.data.count !== undefined) {
          console.log("Followers count:", response.data.count);
          setFollowersCount(response.data.count);
        } else {
          console.log("Followers count property not found in response");
        }
      } catch (error) {
        console.error("Error fetching followers count:", error);
        console.log("Error details:", error.response?.data || error.message);
      }
    };

    // ดึงข้อมูลจำนวนรีวิว
    const fetchReviewCount = async () => {
      try {
        console.log("Fetching review count for seer ID:", seerFromState.id);
        const response = await axios.get(`${API_BASE_URL}/api/review/seer/${seerFromState.id}`);
        console.log("Review API response:", response.data);
        
        if (response.data && Array.isArray(response.data)) {
          console.log("Review count (array length):", response.data.length);
          setReviewCount(response.data.length);
        } else if (response.data && response.data.total !== undefined) {
          console.log("Review count (total field):", response.data.total);
          setReviewCount(response.data.total);
        }
      } catch (error) {
        console.error("Error fetching review count:", error);
        console.log("Error details:", error.response?.data || error.message);
      }
    };

    fetchFollowersCount();
    fetchReviewCount();
  }, [seerFromState?.id]);

  // ดึงข้อมูลหมอดูจาก API
  useEffect(() => {
    const fetchSeerData = async () => {
      // ถ้าไม่มี seer_id ให้ใช้ข้อมูลเริ่มต้น
      if (!seerFromState?.id) {
        setSeerData({
          id: null,
          image: "",
          display_name: "ไม่พบข้อมูลหมอดู",
          primary_skill: "ไม่ระบุ",
          experience: "ไม่ระบุ",
          rating: 0,
          description: "",
          socials_name: "",
          socials_link: ""
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/seer/${seerFromState.id}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json"
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("ไม่พบข้อมูลหมอดู");
          }
          throw new Error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        }

        const data = await response.json();
        console.log("ข้อมูลหมอดูที่ได้จาก API:", data);
        setSeerData(data);
        setError(null);
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลหมอดู:", err);
        setError(err.message);
        
        // กรณีเกิดข้อผิดพลาด ใช้ข้อมูลจาก state เป็นค่าเริ่มต้น
        setSeerData({
          id: seerFromState.id,
          image: seerFromState.image || "",
          display_name: seerFromState.name || "ไม่พบข้อมูลหมอดู",
          primary_skill: seerFromState.category || "ไม่ระบุ",
          experience: seerFromState.experience || "ไม่ระบุ",
          rating: seerFromState.rating || 0,
          description: "",
          socials_name: "",
          socials_link: ""
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSeerData();
  }, [seerFromState]);

  // แปลงข้อมูลสำหรับ ProfileCard
  const mapSeerToProfileProps = (seer) => {
    if (!seer) return null;
    
    // คำนวณประสบการณ์เป็นปีจาก experience ที่เป็นวันที่
    let experienceYears = "ไม่ระบุ";
    if (seer.experience && seer.experience !== "ไม่ระบุ") {
      try {
        const experienceDate = new Date(seer.experience);
        const currentDate = new Date();
        const diffYears = currentDate.getFullYear() - experienceDate.getFullYear();
        experienceYears = `${diffYears} ปี`;
      } catch (e) {
        console.error("ไม่สามารถคำนวณประสบการณ์ได้:", e);
      }
    }
    
    // แสดงข้อมูลที่กำลังส่งไปให้ ProfileCard
    console.log("Sending props to ProfileCard:", {
      followers: followersCount,
      reviewCount: reviewCount
    });
    
    return {
      profileImageUrl: seer.image || "",
      name: seer.display_name || "ไม่ระบุชื่อ",
      category: seer.primary_skill || "ไม่ระบุ",
      experience: experienceYears,
      followers: followersCount, // ใช้จำนวนผู้ติดตามที่ดึงมาจาก API โดยตรง
      rating: seer.rating || 0,
      reviewCount: reviewCount, // ใช้จำนวนรีวิวที่ดึงมาจาก API โดยตรง
      seerId: seer.id,
      description: seer.description || "",
      socialsName: seer.socials_name || "",
      socialsLink: seer.socials_link || ""
    };
  };

  // ข้อมูลที่จะใช้แสดงผล
  const profileProps = mapSeerToProfileProps(seerData);

  // กรณียังไม่มีข้อมูล
  if (loading) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
          <Navbar />
        </div>
        <div className="p-12 flex justify-center items-center w-full h-screen mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </>
    );
  }

  // กรณีเกิดข้อผิดพลาดและไม่มีข้อมูลสำรอง
  if (error && !seerData) {
    return (
      <>
        <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
          <Navbar />
        </div>
        <div className="p-12 flex flex-col justify-center items-center w-full h-screen mt-20">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            onClick={() => navigate(-1)}
          >
            กลับไปหน้าก่อนหน้า
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>
      
      {error && (
        <div className="px-12 pt-24 pb-0">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-md">
            <p>{error} - แสดงข้อมูลเบื้องต้นแทน</p>
          </div>
        </div>
      )}
      
      <div className="p-12 flex flex-col w-full gap-6 mt-20">
        {/* ส่วนบน: แบ่งซ้ายขวา */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ซ้าย: ProfileCard */}
          <div className="lg:w-1/2 w-full">
            <ProfileCard
              profileImageUrl={profileProps.profileImageUrl}
              name={profileProps.name}
              category={profileProps.category}
              experience={profileProps.experience}
              followers={profileProps.followers}
              rating={profileProps.rating}
              reviewCount={profileProps.reviewCount}
              seerId={profileProps.seerId}
              description={profileProps.description}
              socialsName={profileProps.socialsName}
              socialsLink={profileProps.socialsLink}
            />
            <ActionButtons seerId={profileProps.seerId} />
          </div>

          {/* ขวา: FullCalendarPage */}
          <div className="lg:w-1/2 w-full">
          <FullCalendarPage seerId={profileProps.seerId} />
          </div>
        </div>

        {/* ส่วนล่าง: เต็มจอ */}
        <div className="w-full space-y-4">
          <ProfileTabs seerId={profileProps.seerId} />
        </div>
      </div>
    </>
  );
};

export default QseerSchedulePage;