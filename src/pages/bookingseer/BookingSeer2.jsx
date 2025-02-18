import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NextButton from "../../components/bookingcomponent/NextButton";
import UserInfoForm from "../../components/bookingcomponent/step2/UserInfoForm";
import QuestionForm from "../../components/bookingcomponent/step2/QuestionForm";
import Payment from "../../components/bookingcomponent/step2/Payment"; 

const BookingSeer2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const packageInfo = location.state?.packageInfo;
  const selectedDate = location.state?.selectedDate;
  const numQuestions = location.state?.numQuestions || 4;

  const [questions, setQuestions] = useState(Array(numQuestions).fill(""));
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [useCoins, setUseCoins] = useState(false); // ✅ เพิ่ม State ของโชคคอยน์

  useEffect(() => {
    window.scrollTo(0, 0); // เลื่อนหน้าขึ้นไปด้านบนสุดเมื่อโหลดคอมโพเนนต์
  }, []);

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const isFormValid = questions.every(q => q.trim() !== "") && paymentMethod;

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <UserInfoForm />
        <div className="mt-6">
          <h3 className="text-lg font-semibold">คำถามสำหรับการดูดวง</h3>
          <QuestionForm numQuestions={numQuestions} questions={questions} onChange={handleQuestionChange} />
        </div>
      </div>

      {/* ✅ ใช้คอมโพเนนต์ Payment */}
      <div className="w-full max-w-4xl mt-8">
        <Payment 
          packageInfo={packageInfo} 
          selectedDate={selectedDate} 
          paymentMethod={paymentMethod} 
          setPaymentMethod={setPaymentMethod} 
          useCoins={useCoins} 
          setUseCoins={setUseCoins} 
        />
      </div>

      <div className="fixed bottom-4 right-4">
        <NextButton 
          onClick={() => navigate("/bookingSeer3", { state: { packageInfo, selectedDate, questions, paymentMethod, useCoins } })} 
          disabled={!isFormValid} 
        />
      </div>
    </div>
  );
};

export default BookingSeer2;
