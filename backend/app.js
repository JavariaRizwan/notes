require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pinohttp = require("pino-http");
const logger = require("./src/config/logger");
global.logger = logger;
const connectDB = require("./connection/connectDB");
const router = require("./routes/router");
const cookieParser = require("cookie-parser");

const app = express();
app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(pinohttp({ logger }));
app.use(cookieParser());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use("/api", router);

module.exports = app;