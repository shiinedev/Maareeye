import { getUserProfile, onAuthChange, singOut } from '@/utils/auth';
import React, { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Navigate } from 'react-router';



const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [profile,setProfile] = useState(null);
    const [isLoading,setIsLoading] = useState(false);



    useEffect(()=>{
        setIsLoading(true)
        const cleanUp = onAuthChange( async (user)=>{
            setUser(user);

            if(user){
                try {
                    const profile = await getUserProfile(user.id);
                    setProfile(profile)
                    console.log("user profile",profile);
                } catch (error) {
                    console.log("error profile fetching",error);
                }
            }else{
                setProfile(null);
            }
            setIsLoading(false);
        });

        return cleanUp;
    },[]);

    const logout = async()=>{
        try {
            await singOut();
            <Navigate to="/login" replace={true} />
            toast.success("user logged out");
        } catch (error) {
            console.log("error user logout ")
            toast.error("error user logout")
        }
        
    }

    const value = {
        user,
        profile,
        isLoading,
        isLoggedIn:!!user,
        logout
    }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = ()=>{
    const context = useContext(AuthContext);

    if(context === null){
        console.log("useAuth must be in AuthProvider");
    }

    return context;
}


