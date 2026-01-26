import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async(req, _,next)=>{
    try {
        const token = req.coockies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            throw new ApiError(401,"Access Denied ! No token provided")
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(404,"Invalid Access Token ")
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401,error?.messege||"Invalid Token or Expired Token")
        
    }
})
