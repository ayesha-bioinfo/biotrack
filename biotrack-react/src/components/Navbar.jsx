import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FlaskConical,
  BarChart3,
  Users,
  CircleHelp,
  Mail,
  Dna
} from "lucide-react";

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true
  },
  {
    to: "/samples",
    label: "Samples",
    icon: FlaskConical
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: BarChart3
  },
  {
    to: "/researchers",
    label: "Researchers",
    icon: Users
  },
  {
    to: "/about",
    label: "About",
    icon: CircleHelp
  },
  {
    to: "/contact",
    label: "Contact",
    icon: Mail
  }
];

function Navbar() {
  return (
    <header className="research-navbar">

      {/* BRAND */}
      <NavLink to="/" className="research-brand">
        <div className="research-brand-icon">
          <Dna size={31} strokeWidth={1.8} />
        </div>

        <div className="research-brand-text">
          <strong>BioTrack</strong>
          <span>Research. Track. Discover.</span>
        </div>
      </NavLink>

      {/* NAVIGATION */}
      <nav className="research-nav-capsule">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              isActive
                ? "research-nav-item research-nav-active"
                : "research-nav-item"
            }
          >
            <Icon size={18} strokeWidth={1.8} />

            <span>{label}</span>

            <span className="research-active-dot" />
          </NavLink>
        ))}
      </nav>

      {/* DECORATIVE RIGHT SIDE */}
      <div className="research-navbar-end">
        <span className="navbar-live-dot" />

        <div>
          <span>BioTrack</span>
          <small>Research Workspace</small>
        </div>
      </div>

    </header>
  );
}

export default Navbar;