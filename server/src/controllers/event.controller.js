import { trackEventService,batchTrackService } from "../services/event.service.js";

const MAX_EVENT_PAYLOAD_BYTES = parseInt(process.env.MAX_EVENT_PAYLOAD_BYTES) || 10240;

export const trackEvent = async(req,res,next)=>{
    try{
        const payloadSize = Buffer.byteLength(JSON.stringify(req.body))

        if(payloadSize>MAX_EVENT_PAYLOAD_BYTES){
            return res.status(400).json({message:"Only 10kb payload size is allowed"})
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
            message:"Event tracked successfully",
            id: event._id,
            name: event.name,
            timestamp: event.timestamp,
        })


    }
    catch(err){
        next(err);
    }
}
export const batchTrackEvent = async(req,res,next)=>{
    try{
        const payloadSize = Buffer.byteLength(JSON.stringify(req.body))

        if(payloadSize>MAX_EVENT_PAYLOAD_BYTES){
            return res.status(400).json({message:"Payload size is too much , Only 10kb payoad size is allowed"})
        }
        const {events} = req.body
        if(!events){
            return res.status(400).json({message:"events array is required."})
        }

        if(!Array.isArray(events)){
            return res.status(400).json({message:"events must be in array"})
        }

        if (events.length === 0) {
            return res.status(400).json({message:"events array can not be empty."})
        }
        if(events.length>100){
            return res.status(400).json({message:"Maximum 100 events per batch is allowed only."})
        }

        for (let i = 0; i < events.length; i++) {
            const e = events[i]
            if (!e.name) {
                return res.status(400).json({ message: `Event at index ${i} is missing a name.` })
            }
            if (typeof e.name !== 'string') {
                return res.status(400).json({ message: `Event at index ${i}: name must be a string.` })
            }
            if (e.name.trim().length === 0) {
                return res.status(400).json({ message: `Event at index ${i}: name cannot be empty.` })
            }
            if (e.name.trim().length > 100) {
                return res.status(400).json({ message: `Event at index ${i}: name must be at most 100 characters.` })
            }
        }

        const result = await batchTrackService({ projectId: req.project._id, events })
        return res.status(201).json({
            message:`${events.length} events tracked successfully.`,
            result
        })


    }
    catch(err){
        next(err);
    }
}



import Event from '../models/Event.js'
import Project from '../models/Project.js'
import User from '../models/User.js'
import mongoose from 'mongoose'
import { getDemoEventsByProject } from '../services/demo.analytics.js'

export const getEventsByProject = async (req, res, next) => {
    try {

        const { projectId } = req.params
        const { page = 1, limit = 50, name } = req.query

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'Invalid project ID.' })
        }

        const project = await Project.findOne({ _id: projectId, owner: req.user.id })
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' })
        }

        const filter = { projectId }
        if (name) filter.name = { $regex: name, $options: 'i' }

        const skip = (parseInt(page) - 1) * parseInt(limit)

        const demoUser = await User.findById(req.user.id)
        if (demoUser?.email === 'demo@gmail.com') {
            const page_ = parseInt(page)
            const limit_ = parseInt(limit)
            const result = getDemoEventsByProject(page_, limit_, name)
            return res.status(200).json({ message: 'Events fetched successfully', ...result })
        }

        const [events, total, uniqueEventTypes] = await Promise.all([
            Event.find(filter)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            Event.countDocuments(filter),
            Event.distinct('name', { projectId })
        ])

        return res.status(200).json({
            message: 'Events fetched successfully',
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            uniqueEventTypes: uniqueEventTypes.length,
            events
        })
    } 
    catch (err) {
        next(err)
    }
}
