import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new moongose.Schema({
    videoFile:{
        type: String, // cloudinary URL
        required: true
    },
    thumbnail:{
        type: String, // cloudinary URL
        required: true
    },
    owener:{
        type: Schema.Type.ObjectId,
        ref:"User"
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true, 
    },
    durarion:{
        type: String , // 
    },
    view:{
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }


},{timestamps: true})

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video",videoSchema) 