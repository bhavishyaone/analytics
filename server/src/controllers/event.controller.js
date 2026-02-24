import { trackEventService } from "../services/event.service.js";

const MAX_EVENT_PAYLOAD_BYTES = parseInt(process.env.MAX_EVENT_PAYLOAD_BYTES) || 10240;

// Track EVENT 

export const trackEvent = async(req,res)=>{
    try{
        const payloadSize = Buffer.byteLength(JSON.stringify(req.body))

        if(payloadSize>MAX_EVENT_PAYLOAD_BYTES){
            return res.status(400).json({message:"Only 10kb payoad size is allowed"})
        }

        const { name, userId, properties, timestamp } = req.body;

        if (!name){
            return res.status(400).json({message:"Event name is missing."})
        }

        if(typeof(name)!=='string'){
            return res.status(400).json({message:"Name can only be of type string."})
        }

        if(name.trim().length === 0){
            return res.status(400).json({ message: "Event name cannot be empty."});
        }
        if (name.trim().length > 100){
            return res.status(400).json({ message: 'Event name must be at most 100 characters.' });
        }

        const event = await trackEventService({
            projectId: req.project._id,
            name: name.trim(),
            userId: userId || null,
            properties: properties || {},
            timestamp: timestamp || null,
        })
        
        return res.status(201).json({
            message:"Event tracked succesfully",
            id: event._id,
            name: event.name,
            timestamp: event.timestamp,
        })


    }
    catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}
