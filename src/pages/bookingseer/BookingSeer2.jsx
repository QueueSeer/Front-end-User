import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar";
import Payment from "../../components/bookingcomponent/step2/Payment";
import QuestionForm from "../../components/bookingcomponent/step2/QuestionForm";
import UserInfoForm from "../../components/bookingcomponent/step2/UserInfoForm";

const BookingSeer2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [packageInfo, setPackageInfo] = useState(null); 
  
  // Safely extract data from location state
  //const packageInfo = location.state?.packageInfo;
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

  const getTokenFromCookie = () => {
    try {
      // วิธีที่ 1: ดึงโดยใช้ RegExp
      const cookieString = document.cookie;
      const match = cookieString.match(new RegExp('(^| )token=([^;]+)'));
      if (match) {
        return match[2];
      }
      
      // วิธีที่ 2: แยก cookies และหา token
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('token=')) {
          const token = cookie.substring('token='.length);
          return token;
        }
      }
      
      // วิธีที่ 3: ดึงจาก localStorage หรือ sessionStorage
      const localToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
      if (localToken) {
        return localToken;
      }
      
      const sessionToken = sessionStorage.getItem('token') || sessionStorage.getItem('auth_token');
      if (sessionToken) {
        return sessionToken;
      }
      
      // ถ้าไม่เจอ token
      console.warn("❌ Token not found in any storage");
      return null;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
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
            name: packageInfo.fortuneTellerName || packageInfo.seer || ""
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
          name: packageInfo.fortuneTellerName || packageInfo.seer || ""
        });
        setSeerLoading(false);
      }
    };
    
    fetchSeerInfo();
  }, [packageInfo]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setUserInfoLoading(true);
        
        // รวมทุกวิธีในการดึง token
        let token;
        
        // วิธีที่ 1: ดึงจาก localStorage
        token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        
        // วิธีที่ 2: ดึงจาก sessionStorage
        if (!token) {
          token = sessionStorage.getItem('token') || sessionStorage.getItem('auth_token');
        }
        
        // วิธีที่ 3: ดึงจาก cookie (วิธีที่แปลงให้ง่ายขึ้น)
        if (!token) {
          const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
          token = match ? match[1] : null;
        }
        
        if (!token) {
          console.warn("ไม่พบ token ไม่ว่าจะที่ใด");
          setUserInfo({
            first_name: "",
            last_name: "",
            email: "",
            coins: 0
          });
          setUserInfoLoading(false);
          return;
        }
        
        // เรียกใช้ API เพื่อดึงข้อมูลผู้ใช้
        const response = await fetch('https://backend.qseer.app/api/user/me', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          },
          credentials: 'include'  // สำคัญ! ส่ง cookies ไปกับ request
        });
        
        if (!response.ok) {
          throw new Error(`ไม่สามารถดึงข้อมูลผู้ใช้ได้ (${response.status})`);
        }
        
        const data = await response.json();
        
        // บันทึกข้อมูลผู้ใช้ลง state
        setUserInfo(data);
        
        // สร้างข้อมูลที่จะกรอกลงในฟอร์ม
        const userFormData = {
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || "",
          birthDate: data.birthdate ? formatDate(new Date(data.birthdate)) : "",
          birthTime: "",  // ถ้า API ไม่มี birthtime อาจต้องกรอกเอง
          status: "",     // ถ้า API ไม่มี status อาจต้องกรอกเอง
          notifyByEmail: true
        };
        
        // อัพเดต form data
        setFormData(userFormData);
        
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo({
          first_name: "",
          last_name: "",
          email: "",
          coins: 0
        });
      } finally {
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
    const result = Math.max(0, totalPrice - discount); // ใช้ Math.max เพื่อป้องกันค่าติดลบ
    return result;
  };

  const finalPrice = calculateFinalPrice();
  
