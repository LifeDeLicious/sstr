import { db } from "../db/index.js";
import { desc, or, eq } from "drizzle-orm";
import { Laps } from "../db/schema/Laps.js";
import { Users } from "../db/schema/Users.js";
import { Sessions } from "../db/schema/Sessions.js";
import { uploadTelemetryFile, getTelemetryFile } from "./fileOperations.js";

const postLap = async (req, res) => {
  try {
    const { sessionID, userID, isFastestLap, telemetryData, lapTime } =
      req.body;

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

const getTelemetryFiles = async (req, res) => {
  try {
    const { fileKeys } = req.body;

    if (!Array.isArray(fileKeys) || fileKeys.length === 0) {
      return res.status(400).json({ message: "invalid file keys" });
    }

    //const telemetryResults = [];

    const telemetryPromises = fileKeys.map(async (fileKey) => {
      //const telemetryData = await fetch

      try {
        const telemetryData = await getTelemetryFile(fileKey);
        return {
          fileKey,
          data: telemetryData,
        };
      } catch (error) {
        console.error(`error fetching file for key ${fileKey}`, error);
        return {
          fileKey,
          data: [],
          error: "Failed to retrieve telemetry data",
        };
      }
    });

    const telemetryResults = await Promise.all(telemetryPromises);

    res.status(200).json({ telemetry: telemetryResults });
  } catch (error) {
    console.log("error lapcontroller gettelemetryfiles: ", error);
    res
      .status(500)
      .json({ message: "failed to lapcontroller/gettelemetryfiles" });
  }
};

const lapController = {
  postLap,
  getTelemetryFiles,
};

export default lapController;
