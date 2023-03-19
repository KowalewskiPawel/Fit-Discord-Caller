import { Router } from "express";
import {
  authorizeUser,
  getActiveMinutes,
  getOathUrl,
  getSteps,
} from "../controllers";

export const fitRouter = Router();

fitRouter
  .get("/getURL", getOathUrl)
  .get("/authorizeUser", authorizeUser)
  .get("/getActiveMinutes", getActiveMinutes)
  .get("/getSteps", getSteps);
