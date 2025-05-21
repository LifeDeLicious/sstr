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
    //!check vai analysis ispublic un vai anaysis ir useranalysis listaa ar konkreto usera id

    const analysisID = req.params.analysisID;
    const userID = req.user.UserID;
    //const userId = req.user.userID || req.user.userId;
    //const { UserID } = req.body;
    console.log(`getanalysisdata userID:${userID}`);

    const analysisPublicCheck = await db
      .select({
        isPublic: Analysis.IsAnalysisPublic,
      })
      .from(Analysis)
      .where(eq(Analysis.AnalysisID, analysisID))
      .limit(1);

    const isPublic = analysisPublicCheck[0].isPublic;

    const userAnalysisCheck = await db
      .select({
        userAnalysisID: UserAnalysis.ID,
      })
      .from(UserAnalysis)
      .where(
        and(
          eq(UserAnalysis.AnalysisID, analysisID),
          eq(UserAnalysis.UserID, userID)
        )
      )
      .limit(1);

    //const userAnalysis = userAnalysisCheck[0];

    if (isPublic && userAnalysisCheck.length === 0) {
      const addUserAnalysis = await db.insert(UserAnalysis).values({
        AnalysisID: analysisID,
        UserID: userID,
      });
    } else if (!isPublic && userAnalysisCheck.length === 0) {
      console.log(
        `userid:${userID} doesn't have access to analysisid${analysisID}`
      );
      return res
        .status(401)
        .json({ message: "User doesn't have access to this analysis" });
    }

    const analysisConfigQuery = await db
      .select({
        analysisName: Analysis.AnalysisName,
        carID: Cars.CarID,
        carName: Cars.CarModel,
        carAssetName: Cars.CarAssetName,
        trackID: Tracks.TrackID,
        trackName: Tracks.TrackName,
        trackAssetName: Tracks.TrackAssetName,
        trackLayout: Tracks.TrackLayout,
        isAnalysisPublic: Analysis.IsAnalysisPublic,
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
        lapColor: AnalysisLaps.LapColor,
        isLapVisible: AnalysisLaps.LapIsVisible,
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
      lapColor: lap.lapColor,
      isLapVisible: lap.isLapVisible,
    }));

    const response = {
      analysisID: Number(analysisID),
      analysisName: analysisConfig.analysisName,
      carID: analysisConfig.carID,
      carName: analysisConfig.carName,
      carAssetName: analysisConfig.carAssetName,
      trackID: analysisConfig.trackID,
      trackName: analysisConfig.trackName,
      trackAssetName: analysisConfig.trackAssetName,
      trackLayout: analysisConfig.trackLayout,
      isPublic: analysisConfig.isAnalysisPublic,
      laps: laps,
    };

    console.log("getanalysisdata");
    res.status(200).json(response);
  } catch (error) {
    console.log("getanalysisdata error: ", error);
    return res.status(500).json({ message: "Failed to get analysis data" });
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
        carName: Cars.CarModel,
        carAssetName: Cars.CarAssetName,
        trackID: Analysis.TrackID,
        trackName: Tracks.TrackName,
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
    const userID = req.user.UserID;
    const analysisID = req.params.analysisID;

    //? adding check

    const analysisPublicCheck = await db
      .select({
        isPublic: Analysis.IsAnalysisPublic,
        analysisName: Analysis.AnalysisName,
      })
      .from(Analysis)
      .where(eq(Analysis.AnalysisID, analysisID))
      .limit(1);

    const isPublic = analysisPublicCheck[0].isPublic;
    const analysisName = analysisPublicCheck[0].analysisName;

    const userAnalysisCheck = await db
      .select({
        userAnalysisID: UserAnalysis.ID,
      })
      .from(UserAnalysis)
      .where(
        and(
          eq(UserAnalysis.AnalysisID, analysisID),
          eq(UserAnalysis.UserID, userID)
        )
      )
      .limit(1);

    if (isPublic && userAnalysisCheck.length === 0) {
      const addUserAnalysis = await db.insert(UserAnalysis).values({
        AnalysisID: analysisID,
        UserID: userID,
      });
    } else if (!isPublic && userAnalysisCheck.length === 0) {
      console.log(
        `userid:${userID} doesn't have access to analysisid${analysisID}`
      );
      return res
        .status(401)
        .json({ message: "User doesn't have access to this analysis" });
    }

    console.log("getgraphdata, analysisid: ", analysisID);
    const analysisLapsQuery = await db
      .select({
        lapID: Laps.LapID,
        lapTime: Laps.LapTime,
        userUsername: Users.Username,
        lapFileKey: Laps.LapFileKey,
        lapColor: AnalysisLaps.LapColor,
      })
      .from(AnalysisLaps)
      .innerJoin(Laps, eq(AnalysisLaps.LapID, Laps.LapID))
      .innerJoin(Users, eq(Laps.UserID, Users.UserID))
      .where(
        and(
          eq(AnalysisLaps.AnalysisID, analysisID),
          eq(AnalysisLaps.LapIsVisible, true)
        )
      )
      .orderBy(desc(AnalysisLaps.LapID));

    const laps = analysisLapsQuery.map((lap) => ({
      lapID: lap.lapID,
      lapTime: Number(lap.lapTime),
      userUsername: lap.userUsername,
      lapFileKey: lap.lapFileKey,
      lapColor: lap.lapColor,
    }));

    res
      .status(200)
      .json({ laps, analysisName: analysisName || "Untitled analysis" });
  } catch (error) {
    console.log("getgraphdata error: ", error);
    return res.status(500).json({ message: "Failed to getgraphdata" });
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

    const carID = analysisConfig[0].carID;
    const trackID = analysisConfig[0].trackID;

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

    const addAnalysisLap = await db.insert(AnalysisLaps).values({
      AnalysisID: analysisID,
      LapID: lapID,
    });

    console.log(`analysis id:${analysisID} lap id:${lapID} added`);
    res.status(200).json({ message: "Lap added to analysis" });
  } catch (error) {
    console.log("getaddlaplist error:", error);
    res.status(500).json({ message: "Failed to add lap to analysis" });
  }
};

