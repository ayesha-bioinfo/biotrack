import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        🧬 BioTrack
      </div>

      <ul>

        <li>
          <NavLink to="/">
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/samples">
            Samples
          </NavLink>
        </li>

        <li>
          <NavLink to="/analytics">
            Analytics
          </NavLink>
        </li>

        <li>
          <NavLink to="/researchers">
            Researchers
          </NavLink>
        </li>

        <li>
          <NavLink to="/about">
            About
          </NavLink>
        </li>

        <li>
          <NavLink to="/contact">
            Contact
          </NavLink>
        </li>

      </ul>

    </nav>
  );
}

export default Navbar;