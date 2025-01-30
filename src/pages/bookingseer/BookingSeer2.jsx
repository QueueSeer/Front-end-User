import React from "react";
import { useNavigate } from "react-router-dom";
import NextButton from "../../components/bookingcomponent/NextButton";

const BookingSeer2 = () => {
  const navigate = useNavigate();

  return (

    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">📝 กรอกข้อมูล</h2>
      <form>
        {/* เพิ่มฟอร์มสำหรับใส่ข้อมูล */}
      </form>

      <div className="fixed bottom-4 right-4">
        <NextButton onClick={() => navigate("/bookingSeer3")} />
      </div>
    </div>
  );
};

export default BookingSeer2;
