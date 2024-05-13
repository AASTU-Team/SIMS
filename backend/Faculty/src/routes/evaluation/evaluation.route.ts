import express from "express";
import { createEvaluation } from "./evaluation.controller";

const Evaluationrouter = express.Router();

Evaluationrouter.post("/", createEvaluation);

module.exports = Evaluationrouter;
