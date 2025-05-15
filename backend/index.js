import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

// import { db } from "./db/index.js";

import userRoutes from "./routes/userRoutes.js";
import lapRoutes from "./routes/lapRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

const port = 3000;

app.use(
  cors({
    origin: ["https://sstr.reinis.space", "https://api.sstr.reinis.space"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

//not needed if frontend is hosted it seems like!
// app.use((req, res, next) => {
//   // res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // allowing localhost frontned to request
//   // res.header("Access-Control-Allow-Methods", "GET, POST");
//   // res.header("Access-Control-Allow-Headers", "Content-Type");
//   // next();
// });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://sstr.reinis.space"); //"https://sstr.reinis.space"
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(204).send();
});

app.listen(port, () => {
  console.log("listening on port 3000");
});

app.use("/", userRoutes);

app.use("/laps", lapRoutes);

app.use("/analysis", analysisRoutes);

app.use("/session", sessionRoutes);

//login page
// app.get("/", (req, res) => {
//   console.log("req, received");
// });

//laps?
// app.get("/laps", (req, res) => {
//   console.log("laps page");
//   res.json({ message: "amongus" }).status(200);
// });

app.post("/testpost", (req, res) => {
  const data = req.body;

  console.log(`request: ${JSON.stringify(data)}`);
  res.json({ message: "post endpoint working fine" }).status(200);
});

app.post("/createsession", (req, res) => {
  const { userId, carAssetname, trackAssetName } = req.body;
  console.log("/createsession");
});
