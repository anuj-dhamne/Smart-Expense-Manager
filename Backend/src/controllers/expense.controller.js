import { asyncHandler } from "../utils/asyncHandler.js";
import { Expense } from "../models/expense.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import Category_pred from '../AI-utils/Category_pred.js'
import predictSummary from "../AI-utils/predictSummary.js";

// In addExpense for uplaoding image error in not resolved
const addExpense = asyncHandler(async (req, res) => {
    // get data from user
    let { title, date, amount, description } = req.body;
    const user_id = req.user._id;
     const user = await User.findById(user_id);
    if (!user) {
    return res.status(404).json("user not found! ");
  }

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

    // console.log("File received : ",req.files)
    let billPhotoUrl = "";
  const billPhotoLocalPath = req.files?.bill_photo?.[0]?.path;
  if (billPhotoLocalPath) {
    const billPhotoUpload = await uploadOnCloudinary(billPhotoLocalPath);
    if (!billPhotoUpload) {
      return res.status(400).json( "Failed to upload bill photo.");
    }
    billPhotoUrl = billPhotoUpload.url;
  }

    const aiCategory = await Category_pred(title);

    // create expense user and upload it on Database
    const expense = await Expense.create({
        title,
        date,
        category: aiCategory.category,
        amount,
        description,
        owner: user_id,
        ...(billPhotoUrl && { bill_photo: billPhotoUrl }) 
    })
    const createdExpense = await Expense.findById(expense._id).select("");
    if (!createdExpense) {
        return res.status(500).json({msg:"Expenses not saved !"});
    }
    user.expendAmount += Number(amount);
    await user.save();
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
    const user_id = req.user._id;
    const user = await User.findById(user_id);
    if (!user) {
    return res.status(404).json("user not found! ");
  }
  console.log("expened Amount : ",user.expendAmount);
    // console.log("Expense ID:", expensesId);
    let { title, date, amount, description } = req.body;
    console.log("Req.body : ",req.body);
    console.log("Amount from frontend : ",amount);
        let billPhotoUrl = "";
    const billPhotoLocalPath = req.files?.bill_photo?.[0]?.path;
    if (billPhotoLocalPath) {
        const billPhotoUpload = await uploadOnCloudinary(billPhotoLocalPath);
        if (!billPhotoUpload) {
        return res.status(400).json( "Failed to upload bill photo.");
        }
        billPhotoUrl = billPhotoUpload.url;
    }
    // validate date is in correct form or not 
    if (date) {
        // Convert from "DD-MM-YYYY" to "YYYY-MM-DD"
        const [day, month, year] = date.split("-");
        date = new Date(`${year}-${month}-${day}`);
        if (isNaN(date)) {
            return res.status(400).json("Invalid date format! Use 'DD-MM-YYYY'.");
        }
    }
    const test = await Expense.findById(expensesId);
    const oldAmount = test.amount;
    console.log("Old amount:",oldAmount);
    if (!test) {
        return res.status(400).json("The fault in params")
    }
    const updatedExpense = await Expense.findByIdAndUpdate(
        expensesId,
        {
            $set: { title, amount,date, description ,...(billPhotoUrl && { bill_photo: billPhotoUrl })}
        },
        {
            new: true
        }
    );
    if (!updatedExpense) {
        return res.status(404).json("Expenses not found");
    }
    user.expendAmount-=Number(oldAmount);
    user.expendAmount+=Number(amount);
    await user.save();

    res.status(200)
        .json(
            new ApiResponse(200, updatedExpense, "Expenses Update successfully !")
        )
}


)

const deleteExpense = asyncHandler(async (req, res) => {
    const expensesId = req.params.id;
    console.log("Expenses ID : ",req.params.id);
     const user_id = req.user._id;
     const user = await User.findById(user_id);
    if (!user) {
    return res.status(404).json("user not found! ");
  }
    if (!expensesId) {
        throw new ApiError(400, "Unauthorised request");
    }
    const expense=await Expense.findById(expensesId);
    const amount=expense.amount;
    const deletedExpense = await Expense.findByIdAndDelete(expensesId);
    console.log(deletedExpense);

    if (!deletedExpense) {
        throw new ApiError(500, "Expenses not deleted");
    }
    user.expendAmount-= Number(amount);
    await user.save();
    return res.status(200)
        .json(new ApiResponse(200, deleteExpense, "Expense Deleted Successfully !"));
})

const getExpenses = asyncHandler(async (req, res) => {
    const user = req.user._id;
    console.log("user: ",user);
    const allExpenses = await Expense.find({ owner: user });
    if (!allExpenses) {
        return res.status(400).json( "No expenses for the user ");
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

const monthWiseAmount=asyncHandler(async(req,res)=>{
    const userId = req.user._id;

    console.log("user: ",userId);
  // Current date
  const now = new Date();

  // 6 months ago
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 5); // Include current month
console.log(" now date : ",now, " sixMonth ago : ",sixMonthsAgo);
  const data = await Expense.aggregate([
    {
      $match: {
        owner: userId.toString(),
        date: { $gte: sixMonthsAgo, $lte: now }
      }
    },
    {
      $group: {
        _id: { $month: "$date" },
        totalAmount: { $sum: "$amount" }
      }
    },
    {
      $sort: { "_id": 1 }
    }
  ]);
    console.log(" The data from DB : ",data);
  // Convert month number to month name
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formatted = data.map(item => ({
    month: monthNames[item._id - 1],
    expenses: item.totalAmount
  }));

  console.log("Formated data :",formatted);

  res.status(200).json({
    success: true,
    data: formatted
  });
});

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

    // console.log("Manual Testing",await Expense.find({date: { $gte: new Date("2025-06-01T00:00:00.000Z"), $lte: new Date("2025-06-30T00:00:00.000Z")}}));
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
    monthWiseAmount
}