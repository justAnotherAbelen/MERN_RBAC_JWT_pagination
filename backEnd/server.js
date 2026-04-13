import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json())
//  registers Express’s built-in JSON body parser as middleware for every request.
// in simple term : whatever that we got from req.body (any or undefined) it will be return as json

app.use(cors({
    origin : "https://localhost:5173" , // front end url 
    credentials : true,
}))
/// backend and frontend will be on different port 

app.use(cookieParser());
// Parses the browser's `Cookie` header on each request into `req.cookies` (e.g. refreshToken).
// Without this, incoming cookies are not available as a plain object—only the raw header string.
// Works with any path (not just one URL); use `res.cookie(...)` in handlers to set cookies on responses.

app.use("/api/auth" , authRouter)
// access to the router in auth.js

app.use("/api/user", userRouter)
// access to the router in user.js

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})