import mongoose from "mongoose";


export const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDb finally connect ho gaya.`)
    }
    catch(err){
        console.log(`MongoDB connect nahi hua.`)
        console.log(err)
        process.exit(1)
    }
}
