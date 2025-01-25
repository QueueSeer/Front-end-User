import React from "react";
import SeerCard from "./SeerCard";

const SeerList = ({ seers }) => {
    return (
        <div className="relative p-4">
            {/* ✅ ใช้ flex-wrap บน Desktop และเลื่อนได้บนมือถือ */}
            <div className="flex sm:grid sm:grid-cols-6 gap-4 text-center overflow-x-auto sm:overflow-visible scrollbar-hide">
                {seers.map((seer, index) => (
                    <SeerCard key={index} seer={seer} />
                ))}
            </div>
        </div>
    );
};

export default SeerList;
