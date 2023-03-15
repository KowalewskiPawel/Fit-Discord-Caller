import express from "express";
import dotenv from 'dotenv';
import fetch from "node-fetch";
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

    const url = oauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: JSON.stringify({
            callbackUrl: req.body.callbackUrl,
            userID: req.body.userid
        })
    });

    try {
        const response = await fetch(url);
        const body = await response.text();
        console.log(body);

        res.send({ url });
    } catch (error) {
        console.error(error);

        res.send({ error });
    }

});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});