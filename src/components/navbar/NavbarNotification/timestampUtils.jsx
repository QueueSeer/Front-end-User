// timestampUtils.js
export const calculateTimeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000); // ความแตกต่างเป็นวินาที

  if (diffInSeconds < 60) {
    return `${diffInSeconds} วินาทีที่ผ่านมา`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} นาทีที่ผ่านมา`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ชั่วโมงที่ผ่านมา`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} วันที่ผ่านมา`;
};
