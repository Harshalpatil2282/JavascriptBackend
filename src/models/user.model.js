import mongoose, { Schema }  from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
    {
    
        username: {
            type: String,
            unique: true,
            required:true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            unique: true,
            required:true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required:true,
            trim: true,
            index: true
        },
        avatar:{
            type: String ,// cloudinary url
            required: true,

        },
        coverimage:{
            type: String
        },
        watchHistory:[
            {
                type: Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type: String,
            required: [true,"Password is requierd.."]
        },
        refreshToken: {
            type: String,
        }

    },{timestamps: true}
)
// hooks : pre hook in mongoose
// hooks tells run this process before store in db

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(this.password,password)
}

userSchema.methods.generateAccessToken= function(){
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }    
    )
}
userSchema.methods.generateRefressToken= function(){
    jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }    
    )
}

export const User = mongoose.model("User",userSchema)