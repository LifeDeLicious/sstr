import { Link } from "@tanstack/react-router";
import formatLapTime from "../utils/timeFromatter.js";
import { useState } from "react";
import { BlockPicker, CompactPicker } from "react-color";
import { useEffect } from "react";

export default function AnalysisLapsTable({
  analyticsLaps: initialAnalyticsLaps,
  analyticsID,
  onLapRemoved,
  onLapColorChanged,
  onLapVisibilityChange,
}) {
  const [openColorPickerId, setOpenColorPickerId] = useState(null);
  const [analyticsLaps, setAnalyticsLaps] = useState(initialAnalyticsLaps);

  useEffect(() => {
    if (initialAnalyticsLaps) {
      setAnalyticsLaps(initialAnalyticsLaps);
    }
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

      setAnalyticsLaps((prevLaps) =>
        prevLaps.map((lap) =>
          lap.lapID === lapID ? { ...lap, color: hexColor } : lap
        )
      );

      if (onLapColorChanged) {
        onLapColorChanged(lapID, hexColor);
      }

      setOpenColorPickerId(null);
    } catch (error) {
      console.error("Error updating lap color:", error);
    }
  };

  const handleLapVisibilityChange = async (lapID, isLapVisible) => {
    try {
      const newVisibility = !isLapVisible;
      const response = await fetch(
        `https://api.sstr.reinis.space/analysis/lapvisibility`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            lapID: lapID,
            analysisID: analyticsID,
            isLapVisible: isLapVisible,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update lap color");
      }

      setAnalyticsLaps((prevLaps) =>
        prevLaps.map((lap) =>
          lap.lapID === lapID ? { ...lap, isLapVisible: newVisibility } : lap
        )
      );

      if (onLapVisibilityChange) {
        onLapVisibilityChange(lapID, newVisibility);
      }
    } catch (error) {
      console.error("Error changing lap visibility:", error);
    }
  };

  const toggleColorPicker = (lapID) => {
    setOpenColorPickerId(openColorPickerId === lapID ? null : lapID);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table bg-base-200">
          <thead>
            <tr>
              <th className=" w-15">Lap</th>
              <th className="w-15">Data Color</th>
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
                    style={{ backgroundColor: lap.lapColor || "#CCCCCC" }}
                    onClick={() => toggleColorPicker(lap.lapID)}
                  ></div>
                  {openColorPickerId === lap.lapID && (
                    <div className="absolute z-10 mt-2">
                      <CompactPicker
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
                    <button
                      className="btn h-8 bg-slate-400"
                      onClick={() =>
                        handleLapVisibilityChange(lap.lapID, lap.isLapVisible)
                      }
                    >
                      {lap.isLapVisible ? "Visible" : "Not visible"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
