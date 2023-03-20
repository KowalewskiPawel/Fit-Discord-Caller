import { Router } from "express";
import {
  authorizeUser,
  getActiveMinutes,
  getOathUrl,
  getSteps,
  sendDiscord,
} from "../controllers";

export const fitRouter = Router();

fitRouter
  .get("/getURL", getOathUrl)
  .get("/authorizeUser", authorizeUser)
  .get("/getActiveMinutes", getActiveMinutes)
  .get("/getSteps", getSteps)
  .post("/sendDiscord", sendDiscord);
