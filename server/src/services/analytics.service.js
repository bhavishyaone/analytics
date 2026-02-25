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



// Events Over Time , har din ka count dega event ke saath 

export const getEventsOverTimeService = async(projectId,days)=>{
    const startDate = new Date();
    startDate.setDate(startDate.getDate()-days)
   

    // MONGODB Aggregation 
    // 1. $match -filter to this project and within date range
    // 2. $group —group events by calendar date, count each group
    // 3. $sort  — sort by date ascending 
    const result = await Event.aggregate([
        {
            $match:{
                projectId: toObjectId(projectId),
                timestamp: { $gte: startDate },
            }
        },

        {
            $group:{
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                count: { $sum: 1 },
            }
        },

        {
            $sort: { _id: 1 }
        }
    ])

    // _id ko date mein rename kiya hai , better responses ke liye    
    return result.map((e)=>({
        date: e._id,
        count: e.count,
    }))
}


// Top 10 Events joh ho rahe hai 

export const getTopEventsService = async(projectId,days)=>{
    const startDate  = new Date()
    startDate.setDate(startDate.getDate()-days)

    const result = Event.aggregate([
        {
            $match:{
                projectId: toObjectId(projectId),
                timestamp: { $gte: startDate }
            }
        },
        {
            $group:{
                _id:'$name',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit:10
        }
    ])

    return (await result).map((e)=>({
        eventName : e._id,
        count : e.count
    }))
}


// Active User services 

export const getActiveUsersService = async(projectId)=>{
    const now = new Date()

    const oneDayAgo = new Date(now - 1 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [dauIds, wauIds, mauIds] = await Promise.all([

      Event.distinct('userId',{
        projectId: projectId,
        userId: { $ne: null },
        timestamp: { $gte: oneDayAgo },
      }),

      Event.distinct('userId',{
        projectId: projectId,
        userId: { $ne: null },
        timestamp: { $gte: sevenDaysAgo }
      }),

      Event.distinct('userId', {
        projectId: projectId,
        userId: { $ne: null },
        timestamp: { $gte: thirtyDaysAgo },
      }),

    ])

    return {
        dau:dauIds.length,
        wau:wauIds.length,
        mau:mauIds.length
    }
}