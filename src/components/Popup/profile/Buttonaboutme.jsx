import React from "react";
import ButtonComponent from "./ButtonComponent";

const Buttonaboutme = ({ onSave, onCancel }) => {
  return (
    <div className="flex justify-end gap-4">
      {/* ปุ่มยกเลิก */}
      <ButtonComponent
        label="ยกเลิก"
        onClick={onCancel}
        className="text-secondary2/80 border border-secondary2"
      />
      {/* ปุ่มบันทึก */}
      <ButtonComponent
        label="บันทึก"
        onClick={onSave}
        className="bg-primary text-white border border-secondary2"
      />
    </div>
  );
};

export default Buttonaboutme;
