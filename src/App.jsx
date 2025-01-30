import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookingSteps from "./components/bookingcomponent/BookingSteps";
import BackButton from "./components/bookingcomponent/BackButton";  // ✅ Import BookingSteps
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
import Fillter from "./pages/Login/Fillter";
import ForgotPassword from "./pages/Login/ForgotPassword";
import ResetPassword from "./pages/Login/ResetPassword";
import LandingPage from "./pages/landing/LandingPage";
import Homepage from "./pages/home/Homepage";
import QseerSchedulePage from "./pages/Profile/QseerSchedulePage";
import BookingSeer from "./pages/bookingseer/BookingSeer";
import BookingSeer2 from "./pages/bookingseer/BookingSeer2";
import BookingSeer3 from "./pages/bookingseer/BookingSeer3";
import BookingSeer4 from "./pages/bookingseer/BookingSeer4";

import "./index.css";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<Fillter />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/fillter" element={<Fillter />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword isDarkMode={isDarkMode} />} />
          <Route path="/landingPage" element={<LandingPage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/qseerSchedulePage" element={<QseerSchedulePage />} />ฃ
          <Route path="/BookingSeer" element={<BookingSeer />} />

         
       
          <Route
            path="/bookingSeer2"
            element={
              <>
                <BackButton />
                <BookingSteps />
                <BookingSeer2 />
              </>
            }
          />
          <Route
            path="/bookingSeer3"
            element={
              <>
                <BookingSteps />
                <BookingSeer3 />
              </>
            }
          />
          <Route
            path="/bookingSeer4"
            element={
              <>
                <BookingSteps />
                <BookingSeer4 />
              </>
            }
          />
        </Routes>
     
    </Router>
  );
}
