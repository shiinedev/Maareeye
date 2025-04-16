import * as React from "react"
import { NavMain } from "@/components/ui/nav-main"
import { NavUser } from "@/components/ui/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router"
import { LayoutDashboard,BadgeDollarSign, BadgePlus,CreditCard, CircleDollarSign} from 'lucide-react';
import { useAuth } from "@/context/AuthContext"
import { DropdownMenuSeparator } from "./dropdown-menu"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Add Transaction",
      url: "/dashboard/addTransaction",
      icon: BadgePlus,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactionList",
      icon: BadgeDollarSign,
    },
    {
      title: "Accounts",
      url: "/dashboard/accounts",
      icon: CreditCard,
    },
  ],

}

export function AppSidebar({
  ...props
}) {

  const {user,profile} = useAuth();

  const userData = {
    name: profile?.username,
    email: user?.email,
    avatar: profile?.avatar_url,
  }


  return (
    <Sidebar collapsible="offcanvas" {...props} className={"border-r"}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5 ">
              <Link to="/">
                <CircleDollarSign  className="!size-5" />
                <span className="text-base font-semibold gradient-title">Maareye</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <DropdownMenuSeparator />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
