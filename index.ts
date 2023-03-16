import express from "express";
import dotenv from 'dotenv';
import fetch from "node-fetch";
import url from 'node:url';
import { google } from "googleapis";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3008;

app.get('/api/getURL', async (req, res) => {
    const oauthClient = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );

    const scopes = ['https://www.googleapis.com/auth/fitness.activity.read profile email openid'];

    const googleAuthUrl = oauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
        res.send({ googleAuthUrl });
});

app.get('/api/activity', (req, res) => {
    const queryURL = url.parse(req.url);

    const urlParams = new URLSearchParams(queryURL.query as string);

    const [code] = urlParams.values();

    res.send("OK!");
 }); 

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});