import { db } from "../db/index.js";
import { desc, or, eq } from "drizzle-orm";
import { Laps } from "../db/schema/Laps.js";
import { Users } from "../db/schema/Users.js";
import { Sessions } from "../db/schema/Sessions.js";
import uploadTelemetryFile from "./fileUpload.js";

const postLap = async (req, res) => {
  const { sessionID, userID, isFastestLap, telemetryData, lapTime } = req.body;

  try {
    const lap = await db
      .insert(Laps)
      .values({
        UserID: userID,
        LapTime: lapTime,
        SessionID: sessionID,
        IsFastestLapOfSession: isFastestLap,
      })
      .$returningId();

    const lapID = lap[0].LapID;
    console.log("inserted lap: ", lapID);
    const lapFileKey = `/laps/lap-${lapID}`;

    uploadTelemetryFile(lapID, userID, telemetryData);

    const lapUpdate = await db
      .update(Laps)
      .set({
        LapFileKey: lapFileKey,
      })
      .where(eq(Laps.LapID, lapID));

    console.log("updated lapid: ", lapUpdate[0].LapID);
    //!db insertott apla keyu - /laps/lap-{lapid}
    //db insert lap
    //returningid
    //!db insertot lapfilekey - /laps/lap-{lapid}

    //uploadTelemetryFile ( apla id, userID, telemetryData )??

    console.log(`session id: ${sessionID}`);
    console.log(`userid: ${userID}`);
    console.log(`is fastestlap: ${isFastestLap}`);
    console.log(`laptime: ${lapTime}`);
    res.status(200).json({
      success: true,
      message: "Lap Data Received!",
    });
  } catch (err) {
    console.log(err);
  }
};

const lapController = {
  postLap,
};

export default lapController;
