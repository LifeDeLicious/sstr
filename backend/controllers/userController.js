import { db } from "../db/index.js";
import { desc, eq, or } from "drizzle-orm";
import { Users } from "../db/schema/Users.js";
import { UserLogs } from "../db/schema/UserLogs.js";
//import { UserLogs } from "./db/schema/UserLogs.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtutil.js";
import { Cars } from "../db/schema/Cars.js";
import { Tracks } from "../db/schema/Tracks.js";
import { Laps } from "../db/schema/Laps.js";
import { Sessions } from "../db/schema/Sessions.js";
import { UserSessions } from "../db/schema/UserSessions.js";

import { deleteFilesByKeys } from "./fileOperations.js";

export const getUserProfile = async (req, res) => {
  try {
    const userID = req.user.UserID;

    //const db = await getDb();
    const user = await db
      .select({
        username: Users.Username,
        email: Users.Email,
        isAdmin: Users.IsAdmin,
        dateRegistered: Users.DateRegistered,
      })
      .from(Users)
      .where(eq(Users.UserID, userID))
      .limit(1);

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user[0]);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
};

export const userChangeUsername = async (req, res) => {
  try {
    const userID = req.user.UserID;
    const { newUsername } = req.body;

    const userUpdated = await db
      .update(Users)
      .set({
        Username: newUsername,
      })
      .where(eq(Users.UserID, userID));

    if (userUpdated.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "username change successful" });
  } catch (error) {
    console.error("Error changing username:", error);
    res.status(500).json({ message: "Error changing username" });
  }
};

