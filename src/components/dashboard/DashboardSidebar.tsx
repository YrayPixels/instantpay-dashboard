
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
  { title: "API Keys", icon: Key, url: "/api-keys" },
  { title: "Transactions", icon: BarChart3, url: "/transactions" },
  { title: "Payment Settings", icon: Wallet, url: "/settings/payment" },
  { title: "Webhooks", icon: Webhook, url: "/webhooks" },
  { title: "Settings", icon: Settings, url: "/profile-settings" }
];

export default function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
            InstantPay
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center space-x-3 rounded-lg px-3 py-2"
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
