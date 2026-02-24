import { generateApiKey } from '../utils/generateApiKey.js';
import Project from "../models/Project.js";

// Create Project 
export const createProjectService = async({name,owner})=>{
    const project = await Project.create({
        name:name,
        owner:owner,
        apiKey:generateApiKey()
    })

    return project
}

