import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Map, Compass, Wrench, User } from "lucide-react";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/jornada", label: "Jornada", icon: Map },
  { to: "/centro-operacional", label: "Centro", icon: Compass },
  { to: "/ferramentas", label: "Ferramentas", icon: Wrench },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-2xl px-3 pb-3 pt-2">
        <div className="glass-strong flex items-center justify-around rounded-full px-2 py-2 shadow-elevated">
          {items.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/home" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className="group relative flex flex-1 flex-col items-center gap-0.5 rounded-full px-2 py-2 transition-colors"
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                    active
                      ? "bg-gradient-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span
                  className={`text-[10px] font-medium tracking-wide transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
