import { createProjectService } from "../services/project.service.js";
import Project from "../models/Project.js";

// Create Project 
export const createProject = async(req,res)=>{
    try{
        const {name} = req.body
        if(!name){
            return res.status(400).json({message:"Project Name is required."})
        }
        if(name.trim().length<5){
            return res.status(400).json({message:"Name must be at least 5 characters." })
        }
        if(name.trim().length>60){
            return res.status(400).json({message:"Name must be at most 60 characters."})
        }

        const existingProject  =await Project.findOne({name:name.trim(),owner:req.user.id})
        if(existingProject){
            return res.status(400).json({message:"Project already exists."})
        } 

        const project = await createProjectService({name:name.trim(), owner:req.user.id});
        return res.status(201).json({
            message:"Project created successfully" ,
            project
        })


    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error"})
    }

}
