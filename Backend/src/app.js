import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app= express();

app.use(cors({
    // origin:process.env.CORS_ORIGIN,
    origin:"http://localhost:5173" ||process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())


//user route imports 
import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users",userRouter)

//expenses route imports
import expenseRoute from "./routes/expense.routes.js"
app.use("/api/v1/users/expenses",expenseRoute)

//  reminder route import 
import reminderRouter from "./routes/reminder.routes.js";
app.use("/api/v1/users/reminder",reminderRouter)
export{app};