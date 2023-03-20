import { getAccessToken } from "../controllers";
import { sendDiscordMessage } from "../discord";
import { FIT_TYPE } from "../types";
import { fetchFitApi } from "./fetchFitApi";
import { getFitGoal, writeFitGoal } from "./fs";

export const sendFitUpdate = async () => {
  try {
  const isGoalAchieved = getFitGoal();

  if (isGoalAchieved) {
    return;
  }

  const accessToken = await getAccessToken() as string;

  const stepsResponse = await fetchFitApi(FIT_TYPE.STEPS, accessToken);
  const activeMinutes = await fetchFitApi(FIT_TYPE.ACTIVITY, accessToken);

  if (stepsResponse > 8000 || activeMinutes > 40) {
    sendDiscordMessage(activeMinutes, stepsResponse);
    writeFitGoal(true);
  }
} catch (err) {
  console.log(err);
}
};
