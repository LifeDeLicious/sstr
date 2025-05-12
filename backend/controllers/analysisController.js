import { db } from "../db/index.js";
import { desc, or, eq, and, count, sum, max, min } from "drizzle-orm";
import { Sessions } from "../db/schema/Sessions.js";
import { UserSessions } from "../db/schema/UserSessions.js";
import { Laps } from "../db/schema/Laps.js";
import { Cars } from "../db/schema/Cars.js";
import { Tracks } from "../db/schema/Tracks.js";
import { Analysis } from "../db/schema/Analysis.js";
import { UserAnalysis } from "../db/schema/UserAnalysis.js";
import { AnalysisLaps } from "../db/schema/AnalysisLaps.js";

const createAnalysis = async (req, res) => {
  try {
    const { userID, carID, trackID, lapID } = req.body;

    const analysis = await db
      .insert(Analysis)
      .values({
        TrackID: trackID,
        CarID: carID,
      })
      .$returningId();

    const analysisID = analysis[0].AnalysisID;

    const userAnalysis = await db.insert(UserAnalysis).values({
      AnalysisID: analysisID,
      UserID: userID,
    });

    const analysisLaps = await db.insert(AnalysisLaps).values({
      AnalysisID: analysisID,
      LapID: lapID,
    });

    console.log("post create analysis create analysis");
  } catch (error) {
    console.log("error creating analysis: ", error);
  }
};

const analysisController = {
  createAnalysis,
};

export default analysisController;
