import { Request, Response } from "express";
import mongoose from "mongoose";
const Staff = require("../../models/staff.model");

export const createEvaluation = async (req: Request, res: Response) => {
  const { all } = req.body;
  if (all) {
    const stuf = await Staff.find({ instructor: true }).select("_id");
    console.log(stuf);
  } else {
  }
};
async function createEval(ids: []) {
  if (ids) {
    const response: any = await fetch(
      "http://localhost:3000/assignment/register",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 201) {
    }
    ids.forEach((id) => {});
  } else {
  }
}
