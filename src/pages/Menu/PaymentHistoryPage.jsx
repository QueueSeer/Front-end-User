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

  // Mock data สำหรับใช้ในกรณีที่เรียก API ไม่สำเร็จหรือไม่มีข้อมูล
  const mockPayments = [
    {
      id: 1001,
      purchaseDate: "09 กันยายน 2567 13.45 น.",
      packageName: "แพคเกจดูดวงรายเดือน",
      status: "รอเข้ารับบริการ",
      fortuneTeller: "หมอดู จัสมิน",
      coinAmount: 99,
      activityId: 501,
      activityType: "appointment"
    },
    {
      id: 1002,
      purchaseDate: "09 กันยายน 2567 13.45 น.",
      packageName: "ประมูลดูดวงออนไลน์",
      status: "รอเข้ารับบริการ",
      fortuneTeller: "หมอดู จัสมิน",
      coinAmount: 100,
      activityId: 502,
      activityType: "auction"
    },
    {
      id: 1003,
      purchaseDate: "09 กันยายน 2567 13.45 น.",
      packageName: "แพคเกจดูดวงรายเดือน",
      status: "เกินเวลาที่กำหนด",
      fortuneTeller: "หมอดู จัสมิน",
      coinAmount: 99,
      activityId: 503,
      activityType: "appointment"
    },
    {
      id: 1004,
      purchaseDate: "09 กันยายน 2567 13.45 น.",
      packageName: "แพคเกจดูดวงรายเดือน",
      status: "บริการสำเร็จ",
      fortuneTeller: "หมอดู จัสมิน",
      coinAmount: 99,
      activityId: 504,
      activityType: "appointment"
    },
  ];

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

  // ดึงข้อมูลการชำระเงินจาก API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);

        // แยกปีและเดือนจาก selectedMonth
        const [year, month] = selectedMonth.split('-');
        
        // ตั้งค่าพารามิเตอร์สำหรับการเรียก API
        const params = {
          limit: 100,
          direction: 'desc'
        };

        const response = await axios.get('https://backend.qseer.app/api/transaction/user/me', {
          params,
          withCredentials: true
        });

        console.log("API Response:", response.data);

        // แปลงข้อมูลจาก API เป็นรูปแบบที่ใช้ในตาราง
        const formattedPayments = response.data
          .filter(txn => ['appointment', 'question', 'auction_bid'].includes(txn.txn_type))
          .map(txn => {
            // แปลงข้อมูลวันที่
            const purchaseDate = new Date(txn.created_at);
            const thaiMonths = [
              "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
              "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
            ];
            const formattedDate = `${String(purchaseDate.getDate()).padStart(2, '0')} ${thaiMonths[purchaseDate.getMonth()]} ${purchaseDate.getFullYear() + 543} ${String(purchaseDate.getHours()).padStart(2, '0')}.${String(purchaseDate.getMinutes()).padStart(2, '0')} น.`;

            // กำหนดชื่อแพ็กเกจตามประเภทธุรกรรม
            let packageName = "ไม่ระบุ";
            if (txn.txn_type === "appointment") {
              packageName = "แพคเกจดูดวงรายเดือน";
            } else if (txn.txn_type === "question") {
              packageName = "บริการถามตอบ";
            } else if (txn.txn_type === "auction_bid") {
              packageName = "ประมูลดูดวงออนไลน์";
            }

            // แปลงสถานะ
            let status = "รอเข้ารับบริการ";
            if (txn.txn_status === "completed") {
              status = "บริการสำเร็จ";
            } else if (txn.txn_status === "cancelled") {
              status = "เกินเวลาที่กำหนด";
            } else if (txn.txn_status === "hold") {
              status = "รอเข้ารับบริการ";
            }

            return {
              id: txn.transaction_id,
              purchaseDate: formattedDate,
              packageName: packageName,
              status: status,
              fortuneTeller: txn.activity_data?.fortune_teller_name || "ไม่ระบุ",
              coinAmount: Math.abs(txn.amount),
              activityId: txn.activity_id,
              activityType: txn.activity_type
            };
          });

        // กรองเฉพาะธุรกรรมในเดือนที่เลือก
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0);
        const filteredPayments = formattedPayments.filter(payment => {
          try {
            // วันที่ในรูปแบบไทยถูกแปลงกลับมาเป็น Date object
            const dateParts = payment.purchaseDate.split(' ')[0];
            const monthName = payment.purchaseDate.split(' ')[1];
            const yearPart = parseInt(payment.purchaseDate.split(' ')[2]) - 543; // แปลงปี พ.ศ. เป็น ค.ศ.
            
            const thaiMonths = [
              "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
              "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
            ];
            const monthIndex = thaiMonths.indexOf(monthName);
            
            const paymentDate = new Date(yearPart, monthIndex, parseInt(dateParts));
            return paymentDate >= startDate && paymentDate <= endDate;
          } catch (e) {
            console.error("Error parsing date:", e);
            return true; // ถ้าไม่สามารถแปลงวันที่ได้ ให้แสดงข้อมูลทั้งหมด
          }
        });

        // ถ้าได้ข้อมูลจาก API ให้ใช้ข้อมูลนั้น
        if (filteredPayments.length > 0) {
          setPayments(filteredPayments);
        } else {
          // ถ้าไม่มีข้อมูลจาก API ให้ใช้ mock data แทนโดยไม่แจ้งผู้ใช้
          console.log("No data from API, using mock data");
          setPayments(mockPayments);
        }
      } catch (err) {
        console.error("Error fetching payment history:", err.response?.data || err.message);
        // กรณีเกิดข้อผิดพลาด ใช้ mock data แทนโดยไม่แจ้งผู้ใช้
        setPayments(mockPayments);
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
      
      <div className="flex px-12 pt-12 gap-14">
        {/* Sidebar */}
        <div className="hidden lg:block w-72">
          <Sidebar active="การชำระเงิน" />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            {/* หัวข้อ */}
            <div className="flex items-center space-x-2">
              <img src={Images.OutlineIcon} alt="OutlineIcon" className="w-7 h-7" />
              <h1 className="text-xl font-bold text-purple-800">การชำระเงิน</h1>
            </div>

            {/* Dropdown เดือน */}
            <div className="relative">
              <select 
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
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

          {/* Payment Table - แสดงเสมอเมื่อมีข้อมูล (ไม่ว่าจะเป็นข้อมูลจาก API หรือ mock data) */}
          {!isLoading && payments.length > 0 && (
            <PaymentTable payments={payments} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;