import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore.js";

const ProtectedLayout = ({children}) => {
 const isLoggedIn = useAuthStore((state) => state.isLoggedIn); 

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedLayout;
