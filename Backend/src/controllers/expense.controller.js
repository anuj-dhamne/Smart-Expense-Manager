import { asyncHandler } from "../utils/asyncHandler.js";
import { Expense } from "../models/expense.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Category_pred from '../AI-utils/Category_pred.js'
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import predictSummary from "../AI-utils/predictSummary.js";

// In addExpense for uplaoding image error in not resolved
const addExpense = asyncHandler(async (req, res) => {
    // get data from user
    let { title, date, amount, description } = req.body;

    console.log("Received title from frontend:", title);

    // validate date is in correct form or not 
    console.log("Date come from frontend : ",date);
    if (!date) {
        return res.status(400).json({ message: "date is not there ! " });
    }
    if (typeof date === "string") {
        // Convert from "YYYY-MM-DD" to a valid Date object
        date = new Date(date);
    }

    console.log("Date after convert into valid date object : ",date);
    date = date.toISOString();
    console.log("Date after converting in ISOstring : ",date);
    // if (isNaN(date.getTime())) {
    //     return  res.status(400).json({message:"Invalid date format! Use 'YYYY-MM-DD'."});
    // }

    // which user created it ?
    const user_id = req.user._id;

    // console.log("File received : ",req.files)
    const billPhotoLocalPath = req.files?.bill_photo?.[0]?.path;
    if (!billPhotoLocalPath) {
        throw new ApiResponse(400, "Bill photo is not get send ! ");
    }

    const billPhoto = await uploadOnCloudinary(billPhotoLocalPath);

    const aiCategory = await Category_pred(title);

    // create expense user and upload it on Database
    const expense = await Expense.create({
        title,
        date,
        category: aiCategory.category,
        amount,
        description,
        bill_photo: billPhoto.url,
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
    const expensesId = req.params.id;
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
    const test = await Expense.findById(expensesId);
    if (!test) {
        throw new ApiError(400, "The fault in params")
    }
    const updatedExpense = await Expense.findByIdAndUpdate(
        expensesId,
        {
            $set: { title, category, amount, description }
        },
        {
            new: true
        }
    );
    if (!updatedExpense) {
        throw new ApiError(404, "Expenses not found");
    }

    res.status(200)
        .json(
            new ApiResponse(200, updatedExpense, "Expenses Update successfully !")
        )
}


)

const deleteExpense = asyncHandler(async (req, res) => {
    const expensesId = req.params.id;
    if (!expensesId) {
        throw new ApiError(400, "Unauthorised request");
    }
    const deletedExpense = await Expense.findByIdAndDelete(expensesId);
    console.log(deletedExpense);

    if (!deletedExpense) {
        throw new ApiError(500, "Expenses not deleted");
    }
    return res.status(200)
        .json(new ApiResponse(200, deleteExpense, "Expense Deleted Successfully !"));
})

const getExpenses = asyncHandler(async (req, res) => {
    const user = req.user._id;
    if (!user) {
        throw new ApiError(400, "Unauthorised Request")
    }
    const allExpenses = await Expense.find({ owner: user });
    if (!allExpenses) {
        throw new ApiError(400, "No expenses for the user ");
    }
    return res.
        status(200)
        .json(new ApiResponse(200, allExpenses, "all Expnses of login users"));

})

const categoryWiseAmount = asyncHandler(async (req, res) => {
    const user = req.user._id;

    if (!user) {
        throw new ApiError(400, "Unauthorised Request ! ");
    }
    const sortedAmount = await Expense.aggregate([
        {
            $match: { owner: user.toString() }
        },
        {
            $group: {
                _id: "$category",
                totalAmount: { $sum: "$amount" },
                // expenses:{$push:"$$ROOT"}
            }
        }
    ])

    if (!sortedAmount) {
        throw new ApiError(500, "something went wrong");
    }

    return res.status(200).json(new ApiResponse(200, sortedAmount, "Category wise segregated data"));
})

const categoryWiseExpense = asyncHandler(async (req, res) => {
    const user = req.user._id;
    if (!user) {
        throw new ApiError(400, "Unauthorised Request ! ");
    }
    const sortedDataAmount = await Expense.aggregate([
        {
            $match: { owner: user.toString() }
        },
        {
            $group: {
                _id: "$category",
                expenses: { $push: "$$ROOT" }
            }
        }
    ])
    if (!sortedDataAmount) {
        throw new ApiError(500, "something went wrong");
    }

    return res.status(200).json(new ApiResponse(200, sortedDataAmount, "Category wise segregated data total amount"));
})

const getExpendAmount = asyncHandler(async (req, res) => {
    const user = req.user._id;
    if (!user) {
        throw new ApiError(400, "Unauthorised Request ! ");
    }
    const totalExpenses = await Expense.aggregate([
        {
            $match: { owner: user.toString() }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }
            }
        }
    ])
    if (!totalExpenses) {
        throw new ApiError(500, "something went wrong");
    }
    return res.status(200).json(new ApiResponse(200, totalExpenses, "Expended Total Amount"));
})

const getMonthlySummary = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Assumes auth middleware adds user object

    console.log("user : ", userId);

    // Get current date
    const today = new Date();

    // Get start of the month (first day)
    const currentMonthStart = new Date(Date.UTC(today.getFullYear(), today.getMonth(), 1));

    // Get end of the month (last day)
    const currentMonthEnd = new Date(Date.UTC(today.getFullYear(), today.getMonth() + 1, 0));

    const prevMonthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));
    const prevMonthEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 0));

    console.log("Manual Testing",await Expense.find({date: { $gte: new Date("2025-06-01T00:00:00.000Z"), $lte: new Date("2025-06-30T00:00:00.000Z")}}));
    const currentExpenses = await Expense.find({
        owner: userId,
        date: { $gte: currentMonthStart, $lte: currentMonthEnd }
    });
    console.log("Current Expenses:", currentExpenses);

    const previousExpenses = await Expense.find({
        owner: userId,
        date: { $gte: prevMonthStart, $lte: prevMonthEnd }
    });
    console.log("Previous Expenses:", previousExpenses);

    const groupByCategory = (expenses) => {
        const grouped = {};
        for (let e of expenses) {
            grouped[e.category] = (grouped[e.category] || 0) + e.amount;
        }
        return grouped;
    };

    const currentData = groupByCategory(currentExpenses);
    const previousData = groupByCategory(previousExpenses);

    const summary = await predictSummary(currentData, previousData);

    res.status(200).json({
        summary,
        currentMonth: currentData,
        previousMonth: previousData
    });
});



export {
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenses,
    categoryWiseAmount,
    categoryWiseExpense,
    getExpendAmount,
    getMonthlySummary,
}