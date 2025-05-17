import { Link } from "@tanstack/react-router";
import formatLapTime from "../utils/timeFromatter.js";
import { useState } from "react";
import { BlockPicker } from "react-color";
import { useEffect } from "react";

const sessionsDropdown = [
  {
    event: "03.02.2024",
  },
];

export default function AnalysisLapsTable({
  analyticsLaps: initialAnalyticsLaps,
  analyticsID,
  onLapRemoved,
  onLapColorChanged,
}) {
  const [openColorPickerId, setOpenColorPickerId] = useState(null);
  const [analyticsLaps, setAnalyticsLaps] = useState(initialAnalyticsLaps);

  useEffect(() => {
    setAnalyticsLaps(initialAnalyticsLaps);
  }, [initialAnalyticsLaps]);

  const handleRemoveLap = async (analysisID, lapID) => {
    try {
      const response = await fetch(
        `https://api.sstr.reinis.space/analysis/lap/${analysisID}/${lapID}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove lap from analysis");
      }

      onLapRemoved && onLapRemoved(lapID);
    } catch (error) {
      console.error("error removing lap:", error);
    }
  };

  const handleColorChange = async (color, lapID) => {
    try {
      const hexColor = color.hex;

      const response = await fetch(
        `https://api.sstr.reinis.space/analysis/color`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            color: hexColor,
            lapID: lapID,
            analysisID: analyticsID,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update lap color");
      }

      analyticsLaps = analyticsLaps.map((lap) => {
        if (lap.lapID === lapID) {
          return { ...lap, color: hexColor };
        }
        return lap;
      });

      if (onLapColorChanged) {
        onLapColorChanged(lapID, hexColor);
      }

      setOpenColorPickerId(null);
    } catch (error) {
      console.error("Error updating lap color:", error);
    }
  };

  const toggleColorPicker = (lapID) => {
    setOpenColorPickerId(openColorPickerId === lapID ? null : lapID);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table bg-base-200">
          {/* head */}
          <thead>
            <tr>
              <th className=" w-15">Lap</th>
              <th className="w-15">Color pickeri</th>
              <th className="w-40">Driver</th>
              <th className="w-15">Lap time</th>
              <th className="w-20">Track conditions</th>
              <th className="hover:bg-yellow-100 w-40">button</th>
            </tr>
          </thead>
          <tbody>
            {analyticsLaps.map((lap, index) => (
              <tr key={lap.lapID} className="hover:bg-base-300">
                <th>{index + 1}</th>
                <th>
                  <div
                    className="w-6 h-6 cursor-pointer border border-gray-500"
                    style={{ backgroundColor: lap.color || "#CCCCCC" }}
                    onClick={() => toggleColorPicker(lap.lapID)}
                  ></div>
                  {openColorPickerId === lap.lapID && (
                    <div className="absolute z-10 mt-2">
                      <BlockPicker
                        color={lap.color || "#CCCCCC"}
                        onChange={(color) =>
                          handleColorChange(color, lap.lapID)
                        }
                        triangle="top-left"
                      />
                    </div>
                  )}
                </th>
                <th>{lap.userUsername}</th>
                <td>{formatLapTime(lap.lapTime)}</td>
                <td>
                  air:{lap.airTemperature}, track:{lap.trackTemperature}
                </td>
                <td className="w-15">
                  <div className="join">
                    <button
                      className="btn h-8 bg-slate-400"
                      onClick={() => handleRemoveLap(analyticsID, lap.lapID)}
                    >
                      Remove Lap
                    </button>
                    <button className="btn h-8 bg-slate-400">
                      Lap visibility
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {/* row 1 */}

            {/* row 2 */}
            {/* <tr className="hover:bg-base-300">
              <th>2</th>
              <th>a</th>
              <th>driver</th>
              <td>xyz</td>
              <td>15c 18c</td>
              <td className="w-15">
                <div className="join">
                  <button className="btn h-8 join-item bg-slate-400">
                    Analyze
                  </button>
                  <details className="dropdown join-item dropdown-end">
                    <summary className="btn bg-slate-400 h-8">v</summary>
                    <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-28 p-2 shadow-sm">
                      <li>
                        <a>Copy lap ID</a>
                      </li>
                    </ul>
                  </details>
                </div>
              </td>
            </tr>
            {/* row 3 */}
            {/* <tr className="hover:bg-base-300">
              <th>3</th>
              <th> a</th>
              <th>driver</th>
              <td>abc</td>
              <td>15c 18c</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </>
  );
}
