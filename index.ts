import express from "express";
import dotenv from 'dotenv';
import { fitRouter } from "./routes";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3008;

app.use('/api/fit', fitRouter);

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});