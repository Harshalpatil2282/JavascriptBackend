import mongoose from "mongoose"
import  {DB_NAME} from "../constants.js"

const connectDB = async() =>{
    try {
        const connectionInsatnce = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected !! DB HOST:${connectionInsatnce.connection.host} `)
    } catch (error) {
        console.log("Error in DB connection :" ,error)
        process.exit(1)
    }
}

export default connectDB