import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  LogOut,
  MoonStar,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { user, profile, isLoggedIn, logout } = useAuth();

  return (
    <header className="container mx-auto py-3 px-4 flex items-center justify-between shadow-sm border-b ">
      {/* logo */}
      <div>
        <Link
          to="/"
          className="gradient-title text-xl  sm:text-2xl font-bold uppercase">
          Maareeye
        </Link>
      </div>
      {/* theme and login */}
      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="shadow-md">
          {theme === "dark" ? <Sun size={40} /> : <MoonStar size={40} />}
        </Button>
        <div>
          {isLoggedIn ? (
            <div className="flex items-center space-x-2 ">
              <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback >
                        <User size={40} />
                      </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-w-70 mt-2 mr-3">
                  <DropdownMenuLabel>
                    <div className="flex items-center space-x-4">
                      <div>
                        {profile?.avatar_url ? (
                          <Avatar>
                            <AvatarImage src={profile?.avatar_url} />
                          </Avatar>
                        ) : (
                          <Avatar className="w-8 h-8 rounded-full">
                            <User size={30} />
                          </Avatar>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <p className="capitalize">{profile?.username}</p>
                        <p className="text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to={"/profile"}>
                    <DropdownMenuItem>
                      <Settings /> Manege Account
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/dashboard">
                    <DropdownMenuItem>
                      {" "}
                      <LayoutDashboard /> Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Button
                    className="w-full  mt-2 cursor-pointer"
                    variant="destructive"
                    onClick={() => logout()}>
                    <LogOut /> Logout
                  </Button>
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
