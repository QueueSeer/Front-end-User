import { useEffect, useState } from "react";

import Navbar from "../../components/navbar";
import Payment from "../../components/bookingcomponent/step2/Payment";
import QuestionForm from "../../components/bookingcomponent/step2/QuestionForm";
import UserInfoForm from "../../components/bookingcomponent/step2/UserInfoForm";
import { useLocation } from "react-router-dom";

const BookingSeer_2 = () => {
  const location = useLocation();

  const [packageInfo, setPackageInfo] = useState(null);
  
  const [userInfo, setUserInfo] = useState({});
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [formValid, setFormValid] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    birthTime: "",
    email: "",
    status: "",
    notifyByEmail: false,
  });
  
  const [questions, setQuestions] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [useCoins, setUseCoins] = useState(false);

  const selectedDate = location.state?.selectedDate
  const selectedTime = location.state?.selectedTime

  
  const formatDate = (date) => {
    if (!date || !(date instanceof Date)) return "";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };
  
  const getDayjsDate = (dateInput) => {
    if (!dateInput) return null;
    if (dateInput.$isDayjsObject) {
      return new Date(dateInput.$d);
    }
    return null;
  };
  
  const handleFormDataChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePayment = () => {
    
  }

  useEffect(()=>{
    const fetchUserData = async() => {
      const token = localStorage.getItem('token');
      await fetch('https://backend.qseer.app/api/user/me', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        },
        credentials: 'include'
      })
      .then((res)=>res.json())
      .then((res)=>{
        setFormData({
          firstName: res.first_name || "",
          lastName: res.last_name || "",
          email: res.email || "",
          birthDate: res.birthdate ? formatDate(new Date(data.birthdate)) : "",
          birthTime: "",
          status: "",
          notifyByEmail: true
        });
      })
      .then((res)=>setUserInfo(res))
      .finally(()=>setUserInfoLoading(false));
    }
    fetchUserData()
  }, []);

  useEffect(()=>{
    const packageInfoLocation = location.state?.packageInfo;
    setPackageInfo(packageInfoLocation);
    const numQuestions = packageInfoLocation.question_limit || 0;
    setQuestions(numQuestions < 1 || numQuestions > 6 ? [""] : Array(numQuestions).fill(""))
  },[]);

  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
           <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">ข้อมูลผู้จอง</h3>
            <UserInfoForm
              formData={formData}
              setFormData={handleFormDataChange}
              loading={userInfoLoading}
              onValidationChange={(isValid)=>setFormValid(isValid)}
              requiredData={packageInfo?.requiredData}
            />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">คำถามสำหรับการดูดวง</h3>
            <QuestionForm
              numQuestions={packageInfo?.question_limit ?? 4}
              questions={questions}
              onChange={(index, value) => {
                const tmp = questions;
                tmp[index] = value;
                setQuestions(tmp);
              }}
            />
          </div>
          
          <div className="w-full mt-8">
            <Payment
              packageInfo={packageInfo}
              selectedDate={getDayjsDate(selectedDate)}
              selectedTime={selectedTime}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              useCoins={useCoins}
              setUseCoins={setUseCoins}
              userCoins={userInfo?.coins || 0}
              onPayment={handlePayment} // ส่งฟังก์ชัน handlePayment ไปให้ Payment
              isLoading={isPaymentLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingSeer_2;
