import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();
import assesmentRoutes from "./routes/assessment/assessment.route";
import submissionRoutes from "./routes/submission/submission.route";
import gradeRoutes from "./routes/grade/grade.route";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/assessments', assesmentRoutes);
app.use('/api', submissionRoutes);
app.use('/grade', gradeRoutes);

export = app;
