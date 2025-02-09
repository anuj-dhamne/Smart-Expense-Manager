import React, { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router";
axios.defaults.withCredentials = true;

const Login = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("We are in login function")
    try {
      const fd=new FormData();
      fd.append("username",formData.username);
      fd.append("password",formData.password);

      const response= await axios.post("http://localhost:3000/api/v1/users/login",formData, 
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        },
        {
          withCredentials:true
        }
      );
      // console.log(response)
      // const token=response.data.data.refreshToken;
      // console.log("Refresh Token : ",token)

      // storing refreshToken in localStorage
      // localStorage.setItem("token",token);
      console.log("Login Successful:", response.data);
      alert("Used Logged in Successfully !")
      navigate("/");
  } catch (error) {
      console.log(error.response?.data || "Error in Login");
  }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;
