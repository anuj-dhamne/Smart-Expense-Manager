import React, { useEffect, useState } from 'react'
import "./Profile.css"
import { use } from 'react';
import axios from 'axios';

function Profile() {

    const [user,setUser]=useState({});

    useEffect(()=>{
      const funct=async()=>{
        const userData=await axios.get("http://localhost:3000/api/v1/users/current-user");
      console.log("User data : ",userData.data.data)
      setUser(userData.data.data)
      }
      funct();
    },[])
  
    return (
      <div className="profile-card">
        {/* Profile Photo */}
        <div className="profile-photo">
          <img
            src={user.avator || "https://via.placeholder.com/150"}
            alt="Profile"
          />
        </div>
  
        {/* User Info */}
        <div className="user-info">
          <h2 className="username">{user.username}</h2>
          <p className="fullname">{user.name}</p>
          <p className="email">{user.email}</p>
        </div>
  
        {/* Buttons */}
        <div className="button-group">
          <button className="edit-btn">Edit Profile</button>
          <button className="logout-btn">Log Out</button>
        </div>
      </div>
    );
}

export default Profile