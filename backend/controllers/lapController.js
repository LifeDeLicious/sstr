import { db } from "../db/index.js";
import { desc, or, eq } from "drizzle-orm";
import { Laps } from "../db/schema/Laps.js";
import { Users } from "../db/schema/Users.js";
import { Sessions } from "../db/schema/Sessions.js";

const postLap = async (req, res) => {
  const { sessionID, userID, isFastestLap, telemetryData, lapTime } = req.body;

  //   try {
  //     const session = await db.insert(Sessions).values({});
  //   } catch (error) {
  //     console.log("error :", error);
  //   }

  console.log(`session id: ${sessionID}`);
  console.log(`userid: ${userID}`);
  console.log(`is fastestlap: ${isFastestLap}`);
  console.log(`laptime: ${lapTime}`);
  res.status(200);
};

const lapController = {
  postLap,
};

export default lapController;
