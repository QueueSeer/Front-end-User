import React from "react";
import Images from "../../assets"; // Import รูปจาก assets
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-start p-12">
      <button className="flex items-center text-gray-600 text-xl" onClick={() => navigate(-1)}>
        <img src={Images.back} alt="ย้อนกลับ" className="w-5 h-5 mr-2" />
        ย้อนกลับ
      </button>
    </div>
  );
};

export default BackButton;
