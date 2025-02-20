import Images from "../../../assets";

const MenuItems = [
  { icon: Images.UserIcon, text: "โปรไฟล์", href: "/profile" },
  { icon: Images.calendarIcon, text: "จองคิว", href: "/appointment" },
  { icon: Images.BoltIcon, text: "ดูดวงทันที", href: "/fortuneNow" },
  { icon: Images.OutlineIcon, text: "รายการของฉัน", href: ["/revenue", "/withdraw-money"] }, 
  { icon: Images.Users_GroupIcon, text: "ผู้ติดตาม", href: "/follower" },
];

export default MenuItems;
