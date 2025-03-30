import React, { useState } from "react";
import PropTypes from "prop-types";
import images from "../../../assets";
import LogoutModal from "../../../components/Popup/LogoutModal";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // เพิ่ม import axios

const LogoutButton = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  // ฟังก์ชัน Logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true); // เริ่มกระบวนการออกจากระบบ
      
      // เรียกใช้ API logout
      await axios.delete("https://backend.qseer.app/api/access/logout", {
        withCredentials: true // สำคัญมากสำหรับการส่ง cookies
      });
      
      console.log("Logged out successfully");
      
      // ล้างข้อมูลการเข้าสู่ระบบใน localStorage (ถ้ามี)
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      
      // อาจจะต้องล้าง localStorage อื่นๆที่เกี่ยวข้องกับการล็อกอิน
      // เช่น ล้างข้อมูลสถานะรีวิวและข้อมูลอื่นๆ ทั้งหมด
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key.startsWith('review_state_') || key.includes('auth') || key.includes('user')) {
          localStorage.removeItem(key);
        }
      }
      
      // นำทางไปยังหน้า Login
      navigate("/Login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      
      // แม้จะเกิดข้อผิดพลาด ก็ยังพยายามนำทางไปหน้า login
      // เพื่อให้ผู้ใช้สามารถเข้าสู่ระบบใหม่ได้
      navigate("/Login", { replace: true });
    } finally {
      setIsLoggingOut(false); // สิ้นสุดกระบวนการออกจากระบบ
      setIsLogoutModalOpen(false); // ปิด modal
    }
  };

  return (
    <div>
      <li className="border-t border-gray-200 dark:border-gray-700">
        <button
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white cursor-pointer"
          onClick={() => setIsLogoutModalOpen(true)}
          disabled={isLoggingOut} // ปิดใช้งานปุ่มขณะกำลังออกจากระบบ
        >
          {/* ไอคอน */}
          <span className="mr-3 w-6 h-6">
            <img
              src={images.LogoutIcon}
              alt="Logout Icon"
            />
          </span>
          {/* ข้อความ */}
          ออกจากระบบ
        </button>
      </li>
      
      {/* ใช้ LogoutModal Component */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </div>
  );
};

LogoutButton.propTypes = {
  onLogout: PropTypes.func, // เป็น prop ที่อาจจะไม่ได้ใช้แล้ว แต่ยังคงไว้เพื่อความเข้ากันได้
};

export default LogoutButton;