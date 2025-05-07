import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { List } from "../components/List";
import Navbar from "../components/Navbar";
import Accordion from "../components/Accordion";
import { useAuth } from "../context/AuthContext.jsx";

// It's the layout component
export const Route = createRootRoute({
  component: () => {
    const { user, loading } = useAuth();

    return (
      <>
        {/* <Navbar></Navbar> */}
        {user && <Navbar />}

        <main className="p-2">
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
        {/* sitaa diva vieta var ielikt navbaru un navbara salikt <Link'us> */}
        {/* <div className="divider"></div> */}
        {/* <div className="p-2 flex gap-2"> */}
        {/* <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <Link to="/posts" className="[&.active]:font-bold">
          Posts
        </Link>
        <Link to="/simple" className="[&.active]:font-bold">
          Simple
        </Link> */}
        {/* </div> */}
        {/* <hr /> */}
        {/* <Outlet /> */}
        {/* <Comp />
      <List />
      <Accordion className="mt-20" /> */}
        <TanStackRouterDevtools />
      </>
    );
  },
});

export function Comp() {
  return (
    <div>
      <h3 className="text-2xl underline">amongususus</h3>
    </div>
  );
}
