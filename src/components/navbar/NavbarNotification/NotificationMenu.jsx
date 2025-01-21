import React from "react";
import ItemNotification from "./ItemNotification";
import NotificationInfo  from "./NotificationInfo";

const NotificationMenu = () => {
  return (
    <div
      className="z-50 my-2 px-6 text-base list-none rounded-3xl dark:bg-gray-700"
      id="user-dropdown"
    >
      {/* User Info */}
      <NotificationInfo
      />

      <ItemNotification />
    </div>
  );
};

export default NotificationMenu;
