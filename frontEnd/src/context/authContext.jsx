/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
// a context that create and store authencation data for component
export const AuthContext = createContext();

// children is a jsx element nested inside AuthProvider component whenever the component is being used
export const AuthProvider = ({children}) => {
    const [auth,setAuth] = useState(null) ; 
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try{
                const res = await axios.get("/api/auth/refresh" , {
                    withCredentials : true ,
                    /// identify a user infomation
                }) ;
                // whenever the app get reload , will call on thhe backend for a new token (stored in an httpOnly cookie) to autheticate

                setAuth({accessToken : res.data.accessToken , role : res.data.role})


            }catch(error){
                console.error(error)
                setAuth(null)
            }finally{
                setLoading(false)
            }
        };
        checkAuth();
    },[])

    // Provide auth state/functions to all nested components, then render those children.
    // It shares `auth`, `setAuth`, and `loading` with all nested children.
    /// AuthProvider is a convenience wrapper around AuthContext.Provider
    return (
        <AuthContext.Provider value={{ auth, setAuth, loading }}>
            {children}
        </AuthContext.Provider>
    ) ;
        
};

// AuthProvider handled if the user is authenticated or not whenever the app started


// Custom hook to access auth context values from any component inside AuthProvider.
export const useAuth = () => useContext(AuthContext);

// visualize the proccess : 
// AuthProvider : provide value
//       ||
//       V
// AuthContext : context that hold value 
//       ||
//       V
// useAuth : custom hook for easy access