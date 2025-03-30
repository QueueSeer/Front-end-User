import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import PaymentTable from "../../components/PaymentHistory/PaymentTable";
import Images from "../../assets";
import Navbar from "../../components/navbar";
import axios from "axios";

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [allPayments, setAllPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(getDefaultMonth());
  const [monthOptions, setMonthOptions] = useState(generateMonthOptions());
  const [noData, setNoData] = useState(false);
  
  // สำหรับการแบ่งหน้า
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10); // แสดง 10 รายการต่อหน้า

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
    // เพิ่มตัวเลือก "ทั้งหมด" เป็นตัวเลือกแรก
    months.unshift({
      label: "ทั้งหมด",
      value: "all"
    });
    return months;
  }

  // ตั้งค่าเดือนปัจจุบันเป็นค่าเริ่มต้น
  function getDefaultMonth() {
    return "all"; // แสดงทั้งหมดเป็นค่าเริ่มต้น
  }

  // แปลงวันที่เป็นรูปแบบไทย
  function formatThaiDate(dateString) {
    if (!dateString) return "ไม่ระบุ";
    
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
  const fetchPayments = async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setNoData(false);

      // ตั้งค่าพารามิเตอร์สำหรับการเรียก API
      const params = {
        limit: 100,
        direction: 'desc'
      };

      // เพิ่ม timestamp เพื่อป้องกันการ cache
      if (forceRefresh) {
        params.timestamp = new Date().getTime();
      }

      // เรียก API
      const response = await axios.get('https://backend.qseer.app/api/transaction/user/me', {
        params,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Accept': 'application/json'
        },
        withCredentials: true
      });

      console.log("API Response:", response.data);

      // แปลงข้อมูลจาก API เป็นรูปแบบที่ใช้ในตาราง
      if (response.data && Array.isArray(response.data)) {
        const rawTransactions = response.data;
        
        // เรียงข้อมูลตามรหัสธุรกรรม (ID) จากใหม่ไปเก่า
        rawTransactions.sort((a, b) => b.id - a.id);
        
        // แยกปีและเดือนจาก selectedMonth (สำหรับการกรองตามเดือน ถ้าจำเป็น)
        let startDate, endDate;
        if (selectedMonth !== "all") {
          const [year, month] = selectedMonth.split('-');
          startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
          endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);
        }
        
        const formattedPayments = rawTransactions
          // กรองธุรกรรมตามเดือนที่เลือก (ถ้าเลือก "ทั้งหมด" จะไม่กรอง)
          .filter(txn => {
            if (selectedMonth === "all") {
              return true; // แสดงทั้งหมด
            } else {
              const txnDate = new Date(txn.date_created || txn.created_at || txn.updated_at || new Date());
              return txnDate >= startDate && txnDate <= endDate;
            }
          })
          .map(txn => {
            // แปลงข้อมูลวันที่เป็นรูปแบบไทย
            const purchaseDate = formatThaiDate(txn.date_created || txn.created_at || txn.updated_at);

            // กำหนดชื่อแพ็กเกจตามประเภทธุรกรรม
            let packageName = "ไม่ระบุประเภท";
            const txnType = txn.type || txn.txn_type;
            
            if (txnType === "appointment") {
              packageName = "แพคเกจดูดวงรายเดือน";
            } else if (txnType === "question") {
              packageName = "บริการถามตอบ";
            } else if (txnType === "auction_bid" || txnType === "auctionInfo") {
              packageName = "ประมูลดูดวงออนไลน์";
            } else if (txnType === "topup" || txn.amount > 0) {
              packageName = "การเติมโชคคอยน์";
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

            // กรณีเติมเงิน (amount เป็นบวก)
            if (txn.amount > 0) {
              status = txnStatus === "completed" ? "เติมโชคคอยน์สำเร็จ" : 
                      txnStatus === "cancelled" ? "ยกเลิกการเติมเงิน" : 
                      "กำลังดำเนินการ";
              packageName = "การเติมโชคคอยน์";
            }

            // ดึงข้อมูลหมอดู
            let fortuneTeller = "ไม่ระบุ";
            if (txn.activity_data && txn.activity_data.fortune_teller_name) {
              fortuneTeller = txn.activity_data.fortune_teller_name;
            } else if (txn.activity_data && txn.activity_data.seer_name) {
              fortuneTeller = txn.activity_data.seer_name;
            }

            // สำหรับธุรกรรมเติมเงิน ไม่ต้องแสดงชื่อหมอดู
            if (txn.amount > 0) {
              fortuneTeller = "-";
            }

            return {
              id: txn.id || txn.transaction_id,
              purchaseDate: purchaseDate,
              packageName: packageName,
              status: status,
              fortuneTeller: fortuneTeller,
              coinAmount: Math.abs(txn.amount || 0),
              activityId: txn.activity_id,
              activityType: txn.activity_type === "auctionInfo" ? "auction" : txn.activity_type,
              transactionType: txnType || (txn.amount > 0 ? "topup" : "unknown"),
              rawData: txn // เก็บข้อมูลดิบไว้เพื่อการดีบัก
            };
          });

        console.log("Formatted payments (sorted):", formattedPayments);
        
        setAllPayments(formattedPayments);
        setCurrentPage(1); // เริ่มที่หน้าแรกเมื่อโหลดข้อมูลใหม่
        
        // ตรวจสอบว่ามีข้อมูลหรือไม่
        if (formattedPayments.length === 0) {
          setNoData(true);
        }
      } else {
        // ถ้าไม่มีข้อมูลหรือข้อมูลไม่ใช่อาร์เรย์
        setAllPayments([]);
        setNoData(true);
      }
    } catch (err) {
      console.error("Error fetching payment history:", err.response?.data || err.message);
      setAllPayments([]);
      setNoData(true);
    } finally {
      setIsLoading(false);
    }
  };

  // โหลดข้อมูลครั้งแรกและเมื่อเปลี่ยนเดือน
  useEffect(() => {
    fetchPayments(true); // บังคับให้โหลดข้อมูลใหม่ทุกครั้ง
  }, [selectedMonth]);

  // อัปเดตข้อมูลที่แสดงตามหน้าปัจจุบัน
  useEffect(() => {
    // คำนวณหน้าปัจจุบัน
    const indexOfLastPayment = currentPage * paymentsPerPage;
    const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
    const currentPayments = allPayments.slice(indexOfFirstPayment, indexOfLastPayment);
    
    setPayments(currentPayments);
  }, [currentPage, allPayments, paymentsPerPage]);

  // สำหรับการเปลี่ยนเดือน
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // สำหรับรีเฟรชข้อมูล
  const handleRefresh = () => {
    fetchPayments(true);
  };

  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(allPayments.length / paymentsPerPage);

  // เปลี่ยนหน้า
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // ไปหน้าถัดไป
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // ไปหน้าก่อนหน้า
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
            {/* หัวข้อและปุ่มรีเฟรช */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src={Images.OutlineIcon} alt="OutlineIcon" className="w-7 h-7" />
                <h1 className="text-xl font-bold text-purple-800">การชำระเงิน</h1>
              </div>
            
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
              <p className="text-lg">ไม่พบประวัติการทำรายการ</p>
              <button 
                onClick={handleRefresh}
                className="mt-4 text-purple-600 hover:text-purple-800 underline"
              >
                ลองโหลดข้อมูลใหม่
              </button>
            </div>
          )}

          {/* Payment Table - แสดงเมื่อมีข้อมูลจาก API */}
          {!isLoading && !noData && payments.length > 0 && (
            <>
              <PaymentTable payments={payments} />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-600">
                    แสดง {(currentPage - 1) * paymentsPerPage + 1} - {Math.min(currentPage * paymentsPerPage, allPayments.length)} จากทั้งหมด {allPayments.length} รายการ
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* ปุ่มย้อนกลับ */}
                    <button 
                      onClick={goToPreviousPage} 
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      }`}
                    >
                      ก่อนหน้า
                    </button>
                    
                    {/* หมายเลขหน้า */}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          // แสดงเฉพาะหน้าใกล้เคียงกับหน้าปัจจุบัน
                          const isFirstPage = page === 1;
                          const isLastPage = page === totalPages;
                          const isCurrentPage = page === currentPage;
                          const isNeighborPage = Math.abs(page - currentPage) <= 1;
                          
                          return isFirstPage || isLastPage || isCurrentPage || isNeighborPage;
                        })
                        .map((page, index, array) => {
                          // แสดง "..." เมื่อมีหน้าที่ถูกข้าม
                          const showEllipsis = index > 0 && array[index - 1] !== page - 1;
                          
                          return (
                            <React.Fragment key={page}>
                              {showEllipsis && (
                                <span className="px-3 py-1">...</span>
                              )}
                              <button 
                                onClick={() => paginate(page)}
                                className={`px-3 py-1 rounded-md ${
                                  currentPage === page 
                                    ? 'bg-purple-700 text-white' 
                                    : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                }`}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          );
                        })}
                    </div>
                    
                    {/* ปุ่มถัดไป */}
                    <button 
                      onClick={goToNextPage} 
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      }`}
                    >
                      ถัดไป
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistoryPage;