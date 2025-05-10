import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext.jsx";

import { LineChart, Line } from "recharts";
import AnalysisGraphsCharts from "../components/AnalysisGraphsCharts.jsx";
const data = [
  { name: "page a", uv: 400, pv: 2400, amt: 2400 },
  { name: "page b", uv: 350, pv: 2800, amt: 2800 },
];

export const Route = createFileRoute("/analytics_/$analyticsID_/graphs")({
  component: RouteComponent,
});

const renderChart = (
  <LineChart width={400} height={400} data={data}>
    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
  </LineChart>
);

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
  const { analyticsId } = Route.useParams();
  return (
    <>
      <div className="grid grid-cols-6">
        <p></p>
        <p></p>
        <p></p>
        <p>{"Analysis name"}</p>
        <p></p>
        <button className="btn w-25">Configure</button>
      </div>
      <div className="divider mt-0 mb-0"></div>
      <div className="grid grid-cols-3 w-full">
        <div className="border col-span-1">
          <LineChart width={500} height={400} data={data}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          </LineChart>
        </div>
        <div className="col-span-2">
          <AnalysisGraphsCharts className="" />
        </div>
      </div>
    </>
  );
}
