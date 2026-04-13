import { useState , useEffect} from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";

const AdminDashboard = () =>{

    const {auth} = useAuth();
    const [users,setUsers] = useState([]);

    // pagination :
    const [pages,setPages] = useState(1) ;
    const [totalPages,setTotalPages] = useState(1) ;


    const [error,setError] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {

            // ensure the token exist 
            if(!auth?.accessToken){
                return
            }

            try {
                const res = await axios.get(
                    `api/user/all?${pages}&limit=10`,
                    {
                        headers : {
                            Authorization : `Bearer ${auth.accessToken}`,
                        } , withCredentials : true
                    }
                )

                setUsers(res.data.users) ;
                setTotalPages(res.data.totalPages) ;
            }catch(error){
                setError(error)
                console.error("failed to fetch all users" , error)
            }
        };
        fetchUser();
    } , [pages , auth]);

    const handleDelete = async (id) => {
        
        if(!auth?.accesToken){
            return
        }

        try{
            await axios.delete(
                `/api/user/${id}` ,
                {
                    headers : {
                         Authorization :    `Bearer : ${auth.accessToken}`,
                    } ,
                     withCredentials: true 
                } , 
            )
            setUsers( users.filter( (user) => {user._id !== id} ) )
        }catch(error){
            setError(error); 
            console.error("Failed to delete User" , error)
        }
    }

    return(
        <>
        <div className={`container mx-auto mt-10 p-6`} >
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2> 
            {error && <p className="text-red-400 mb-4">{error}</p>}
            <h3 className="text-xl font-semibold mb-4">User Management</h3>
            <ul className="space-y-2">
                {users?.map((user) => (
                    <li key={user._id}>
                        <span>
                            {user.username} ({user.email}) - {user.role}
                        </span>
                        <button 
                        onClick={() => handleDelete(user._id)}
                        className="ml-4 bg-red-400 text-white p-1 rounded hover:bg-red-500"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}

export default AdminDashboard ;