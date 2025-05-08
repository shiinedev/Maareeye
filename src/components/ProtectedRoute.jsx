import { useAuth } from '@/context/AuthContext';
import React from 'react'
import { Navigate } from 'react-router';
import { Skeleton } from './ui/skeleton';


const ProtectedRoute = ({children,redirectTo="/login"}) => {
    const {isLoggedIn,isLoading} = useAuth();

    if(isLoading){
        return (
            <div className="min-h-screen flex">
              {/* Sidebar Skeleton */}
              <div className="hidden md:block w-64 p-4 border-r space-y-4">
                <Skeleton className="h-10 w-3/4" /> {/* Logo */}
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
      
              {/* Main Content Skeleton */}
              <div className="flex-1 p-6 space-y-6">
                <Skeleton className="h-8 w-1/3" /> {/* Page Title */}
                <Skeleton className="h-4 w-1/4" /> {/* Subtitle */}
                <Skeleton className="h-64 w-full" /> {/* Main Card */}
              </div>
            </div>
          );
    }

    if(!isLoggedIn){
        return <Navigate  to={redirectTo} replace />
       
    }
  return children;
}


export default ProtectedRoute
