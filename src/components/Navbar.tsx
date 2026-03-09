import { Link, useLocation } from "react-router-dom";
import { Code2, Workflow, Home, Terminal, BookOpen } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/node-flow", label: "Node Flow", icon: Workflow },
  { path: "/playground", label: "Playground", icon: Terminal },
  { path: "/challenges", label: "Lessons", icon: BookOpen },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 glow-primary">
            <Code2 className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-foreground">
            Code<span className="text-primary">Flow</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary glow-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
