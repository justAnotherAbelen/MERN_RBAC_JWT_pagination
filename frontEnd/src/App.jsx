import { BrowserRouter, Route ,Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import { AuthProvider } from "./context/authContext";
import Login from "./pages/login";
import Register from "./pages/register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/privateRoute";
import PublicRoute from "./components/PublicRoute";


const App = () => {
  return (
    <>
    
    {/* Nested layout: parent wrappers provide shared context to child components. */}
    <BrowserRouter>
      {/* Parent router: enables routing features for all nested children (Routes, Route, Link, Navigate). */}
      <AuthProvider>
        {/* Parent auth provider: shares auth/loading state so nested route guards/pages can read it via useAuth. */}

        {/* Child component: can show login/logout and role-aware links using both router + auth context. */}
        <NavBar/>

        {/* Child route tree: each Route renders nested page components based on URL and auth rules. */}
        <Routes>
          <Route path="/login" element={
            <PublicRoute>
                {/* PublicRoute child: only guests should see login/register pages. */}
                <Login/>
            </PublicRoute>
            } />
          <Route path="/register" element={
            <PublicRoute>
               {/* PublicRoute child: redirect authenticated users away from auth forms. */}
               <Register/>
            </PublicRoute>
            } />
          <Route path="/" element={
            <PrivateRoute>
              {/* PrivateRoute child function: chooses dashboard by authenticated user's role. */}
              {
                (auth) => auth.role === "admin" ? 
                <AdminDashboard/> :
                <UserDashboard/>
              }
            </PrivateRoute>} 
          />

        </Routes>

      </AuthProvider>
    </BrowserRouter>
    
    </>
  )
}

export default App;