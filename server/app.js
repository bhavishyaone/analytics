import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

const app = express();
app.use(cors());
app.use(helmet())

app.get("/",(req,res)=>{
    return res.status(200).json({message:`Chaliye Shuru karte hai.`})
})
export default app;


