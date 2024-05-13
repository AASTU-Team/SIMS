import { Request, Response } from "express";
import mongoose from "mongoose";
const Staff = require("../../models/staff.model");

export const createEvaluation = async (req: Request, res: Response) => {
  const { all } = req.body;
  if (all) {
    const stuf = Staff.findMany({ instructor: true });
  } else {
  }
};
function create() {}
