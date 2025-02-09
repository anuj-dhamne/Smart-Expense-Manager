import React, { useEffect, useState } from 'react'
import { ExpensesBar } from '../components'
import axios from 'axios';
import { Link } from 'react-router';



function ViewExpenses() {

  const [userExpenses,setUserExpenses]=useState([]);


  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/users/expenses/all-expenses");
        setUserExpenses(response.data.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses(); 
  }, []);

  return (
    <>
    <h1>Expenses List</h1>
    <div className="ok">
       {userExpenses.length>0 ?
        (userExpenses.map((field)=>
        (  <ExpensesBar key={field._id} _id={field._id} title={field.title} amount={field.amount} date={field.date.slice(0,10) }/>)
        )) : (
          <>
           <h4>No Expenses Found</h4>
           <br />
          <Link to="/add-expenses">Add expenses !</Link>
          </>
         
          
        )
       }
    </div>
    </>
  )
}

export default ViewExpenses