// ตรวจสอบความสมบูรณ์ของฟอร์ม
const isFormValid = () => {
  if (!formValid) {
    console.log("formValid ยังเป็น false");
    return false;
  }

  if (!questions.every(q => q.trim() !== "")) {
    console.log("มีคำถามที่ยังไม่ได้กรอก");
    return false;
  }

  if (!paymentMethod) {
    console.log("ยังไม่ได้เลือกวิธีชำระเงิน");
    return false;
  }
  return true;
};
// ฟังก์ชันสำหรับการชำระเงิน
const handlePayment = async () => {
  if (!isFormValid()) {
    alert("กรุณากรอกข้อมูลและเลือกวิธีการชำระเงินให้ครบถ้วน");
    return;
  }

  // ตั้งค่าสถานะโหลดเป็น true
  setIsLoading(true);

  try {
    // แปลงวันที่และเวลาให้เป็นรูปแบบเวลาเริ่มต้นที่ถูกต้อง
    const startDate = new Date(parsedDate);
    const [hours, minutes] = selectedTime.split(':').map(Number);
    startDate.setHours(hours, minutes, 0);
    
    
    // เตรียมข้อมูลสำหรับส่งไป API
    const appointmentData = {
      seer_id: packageInfo.fortuneTellerId,
      package_id: packageInfo.id,
      start_time: startDate.toISOString(),
      questions: questions.filter(q => q.trim() !== "")
    };
    console.log("Sending appointment data:", appointmentData);
    
    // ดึง token จาก cookie
    const token = getTokenFromCookie();
    
    // ข้อมูลที่จะส่งไปยังหน้าถัดไป (เตรียมไว้ก่อน)
    let bookingData = {
      id: "",  // จะถูกแทนที่ด้วย API response หรือ mock ID
      packageInfo: {
        ...packageInfo,
        name: packageInfo.name || packageInfo.title || "",
        contactChannel: packageInfo.contactChannel || ""  // ตรวจสอบให้แน่ใจว่ามีช่องทางติดต่อ
      },
      fortuneTeller: seerInfo?.name || packageInfo?.fortuneTellerName || packageInfo?.seer || "",
      userInfo: {
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        fullName: `${formData.firstName || ""} ${formData.lastName || ""}`.trim(),
        email: formData.email || "",
        birthDate: formData.birthDate || "",
        birthTime: formData.birthTime || "",
        status: formData.status || "",
        notifyByEmail: formData.notifyByEmail  // เก็บค่าการเลือกรับการแจ้งเตือนทางอีเมล
      },
      selectedDate: parsedDate || new Date(),
      selectedTime: selectedTime || "",
      paymentMethod,
      useCoins,
      finalPrice,
      questions: questions.filter(q => q.trim() !== ""),
      notification: formData.notifyByEmail,  // เพิ่มเพื่อความชัดเจน
      appointmentSuccess: false,  // เพิ่มสถานะการนัดหมาย
      appointmentId: null,        // เพิ่ม ID การนัดหมาย
      appointmentError: null      // เพิ่มข้อความข้อผิดพลาด
    };
    
    // เรียก API เพื่อสร้างการนัดหมาย (ถ้ามี token)
    if (token) {
      try {
        const response = await fetch('https://backend.qseer.app/api/appointment/seer', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Origin': 'https://backend.qseer.app'
          },
          body: JSON.stringify(appointmentData),
          credentials: 'include'  // สำคัญสำหรับการส่ง cookies
        });
        
        const responseText = await response.text();
        
        let bookingResponse;
        try {
          bookingResponse = JSON.parse(responseText);
        } catch (e) {
          console.error("Error parsing JSON response:", e);
          bookingResponse = { error: "Invalid JSON response" };
        }
        
        if (!response.ok) {
          throw new Error(`สร้างการนัดหมายไม่สำเร็จ (${response.status}): ${bookingResponse.detail || responseText}`);
        }
        
        // อัพเดทข้อมูลที่ได้จาก API
        bookingData.id = bookingResponse.id || bookingResponse.appointment_id || "";
        bookingData.appointmentId = bookingResponse.id || bookingResponse.appointment_id || "";
        bookingData.appointmentSuccess = true;
        
        // รวมข้อมูลจาก API response ถ้ามี
        if (bookingResponse) {
          bookingData.bookingId = bookingResponse.bookingId || bookingResponse.id || "";
          bookingData.appointmentData = bookingResponse;  // เก็บข้อมูลทั้งหมดจาก API
        }
        
      } catch (error) {
        console.error("API error:", error);
        // เก็บข้อมูลข้อผิดพลาด
        bookingData.appointmentError = error.message;
        // แม้เกิดข้อผิดพลาดก็ยังใช้ข้อมูลที่เตรียมไว้
        bookingData.id = `BK-${Math.floor(Math.random() * 1000000)}`;
        bookingData.bookingId = bookingData.id;
      }
    } else {
      // ถ้าไม่มี token ให้สร้าง mock ID
      console.warn("⚠️ ไม่พบ token ใช้ mock ID แทน");
      bookingData.id = `BK-${Math.floor(Math.random() * 1000000)}`;
      bookingData.bookingId = bookingData.id;
      bookingData.appointmentError = "ไม่พบ token สำหรับการเรียก API";
    }
    
    // พิมพ์ข้อมูลทั้งหมดที่จะส่งไปยังหน้าถัดไป
    console.log("FINAL booking data sent to next page:", bookingData);
    
    // บันทึกข้อมูลการนัดหมายลง localStorage เพื่อตรวจสอบภายหลัง
    localStorage.setItem('lastBookingData', JSON.stringify({
      id: bookingData.id,
      appointmentId: bookingData.appointmentId,
      success: bookingData.appointmentSuccess,
      timestamp: new Date().toISOString()
    }));
    
    // ตรวจสอบเงื่อนไขราคาอีกครั้ง (สำคัญมาก)
    // กรณีใช้คอยล์แล้วราคาเป็น 0
    if (finalPrice <= 0) {
      navigate("/bookingSeer4", { state: bookingData });
    } else {
      // กรณีต้องจ่ายเงิน
      navigate("/bookingSeer3", { state: bookingData });
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสร้างการนัดหมาย:", error);
    
    // แม้เกิดข้อผิดพลาดก็ยังต้องนำทางไปยังหน้าถัดไป
    const mockBookingId = `BK-${Math.floor(Math.random() * 1000000)}`;
    
    const bookingData = {
      id: mockBookingId,
      bookingId: mockBookingId,
      packageInfo: {
        ...packageInfo,
        name: packageInfo.name || packageInfo.title || "",
        contactChannel: packageInfo.contactChannel || ""
      },
      fortuneTeller: seerInfo?.name || packageInfo?.fortuneTellerName || packageInfo?.seer || "",
      userInfo: {
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        fullName: `${formData.firstName || ""} ${formData.lastName || ""}`.trim(),
        email: formData.email || "",
        birthDate: formData.birthDate || "",
        birthTime: formData.birthTime || "",
        status: formData.status || "",
        notifyByEmail: formData.notifyByEmail
      },
      selectedDate: parsedDate || new Date(),
      selectedTime: selectedTime || "",
      paymentMethod,
      useCoins,
      finalPrice,
      questions: questions.filter(q => q.trim() !== ""),
      notification: formData.notifyByEmail,
      appointmentSuccess: false,
      appointmentError: error.message
    };
    
    // บันทึกข้อมูลความผิดพลาดลง localStorage
    localStorage.setItem('lastBookingError', JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }));
    
    // ตรวจสอบเงื่อนไขราคาอีกครั้ง
    if (finalPrice <= 0) {
      navigate("/bookingSeer4", { state: bookingData });
    } else {
      navigate("/bookingSeer3", { state: bookingData });
    }
    
    // แสดงข้อผิดพลาดให้ผู้ใช้
    alert(`เกิดข้อผิดพลาดในการสร้างการนัดหมาย: ${error.message}`);
  } finally {
    // ยกเลิกสถานะโหลด ไม่ว่าจะสำเร็จหรือไม่
    setIsLoading(false);
  }
};

  const handleValidationChange = (isValid) => {
    setFormValid(isValid);
  };
  useEffect(() => {
    const isValid = questions.every(q => q.trim() !== "") && paymentMethod;
    handleValidationChange(isValid);
  }, [questions, paymentMethod]);
  
  

  // รวบรวมชื่อหมอดูที่ถูกต้อง
  const getFortuneteller = () => {
    return seerLoading ? "กำลังโหลด..." : (seerInfo?.name || packageInfo?.fortuneTellerName || packageInfo?.seer || "");
  };

  // รวบรวมชื่อแพ็กเกจที่ถูกต้อง
  const getPackageName = () => {
    return packageInfo?.name || packageInfo?.title || "";
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
              numQuestions={packageInfo?.question_limit ?? 4}
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
              onPayment={handlePayment} // ส่งฟังก์ชัน handlePayment ไปให้ Payment
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      
      {/* ลบปุ่ม NextButton ออก */}
    </>
  );
};

export default BookingSeer2;