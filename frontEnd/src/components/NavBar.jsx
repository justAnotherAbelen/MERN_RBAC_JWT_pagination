import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "axios";

const NavBar = () => {

    const navigate = useNavigate() ;
    // access the value from custom hook (useAuth())
    const {auth , setAuth} = useAuth() ;

    // event handler for logout 
    const handleLogout = async() => {
        try {
            await axios.post("/api/auth/logout" , {} , {withCredentials : true} )
            // axios.post(url, data, config):
            // - url: "/api/auth/logout"
            // - data: {} (no request body needed here)
            // - config: { withCredentials: true } so browser sends refresh-token cookie to backend
            setAuth(null)
            navigate("/login") // redirect to login page after logout

        } catch (error) {
            console.error("logout failed",error)
        }
    }

    return (
        <>
        <nav className={`bg-gray-600 text-white p-4 flex`}> 

            <div className={`container mx-auto flex justify-between items-center`}>
                <Link to="/" className={`text-white mr-4`} >
                    Homes
                </Link>
            </div>

            <div>
                {/* why use optional chaining ? to ensure the token was fetch before rendering*/}
                {auth?.accessToken ? 
                <> {/*if token exist*/}
                    <button 
                    onClick={handleLogout}
                    className={`bg-red-400 p-2 rounded-lg hover:bg-red-500`}
                    >
                        Log Out 
                    </button>
                </> : 
                <> {/*if token not exist*/}

                    {/* redirect to register.jsx */}
                    <Link to="/register" className="text-white mr-4 p-2">
                        Register
                    </Link>

                    {/* redirect to login.jsx */}
                    <Link to="/login" className="Text-white p-2">
                        Login
                    </Link>

                </>}
            </div>
            
        </nav>
        </>
    )
}

export default NavBar ;