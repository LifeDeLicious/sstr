import { React } from "react";
import telemetryData from "./telemetry3.json";
import telemetryData2 from "./telemetry4.json";

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

const dataColors = ["#eb4034", "#2842eb", "#ff0dff"];

const data = telemetryData;

const data2 = telemetryData2;

const trackPositions = Array.from(
  new Set([...data, ...data2].map((d) => d.TrackPosition))
).sort((a, b) => a - b);

const combined = trackPositions.map((trackPos) => {
  const a = data.find((d) => d.TrackPosition === trackPos);
  const b = data2.find((d) => d.TrackPosition === trackPos);

  return {
    TrackPosition: trackPos,
    SpeedA: a ? a.Speed : null,
    SpeedB: b ? b.Speed : null,
  };
});

const heightValue = 127;

export default function AnalysisGraphsCharts() {
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
              dataKey="SpeedA"
              stroke={dataColors[0]}
              fill={dataColors[0]}
              dot={false}
              connectNulls={true}
            />
            <Line
              //data={data2}
              type="monotone"
              dataKey="SpeedB"
              stroke={dataColors[1]}
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
            <XAxis dataKey="TrackPosition" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222c42",
              }}
            />
            <Line
              type="monotone"
              dataKey="Throttle"
              stroke={dataColors[0]}
              fill={dataColors[0]}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <h4>Brake</h4>

        <ResponsiveContainer width="100%" height={heightValue}>
          <LineChart
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
            <XAxis dataKey="TrackPosition" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222c42",
              }}
            />
            <Line
              type="monotone"
              dataKey="Brake"
              stroke={dataColors[0]}
              //fill={dataColors[0]}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <h4>Gear</h4>

        <ResponsiveContainer width="100%" height={heightValue}>
          <LineChart
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
            <XAxis dataKey="TrackPosition" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222c42",
              }}
            />
            <Line
              type="monotone"
              dataKey="Gear"
              stroke={dataColors[0]}
              fill={dataColors[0]}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <h4>Steering angle</h4>

        <ResponsiveContainer width="100%" height={heightValue}>
          <LineChart
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
            <XAxis dataKey="TrackPosition" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#222c42",
              }}
            />
            <Line
              type="monotone"
              dataKey="SteeringAngle"
              stroke={dataColors[0]}
              fill={dataColors[0]}
              dot={false}
            />
            <Brush />
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
