import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req , res) =>{
    const {username , email , password} = req.body;

    // check if all fields are filled
    if(!username || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    }

    try{
       // check if user already exists by email
       // findOne is a mongoose method that returns a single document
       // User is a mongoose model with built in methods
       const existingUser = await User.findOne({email});

       if(existingUser){
        return res.status(400).json({message: "user already existed !!!"})
       }

       // if user does not exist, create a new user
       // BUT before that, we need to hash the password
       const hashedPassword = await bcrypt.hash(password,10);

       // create a new user
       const user = new User({
        username,
        email,
        password: hashedPassword
       })

       // save the user to the database
       await user.save();
       return res.status(201).json({message : "User created successully !! "})

    }catch(error){
        console.log("Error in register controller !!! ")
        return res.status(500).json({
            message: "Internal server error",
            user : {
                id : User._id ,
                username : User.username ,
                email : User.email ,
                password : User.password

            }
        });
    }
}

export const login = async (req,res) => {
    const { loginEmail, loginPassword } = req.body;

    // if not provided 
    if(!loginEmail || !loginPassword){
         return res.status(400).json({message : " missing required fill !!! "})
    }

    try{
        // check if user exist by email
        const user = await User.findOne({ email: loginEmail });

        // if not exist 
        if(!user){
            return res.status(400).json({message: "invalid input !!!"})
        }

        // comparing
        const isMatch = await bcrypt.compare(loginPassword,user.password)
        if(!isMatch){
            return res.status(400).json({message : " invalid credentials"})
        }

        // using the token prove authenticate
        // the token last for 15 minutes and stored in the front end
        const accessToken = jwt.sign(
            // provide payload (payload is information inside token in json format)
            {
                /// _id is MongoDB’s default primary key.
                id : user._id,
                role : user.role
            },
            /// ensure the token is valid and was mmade by the server
            /// even if stolen , it still be useless after 15 minutes
            process.env.ACCESS_TOKEN_SECRET,
            {
                /// expire date : 
                expiresIn : "15m"
            }
        )

        const refreshToken = jwt.sign(
            {
                id : user._id , 
                role : user.role , 
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "7d" ,
            }
        )

        // Refresh token in a cookie: survives page reloads, not readable by JS (unlike localStorage).
        res.cookie("refreshToken", refreshToken, {
            // httpOnly: browser sends the cookie on requests but document.cookie / JS cannot read it →
            // reduces XSS stealing the token (attacker script cannot exfiltrate it from the page).
            httpOnly: true,
            // secure: only send over HTTPS. Off in dev (often http://localhost); on in production.
            secure: process.env.NODE_ENV === "production",
            // sameSite: "strict" — cookie is not sent on cross-site requests (e.g. other-site form/link),
            // which helps against CSRF sending your cookie to our API without you intending to.
            sameSite: "strict",
            maxAge : 7 * 24 * 60 * 60 * 1000 ,// 7 days 
        });

        res.status(200).json({
            accessToken,
            user: {
                id : user._id ,
                username : user.username ,
                email : user.email , 
                role : user.role
            }
        })
    }catch(error){
        console.error(" there are some problem !!! ", error);
        return res.status(500).json({message :" error detected !!!! " })
    }
}

export const refreshToken = async (req,res) => { 
    const token = req.cookies.refreshToken ;

    // check if token exist
    if(!token){
        return res.status(401).json({message : "unable to find existing token"})
    }

    try{
        const decoded = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id); 

        if(!user){
            return res.status(404).json({message: "user not found"})
        }

        const newAccessToken = jwt.sign(
            {
                id : user._id ,
                role : user.role , 
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m"
            }
        )

        res.status(200).json({
            accessToken : newAccessToken ,
            user : {
                id : user._id , 
                username : user.username , 
                email : user.email , 
                role : user.role , 
            },
        })
    }catch(error){
        console.error(" there are some problem !!! ", error);
        return res.status(500).json({message :" error detected !!!! " })
    }
}

export const logout = async (req, res) => {
    try {
        // Must match the name used in login: res.cookie("refreshToken", ...)
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        return res.status(200).json({ message: "logged out successfully !!! " });
    } catch (error) {
        console.error(" there are some problem !!! ", error);
        return res.status(500).json({ message: " error detected !!!! " });
    }
};