const pasteAnalysisLap = async (req, res) => {
  try {
    const { analysisID, lapID, userID } = req.body;

    console.log(
      `pastealysislap called, analysisid:${analysisID}, lapid:${lapID}`
    );

    const lapToAdd = await db
      .select({
        lapID: Laps.LapID,
        isPublic: Sessions.IsSessionPublic,
      })
      .from(Laps)
      .innerJoin(Sessions, eq(Laps.SessionID, Sessions.SessionID))
      .where(eq(Laps.LapID, lapID));

    const ispublic = lapToAdd[0].isPublic;

    console.log(`is pasteanalysispublic lapid:${lapID}, public:${ispublic}`);

    if (ispublic) {
      const addAnalysisLap = await db.insert(AnalysisLaps).values({
        AnalysisID: analysisID,
        LapID: lapID,
      });
    } else {
      res.status(403).json({ message: "Lap is from a private session" });
    }
    res.status(200).json({ message: "Lap added to analysis" });
  } catch (error) {
    console.log("error pastinganalysislap, error:", error);
    res.status(500).json({ message: "Failed to add lap to analysis" });
  }
};

const removeAnalysisLap = async (req, res) => {
  try {
    const analysisID = req.params.analysisID;
    const lapID = req.params.lapID;

    console.log(
      `deleteanalysislap called, analysisid:${analysisID}, lapid:${lapID}`
    );

    const deletedAnalysisLap = await db
      .delete(AnalysisLaps)
      .where(
        and(
          eq(AnalysisLaps.AnalysisID, analysisID),
          eq(AnalysisLaps.LapID, lapID)
        )
      );

    console.log("analysis lap deleted");
    res.status(200).json({ message: "Lap removed from analysis" });
  } catch (error) {
    console.log("getaddlaplist error:", error);
  }
};

