import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {connectDB} from "./config/db.js"
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
dotenv.config();

const app = express();
//  db connection 
connectDB()
// middlewares

app.use(express.json());
app.use(cors());
app.use(cookieParser())

// routes
app.use('/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req , res )=> {
    res.send("Hello from server")
});
 app.listen(PORT, ()=> {
    console.log(`server is running on port ${PORT}`)
 })