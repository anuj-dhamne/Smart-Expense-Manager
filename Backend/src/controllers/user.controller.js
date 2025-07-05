import { User } from "../models/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"


const generateAccessAndRefreshToken=async(userId)=>{
    try {
        const user=await User.findById(userId);
        if(!user){
            throw new ApiError(404,"User not exist !");
        }
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();

        user.refreshToken=refreshToken;
       await user.save({validateBeforeSave:false});

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(404,"User not exist !");
    }
}
// implemented
const userRegister=asyncHandler(async (req,res)=>{

    // getting user data
    const {name,username,email,password,budgetAmount}=req.body;

    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        return res.status(404).json({msg:"username or email already exist ! "});
    }

    // Uploading profile picture
  let avatarUrl = "";
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  if (avatarLocalPath) {
    const avatarUpload = await uploadOnCloudinary(avatarLocalPath);
    if (!avatarUpload) {
      return res.json.status(400).json({msg: "Failed to upload avatar."});
    }
    avatarUrl = avatarUpload.url;
  }

    // creating user Object and upload entry in DB
    const user=await User.create({
        name,
        email,
        username:username.toLowerCase(),
        password,
        budgetAmount,
        expendAmount:0,
        ...(avatarUrl && { avatar: avatarUrl })
    })
    // removing password and refreshtoken fro sending response

    const createdUser=await User.findById(user._id).select("-password -refreshToken") ;

    // check for user creation 
    if(!createdUser){
        return res.status(500).json({msg:"Server is Down ! "});
    }
    // return responses
    return res.status(201).json(new ApiResponse(200,createdUser,"User Created Successfully !"));
})
// implemented
const loginUser=asyncHandler(async (req,res)=>{
 const {username,password}=req.body;
 if(!username){
    return res.status(400).json({msg:"Username required ! "})
 }
 const user=await User.findOne({
    username
 })
 if(!user){
    return res.status(404).json("No Such user with above username exists !")
 }
 const isPassword=await user.isPasswordCorrect(password);

 if(!isPassword){
    return res.status(400).json("Password is incorrect ! ");
 }
//  TODO: token to bo added

 const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id);

 const loggedUser= await User.findById(user._id).select("-password -refreshToken");

 const options={
    httpOnly:true,
    // secure:process.env.NODE_ENV==="production",
    // path:"/",
    secure:true,
    sameSite: "None"
 }

 return res
 .status(201)
 .cookie("accessToken",accessToken,options)
 .cookie("refreshToken",refreshToken,options)
 .json(new ApiResponse(201,{user:loggedUser,accessToken,refreshToken},"Loggedin Successfull !"))
})
// implemented
const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },{
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true,
        sameSite:"None"
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logout Successfully !"));
})

const updateBudget=asyncHandler(async(req,res)=>{
    const {budgetAmount}=req.body;
    console.log("Request Body:", req.body);

  if(!budgetAmount){
    throw new ApiError(400,"All fields are required ! ");
  }
  if (typeof(budgetAmount) === "string") {
    budgetAmount = Number(budgetAmount);
  }
  if (isNaN(budgetAmount) || typeof (budgetAmount) !== "number") {
    throw new ApiError(400,"Invalid budget Amount")
  }
  const user =await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        budgetAmount
      }
    },
    {
      new :true
    }

  ).select("-password");

  return res.status(200)
            .json(new ApiResponse(
              200,
              user,
              "Details updated Successfully "
            ))
})

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {name,email,isMailAllow,budgetSurpassAlert,budgetAmount}=req.body;

    console.log("data for profile update : ",name," ",email," ",budgetSurpassAlert," ",budgetAmount," ",isMailAllow);

    // console.log(" Req body : ",req.body);
    // const isMailExist =await User.findOne({email});
    // if(isMailExist){
    //   return res.status(400).json("Email already exists ");
    // }

  const user =await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        name,email,isMailAllow,budgetAmount,budgetSurpassAlert
      }
    },
    {
      new :true
    }

  ).select("-password");

  return res.status(200)
            .json(new ApiResponse(
              200,
              user,
              "Details updated Successfully "
            ))
})

const updateAvator=asyncHandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path;
  if(!avatarLocalPath){
    return res.status(400).json("Avator file required ! ")
  }
  const avatar=await uploadOnCloudinary(avatarLocalPath);

  if(!avatar.url){
   return res.status(400).json("Error required for uploading on avator ! ")
  }

  const user=await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{avatar:avatar.url}
    },
    {
      new:true,
    }
  ).select("-password")
console.log("avatar update ");
  return res.status(200).json(new ApiResponse(200,user,"Avator upload Successfully "));
})

const getCurrentUser=asyncHandler(async (req,res)=>{
    return res.status(200).json(new ApiResponse(200 ,req.user,"current user fetched successfully"));
   })

   const changeCurrentPassword=asyncHandler(async (req,res)=>{
    const {oldPassword,newPassword}=req.body;
  
    const user=await User.findById(req.user?._id)
  
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword);
  
    if(!isPasswordCorrect){
      return res.status(401).json("The password is Incorrect ! ");
    }
    user.password=newPassword;
   await user.save({validateBeforeSave :false});
  
  return res.status(200).json(new ApiResponse (200,{},"Password Change Successfully ! "))
  })

  const refreshAccessToken = asyncHandler(async (req,res)=>{
    
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken;
 
    if(!incomingRefreshToken){
     throw new ApiError(401 ," Unauthorised request ! ");
    }
 
    try {
     const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  
     const user=await User.findById(decodedToken?._id)
  
     if(!user){
      throw new ApiError(401,"Invalid refresh token");
     }
     if(incomingRefreshToken!==user?.refreshToken){
      throw new ApiError(401,"Refresh token is expired !");
     }
  
    const options={
      httpOnly:true,
      secure:true,
    }
    
   const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id) ;

   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",newRefreshToken,options)
   .json(
    new ApiResponse(200,{accessToken,refreshToken:newRefreshToken},"Access token refresh")
   )
    } catch (error) {
     throw new ApiError(401,error?.message || "Invalid refresh token ! ");
    }
 })

export {userRegister,
    loginUser,
    logoutUser,
    updateBudget,
    updateAccountDetails,
    updateAvator,
    getCurrentUser,
    changeCurrentPassword,
    refreshAccessToken
}