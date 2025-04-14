import { Link } from "@tanstack/react-router";

const sessionsDropdown = [
  {
    event: "03.02.2024",
  },
];

export default function AnalysisLapsTable() {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table bg-base-200">
          {/* head */}
          <thead>
            <tr>
              <th className=" w-140">Lap</th>
              <th className="w-20">Color pickeri</th>
              <th className="ml-90 self-center">Lap time</th>
              <th className="hover:bg-yellow-100"></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr className="hover:bg-base-300">
              <th>1</th>
              <th>a</th>
              <td>{"1:46.35"}</td>
              <td className="w-15">
                <div className="join">
                  <button className="btn h-8 join-item bg-slate-400">
                    Analyze
                  </button>
                  <select className="select h-8 w-2 join-item">
                    <option>Copy lap ID</option>
                  </select>
                </div>
              </td>
            </tr>
            {/* row 2 */}
            <tr className="hover:bg-base-300">
              <th>2</th>
              <th>a</th>
              <td>xyz</td>
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
            <tr className="hover:bg-base-300">
              <th>3</th>
              <th> a</th>
              <td>abc</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
