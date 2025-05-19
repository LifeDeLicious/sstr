//import { navbarItems } from "../assets/navbarItems";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "@tanstack/react-router";

const userOptions = [
  {
    title: "Overview",
    linkTo: "/sessions",
  },
  {
    title: "Analytics",
    linkTo: "/analytics",
  },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  console.log("navbar user: ", user);

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/" });
  };

  //
  return (
    <div className="navbar light bg-base-100 shadow-sm">
      <div className="navbar-start">
        <Link to={"/"} className="btn btn-ghost normal-case text-lg">
          Sim Racing Telemetry Tool
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
      </div>{" "}
      <div className="navbar-end">
        {user ? (
          <>
            <button
              className="btn"
              popoverTarget="popover-1"
              style={{ anchorName: "--anchor-1" }}
            >
              {user.Username}
            </button>
            <ul
              className="dropdown dropdown-end menu w-52 bg-base-200 rounded-box shadow-sm"
              popover="auto"
              id="popover-1"
              style={{ positionAnchor: "--anchor-1" }}
            >
              <li>
                <Link to={"/usersettings"}>User settings</Link>
              </li>
              {user.IsAdmin ? (
                <>
                  <div className="divider mt-0 mb-0"></div>
                  <li>
                    <Link to={"/admin"}>Admin panel</Link>
                  </li>
                </>
              ) : (
                <></>
              )}
              <div className="divider mt-0 mb-0"></div>
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
