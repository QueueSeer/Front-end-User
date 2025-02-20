import React, { useState } from "react";
import BankFormpopup from "./Prompay/BankFormpopup";
import BackButton from "../Button/BackButton";
import AddButton from "./Social/AddButton";
import Images from "../../../assets"; // ตรวจสอบให้แน่ใจว่าไฟล์นี้มี PlusIcon

const PopupBank = ({ isOpen, onClose }) => {
  const [prompay, setPrompay] = useState([]); // เก็บข้อมูลบัญชีผู้ใช้
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [currentLinkData, setCurrentLinkData] = useState({ name: "", num: "" });
  const [popupTitle, setPopupTitle] = useState(""); // เก็บชื่อ popup

  const handleAddNewLink = () => {
    setCurrentLinkData({ name: "", num: "" }); // เคลียร์ข้อมูลฟอร์ม
    setPopupTitle("เพิ่มบัญชีพร้อมเพย์"); // ตั้งชื่อ popup
    setShowFormPopup(true); // เปิด popup
  };

  const handleEditLink = (name, num) => {
    setCurrentLinkData({ name, num }); // กรอกข้อมูลที่เลือกไปในฟอร์ม
    setPopupTitle("อัปเดตบัญชีพร้อมเพย์");
    setShowFormPopup(true);
  };

  const handleSaveLink = (newLink) => {
    // ตรวจสอบว่าเป็นการเพิ่มใหม่หรือแก้ไขข้อมูล
    if (currentLinkData.name) {
      // แก้ไขข้อมูล
      const updatedLinks = prompay.map((link) =>
        link.name === currentLinkData.name ? { ...link, ...newLink } : link
      );
      setPrompay(updatedLinks);
    } else {
      // เพิ่มบัญชีใหม่
      setPrompay((prevLinks) => [...prevLinks, newLink]);
    }
    setShowFormPopup(false); // ปิด popup หลังบันทึก
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white px-[50px] py-[30px] rounded-lg w-[550px] shadow-lg">
        {showFormPopup ? (
          <BankFormpopup
            isOpen={showFormPopup}
            onClose={() => setShowFormPopup(false)}
            onSave={handleSaveLink}
            name={currentLinkData.name}
            num={currentLinkData.num}
            title={popupTitle}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-[28px] font-semibold text-primary">
                บัญชีพร้อมเพย์
              </h2>
            </div>
            <ul className="mb-4">
              {prompay.length > 0 ? (
                prompay.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => handleEditLink(link.name, link.num)}
                    className="flex w-full border-b py-2 hover:bg-black/10"
                  >
                    {/* ส่วนของไอคอน */}
                    <div className="flex items-start space-x-4">
                      <img
                        src={Images.ThaiqrIcon} // เปลี่ยนเป็นรูปไอคอนที่เหมาะสม
                        alt="พร้อมเพย์"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex flex-col items-start">
                        {/* ส่วนของชื่อ */}
                        <p className="text-gray-800 font-medium">{link.name}</p>
                        {/* ส่วนของเบอร์พร้อมเพย์ */}
                        <p className="text-gray-500 text-sm">
                          พร้อมเพย์ {link.num}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-gray-500">ไม่มีข้อมูลบัญชี</p>
              )}
            </ul>

            {/* ซ่อน AddButton เมื่อมีบัญชีแล้ว */}
            {prompay.length === 0 && (
              <AddButton
                icon={Images.PlusIcon}
                label="เพิ่มบัญชี"
                onClick={handleAddNewLink}
              />
            )}
          </>
        )}
        {!showFormPopup && (
          <div className="flex justify-end mt-6">
            {prompay.length === 0 ? (
              <BackButton label="ย้อนกลับ" onClose={onClose} />
            ) : (
              <BackButton label="เสร็จสิ้น" onClose={onClose} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopupBank;
