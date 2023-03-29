import fetch from "node-fetch";
import { getAccessToken } from "../controllers";
import { sendDiscordMessage } from "../discord";
import { FIT_TYPE } from "../types";
import { fetchFitApi } from "./fetchFitApi";
import { getFitGoal, writeFitGoal } from "./fs";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "",
});
const openai = new OpenAIApi(configuration);

export const sendFitUpdate = async () => {
  try {
    const isGoalAchieved = getFitGoal();

    if (isGoalAchieved) {
      return;
    }

    const accessToken = (await getAccessToken()) as string;

    const stepsResponse = await fetchFitApi(FIT_TYPE.STEPS, accessToken);
    const activeMinutes = await fetchFitApi(FIT_TYPE.ACTIVITY, accessToken);

    if (stepsResponse > 4000 || activeMinutes > 20) {
      const user = "Pawel#1022";

      const activityBody = {
        methodName: "addActivity",
        args: [user, `${activeMinutes} mins ${stepsResponse} steps`, `${new Date(Date.now()).toLocaleDateString()}`],
      };

      const activityId = await fetch(
        "http://localhost:3000/api/contract/write",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(activityBody),
        }
      );

      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt:
          "Pogratuluj użytkownikowi za dyscyplinę i daj jakiś krótki tekst motywacyjny aby dalej ćwiczył.",
        max_tokens: 256,
        temperature: 0.7,
      });

      

      const openResult = completion.data.choices[0].text as string;

      const { transactionId } = await activityId.json();

      const txBody = {
        txId: transactionId
      };

      const txUrl = await fetch(
        "http://localhost:3000/api/contract/txUrl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(txBody),
        }
      );

      const { transactionBlockUrl } = await txUrl.json();

      sendDiscordMessage(activeMinutes, stepsResponse, transactionBlockUrl, openResult);
      writeFitGoal(true);
    }
  } catch (err) {
    console.log(err);
  }
};
