import Images from "../../../assets";

const MenuItems = [
  { icon: Images.UserIcon, text: "โปรไฟล์", href: "/profile" },
  { icon: Images.calendarIcon, text: "จองคิว", href: "/queuehistory" },
  { icon: Images.OutlineIcon, text: "การชำระเงิน", href: ["/paymentHistoryPage"] }, 
  { icon: Images.Users_GroupIcon, text: "ผู้ติดตาม", href: "/follower" },
];

export default MenuItems;
