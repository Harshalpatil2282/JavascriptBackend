import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponce} from "../utils/ApiResponce.js"

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check user is already exist
    // check image , check for avatar
    // upload them to cloudinary, check avatar is upload on cloudinary or not
    // create user object -- create entry in db 
    // remove password and refresh token field from responce
    // check for user responce 
    // return res
    
    const {fullname,email,username,password}=req.body
    console.log("email :",email)

    // validation

    // checking condition for fullname
    // if(fullname === ""){
    //     throw new ApiError(400,"fullname is required !")
    // }

    // adavance checking condition using some method
    if(
        [fullname,email,username,password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400, "All field must be required !")
    }

    // check user is already exist

    const existUser = User.findOne({
        $or: [{ email },{ username}] // with can check multiple objects in db by using this $or operator 
    })
    if(existUser){
        throw new ApiError(409,"User with email or username already exist")
    }
    
    // check image , check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path  // file path
    const coverImageLocalPath = req.files?.coverImage[0].path
    if(!avatarLocalPath){
        throw new ApiError(400, "avatar is required !")
    }
    // upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400, "avatar is required !")
    }
    const user = await User.create({
        email,
        avatar : avatar.url,
        coverImage: coverImage?.url || "",
        fullname,
        password,
        username: username.toLowerCase()

    })
    const userCreated = User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!userCreated){
        throw new ApiError(500 , "something went wrong while registering user!")
    }
    return res.status(201).json(
        new ApiResponce(200,userCreated,"User registered successfully")
    )
})

export { registerUser }