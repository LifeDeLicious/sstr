import { db } from "../db/index.js";
import { desc, or, eq } from "drizzle-orm";
import { Laps } from "../db/schema/Laps.js";
import { Users } from "../db/schema/Users.js";
import { Sessions } from "../db/schema/Sessions.js";

const postLap = async (req, res) => {
  const { userID } = req.body;

  try {
    const session = await db.insert(Sessions).values({});
  } catch (error) {
    console.log("error :", error);
  }

  console.log("postLap");
};

const lapController = {
  postLap,
};

export default lapController;
