import mongoose from "mongoose";
import Event from '../models/Event.js'

const toObjectId = (id) => new mongoose.Types.ObjectId(id)

// Overview dega - total events, unique user count — all time or last N days

export const getOverviewServices = async(projectId,days)=>{

    // Start date , N days ago from now
    const startDate = new Date()
    startDate.setDate(startDate.getDate()-days)

    const totalEvent = await Event.countDocuments({
        projectId:projectId,
        timestamp: { $gte: startDate }
    })

    const uniqueUserId = await Event.distinct('userId',{
        projectId:projectId,
        userId:{$ne:null},
        timestamp:{$gt:startDate}
    })

    return {
        totalEvent,
        uniqueUsers: uniqueUserId.length,
        periodDays: days
    };
};







