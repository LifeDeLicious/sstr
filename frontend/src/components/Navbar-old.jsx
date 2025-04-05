import { Link } from "@tanstack/react-router";

const userOptions = [
  {
    optionName: "Profile",
    goTo: "/profile",
  },
  {
    optionName: "log out",
    goTo: "/",
  },
  {
    optionName: "admin",
    goTo: "/admin",
  },
];

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/simple" className="underline">
              go to simple
            </Link>
          </li>
          <li>
            {/* <details>
              <summary className="pe-4 ps-6">Parent</summary>
              <ul className="bg-base-100 rounded-t-none p-2 w-23">
                {userOptions.map((option) => (
                  <li>
                    <Link to={option.goTo}>{option.optionName}</Link>
                  </li>
                ))}
                {/* <li>
                  <a>Link 1</a>
                </li>
                <li>
                  <a>Link 2</a>
                </li> */}
            {/* </ul>
            </details> */}
          </li>
        </ul>
      </div>
    </div>
  );
}
