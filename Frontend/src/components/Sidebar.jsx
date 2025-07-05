// src/components/Sidebar.jsx
import { useState } from "react";
import useAuthStore from '../store/useAuthStore.js';
import { toast } from 'react-hot-toast';
import {
  Menu,
  LayoutDashboard,
  List,
  Repeat,
  User,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
  { name: "Expenses", icon: <List size={20} />, path: "/expenses" },
  { name: "Profile", icon: <User size={20} />, path: "/profile" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_SERVER}/users/logout`, {}, { withCredentials: true });
      logout();
      toast.success("User Logout !");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to Logout !");
    }
  };

  return (
    <div
      className={`h-screen bg-white shadow-md flex flex-col justify-between transition-all duration-300 ${isOpen ? "w-60" : "w-16"
        } fixed`}
    >
      <div>
        <div className="flex items-center justify-between p-4 border-b">
          <h1
            className={`text-xl font-extrabold text-[#4b74ed] transition-all duration-300 ${isOpen ? "block" : "hidden"
              }`}
          >
            Buck<span className="text-[#66c1ba]">Bit</span>
          </h1>
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu size={22} className="text-[#4b74ed]" />
          </button>
        </div>

        <nav className="mt-6 space-y-1 px-2">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.path;
            return (
              <NavLink
                to={item.path}
                key={idx}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 
                ${isOpen ? "justify-start" : "justify-center"} 
                ${isActive ? "bg-[#66c1ba]/20" : "text-gray-700 hover:bg-[#66c1ba]/10"}
                `}
              >
                {item.icon}
                {isOpen && <span className="text-md font-medium">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="mb-4 px-2" onClick={handleLogout}>
        <div
          className={`flex items-center gap-3 p-3 rounded-lg text-red-500 cursor-pointer transition-all duration-300 hover:bg-red-100 ${isOpen ? "justify-start" : "justify-center"
            }`}
        >
          <LogOut size={20} />
          {isOpen && <span className="text-md font-medium">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;