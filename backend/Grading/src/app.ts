import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();
// import assesmentRoutes from "./routes/assessment/assessment.route";
// import submissionRoutes from "./routes/submission/submission.route";
import gradeRoutes from "./routes/grade/grade.route";
import approvalRoutes from "./routes/approval/approval.route";
import limiter from "./middlewares/rate.middleware";
const app = express();

// app.use(limiter);
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
// app.use('/assessments', assesmentRoutes);
// app.use('/api', submissionRoutes);
app.use('/', gradeRoutes);
app.use('/approval', approvalRoutes);

export = app;
