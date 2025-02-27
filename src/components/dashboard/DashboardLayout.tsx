
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { signOut, user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-x-hidden">
          <div className="container py-6 space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-muted-foreground">
                  Logged in as: {user?.email}
                </span>
              </div>
              <Button variant="ghost" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
            <div className="animate-fadeIn">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
