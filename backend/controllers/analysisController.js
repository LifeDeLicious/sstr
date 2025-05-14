import { db } from "../db/index.js";
import { desc, asc, or, eq, and, count, sum, max, min, sql } from "drizzle-orm";
import { Sessions } from "../db/schema/Sessions.js";
import { UserSessions } from "../db/schema/UserSessions.js";
import { Laps } from "../db/schema/Laps.js";
import { Cars } from "../db/schema/Cars.js";
import { Tracks } from "../db/schema/Tracks.js";
import { Analysis } from "../db/schema/Analysis.js";
import { UserAnalysis } from "../db/schema/UserAnalysis.js";
import { AnalysisLaps } from "../db/schema/AnalysisLaps.js";
import { Users } from "../db/schema/Users.js";

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
    const analysisID = req.params.analysisID;
    const { userID } = req.body;

    const analysisConfigQuery = await db
      .select({
        carID: Cars.CarID,
        carName: Cars.CarAssetName,
        trackID: Tracks.TrackID,
        trackName: Tracks.TrackAssetName,
        trackLayout: Tracks.TrackLayout,
      })
      .from(Analysis)
      .innerJoin(Cars, eq(Analysis.CarID, Cars.CarID))
      .innerJoin(Tracks, eq(Analysis.TrackID, Tracks.TrackID))
      .where(eq(Analysis.AnalysisID, analysisID))
      .limit(1);

    if (analysisConfigQuery.length === 0) {
      return res.status(404).json({ message: "Analysis not found" });
    }

    const analysisConfig = analysisConfigQuery[0];

    //!lap visibility!!!! true/false boolean
    const lapsQuery = await db
      .select({
        lapID: Laps.LapID,
        lapTime: Laps.LapTime,
        airTemperature: Sessions.AirTemperature,
        trackTemperature: Sessions.TrackTemperature,
        userUsername: Users.Username,
        userID: Laps.UserID,
      })
      .from(AnalysisLaps)
      .innerJoin(Laps, eq(AnalysisLaps.LapID, Laps.LapID))
      .innerJoin(Sessions, eq(Laps.SessionID, Sessions.SessionID))
      .innerJoin(Users, eq(Laps.UserID, Users.UserID))
      .where(eq(AnalysisLaps.AnalysisID, analysisID));

    const laps = lapsQuery.map((lap) => ({
      lapID: lap.lapID,
      lapTime: Number(lap.lapTime),
      airTemperature: Number(lap.airTemperature),
      trackTemperature: Number(lap.trackTemperature),
      userUsername: lap.userUsername,
      userID: lap.userID,
    }));

    const response = {
      analysisID: Number(analysisID),
      carID: analysisConfig.carID,
      carName: analysisConfig.carName,
      trackID: analysisConfig.trackID,
      trackName: analysisConfig.trackName,
      trackLayout: analysisConfig.trackLayout,
      laps: laps,
    };

    console.log("getanalysisdata");
    res.status(200).json(response);
  } catch (error) {
    console.log("getanalysisdata error: ", error);
  }
};

const getAnalysisList = async (req, res) => {
  try {
    const { userId } = req.body;
    const userID = req.user.userId || req.user.UserID;

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
      .where(eq(UserAnalysis.UserID, userID))
      .orderBy(desc(Analysis.AnalysisDate));

    console.log("getanalysislist called, userid: ", userID);
    res.status(200).json(analysisList);
  } catch (error) {
    console.log("error getanalysislist, error: ", error);
    res.status(500).json({ message: "error getanalysislist", error: error });
  }
};

const getGraphData = async (req, res) => {
  try {
    const { userId } = req.body;
    const analysisID = req.params.analysisID;
    console.log("getgraphdata, analysisid: ", analysisID);

    const analysisLapsQuery = await db
      .select({
        lapID: Laps.LapID,
        lapTime: Laps.LapTime,
        userUsername: Users.Username,
        lapFileKey: Laps.LapFileKey,
      })
      .from(AnalysisLaps)
      .innerJoin(Laps, eq(AnalysisLaps.LapID, Laps.LapID))
      .innerJoin(Users, eq(Laps.UserID, Users.UserID))
      .where(eq(AnalysisLaps.AnalysisID, analysisID))
      .orderBy(desc(AnalysisLaps.LapID));

    const laps = analysisLapsQuery.map((lap) => ({
      lapID: lap.lapID,
      lapTime: Number(lap.lapTime),
      userUsername: lap.userUsername,
      lapFileKey: lap.lapFileKey,
    }));

    res.status(200).json({ laps });
  } catch (error) {
    console.log("getgraphdata error: ", error);
    res.status(500).json({ message: "Failed to getgraphdata" });
  }
};

