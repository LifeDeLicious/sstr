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
    res.status(200).json({
      message: "analysis created successfully",
      analysisID: analysisID,
    });
  } catch (error) {
    console.log("error creating analysis: ", error);
  }
};

const getAnalysisData = async (req, res) => {
  try {
    const analysisID = req.params;
    const { userID } = req.body;

    const analysisConfig = await db
      .select({
        carID: Cars.CarID,
        carName: Cars.CarAssetName,
        trackID: Tracks.TrackID,
        trackName: Tracks.TrackAssetName,
        trackLayout: Tracks.TrackLayout,
        lapID: Laps.LapID,
        lapTime: Laps.LapTime,
      })
      .from();

    console.log("getanalysisdata");
  } catch (error) {
    console.log("getanalysisdata error: ", error);
  }
};

const getAnalysisList = async (req, res) => {
  try {
    const { UserID } = req.body;

    const analysisList = await db
      .select({
        analysisID: Analysis.AnalysisID,
        analysisName: Analysis.AnalysisName,
        carID: Analysis.CarID,
        carAssetName: Cars.CarAssetName,
        trackID: Analysis.TrackID,
        trackAssetName: Tracks.TrackAssetName,
        trackLayout: Tracks.TrackLayout,
        creationDate: Analysis.AnalysisDate,
      })
      .from(UserAnalysis)
      .innerJoin(Analysis, eq(UserAnalysis.AnalysisID, Analysis.AnalysisID))
      .innerJoin(Cars, eq(Analysis.CarID, Cars.CarID))
      .innerJoin(Tracks, eq(Analysis.TrackID, Tracks.TrackID))
      .where(eq(UserAnalysis.UserID, UserID))
      .orderBy(desc(Analysis.AnalysisDate));

    console.log("getanalysislist called, userid: ", UserID);
    res.status(200).json(analysisList);
  } catch (error) {
    console.log("error getanalysislist, error: ", error);
    res.status(500).json({ message: "error getanalysislist", error: error });
  }
};

const analysisController = {
  createAnalysis,
  getAnalysisData,
  getAnalysisList,
};

export default analysisController;
