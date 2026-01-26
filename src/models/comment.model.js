import moongoose from 'mongoose';

const commentSchema = new moongoose.Schema({
    content:{
        type: String,
        required: true
    },
    video:{
        type: moongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    owner:{
        type: moongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Comment = moongoose.model("Comment",commentSchema)