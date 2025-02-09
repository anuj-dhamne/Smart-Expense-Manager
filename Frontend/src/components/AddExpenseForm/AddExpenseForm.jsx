import React, { useState } from 'react'
import LinkButton from '../LinkButton/LinkButton'
import "./form.css"
import Btn from '../Btn/Btn';
import { useNavigate } from 'react-router';
import axios from 'axios';


function AddExpenseForm() {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    title:"",
    category:"",
    amount:"",
    date:"",
    bill:"",
    description:""
  });

  const handleChange = (event) => {
    const { name, value,type,files } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type==="file"?files[0]:value,
    }))
  }
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    // getting token from the local storage
    const token =localStorage.getItem("token"); 

    try {
      const fd=new FormData();
      fd.append("title",formData.title);
      fd.append("category",formData.category);
      fd.append("date",formData.date);
      fd.append("amount",formData.amount);
      fd.append("bill_photo",formData.bill);
      fd.append("description",formData.description);

      // console.log("Sending API request ...");
      await axios.post("http://localhost:3000/api/v1/users/expenses/add-expense",fd,
        {
          headers:{
              "Content-Type": "multipart/form-data",
              // here is the use of token
              Authorization:`Bearer ${token}`,
          }
        }
      ).then(response => console.log("Response Data:", response.data))
      .catch(error => {
        console.log("Axios Error:", error); 
        if (error.response) {
          console.log("Error Data:", error.response.data); // Backend error
          console.log("Status Code:", error.response.status); // HTTP status
        } else if (error.request) {
          console.log("No response received!", error.request); // Network issue
        } else {
          console.log("Axios Setup Error", error.message); // Axios config issue
        }
      });
      setFormData({title:"",category:"",amount:"",date:"",description:"",bill:""});
      alert("Expense get added ! ");
      navigate("/");
    } catch (error) {
      console.log("Error in Creating Expenses : ",error);
    }
  }

  return (
    <div className="main">
      <form action="" onSubmit={onSubmitHandler}>

        <div className="subDiv">
          <label htmlFor="title">Title : </label>

          <input type="text" placeholder='Title of Your Expense' name='title' id='title' value={formData.title} onChange={(e) => handleChange(e)} required />
        </div>


        <div className="subDiv">
          <label htmlFor="category">Category : </label>
          <select name="category" placeholder="Choose Category" id="category" value={formData.category} onChange={(e) => handleChange(e)} required>
            <option value=""></option>
            <option value="Food">Food & Dining</option>
            <option value="Travel">Travel</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Utilites">Utilites</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        <div className="subDiv">
          <label htmlFor="amount">Amount : </label>
          <input type="number" placeholder=" Amount in Rupees" name="amount" id="amount" value={formData.amount} onChange={(e) => handleChange(e)} required/>
        </div>

        <div className="subDiv">
          <label htmlFor="date">Date : </label>
          <input type="date" name="date" id="date" value={formData.date} onChange={(e) => handleChange(e)} required />
        </div>

        <div className="subDiv">
          <label htmlFor="date">Bill : </label>
          <input type="file" name="bill" id="bill"  onChange={(e) => handleChange(e)} required />
        </div>

        <div className="subDiv">
          <label htmlFor="description">Description : </label>
          <textarea name="description" placeholder=' Write Here ...' id="description" value={formData.description} onChange={(e) => handleChange(e)} required></textarea>
        </div>

        <div className=" btnBox" >
        <Btn children="Cancel" onClick={()=>navigate("/")} type="button" />


        <Btn type="submit" children="Submit" />
        
       
      </div>
      </form>
  
    </div>
  )
}

export default AddExpenseForm