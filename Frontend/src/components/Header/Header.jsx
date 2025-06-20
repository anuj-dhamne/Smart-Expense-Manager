import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./Header.css"
import axios from "axios"
import { AuthContext } from '../../context/AuthContext.jsx'



function Header() {

    const {isAuthenticated,setIsAuthenticated}=useContext(AuthContext);
    const navigate=useNavigate();
    const logout=async()=>{
        await axios.post("http://localhost:3000/api/v1/users/logout");
        setIsAuthenticated(false);
        alert("User Logout Successfully ! ")
        navigate("/login");
    }
    // useEffect(()=>{navigate("/")},[logout]);
    return (
        <div className="nav">
            <div className="navLogo">
                <Link to="/"><img src="../../images/Logo.png" alt="Logo" /></Link>
            </div>
               
            <div className="navElement">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/add-expenses">Add Expenses</Link></li>
                <li><Link to="/view-expenses">View Expenses</Link></li>
                <li><Link to="/trends">Trends</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li onClick={()=>{logout()}}>Logout</li>
                {/* <button onClick={()=>{logout()}}>Logout</button> */}
            </ul>
            </div>
            {/* <button className="theme-toggle">Toggle Theme</button> */}
        </div>
    )
}

export default Header