const getUsersBestLaps = async (req, res) => {
  try {
    const analysisID = req.params.analysisID;
    console.log("getusersbestlaps params: ", req.params);
    console.log("getusersbestlaps called, analysisid:", analysisID);

    const analysisConfig = await db
      .select({
        carID: Analysis.CarID,
        trackID: Analysis.TrackID,
      })
      .from(Analysis)
      .where(eq(Analysis.AnalysisID, analysisID));

    const carID = analysisConfig.carID;
    const trackID = analysisConfig.trackID;

    const bestLapsQuery = await db
      .select({
        userID: Users.UserID,
        userUsername: Users.Username,
        lapID: Laps.LapID,
        lapTime: Laps.LapTime,
        lapFileKey: Laps.LapFileKey,
        sessionID: Sessions.SessionID,
        airTemperature: Sessions.AirTemperature,
        trackTemperature: Sessions.TrackTemperature,
      })
      .from(Users)
      .innerJoin(
        db
          .select({
            userID: Laps.UserID,
            minLapTime: min(Laps.LapTime).as("minLapTime"),
          })
          .from(Laps)
          .innerJoin(Sessions, eq(Laps.SessionID, Sessions.SessionID))
          .where(
            and(
              eq(Sessions.CarID, carID), //parseInt(carID)
              eq(Sessions.TrackID, trackID), //parseInt(trackID)
              eq(Sessions.IsSessionPublic, true)
            )
          )
          .groupBy(Laps.UserID)
          .as("bestLaps"),
        eq(Users.UserID, sql`bestLaps.userID`)
      )
      .innerJoin(
        Laps,
        and(
          eq(Laps.UserID, sql`bestLaps.userID`),
          eq(Laps.LapTime, sql`bestLaps.minLapTime`)
        )
      )
      .innerJoin(Sessions, eq(Laps.SessionID, Sessions.SessionID))
      .where(
        and(
          eq(Sessions.CarID, carID), //parseInt(carID)
          eq(Sessions.TrackID, trackID), //parseInt(trackID)
          eq(Sessions.IsSessionPublic, true)
        )
      )
      .orderBy(asc(Laps.LapTime));

    console.log("getusersbetlaplist query completed");

    const formattedResults = bestLapsQuery.map((lap) => ({
      userID: lap.userID,
      userUsername: lap.userUsername,
      lapID: lap.lapID,
      lapTime: Number(lap.lapTime),
      lapFileKey: lap.lapFileKey,
      sessionID: lap.sessionID,
      airTemperature: Number(lap.airTemperature),
      trackTemperature: Number(lap.trackTemperature),
    }));

    console.log(`formatted results: ${formattedResults}`);
    res.status(200).json({ bestLaps: formattedResults });
  } catch (error) {
    console.log("getusersbetslaps error:", error);
  }
};

const addAnalysisLap = async (req, res) => {
  try {
    //const { analysisID } = req.params.analysisID;
    const { analysisID, lapID, userID } = req.body;
    console.log(
      `addanalysislap called, analysisid:${analysisID}, lapid:${lapID}`
    );

    const addedAnalysisLap = await db.insert(AnalysisLaps).values({
      AnalysisID: analysisID,
      LapID: lapID,
    });

    console.log(`analysis id:${analysisID} lap id:${lapID} added`);
    //const analysisConfig = await db
    // .select({
    //   carID: Analysis.CarID,
    //   trackID: Analysis.TrackID,
    // })
    // .from(Analysis)
    // .where(eq(Analysis.AnalysisID, analysisID));

    //const addLapList = await db.select({});
  } catch (error) {
    console.log("getaddlaplist error:", error);
  }
};

const removeAnalysisLap = async (req, res) => {
  try {
    const { analysisID } = req.params.analysisID;
    console.log("getaddlaplist called, analysisid:", analysisID);

    const analysisConfig = await db
      .select({
        carID: Analysis.CarID,
        trackID: Analysis.TrackID,
      })
      .from(Analysis)
      .where(eq(Analysis.AnalysisID, analysisID));

    const addLapList = await db.select({});
  } catch (error) {
    console.log("getaddlaplist error:", error);
  }
};

const analysisController = {
  createAnalysis,
  getAnalysisData,
  getAnalysisList,
  getGraphData,
  getUsersBestLaps,
  addAnalysisLap,
  removeAnalysisLap,
};

export default analysisController;
