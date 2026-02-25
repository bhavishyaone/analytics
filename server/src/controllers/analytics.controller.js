import mongoose from 'mongoose'
import Project from '../models/Project.js'
import {getOverviewServices} from '../services/analytics.service.js'

const getOwnedProject = async(projectId,userId)=>{
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        return null
    }
    const project = await Project.findOne({ _id: projectId, owner: userId });
    return project
}

// Overview 
export const getOverview = async(req,res)=>{

    try{
        const project = await getOwnedProject(req.params.projectId,req.user.id)
        if(!project){
            return res.status(400).json({message:"Project not found."})
        }

        const days = parseInt(req.query.days) || 30
        if(days<1 || days>365){
            return res.status(400).json({message:"Days onlbe in between 1 and 365"})
        }
        
        const data = await getOverviewServices(req.params.projectId, days);
        return res.status(200).json({ data });
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error."})
    }

}