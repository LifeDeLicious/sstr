import { db } from "../db/index.js";
import { desc, eq, or } from "drizzle-orm";
import { Users } from "../db/schema/Users.js";
import { UserLogs } from "../db/schema/UserLogs.js";
//import { UserLogs } from "./db/schema/UserLogs.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtutil.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.query;
    console.log("getuser", id);

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    //const db = await getDb();
    const user = await db
      .select({
        id: Users.UserID,
        username: Users.Username,
        email: Users.Email,
        isAdmin: Users.IsAdmin,
      })
      .from(Users)
      .where(eq(Users.UserID, id))
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
    res.status(200).json({
      UserID: user.UserID,
      Username: user.Username,
    });

    return res.status(201).json({ message: "User registered successfully" });
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
        UserID: user.UserID.toString(),
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
  });
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
  getUser,
  registerUser,
  loginUser,
  checkAuthStatus,
  logoutUser,
  //loginUserClient,
};

export default userController;
