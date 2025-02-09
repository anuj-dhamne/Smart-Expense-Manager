import React, { useEffect, useState } from 'react'
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import "./trend.css"
import sampleData from "./sampleData.json"
import axios from "axios"

function Trends() {
  const colorMap = {
    food: "#FF6384",
    travel: "#36A2EB",
    entertainment: "#FFCE56",
    health: "#4BC0C0",
    utilites: "#9966FF",
    miscellaneous: "#FF9F40"
  };
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const funct = async () => {
      try {
        const user = await axios.get("http://localhost:3000/api/v1/users/expenses/categoryWise-amount");
        console.log("User : ", user.data.data);
        const transFormedData=user.data.data.map(item=>({
          label:item._id,
          value:item.totalAmount,
          color:colorMap[item._id] ||"red",
        }))
        setTrendData(transFormedData);
      } catch (error) {
        console.log("Error in getting data for trends : ",error);
      }

    }
    funct();
  }, []);
  return (
    <>
      <div className="divs">
        {/* <div className="div">
          <Bar
            data={{
              labels: ["A", "B", "C"],
              datasets: [
                {
                  label: "Revenue",
                  data: [100, 300, 300],
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
                {
                  label: "Loss",
                  data: [200, 300, 300],
                  backgroundColor: "rgba(255, 99, 132, 0.6)",
                },
              ],
            }} />
        </div> */}
        <div className="div">
          <Doughnut
            data={{
              labels: trendData.map((data) => data.label),
              datasets: [
                {
                  label: "Price",
                  data: trendData.map((data) => data.value),
                  backgroundColor:trendData.map((data) => data.color)
                }
              ],
            }} />
        </div>
        {/* <div className="div">
          <Line
            data={{
              labels: ["A", "B", "C"],
              datasets: [
                {
                  label: "Revenue",
                  data: [200, 300, 300],
                },
                {
                  label: "Loss",
                  data: [100, 345, 90],
                },

              ],
            }} />
        </div> */}
      </div>
    </>
  )
}

export default Trends