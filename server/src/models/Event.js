import mongoose from "mongoose";

const eventSchema =  new mongoose.Schema({
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required:true
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    // UserId is the customer's  end user user joh trigger  karga event ko .
    userId:{
        type:String,
        default:null
    },

    // Extra data joh developer event ke saath add karna chahe
    properties:{
        type:Object,
        default:{}
    },
    // Konse time pe event hua hai 
    timestamp: {
    type: Date,
    default: Date.now
    }
},
    {timestamps:true}
);

eventSchema.index({ projectId: 1, timestamp: -1 });
eventSchema.index({ projectId: 1, name: 1 });
eventSchema.index({ projectId: 1, userId: 1 });

export default mongoose.model('Event', eventSchema);
