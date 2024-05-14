import express from "express";
import {
  createEvaluation,
  fillEvaluation,
  getEvaluationByInst,
} from "./evaluation.controller";

const Evaluationrouter = express.Router();

Evaluationrouter.post("/", createEvaluation);
Evaluationrouter.post("/eval/:id", fillEvaluation);
Evaluationrouter.get("/:id", getEvaluationByInst);

module.exports = Evaluationrouter;
