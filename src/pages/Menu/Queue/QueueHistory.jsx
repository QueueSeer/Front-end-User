import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";
import QueueCard from "../../../components/QueueCard/QueueCard";
import Images from "../../../assets";
import Navbar from "../../../components/navbar";
import Layout from "./Layout";
import axios from "axios";

const QueueHistoryPage = () => {
  const navigate = useNavigate();
  // State สำหรับ Tab ที่เลือก
  const [activeTab, setActiveTab] = useState("รอเข้ารับบริการ");
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState({
    รอเข้ารับบริการ: [],
    เข้ารับบริการสำเร็จ: [],
    บริการที่ยกเลิก: [],
  });
  // ข้อมูลรีวิวสถานะ
  const [reviewedAppointments, setReviewedAppointments] = useState(new Set());

  // สร้างฟังก์ชันสำหรับแปลงสถานะจาก API เป็นสถานะไทย
  const mapStatusToTab = (status) => {
    switch (status) {
      case "pending":
        return "รอเข้ารับบริการ";
      case "completed":
        return "เข้ารับบริการสำเร็จ";
      case "u_cancelled":
      case "s_cancelled":
        return "บริการที่ยกเลิก";
      default:
        return "รอเข้ารับบริการ";
    }
  };

  // แปลงสถานะภาษาไทยเป็นสถานะใน API
  const mapTabToStatus = (tab) => {
    switch (tab) {
      case "รอเข้ารับบริการ":
        return "pending";
      case "เข้ารับบริการสำเร็จ":
        return "completed";
      case "บริการที่ยกเลิก":
        return "u_cancelled"; // เปลี่ยนเป็น status เดียวเพื่อความปลอดภัย
      default:
        return "pending";
    }
  };

  // ฟังก์ชันสำหรับการแปลงวันที่จาก ISO เป็นรูปแบบภาษาไทย
  const formatThaiDate = (isoDateString) => {
    if (!isoDateString) return "";
    
    const date = new Date(isoDateString);
    const thaiDays = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const thaiMonths = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
    ];
    
    const day = thaiDays[date.getDay()];
    const dayNumber = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
    
    return `${day} ${dayNumber} ${month} ${year}`;
  };

  // ฟังก์ชันสำหรับการแปลงเวลาจาก ISO เป็นรูปแบบไทย
  const formatThaiTime = (isoDateString) => {
    if (!isoDateString) return "";
    
    const date = new Date(isoDateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}.${minutes} น.`;
  };

  // เพิ่มฟังก์ชันสำหรับการนำทางไปหน้า QueueDetails
  const navigateToDetails = (apmt_id) => {
    // ใช้ apmt_id ในการนำทางไปยังหน้า QueueDetails
    navigate(`/queuedetails/${apmt_id}`);
  };

  // ดึงข้อมูลการนัดหมายจาก API
  const fetchAppointments = async (tab) => {
    try {
      setIsLoading(true);
      
      // ถ้าเป็นแท็บ "บริการที่ยกเลิก" ให้ดึงข้อมูลทั้งสองสถานะแยกกัน
      if (tab === "บริการที่ยกเลิก") {
        // ดึงข้อมูลสถานะ "u_cancelled" (ผู้ใช้ยกเลิก)
        const responseUser = await axios.get('https://backend.qseer.app/api/appointment/sent', {
          params: {
            limit: 10,
            status: "u_cancelled",
            direction: 'desc'
          },
          withCredentials: true
        });
        
        // ดึงข้อมูลสถานะ "s_cancelled" (หมอดูยกเลิก)
        const responseSeer = await axios.get('https://backend.qseer.app/api/appointment/sent', {
          params: {
            limit: 10,
            status: "s_cancelled",
            direction: 'desc'
          },
          withCredentials: true
        });
        
        // รวมข้อมูลจากทั้งสองคำขอ
        const combinedData = [...responseUser.data, ...responseSeer.data];
        console.log(`Fetched cancelled appointments:`, combinedData);
        
        // แปลงข้อมูลจาก API เป็นรูปแบบที่ QueueCard ต้องการ
        const formattedAppointments = combinedData.map(appointment => ({
          id: appointment.id,
          image: "/images/tarot.jpg", // ถ้า API ไม่มีรูปให้ใช้รูปเริ่มต้น
          title: appointment.package?.name || "ไม่ระบุรายการ",
          categories: appointment.package?.category || "ไม่ระบุประเภท",
          fortuneTeller: appointment.seer?.display_name || "ไม่ระบุหมอดู",
          date: formatThaiDate(appointment.start_time),
          time: formatThaiTime(appointment.start_time),
          status: mapStatusToTab(appointment.status),
          confirmation_code: appointment.confirmation_code,
          // เพิ่มข้อมูลอื่นๆ ที่อาจต้องใช้
          raw_data: appointment
        }));
        
        // อัพเดทข้อมูลสำหรับแท็บยกเลิก
        setAppointments(prev => ({
          ...prev,
          [tab]: formattedAppointments
        }));
      } else {
        // สำหรับแท็บอื่นๆ ใช้การเรียก API แบบปกติ
        const status = mapTabToStatus(tab);
        
        const response = await axios.get('https://backend.qseer.app/api/appointment/sent', {
          params: {
            limit: 20,
            status: status,
            direction: 'desc'
          },
          withCredentials: true
        });
        
        const data = response.data;
        console.log(`Fetched appointments for ${tab}:`, data);
        
        // แปลงข้อมูลจาก API เป็นรูปแบบที่ QueueCard ต้องการ
        const formattedAppointments = data.map(appointment => ({
          id: appointment.id,
          image: "/images/tarot.jpg", // ถ้า API ไม่มีรูปให้ใช้รูปเริ่มต้น
          title: appointment.package?.name || "ไม่ระบุรายการ",
          categories: appointment.package?.category || "ไม่ระบุประเภท",
          fortuneTeller: appointment.seer?.display_name || "ไม่ระบุหมอดู",
          date: formatThaiDate(appointment.start_time),
          time: formatThaiTime(appointment.start_time),
          status: mapStatusToTab(appointment.status),
          confirmation_code: appointment.confirmation_code,
          // เพิ่มข้อมูลอื่นๆ ที่อาจต้องใช้
          raw_data: appointment
        }));
        
        if (tab === "เข้ารับบริการสำเร็จ") {
          // จัดเรียงข้อมูลสำหรับแท็บ "เข้ารับบริการสำเร็จ" โดยให้รายการที่รีวิวแล้วอยู่ด้านล่าง
          const sortedAppointments = formattedAppointments.sort((a, b) => {
            const aReviewed = reviewedAppointments.has(a.id) || a.raw_data?.has_reviewed;
            const bReviewed = reviewedAppointments.has(b.id) || b.raw_data?.has_reviewed;
            
            if (aReviewed && !bReviewed) return 1; // a ไปอยู่ล่าง
            if (!aReviewed && bReviewed) return -1; // b ไปอยู่ล่าง
            return 0; // เรียงตามเดิม
          });
          
          // อัพเดทข้อมูลตาม tab ที่เลือก
          setAppointments(prev => ({
            ...prev,
            [tab]: sortedAppointments
          }));
        } else {
          // อัพเดทข้อมูลตาม tab ที่เลือก
          setAppointments(prev => ({
            ...prev,
            [tab]: formattedAppointments
          }));
        }
      }
    } catch (error) {
      console.error(`Error fetching appointments for ${tab}:`, error);
      
      // ถ้าเกิดข้อผิดพลาด 401 อาจต้องการให้ผู้ใช้เข้าสู่ระบบใหม่
      if (error.response && error.response.status === 401) {
        alert("กรุณาเข้าสู่ระบบใหม่เพื่อดูรายการนัดหมาย");
        // อาจมีการ redirect ไปหน้า login ที่นี่
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ดึงข้อมูลครั้งแรกเมื่อโหลดหน้า
  useEffect(() => {
    // ดึงข้อมูลสถานะรีวิวจาก localStorage
    const loadReviewedStatus = () => {
      const reviewedSet = new Set();
      // ตรวจสอบ localStorage ทั้งหมดที่เกี่ยวกับสถานะการรีวิว
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('review_state_')) {
          const value = localStorage.getItem(key);
          if (value === 'true') {
            const appointmentId = key.replace('review_state_', '');
            reviewedSet.add(parseInt(appointmentId));
          }
        }
      }
      setReviewedAppointments(reviewedSet);
    };
    
    loadReviewedStatus();
    fetchAppointments("รอเข้ารับบริการ");
    fetchAppointments("เข้ารับบริการสำเร็จ");
    fetchAppointments("บริการที่ยกเลิก");
  }, []);

  // จัดการการเปลี่ยนแปลงสถานะการรีวิว
  const handleReviewStatusChange = (appointmentId, isReviewed) => {
    setReviewedAppointments(prev => {
      const newSet = new Set(prev);
      if (isReviewed) {
        newSet.add(appointmentId);
      } else {
        newSet.delete(appointmentId);
      }
      return newSet;
    });
  };

  // จัดการการย้ายรายการที่รีวิวแล้วไปด้านล่าง
  const handleMoveToBottom = (appointmentId) => {
    if (activeTab === "เข้ารับบริการสำเร็จ") {
      setAppointments(prev => {
        const tab = "เข้ารับบริการสำเร็จ";
        const appointments = [...prev[tab]];
        
        // ย้ายรายการที่มี id ตรงกับ appointmentId ไปตำแหน่งสุดท้าย
        const index = appointments.findIndex(app => app.id === appointmentId);
        if (index !== -1) {
          const [appointment] = appointments.splice(index, 1);
          appointments.push(appointment);
        }
        
        return {
          ...prev,
          [tab]: appointments
        };
      });
    }
  };

  return (
    <Layout>
      {/* Tab Selection */}
      <div className="flex justify-center gap-4 my-6">
        {["รอเข้ารับบริการ", "เข้ารับบริการสำเร็จ", "บริการที่ยกเลิก"].map(
          (tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                activeTab === tab
                  ? "bg-[#420F75] text-white"
                  : "border border-gray-400 text-gray-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#420F75]"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && appointments[activeTab].length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">ไม่พบรายการนัดหมาย</p>
        </div>
      )}

      {/* Queue List */}
      {!isLoading && appointments[activeTab].map((item, index) => (
        <div key={index} onClick={() => navigateToDetails(item.id)}>
          <QueueCard 
            {...item} 
            status={activeTab} 
            onReviewStatusChange={handleReviewStatusChange}
            onMoveToBottom={handleMoveToBottom}
          />
        </div>
      ))}
    </Layout>
  );
};

export default QueueHistoryPage;