import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import useAuthStore from "@/store/authStore";

export function AppLayout() {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full">
        {/* Topbar would go here if needed, but sidebar takes main nav. We will just add a subtle header wrapper */}
        <div className="flex px-8 py-4 items-center justify-between border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
           <h1 className="text-sm font-medium text-muted-foreground">Smart Compliance Tracking System</h1>
           <div className="flex items-center space-x-4 text-sm text-muted-foreground">
             <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">GH</span>
           </div>
        </div>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
