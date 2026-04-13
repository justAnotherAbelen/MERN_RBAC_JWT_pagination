import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";

const UserDashboard = () => {

    const {auth} = useAuth() ;
    const [profile,setProfile] = useState(null) ;
    const [error,setError] = useState(null) ;

    useEffect(() => {
        const fetchProfile = async () => {
            if(!auth?.accessToken){
                return 
            }

            try {
                const res = await axios.get(
                    "api/user/me",
                    {
                        headers : {
                            Authorization: `Bearer ${auth.accessToken}`
                        },
                        withCredentials : true
                    },
                )

                // update the profile data
                setProfile(res.data)

            }catch(error){
                setError(error);
                console.error(error);
            }
        };
        fetchProfile();
    } , [auth])
// useEffect(... , [auth]) : mean rerun this useEffect whenever [auth] got update or changed

    return (
        <>
        <div className="container mx-auto mt-10 p-6"> 
            <h2 className="text-2xl font-bold mb-4"> User Dashboard</h2>
            
            {error && <p className="text-red-400 mb-4">{error}</p> }

            {profile ? (
                <div className="bg-white p-4 rounded shadow"> 
                    <h3 className="text-xl font-semibold">Portfolio Information</h3>
                    <p><strong>Username : </strong> {profile.username}</p>
                    <p><strong>Email : </strong> {profile.email}</p>
                    <p><strong>Role : </strong> {profile.role}</p>
                </div>
            ) : (
                <p className="text-gray-400"> Loading profile....</p>
            )}
        </div>
        </>
    )
}

export default UserDashboard ;