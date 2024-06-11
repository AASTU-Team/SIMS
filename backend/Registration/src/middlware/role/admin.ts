// Access Control Middleware (in a different service)
import { Request, Response, NextFunction } from "express";

const Staff = require("../../models/staff.model");

interface Reqq extends Request {
  user?: {
    email: string;
    role: string[];
  };
}

export const accessAuth = async (
  req: Reqq,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the access token from the request

    const user = await Staff.find({ email: req.user?.email });

    if (!user) {
      return res.status(400).send("Forbidden");
    }

    // Attach the user data to the request object
    req.user = user;
    // If the user's role is 'student', call next()
    if (req.user?.role.includes("admin")) {
      return next();
    } else {
      // Otherwise, send a 403 Forbidden response
      return res.status(403).send("Forbidden");
    }
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};
