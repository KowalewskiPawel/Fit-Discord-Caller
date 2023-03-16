import express from "express";
import dotenv from 'dotenv';
import fetch from "node-fetch";
import url from 'node:url';
import { google } from "googleapis";
import { ONE_DAY_MILLIS, ONE_HOUR_MILLIS } from "./consts";
import { getAccessCode, writeAccessCode } from "./utils/fs";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3008;

const oauthClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

app.get('/api/getURL', async (req, res) => {
    

    const scopes = ['https://www.googleapis.com/auth/fitness.activity.read'];

    const googleAuthUrl = oauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
        res.send({ googleAuthUrl });
});

app.get('/api/activity', async (req, res) => {

  try {
    const queryURL = url.parse(req.url);

    const nowHours = new Date(Date.now()).getHours();

    const urlParams = new URLSearchParams(queryURL.query as string);

    const [code] = urlParams.values();

    const authToken = await oauthClient.getToken(code);

    const { access_token } = authToken.tokens;

    writeAccessCode(access_token as string);

    res.send("OK");

  } catch (err) {
    console.error(err);
    res.send({ error: err });
  }
 }); 

 app.get('/api/getActiveMinutes', async (req, res) => {

  const nowHours = new Date(Date.now()).getHours();

  const accessToken = getAccessCode();

  const data = {
      "aggregateBy": [{
        "dataTypeName": "com.google.active_minutes",
        "dataSourceId": "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes"
      }],
      "bucketByTime": { "durationMillis": ONE_DAY_MILLIS },
      "startTimeMillis": Date.now() - (nowHours * ONE_HOUR_MILLIS),
      "endTimeMillis": Date.now()
    };

  try {
      const response = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(data),
        });
        
        const activityResponse = await response.json();

        res.send({ activeMinutes: activityResponse.bucket[0].dataset[0].point[0].value[0].intVal });

  } catch (err) {
      console.error(err);
      res.send({ error: err });
  }
});

app.get('/api/getSteps', async (req, res) => {

  const nowHours = new Date(Date.now()).getHours();

  const accessToken = getAccessCode();

  const data = {
      "aggregateBy": [{
        "dataTypeName": "com.google.step_count.delta",
        "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
      }],
      "bucketByTime": { "durationMillis": ONE_DAY_MILLIS },
      "startTimeMillis": Date.now() - (nowHours * ONE_HOUR_MILLIS),
      "endTimeMillis": Date.now()
    };

  try {
      const response = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(data),
        });
        
        const activityResponse = await response.json();

        res.send({ steps: activityResponse.bucket[0].dataset[0].point[0].value[0].intVal });

  } catch (err) {
      console.error(err);
      res.send({ error: err });
  }
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});