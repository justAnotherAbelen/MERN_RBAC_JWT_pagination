import { useState  } from "react";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const {setAuth} = useAuth() ;

    const navigate = useNavigate();

    const [form,setForm] = useState({
        email : "" ,
        password : "" ,
    }) ;

    const [error,setError] = useState(null)

    const handleLogin = async (e) => {
        e.preventDefault() ;
        try{
            const res = await axios.post(
                "/api/auth/login",
                { loginEmail: form.email, loginPassword: form.password },
                { withCredentials: true }
            );
            setAuth({accessToken : res.data.accessToken , role : res.data.user.role}) ;
            console.log(res.data)

            // simple redirect 
            navigate("/")

            // redirect based on role 
            // if(res.data.user.role === "admin"){
                // navigate("/")
            // }else{
                // navigate("/")
            // }
        }catch(err){
            setError("Login error !!! pls check your credential")
            console.error("login failed" , err)
        }
    }

    return (
        <>
        <div className={`max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl m-3`}>

             <h2 className={` text-2xl font-bold mb-4`}>Login</h2>

            

             <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-4">
                    {/*email field*/}
                    <input 
                        type={`email`}  
                        placeholder="Email" 
                        value={form.email} 

                        onChange={(e) => setForm({...form , email:e.target.value})}
                        /* copies all existing fields in form, then overwrites only email. */ 
                        
                        className="w-full p-2 border rounded"

                        required
                    />

                    {/*password field*/}
                    <input 
                        type={`password`}  
                        placeholder="Password" 
                        value={form.password} 

                        onChange={(e) => setForm({...form , password:e.target.value})}
                        /* copies all existing fields in form, then overwrites only password. */ 
                        
                        className="w-full p-2 border rounded"

                        required
                    />
                </div>

                <button 
                type="submit"
                className="w-full bg-blue-300 rounded-lg text-white p-2 hover:bg-blue-500">
                    Login
                </button>
             </form>
            {error && <p className="text-red-400 mb-4">{error}</p>}
        </div>


        </>
    )
}

export default Login ;