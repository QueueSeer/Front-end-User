import React from "react";
import { useNavigate } from "react-router-dom";
import Images from "../../assets"; // ✅ Import Images ให้เรียบร้อย

const PaymentTable = ({ payments }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 p-4">
      {/* Table */}
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="text-gray-700 text-base ">
            <th className="px-4 py-4 ">วันที่ซื้อ</th>
            <th className="px-4 py-4">ชื่อแพ็กเกจ</th>
            <th className="px-4 py-4 ">สถานะ</th>
            <th className="px-4 py-4">หมอดู</th>
            <th className="px-4 py-4 ">จำนวนคอยน์</th>
            <th className="px-4 py-4 text-left">รายละเอียด</th> {/* ✅ แก้ text-left */}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-4 py-5 ">{payment.purchaseDate}</td>
              <td className="px-4 py-5">{payment.packageName}</td>
              <td className="px-4 py-5 ">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    payment.status === "รอเข้ารับบริการ"
                      ? "border border-purple-600 text-purple-600"
                      : payment.status === "เกินเวลาที่กำหนด"
                      ? "bg-red-700 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {payment.status}
                </span>
              </td>
              <td className="px-4 py-3.5">{payment.fortuneTeller}</td>
              <td className="px-4 py-3.5 text-center">{payment.coinAmount.toLocaleString()}</td>
              <td className="px-4 py-3.5 text-left cursor-pointer text-purple-700 hover:text-purple-600">
                <div className="flex items-center gap-2" onClick={() => navigate("/queuedetails")}>
                  <span>รายละเอียด</span>
                  <img src={Images.next2} alt="details" className="w-2 h-3" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
