import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:60
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
projectSchema.index({ ownerId: 1 });
projectSchema.index({ apiKey: 1 });


export default mongoose.model("Project",projectSchema)