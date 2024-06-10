import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
const userrouter = require("./routes/user/user.route");
const courseRouter = require("./routes/course/course.route");
const departmentRoute = require("./routes/department/department.route");
const curriculumRoute = require("./routes/curriculum/curriculum.route");
const assignmentRoute = require("./routes/assignment/assignment.route");
const RegistrationStatusRoute = require("./routes/RegistrationStatus/RegistrationStatus.route");
const AddStatusRoute = require("./routes/AddStatus/AddStatus.route");
 
const sectionRouter = require("./routes/section/section.router");
 
const SemesterRoute = require("./routes/Semester/Semester.route");
const reportRoute = require("./routes/report/report.route");
 

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/user", userrouter);
app.use("/course", courseRouter);
app.use("/department", departmentRoute);
app.use("/curriculum", curriculumRoute);
app.use("/assignment", assignmentRoute);
app.use("/RegistrationStatus", RegistrationStatusRoute);
app.use("/AddStatus", AddStatusRoute);
 
app.use("/section", sectionRouter);
 
app.use("/Semester", SemesterRoute);
app.use("/report", reportRoute);
 
// app.get("/", (req , res) => {
//   res.send("Hello World!");
// });

export = app;
