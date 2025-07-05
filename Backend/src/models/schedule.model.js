import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
    {
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            require:true,
        },
        title: {
            type: String,
            require: true,
        },
        amount: {
            type: Number,
            require: true,
        },
        category:{
            type:String
        },
        startDate:{
            type: Date, 
            required: true
        },
        nextRun:{
            type: Date, required: true
        },
        schedule: {
            type: String,
            enum: ["daily", "monthly", "weekly"],
            default: "pending"
        }
    }
)
const Scheduling =mongoose.model("Scheduling",scheduleSchema);
export default Scheduling;