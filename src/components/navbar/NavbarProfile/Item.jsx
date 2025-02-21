import React from "react";
import MenuItem from "./MenuItem";
import Images from "../../../assets";

const menuItems = [
  {
    icon: Images.calendarIcon,
    label: "จองคิว",
    to: "/queuehistory", // กำหนดเส้นทางที่จะไปเมื่อคลิก
  },
  {
    icon: Images.OutlineIcon,
    label: "การชำระเงิน",
    to: "/paymentHistoryPage", // กำหนดเส้นทางที่จะไปเมื่อคลิก
  },
  {
    icon: Images.Users_GroupIcon,
    label: "ผู้ติดตาม",
    to: "/follower", // กำหนดเส้นทางที่จะไปเมื่อคลิก
  },
];

const Item = () => {
  return (
    <div>
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          icon={<img src={item.icon} alt={`${item.label} Icon`} />}
          children={item.label}
          to={item.to} // ส่งค่าของ `to` ที่เป็นเส้นทาง
        />
      ))}
    </div>
  );
};

export default Item;
