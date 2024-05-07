import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
const roomrouter = require("./routes/room/room.route");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/rooms", roomrouter);

export = app;
