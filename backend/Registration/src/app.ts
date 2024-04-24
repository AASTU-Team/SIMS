import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
const userrouter = require("./routes/user/user.route")

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/user",userrouter)
// app.get("/", (req , res) => {
//   res.send("Hello World!");
// });

export = app;
