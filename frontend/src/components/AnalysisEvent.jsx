import SessionsCollapseTable from "./SessionsCollapseTable";
import { Link } from "@tanstack/react-router";

export default function SessionsCollapse() {
  return (
    <>
      <details className="collapse bg-base-200 border-base-300 border mb-3">
        <summary className="collapse-title font-semibold">
          <div className="grid grid-cols-5">
            <div className="col-span-2">
              <h1 className="text-2xl mt-0">{"analysis name ..."}</h1>
              <p className="text-md">{"Porsche 911 GT3 R (992)"}</p>
              <p className="text-md">
                {"Algarve International Circuit (Grand Prix)"}
              </p>
            </div>
            <div className="col-span-2">
              {/* <p className="absolute top-3 right-100">Events: {5}</p>
              <p className="absolute top-3 right-40">
                Last driven: {"2 months"}
              </p>
              <p className="absolute top-10 right-101">Laps: {40}</p>
              <p className="absolute top-10 right-38">
                Total time on track: {53}
              </p> */}
              <p className="mt-7">{"x time ago"}</p>
            </div>
            <div className="col-span-1">
              <Link to={`/analytics/${15}`}>
                <button className="btn h-17 bg-slate-600 mt-1.75 ml-25">
                  Config
                </button>
              </Link>
              <Link to={`/analytics/${15}/graphs`}>
                <button className="btn h-17 bg-slate-600 mt-1.75">
                  Graphs
                </button>
              </Link>
            </div>
            <p className=" invisible"></p>
          </div>
        </summary>
        {/* <div className="divider mt-0 mb-0"></div> */}
        {/* <div className="collapse-content text-sm">
          but upatikami samazinat starpu starp divideru un tabulas headingiem
          <SessionsCollapseTable className="" />
        </div> */}
      </details>
    </>
  );
}
