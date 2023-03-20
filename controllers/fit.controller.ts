import { parse as parseUrl } from "node:url";
import { Request, Response } from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import { writeAccessCode } from "../utils";
import { FIT_TYPE } from "../types";
import { fetchFitApi } from "../utils/fetchFitApi";
import { sendDiscordMessage } from "../discord/discordClient";

dotenv.config();

const oauthClient = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

export const getAccessToken = async () => {
  const { token } = await oauthClient.getAccessToken();
  return token;
}

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

    const { tokens } = await oauthClient.getToken(code);

    oauthClient.setCredentials(tokens);

    const { access_token } = tokens;

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
    const accessToken = await getAccessToken() as string;

    const activityResponse = await fetchFitApi(FIT_TYPE.ACTIVITY, accessToken);

    return res.status(200).json({
      activeMinutes: activityResponse,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

export const getSteps = async (_req: Request, res: Response) => {
  try {
    const accessToken = await getAccessToken() as string;
    const activityResponse = await fetchFitApi(FIT_TYPE.STEPS, accessToken);

    return res.status(200).json({
      steps: activityResponse,
    });
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};

export const sendDiscord = async (_req: Request, res: Response) => {
  try {

    const accessToken = await getAccessToken() as string;

    const activityResponse = await fetchFitApi(FIT_TYPE.ACTIVITY, accessToken);
    const stepsResponse = await fetchFitApi(FIT_TYPE.STEPS, accessToken);

    sendDiscordMessage(activityResponse, stepsResponse);

    return res.status(200).send("OK");
  } catch (err) {
    return res.status(500).json({
      error: err,
    });
  }
};
