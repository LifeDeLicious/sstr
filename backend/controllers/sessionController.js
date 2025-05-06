import { db } from "../db/index.js";
import { desc, or, eq } from "drizzle-orm";
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
      amountOfLaps,
      trackTemperature,
      airTemperature,
    } = req.body;
    //insert car
    //insert track
    //insert session
    //insert usersession
    //pectam jau var postot aplus

    const carResult = await db
      .insert(Cars)
      .values({
        CarAssetName: carAssetName,
      })
      .$returningId();
    //const [carIdResult] = await db.select({ insertId: sql`LAST_INSERT_ID()`});
    const carID = carResult.id;
    console.log("inserted carid: ", carID);

    const session = await db.insert(Sessions).values({});
  } catch (error) {
    console.log("error :", error);
  }
};

const postCar = async (req, res) => {
  try {
    const { carAssetName } = req.body;
    //insert car
    //insert track
    //insert session
    //insert usersession
    //pectam jau var postot aplus

    const carResult = await db
      .insert(Cars)
      .values({
        CarAssetName: carAssetName,
      })
      .$returningId();
    //const [carIdResult] = await db.select({ insertId: sql`LAST_INSERT_ID()`});
    const carID = carResult.id;
    console.log("inserted carid: ", carID);
    res
      .status(200)
      .json({ message: `car ${carID} inserted` })
      .send();

    // const session = await db.insert(Sessions).values({});
  } catch (error) {
    console.log("error :", error);
  }
};

const sessionController = {
  createSession,
  postCar,
};

export default sessionController;
