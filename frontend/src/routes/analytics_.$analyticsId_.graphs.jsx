import {
  createFileRoute,
  useNavigate,
  useParams,
  Link,
} from "@tanstack/react-router";
import { useAuth } from "../context/AuthContext.jsx";

import { LineChart, Line } from "recharts";
import AnalysisGraphsCharts from "../components/AnalysisGraphsCharts.jsx";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
const data = [
  { name: "page a", uv: 400, pv: 2400, amt: 2400 },
  { name: "page b", uv: 350, pv: 2800, amt: 2800 },
];

export const Route = createFileRoute("/analytics_/$analyticsId_/graphs")({
  component: RouteComponent,
});

const renderChart = (
  <LineChart width={400} height={400} data={data}>
    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
  </LineChart>
);

function RouteComponent() {
  const { analyticsId } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // const [telemetryData, setTelemetryData] = useState(null);
  // const [isLoadingTelemetry, setIsLoadingTelemetry] = useState(false);

  const {
    data: analyticsGraphData,
    isLoading: analyticsGraphLoading,
    error: graphError,
  } = useQuery({
    queryKey: ["analyticsGraphData", analyticsId],
    queryFn: async () => {
      const res = await fetch(
        `https://api.sstr.reinis.space/analysis/graphs/${analyticsId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.status === 401) {
        throw new Error("private");
      } else if (!res.ok) {
        throw new Error("Failed to get analytics graph laps data");
      }

      return res.json();
    },
    enabled: !!user && !!analyticsId,
    retry: (failureCount, error) => {
      if (error.message === "private") {
        return false;
      }
      return failureCount < 3;
    },
  });

  if (graphError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="alert alert-error">
          <span>
            {graphError.message === "private"
              ? "This analysis is private. You don't have access to view it."
              : "Failed to load graph data"}
          </span>
        </div>
      </div>
    );
  }

  if (loading || analyticsGraphLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/" });
  }

  return (
    <>
      <div className="grid grid-cols-6">
        <p></p>
        <p></p>
        <p></p>
        <p>{"Analysis name"}</p>
        <p></p>
        <Link to={`/analytics/${analyticsId}`}>
          <button className="btn w-25">Configure</button>
        </Link>
      </div>
      <div className="divider mt-0 mb-0"></div>
      <div className="grid grid-cols-3 w-full">
        {/* <div className="border col-span-1">
          <LineChart width={500} height={400} data={data}>
            <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          </LineChart>
        </div> */}
        <div className="">
          <AnalysisGraphsCharts
            analyticsGraphData={analyticsGraphData}
            className=""
          />
        </div>
      </div>
    </>
  );
}
