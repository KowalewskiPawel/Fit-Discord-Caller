
import { parse as parseUrl } from "node:url";
import { Request, Response } from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import { writeAccessCode } from "../utils";
import { FIT_TYPE } from "../types";
import { fetchFitApi } from "../utils/fetchFitApi";

dotenv.config();

const oauthClient = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export const getOathUrl = async (_req: Request, res: Response) => {
  try {
    const scopes = ["https://www.googleapis.com/auth/fitness.activity.read"];

    const googleAuthUrl = oauthClient.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });

    return res.status(200).json({ googleAuthUrl });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

export const authorizeUser = async (req: Request, res: Response) => {
  try {
    const queryURL = parseUrl(req.url);
    const urlParams = new URLSearchParams(queryURL.query as string);
    const [code] = urlParams.values();

    const authToken = await oauthClient.getToken(code);
    const { access_token } = authToken.tokens;

    writeAccessCode(access_token as string);

    return res.status(200).send("User authorized!");
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

export const getActiveMinutes = async (_req: Request, res: Response) => {
  try {
    const activityResponse = await fetchFitApi(FIT_TYPE.ACTIVITY);

    return res.status(200).json({
      activeMinutes:
        activityResponse
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

export const getSteps = async (_req: Request, res: Response) => {
  try {
    const activityResponse = await fetchFitApi(FIT_TYPE.STEPS);

    return res.status(200).json({
      steps: activityResponse
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};
