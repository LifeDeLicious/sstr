import { React, useEffect, useMemo, useState } from "react";
//import telemetryData from "./telemetry3.json";
//import telemetryData2 from "./lap-2.json";
//import faster from "./lap-3.json";

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
const heightValue = 127;

// const data = telemetryData;

// const data2 = telemetryData2;
// const data3 = faster;

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

//const combined = mergeTelemetryData(data, data2, faster);

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

//console.log(combined.length);

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
  // const combinedData = useMemo(() => {
  //   if (!telemetryData) return [];

  //   const telemetrySources = telemetryData.map((item) => item.data);

  //   if (telemetrySources.length === 0) return [];

  //   return mergeTelemetryData(...telemetrySources);
  // }, [telemetryData]);

  // if (!telemetryData) {
  //   return <div>Waiting for telemetry data...</div>;
  // }

  // const fetchTelemetryData = async (lapFileKeys) => {
  //   try {
  //     const res = await fetch(`https://api.sstr.reinis.space/laps/batch`, {
  //       method: "GET",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ fileKeys: lapFileKeys }),
  //     });

  //     if (!res.ok) {
  //       throw new Error("Failed to fetch teleemetry data");
  //     }

  //     const result = await res.json();
  //     console.log(result);
  //     return result.telemetry;
  //   } catch (error) {
  //     console.error("Error fetching telemetry data: ", error);
  //     throw error;
  //   }
  // };

  // fetchTelemetryData(analyticsGraphData);

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
            {telemetryDataArray.map((_, index) => (
              <Line
                isAnimationActive={false}
                key={`speed-line-${index}`}
                data={combined}
                type="monotone"
                dataKey={`Speed${index + 1}`}
                stroke={dataColors[index % dataColors.length]}
                fill={dataColors[index % dataColors.length]}
                dot={false}
                connectNulls={true}
              />
            ))}

            {/* <Line
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
            /> */}
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
            {telemetryDataArray.map((_, index) => (
              <Line
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
            {/* endindexam jabut json entryu daudzumam? */}
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={heightValue}>
          <AreaChart
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
        </ResponsiveContainer>
      </div>
    </>
  );
}
