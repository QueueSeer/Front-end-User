import React from "react";
import MenuItem from "./MenuItem";
import Images from "../../../assets";

const menuItems = [
  {
    icon: Images.calendarIcon,
    label: "จองคิว",
    to: "/profile", // กำหนดเส้นทางที่จะไปเมื่อคลิก
  },
  {
    icon: Images.BoxIcon,
    label: "แพ็กเกจ",
    to: "/", // กำหนดเส้นทางที่จะไปเมื่อคลิก
  },
  {
    icon: Images.BoltIcon,
    label: "ดูดวงทันที",
    to: "/fortune", // กำหนดเส้นทางที่จะไปเมื่อคลิก
  },
  {
    icon: Images.SledgehammerIcon,
    label: "ประมูล",
    to: "/auction", // กำหนดเส้นทางที่จะไปเมื่อคลิก
  },
  {
    icon: Images.Clock_CircleIcon,
    label: "ตารางเวลา",
    to: "/schedule", // กำหนดเส้นทางที่จะไปเมื่อคลิก
  },
  {
    icon: Images.OutlineIcon,
    label: "รายรับของฉัน",
    to: "/revenue", // กำหนดเส้นทางที่จะไปเมื่อคลิก
  },
  {
    icon: Images.Users_GroupIcon,
    label: "ผู้ติดตาม",
    to: "/followers", // กำหนดเส้นทางที่จะไปเมื่อคลิก
  },
  {
    icon: Images.Star_Icon,
    label: "จัดการรีวิว",
    to: "/reviews", // กำหนดเส้นทางที่จะไปเมื่อคลิก
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
