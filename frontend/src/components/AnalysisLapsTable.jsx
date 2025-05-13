import { Link } from "@tanstack/react-router";
import formatLapTime from "../utils/timeFromatter.js";

const sessionsDropdown = [
  {
    event: "03.02.2024",
  },
];

export default function AnalysisLapsTable({ analyticsLaps }) {
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
              <th className="ml-90 self-center">Lap time</th>
              <th className="w-20">Track conditions</th>
              <th className="hover:bg-yellow-100">button</th>
            </tr>
          </thead>
          <tbody>
            {analyticsLaps.map((lap, index) => (
              <tr key={lap.lapID} className="hover:bg-base-300">
                <th>{index}</th>
                <th></th>
                <th>{lap.userUsername}</th>
                <td>{formatLapTime(lap.lapTime)}</td>
                <td>
                  air:{lap.airTemperature}, track:{lap.trackTemperature}
                </td>
                <td className="w-15">
                  <div className="join">
                    <button className="btn h-8 bg-slate-400">Remove Lap</button>
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
