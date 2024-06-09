import { Router } from "express";
import {
  register,
  login,
  getUserProfile,
  getNewAccessToken,
  changePassword,
  logout,
  logoutAll,
  deleteUser,
  forgotPassword,
} from "./auth.controller";

import { accessAuth } from "../../middleware/auth";
import { role } from "../../middleware/role";
import { refAuth } from "../../middleware/refAuth";
import { inviteAuth } from "../../middleware/inviteAuth";
import { deactivateUser } from "./auth.controller";
import { activateUser } from "./auth.controller";

const auth = Router();

auth.post("/register", register);
auth.delete("/delete", deleteUser);
auth.patch("/deactivate", deactivateUser);
auth.patch("/activate", activateUser);
auth.post("/login", login);
// auth.get("/me", [accessAuth, role], getUserProfile);
auth.get("/me", [accessAuth], getUserProfile);
auth.post("/refresh", [refAuth], getNewAccessToken);
auth.post("/logout", [refAuth], logout);
auth.post("/logoutAll", accessAuth, logoutAll);
// auth.post("/refresh", [refAuth], getNewAccessToken);
auth.patch("/password", accessAuth, changePassword);
auth.patch("/invitePass", inviteAuth, changePassword);

auth.patch("/forgotpassword ", forgotPassword);

export default auth;
