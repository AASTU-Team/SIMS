import { Request, Response } from "express";
import {
  createUser,
  setInvite,
  validateAuth,
  validateUser,
} from "../../models/auth.model";
import Auth from "../../models/auth.model";
import _ from "lodash";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../helper/mail";
interface IAuth {
  username: string;
  password: string;
  email: string;
  tokens: string[];
  salt: string;
}
const bcrypt = require("bcrypt");

async function register(req: Request, res: Response): Promise<any> {
  //  Validate user data
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // const selected = ..._.pick(, [
  //   "username",
  //   "email",
  //   "password",
  //   "salt",
  // ]);

  const existing = await Auth.findOne({ email: req.body.email });
  if (existing) return res.status(409).json({ message: "Conflicting email" });
  const salt = await bcrypt.genSalt(10);
  // const password = await bcrypt.hash(req.body.password, salt)
  const user = await createUser({
    ...req.body,
    salt: salt,
    role: req.body.role,
    status: "Pending",
  });
  //send email with link

  try {
    const info = await sendEmail(user);
    console.log("Email sent successfully!", info);
    // Handle success case
  } catch (error) {
    console.error("Error sending email:", error);
    // Handle error case
  }

  console.log(user);
  if (!user) return res.status(409).json({ message: "Conflict" });
  return res.status(201).send({ message: "success message" });
}
async function deleteUser(req: Request, res: Response): Promise<any> {
  //  Validate user data
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const deleteduser = await Auth.deleteOne({ email: req.body.email });
    if (!deleteduser) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json({ message: "success" });
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
}

async function deactivateUser(req: Request, res: Response): Promise<any> {
  //  Validate user data
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const updateduser = await Auth.findOneAndUpdate(
      { email: req.body.email },
      { status: "Inactive" }
    );
    if (!updateduser) {
      return res.status(404).json({ message: "Not Updated" });
    }

    return res.status(200).json({ message: "success" });
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
}

async function activateUser(req: Request, res: Response): Promise<any> {
  //  Validate user data
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const updateduser = await Auth.findOneAndUpdate(
      { email: req.body.email },
      { status: "Active" }
    );
    if (!updateduser) {
      return res.status(404).json({ message: "Not Updated" });
    }

    return res.status(200).json({ message: "success" });
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
}

async function login(req: Request, res: Response): Promise<any> {
  const { error } = validateAuth(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // Handle login logic here
  try {
    const user = await findByCredentials(req.body.email, req.body.password);
    // res.status(200).send(user);
    const tokens = await user.generateAuthTokens();
    res.send({ ...tokens });
  } catch (e: any) {
    console.log(e);
    res.status(400).send({ message: e.message });
  }
}
async function getUserProfile(req: any, res: Response) {
  try {
    res.status(200).send({ email: req.user.email, role: req.user.role,status:req.user.status });
  } catch (e: any) {
    res.status(500).send(e.message);
  }
}
async function getUserStatus(req: any, res: Response) {
  const user:any = await Auth.findOne({ email: req.params.email})
  if(!user)
    {
      return res.status(200).json({status:""});
    }
  try {
    return res.status(200).json({status:user.status});
  
  } catch (e: any) {
     return res.status(500).send(e.message);
  }
}
async function getNewAccessToken(req: any, res: Response): Promise<void> {
  try {
    const user = req.user;
    const tokens = await user.generateNewAuthToken();
    res.send(tokens as { accessToken: string });
  } catch (e: unknown) {
    console.log(e);
    res.status(400).send(e);
  }
}
async function changePassword(req: any, res: Response): Promise<void> {
  try {
    const user = req.user; //database user object

    //const isMatch = await bcrypt.compare(password , req.user.password)

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    console.log(req.body);

    if (req.isFirstTime) {
      user.invitations = "";
      user.salt = salt;
      user.password = password;
      user.status = "Active";
    } else {
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
      if (isMatch) {
        user.password = await bcrypt.hash(req.body.password, salt);
        user.salt = salt;
      } else {
        throw new Error(`Invalid password`);
      }
    }
    console.log(user);
    await user.save();
    res.status(200).send("password changed");
  } catch (e: any) {
    console.log(e);
    res.status(400).send(e.message);
  }
}
async function logout(req: any, res: Response): Promise<void> {
  try {
    const user = req.user;
    user.tokens = user.tokens.filter((t: string) => t !== req.token);
    await user.save();
    console.log(req.user);
    res.status(200).send("logged out successfully");
  } catch (e: unknown) {
    console.log(e);
    res.status(400).send(e);
  }
}
async function logoutAll(req: any, res: Response): Promise<void> {
  try {
    const user = req.user;
    user.tokens = [];
    await user.save();
    res.status(200).send({ message: "logged out from all devices" });
  } catch (e: any) {
    console.log(e);
    res.status(400).send(e.message || e);
  }
}

async function findByCredentials(
  email: string,
  password: string
): Promise<any> {
  const user = await Auth.findOne({
    email: email,
  });
  if (!user) {
    throw new Error("invalid email or password");
  }
  if (user.status === "Inactive") {
    throw new Error(
      "your account is inactive please contact the administrator"
    );
  }

  if (user.status === "Pending") {
    throw new Error("Please Verify your password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error(" invalid email or password");
  }
  return user;
}
async function forgotPassword(req: Request, res: Response): Promise<any> {
  const existing = await Auth.findOne({ email: req.body.email });
  if (!existing) return res.status(200).json({ message: "success" });

  const user = await setInvite({
    ...req.body,
  });
  //send email with link
  try {
    const info = await sendEmail({ ...user, forgot: true });
    console.log("Email sent successfully!", info);
    // Handle success case
  } catch (error) {
    console.error("Error sending email:", error);
    // Handle error case
  }

  console.log(user);
  if (!user) return res.status(200).json({ message: "success" });
  return res.status(201).send({ message: "success message" });
}

export {
  register,
  login,
  getUserProfile,
  getNewAccessToken,
  changePassword,
  logout,
  logoutAll,
  deleteUser,
  deactivateUser,
  activateUser,
  forgotPassword,
  getUserStatus
};
