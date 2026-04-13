import express from "express" 
import { register, login, refreshToken, logout } from "../controller/authController.js";

const authRouter = express.Router();

authRouter.post("/register",register )

authRouter.post("/login" , login)

authRouter.get("/refresh", refreshToken)
 
authRouter.post("/logout", logout)

export default authRouter ;

// this file is how the front end get the current user info and display it