import React from "react";
import { useNavigate } from "react-router-dom";
import NextButton from "../../components/bookingcomponent/NextButton";



const BookingSeer3 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4">💳 ยืนยันการจอง</h2>

      <div className="fixed bottom-4 right-4">
        <NextButton onClick={() => navigate("/bookingSeer4")} />
      </div>
    </div>
  );
};

export default BookingSeer3;
