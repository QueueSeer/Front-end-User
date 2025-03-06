import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// สร้าง context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ตรวจสอบสถานะการล็อกอินเมื่อโหลดแอป
  useEffect(() => {
    const checkLoginStatus = async () => {
      // ตรวจสอบ localStorage ว่ามีข้อมูลการล็อกอินหรือไม่
      if (localStorage.getItem('isLoggedIn') === 'true') {
        // ตรวจสอบว่า token หมดอายุหรือยัง
        const expTime = Number(localStorage.getItem('expiration') || '0');
        const now = Math.floor(Date.now() / 1000);

        if (expTime > now) {
          // Token ยังไม่หมดอายุ
          try {
            // เรียกใช้ API เพื่อตรวจสอบ token ว่ายังใช้งานได้
            const response = await axios.get('https://backend.qseer.app/api/access/read_token', {
              withCredentials: true
            });
            
            // อัปเดตข้อมูลผู้ใช้
            setUser({
              id: localStorage.getItem('userId'),
              roles: JSON.parse(localStorage.getItem('userRoles') || '[]'),
              exp: expTime
            });
          } catch (error) {
            // Token มีปัญหา ลองใช้ refresh
            try {
              await refreshToken();
            } catch (refreshError) {
              // Refresh ไม่สำเร็จ ล้างข้อมูลผู้ใช้
              logout();
            }
          }
        } else {
          // Token หมดอายุ ลองใช้ refresh
          try {
            await refreshToken();
          } catch (refreshError) {
            // Refresh ไม่สำเร็จ ล้างข้อมูลผู้ใช้
            logout();
          }
        }
      }
      
      setLoading(false);
    };

    checkLoginStatus();
    
    // ตั้ง timer เพื่อรีเฟรช token เมื่อใกล้หมดอายุ
    const refreshInterval = setInterval(async () => {
      if (user) {
        const now = Math.floor(Date.now() / 1000);
        // หาก token จะหมดอายุภายใน 5 นาที (300 วินาที)
        if (user.exp - now < 300) {
          await refreshToken();
        }
      }
    }, 60000); // ตรวจสอบทุก 1 นาที
    
    return () => clearInterval(refreshInterval);
  }, []);

  // ฟังก์ชันรีเฟรช token
  const refreshToken = async () => {
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
        
        // อัปเดตข้อมูลผู้ใช้
        setUser({
          id: response.data.sub,
          roles: response.data.roles || [],
          exp: response.data.exp
        });
        
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  // ฟังก์ชันล็อกเอาท์
  const logout = async () => {
    try {
      await axios.delete('https://backend.qseer.app/api/access/logout', {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // ล้างข้อมูลผู้ใช้จาก localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('expiration');
    
    setUser(null);
  };

  // ตรวจสอบว่าผู้ใช้มีสิทธิ์ตามบทบาทที่กำหนดหรือไม่
  const hasRole = (requiredRole) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(requiredRole);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      setUser,
      refreshToken, 
      logout,
      hasRole,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};