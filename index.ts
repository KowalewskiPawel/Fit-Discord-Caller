import express from "express";
import dotenv from "dotenv";
import cron from "node-cron";
import { fitRouter } from "./routes";
import { client, token } from "./discord/discordClient";
import { sendFitUpdate, writeFitGoal } from "./utils";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3008;

app.use("/api/fit", fitRouter);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
  client.login(token);
  writeFitGoal(false);
});

cron.schedule("* * * * *", () => {
 sendFitUpdate();
});
