import express from "express";

import { getAddStatus } from "./AddStatus.controller";
import { getStatusById } from "./AddStatus.controller";
import { createAddStatus } from "./AddStatus.controller";
import { updateStatus } from "./AddStatus.controller";
import { deleteStatus } from "./AddStatus.controller";
import { ActivateAddStatus } from "./AddStatus.controller";
import { DeactivateAddStatus } from "./AddStatus.controller";



const AddStatusrourer = express.Router();

// get AddStatus based on dept
AddStatusrourer.get("/", getAddStatus);
AddStatusrourer.get("/:id", getStatusById);
AddStatusrourer.post("/create", createAddStatus);
AddStatusrourer.post("activate", ActivateAddStatus);
AddStatusrourer.patch("/deactivate", DeactivateAddStatus);

AddStatusrourer.patch("/:id", updateStatus);
AddStatusrourer.delete("/:id", deleteStatus);

module.exports = AddStatusrourer;
