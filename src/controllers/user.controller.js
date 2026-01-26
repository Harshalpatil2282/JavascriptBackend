import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponce} from "../utils/ApiResponce.js"

const registerUser = asyncHandler(async (req, res) => {
    // steps
    // get user details from frontend
    // validation - not empty
    // check user is already exist
    // check image , check for avatar
    // upload them to cloudinary, check avatar is upload on cloudinary or not
    // create user object -- create entry in db 
    // remove password and refresh token field from responce
    // check for user responce 
    // return res
    
    const {fullName,email,username,password}=req.body
    // console.log("email :",email)

    // validation

    // checking condition for fullname
    // if(fullname === ""){
    //     throw new ApiError(400,"fullname is required !")
    // }

    // adavance checking condition using some method
    if(
        [fullName,email,username,password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400, "All field must be required !")
    }

    // check user is already exist

    const existUser = await User.findOne({
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
    // console.log('req.files =', req.files)
    // upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400, "avatar is required!")
    }
    const user = await User.create({
        fullName,
        email,
        username: username.toLowerCase(),
        password,
        avatar : avatar.url,
        coverImage: coverImage?.url || ""
        
        
        

    })
    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!userCreated){
        throw new ApiError(500 , "something went wrong while registering user!")
    }
    return res.status(201).json(
        new ApiResponce(200,userCreated,"User registered successfully")
    )   
})

const userLogin = asyncHandler(async(req,res)=>{
    // req.body - > data
    // validate -> username or email
    // find the user in db
    // password match
    // generate jwt token -> access token , refresh token
    // set refresh token in http only cookie

    const {email , username , password} = req.body
    console.log(email);
    if(!email && !username){
        throw new ApiError(400, "email or username is required !")
    }


    const user = await User.findOne({
        // mongoDb operator $or
        $or :[{email},{username}]
    })
    if(!user){
        throw new ApiError(404, "User Not found !")
    }

    const isValidPassword = await user.isPasswordCorrect(password);

    if(!isValidPassword){
        throw new ApiError(401, "Invalid user Credentials !")
    }

    const {accessToken , refreshToken} = await user.generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options ={
        httpOnly : true,
        secure : true
    }
    return res
    .status(200)
    .coockies("refreshToken", refreshToken, options)
    .coockies("accessToken", accessToken, options)
    .json(
        new ApiResponce(
            200,
            {
                user: loggedInUser,accessToken,refreshToken
            },
            "User logged in successfully"
        )
    )

})
const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword , newPassword} = req.body
})


export { registerUser }