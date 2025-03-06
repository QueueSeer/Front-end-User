import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// นำเข้าหน้าต่างๆ
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import HomePage from "./pages/HomePage";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* หน้าที่เข้าถึงได้โดยไม่ต้องล็อกอิน */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* หน้าที่ต้องล็อกอินเข้าใช้ */}
          <Route path="/homepage" element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } />

          {/* หน้าที่ต้องมีบทบาทเฉพาะ เช่น 'seer' */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRoles={['seer']}>
              <div>Admin Page</div>
            </ProtectedRoute>
          } />

          {/* Default route */}
          <Route path="/" element={<Login />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;