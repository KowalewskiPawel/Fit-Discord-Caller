import express from "express";
import dotenv from 'dotenv';
import fetch from "node-fetch";
import url from 'node:url';
import { google } from "googleapis";

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
    const queryURL = url.parse(req.url);

    const urlParams = new URLSearchParams(queryURL.query as string);

    const [code] = urlParams.values();

    const authToken = await oauthClient.getToken(code);

    const { access_token } = authToken.tokens;

    console.log(access_token);

    const data = {
        "aggregateBy": [{
          "dataTypeName": "com.google.active_minutes",
          "dataSourceId": "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes"
        }],
        "bucketByTime": { "durationMillis": 86400000 },
        "startTimeMillis": 1678406400000,
        "endTimeMillis":1678579200000
      };

    try {
        const response = await fetch("https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${access_token}`
            },
            body: JSON.stringify(data),
          });
          
          const activityResponse = await response.json();

          res.send({ activityResponse });

    } catch (err) {
        console.error(err);
        res.send({ error: err });
    }
 }); 

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});