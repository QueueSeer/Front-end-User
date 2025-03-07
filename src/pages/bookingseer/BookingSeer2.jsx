import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserInfoForm from "../../components/bookingcomponent/step2/UserInfoForm";
import QuestionForm from "../../components/bookingcomponent/step2/QuestionForm";
import Payment from "../../components/bookingcomponent/step2/Payment"; 
import Navbar from "../../components/navbar";

const BookingSeer2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
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

  // ดึงข้อมูลผู้ใช้จาก API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setUserInfoLoading(true);
        const token = getTokenFromCookie();
        
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
        
        let response = await fetch('https://backend.qseer.app/api/user/me', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });
        
        // เพิ่มการตรวจสอบ 401 และลองรีเฟรช token
        if (response.status === 401) {
          console.log("Token หมดอายุ, กำลังรีเฟรช...");
          const refreshResponse = await fetch('https://backend.qseer.app/api/access/refresh', {
            method: 'POST',
            credentials: 'include'
          });
          
          if (refreshResponse.ok) {
            // รีเฟรชสำเร็จ ลองดึงข้อมูลผู้ใช้อีกครั้ง
            const refreshData = await refreshResponse.json();
            // อาจอัพเดทค่าใน localStorage ตามความเหมาะสม
            
            // ดึง token ใหม่
            const newToken = getTokenFromCookie();
            
            // เรียก API อีกครั้ง
            response = await fetch('https://backend.qseer.app/api/user/me', {
              method: 'GET',
              headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${newToken || token}`
              },
              credentials: 'include'
            });
          } else {
            throw new Error(`ไม่สามารถรีเฟรช token ได้ (${refreshResponse.status})`);
          }
        }
        
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
          birthDate: data.birthdate ? formatDate(new Date(data.birthdate)) : "",
          notifyByEmail: true
        }));
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
    console.log(`Price calculation: total=${totalPrice}, discount=${discount}, final=${result}`);
    return result;
  };

  const finalPrice = calculateFinalPrice();
  
// ตรวจสอบความสมบูรณ์ของฟอร์ม
const isFormValid = () => {
  console.log("formValid:", formValid);
  console.log("questions:", questions);
  console.log("Trimmed questions:", questions.map(q => q.trim()));
  console.log("paymentMethod:", paymentMethod);

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

  console.log("ฟอร์มผ่านการตรวจสอบ ✅");
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
  console.log("เริ่มกระบวนการชำระเงิน...");


    
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
      
      // ข้อมูลที่จะส่งไปยังหน้าถัดไป (เตรียมไว้ก่อน)
      const bookingData = {
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
        notification: formData.notifyByEmail  // เพิ่มเพื่อความชัดเจน
      };
      
      // เรียก API เพื่อสร้างการนัดหมาย (ถ้ามี token)
      if (token) {
        console.log("Using token for appointment API");
        try {
          const response = await fetch('https://backend.qseer.app/api/appointment/seer', {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Origin': 'https://backend.qseer.app' // เพิ่ม Origin header ตามที่แบคเอนด์แนะนำ
            },
            body: JSON.stringify(appointmentData),
            credentials: 'include'  // สำคัญสำหรับการส่ง cookies
          });
          
          if (!response.ok) {
            throw new Error(`สร้างการนัดหมายไม่สำเร็จ (${response.status})`);
          }
          
          // แปลงข้อมูลตอบกลับจาก API
          const bookingResponse = await response.json();
          console.log("Booking API response:", bookingResponse);
          
          // อัพเดทข้อมูลที่ได้จาก API
          bookingData.id = bookingResponse.id || bookingResponse.bookingId || "";
          // รวมข้อมูลจาก API response ถ้ามี
          if (bookingResponse) {
            bookingData.bookingId = bookingResponse.bookingId || bookingResponse.id || "";
            // เพิ่มข้อมูลอื่นๆ ที่ต้องการจาก API response
          }
        } catch (error) {
          console.error("API error:", error);
          // แม้เกิดข้อผิดพลาดก็ยังใช้ข้อมูลที่เตรียมไว้
          bookingData.id = `BK-${Math.floor(Math.random() * 1000000)}`;
          bookingData.bookingId = bookingData.id;
        }
      } else {
        // ถ้าไม่มี token ให้สร้าง mock ID
        bookingData.id = `BK-${Math.floor(Math.random() * 1000000)}`;
        bookingData.bookingId = bookingData.id;
      }
      
      // พิมพ์ข้อมูลทั้งหมดที่จะส่งไปยังหน้าถัดไป
      console.log("FINAL booking data sent to next page:", bookingData);
      
      // ตรวจสอบเงื่อนไขราคาอีกครั้ง (สำคัญมาก)
      // กรณีใช้คอยล์แล้วราคาเป็น 0
      if (finalPrice <= 0) {
        console.log("FREE booking, navigating to BookingSeer4");
        navigate("/bookingSeer4", { state: bookingData });
      } else {
        // กรณีต้องจ่ายเงิน
        console.log("Paid booking, navigating to BookingSeer3");
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
        notification: formData.notifyByEmail
      };
      
      console.log("Mock booking data after error:", bookingData);
      
      // ตรวจสอบเงื่อนไขราคาอีกครั้ง
      if (finalPrice <= 0) {
        navigate("/bookingSeer4", { state: bookingData });
      } else {
        navigate("/bookingSeer3", { state: bookingData });
      }
      
      // แสดงข้อผิดพลาดให้ผู้ใช้
      alert(`ใช้ข้อมูลจำลองสำหรับการสาธิต: ${error.message}`);
    } finally {
      // ยกเลิกสถานะโหลด ไม่ว่าจะสำเร็จหรือไม่
      setIsLoading(false);
    }
  };

  const handleValidationChange = (isValid) => {
    console.log("เรียกใช้ handleValidationChange:", isValid);
    setFormValid(isValid);
  };
  useEffect(() => {
    const isValid = questions.every(q => q.trim() !== "") && paymentMethod;
    console.log("ตรวจสอบฟอร์ม formValid:", isValid);
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