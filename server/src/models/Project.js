import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    apiKey: {
        type: String,
        unique: true,
        required: true
    }
},
    {timestamps:true}
)

export default mongoose.model("Project",projectSchema)