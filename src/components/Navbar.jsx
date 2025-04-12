import React, { useState } from "react";
import { Button } from "./ui/button";
import { MoonStar, Sun } from "lucide-react";
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

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(false);

  const avatar_url =
    "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <header className="container mx-auto py-3 px-4 flex items-center justify-between shadow-sm border-b ">
      {/* logo */}
      <div>
        <a className="gradient-title text-xl  sm:text-2xl font-bold uppercase">
          Maareeye
        </a>
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
                        <span className=" text-gray-600">
                          <FaUser size={25} />
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-50 mr-3">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>profile</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ) : (
            <a>
              <Button
                variant="purple"
                className="text-lg font-medium"
                size="lg">
                Login
              </Button>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
