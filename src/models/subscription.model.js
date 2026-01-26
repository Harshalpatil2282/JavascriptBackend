import mongoose from "mongoose";


const subscriptionSchema = new moongoose.Schema({
    subscriber:{
        type: Schema.types.ObjectId,
        ref:"User"
    },
    channel:{
        type: Schema.types.ObjectId,
        ref:"User"
    }
},{timestamps: true}) 

export const Subscription = moongoose.model("Subscription",subscriptionSchema)