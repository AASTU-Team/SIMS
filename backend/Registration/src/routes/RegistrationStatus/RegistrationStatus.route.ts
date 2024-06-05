import express from "express";

import { getRegistrationStatus } from "./RegistrationStatus.controller";
import { getStatusById } from "./RegistrationStatus.controller";
import { createRegistrationStatus } from "./RegistrationStatus.controller";
import { updateStatus } from "./RegistrationStatus.controller";
import { deleteStatus } from "./RegistrationStatus.controller";
import { ActivateRegistrationStatus } from "./RegistrationStatus.controller";
import { DeactivateRegistrationStatus } from "./RegistrationStatus.controller";



const RegistrationStatusrourer = express.Router();

// get RegistrationStatus based on dept
RegistrationStatusrourer.get("/", getRegistrationStatus);
RegistrationStatusrourer.get("/:id", getStatusById);
RegistrationStatusrourer.post("/create", createRegistrationStatus);
RegistrationStatusrourer.post("/activate", ActivateRegistrationStatus);
RegistrationStatusrourer.patch("/deactivate", DeactivateRegistrationStatus);

RegistrationStatusrourer.patch("/:id", updateStatus);
RegistrationStatusrourer.delete("/:id", deleteStatus);

module.exports = RegistrationStatusrourer;
