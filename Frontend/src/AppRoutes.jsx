// src/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Dashboard from "./pages/Dashboard.jsx";
import Expenses from "./pages/Expenses.jsx";
import Profile from "./pages/Profile.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Signup from "./pages/Signup.jsx";
import { useState } from "react";

const Layout = ({ children, isOpen ,setIsOpen}) => (
  <div className="flex">
    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    <div className={`flex-1 p-6 bg-gray-50 min-h-screen transition-all duration-300 ${isOpen ? "ml-[240px]" : "ml-[60px]"}`}>
      {children}
    </div>
  </div>
);

const AppRoutes = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
                <Expenses />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout isOpen={isOpen} setIsOpen={setIsOpen}>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;