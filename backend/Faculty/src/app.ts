import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
const evaluationrouter = require("./routes/evaluation/evaluation.route")
const profilerouter = require("./routes/profile/profile.route")

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/profile",profilerouter)
app.use("/evaluation",evaluationrouter)
// app.get("/", (req , res) => {
//   res.send("Hello World!");
// });

export = app;
