/// that this file do is check if the request has a valid token in the authorization header
/// if the token is valid then decode the token and attach the user info to the request and whether the user just a regular user or an admin

import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {

    const authHeader = req.headers.authorization ;
    /// it will be something like this : Bearer <Token>

    if(!authHeader){
        return res.status(401).json({message : "No token provided"})
    }

    const token = authHeader.split(" ")[1]
    // what it does is take authHeader (any) return it as an array
    // bearer <token> => ["bearer" , "token"]

    // Verify the JWT signature + claims (exp, etc). If valid, `user` is the decoded payload.
    // In your code, the payload is whatever you put into `jwt.sign(...)` (e.g. { id, role }).
    jwt.verify(
        token,
        // Same secret used when signing the access token (jwt.sign(..., ACCESS_TOKEN_SECRET, ...))
        process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {
            if (err) {
                // Token is missing/invalid/expired → authenticated request is forbidden.
                return res.status(403).json({ message: "Invalid Token" });
            }

            // Attach decoded payload to the request so later handlers can authorize (role checks, etc).
            req.user = user;
            next();
        }
    ); 

}

// Pass required role: e.g. verifyRole("admin") returns middleware that checks JWT payload role.
export const verifyRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user?.role;
        // optional chaining: if req.user is missing, userRole is undefined

        if (userRole !== role) {
            return res.status(403).json({ message: " Access denied " });
        }

        next();
    };
};

/// in case for those who forrgot what is the functionality of next() :
// next() is is the function that moves the request to the next middleware/handler in the route chain.
// - If you call next(): Express continues to the next function (e.g. your controller).
// - If you don’t call next() and you don’t send a response (res.json(...), res.status(...).send(...))
// , the request will hang (client waits forever).
// - If you call next(err): Express skips normal handlers and goes to your error-handling middleware.
// in short: next is a control-flow callback , if not called The request hangs → client eventually times out.