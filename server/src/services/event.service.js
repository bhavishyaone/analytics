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
