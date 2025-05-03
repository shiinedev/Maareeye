import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Github,
  LayoutDashboard,
  LogOut,
  MoonStar,
  Settings,
  Sun,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { IconUserCircle } from "@tabler/icons-react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { user, profile, isLoggedIn, logout } = useAuth();

  return (
    <header className="container mx-auto py-3 px-4 flex items-center justify-between  border-b ">
      {/* logo */}
      <div>
        <Link
          to="/"
          className="gradient-title text-xl  sm:text-2xl font-bold uppercase">
          {/* <img src="/public/images/logo.png" alt="logo" width={'40px'}/> */}
        MAAREEYE
        </Link>
      </div>
      {/* theme and login */}

      <div className="flex space-x-4">     
      <Button variant="outline" className="shadow-sm hidden sm:block" asChild>
            <a
              href="https://github.com/shiinedev/maareye"
              rel="noopener noreferrer"
              target="_blank"
              className="">
              <Github />
            </a>
          </Button>   
         <Button
          variant="outline"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="shadow-sm cursor-pointer">
          {theme === "dark" ? <Sun size={40} /> : <MoonStar size={40} />}
        </Button>
        <div>
          {isLoggedIn ? (
            <div className="flex items-center space-x-2 ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar>
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback >
                        <IconUserCircle size={40} />
                      </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-w-70 mt-2 mr-3">
                  <DropdownMenuLabel>
                    <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback >
                        <IconUserCircle size={40} />
                      </AvatarFallback>
                    </Avatar>
                      <div className="flex flex-col">
                        <p className="capitalize">{profile?.username}</p>
                        <p className="text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                  <Link to={"/profile"}>
                    <DropdownMenuItem>
                    <Settings/> Manage Account
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/dashboard">
                    <DropdownMenuItem>
                      <LayoutDashboard /> Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Button
                    className="w-full  mt-2 cursor-pointer"
                    variant="destructive"
                    onClick={() => logout()}>
                    <LogOut /> Logout
                  </Button>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to={"/login"}>
              <Button
                variant="purple"
                className="text-lg font-medium"
                size="lg">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
