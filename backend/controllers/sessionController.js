import { db } from "../db/index.js";
import { desc, or, eq, and, count, sum, max, min } from "drizzle-orm";
import { Sessions } from "../db/schema/Sessions.js";
import { UserSessions } from "../db/schema/UserSessions.js";
import { Laps } from "../db/schema/Laps.js";
import { Cars } from "../db/schema/Cars.js";
import { Tracks } from "../db/schema/Tracks.js";
import { Users } from "../db/schema/Users.js";
import { deleteFilesByKeys } from "./fileOperations.js";

const createSession = async (req, res) => {
  try {
    const {
      userID,
      carAssetName,
      trackAssetName,
      trackLayoutName,
      amountOfLaps,
      trackTemperature,
      airTemperature,
      fastestLapTime,
    } = req.body;
    console.log("createsession");
    console.log(`airtemp: ${airTemperature}`);
    console.log(`tracktemp: ${trackTemperature}`);
    console.log("endcreatesession");
    //insert car
    const carID = await carGetOrInsert(carAssetName);

    //insert track
    const trackID = await trackGetOrInsert(trackAssetName, trackLayoutName);

    //insert session
    const session = await db
      .insert(Sessions)
      .values({
        UserID: userID,
        CarID: carID,
        TrackID: trackID,
        TrackTemperature: trackTemperature,
        AirTemperature: airTemperature,
        FastestLapTime: fastestLapTime,
        AmountOfLaps: amountOfLaps,
      })
      .$returningId();

    const sessionID = session[0].SessionID;

    //insert usersession
    const userSession = await db.insert(UserSessions).values({
      SessionID: sessionID,
      UserID: userID,
    });
    //pectam jau var postot aplus

    // const carResult = await db
    //   .insert(Cars)
    //   .values({
    //     CarAssetName: carAssetName,
    //   })
    //   .$returningId();
    //const [carIdResult] = await db.select({ insertId: sql`LAST_INSERT_ID()`});
    //const carID = carResult.id;
    //console.log("inserted carid: ", carID);

    //const session = await db.insert(Sessions).values({});
    console.log("session created, id: ", sessionID);
    res.status(200).json({ message: "session created", sessionID: sessionID });
  } catch (error) {
    console.log("error :", error);
  }
};

const getSessionSummaries = async (req, res) => {
  try {
    const UserID = req.user.UserID || req.user.userId;

    const combinationQuery = await db
      .select({
        carID: Cars.CarID,
        carModel: Cars.CarModel,
        carAssetName: Cars.CarAssetName,
        trackID: Tracks.TrackID,
        trackName: Tracks.TrackName,
        trackAssetName: Tracks.TrackAssetName,
        trackLayout: Tracks.TrackLayout,
        eventCount: count(Sessions.SessionID).as("eventCount"),
        totalLaps: sum(Sessions.AmountOfLaps).as("totalLaps"),
        lastDriven: max(Sessions.DateTime).as("lastDriven"),
        bestLapTime: min(Sessions.FastestLapTime).as("bestLapTime"),
      })
      .from(UserSessions)
      .innerJoin(Sessions, eq(UserSessions.SessionID, Sessions.SessionID))
      .innerJoin(Cars, eq(Sessions.CarID, Cars.CarID))
      .innerJoin(Tracks, eq(Sessions.TrackID, Tracks.TrackID))
      .where(eq(UserSessions.UserID, UserID))
      .groupBy(Cars.CarID, Tracks.TrackID)
      .orderBy(desc(max(Sessions.DateTime)));

    const result = [];

    for (const combo of combinationQuery) {
      const sessionIdsResult = await db
        .select({
          sessionID: Sessions.SessionID,
        })
        .from(UserSessions)
        .innerJoin(Sessions, eq(UserSessions.SessionID, Sessions.SessionID))
        .where(
          and(
            eq(UserSessions.UserID, UserID),
            eq(Sessions.CarID, combo.carID),
            eq(Sessions.TrackID, combo.trackID)
          )
        );

      const sessionIds = sessionIdsResult.map((row) => row.sessionID);

      const sessionsWithDetails = [];

      for (const { sessionID } of sessionIdsResult) {
        const sessionResult = await db
          .select({
            sessionID: Sessions.SessionID,
            date: Sessions.DateTime,
            laps: Sessions.AmountOfLaps,
            fastestLap: Sessions.FastestLapTime,
            trackTemperature: Sessions.TrackTemperature,
            airTemperature: Sessions.AirTemperature,
          })
          .from(Sessions)
          .where(eq(Sessions.SessionID, sessionID))
          .limit(1);

        if (sessionResult.length === 0) continue;
        const session = sessionResult[0];

        const timeResult = await db
          .select({
            totalTime: sum(Laps.LapTime),
          })
          .from(Laps)
          .where(eq(Laps.SessionID, sessionID));

        const timeOnTrack = timeResult[0]?.totalTime || 0;

        sessionsWithDetails.push({
          sessionID: session.sessionID,
          date: session.date,
          laps: Number(session.laps),
          fastestLap: Number(session.fastestLap),
          timeOnTrack: Number(timeOnTrack),
          trackTemperature: Number(session.trackTemperature),
          airTemperature: Number(session.airTemperature),
        });
      }

      sessionsWithDetails.sort((a, b) => new Date(b.date) - new Date(a.date));

      result.push({
        summary: {
          carName: combo.carModel,
          carAssetName: combo.carAssetName,
          trackName: combo.trackName,
          trackAssetName: combo.trackAssetName,
          trackLayout: combo.trackLayout,
          eventCount: Number(combo.eventCount),
          totalLaps: Number(combo.totalLaps),
          lastDriven: combo.lastDriven,
          bestLapTime: Number(combo.bestLapTime),
        },
        sessions: sessionsWithDetails,
      });
    }

    res.status(200).json(result);
    console.log("getsessionsummaries");
  } catch (error) {
    console.log("getsessionsummaries error: ", error);
  }
};

