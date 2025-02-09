import React from 'react'
import "./bar.css"
import axios from 'axios'

function ExpensesBar({title,amount,date,_id}) {

  const deleteExpense=async()=>{
    try {
      await axios.delete(`http://localhost:3000/api/v1/users/expenses/delete-expense/${_id}`);
      console.log("Expenses id : ",_id);
      alert("Expense get deleted Succesfully !")
    } catch (error) {
      console.log("Error while deleting expenses: ",error)
    }
  }
  return (
    <div className='mainContainer'>
        <div className="title">{title}</div>
        <div className="amnt">{amount}</div>
        <div className="date">{date}</div>
        <div className="icon" id='edit'><i className="fa-solid fa-pen-to-square"></i></div>
       
        <div className="icon" id='delete' onClick={deleteExpense}><i className="fa-solid fa-trash" ></i></div>
    </div>
  )
}

export default ExpensesBar