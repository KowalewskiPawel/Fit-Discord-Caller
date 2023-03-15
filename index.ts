import express from "express";
import dotenv from 'dotenv';
import { google } from "googleapis";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3008;

app.get('/api/getURL', (req, res) => {
    const oauthClient = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    )
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});