import React, { useState } from "react";

const UserInfoForm = () => {
  const [status, setStatus] = useState("");

  return (
    <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
      {/* ชื่อจริง */}
      <div>
        <label className="text-gray-700 font-semibold">ชื่อจริง *</label>
        <input type="text" className="w-full p-2 border rounded-md" required />
      </div>

      {/* นามสกุล */}
      <div>
        <label className="text-gray-700 font-semibold">นามสกุล *</label>
        <input type="text" className="w-full p-2 border rounded-md" required />
      </div>

      {/* วันเกิด */}
      <div>
        <label className="text-gray-700 font-semibold">วันเกิด *</label>
        <input type="text" className="w-full p-2 border rounded-md" placeholder="08/04/45" required />
      </div>

      {/* เวลาเกิด */}
      <div>
        <label className="text-gray-700 font-semibold">เวลาเกิด</label>
        <input type="text" className="w-full p-2 border rounded-md" placeholder="08.45" />
      </div>

      {/* นิกาย */}
      <div>
        <label className="text-gray-700 font-semibold">นิกาย</label>
        <input type="text" className="w-full p-2 border rounded-md" />
      </div>

      {/* สถานะ */}
      <div>
        <label className="text-gray-700 font-semibold">สถานะ *</label>
        <select className="w-full p-2 border rounded-md" value={status} onChange={(e) => setStatus(e.target.value)} required>
          <option value="">เลือกสถานะ</option>
          <option value="single">โสด</option>
          <option value="married">แต่งงาน</option>
          <option value="in_relationship">มีคู่</option>
        </select>
      </div>
    </div>
  );
};

export default UserInfoForm;
