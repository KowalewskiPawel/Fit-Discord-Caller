import { sendDiscordMessage } from "../discord";
import { FIT_TYPE } from "../types";
import { fetchFitApi } from "./fetchFitApi";

export const sendFitUpdate = async () => {
  const stepsResponse = await fetchFitApi(FIT_TYPE.STEPS);

  if (stepsResponse > 80) {
    sendDiscordMessage(0, stepsResponse);
  }
};
