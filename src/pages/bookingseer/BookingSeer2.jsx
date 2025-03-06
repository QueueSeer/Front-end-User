import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NextButton from "../../components/bookingcomponent/NextButton";
import UserInfoForm from "../../components/bookingcomponent/step2/UserInfoForm";
import QuestionForm from "../../components/bookingcomponent/step2/QuestionForm";
import Payment from "../../components/bookingcomponent/step2/Payment"; 
import Navbar from "../../components/navbar";



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

  // State for seer (fortune teller) info
  const [seerInfo, setSeerInfo] = useState(null);
  const [seerLoading, setSeerLoading] = useState(true);

  // State for user info
  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
    coins: 0
  });
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

  // ฟังก์ชันสำหรับดึง token จาก cookie
  const getTokenFromCookie = () => {
    // แยกคุกกี้ทั้งหมดจาก document.cookie
    const cookies = document.cookie.split(';');
    
    // วนลูปหา cookie ที่ชื่อ "token"
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'token') {
        return value;
      }
    }
    
    // ถ้าไม่พบ token ใน cookie
    return null;
  };

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

  // ปรับปรุงข้อมูล packageInfo ถ้ามีชื่อที่ไม่ตรงกัน
  useEffect(() => {
    if (packageInfo) {
      // ถ้ามี title แต่ไม่มี name ให้เพิ่ม name
      if (packageInfo.title && !packageInfo.name) {
        packageInfo.name = packageInfo.title;
      }
      
      // ถ้ามี seer แต่ไม่มี fortuneTellerName ให้เพิ่ม fortuneTellerName
      if (packageInfo.seer && !packageInfo.fortuneTellerName) {
        packageInfo.fortuneTellerName = packageInfo.seer;
      }
      
      // ถ้าไม่มี fortuneTellerId แต่มี id ให้ใช้ id
      if (!packageInfo.fortuneTellerId && packageInfo.id) {
        packageInfo.fortuneTellerId = packageInfo.id;
      }
    }
  }, [packageInfo]);

  // ดึงข้อมูลหมอดูตาม package ที่เลือก
  useEffect(() => {
    const fetchSeerInfo = async () => {
      if (!packageInfo || !packageInfo.fortuneTellerId) {
        setSeerLoading(false);
        return;
      }

      try {
        setSeerLoading(true);
        // ดึง token จาก cookie
        const token = getTokenFromCookie();
        
        // เรียก API เพื่อดึงข้อมูลหมอดู
        const response = await fetch(`https://backend.qseer.app/api/seer/${packageInfo.fortuneTellerId}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        
        if (!response.ok) {
          // ถ้าไม่สามารถดึงข้อมูลหมอดูได้ ให้ใช้ข้อมูลจาก packageInfo 
          console.warn(`ไม่สามารถดึงข้อมูลหมอดูได้ (${response.status}), ใช้ข้อมูลจาก packageInfo แทน`);
          setSeerInfo({
            name: packageInfo.fortuneTellerName || packageInfo.seer || "หมอดู"
          });
          setSeerLoading(false);
          return;
        }
        
        const data = await response.json();
        setSeerInfo(data);
        setSeerLoading(false);
      } catch (error) {
        console.error("Error fetching seer info:", error);
        // เมื่อเกิดข้อผิดพลาด ใช้ข้อมูลจาก packageInfo แทน
        setSeerInfo({
          name: packageInfo.fortuneTellerName || packageInfo.seer || "หมอดู"
        });
        setSeerLoading(false);
      }
    };
    
    fetchSeerInfo();
  }, [packageInfo]);

  // ดึงข้อมูลผู้ใช้จาก API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setUserInfoLoading(true);
        // ดึง token จาก cookie
        const token = getTokenFromCookie();
        
        // ถ้าไม่มี token ให้ใช้ข้อมูลเริ่มต้น
        if (!token) {
          console.warn("ไม่พบ token ใน cookie, ใช้ข้อมูลเริ่มต้น");
          setUserInfo({
            first_name: "",
            last_name: "",
            email: "",
            coins: 0
          });
          setUserInfoLoading(false);
          return;
        }
        
        console.log("Using token from cookie:", token.substring(0, 10) + "...");
        
        const response = await fetch('https://backend.qseer.app/api/user/me', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`ไม่สามารถดึงข้อมูลผู้ใช้ได้ (${response.status})`);
        }
        
        const data = await response.json();
        console.log("User data received:", data);
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
        // เมื่อเกิดข้อผิดพลาด ใช้ข้อมูลเริ่มต้น
        setUserInfo({
          first_name: "",
          last_name: "",
          email: "",
          coins: 0
        });
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
  const handlePayment = async () => {
    if (!isFormValid()) return;
    
    try {
      // แปลงวันที่และเวลาให้เป็นรูปแบบเวลาเริ่มต้นที่ถูกต้อง
      const startDate = new Date(parsedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      startDate.setHours(hours, minutes, 0);
      
      // เตรียมข้อมูลสำหรับส่งไป API
      const appointmentData = {
        seer_id: packageInfo.fortuneTellerId || 0,
        package_id: packageInfo.id || 0,
        start_time: startDate.toISOString(),
        questions: questions.filter(q => q.trim() !== "")
      };
      
      console.log("Sending appointment data:", appointmentData);
      
      // ดึง token จาก cookie
      const token = getTokenFromCookie();
      
      // เรียก API เพื่อสร้างการนัดหมาย (ถ้ามี token)
      if (token) {
        console.log("Using token for appointment API");
        const response = await fetch('https://backend.qseer.app/api/appointment/seer', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(appointmentData)
        });
        
        if (!response.ok) {
          throw new Error(`สร้างการนัดหมายไม่สำเร็จ (${response.status})`);
        }
        
        // แปลงข้อมูลตอบกลับจาก API
        const bookingResponse = await response.json();
        console.log("Booking API response:", bookingResponse);
        
        // เก็บรหัสการจองและข้อมูลอื่นๆ สำหรับขั้นตอนถัดไป
        const bookingData = {
          ...bookingResponse,
          packageInfo: {
            ...packageInfo,
            name: packageInfo.name || packageInfo.title || "แพ็กเกจที่เลือก"
          },
          fortuneTeller: seerInfo?.name || packageInfo?.fortuneTellerName || packageInfo?.seer || "หมอดู",
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
        
        console.log("Booking data sent to next page:", bookingData);
        
        // นำทางไปหน้าถัดไปตามจำนวนเงิน
        if (finalPrice === 0) {
          // ถ้าฟรี (หรือใช้เหรียญจ่ายเต็มจำนวน) ไปที่หน้ายืนยันเลย
          navigate("/bookingSeer4", { state: bookingData });
        } else {
          // ถ้าต้องจ่ายเงิน ไปที่หน้าชำระเงิน
          navigate("/bookingSeer3", { state: bookingData });
        }
      } else {
        // ถ้าไม่มี token ให้สร้าง mock data สำหรับการสาธิต
        throw new Error("ไม่พบ token สำหรับการเรียก API");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการสร้างการนัดหมาย:", error);
      
      // สร้าง mockup response ถ้าเรียก API ไม่สำเร็จ (สำหรับ demo)
      const mockBookingId = `BK-${Math.floor(Math.random() * 1000000)}`;
      
      // เก็บรหัสการจองและข้อมูลอื่นๆ สำหรับขั้นตอนถัดไป
      const bookingData = {
        id: mockBookingId,
        packageInfo: {
          ...packageInfo,
          name: packageInfo.name || packageInfo.title || "แพ็กเกจที่เลือก"
        },
        fortuneTeller: seerInfo?.name || packageInfo?.fortuneTellerName || packageInfo?.seer || "หมอดู",
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
      
      console.log("Mock booking data sent to next page:", bookingData);
      
      // นำทางไปหน้าถัดไปตามจำนวนเงิน
      if (finalPrice === 0) {
        navigate("/bookingSeer4", { state: bookingData });
      } else {
        navigate("/bookingSeer3", { state: bookingData });
      }
      
      // แสดงข้อผิดพลาดให้ผู้ใช้
      alert(`ใช้ข้อมูลจำลองสำหรับการสาธิต: ${error.message}`);
    }
  };

  // เปลี่ยนสถานะการตรวจสอบฟอร์ม
  const handleValidationChange = (isValid) => {
    setFormValid(isValid);
  };

  // รวบรวมชื่อหมอดูที่ถูกต้อง
  const getFortuneteller = () => {
    return seerLoading ? "กำลังโหลด..." : (seerInfo?.name || packageInfo?.fortuneTellerName || packageInfo?.seer || "หมอดู");
  };

  // รวบรวมชื่อแพ็กเกจที่ถูกต้อง
  const getPackageName = () => {
    return packageInfo?.name || packageInfo?.title || "แพ็กเกจดูดวง";
  };

  return (
    <>
      {/* Navbar ตรึงด้านบน */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <Navbar />
      </div>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">

          
          {/* แสดงข้อมูลแพ็กเกจที่เลือก */}
          <div className="mt-6 p-4 bg-[#F9F8FC] rounded-lg">
            <h2 className="text-xl font-semibold">
              {getPackageName()}
            </h2>
            <p className="text-gray-600">
              หมอดู: {getFortuneteller()}
            </p>
            <p className="text-gray-600">
              วันที่: {parsedDate ? parsedDate.toLocaleDateString('th-TH') : ""}
            </p>
            <p className="text-gray-600">
              เวลา: {selectedTime || ""}
            </p>
          </div>
          
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