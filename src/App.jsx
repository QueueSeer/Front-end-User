import "./index.css";

import React, { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Auction from "./pages/auction/Auction";
import AuctionDetails from "./pages/auction/AuctionDetails";
import { AuthProvider } from "./pages/Login/contexts/AuthContext";
import BackButton from "./components/bookingcomponent/BackButton";
import BidAuction from "./pages/auction/BidAuction";
import BookingSeer from "./pages/bookingseer/BookingSeer";
import BookingSeer2 from "./pages/bookingseer/BookingSeer2";
import BookingSeer3 from "./pages/bookingseer/BookingSeer3";
import BookingSeer4 from "./pages/bookingseer/BookingSeer4";
import BookingSeer_2 from "./pages/bookingseer/BookingSeer_2";
import BookingSteps from "./components/bookingcomponent/BookingSteps";
import DetailAuction from "./pages/auction/DetailAuction";
import EmailVerification from "./pages/Login/EmailVerification";
import Fillter from "./pages/Login/Fillter";
import FollowerPage from "./pages/followerpage/FollowerPage";
import ForgotPassword from "./pages/Login/ForgotPassword";
import Homepage from "./pages/home/homepage";
import Horoscope from "./pages/horoscope/Horoscope";
import LandingPage from "./pages/landing/LandingPage";
import Login from "./pages/Login/Login";
import PaymentHistoryPage from "./pages/Menu/PaymentHistoryPage";
import ProfileMe from "./pages/Profile/Profile";
import QrSummary from "./pages/Topup/QrSummary";
import QseerSchedulePage from "./pages/ProfileSeer/QseerSchedulePage";
import QueueHistory from "./pages/Menu/Queue/QueueHistory";
import Queuedetails from "./pages/Menu/Queue/Queuedetails";
import Register from "./pages/Login/Register";
import ResetPassword from "./pages/Login/ResetPassword";
import SearchBookingPage from './pages/SearchBooking/SearchBookingPage';
import SearchBookingSeer from './pages/SearchBooking/SearchBookingSeer';
import SummaryPage from "./pages/Topup/SummaryPage";
import TopUpCoins from "./pages/Topup/TopUpCoins";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <AuthProvider> {/* ครอบ Router ด้วย AuthProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<Queuedetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/fillter" element={<Fillter />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/landingPage" element={<LandingPage />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/qseerSchedulePage" element={<QseerSchedulePage />} />
          <Route path="/BookingSeer" element={<BookingSeer />} />
          <Route path="/horoscope" element={<Horoscope />} />
          <Route path="/auction" element={<Auction />} />
          <Route path="/detailAuction/:id" element={<DetailAuction />} />
          <Route path="/bidAuction/:auction_id" element={<BidAuction />} />
          <Route path="/top-up-coins" element={<TopUpCoins />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/auction-details" element={<AuctionDetails />} />
          <Route path="/follower" element={<FollowerPage />} />
          <Route path="/queuehistory" element={<QueueHistory />} />
          <Route path="/queuedetails/:id" element={<Queuedetails />} />
          <Route path="/paymentHistoryPage" element={<PaymentHistoryPage/>} />
          <Route path="/profileme" element={<ProfileMe />} />
          <Route path="/qr-summary" element={<QrSummary/>} />
          <Route path="/verify" element={<EmailVerification />} />
          <Route path="/search-booking" element={<SearchBookingPage />} />
          <Route path="/search-booking-seer" element={<SearchBookingSeer />} />
          
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
            path="/bookingSeer_2"
            element={
              <>
                <BackButton />
                <BookingSteps />
                <BookingSeer_2 />
              </>
            }
          />
          <Route
            path="/bookingSeer3"
            element={
              <>
                <BackButton />
                <BookingSteps />
                <BookingSeer3 />
              </>
            }
          />
          <Route
            path="/bookingSeer4"
            element={
              <div className="mt-[130px]">
                <BookingSteps />
                <BookingSeer4 />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}