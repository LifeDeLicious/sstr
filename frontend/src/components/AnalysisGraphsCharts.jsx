import { React, useEffect, useMemo, useState } from "react";
import {
  ScatterChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  AreaChart,
  Area,
  ResponsiveContainer,
  Scatter,
} from "recharts";

const dataColors = ["#eb4034", "#2842eb", "#ff0dff"];
const heightValue = 127;

function mergeTelemetryData(...dataSources) {
  // Step 1: Collect all unique TrackPositions from all datasets
  const allTrackPositions = dataSources.flatMap((ds) =>
    ds.map((d) => d.TrackPosition)
  );
  const uniqueTrackPositions = Array.from(new Set(allTrackPositions)).sort(
    (a, b) => a - b
  );

  // Step 2: Create a merged entry for each TrackPosition
  return uniqueTrackPositions.map((trackPos) => {
    const entry = { TrackPosition: trackPos };

    // Step 3: For each data source, find the closest value for this TrackPosition
    dataSources.forEach((source, index) => {
      const closest = source.find(
        (d) => Math.abs(d.TrackPosition - trackPos) < 0.0001
      ); // Small tolerance
      entry[`Speed${index + 1}`] = closest?.Speed ?? null;
      entry[`Throttle${index + 1}`] = closest?.Throttle ?? null;
      entry[`Brake${index + 1}`] = closest?.Brake ?? null;
      entry[`SteeringAngle${index + 1}`] = closest?.SteeringAngle ?? null;
      entry[`Gear${index + 1}`] = closest?.Gear ?? null;
    });

    return entry;
  });
}

export default function AnalysisGraphsCharts({
  analyticsGraphData,
  telemetryData,
}) {
  const [telemetryDataArray, setTelemetryDataArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [combined, setCombined] = useState([]);

  useEffect(() => {
    if (
      !analyticsGraphData ||
      !analyticsGraphData.laps ||
      analyticsGraphData.laps.length === 0
    ) {
      return;
    }

    async function fetchTelemetryData() {
      try {
        setIsLoading(true);

        const fileKeys = analyticsGraphData.laps.map((lap) => lap.lapFileKey);

        const response = await fetch(
          "https://api.sstr.reinis.space/laps/batch",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fileKeys }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch telemetry data");
        }

        const result = await response.json();
        setTelemetryDataArray(result.telemetry || []);
      } catch (error) {
        console.error("Error fetching telemetry data:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTelemetryData();
  }, [analyticsGraphData]);

  useEffect(() => {
    if (telemetryDataArray.length === 0) return;

    try {
      const dataSources = telemetryDataArray.map((item) => item.data);

      const mergedData = mergeTelemetryData(...dataSources);
      setCombined(mergedData);
    } catch (error) {
      console.error("Error processing telemetry data:", error);
      setError("Error processing telemetry data");
    }
  }, [telemetryDataArray]);

  if (isLoading) {
    return <div>Loading telemetry data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (combined.length === 0) {
    return <div>No telemetry data available</div>;
  }

  return (
    <>
      <div className="grid grid-cols-3" style={{ width: "100%" }}>
        <div className="col-span-1">
          <ResponsiveContainer width={500} height={400}>
            <ScatterChart
              margin={{
                top: 10,
                right: 10,
                bottom: 10,
                left: 10,
              }}
            >
              <XAxis dataKey="X" name="X position" type="number" />
              <YAxis dataKey="Y" name="Y position" type="number" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222c42",
                }}
              />
              <Scatter name="Car position" line />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="col-span-2">
          <h4>Speed</h4>
          <ResponsiveContainer width="100%" height={heightValue}>
            <LineChart
              width={500}
              height={heightValue}
              data={combined}
              syncId="anyId"
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="TrackPosition" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222c42",
                }}
              />
              {telemetryDataArray.map((_, index) => (
                <Line
                  isAnimationActive={false}
                  key={`speed-line-${index}`}
                  //data={combined}
                  type="monotone"
                  dataKey={`Speed${index + 1}`}
                  stroke={dataColors[index % dataColors.length]}
                  fill={dataColors[index % dataColors.length]}
                  dot={false}
                  connectNulls={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <h4>Throttle</h4>

          <ResponsiveContainer width="100%" height={heightValue}>
            <LineChart
              width={500}
              height={heightValue}
              data={combined}
              syncId="anyId"
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="TrackPosition" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222c42",
                }}
              />
              {telemetryDataArray.map((_, index) => (
                <Line
                  isAnimationActive={false}
                  key={`throttle-line-${index}`}
                  type="monotone"
                  dataKey={`Throttle${index + 1}`}
                  stroke={dataColors[index % dataColors.length]}
                  fill={dataColors[index % dataColors.length]}
                  dot={false}
                  connectNulls={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <h4>Brake</h4>

          <ResponsiveContainer width="100%" height={heightValue}>
            <LineChart
              width={500}
              height={heightValue}
              data={combined}
              syncId="anyId"
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="TrackPosition" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222c42",
                }}
              />
              {telemetryDataArray.map((_, index) => (
                <Line
                  isAnimationActive={false}
                  key={`brake-line-${index}`}
                  type="monotone"
                  dataKey={`Brake${index + 1}`}
                  stroke={dataColors[index % dataColors.length]}
                  fill={dataColors[index % dataColors.length]}
                  dot={false}
                  connectNulls={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <h4>Gear</h4>

          <ResponsiveContainer width="100%" height={heightValue}>
            <LineChart
              width={500}
              height={heightValue}
              data={combined}
              syncId="anyId"
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="TrackPosition" />
              <YAxis domain={[0, 7]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222c42",
                }}
              />
              {telemetryDataArray.map((_, index) => (
                <Line
                  isAnimationActive={false}
                  key={`gear-line-${index}`}
                  type="monotone"
                  dataKey={`Gear${index + 1}`}
                  stroke={dataColors[index % dataColors.length]}
                  fill={dataColors[index % dataColors.length]}
                  dot={false}
                  connectNulls={true}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <h4>Steering angle</h4>

          <ResponsiveContainer width="100%" height={heightValue}>
            <LineChart
              width={500}
              height={heightValue}
              data={combined}
              syncId="anyId"
              margin={{
                top: 5,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="TrackPosition" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222c42",
                }}
              />
              {telemetryDataArray.map((_, index) => (
                <Line
                  isAnimationActive={false}
                  key={`steering-line-${index}`}
                  type="monotone"
                  dataKey={`SteeringAngle${index + 1}`}
                  stroke={dataColors[index % dataColors.length]}
                  fill={dataColors[index % dataColors.length]}
                  dot={false}
                  connectNulls={true}
                />
              ))}
              <Brush />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
