import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from '../server/src/routes/auth.routes.js'

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    return res.status(200).json({message:`Chaliye Shuru karte hai.`})
})

app.use("/api/auth",authRoutes)
export default app;


