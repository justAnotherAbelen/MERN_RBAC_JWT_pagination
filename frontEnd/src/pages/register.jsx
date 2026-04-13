/// basically the same as the login page with some minor adjustments

import { useState  } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const Register = () => {



    const navigate = useNavigate();

    const [form,setForm] = useState({
        username:"",
        email : "" ,
        password : "" ,
    }) ;

    const [error,setError] = useState(null)

    const handleRegister = async (e) => {
        e.preventDefault() ;
        try{    
            /// register from the front end with axios
            await axios.post("/api/auth/register" , form , {withCredentials : true})
            /// after successful register redirect to user page 
            navigate("/login")
            
        }catch(err){
            setError("Login error !!! pls check your credential")
            console.error("login failed" , err)
        }
    }

    return (
        <>
        <div className={`max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl m-3`}>

             <h2 className={` text-2xl font-bold mb-4`}>Register</h2>

             <form className="space-y-4" onSubmit={handleRegister}>
                <div className="space-y-4">

                     {/*username field*/}
                     <input 
                        type={`username`}  
                        placeholder="username" 
                        value={form.username} 

                        onChange={(e) => setForm({...form , username:e.target.value})}
                        /* copies all existing fields in form, then overwrites only email. */ 
                        
                        className="w-full p-2 border rounded"

                        required
                    />

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
                    Register
                </button>
             </form>
            {error && <p className="text-red-400 mb-4">{error}</p>}
        </div>


        </>
    )
}

export default Register ;