const getSessionData = async (req, res) => {
  try {
    const { sessionID } = req.params;

    if (!sessionID || isNaN(parseInt(sessionID))) {
      return res.status(400).json({ message: "Invalid session ID" });
    }

    const sessionInfo = await db
      .select({
        sessionID: Sessions.SessionID,
        dateTime: Sessions.DateTime,
        amountOfLaps: Sessions.AmountOfLaps,
        fastestLapTime: Sessions.FastestLapTime,
        trackTemperature: Sessions.TrackTemperature,
        airTemperature: Sessions.AirTemperature,
        carName: Cars.CarModel,
        carAssetName: Cars.CarAssetName,
        carID: Cars.CarID,
        trackName: Tracks.TrackName,
        trackAssetName: Tracks.TrackAssetName,
        trackID: Tracks.TrackID,
        trackLayout: Tracks.TrackLayout,
        userUsername: Users.Username,
        isPublic: Sessions.IsSessionPublic,
      })
      .from(Sessions)
      .innerJoin(Cars, eq(Sessions.CarID, Cars.CarID))
      .innerJoin(Tracks, eq(Sessions.TrackID, Tracks.TrackID))
      .innerJoin(Users, eq(Sessions.UserID, Users.UserID))
      .where(eq(Sessions.SessionID, parseInt(sessionID)))
      .limit(1);

    if (sessionInfo.length === 0) {
      return res.status(404).json({ message: "Session not found" });
    }

    const laps = await db
      .select({
        lapID: Laps.LapID,
        lapTime: Laps.LapTime,
        isFastestLap: Laps.IsFastestLapOfSession,
      })
      .from(Laps)
      .where(eq(Laps.SessionID, parseInt(sessionID)))
      .orderBy(Laps.LapID);

    const response = {
      session: {
        ...sessionInfo[0],
        amountOfLaps: Number(sessionInfo[0].amountOfLaps),
        fastestLapTime: Number(sessionInfo[0].fastestLapTime),
        trackTemperature: Number(sessionInfo[0].trackTemperature),
        airTemperature: Number(sessionInfo[0].airTemperature),
      },
      laps: laps.map((lap) => ({
        ...lap,
        lapTime: Number(lap.lapTime),
      })),
    };

    res.status(200).json(response);
  } catch (error) {
    console.log("error gettingsessionlaps: ", error);
    res.status(500).json({ message: "Error retrieving session details" });
  }
};

