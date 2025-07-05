// src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Sparkles } from "lucide-react";
import useAuthStore from '../store/useAuthStore';
import axios from "axios"
const COLORS = ["#4b74ed", "#66c1ba", "#fbbf24", "#f87171", "#a78bfa", "#34d399"];



// const lineData = [
//   { month: "Jan", expenses: 2000 },
//   { month: "Feb", expenses: 1800 },
//   { month: "Mar", expenses: 2200 },
//   { month: "Apr", expenses: 2600 },
//   { month: "May", expenses: 2400 },
//   { month: "Jun", expenses: 3000 },
// ];



const Dashboard = () => {

  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [aiSummary, setAiSummary] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {

        const [categoryRes, recentRes, monthlyRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_SERVER}/users/expenses/categoryWise-amount`, { withCredentials: true }),

          axios.get(`${import.meta.env.VITE_SERVER}/users/expenses/all-expenses`, { withCredentials: true }),

          axios.get(`${import.meta.env.VITE_SERVER}/users/expenses/monthwise-expenses`, { withCredentials: true }),
        ]);
        setCategoryStats(categoryRes.data.data);
        // console.log("Category : ",categoryRes.data.data);
        // console.log("Recents expenses  : ", recentRes.data.data.slice(0, 5).reverse());
        console.log(" month res : ",monthlyRes.data.data);
        setMonthlyStats(monthlyRes.data.data);
        setRecentExpenses(recentRes.data.data.slice(0, 5).reverse());
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  // if (loading) return <div>Loading...</div>;
  const [aiLoading, setAiLoading] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const user = useAuthStore((state) => state.user);

  const pieData = categoryStats.map(item => ({
    name: item._id,
    value: item.totalAmount
  }));

  const lineData=monthlyStats.map(item=>({
    month :item.month,
    expenses:item.expenses
  }));
  const handleInsights = async () => {
    setAiLoading(true);
    setShowInsights(true);
    try {
      const insightRes = await axios.get(`${import.meta.env.VITE_SERVER}/users/expenses/monthly-summary`, {
        withCredentials: true,
      });
      console.log("insights res : ", insightRes.data.summary);
      setAiSummary(insightRes.data.summary);
    } catch (error) {
      console.log("error :", error);
      toast.error("Failed to generate Ai insights ! ");
      setAiSummary("Unable to generate insights at the moment.");
    } finally {
      setAiLoading(false);
      setShowInsights(true);
    }
  }

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-auto bg-gray-50 relative">
        <h1 className="text-3xl font-bold text-[#4b74ed] mb-6">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500">Total Spent</h2>
            <p className="text-2xl font-bold">₹{user.expendAmount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500">Budget</h2>
            <p className="text-2xl font-bold">₹{user.budgetAmount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-500">Savings</h2>
            <p className="text-2xl font-bold">₹{user.budgetAmount - user.expendAmount}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Expense by Category</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Tooltip />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Expenses Last 6 Months</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="expenses" stroke="#4b74ed" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Recent Expenses</h2>
          <table className="w-full text-sm">
            <thead className="text-left text-gray-600 border-b">
              <tr>
                <th className="pb-2">Date</th>
                <th className="pb-2">Description</th>
                <th className="pb-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map((expense) => (
                <tr key={expense._id} className="border-b">
                  <td className="py-2">{expense.date.slice(0, 10)}</td>
                  <td className="py-2">{expense.title}</td>
                  <td className="py-2 font-medium">₹{expense.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quote */}
        <p className="italic text-center text-gray-600">“A penny saved is a penny earned.”</p>

        {/* AI Insights Floating Button */}
        <button
          onClick={handleInsights}
          className="fixed bottom-6 right-6 bg-[#4b74ed] text-white px-4 py-2 rounded-full shadow-md hover:bg-[#3a5fc7] transition flex items-center gap-2 z-20"
        >
          <Sparkles size={18} /> AI Insights
        </button>

        {/* Overlay Popup */}
        {showInsights && (
          <>
            <div
              onClick={()=>{
                 setShowInsights(false);
                   setAiSummary("");
              }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10"
            ></div>
            <div className="fixed bottom-20 right-6 bg-white p-4 w-80 rounded-lg shadow-lg z-20">
              <h3 className="text-lg font-semibold mb-2 text-[#4b74ed]">AI Insights</h3>

              {aiLoading ? (
                <div className="text-sm text-gray-500 flex items-center justify-center py-4">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-[#4b74ed]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Generating insights...
                </div>
              ) : (
                <p className="text-sm text-gray-700 whitespace-pre-line">{aiSummary}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
