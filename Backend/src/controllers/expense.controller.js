import { asyncHandler } from "../utils/asyncHandler.js";
import { Expense } from "../models/expense.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// In addExpense for uplaoding image error in not resolved
const addExpense = asyncHandler(async (req, res) => {
    // get data from user
    let { title, date, category, amount, description } = req.body;

    // console.log("Received date from frontend:", date);

    // validate date is in correct form or not 

    if (!date) {
        throw new ApiError(400, "Date is required.");
    }
    if (typeof date === "string") {
        // Convert from "YYYY-MM-DD" to a valid Date object
        date = new Date(date);
    }
    if (isNaN(date.getTime())) {
        throw new ApiError(400, "Invalid date format! Use 'YYYY-MM-DD'.");
    }
    
    // which user created it ?
    const user_id = req.user._id;

    // check all fields are come or not  
    if ([title, category, amount, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required ! ");
    }
    // console.log("File received : ",req.files)
    const billPhotoLocalPath = req.files?.bill_photo?.[0]?.path;
    if(!billPhotoLocalPath){
        throw new ApiResponse(400,"Bill photo is not get send ! ");
    }

    const billPhoto=await uploadOnCloudinary(billPhotoLocalPath);
     
    // create expense user and upload it on Database
    const expense = await Expense.create({
        title,
        date,
        category,
        amount,
        description,
        bill_photo:billPhoto.url,
        owner: user_id
    })
    const createdExpense = await Expense.findById(expense._id).select("");
    if (!createdExpense) {
        throw new ApiError(500, "Something went wrong !")
    }
    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                createdExpense,
                "Expenses created Successfully"
            )
        );

})

const updateExpense = asyncHandler(async (req, res) => {
    const expensesId=req.params.id;
    // console.log("Expense ID:", expensesId);
    let { title, date, category, amount, description } = req.body;

    // validate date is in correct form or not 
    if (date) {
        // Convert from "DD-MM-YYYY" to "YYYY-MM-DD"
        const [day, month, year] = date.split("-");
        date = new Date(`${year}-${month}-${day}`);
        if (isNaN(date)) {
            throw new ApiError(400, "Invalid date format! Use 'DD-MM-YYYY'.");
        }
    }
        if ([title, category, amount, description].some((field) => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required ! ");
        }
        const test=await Expense.findById(expensesId);
        if(!test){
            throw new ApiError(400,"The fault in params")
        }
        const updatedExpense=await Expense.findByIdAndUpdate(
            expensesId,
            {
                $set:{title,category,amount,description}
            },
            {
                new:true
            }
        );
        if(!updatedExpense){
            throw new ApiError(404,"Expenses not found");
        }

        res.status(200)
        .json(
            new ApiResponse(200,updatedExpense,"Expenses Update successfully !")
        )
    }

    
)

const deleteExpense = asyncHandler(async (req, res) => {
    const expensesId=req.params.id;
    if(! expensesId){
        throw new ApiError(400,"Unauthorised request");
    }
    const deletedExpense=await Expense.findByIdAndDelete(expensesId);
    console.log(deletedExpense);
    
    if(!deletedExpense){
        throw new ApiError(500,"Expenses not deleted");
    }
    return res.status(200)
    .json(new ApiResponse(200,deleteExpense,"Expense Deleted Successfully !"));
})

const getExpenses = asyncHandler(async (req, res) => {
    const user=req.user._id;
    if(!user){
        throw new ApiError(400,"Unauthorised Request")
    }
    const allExpenses=await Expense.find({owner:user});
    if(!allExpenses){
        throw new ApiError(400,"No expenses for the user ");
    }
    return res.
    status(200)
    .json(new ApiResponse(200,allExpenses,"all Expnses of login users"));

})

const categoryWiseAmount = asyncHandler(async (req, res) => {
    const user=req.user._id;

    if(!user){
        throw new ApiError(400,"Unauthorised Request ! ");
    }
    const sortedAmount=await Expense.aggregate([
        {
            $match:{owner: user.toString()}
        },
        {
            $group:{
                _id:"$category",
                totalAmount: { $sum: "$amount" }, 
                // expenses:{$push:"$$ROOT"}
            }
        }
    ])
  
    if(!sortedAmount){
        throw new ApiError(500,"something went wrong");
    }

    return res.status(200).json(new ApiResponse(200,sortedAmount,"Category wise segregated data"));
})

const categoryWiseExpense=asyncHandler(async (req,res)=>{
    const user=req.user._id;
    if(!user){
        throw new ApiError(400,"Unauthorised Request ! ");
    }
    const sortedDataAmount=await Expense.aggregate([
        {
            $match:{owner:user.toString()}
        },
        {
            $group:{
                _id:"$category",
                expenses:{$push:"$$ROOT"}
            }
        }
    ])
    if(!sortedDataAmount){
        throw new ApiError(500,"something went wrong");
    }

    return res.status(200).json(new ApiResponse(200,sortedDataAmount,"Category wise segregated data total amount"));
})

const getExpendAmount=asyncHandler(async (req,res)=>{
    const user=req.user._id;
    if(!user){
        throw new ApiError(400,"Unauthorised Request ! ");
    }
    const totalExpenses=await Expense.aggregate([
        {
            $match:{owner:user.toString()}
        },
        {
           $group:{
            _id:null,
            totalAmount:{$sum:"$amount"}
           }
        }
    ])
    if(!totalExpenses){
        throw new ApiError(500,"something went wrong");
    }
    return res.status(200).json(new ApiResponse(200,totalExpenses,"Expended Total Amount"));
})

const monthWiseAmount = asyncHandler(async (req,res)=>{

})

export {
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenses,
    categoryWiseAmount,
    categoryWiseExpense,
    getExpendAmount,
    monthWiseAmount
}