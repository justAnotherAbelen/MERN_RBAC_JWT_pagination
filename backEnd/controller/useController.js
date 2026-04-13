import User from "../model/user.js";

export const getUsers = async (req,res) => {
    try{

        /// pagination : 
        // if req.query.page isn't provide , default to 1  
        const page = parseInt(req.query.page) || 1 ;
        // how may windows will be returned

        // if req.query.limitsn't provide , default to 10 
        const limit = parseInt(req.query.limit) || 10 ; 
        // how many users per page 

        const skip = (page - 1 ) * limit ; 
        // How many documents to skip before starting this page.
        // page : 1 / limit : 5 
        // Page 1: skip (1 - 1) * 5 = 0
        // Page 2: skip (2 - 1) * 5 = 5
        // Page 3: skip (3 - 1) * 5, etc.

        const total = await User.countDocuments();
        /// Total number of users in the collection (for computing “page X of Y” or hasNextPage in the JSON response). This uses Mongoose’s countDocuments() (fixed from the invalid countDocument).
        
        const users = await User.find().skip(skip).limit(limit).select("-password");
        // MongoDB returns at most "limit" users, after skipping "skip" documents, in default order. .select("-password") omits (tells MongoDB: “return this user document without the password field.”) the password field from each document.

        // Typical URL: GET /user/all?page=2&limit=10 → second page, 10 items per page.

        res.status(200).json({
            users , total , totalPages : Math.ceil(total / limit) , currentPage : page 
        })
    }catch(error){
        console.error("Error while fetching" , error) ;
        return res.status(500).json({message : "server error"}); 
    }
}


export const deleteUser = async (req,res) => {
    try{
        /// find and delete user
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user){
            return res.status(400).json({messsage : "User not found"})
        }

        /// respond for deleting user 
        res.status(200).json({message : "delete user succesfully"})

    }catch(error){
        console.error("Error deleting user :" , error);
        return res.status(500).json({message  : "server error"})
    }
}

export const getProfile = async (req,res) => {
    try{
        // collect user profile except "password"
        const user = await User.findById(req.user.id).select("-password");

        // if not exist
        if(!user){
            return res.status(404).json({message : "User not found"})
        }

        // return user profile 
        res.status(200).json(user)
    }catch(error){
        console.error("error collect user profile", error);
        return res.status(500).json({message: "server error !!1"})
    }
}

/// note that all these function above can only be used by "admin" role 