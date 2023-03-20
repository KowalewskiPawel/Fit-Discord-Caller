import { sendDiscordMessage } from "../discord";
import { FIT_TYPE } from "../types";
import { fetchFitApi } from "./fetchFitApi";
import { getFitGoal, writeFitGoal } from "./fs";

export const sendFitUpdate = async () => {
  const isGoalAchieved = getFitGoal();

  if (isGoalAchieved) {
    return;
  }
  const stepsResponse = await fetchFitApi(FIT_TYPE.STEPS);
  const activeMinutes = await fetchFitApi(FIT_TYPE.ACTIVITY);

  if (stepsResponse > 80 || activeMinutes > 2) {
    sendDiscordMessage(activeMinutes, stepsResponse);
    writeFitGoal(true);
  }
};
