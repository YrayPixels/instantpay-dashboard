
import {
  BarChart3,
  Key,
  Settings,
  Wallet,
  Webhook,
  Home,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Homepage Settings", icon: Wallet, url: "/home-settings" },
  { title: "Gallery", icon: Key, url: "/gallery" },
  { title: "Chapters", icon: BarChart3, url: "/chapters" },
  { title: "News/Events", icon: Webhook, url: "/news" },
  { title: "Profile Settings", icon: Settings, url: "/profile-settings" }
];

export default function DashboardSidebar() {
  return (
    <Sidebar className="bg-main2 text-white">
      <SidebarHeader className="">
        <div className="flex items-center bg-white rounded-xl justify-center p-3 space-x-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
            <img src="/images/logo.png" style={{ height: "100px" }} alt="" />
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center space-x-3 hover:bg-accent2 hover:text-main2 rounded-lg px-3 py-2"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
