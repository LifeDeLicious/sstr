//import { navbarItems } from "../assets/navbarItems";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext.jsx";

const userOptions = [
  {
    title: "Overview",
    linkTo: "/sessions",
  },
  {
    title: "Analytics",
    linkTo: "/analytics",
  },
  {
    title: "admin",
    linkTo: "/admin",
  },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  console.log("navbar user: ", user);

  const handleLogout = async () => {
    await logout();
  };

  //
  return (
    <div className="navbar light bg-base-100 shadow-sm">
      <div className="navbar-start">
        <Link to={"/"} className="btn btn-ghost normal-case text-lg">
          {/* <a>Sim Racing Telemetry Tool</a> */}Sim Racing Telemetry Tool
        </Link>
        <ul className="menu menu-horizontal px-1">
          {userOptions.map((option) => (
            <li key={option.title}>
              <Link
                className="[&.active]:font-bold [&.active]:text-purple-900 link"
                to={option.linkTo}
              >
                {option.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* </ul>
      </div> */}{" "}
      <div className="navbar-end">
        {user ? (
          <>
            <button
              className="btn"
              popoverTarget="popover-1"
              style={{ anchorName: "--anchor-1" } /* as React.CSSProperties */}
            >
              {user.Username}
            </button>
            <ul
              className="dropdown dropdown-end menu w-52 bg-base-200 rounded-box shadow-sm"
              popover="auto"
              id="popover-1"
              style={
                { positionAnchor: "--anchor-1" } /* as React.CSSProperties */
              }
            >
              <li>
                <Link to={"/usersettings"}>User settings</Link>
              </li>
              <div className="divider mt-0 mb-0"></div>
              {/* {user.isAdmin && (
            <> */}
              <li>
                <Link to={"/admin"}>Admin panel</Link>
              </li>
              <div className="divider mt-0 mb-0"></div>
              {/* </>
          )} */}
              <li onClick={handleLogout}>
                <a>Log out</a>
              </li>
            </ul>
          </>
        ) : (
          <Link to="/" className="btn btn-ghost">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
