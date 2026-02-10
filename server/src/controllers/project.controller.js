import Project from "../models/Project.js";
import { generateApiKey } from "../utils/generateApiKey.js";


// CREATE PROJECT
export const createProject = async(req,res)=>{
    try{
        const {name} = req.body
        

        if(!name){
            return res.status(400).json({message:"Name is required."})
        }

        const existingProject = await Project.findOne({name:name})
        if(existingProject){
            return res.status(400).json({message:"Project already exists."})
        }

        

        const project = await Project.create({
            name:name,
            owner:req.user.id,
            apiKey:generateApiKey()
        
        })

        return res.status(201).json({
            message: "Project created successfully",
            project: {
                id: project._id,
                name: project.name,
                apiKey: project.apiKey
            }
        })

    }
    catch(err){
        console.log(err)
        return  res.status(500).json({message:'server error.'})
    }

};


// LIST USER PROJECT


export const getProjects = async(req,res)=>{
    try{
        const projects = await Project.find({ owner: req.user.id })
        .sort({ createdAt: -1 });

        return res.status(200).json(projects)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error."})


    }
}


