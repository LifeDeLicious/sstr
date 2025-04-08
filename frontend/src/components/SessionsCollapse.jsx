import SessionsCollapseTable from "./SessionsCollapseTable";

export default function SessionsCollapse() {
  return (
    <>
      <details className="collapse collapse-arrow bg-base-200 border-base-300 border mb-3">
        <summary className="collapse-title font-semibold">
          <div>
            <p className="text-lg">{"Porsche 911 GT3 R (992)"}</p>
            <p className="text-lg">
              {"Algarve International Circuit (Grand Prix)"}
            </p>
            <p className="absolute top-3 right-100">Events: {5}</p>
            <p className="absolute top-3 right-40">Last driven: {"2 months"}</p>
            <p className="absolute top-10 right-101">Laps: {40}</p>
            <p className="absolute top-10 right-38">
              Total time on track: {53}
            </p>
            <p className=" invisible"></p>
          </div>
        </summary>
        <div className="divider mt-0 mb-0"></div>
        <div className="collapse-content text-sm">
          but upatikami samazinat starpu starp divideru un tabulas headingiem
          <SessionsCollapseTable className="" />
        </div>
      </details>
    </>
  );
}
