import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from '../server/src/routes/auth.routes.js'
import projectRoutes from '../server/src/routes/project.routes.js'
import errorHandler from '../server/src/midlleware/error.middleware.js'
import { httpLogger } from '../server/src/config/logger.js'

const app = express();
app.use(httpLogger);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    return res.status(200).json({message:`Chaliye Shuru karte hai.`})
})

app.use("/api/auth",authRoutes)
app.use("/api/projects",projectRoutes)


app.use((req, res) => {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` } })
})
app.use(errorHandler)

export default app;


