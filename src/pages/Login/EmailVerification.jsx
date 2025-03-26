import React, { useEffect, useState } from "react";
import Images from "../../assets";

const EmailVerification = () => {
  const [status, setStatus] = useState(null); // null | "success" | "fail"

  useEffect(() => {
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
      return match ? match[2] : null;
    };

    const token = getCookie("verificationToken"); // cookie จริงจาก backend
    console.log("Token from Cookie:", token);

    if (token) {
      fetch(`https://backend.qseer.app/api/user/verify/${token}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include", // สำคัญ! ต้องส่ง cookie กลับไป
      })
        .then(async (response) => {
          const data = await response.json();
          console.log("Response:", response.status, data);
          if (response.status === 200) {
            setStatus("success");
          } else {
            setStatus("fail");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setStatus("fail");
        });
    } else {
      console.log("ไม่พบ token ใน Cookie");
      setStatus("fail");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#65558F] p-4 sm:p-6 relative">
      <div className="bg-cover bg-center rounded-lg w-full max-w-md sm:max-w-lg md:max-w-xl h-[300px] sm:h-[350px] md:h-[400px] p-4 sm:p-6 text-center relative overflow-hidden"
        style={{ backgroundImage: `url(${Images.cardverify})` }}>
        
        {status === "success" && (
          <div className="absolute top-[100px] sm:top-[120px] left-1/2 transform -translate-x-1/2 w-12 h-12 flex items-center justify-center">
            <img src={Images.tickcircle} alt="Tick" className="w-10 h-10" />
          </div>
        )}

        <div className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 text-center">
          {status === "success" ? (
            <>
              <h1 className="text-base font-semibold text-black">เปิดใช้งานบัญชีแล้ว</h1>
              <p className="text-xs text-gray-600 mt-2">มาเริ่มการเป็นหมอดูที่ยอดเยี่ยมกันเถอะ</p>
            </>
          ) : status === "fail" ? (
            <>
              <h1 className="text-base font-semibold text-red-600">การยืนยันล้มเหลว</h1>
              <p className="text-xs text-gray-600 mt-2">กรุณาลองอีกครั้งหรือติดต่อผู้ดูแลระบบ</p>
            </>
          ) : (
            <p className="text-sm text-gray-600">กำลังยืนยันบัญชี...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
