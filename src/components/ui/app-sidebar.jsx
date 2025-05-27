import * as React from "react"
import { NavMain } from "@/components/ui/nav-main"
import { NavUser } from "@/components/ui/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Link } from "react-router"
import { LayoutDashboard,CreditCard, CircleDollarSign,BellPlus,TableProperties} from 'lucide-react';
import { useAuth } from "@/context/AuthContext"
import { DropdownMenuSeparator } from "./dropdown-menu"
import { IconCameraDollar, IconCashRegister, IconReport } from "@tabler/icons-react"

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
      icon: IconCameraDollar      ,
    },
    {
      title: "Transactions",
      url: "/dashboard/transactionList",
      icon: IconCashRegister,
    },
    {
      title: "Make Plan",
      url: "/dashboard/makePlan",
      icon: BellPlus,
    },
    {
      title: "Your Plans",
      url: "/dashboard/yourPlans",
      icon: TableProperties,
    },
    {
      title: "Accounts",
      url: "/dashboard/accounts",
      icon: CreditCard,
    },
    {
      title: "Report",
      url: "/dashboard/report",
      icon: IconReport,
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
              <Link to="/">
                <span className="text-xl font-bold gradient-title ">Maareeye</span>
              </Link>
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
