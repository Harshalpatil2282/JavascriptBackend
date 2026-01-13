import { v2 as cloudinary} from "cloudinary"
import fs from "fs"

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        // we need a time for uploadingin the file so use the await and host it into variable
        if(!localFilePath) return null;

        const responce = await cloudinary.uploader.upload('localFilepath',{
            resource_type: "auto"
        })
        //file has been uploaded
        console.log("file is uploaded on cloudinary",responce.url);
        return responce;
        
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the localy save temporaryfile as the file uploader operation fails
        return null;    
    }
}

export {uploadOnCloudinary}