import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NextButton from "../../components/bookingcomponent/NextButton";
import UserInfoForm from "../../components/bookingcomponent/step2/UserInfoForm";
import QuestionForm from "../../components/bookingcomponent/step2/QuestionForm";
import Payment from "../../components/bookingcomponent/step2/Payment"; 
import Navbar from "../../components/navbar";
import BookingSteps from "../../components/bookingcomponent/BookingSteps";
import BackButton from "../../components/bookingcomponent/BackButton";
import dayjs from "dayjs";

const BookingSeer2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug logging to check what state we're receiving
  console.log("BookingSeer2 received state:", location.state);
  
  // Safely extract data from location state
  const packageInfo = location.state?.packageInfo || null;
  const selectedDate = location.state?.selectedDate || null;
  const selectedTime = location.state?.selectedTime || null;
  const numQuestions = location.state?.numQuestions || 4;

  // State for user info
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [formValid, setFormValid] = useState(false);
  
  // State for form data
  const [questions, setQuestions] = useState(Array(numQuestions).fill(""));
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [useCoins, setUseCoins] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    birthTime: "",
    email: "",
    status: "",
    notifyByEmail: false
  });

  // Handle dayjs objects properly
  const getDayjsDate = (dateInput) => {
    if (!dateInput) return null;
    
    // If it's a dayjs object (check for $isDayjsObject property)
    if (dateInput.$isDayjsObject) {
      return new Date(dateInput.$d);
    }
    
    // If it's a Date object
    if (dateInput instanceof Date) {
      return dateInput;
    }
    
    // If it's an ISO string
    if (typeof dateInput === 'string') {
      return new Date(dateInput);
    }
    
    // If it has a $d property (serialized dayjs object)
    if (dateInput.$d) {
      return new Date(dateInput.$d);
    }
    
    return null;
  };

  // Extract date using our helper
  const parsedDate = getDayjsDate(selectedDate);
  
  // Log what we've parsed for debugging
  console.log("BookingSeer2 parsed date:", parsedDate);
  console.log("BookingSeer2 selectedTime:", selectedTime);

  // ดึงข้อมูลผู้ใช้จาก API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setUserInfoLoading(true);
        const response = await fetch('https://backend.qseer.app/api/user/me', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            // ถ้าต้องการส่ง Authorization token เพิ่มที่นี่
            // 'Authorization': `Bearer ${your_token_here}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch user info (${response.status})`);
        }
        
        const data = await response.json();
        setUserInfo(data);
        
        // กรอกข้อมูลผู้ใช้ลงในฟอร์มอัตโนมัติ
        setFormData(prev => ({
          ...prev,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          // อาจจะแปลง birthdate เป็นรูปแบบที่ต้องการถ้ามี
          birthDate: data.birthdate ? formatDate(new Date(data.birthdate)) : "",
          notifyByEmail: true
        }));
        
        setUserInfoLoading(false);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfoLoading(false);
      }
    };
    
    fetchUserInfo();
  }, []);

  // ฟังก์ชันแปลงวันที่เป็นรูปแบบ DD/MM/YY
  const formatDate = (date) => {
    if (!date || !(date instanceof Date)) return "";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };
  
  const handleFormDataChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // คำนวณราคาสุทธิและตรวจสอบว่าฟอร์มถูกต้องหรือไม่
  const calculateFinalPrice = () => {
    const totalPrice = packageInfo?.price || 0;
    const discount = useCoins && paymentMethod === "promptpay" ? Math.min(userInfo?.coins || 0, totalPrice) : 0;
    return totalPrice - discount;
  };

  const finalPrice = calculateFinalPrice();
  
  // ตรวจสอบความสมบูรณ์ของฟอร์ม
  const isFormValid = () => {
    return formValid && questions.every(q => q.trim() !== "") && paymentMethod;
  };

  // ฟังก์ชันสำหรับการชำระเงิน
  const handlePayment = () => {
    if (!isFormValid()) return;
    
    // รวบรวมข้อมูลการจอง
    const bookingData = {
      bookingId: `BK-${Math.floor(Math.random() * 1000000)}`,
      packageInfo,
      fortuneTeller: packageInfo?.fortuneTellerName || "หมอดู",
      userInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        status: formData.status
      },
      selectedDate: parsedDate,
      selectedTime,
      paymentMethod,
      useCoins,
      finalPrice,
      questions,
      notification: formData.notifyByEmail
    };
    
    // นำทางไปยังหน้าที่เหมาะสมตามราคา
    if (finalPrice === 0) {
      // ถ้าราคาเป็น 0 ไปที่หน้า BookingSeer4 (การจองสำเร็จ)
      navigate("/bookingSeer4", { state: bookingData });
    } else {
      // ถ้าราคามากกว่า 0 ไปที่หน้า BookingSeer3 (ชำระเงิน)
      navigate("/bookingSeer3", { state: bookingData });
    }
  };

  // เปลี่ยนสถานะการตรวจสอบฟอร์ม
  const handleValidationChange = (isValid) => {
    setFormValid(isValid);
  };

  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
      
          
          {/* ส่วนของฟอร์มข้อมูลผู้ใช้ */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">ข้อมูลผู้จอง</h3>
            <UserInfoForm 
              formData={formData} 
              setFormData={handleFormDataChange}
              loading={userInfoLoading}
              onValidationChange={handleValidationChange}
              requiredData={packageInfo?.requiredData || []}
            />
          </div>
          
          {/* ส่วนของคำถามสำหรับการดูดวง */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold">คำถามสำหรับการดูดวง</h3>
            <QuestionForm 
              numQuestions={numQuestions} 
              questions={questions} 
              onChange={handleQuestionChange} 
            />
          </div>

          {/* ส่วนของการชำระเงิน */}
          <div className="w-full mt-8">
            <Payment 
              packageInfo={packageInfo} 
              selectedDate={parsedDate} 
              selectedTime={selectedTime}
              paymentMethod={paymentMethod} 
              setPaymentMethod={setPaymentMethod} 
              useCoins={useCoins} 
              setUseCoins={setUseCoins} 
              userCoins={userInfo?.coins || 0} 
            />
          </div>
        </div>
      </div>

      {/* NextButton: กดได้ก็ต่อเมื่อฟอร์มถูกต้อง */}
      <div className="fixed bottom-4 right-4">
        <NextButton 
          onClick={handlePayment} 
          disabled={!isFormValid()}
        />
      </div>
    </>
  );
};

export default BookingSeer2;