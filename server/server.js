import dotenv from 'dotenv'
dotenv.config()
import { validateENV } from './src/config/env.js';
validateENV();
import app from "./app.js";
import { connectDB } from './src/config/db.js';

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
