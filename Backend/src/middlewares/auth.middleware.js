import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


const verifyJWT=asyncHandler(async (req,res,next)=>{

try {
    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    // console.log("Token Received : ",token)
   
    if(!token){
        return res.status(401).json("Unauthorised request !");
    }
    
    const decodedToken =jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    console.log("Decoded token:", decodedToken);

    const user =await User.findById(decodedToken._id).select("-password -refreshToken")
    if(!user){
        throw new ApiError(401,"Invalid Access token");
    }
    req.user=user;
    next();
} catch (error) {
    console.error("JWT Error:", error.message);
    throw new ApiError(401,error?.message||"Invalid access Token ");
}
})




export {verifyJWT}