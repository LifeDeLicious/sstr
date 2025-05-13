import { React } from "react";
import telemetryData from "./telemetry3.json";
import telemetryData2 from "./lap-2.json";
import faster from "./lap-3.json";

import {
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
} from "recharts";
//import { response } from "express";

const dataColors = ["#eb4034", "#2842eb", "#ff0dff"];

const data = telemetryData;

const data2 = telemetryData2;
const data3 = faster;

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

const combined = mergeTelemetryData(data, data2, faster);

// const trackPositions = Array.from(
//   new Set([...data, ...data2].map((d) => d.TrackPosition))
// ).sort((a, b) => a - b);

// const combined = trackPositions.map((trackPos) => {
//   const a = data.find((d) => d.TrackPosition === trackPos);
//   const b = data2.find((d) => d.TrackPosition === trackPos);

//   return {
//     TrackPosition: trackPos,
//     SpeedA: a ? a.Speed : null,
//     SpeedB: b ? b.Speed : null,
//   };
// });

const heightValue = 127;

console.log(combined.length);

export default function AnalysisGraphsCharts({ analyticsGraphData }) {
  const fetchTelemetryData = async (lapFileKeys) => {
    try {
      const res = await fetch(`https://api.sstr.reinis.space/laps/batch`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileKeys: lapFileKeys }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch teleemetry data");
      }

      const result = await res.json();
      console.log(result);
      return result.telemetry;
    } catch (error) {
      console.error("Error fetching telemetry data: ", error);
      throw error;
    }
  };

  return (
    <>
      <div style={{ width: "100%" }}>
        <h4>Speed</h4>

        <ResponsiveContainer width="100%" height={heightValue}>
          <LineChart
            width={500}
            height={heightValue}
            data={combined}
            syncId="anyId"
            margin={{
              top: 10,
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
            <Line
              //data={data}
              type="monotone"
              dataKey="Speed1"
              stroke={dataColors[0]}
              fill={dataColors[0]}
              dot={false}
              connectNulls={true}
            />
            <Line
              //data={data2}
              type="monotone"
              dataKey="Speed2"
              stroke={dataColors[1]}
              fill={dataColors[1]}
              dot={false}
              connectNulls={true}
            />
            <Line
              //data={data2}
              type="monotone"
              dataKey="Speed3"
              stroke={dataColors[2]}
              fill={dataColors[1]}
              dot={false}
              connectNulls={true}
            />
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
              top: 10,
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
            <Line
              type="monotone"
              dataKey="Throttle1"
              stroke={dataColors[0]}
              fill={dataColors[0]}
              dot={false}
              connectNulls={true}
            />
            <Line
              type="monotone"
              dataKey="Throttle2"
              stroke={dataColors[1]}
              fill={dataColors[1]}
              dot={false}
              connectNulls={true}
            />
            <Line
              type="monotone"
              dataKey="Throttle3"
              stroke={dataColors[2]}
              fill={dataColors[1]}
              dot={false}
              connectNulls={true}
            />
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
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="TrackPosition" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222c42",
              }}
            />
            <Line
              type="monotone"
              dataKey="Brake1"
              stroke={dataColors[0]}
              //fill={dataColors[0]}
              dot={false}
              connectNulls={true}
            />
            <Line
              type="monotone"
              dataKey="Brake2"
              stroke={dataColors[1]}
              //fill={dataColors[0]}
              dot={false}
              connectNulls={true}
            />
            <Line
              type="monotone"
              dataKey="Brake3"
              stroke={dataColors[2]}
              //fill={dataColors[0]}
              dot={false}
              connectNulls={true}
            />
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
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="TrackPosition" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222c42",
              }}
            />
            <Line
              type="monotone"
              dataKey="Gear1"
              stroke={dataColors[0]}
              fill={dataColors[0]}
              dot={false}
              connectNulls={true}
            />
            <Line
              type="monotone"
              dataKey="Gear2"
              stroke={dataColors[1]}
              fill={dataColors[0]}
              dot={false}
              connectNulls={true}
            />
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
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="TrackPosition" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222c42",
              }}
            />
            <Line
              type="monotone"
              dataKey="SteeringAngle1"
              stroke={dataColors[0]}
              fill={dataColors[0]}
              dot={false}
              connectNulls={true}
            />
            <Line
              type="monotone"
              dataKey="SteeringAngle2"
              stroke={dataColors[1]}
              fill={dataColors[0]}
              dot={false}
              connectNulls={true}
            />
            <Brush />
            {/* endindexam jabut json entryu daudzumam? */}
          </LineChart>
        </ResponsiveContainer>

        {/* <ResponsiveContainer width="100%" height={heightValue}>
          <AreaChart
            width={500}
            height={heightValue}
            data={data}
            syncId="anyId"
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="pv"
              stroke={dataColors[0]}
              fill="#82ca9d"
            />
          </AreaChart>
        </ResponsiveContainer> */}
      </div>
    </>
  );
}