export const userDeleteProfile = async (req, res) => {
  try {
    const UserID = req.user.UserID || req.user.userId;
    const { sessionID } = req.body;
    console.log(`deletesession called , userid:${UserID}`);

    try {
      await db.transaction(async (tx) => {
        await tx
          .delete(UserSessions)
          .where(eq(UserSessions.SessionID, sessionID));

        const laps = await tx
          .select({
            fileKey: Laps.LapFileKey,
          })
          .from(Laps)
          .where(eq(Laps.SessionID, sessionID));

        const fileKeys = laps
          .map((lap) => {
            if (lap?.fileKey?.length > 0) {
              return lap.fileKey.substring(1) + ".json";
            }
            return null;
          })
          .filter(Boolean);

        if (fileKeys.length > 0) {
          await deleteFilesByKeys(fileKeys);
        }

        await tx.delete(Laps).where(eq(Laps.SessionID, sessionID));

        await tx.delete(Sessions).where(eq(Sessions.SessionID, sessionID));

        await db.transaction(async (tx) => {
          // Delete user sessions relationships
          await tx.delete(UserSessions).where(eq(UserSessions.UserID, userID));

          // Delete user laps
          await tx.delete(Laps).where(eq(Laps.UserID, userID));

          // Delete user sessions
          await tx.delete(Sessions).where(eq(Sessions.UserID, userID));

          // Finally delete the user
          await tx.delete(Users).where(eq(Users.UserID, userID));
        });
      });

      console.log(`userid:${UserID} deleted`);
      res.status(200).json({ message: "Account successfully deleted" });
    } catch (txError) {
      console.error("Transaction error:", txError);
      throw txError;
    }

    //await db.delete(Users).where(eq(Users.UserID, UserID));
  } catch (error) {
    console.error("Error deleting session:", error);
    res.status(500).json({ message: "Failed to delete session" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("/register", { username, email });

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //const db = await getDb();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(Users)
      .where(or(eq(Users.Email, email), eq(Users.Username, username)));

    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ message: "Username or email already in use" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db.insert(Users).values({
      Username: username,
      Email: email,
      PasswordHash: passwordHash,
    });

    await db.insert(UserLogs).values({
      UserID: result.insertID,
      EventType: "REGISTER",
    });

    //?added

    const users = await db
      .select()
      .from(Users)
      .where(eq(Users.Email, email))
      .limit(1);

    const user = users[0];

    await db.insert(UserLogs).values({
      UserID: user.UserID,
      EventType: "LOGIN",
    });

    const token = generateToken(user);

    res.cookie("auth_token", token, {
      httpOnly: true,
      //secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 21 * 24 * 60 * 60 * 1000,
    });

    console.log("login successful");
    res.status(201).json({
      UserID: user.UserID,
      Username: user.Username,
    });

    //return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Error registering user" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, loginSource } = req.body; //username vieta email
    console.log("/login", { email });

    if (!email || !password) {
      //labot uz email
      console.log("email or password missing");
      return res
        .status(400)
        .json({ message: "Username and password are requried!" });
    }

    console.log("looking up user with emial");
    const users = await db
      .select()
      .from(Users)
      .where(eq(Users.Email, email))
      .limit(1); //labot uz email

    console.log("query completed, found user", users.length);

    if (users.length === 0) {
      console.log("no user found with this email");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    console.log("user found", user.Username);

    console.log("comparing passwords");
    const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);

    if (!isPasswordValid) {
      console.log("password invalid");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("password valid, ,inserting log entry");
    await db.insert(UserLogs).values({
      UserID: user.UserID,
      EventType: "LOGIN",
    });

    if (loginSource === "desktop_client") {
      res.status(200).json({
        UserID: user.UserID,
        Username: user.Username,
      });
    } else {
      const token = generateToken(user);

      res.cookie("auth_token", token, {
        httpOnly: true,
        //secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 21 * 24 * 60 * 60 * 1000,
      });

      console.log("login successful");
      res.status(200).json({
        UserID: user.UserID,
        Username: user.Username,
      });
    }
  } catch (error) {
    console.log("error logging in ", error);
    res.status(500).json({ message: "Error during login!" });
  }
};

export const logoutUser = (req, res) => {
  res.cookie("auth_token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    //secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const checkAuthStatus = (req, res) => {
  console.log("auth check user data: ", req.user);

  res.status(200).json({
    UserID: req.user.UserID || req.user.userId,
    Username: req.user.Username || req.user.username,
    IsAdmin: req.user.IsAdmin,
  });
};

export const adminGetCars = async (req, res) => {
  try {
    const userID = req.user.UserID;
    console.log(`adminid:${userID}, admingetcars `);

    const userData = await db
      .select({
        isAdmin: Users.IsAdmin,
      })
      .from(Users)
      .where(eq(Users.UserID, userID));

    const isAdmin = userData[0].isAdmin;

    if (!isAdmin) {
      return res.status(401).json({ message: "User is not an admin" });
    }

    const cars = await db
      .select({
        carID: Cars.CarID,
        carModel: Cars.CarModel,
        carAssetName: Cars.CarAssetName,
      })
      .from(Cars);

    res.status(200).json({ cars });
  } catch (error) {
    console.log("error admingetcars:", error);
    res.status(500).json({ message: "Failed to admingetcars" });
  }
};

export const adminGetTracks = async (req, res) => {
  try {
    const userID = req.user.UserID;
    console.log(`adminid:${userID}, admingettracks `);

    const userData = await db
      .select({
        isAdmin: Users.IsAdmin,
      })
      .from(Users)
      .where(eq(Users.UserID, userID));

    const isAdmin = userData[0].isAdmin;

    if (!isAdmin) {
      return res.status(401).json({ message: "User is not an admin" });
    }

    const tracks = await db
      .select({
        trackID: Tracks.TrackID,
        trackName: Tracks.TrackName,
        trackAssetName: Tracks.TrackAssetName,
        trackLayout: Tracks.TrackLayout,
      })
      .from(Tracks);

    res.status(200).json({ tracks });
  } catch (error) {
    console.log("error admingettracks:", error);
    res.status(500).json({ message: "Failed to admingettracks" });
  }
};

export const adminGetUsers = async (req, res) => {
  try {
    const userID = req.user.UserID;
    console.log(`adminid:${userID}, admingetusers`);

    const userData = await db
      .select({
        isAdmin: Users.IsAdmin,
      })
      .from(Users)
      .where(eq(Users.UserID, userID));

    const isAdmin = userData[0].isAdmin;

    if (!isAdmin) {
      return res.status(401).json({ message: "User is not an admin" });
    }

    const users = await db
      .select({
        userUsername: Users.Username,
        userID: Users.UserID,
      })
      .from(Users);

    res.status(200).json({ users });
  } catch (error) {
    console.log("error admingetusers:", error);
    res.status(500).json({ message: "Failed to admingetusers" });
  }
};

export const adminDeleteUser = async (req, res) => {
  try {
    const userID = req.user.UserID;
    const { deleteUserID, deleteUserUsername } = req.body;

    console.log(`adminid:${userID}, admindeleteuser`);

    const userData = await db
      .select({
        isAdmin: Users.IsAdmin,
      })
      .from(Users)
      .where(eq(Users.UserID, userID));

    const isAdmin = userData[0].isAdmin;

    if (!isAdmin) {
      return res.status(401).json({ message: "User is not an admin" });
    }

    const fileKeys = [];
    const userFileKeys = await db
      .select({
        fileKey: Laps.LapFileKey,
      })
      .from(Users)
      .innerJoin(Laps, eq(Users.UserID, Laps.UserID))
      .where(eq(Users.UserID, deleteUserID));

    //console.log("userfilekeys", userFileKeys);

    for (let i = 0; i < userFileKeys.length; i++) {
      const item = userFileKeys[i];
      if (item && item.fileKey && item.fileKey.length > 0) {
        const withoutFirstChar = item.fileKey.substring(1);
        const withJsonExtension = withoutFirstChar + ".json";
        fileKeys.push(withJsonExtension);
      }
    }
    console.log("filekeys:", fileKeys);

    deleteFilesByKeys(fileKeys);

    const deletedUser = await db
      .delete(Users)
      .where(eq(Users.UserID, deleteUserID));

    res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    console.log("error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

export const adminUpdateTrack = async (req, res) => {
  try {
    const userID = req.user.UserID;
    const { trackID, trackName } = req.body;

    console.log(
      `adminid:${userID}, adminudpatetrackid:${trackID}, name:${trackName} `
    );

    const userData = await db
      .select({
        isAdmin: Users.IsAdmin,
      })
      .from(Users)
      .where(eq(Users.UserID, userID));

    const isAdmin = userData[0].isAdmin;

    if (!isAdmin) {
      return res.status(401).json({ message: "User is not an admin" });
    }

    const trackUpdated = await db
      .update(Tracks)
      .set({
        TrackName: trackName,
      })
      .where(eq(Tracks.TrackID, trackID));

    res.status(200).json({ message: "Track updated successfully" });
  } catch (error) {
    console.log("error updating track:", error);
    res.status(500).json({ message: "Failed to update track" });
  }
};

export const adminUpdateCar = async (req, res) => {
  try {
    const userID = req.user.UserID;
    const { carID, carName } = req.body;

    console.log(
      `adminid:${userID}, adminudpatecarid:${carID}, name:${carName} `
    );

    const userData = await db
      .select({
        isAdmin: Users.IsAdmin,
      })
      .from(Users)
      .where(eq(Users.UserID, userID));

    const isAdmin = userData[0].isAdmin;

    if (!isAdmin) {
      return res.status(401).json({ message: "User is not an admin" });
    }

    const carUpdated = await db
      .update(Cars)
      .set({
        CarModel: carName,
      })
      .where(eq(Cars.CarID, carID));

    res.status(200).json({ message: "Car updated successfully" });
  } catch (error) {
    console.log("error updating car:", error);
    res.status(500).json({ message: "Failed to update car" });
  }
};

// const loginUserClient = async (req, res) => {
//   try {
//     const { email, password } = req.body; //username vieta email
//     //console.log("/loginclient", { email });

//     if (!email || !password) {
//       //labot uz email
//       console.log("email or password missing");
//       return res
//         .status(400)
//         .json({ message: "Username and password are requried!" });
//     }

//     console.log("looking up user with emial");
//     const users = await db
//       .select()
//       .from(Users)
//       .where(eq(Users.Email, email))
//       .limit(1); //labot uz email

//     //console.log("query completed, found user", users.length);

//     if (users.length === 0) {
//       console.log("no user found with this email");
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const user = users[0];
//     console.log("user found", user.Username);

//     console.log("comparing passwords");
//     const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);

//     if (!isPasswordValid) {
//       console.log("password invalid");
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     console.log("password valid, ,inserting log entry");
//     await db.insert(UserLogs).values({
//       UserID: user.UserID,
//       EventType: "LOGIN",
//     });

//     console.log("login successful");
//     res.status(200).json({
//       userID: user.UserID, //.toString(),
//       userUsername: user.Username,
//     });
//   } catch (error) {
//     console.log("error logging in ", error);
//     res.status(500).json({ message: "Error during login!" });
//   }
// };

//export { getUser };
const userController = {
  getUserProfile,
  registerUser,
  loginUser,
  checkAuthStatus,
  logoutUser,
  adminGetCars,
  adminGetTracks,
  adminGetUsers,
  adminDeleteUser,
  adminUpdateTrack,
  adminUpdateCar,
  userChangeUsername,
  userDeleteProfile,
  //loginUserClient,
};

export default userController;
