import React from "react";
import Images from "../../assets";

const PaymentTable = ({ payments }) => {
  // ฟังก์ชันกำหนดสีและสไตล์ของช่องสถานะ
  const getStatusStyle = (status) => {
    if (status.includes("รอเข้ารับบริการ") || status.includes("กำลังดำเนินการ")) {
      return "border border-purple-600 text-purple-600";
    } else if (status.includes("เกินเวลาที่กำหนด") || status.includes("ยกเลิก")) {
      return "bg-red-700 text-white";
    } else if (status.includes("สำเร็จ")) {
      return "bg-green-700 text-white";
    } else {
      return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 overflow-x-auto">
      {/* Table */}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="text-gray-700 text-base border-b border-gray-200">
            <th className="p-3 text-center">วันที่ซื้อ</th>
            <th className="p-3 text-center">ชื่อแพ็กเกจ</th>
            <th className="p-3 text-center">สถานะ</th>
            <th className="p-3 text-center">จำนวนคอยน์</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr 
              key={index} 
              className={`border-b border-gray-200 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="p-4 text-center">{payment.purchaseDate}</td>
              <td className="p-4 text-center">{payment.packageName}</td>
              <td className="p-4 text-center">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(payment.status)}`}
                >
                  {payment.status}
                </span>
              </td>
              <td className="p-4 text-center font-medium">{payment.coinAmount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;