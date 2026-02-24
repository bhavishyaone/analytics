import Project from "../models/Project.js";

const apiKeyMiddleware = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ message: "Api key is required." });
    }
    try {
        const project = await Project.findOne({ apiKey: apiKey });
        if (!project) {
            return res.status(401).json({ message: "Invalid API key." });
        }
        req.project = project;
        next();
    } catch (err) {
        return res.status(500).json({ message: "Server error." });
    }
};

export default apiKeyMiddleware;