import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../../components/navbar";
import Payment from "../../components/bookingcomponent/step2/Payment";
import QuestionForm from "../../components/bookingcomponent/step2/QuestionForm";
import UserInfoForm from "../../components/bookingcomponent/step2/UserInfoForm";
import dayjs from "dayjs";

const BookingSeer_2 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [packageInfo, setPackageInfo] = useState(location.state?.packageInfo);
  
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
  
  const numQuestions = location.state?.packageInfo.question_limit || 0;
  // ตรวจสอบจำนวนคำถามที่ถูกต้องและสร้าง array เริ่มต้น
  const [questions, setQuestions] = useState(() => {
    const validNumQuestions = (numQuestions > 0 && numQuestions <= 6) ? numQuestions : 1;
    return Array(validNumQuestions).fill("");
  });

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [useCoins, setUseCoins] = useState(false);

  const selectedDate = location.state?.selectedDate
  const selectedTime = location.state?.selectedTime

  
  const formatDate = (date) => {
    if (!date || !(date instanceof Date)) return "";
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
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

  const isFormValid = () => {
    if (!questions.every(q => q.trim() !== "")) {
      return false;
    } 
    if (!paymentMethod){
      return false;
    }
    return true
  }

  const handlePayment = async () => {
    // if (!isFormValid()) {
    //   alert("กรุณากรอกข้อมูลและเลือกวิธีการชำระเงินให้ครบถ้วน");
    //   return;
    // }
    // setIsPaymentLoading(true);
    
    const [hour, minute] = selectedTime.split(":");
    const startTime = new Date(selectedDate.$d);
    const formattedDate = `${startTime.getFullYear()}-${String(startTime.getMonth()+1).padStart(2, '0')}-${String(startTime.getDate()).padStart(2, '0')}T${hour.padStart(2,'0')}:${minute.padStart(2,'0')}:00.000Z`;

    const appointmentBody = {
      seer_id: packageInfo.seer_id,
      package_id: packageInfo.id,
      start_time: formattedDate,
      questions: questions
    };
    console.log(appointmentBody)

    const token = localStorage.getItem('token');
    await fetch('https://backend.qseer.app/api/appointment/seer', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(appointmentBody),
      credentials: 'include'
    })
    .then((res)=>res.json());
    
    // if (response.status === 201) {
    //   alert(`การจองสำเร็จ! รหัสการจอง: ${responseData.code}`);
    //   // หลังจากจองสำเร็จ นำผู้ใช้ไปยังหน้าที่เหมาะสม (เช่น หน้าประวัติการจอง)
    //   // window.location.href = "/booking-history";
    // } else if (response.status === 400) {
    //   // แสดงข้อความแจ้งเตือนตามประเภทข้อผิดพลาด
    //   if (responseData.detail === "Time slot not available.") {
    //     const confirmNewTime = window.confirm("ช่วงเวลาที่คุณเลือกไม่ว่างหรือถูกจองไปแล้ว ต้องการกลับไปเลือกเวลาใหม่หรือไม่?");
    //     if (confirmNewTime) {
    //       // นำทางกลับไปยังหน้าเลือกเวลา พร้อมข้อมูลแพ็กเกจ
    //       navigate("/bookingSeer", {
    //         state: {
    //           packageInfo: packageInfo
    //         }
    //       });
    //       return;
    //     }
    //   } else if (responseData.detail.includes("Exceeded question limit")) {
    //     alert("จำนวนคำถามเกินกว่าที่กำหนด");
    //   } else if (responseData.detail.includes("Insufficient coins")) {
    //     alert("เหรียญไม่เพียงพอสำหรับการจอง");
    //   } else {
    //     alert(`เกิดข้อผิดพลาด: ${responseData.detail}`);
    //   }
    // } else if (response.status === 401 || response.status === 403) {
    //   alert("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
    //   // window.location.href = "/login";
    // } else if (response.status === 404) {
    //   alert("ไม่พบหมอดูหรือแพ็คเกจที่เลือก");
    // } else if (response.status === 422) {
    //   // ข้อผิดพลาดการตรวจสอบค่า
    //   let errorMsg = "ข้อมูลไม่ถูกต้อง: ";
    //   if (responseData.detail && Array.isArray(responseData.detail)) {
    //     errorMsg += responseData.detail.map(err => err.msg).join(', ');
    //   } else {
    //     errorMsg += JSON.stringify(responseData);
    //   }
    //   alert(errorMsg);
    // } else {
    //   alert("เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง");
    // }
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
          birthDate: res.birthdate ? formatDate(new Date(res.birthdate)) : "",
          birthTime: "",
          status: "",
          notifyByEmail: true
        });
        setUserInfo(res)
      })
      .finally(()=>setUserInfoLoading(false));
    }
    fetchUserData()
  }, []);

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
            <p className="text-sm text-gray-500 mb-3">หมายเหตุ: ข้อมูลส่วนตัวนี้ของผู้จองสามารถแก้ไขได้ที่โปรไฟล์ของผู้ใช้งาน</p>
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
            <p className="text-sm text-gray-500 mb-3">กรุณากรอกคำถามที่ต้องการถามหมอดูให้ครบทุกข้อ</p>
            <QuestionForm
              numQuestions={packageInfo?.question_limit || 0}
              questions={questions}
              setQuestions={setQuestions}
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