const changeAnalysisAccessibility = async (req, res) => {
  try {
    const { analysisID, isPublic } = req.body;
    console.log(
      `changepublicaccess called , analysisid:${analysisID}, currently public:${isPublic}`
    );

    const accesChanged = await db
      .update(Analysis)
      .set({
        IsAnalysisPublic: !isPublic,
      })
      .where(eq(Analysis.AnalysisID, analysisID));

    console.log(`analysisid:${analysisID}, is now public:${!isPublic}`);
    res
      .status(200)
      .json({ message: "Analysis accessibility changed successfully" });
  } catch (error) {
    console.error("Error changing analysis public access:", error);
    res
      .status(500)
      .json({ message: "Failed to change analysis accessibility" });
  }
};

const changeAnalysisLapVisibility = async (req, res) => {
  try {
    const { analysisID, lapID, isLapVisible } = req.body;
    console.log(
      `changeanalysislapvisibility , analysisid:${analysisID}, lapid:${lapID} currently visible:${isLapVisible}`
    );

    const visibilityChanged = await db
      .update(AnalysisLaps)
      .set({
        LapIsVisible: !isLapVisible,
      })
      .where(
        and(
          eq(AnalysisLaps.AnalysisID, analysisID),
          eq(AnalysisLaps.LapID, lapID)
        )
      );

    console.log(
      `analysisid:${analysisID}, lapid:${lapID}, is now visible:${!isLapVisible}`
    );
    res
      .status(200)
      .json({ message: "Analysis accessibility changed successfully" });
  } catch (error) {
    console.error("Error changing analysis lap visibility:", error);
    res
      .status(500)
      .json({ message: "Failed to change analysis lap visibility" });
  }
};

const changeAnalysisLapColor = async (req, res) => {
  try {
    const { color, lapID, analysisID } = req.body;
    console.log("changeanalysislapcolor body:", req.body);

    if (!color) {
      return res.status(400).json({ message: "Color value is required" });
    }

    const changedLapColor = await db
      .update(AnalysisLaps)
      .set({
        LapColor: color,
      })
      .where(
        and(
          eq(AnalysisLaps.LapID, lapID),
          eq(AnalysisLaps.AnalysisID, analysisID)
        )
      );

    console.log(`analysisid ${analysisID}, lapid:${lapID}, new color:${color}`);
    res.status(200).json({ message: "Lap color changed successfully" });
  } catch (error) {
    console.error("error changeanalysislapcolor:", error);
    res.status(500).json({ message: "Failed to change lap color" });
  }
};

const deleteAnalysis = async (req, res) => {
  try {
    const { analysisID } = req.body;
    console.log(`deleteanalysisid:${analysisID}`);

    const deletedAnalysis = await db
      .delete(Analysis)
      .where(eq(Analysis.AnalysisID, analysisID));

    console.log(`analysisid ${analysisID}, deleted`);
    res.status(200).json({ message: "Analysis deleted successfully" });
  } catch (error) {
    console.error("error deleting analysis:", error);
    res.status(500).json({ message: "Failed to delete analysis" });
  }
};

const changeAnalysisName = async (req, res) => {
  try {
    const { analysisID, analysisName } = req.body;
    console.log("changeanalysisnameid:", analysisID);

    const changedAnalysisName = await db
      .update(Analysis)
      .set({
        AnalysisName: analysisName,
      })
      .where(eq(Analysis.AnalysisID, analysisID));

    console.log(`analysisid ${analysisID}, new name:${analysisName}`);
    res.status(200).json({ message: "Analysis name changed successfully" });
  } catch (error) {
    console.error("error changeanalysisname:", error);
    res.status(500).json({ message: "Failed to change analysis name" });
  }
};

const analysisController = {
  createAnalysis,
  getAnalysisData,
  getAnalysisList,
  getGraphData,
  getUsersBestLaps,
  addAnalysisLap,
  pasteAnalysisLap,
  removeAnalysisLap,
  changeAnalysisAccessibility,
  changeAnalysisLapVisibility,
  changeAnalysisLapColor,
  deleteAnalysis,
  changeAnalysisName,
};

export default analysisController;
