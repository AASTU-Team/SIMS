import express from "express";

import { createSection, getSections, getSectionss } from "./section.controller";

const sectionRouter = express.Router();

// get AddStatus based on dept
sectionRouter.get("/", getSections);
sectionRouter.post("/create", createSection);
sectionRouter.get("/department", getSectionss);
// sectionRouter.get("/:id", getStatusById);
// sectionRouter.patch("/:id", updateStatus);
// sectionRouter.delete("/:id", deleteStatus);

module.exports = sectionRouter;
