import React, { useState } from "react";
import AboutUserProfile from "../../../components/Profile/AboutUserProfile";
import PopupAboutme from "../../../components/Popup/profile/PopupAboutme";

const AboutUser = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // สถานะเปิด/ปิด Popup
  const [textarea, setTextarea] = useState(""); // ข้อความที่จะแก้ไขใน Popup
  const [aboutMe, setAboutMe] = useState(""); // เก็บข้อความที่บันทึกแล้ว

  // ฟังก์ชันสำหรับแสดง/ซ่อน Popup
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  // ฟังก์ชันบันทึกข้อความ
  const handleSave = (updatedText) => {
    setAboutMe(updatedText); // อัปเดตข้อความที่บันทึก
  };

  return (
    <div>
      {/* Section คำอธิบายเกี่ยวกับฉัน */}
      <div>
        <h2 className="text-xl text-gray-800 font-semibold mb-4">
          คำอธิบายเกี่ยวกับฉัน
        </h2>
        <AboutUserProfile>
          {(description) => (
            <button
              onClick={() => {
                togglePopup(); // เปิด Popup
                setTextarea(aboutMe || description); // ตั้งข้อความที่จะแสดงใน Popup
              }}
              className="border-2 px-[30px] pt-[20px] pb-[30px] rounded-[5px] text-left"
            >
              <div>{aboutMe || description}</div> {/* แสดงข้อความล่าสุด */}
            </button>
          )}
        </AboutUserProfile>
      </div>

      {/* Popup แสดงข้อความ */}
      <PopupAboutme
        isOpen={isPopupOpen} // ส่งสถานะเปิด/ปิด
        onClose={togglePopup} // ส่งฟังก์ชันปิด Popup
        textarea={textarea} // ส่งข้อความใน Popup
        setTextarea={setTextarea} // ส่งฟังก์ชันแก้ไขข้อความ
        onSave={handleSave} // ส่งฟังก์ชันบันทึกข้อความ
      />
    </div>
  );
};

export default AboutUser;
