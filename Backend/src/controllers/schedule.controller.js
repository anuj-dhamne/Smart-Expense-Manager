import {Scheduling} from "../models/schedule.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Expense } from "../models/expense.model.js"
import { User } from "../models/user.model.js"
import predictCategory from "../AI-utils/Category_pred.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addRecurring = asyncHandler(async (req,res)=>{
    const {title,amount,startDate,frequency}=req.body;
    const user_id=req.user._id;
    const user= await User.findById(user_id);
    if(!user){
        return res.status(400).json("Unauthorised Request!");
    }
    const nextRun=new Date(startDate);
    const category= await predictCategory(title);
    const newReccuring=await Scheduling.create({
        owner:user_id,title,
        amount,frequency,startDate,nextRun,category
    });
    if(!newReccuring){
        return res.status(500).json("Recurring not get saved");
    }
    return res.status(200).json(new ApiResponse(200, newReccuring, "all Expnses of login users"));
    

});

const deleteRecurring =asyncHandler(async(req,res)=>{
    const reccuringId = req.params.id;
        console.log("recurring ID : ",req.params.id);
        if (!reccuringId) {
           return res.status(400)( "Unauthorised request");
        }
        const deletedRecurr = await Scheduling.findByIdAndDelete(reccuringId);
        console.log(deletedRecurr);
    
        if (!deletedRecurr) {
            return res.status(500)("Expenses not deleted");
        }
        return res.status(200)
            .json(new ApiResponse(200, deleteExpense, "Recurrence Deleted Successfully !"));
});

const updateRecurring =asyncHandler(async(req,res)=>{
const recurrId = req.params.id;
    const user_id = req.user._id;
    const user = await User.findById(user_id);
    if (!user) {
    return res.status(404).json("user not found! ");
  }
    let { title, date, amount,frequency } = req.body;
    console.log("Req.body : ",req.body);
    console.log("Amount from frontend : ",amount);
        
    if (date) {
        // Convert from "DD-MM-YYYY" to "YYYY-MM-DD"
        const [day, month, year] = date.split("-");
        date = new Date(`${year}-${month}-${day}`);
        if (isNaN(date)) {
            return res.status(400).json("Invalid date format! Use 'DD-MM-YYYY'.");
        }
    }
    const nextRun=new Date(startDate);
    const updatedRecurr = await Scheduling.findByIdAndUpdate(
       recurrId,
        {
            $set: { title, amount,date, frequency,nextRun}
        },
        {
            new: true
        }
    );
    if (!updatedRecurr) {
        return res.status(404).json("Expenses not found");
    }
    res.status(200)
        .json(
            new ApiResponse(200, updatedRecurr, "Recurr Update successfully !")
        )
});
const getAlRecurring =asyncHandler(async(req,res)=>{
    const user = req.user._id;
        console.log("user: ",user);
        const allRecurring = await Scheduling.find({ owner: user });
        if (!allRecurring) {
            return res.status(400).json( "No expenses for the user ");
        }
        return res.
            status(200)
            .json(new ApiResponse(200, allRecurring, "all Expnses of login users"));
});
export {
   addRecurring ,deleteRecurring,updateRecurring,getAlRecurring
}

