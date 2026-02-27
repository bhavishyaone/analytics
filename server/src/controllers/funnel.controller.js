import { getFunnelServices } from "../services/funnel.service.js";
import Project from '../models/Project.js'
import mongoose from "mongoose";


const getOwnedProject = async (projectId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return null;
  }
  return await Project.findOne({ _id: projectId, owner: userId });
};


export const getFunnel = async(req,res)=>{
    try{
        const project = await getOwnedProject(req.params.projectId,req.user.id)
        if(!project){
            return res.status(400).json({message:"project not found."})
        }

        const {steps} = req.body

        if(!steps || !Array.isArray(steps)){
            return res.status(400).json({message:"steps must be in array."})
        }

        if(steps.length<2){
            return res.status(400).json({message:"Steps array must contian atleast 2 steps."})
        }
        if(steps.length>20){
            return res.status(400).json({message:"At max 20 step are allowed."})
        }

        for (const step of steps) {
            if (typeof step !== 'string' || step.trim().length === 0) {
                return res.status(400).json({ message: "Each step must be a non-empty string."});
            }
        }

        const days = parseInt(req.query.days) || 30;
        if (days < 1 || days > 365) {
            return res.status(400).json({ message: "days must be between 1 and 365."});
        }

        const data = await getFunnelServices(req.params.projectId, steps, days);
        return res.status(200).json({ message:"funnel data is fetched",data});
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})
    }
}