const changeSessionAccessibility = async (req, res) => {
  //! kopets no analysis
  try {
    const { sessionID, isPublic } = req.body;
    console.log(
      `changesessionaccessibility called , sessionid:${sessionID}, currently public:${isPublic}`
    );

    const accesChanged = await db
      .update(Sessions)
      .set({
        IsSessionPublic: !isPublic,
      })
      .where(eq(Sessions.SessionID, sessionID));

    console.log(`sessionid:${sessionID}, is now public:${!isPublic}`);
    res
      .status(200)
      .json({ message: "Session accessibility changed successfully" });
  } catch (error) {
    console.error("Error changing session public access:", error);
    res.status(500).json({ message: "Failed to change session accessibility" });
  }
};

const deleteSession = async (req, res) => {
  try {
    const UserID = req.user.UserID || req.user.userId;
    const { sessionID } = req.body;
    console.log(
      `deletesession called , sessionid:${sessionID}, userid:${UserID}`
    );

    const isUsersSession = await db
      .select(Sessions.SessionID)
      .from(Sessions)
      .where(
        and(eq(Sessions.SessionID, sessionID), eq(Sessions.UserID, UserID))
      );

    if (isUsersSession.length === 0) {
      return res
        .status(401)
        .json({ message: "Session does not belong to user" });
    }

    const laps = await db
      .select()
      .from(Laps)
      .where(eq(Laps.SessionID, sessionID));

    // Extract file keys from the laps
    const fileKeys = laps
      .map((lap) => {
        if (lap && lap.LapFileKey && lap.LapFileKey.length > 0) {
          const withoutFirstChar = lap.LapFileKey.substring(1);
          return withoutFirstChar + ".json";
        }
        return null;
      })
      .filter(Boolean);

    // Delete files from storage
    if (fileKeys.length > 0) {
      deleteFilesByKeys(fileKeys);
    }

    // const fileKeys = [];
    // const userFileKeys = await db
    //   .select({
    //     fileKey: Laps.LapFileKey,
    //   })
    //   .from(Laps)
    //   .where(eq(Laps.SessionID, sessionID));

    // for (let i = 0; i < userFileKeys.length; i++) {
    //   const item = userFileKeys[i];
    //   if (item && item.fileKey && item.fileKey.length > 0) {
    //     const withoutFirstChar = item.fileKey.substring(1);
    //     const withJsonExtension = withoutFirstChar + ".json";
    //     fileKeys.push(withJsonExtension);
    //   }
    // }
    //console.log("filekeys:", fileKeys);
    // deleteFilesByKeys(fileKeys);

    const deletedLaps = await db
      .delete(Laps)
      .where(eq(Laps.SessionID, sessionID));

    const deletedSession = await db
      .delete(Sessions)
      .where(eq(Sessions.SessionID, sessionID));

    console.log(`sessionid:${sessionID} deleted`);
    res.status(200).json({ message: "Session successfully deleted" });
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ message: "Failed to delete session" });
  }
};

async function carGetOrInsert(carName) {
  const existing = await db
    .select()
    .from(Cars)
    .where(eq(Cars.CarAssetName, carName))
    .limit(1);

  let id;

  if (existing.length > 0) {
    id = existing[0].CarID;
    console.log("car existed, id: ", id);
  } else {
    await db.insert(Cars).values({
      CarAssetName: carName,
    });

    const inserted = await db
      .select()
      .from(Cars)
      .where(eq(Cars.CarAssetName, carName))
      .orderBy(Cars.CarID)
      .limit(1);

    id = inserted[0].CarID;
    console.log(`New car id: ${id} inserted`);
  }

  return id;
}

async function trackGetOrInsert(trackName, trackLayoutName) {
  const existing = await db
    .select()
    .from(Tracks)
    .where(
      and(
        eq(Tracks.TrackAssetName, trackName),
        eq(Tracks.TrackLayout, trackLayoutName)
      )
    )
    .limit(1);

  let id;

  if (existing.length > 0) {
    id = existing[0].TrackID;
    console.log("track existed, id: ", id);
  } else {
    await db.insert(Tracks).values({
      TrackAssetName: trackName,
      TrackLayout: trackLayoutName,
    });

    const inserted = await db
      .select()
      .from(Tracks)
      .where(eq(Tracks.TrackAssetName, trackName))
      .orderBy(Tracks.TrackID)
      .limit(1);

    id = inserted[0].TrackID;
    console.log(`New track id: ${id} inserted`);
  }

  return id;
}

const sessionController = {
  createSession,
  getSessionSummaries,
  getSessionData,
  changeSessionAccessibility,
  deleteSession,
  //postCar,
};

export default sessionController;
