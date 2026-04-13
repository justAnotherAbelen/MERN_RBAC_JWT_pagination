import express from "express"
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";
import { deleteUser, getProfile, getUsers } from "../controller/useController.js";

const userRouter = express.Router();

userRouter.get("/all", verifyToken , verifyRole("admin") , getUsers)
// only admin can use this function 

userRouter.delete("/:id", verifyToken, verifyRole("admin"), deleteUser);
// only admin can use this function 

userRouter.get("/me" , verifyToken , getProfile)
// as long as the token still valid any user can access their own profile

/// testing feature : 

// allow user to get list 
userRouter.get("/test_1" , verifyToken , getUsers)

export default userRouter
