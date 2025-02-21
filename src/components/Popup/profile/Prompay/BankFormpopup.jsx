import React, { useState } from "react";
import BackButton from "../../../Button/CloseButton";

const BankFormpopup = ({ isOpen, onClose, onSave, name, num, title }) => {
  const [formName, setFormName] = useState(name || "");
  const [formNumber, setFormNumber] = useState(num || "");
  const [isDefault, setIsDefault] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (formName.trim() && formNumber.trim()) {
      onSave({ name: formName, num: formNumber, isDefault }); // ส่งข้อมูลกลับไปยัง PopupBank
    } else {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white px-[50px] py-[30px] rounded-lg w-[550px] shadow-lg">
        <h2 className="text-[24px] font-semibold text-primary mb-4">{title}</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">ชื่อ</label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="กรอกชื่อบัญชีผู้รับ"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">พร้อมเพย์</label>
          <input
            type="text"
            value={formNumber}
            onChange={(e) => setFormNumber(e.target.value)}
            placeholder="กรอกพร้อมเพย์"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex justify-between">
          <BackButton label="ย้อนกลับ" onClose={onClose} />
          <button
            onClick={handleSave}
            className="w-[115px] bg-primary text-white py-2 border-2 border-primary rounded-full hover:bg-primary/90 hover:text-white"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankFormpopup;
