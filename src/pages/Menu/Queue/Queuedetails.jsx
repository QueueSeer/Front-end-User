import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Images from "../../../assets";
import Navbar from "../../../components/navbar";
import CopyButton from "../../../components/Button/CopyButton";
import BackButton from "../../../components/Button/BackButton";

const CancelConfirmationModal = ({ isOpen, onConfirm, onCancel, cancelCount }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#1C1B3A] flex items-center justify-center mb-4">
            <img 
              src={Images.crystalBall || "/crystal-ball.png"} 
              alt="Crystal Ball" 
              className="w-12 h-12"
            />
          </div>
          <h2 className="text-[#6E5D99] text-2xl font-bold mb-2">ยืนยันการยกเลิกหรือไม่ ?</h2>
          <p className="text-center text-gray-700 mb-2">คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคิวนี้?</p>
          <p className="text-center text-gray-700 mb-8">
            หากยกเลิกแล้ว คุณยังสามารถทำการจองใหม่ได้อีกในภายหลัง<br />
            โดยคุณสามารถยกเลิกได้อีก {3 - cancelCount} / 3 ครั้ง
          </p>
          <div className="flex w-full gap-4">
            <button 
              onClick={onConfirm}
              className="flex-1 bg-[#6E5D99] text-white py-3 rounded-full font-medium hover:bg-[#5D4D82] transition-colors"
            >
              ยืนยัน
            </button>
            <button 
              onClick={onCancel}
              className="flex-1 border border-[#6E5D99] text-[#6E5D99] py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Queuedetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // เริ่มต้นด้วยข้อมูลจาก location.state หรือ object ว่างถ้าไม่มี
  const [appointmentData, setAppointmentData] = useState(() => {
    const data = location.state?.appointmentData || {};
    console.log("Initial appointmentData from location:", data);
    return data;
  });
  const [copiedCode, setCopiedCode] = useState("");
  const [isCanceled, setIsCanceled] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelCount, setCancelCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const [questions, setQuestions] = useState([]);

  function formatThaiDate(isoDate) {
    if (!isoDate) return "ไม่ระบุ";
    const date = new Date(isoDate);
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
  }

  function formatThaiTime(isoDate) {
    if (!isoDate) return "ไม่ระบุ";
    const date = new Date(isoDate);
    return `${date.getHours().toString().padStart(2, '0')}.${date.getMinutes().toString().padStart(2, '0')} น.`;
  }

  const fetchCancelCount = async () => {
    try {
      const response = await axios.get('https://backend.qseer.app/api/appointment/user-cancelled-count', { withCredentials: true });
      setCancelCount(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching cancel count:', error);
      setError("ไม่สามารถดึงข้อมูลจำนวนครั้งที่ยกเลิกได้");
    }
  };

  const fetchAppointmentDetails = async (appointmentId) => {
    try {
      setIsLoading(true);
      console.log("Fetching appointment with ID:", appointmentId);
      
      const response = await axios.get(`https://backend.qseer.app/api/appointment/${appointmentId}`, {
        withCredentials: true
      });

      const data = response.data;
      console.log("Appointment data fetched successfully:", data);

      // ปรับข้อมูลคำถามให้เป็น array เสมอ
      let questionsArray = [];
      if (data.questions) {
        if (Array.isArray(data.questions)) {
          questionsArray = data.questions;
          console.log("Found questions array:", questionsArray);
        } else {
          console.warn("API returned questions but not as array:", data.questions);
          // พยายามแปลงเป็น array ถ้าเป็นไปได้
          try {
            if (typeof data.questions === 'string') {
              questionsArray = JSON.parse(data.questions);
              if (!Array.isArray(questionsArray)) {
                questionsArray = [data.questions];
              }
            } else {
              questionsArray = [String(data.questions)];
            }
          } catch (e) {
            console.error("Failed to parse questions:", e);
            questionsArray = [];
          }
        }
      }
      
      // ตั้งค่า state ทั้งหมดพร้อมกัน
      setAppointmentData(data);
      setIsCanceled(data.status === "u_cancelled" || data.status === "s_cancelled");
      setQuestions(questionsArray);

      // ดึงข้อมูลผู้จองจาก required ที่อยู่ใน client ตามโครงสร้าง API
      if (data.client) {
        const required = data.client.required || {};
        
        setUserData({
          name: required.name || data.client.display_name || "ไม่ระบุ",
          gender: data.client.gender || "ไม่ระบุ",
          birthDate: formatThaiDate(required.birthdate),
          birthTime: "ไม่ระบุ", // API ไม่มีข้อมูล birthtime
          email: required.email || "ไม่ระบุ",
          connectionType: required.phone_number || "ไม่ระบุ"
        });
      }
    } catch (error) {
      console.error("Error fetching appointment:", error);
      setError("ไม่สามารถโหลดข้อมูลการจองได้");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // กรณีมี id ใน URL แต่ยังไม่มี appointmentData
    if (id && !appointmentData.id) {
      console.log("Fetching appointment details from API with ID:", id);
      fetchAppointmentDetails(id);
    } 
    // กรณีไม่มี id และไม่มีข้อมูล appointmentData
    else if (!id && !appointmentData.id) {
      console.log("No ID and no appointmentData, redirecting to queue history");
      navigate("/queuehistory");
    } 
    // กรณีมีข้อมูล appointmentData แล้ว (อาจมาจาก state หรือดึงมาจาก API แล้ว)
    else {
      console.log("Using existing appointment data:", appointmentData);
      setIsCanceled(appointmentData.status === "u_cancelled" || appointmentData.status === "s_cancelled");
      
      // ตั้งค่าคำถามจากข้อมูลที่มีอยู่
      if (appointmentData.questions) {
        console.log("Setting questions from appointmentData:", appointmentData.questions);
        if (Array.isArray(appointmentData.questions)) {
          setQuestions(appointmentData.questions);
        } else {
          console.warn("Questions is not an array:", appointmentData.questions);
          setQuestions([]);
        }
      } else {
        console.log("No questions in appointmentData");
        setQuestions([]);
      }
      
      // ตั้งค่าข้อมูลผู้จองตามโครงสร้าง API
      if (appointmentData.client) {
        const required = appointmentData.client.required || {};
        
        setUserData({
          name: required.name || appointmentData.client.display_name || "ไม่ระบุ",
          gender: appointmentData.client.gender || "ไม่ระบุ",
          birthDate: formatThaiDate(required.birthdate),
          birthTime: "ไม่ระบุ", // API ไม่มีข้อมูล birthtime
          email: required.email || "ไม่ระบุ",
          connectionType: required.phone_number || "ไม่ระบุ"
        });
      }
    }

    fetchCancelCount();
  }, [id, appointmentData.id]);

  const handleCopy = (code) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 3000);
  };

  const handleOpenCancelModal = () => setShowCancelModal(true);
  const handleCloseCancelModal = () => setShowCancelModal(false);

  const handleConfirmCancel = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `https://backend.qseer.app/api/appointment/${appointmentData.id || id}/status/user-cancel`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsCanceled(true);
        fetchCancelCount();
      }
    } catch (error) {
      const msg = error.response?.data?.detail || "เกิดข้อผิดพลาดในการยกเลิกนัดหมาย";
      alert(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
      setShowCancelModal(false);
    }
  };

  const getThaiStatus = (status) => {
    switch (status) {
      case "pending": return "รอเข้ารับบริการ";
      case "completed": return "เข้ารับบริการสำเร็จ";
      case "u_cancelled":
      case "s_cancelled":
        return "บริการที่ถูกยกเลิก";
      default: return "รอเข้ารับบริการ";
    }
  };

  // ข้อมูลการจอง
  const getPackagePrice = () => {
    // ตาม API ไม่มี package.price โดยตรง แต่อาจมีฟิลด์ total
    if (appointmentData.total) {
      return `${appointmentData.total} คอยน์`;
    }
    // ถ้าไม่มี total อาจใช้ข้อมูลจาก package อื่นๆ ถ้ามี
    if (appointmentData.package && appointmentData.package.price) {
      return `${appointmentData.package.price} คอยน์`;
    }
    return "ไม่ระบุ";
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col justify-center items-center">
        <div className="pb-4 self-start">
          <BackButton />
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-5xl text-center">
          <h2 className="text-3xl font-bold" style={{ color: isCanceled ? "#E74C3C" : "#2ECC71" }}>
            {isCanceled ? "การจองถูกยกเลิก" : "ยินดีด้วย! คุณได้จองคิวเรียบร้อย"}
          </h2>

          {!isCanceled && appointmentData.confirmation_code && (
            <div className="flex justify-center items-center mt-4 text-xl font-semibold">
              รหัสยืนยันคิว คือ{" "}
              <CopyButton
                text={appointmentData.confirmation_code}
                isCopied={copiedCode === appointmentData.confirmation_code}
                onCopy={() => handleCopy(appointmentData.confirmation_code)}
                className="text-[24px]"
              />
            </div>
          )}

          <div className="mt-6 border border-green-400 rounded-md p-4 text-center text-gray-700">
            <p>
              ชำระผ่าน <b>โอนคอยน์</b> วันที่ <b>{formatThaiDate(appointmentData.payment_time)}</b>{" "}
              จำนวนราคา <b>{getPackagePrice()}</b>
            </p>
            {isCanceled && (
              <p className="mt-2 text-red-500">
                คุณจะได้รับคอยน์คืนเต็มจำนวน {(appointmentData.total || 0)} คอยน์ จากระบบภายในระยะเวลา 7 วัน
              </p>
            )}
          </div>

          <div className="mt-8 flex gap-8 items-start">
            <div className="flex-[1.4] bg-[#7B5EA7] text-white p-8 rounded-lg shadow-md text-left">
              <div className="flex justify-between text-sm mt-1">
                <div>
                  <p className="opacity-80 text-center">วันที่นัดหมาย</p>
                  <p className="text-lg font-semibold">{formatThaiDate(appointmentData.start_time)}</p>
                </div>
                <div>
                  <p className="opacity-80 text-center">เวลานัดหมาย</p>
                  <p className="text-lg font-semibold">{formatThaiTime(appointmentData.start_time)}</p>
                </div>
                <div>
                  <p className="opacity-80 mb-2 text-center">สถานะ</p>
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                    isCanceled ? "bg-red-100 text-red-600" : "bg-white text-purple-700"
                  }`}>
                    {getThaiStatus(appointmentData.status)}
                  </span>
                </div>
              </div>

              <div className="text-center mt-8">
                <p className="text-xl font-bold">{appointmentData.package?.name || "แพกเกจดูดวง"}</p>
                <p className="opacity-80 text-sm mt-1">{appointmentData.seer?.display_name || "ไม่ระบุ"}</p>
                {appointmentData.seer?.name && appointmentData.seer.name !== appointmentData.seer.display_name && (
                  <p className="opacity-70 text-xs mt-1">({appointmentData.seer.name})</p>
                )}
              </div>

              {appointmentData.seer?.socials_link && (
                <div className="text-center mt-8">
                  <p className="text-sm opacity-80 inline">ช่องทางติดต่อ: </p>
                  <span
                    className="text-white font-semibold underline cursor-pointer"
                    onClick={() => window.open(appointmentData.seer.socials_link, "_blank")}
                  >
                    {appointmentData.seer.socials_link}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 border border-gray-300 p-6 rounded-lg shadow-md bg-white text-left min-h-[240px]">
              <h3 className="text-lg font-bold mb-4">ข้อมูลผู้จอง</h3>
              <div className="grid grid-cols-2 gap-y-1">
                <p className="font-semibold text-gray-700">ชื่อ-นามสกุล:</p>
                <p>{userData.name}</p>
                <p className="font-semibold text-gray-700">สถานะ:</p>
                <p>{userData.gender}</p>
                <p className="font-semibold text-gray-700">วันเดือนปีเกิด:</p>
                <p>{userData.birthDate}</p>
                <p className="font-semibold text-gray-700">เวลาเกิด:</p>
                <p>{userData.birthTime}</p>
                <p className="font-semibold text-gray-700">อีเมล:</p>
                <p>{userData.email}</p>
                <p className="font-semibold text-gray-700">แจ้งเตือนผ่าน:</p>
                <p>{userData.connectionType}</p>
              </div>
            </div>
          </div>

          {/* คำถามผู้ใช้ - แก้ไขส่วนการแสดงผล */}
          {isLoading ? (
            <div className="mt-8 text-center">
              <p className="text-gray-500">กำลังโหลดข้อมูลคำถาม...</p>
            </div>
          ) : Array.isArray(questions) && questions.length > 0 ? (
            <div className="mt-8 text-left w-full">
              <h3 className="text-lg font-bold mb-2">คำถามที่คุณถาม</h3>
              <ul className="list-disc list-inside text-gray-700">
                {questions.map((q, index) => (
                  <li key={index}>{q || "ไม่ระบุรายละเอียด"}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-8 text-center">
              <p className="text-gray-500">ไม่มีคำถามที่ระบุ</p>
            </div>
          )}

          {!isCanceled && appointmentData.status === "pending" && (
            <div className="mt-6 flex justify-center">
              <button 
                onClick={handleOpenCancelModal}
                disabled={isLoading}
                className="px-6 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "กำลังดำเนินการ..." : `ยกเลิก (${cancelCount}/3)`}
              </button>
            </div>
          )}

          <CancelConfirmationModal 
            isOpen={showCancelModal}
            onConfirm={handleConfirmCancel}
            onCancel={handleCloseCancelModal}
            cancelCount={cancelCount}
          />
        </div>
      </div>
    </div>
  );
};

export default Queuedetails;