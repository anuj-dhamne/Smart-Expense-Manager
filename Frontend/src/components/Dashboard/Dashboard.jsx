import React, { useEffect, useState } from 'react'
import "./Dashboard.css"
import {Card,LinkButton} from "../index.js"
import axios from 'axios';

function Dashboard() {

  let [totalExpenses,setTotalExpenses]=useState(0);
  let [budget,setBudget]=useState(0);
  let [remainAmount,setRemainAmount]=useState(0);
  
  useEffect(()=>{
    const getData=async()=>{
      // Total Expended Amount 
      const getExpendAmount= await axios.get("http://localhost:3000/api/v1/users/expenses/expended-amount")
      console.log("get Expended Amount ! ",getExpendAmount.data.data[0].totalAmount);
      setTotalExpenses(getExpendAmount.data.data[0].totalAmount);

      // Getting total budget of user
      const user=await axios.get("http://localhost:3000/api/v1/users/current-user");
      console.log("Current User",user.data.data.
        budgetAmount);
        setBudget(user.data.data.
          budgetAmount);
    }
    getData();
  },[])
  return (
   <div className="dashboardMain">
    <h1>DashBoard</h1>
   <div className="dashboard">
    <Card children="Total Expenses" amount={totalExpenses}/>
        <Card children="Budget" amount={budget}/>
        <Card children="Remaining Amount" amount={budget-totalExpenses}/>
   </div>
   <div className="btnss">
      <LinkButton children="Add Expenses" url="add-expenses"/>

      <LinkButton children="View Expenses" url="view-expenses"/>
   </div>
   </div>
  )
}

export default Dashboard