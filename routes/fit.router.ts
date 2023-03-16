import { Router } from "express";
import {
  authorizeUser,
  getActiveMinutes,
  getOathUrl,
  getSteps,
} from "../controllers";

export const fitRouter = Router();

fitRouter.get("/getURL", getOathUrl);
fitRouter.get("/authorizeUser", authorizeUser);
fitRouter.get("/getActiveMinutes", getActiveMinutes);
fitRouter.get("/getSteps", getSteps);
