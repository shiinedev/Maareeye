import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useState } from "react";
import { Link, useLocation } from "react-router";

export function NavMain({
  items
}) {
  const location = useLocation()
  const currentPath = location.pathname
  console.log(currentPath)
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
              // Check if the current path matches this item's URL
              // Also handle exact matches and nested routes
               const isActive = currentPath === item.url || (item.url !== "/dashboard" && currentPath.startsWith(item.url))
        
              return (
            <Link key={item.title} to={item.url}>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.title} isActive={isActive} >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            </Link>
          )})}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
