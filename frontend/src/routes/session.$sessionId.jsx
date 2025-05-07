import { createFileRoute, useParams } from "@tanstack/react-router";
import SessionLapsTable from "../components/SessionLapsTable";

export const Route = createFileRoute("/session/$sessionId")({
  // loader: async ({ params }) => {
  //   return fetchPost(params.sessionId);
  // },
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
  //const params = useParams();
  //console.log(params);

  //const { sessionId } = params || {};
  const { sessionId } = Route.useParams();

  return (
    <>
      <div className="flex flex-col items-center ">
        <div className="w-350">
          <div className="grid grid-cols-5">
            <h1 className="text-3xl mb-8 col-span-4">
              {"Session 'name' - 03.02.2025 16:49"}
            </h1>
            <div className="join">
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
          {/* <p>Hello "/sessions"!</p> */}
          <div className="grid grid-cols-2">
            <p className="text-lg">
              <strong>Track:</strong>{" "}
              {"Algarve International Circuit (Grand Prix)"}
            </p>
            <p className="text-lg">
              {/*inline relative left-105 top-[-27px]  */}
              <strong>Car:</strong> {"Porsche 911 GT3 R (992)"}
            </p>
            <p className="">
              <strong>Laps:</strong> {5}
            </p>
            <p className="">
              <strong>Fastest lap:</strong> {"2 months"}
            </p>
            <p className="">
              <strong>Average lap time:</strong> {40}
            </p>
            <p className="">
              <strong>Date:</strong> {53}
            </p>
          </div>
          <div className="">
            <p>temperaturas</p>
          </div>
          {/* <p>lap table</p> */}
          <br></br>
          <SessionLapsTable />
        </div>
      </div>
    </>
  );
}
