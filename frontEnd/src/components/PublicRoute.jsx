/// the purpose of this file is to uhmm..... for any unthenticated guest or waiting for authencation guests
// use for register and login
import {Navigate} from "react-router-dom"
import { useAuth } from "../context/authContext";

export default function PublicRoute({children}){
    const {auth, loading} = useAuth() ; 


    // show loading state while checking auth 
    if(loading){
        return (
            <>
                <div>Loading...</div>
            </>
        )
    }

    // redirected to home if already authenticated 
    if(auth && auth.accessToken){
        return (
            <>
                <Navigate to="/"/>
            </>
        )
    }

    return children;
}