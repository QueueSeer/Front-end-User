import axios from 'axios';

// สร้าง Axios instance ส่วนกลางพร้อม default config
const apiClient = axios.create({
  baseURL: 'https://backend.qseer.app/api',
  withCredentials: true,
  timeout: 10000,
});

// Interceptor สำหรับการส่งคำขอ
apiClient.interceptors.request.use(
  (config) => {
    // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // กำหนดค่า withCredentials เพื่อส่ง cookie ไปด้วย (จำเป็นสำหรับ JWT ที่อยู่ใน HttpOnly cookie)
    config.withCredentials = true;
    
    // ถ้าต้องการเพิ่ม Authorization header ในกรณีที่ใช้ token ใน localStorage (ไม่ใช้ในกรณีของ HttpOnly cookie)
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor สำหรับการรับการตอบกลับ
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // ตรวจสอบว่าเป็น 401 (Unauthorized) และยังไม่ได้ลองรีเฟรช token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // ลองรีเฟรช token ถ้ามี apiClientHandlers หรือ AuthContext
        if (window.apiClientHandlers && window.apiClientHandlers.refreshToken) {
          console.log("Attempting to refresh token from interceptor");
          const refreshResult = await window.apiClientHandlers.refreshToken();
          
          if (refreshResult) {
            console.log("Token refreshed successfully, retrying request");
            // ส่งคำขอเดิมอีกครั้ง
            return apiClient(originalRequest);
          }
        } else {
          console.log("No refresh token handler available");
          // ถ้าไม่มี handler ให้ลองเรียก API refresh โดยตรง
          try {
            const response = await axios.post('https://backend.qseer.app/api/access/refresh', {}, {
              withCredentials: true
            });
            
            if (response.status === 200) {
              // บันทึกข้อมูลล่าสุด
              localStorage.setItem('userId', response.data.sub);
              localStorage.setItem('userRoles', JSON.stringify(response.data.roles || []));
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('expiration', response.data.exp.toString());
              
              // ส่งคำขอเดิมอีกครั้ง
              return apiClient(originalRequest);
            }
          } catch (directRefreshError) {
            console.error("Direct token refresh failed:", directRefreshError);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed in interceptor:", refreshError);
        
        // ล็อกเอาท์ถ้ามี handler
        if (window.apiClientHandlers && window.apiClientHandlers.logout) {
          await window.apiClientHandlers.logout();
        } else {
          // ล้างข้อมูลผู้ใช้จาก localStorage ถ้าไม่มี handler
          localStorage.removeItem('userId');
          localStorage.removeItem('userRoles');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('expiration');
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;