import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import lapRoutes from "./routes/lapRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = express();

const port = 3000;

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use(
  cors({
    origin: ["https://sstr.reinis.space", "https://api.sstr.reinis.space"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "https://sstr.reinis.space");
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
