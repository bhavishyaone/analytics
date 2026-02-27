import { generateApiKey } from '../utils/generateApiKey.js';
import Project from "../models/Project.js";
import crypto from 'crypto';

// Create Project 
export const createProjectService = async({name,owner})=>{
    const project = await Project.create({
        name:name,
        owner:owner,
        apiKey:generateApiKey()
    })

    return project
}

// Gel All Project 
export const getAllProjectService = async(owner)=>{
    const projects  =await Project.find({
        owner:owner
    }).sort({ createdAt: -1 });

    return projects
}

// GET PROJECT BY ID
export const getProjectByIDService = async(projectId, owner)=>{
    const project = await Project.findOne({ _id: projectId, owner: owner })
    return project
}


// Delet Project BY id

export const deleteProjectByIDService = async(projectId, owner)=>{
    const project = await Project.findOne({_id: projectId, owner: owner})
    if(!project){
        return null
    }
    return Project.findByIdAndDelete(projectId)
}


export const rotateApiKeyService = async (projectId, ownerId) => {

  const project = await Project.findOne({ _id: projectId, owner: ownerId });
  if (!project) {
    return null;
  }

  const newApiKey = crypto.randomBytes(32).toString("hex");

  project.apiKey = newApiKey;
  await project.save();
  return newApiKey;
};