import { createFileRoute, useParams, Outlet } from "@tanstack/react-router";
import AnalysisLapsTable from "../components/AnalysisLapsTable";

export const Route = createFileRoute("/analytics_/$analyticsId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { analyticsId } = Route.useParams();
  return (
    <>
      <div className="flex flex-col items-center ">
        <div className="w-350 bg-purple-400 ">
          <div className="grid grid-cols-5">
            <h1 className="text-3xl mb-8 col-span-4">
              {"Analysis name inside a textbox/outline"}
            </h1>
            <div className="join col-span-1">
              <button className="btn h-8 join-item bg-slate-400">
                {"Private"}
                {/*state ispublic? */}
              </button>
              <details className="dropdown join-item dropdown-end">
                <summary className="btn bg-slate-400 h-8">v</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-30 h-10 p-2 shadow-sm">
                  <li>
                    <a>
                      {"Public"}
                      {/*state opposite of ispublic */}
                    </a>
                  </li>
                </ul>
              </details>
              dropdowns neaizveras pats
            </div>
          </div>
          <div className="">
            <p className="text-lg">
              <strong>Track:</strong>{" "}
              {"Algarve International Circuit (Grand Prix)"}
            </p>
            <p className="text-lg">
              {/*inline relative left-105 top-[-27px]  */}
              <strong>Car:</strong> {"Porsche 911 GT3 R (992)"}
            </p>
          </div>
          <h2 className="text-2xl mt-3 mb-2.5">Laps</h2>
          {/* <AnalysisEvent /> */}

          <AnalysisLapsTable />
          {/* <Accordion /> */}
          {/* <Outlet /> */}
        </div>
      </div>
    </>
  );
}
