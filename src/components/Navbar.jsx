import React, { useState } from "react";
import { Button } from "./ui/button";
import { MoonStar, Sun, User } from "lucide-react";
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

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);

  const avatar_url =false
  return (
    <header className="container mx-auto py-3 px-4 flex items-center justify-between shadow-sm border-b ">
      {/* logo */}
      <div>
        <Link to="/" className="gradient-title text-xl  sm:text-2xl font-bold uppercase">
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
          {isLogin ? (
            <div className="flex items-center space-x-2 ">
              <div className="relative ">
                <DropdownMenu>
                  <DropdownMenuTrigger className="">
                    <Button className="w-8 h-8 rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-purple-600">
                      {avatar_url ? (
                        <Avatar>
                          <AvatarImage src={avatar_url} />
                        </Avatar>
                      ) : (
                        <span >
                          <User size={25} />
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-50 mt-2 mr-3">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link to={"/profile"}>
                    <DropdownMenuItem>profile</DropdownMenuItem>
                    </Link>
                   <Link to="/dashboard">
                   <DropdownMenuItem>Dashboard</DropdownMenuItem>
                   </Link>
                   <Link to={"/login"}>
                   <DropdownMenuItem>Logout</DropdownMenuItem>
                   </Link>
                   
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
            <Link to={"/login"} >
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
