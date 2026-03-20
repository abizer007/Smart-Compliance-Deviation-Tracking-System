import { NavLink } from "react-router-dom";
import { FolderGit2, AlertCircle, FileText, CheckSquare, Search, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore";

export function Sidebar() {
  const { user, logout } = useAuthStore();

  const navItems = [
    { name: "Dashboard", href: "/", icon: FolderGit2 },
    { name: "SOPs", href: "/sops", icon: FileText },
    { name: "Deviations", href: "/deviations", icon: AlertCircle },
    { name: "CAPAs", href: "/capas", icon: CheckSquare },
    { name: "Audits", href: "/audits", icon: Search },
  ];

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col h-full sticky top-0">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <FolderGit2 className="h-6 w-6 text-primary" />
        <span className="font-semibold text-lg tracking-tight">ComplianceHub</span>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex flex-col truncate">
            <span className="text-sm font-medium">{user?.name || "User"}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email || ""}</span>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent transition-colors"
          >
             <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
