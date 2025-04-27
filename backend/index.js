import express from "express";

import { db } from "./db/index.js";

const app = express();

const port = 3000;

//not needed if frontend is hosted it seems like!
app.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // allowing localhost frontned to request
  // res.header("Access-Control-Allow-Methods", "GET, POST");
  // res.header("Access-Control-Allow-Headers", "Content-Type");
  // next();
});

app.listen(port, () => {
  console.log("listening on port 3000");
});

//login page
app.get("/", (req, res) => {
  console.log("req, received");
});

//laps?
app.get("/laps", (req, res) => {
  console.log("laps page");
  res.json({ message: "amongus" }).status(200);
});

app.post("/testpost", (req, res) => {
  const data = req.body;

  console.log(`request: ${JSON.stringify(data)}`);
});
