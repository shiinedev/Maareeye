import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Github, MoonStar, Sun } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { Link } from "react-router";

export function SiteHeader() {
   const { theme, setTheme } = useTheme();
  return (
    <header
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center py-[8px]  gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <Link to="/dashboard" className="text-base font-medium gradient-title">Dashboard</Link>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" asChild size="sm" className="hidden sm:flex">
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
          size={"sm"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          asChild 
        >
          {theme === "dark" ? <Sun size={40} /> : <MoonStar size={40} />}
          
        </Button>
        </div>
      </div>
    </header>
  );
}
