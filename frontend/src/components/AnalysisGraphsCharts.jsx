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
import formatLapTime from "../utils/timeFromatter";

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

      entry[`PositionX${index + 1}`] = closest?.PositionX ?? null;
      entry[`PositionY${index + 1}`] = closest?.PositionY ?? null;
    });

    return entry;
  });
}

const CustomTooltip = ({ active, payload, label, dataKey }) => {
  // Update active point when tooltip is active
  useEffect(() => {
    if (active && payload && payload.length) {
      const trackPos = payload[0].payload.TrackPosition;
      setActivePoint(trackPos);
    } else {
      setActivePoint(null);
    }
  }, [active, payload]);

  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#222c42",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p>Track Position: {payload[0].payload.TrackPosition.toFixed(3)}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.value !== null ? p.value : "N/A"}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default function AnalysisGraphsCharts({
  analyticsGraphData,
  telemetryData,
}) {
  const [telemetryDataArray, setTelemetryDataArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [combined, setCombined] = useState([]);
  const [lapColors, setLapColors] = useState([]);
  const [activePoint, setActivePoint] = useState(null);

  const handleMouseMove = (e) => {
    if (e && e.activePayload && e.activePayload.length) {
      setActivePoint(e.activePayload[0].payload.TrackPosition);
    }
  };

  const handleMouseLeave = () => {
    setActivePoint(null);
  };

  useEffect(() => {
    if (
      !analyticsGraphData ||
      !analyticsGraphData.laps ||
      analyticsGraphData.laps.length === 0
    ) {
      return;
    }

    const colors = analyticsGraphData.laps.map(
      (lap) => lap.lapColor || "#CCCCCC"
    );
    setLapColors(colors);

    async function fetchTelemetryData() {
      try {
        setIsLoading(true);

        const fileKeys = analyticsGraphData.laps.map((lap) => lap.lapFileKey);

        const lapMap = analyticsGraphData.laps.reduce((map, lap) => {
          map[lap.lapFileKey] = lap;
          return map;
        }, {});

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

        const telemetryWithColors = result.telemetry.map((item, index) => {
          const lap = lapMap[fileKeys[index]];
          return {
            ...item,
            color: lap ? lap.lapColor : "#CCCCCC",
          };
        });

        //setTelemetryDataArray(result.telemetry || []);
        setTelemetryDataArray(telemetryWithColors);

        const orderedColors = telemetryWithColors.map((item) => item.color);
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
          <ResponsiveContainer width={500} height={450}>
            <ScatterChart
              margin={{
                top: 10,
                right: 10,
                bottom: 10,
                left: 10,
              }}
              syncId="anyId"
            >
              <XAxis
                dataKey="trackPos"
                name="X position"
                type="number"
                hide={true}
              />
              <YAxis
                dataKey="value"
                name="Y position"
                type="number"
                hide={true}
              />
              <Tooltip
                content={<CustomTooltip />}
                contentStyle={{
                  backgroundColor: "#222c42",
                }}
              />
              {telemetryDataArray.map((_, index) => (
                <Scatter
                  key={`position-scatter-${index}`}
                  name={`Lap ${index + 1}`}
                  data={combined
                    .map((point) => ({
                      x: point[`PositionX${index + 1}`],
                      y: point[`PositionY${index + 1}`],
                      trackPos: point.TrackPosition,
                      value: 0,
                    }))
                    .filter((point) => point.x !== null && point.y !== null)}
                  fill={
                    lapColors[index] || dataColors[index % dataColors.length]
                  }
                  line={{
                    stroke:
                      lapColors[index] || dataColors[index % dataColors.length],
                    strokeWidth: 1,
                  }}
                  lineType="joint"
                  shape={(props) => {
                    const { cx, cy, fill, isActive } = props;
                    return isActive ? (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={6}
                        fill={fill}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ) : (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={0} // Hide inactive points to show only the line
                        fill={fill}
                      />
                    );
                  }}
                >
                  <XAxis
                    dataKey="x"
                    type="number"
                    name="X Position"
                    domain={["dataMin", "dataMax"]}
                  />
                  <YAxis
                    dataKey="y"
                    type="number"
                    name="Y Position"
                    domain={["dataMax", "dataMin"]}
                  />
                </Scatter>
              ))}
              <Scatter name="Car position" line />
            </ScatterChart>
          </ResponsiveContainer>
          <ul className="mt-2">
            {analyticsGraphData.laps.map((lap, index) => (
              <li key={lap.lapID} className="flex items-center mb-1">
                <div
                  className="w-4 h-4 mr-2"
                  style={{ backgroundColor: lap.lapColor || "#CCCCCC" }}
                />
                <span>
                  {lap.userUsername}: {formatLapTime(lap.lapTime)}
                </span>
              </li>
            ))}
          </ul>
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
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
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
                  stroke={
                    lapColors[index] || dataColors[index % dataColors.length]
                  }
                  fill={
                    lapColors[index] || dataColors[index % dataColors.length]
                  }
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
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
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
                  stroke={
                    lapColors[index] || dataColors[index % dataColors.length]
                  }
                  fill={
                    lapColors[index] || dataColors[index % dataColors.length]
                  }
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
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
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
                  stroke={
                    lapColors[index] || dataColors[index % dataColors.length]
                  }
                  fill={
                    lapColors[index] || dataColors[index % dataColors.length]
                  }
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
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
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
                  stroke={
                    lapColors[index] || dataColors[index % dataColors.length]
                  }
                  fill={
                    lapColors[index] || dataColors[index % dataColors.length]
                  }
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
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
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
                  stroke={
                    lapColors[index] || dataColors[index % dataColors.length]
                  }
                  fill={
                    lapColors[index] || dataColors[index % dataColors.length]
                  }
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
