// src/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Dashboard from "./pages/Dashboard.jsx";
import Expenses from "./pages/Expenses.jsx";
import Recurrings from "./pages/Recurrings.jsx";
import Profile from "./pages/Profile";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup.jsx";

const Layout = ({ children }) => (
  <div className="flex">
    <Sidebar />
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">{children}</div>
  </div>
);

const AppRoutes = () => {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup/>} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <Layout>
              <Expenses />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/* <Route
        path="/recurrings"
        element={
          <ProtectedRoute>
            <Layout>
              <Recurrings />
            </Layout>
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
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
