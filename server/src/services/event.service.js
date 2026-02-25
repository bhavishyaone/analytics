import Event from '../models/Event.js'

// Track Event Services
export const trackEventService = async({projectId,name,userId,properties,timestamp})=>{
    const event = await Event.create({
        projectId:projectId,
        name:name,
        userId:userId,
        properties:properties,
        timestamp:timestamp ? new Date(timestamp) : new Date()
    });
    return event
}

// Batch Track Service

export const batchTrackService = async({projectId,events})=>{   
    const docs = events.map((e)=>({
        projectId: projectId,
        name: e.name,
        userId: e.userId || null,
        properties: e.properties || {},
        timestamp: e.timestamp ? new Date(e.timestamp) : new Date(),
    }))

    const result  = await Event.insertMany(docs)
    return result

}