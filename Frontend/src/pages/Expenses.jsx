// src/pages/Expenses.jsx

import { useState,useEffect } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import{toast} from "react-hot-toast"
import axios from "axios"

// const dummyExpenses = [
//   {
//     id: 1,
//     title: "Groceries",
//     category: "Food",
//     date: "2025-06-20",
//     amount: 2500,
//     description: "Bought vegetables and fruits",
//     bill_photo: "https://via.placeholder.com/150",
//   },
//   {
//     id: 2,
//     title: "Electricity Bill",
//     category: "Utilities",
//     date: "2025-06-18",
//     amount: 1200,
//     bill_photo: null,
//   },
// ];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    amount: "",
    description: "",
    bill_photo: null,
    category: "",
  });

    useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER}/users/expenses/all-expenses`, { withCredentials: true });
        console.log(res.data.data);
        setExpenses(res.data.data);
      } catch (err) {
        console.error("Failed to fetch expenses", err);
        if(err.status===400){
          toast.error("No Expense !");
        }else{
          toast.error("Failed to load expenses");
        }
      }
    };

    fetchExpenses();
  }, []);
  
  const openAddPopup = () => {
    setFormData({ title: "", date: "", amount: "", description: "", bill_photo: null, category: "" });
    setIsAdding(true);
  };

  const openEditPopup = (expense) => {
    setFormData({ ...expense });
    setSelectedExpense(expense);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_SERVER}/users/expenses/delete-expense/${id}`, { withCredentials: true });
      setExpenses((prev) => prev.filter((exp) => exp._id !== id));
      setSelectedExpense(null);
      toast.success("Expense deleted");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete expense");
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("date", formData.date);
      form.append("amount", formData.amount);
      form.append("description", formData.description);
      form.append("category", formData.category);

      if (formData.bill_photo && !formData.bill_photo.startsWith?.("http")) {
        const blob = await fetch(formData.bill_photo).then((res) => res.blob());
        form.append("bill_photo", blob, "bill.jpg");
      }

      if (isAdding) {
        const res = await axios.post(`${import.meta.env.VITE_SERVER}/users/expenses/add-expense`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setExpenses((prev) => [...prev, res.data.data]);
        toast.success("Expense added");
      } else {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER}/users/expenses/update-expense/${selectedExpense._id}`, {
          title:formData.title,amount:formData.amount,date:formData.date,description:formData.description,
        }, {
          // headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        setExpenses((prev) =>
          prev.map((exp) => (exp._id === selectedExpense._id ? res.data.data : exp))
        );
        toast.success("Expense updated");
      }

      setIsAdding(false);
      setIsEditing(false);
      setSelectedExpense(null);
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("Failed to save expense");
    }
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 relative">
      <h1 className="text-3xl font-bold text-[#4b74ed] mb-6">Expenses</h1>

      {/* Expense List */}
      <div className="flex flex-col gap-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition flex justify-between items-center"
            onClick={() => setSelectedExpense(expense)}
          >
            <span className="text-sm text-gray-500 w-1/4">{expense.date.slice(0,10)}</span>
            <span className="font-semibold w-1/4 text-[#4b74ed]">{expense.title}</span>
            <span className="text-sm text-gray-600 w-1/4">{expense.category || "N/A"}</span>
            <span className="font-medium w-1/4 text-right">₹{expense.amount}</span>
          </div>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={openAddPopup}
        className="fixed bottom-6 right-6 bg-[#4b74ed] hover:bg-[#3a5fc7] text-white p-4 rounded-full shadow-lg transition"
      >
        <Plus size={24} />
      </button>

      {/* View Expense Popup */}
      {selectedExpense && !isEditing && (
        <>
          <div className="fixed inset-0 bg-black/30 z-10" onClick={() => setSelectedExpense(null)}></div>
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-20 w-96">
            <h2 className="text-xl font-bold text-[#4b74ed] mb-2">{selectedExpense.title}</h2>
            {selectedExpense.bill_photo && (
              <a
                href={selectedExpense.bill_photo}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-4"
              >
                <img
                  src={selectedExpense.bill_photo}
                  alt="Bill"
                  className="w-full h-40 object-cover rounded hover:opacity-90 transition"
                />
              </a>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => openEditPopup(selectedExpense)}
                className="flex-1 bg-blue-100 text-blue-600 font-semibold py-2 rounded hover:bg-blue-200 transition"
              >
                <Pencil size={16} className="inline-block mr-1" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(selectedExpense._id)}
                className="flex-1 bg-red-100 text-red-600 font-semibold py-2 rounded hover:bg-red-200 transition"
              >
                <Trash2 size={16} className="inline-block mr-1" />
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Form Popup */}
      {(isAdding || isEditing) && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-10"
            onClick={() => {
              setIsAdding(false);
              setIsEditing(false);
              setSelectedExpense(null);
            }}
          ></div>
          <form
            onSubmit={handleSubmit}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-20 w-96 space-y-4"
          >
            <h2 className="text-xl font-semibold text-[#4b74ed]">
              {isAdding ? "Add Expense" : "Edit Expense"}
            </h2>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            {/* <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border rounded"
              required
            /> */}
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bill_photo: e.target.files[0]
                    ? URL.createObjectURL(e.target.files[0])
                    : null,
                })
              }
              className="w-full"
            />
            <button
              type="submit"
              className="bg-[#66c1ba] text-white w-full py-2 rounded hover:bg-[#58a69f] transition"
            >
              Submit
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Expenses;
