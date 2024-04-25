import express from "express";
import * as path from 'path';
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
const userrouter = require("./routes/user/user.route")


const app = express();
app.use('/uploads', express.static('public/uploads'));

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/",userrouter)
app.get("/", (req , res) => {
  res.send("Server is running.");
});

export = app;
