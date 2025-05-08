import { useAuth } from '@/context/AuthContext';
import React from 'react'
import { Navigate } from 'react-router-dom';
import { Skeleton } from './ui/skeleton';

const UnAuthenticatedRoutes = ({children , redirectTo="/"}) => {

    const {isLoggedIn,isLoading} = useAuth();

    if(isLoading){
        return (
            <div className="min-h-screen flex flex-col">
              {/* Skeleton Navbar */}
              <div className="h-16 px-6 flex items-center border-b shadow-sm">
                <Skeleton className="h-6 w-32" /> {/* Logo */}
                <div className="ml-auto space-x-4 hidden sm:flex">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
      
              {/* Page Content */}
              <div className="flex flex-1 justify-center items-center">
                <div className="w-full max-w-md space-y-6 p-6">
                  <Skeleton className="h-8 w-2/3 mx-auto" /> {/* Page Title */}
                  <Skeleton className="h-4 w-1/2 mx-auto" /> {/* Subtitle */}
                  <div className="space-y-4 mt-6">
                    <Skeleton className="h-10 w-full" /> {/* Input 1 */}
                    <Skeleton className="h-10 w-full" /> {/* Input 2 */}
                    <Skeleton className="h-10 w-full" /> {/* Button */}
                  </div>
                </div>
              </div>
            </div>
          );
    }

    if(isLoggedIn){
        return <Navigate  to={redirectTo} replace />
    }
  return children;
}

export default UnAuthenticatedRoutes