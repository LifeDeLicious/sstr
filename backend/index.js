import express from "express";

const app = express();

const port = 3000;

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
});
