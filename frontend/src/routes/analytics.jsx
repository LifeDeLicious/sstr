import { createFileRoute, Outlet } from "@tanstack/react-router";
import Accordion from "../components/Accordion";
import AnalysisEvent from "../components/AnalysisEvent";

export const Route = createFileRoute("/analytics")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <div className="flex flex-col items-center ">
        <div className="w-350">
          <h1 className="text-3xl mb-2.5">Analytics</h1>
          <h2 className="text-2xl mb-2.5">Recently viewed</h2>
          <AnalysisEvent />

          <br></br>
          {/* <Accordion /> */}
          <Outlet />
        </div>
      </div>
    </>
  );
}
