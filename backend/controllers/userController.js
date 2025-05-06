import { db } from "../db/index.js";
//import { desc, eq } from "drizzle-orm";
import { Users } from "../db/schema/Users.js";
import { UserLogs } from "../db/schema/UserLogs.js";
//import { UserLogs } from "./db/schema/UserLogs.js";
import bcrypt from "bcryptjs";

const getUser = async (req, res) => {
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

const registerUser = async (req, res) => {
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
      .where(eq(Users.Email, email))
      .or(eq(Users.Username, username));

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
      Action: "REGISTER",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; //username vieta email
    console.log("/login", { username });

    if (!email || !password) {
      //labot uz email
      return res
        .status(400)
        .json({ message: "Username and password are requried!" });
    }

    const users = await db
      .select()
      .from(Users)
      .where(eq(Users.Email, email))
      .limit(1); //labot uz email

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await db.insert(UserLogs).values({
      UserID: user.UserID,
      Action: "LOGIN",
    });

    console.log("login successful");
    res.status(200).json({
      userID: user.userID.toString(),
      userUsername: user.Username,
    });
  } catch (error) {
    console.log("error logging in ", error);
    res.status(500).json({ message: "Error during login!" });
  }
};

//export { getUser };
const userController = {
  getUser,
  registerUser,
  loginUser,
};

export default userController;
