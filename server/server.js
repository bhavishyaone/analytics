import dotenv from 'dotenv'
dotenv.config()
import { valudateENV } from './src/config/env.js';
valudateENV();
import app from "./app.js";
import { connectDB } from './src/config/db.js';

connectDB();

app.listen(process.env.PORT,console.log(`Server is running on ${process.env.PORT}`))
