import { NavLink } from "react-router-dom";
import { Activity, Cloud, LayoutDashboard, Shield, Terminal } from "lucide-react";
import { cn } from "@/lib/cn";

const navItems = [
  { to: "/", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
  { to: "/environments", icon: <Cloud className="w-4 h-4" />, label: "Environments" },
  { to: "/studio", icon: <Terminal className="w-4 h-4" />, label: "Sim Studio" },
  { to: "/incidents", icon: <Shield className="w-4 h-4" />, label: "Incidents" },
  { to: "/events", icon: <Activity className="w-4 h-4" />, label: "Events" },
];

export function NavSidebar() {
  return (
    <nav className="w-14 lg:w-48 flex-shrink-0 bg-surface-elevated border-r border-border-subtle flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center px-3 border-b border-border-subtle">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0">
            <Shield className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="text-sm font-semibold text-white hidden lg:block truncate">
            SentinelGrid
          </span>
        </div>
      </div>

      {/* Nav links */}
      <ul className="flex flex-col gap-0.5 p-2 flex-1">
        {navItems.map(({ to, icon, label }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 px-2 py-2 rounded text-sm transition-colors",
                  isActive
                    ? "bg-accent/15 text-accent"
                    : "text-gray-400 hover:text-white hover:bg-surface-overlay"
                )
              }
            >
              {icon}
              <span className="hidden lg:block">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Version tag */}
      <div className="p-2 border-t border-border-subtle">
        <p className="text-xs text-gray-600 font-mono hidden lg:block px-2">v0.1.0</p>
      </div>
    </nav>
  );
}
