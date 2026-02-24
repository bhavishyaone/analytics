import { createProjectService,getAllProjectService ,getProjectByIDService,deleteProjectByIDService} from "../services/project.service.js";
import Project from "../models/Project.js";
import mongoose from "mongoose";

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

// GET ALL THE PROJECT

export const getProject = async(req,res)=>{
    try{

        const projects = await getAllProjectService(req.user.id);
        return res.status(200).json({
            message:"Project fetched successfully",
            projects
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error."})
    }
}

export const getProjectById = async(req,res)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'projectid formalt is invlaid.' });
        }

        const project =await getProjectByIDService(req.params.id,req.user.id)
        if(!project){
            return res.status(404).json({message:"Project not found."})
        }
        return res.status(200).json({
            message:"Project by ID is fetched",
            project
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"Server error."})
        
    }
}


// Delete by ID 
export const deleteProjectByID = async(req,res)=>{
    try{
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "Project Id is invalid." });
        }
        const result = await deleteProjectByIDService(req.params.id, req.user.id);
        if(!result){
            return res.status(404).json({message:"Project not found"})
        }
        return res.status(200).json({ message: 'Project deleted successfully' });
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})
    }
}
