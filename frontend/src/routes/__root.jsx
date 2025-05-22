import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext.jsx";

export const Route = createRootRoute({
  component: () => {
    const { user, loading } = useAuth();

    return (
      <>
        <Navbar></Navbar>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    );
  },
});
