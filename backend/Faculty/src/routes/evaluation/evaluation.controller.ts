import { Request, Response } from "express";

import { date } from "joi";
import mongoose, { Error } from "mongoose";
const Staff = require("../../models/staff.model");
const InstructorEvaluation = require("../../models/Evaluation.model");

export const createEvaluation = async (req: Request, res: Response) => {
  const { all } = req.body;
  if (all) {
    const stuff = await Staff.find({ instructor: true }).select("_id");
    const created = await createEval(stuff);
    if (created === "success") {
      return res.status(200).json({ message: "Evaluations created" });
    } else {
      return res
        .status(400)
        .json({ message: "Evaluations created", failure: created });
    }
  } else {
    console.log(req.body.ids);
    const created = await createEval(req.body.ids);
    if (created === "success") {
      return res.status(200).json({ message: "Evaluations created" });
    } else {
      return res.status(400).json({ failure: created });
    }
  }
};
async function createEval(ids: []) {
  let failure: any = [];
  if (ids) {
    ids.forEach(async (id: any) => {
      try {
        const response: any = await fetch(
          `http://localhost:3000/schedule/instructor/${id._id.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          data.forEach(async (assignment: any) => {
            const Eval: any = await InstructorEvaluation({
              instructor_id: id._id,
              course_id: assignment.course_id,
            });
            await Eval.save();
          });
        } else {
          const error: any = await Staff.findById(id._id);
          failure.push(error.name);
        }
      } catch (e) {
        const error: any = await Staff.findById(id._id);
        failure.push(error.name);
      }
    });
    if (failure.length > 0) {
      return failure;
    } else {
      return "success";
    }
  } else {
    return "ids are required";
  }
}

export const getEvaluationByInst = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const evaluations = await InstructorEvaluation.find({ instructor_id: id });
    return res.status(200).json(evaluations);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "An error occurred" });
  }
};
export const fillEvaluation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    student_id,
    course_id,
    professionalismI,
    knowledgeI,
    communicationI,
    organizationI,
    responsivenessI,
    teaching_styleI,
  } = req.body;
  // check if the stud_id is in evaluatedbtstud
  console.log("data = ", professionalismI);
  try {
    const data = await InstructorEvaluation.findOne({
      instructor_id: id,
      course_id: course_id,
      //   where: {
      //     expires_at: {
      //       $gte: Date.now(),
      //     },
      //   },
    });
    if (!data) {
      return res.status(400).json({ error: "Evaluation is expired" });
    }
    console.log(data);
    const evalLength = data?.evaluated_by_students.length;
    console.log(evalLength);
    if (!(evalLength > 0)) {
      const evaluation = await InstructorEvaluation.findOneAndUpdate(
        { instructor_id: id, course_id: course_id },
        {
          $set: {
            professionalism: professionalismI,
            knowledge: knowledgeI,
            communication: communicationI,
            organization: organizationI,
            responsiveness: responsivenessI,
            teaching_style: teaching_styleI,
          },
          $push: { evaluated_by_students: student_id },
        },
        { new: true }
      );
      return res.status(200).json(evaluation);
    } else {
      const {
        professionalism,
        knowledge,
        communication,
        organization,
        responsiveness,
        teaching_style,
      } = data;
      console.log(professionalismI, knowledgeI);
      const professionalismData = calcAverge(
        professionalism,
        evalLength,
        professionalismI
      );
      const knowledgeData = calcAverge(knowledge, evalLength, knowledgeI);
      const communicationData = calcAverge(
        communication,
        evalLength,
        communicationI
      );
      const organizationData = calcAverge(
        organization,
        evalLength,
        organizationI
      );
      const responsivenessData = calcAverge(
        responsiveness,
        evalLength,
        responsivenessI
      );
      const teaching_styleData = calcAverge(
        teaching_style,
        evalLength,
        teaching_styleI
      );
      console.log(teaching_styleData, responsivenessData, organizationData);
      const updatedEvaluation = await InstructorEvaluation.findOneAndUpdate(
        { instructor_id: id, course_id: course_id },
        {
          $set: {
            professionalism: professionalismData,
            knowledge: knowledgeData,
            communication: communicationData,
            organization: organizationData,
            responsiveness: responsivenessData,
            teaching_style: teaching_styleData,
          },
          $push: { evaluated_by_students: student_id },
        },
        { new: true }
      );
      res.status(201).json({
        massage: "success",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "An error occurred" });
  }
};
function calcAverge(parameter: any, evalLength: any, userParameter: any) {
  const avg = (parameter * evalLength + userParameter) / (evalLength + 1);
  console.log(parameter * evalLength);
  console.log("userParameter =", userParameter);
  console.log(avg, parameter, evalLength, userParameter);
  return avg;

}
