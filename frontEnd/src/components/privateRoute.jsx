import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({children , allowedRoles}){
    const {auth , loading} = useAuth() ;

    // loading 
    if(loading){
        return (
            <>
                <div> Loading... </div>
            </>
        )
    }

    // redirect if not authenticated 
    if(!auth || !auth.accessToken){
        return(
            <>
                <Navigate to="/login" />
            </>
        )
    }

    // redirect if not allowed role
    if (allowedRoles && !allowedRoles.includes(auth.role)) {
        return <Navigate to="/login" />;
    }

    // Support both patterns: 
    // - function child gets `auth` : (auth) => <Dashboard role={auth.role} />
    // - normal JSX child is returned directly.
    return typeof children === "function" ? children(auth) : children 
}

// why privateRoute.jsx exist ? 

// its job is to protect pages so users only access them when they should:

// - checks auth state (useAuth())
// - waits during auth loading
// - redirects unauthenticated users to /login
// - checks allowedRoles for role-based access (admin/user)
// - renders the protected page (children) only when allowed