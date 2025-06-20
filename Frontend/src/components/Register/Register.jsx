import React, { useState } from "react";
import axios from "axios"
import {Btn} from "../index.js"
import "./register.css"
import { Link } from "react-router";
import { useNavigate } from "react-router";

const Register = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    email: "",
    avator: null,
    budgetAmount: ""
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("we are in handle submiit function")
    try {
        const fd=new FormData();
        fd.append("username",formData.username);
        fd.append("name",formData.name);
        fd.append("email",formData.email);
        fd.append("password",formData.password);
        fd.append("avator",formData.avator);
        fd.append("budgetAmount",formData.budgetAmount);
        // http://localhost:3000/api/v1/users

        const res= await axios.post("http://localhost:3000/api/v1/users/register",formData,
            {
                headers:{
                    "Content-Type": "multipart/form-data",
                }
            }
        );
        console.log(res.data);
        alert("Used Registeration suceessfully ! ")
        navigate("/login");
    } catch (error) {
        console.log(error.response?.data || "Error in registration");
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="file" name="avator" onChange={handleChange} />
        <input type="number" name="budgetAmount" placeholder="Budget Amount" onChange={handleChange} required />
        <div className="btns-grp">
          {/* <button type="button">Cancel</button> */}
          
          <Btn children="Reset" type="reset" />

          {/* <button type="submit" >Register</button> */}
          <Btn children="Submit" type="submit"/>
        </div>
      </form>
      <br />
      <Link to="/login">If already a user</Link>
    </div>
  );
};

export default Register;
