import { createFileRoute, Outlet } from "@tanstack/react-router";
import Accordion from "../components/Accordion";
import AnalysisEvent from "../components/AnalysisEvent";

export const Route = createFileRoute("/analytics")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col items-center ">
        <div className="w-350 bg-purple-400 ">
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
