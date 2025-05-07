import { db } from "../db/index.js";
import { desc, or, eq, and } from "drizzle-orm";
import { Sessions } from "../db/schema/Sessions.js";
import { UserSessions } from "../db/schema/UserSessions.js";
import { Laps } from "../db/schema/Laps.js";
import { Cars } from "../db/schema/Cars.js";
import { Tracks } from "../db/schema/Tracks.js";

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
    res.status(200).json({ message: "session created", sessionID: sessionID });
  } catch (error) {
    console.log("error :", error);
  }
};

//test route, disable later
const postCar = async (req, res) => {
  try {
    const { carAssetName } = req.body;
    //insert car

    //let carID = carGetOrInsert(carAssetName);

    //insert track

    //let trackID = trackGetOrInsert(trackAssetName);

    //insert session
    //insert usersession
    //pectam jau var postot aplus

    const carResult = await db
      .insert(Cars)
      .values({
        CarAssetName: carAssetName,
      })
      .$returningId();
    const [carIdResult] = await db.select({ insertId: sql`LAST_INSERT_ID()` });
    const carID = carResult[0].CarID;
    console.log("inserted carid: ", carID);
    res.status(200).json({ message: `car ${carID} inserted` });

    // const session = await db.insert(Sessions).values({});
  } catch (error) {
    console.log("error :", error);
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
  postCar,
};

export default sessionController;
