import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import PaymentTable from "../../components/PaymentHistory/PaymentTable";
import Images from "../../assets";
import Navbar from "../../components/navbar";
import axios from "axios";

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(getDefaultMonth());
  const [monthOptions, setMonthOptions] = useState(generateMonthOptions());
  const [noData, setNoData] = useState(false);

  // สร้างตัวเลือกเดือนย้อนหลัง 6 เดือน
  function generateMonthOptions() {
    const months = [];
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    
    const currentDate = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      const year = date.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
      const month = date.getMonth();
      months.push({
        label: `${thaiMonths[month]} ${year}`,
        value: `${date.getFullYear()}-${String(month + 1).padStart(2, '0')}`
      });
    }
    return months;
  }

  // ตั้งค่าเดือนปัจจุบันเป็นค่าเริ่มต้น
  function getDefaultMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // แปลงวันที่เป็นรูปแบบไทย
  function formatThaiDate(dateString) {
    const date = new Date(dateString);
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day} ${month} ${year} ${hours}.${minutes} น.`;
  }

  // ดึงข้อมูลการชำระเงินจาก API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        setNoData(false);

        // แยกปีและเดือนจาก selectedMonth
        const [year, month] = selectedMonth.split('-');
        
        // คำนวณวันแรกและวันสุดท้ายของเดือน
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0);
        
        // ตั้งค่าพารามิเตอร์สำหรับการเรียก API - ไม่ระบุ txn_type เพื่อแก้ปัญหา 422
        const params = {
          limit: 100,
          direction: 'desc'
        };

        // เรียก API
        const response = await axios.get('https://backend.qseer.app/api/transaction/user/me', {
          params,
          headers: {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json'
          },
          withCredentials: true
        });

        console.log("API Response:", response.data);

        // แปลงข้อมูลจาก API เป็นรูปแบบที่ใช้ในตาราง
        if (response.data && Array.isArray(response.data)) {
          const formattedPayments = response.data
            // กรองเฉพาะประเภทธุรกรรมที่เกี่ยวข้องและอยู่ในเดือนที่เลือก
            .filter(txn => {
              const txnType = txn.type || txn.txn_type;
              // เพิ่ม 'topup' เข้าไปในรายการประเภทธุรกรรมที่ต้องการแสดง
              const isRelevantType = ['appointment', 'question', 'auction_bid', 'topup'].includes(txnType);
              
              // กรองธุรกรรมในเดือนที่เลือก
              const txnDate = new Date(txn.date_created || txn.created_at);
              const isInSelectedMonth = txnDate >= startDate && txnDate <= endDate;
              
              return isRelevantType && isInSelectedMonth;
            })
            .map(txn => {
              // แปลงข้อมูลวันที่
              const purchaseDate = formatThaiDate(txn.date_created || txn.created_at);

              // กำหนดชื่อแพ็กเกจตามประเภทธุรกรรม
              let packageName = "ไม่ระบุ";
              const txnType = txn.type || txn.txn_type;
              if (txnType === "appointment") {
                packageName = "แพคเกจดูดวงรายเดือน";
              } else if (txnType === "question") {
                packageName = "บริการถามตอบ";
              } else if (txnType === "auction_bid") {
                packageName = "ประมูลดูดวงออนไลน์";
              } else if (txnType === "topup") {
                packageName = "การเติมเหรียญ";
              }

              // แปลงสถานะ
              let status = "รอเข้ารับบริการ";
              const txnStatus = txn.status || txn.txn_status;
              if (txnStatus === "completed") {
                status = "บริการสำเร็จ";
              } else if (txnStatus === "cancelled") {
                status = "เกินเวลาที่กำหนด";
              } else if (txnStatus === "hold") {
                status = "รอเข้ารับบริการ";
              }

              // สำหรับธุรกรรมเติมเงิน
              if (txnType === "topup") {
                status = txnStatus === "completed" ? "เติมเงินสำเร็จ" : 
                        txnStatus === "cancelled" ? "ยกเลิกการเติมเงิน" : 
                        "กำลังดำเนินการ";
              }

              // ดึงข้อมูลหมอดู
              let fortuneTeller = "ไม่ระบุ";
              if (txn.activity_data && txn.activity_data.fortune_teller_name) {
                fortuneTeller = txn.activity_data.fortune_teller_name;
              } else if (txn.activity_data && txn.activity_data.seer_name) {
                fortuneTeller = txn.activity_data.seer_name;
              }

              // สำหรับธุรกรรมเติมเงิน ไม่ต้องแสดงชื่อหมอดู
              if (txnType === "topup") {
                fortuneTeller = "-";
              }

              return {
                id: txn.id || txn.transaction_id,
                purchaseDate: purchaseDate,
                packageName: packageName,
                status: status,
                fortuneTeller: fortuneTeller,
                coinAmount: Math.abs(txn.amount),
                activityId: txn.activity_id,
                activityType: txnType === "auction_bid" ? "auction" : txnType,
                transactionType: txnType // เก็บประเภทธุรกรรมไว้ใช้ในการนำทาง
              };
            });

          setPayments(formattedPayments);
          
          // ตรวจสอบว่ามีข้อมูลหรือไม่
          if (formattedPayments.length === 0) {
            setNoData(true);
          }
        } else {
          // ถ้าไม่มีข้อมูลหรือข้อมูลไม่ใช่อาร์เรย์
          setPayments([]);
          setNoData(true);
        }
      } catch (err) {
        console.error("Error fetching payment history:", err.response?.data || err.message);
        setPayments([]);
        setNoData(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [selectedMonth]);

  // สำหรับการเปลี่ยนเดือน
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 flex flex-col">
      <Navbar />
      
      <div className="flex px-6 md:px-12 pt-12 mt-4 gap-6 md:gap-14">
        {/* Sidebar */}
        <div className="hidden lg:block w-72">
          <Sidebar active="การชำระเงิน" />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 shadow-lg p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
            {/* หัวข้อ */}
            <div className="flex items-center space-x-2">
              <img src={Images.OutlineIcon} alt="OutlineIcon" className="w-7 h-7" />
              <h1 className="text-xl font-bold text-purple-800">การชำระเงิน</h1>
            </div>

            {/* Dropdown เดือน */}
            <div className="relative">
              <select 
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 w-full md:w-auto"
                value={selectedMonth}
                onChange={handleMonthChange}
              >
                {monthOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* เส้นแบ่ง */}
          <hr className="border-gray-300 mb-4" />

          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          )}

          {/* ไม่มีข้อมูล */}
          {!isLoading && noData && (
            <div className="flex flex-col justify-center items-center h-60 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-lg">ไม่พบประวัติการทำรายการในเดือนนี้</p>
            </div>
          )}

          {/* Payment Table - แสดงเมื่อมีข้อมูลจาก API */}
          {!isLoading && !noData && payments.length > 0 && (
            <PaymentTable payments={payments} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;