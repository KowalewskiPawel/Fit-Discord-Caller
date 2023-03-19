import fetch from "node-fetch";
import { generateFitBody, getAccessCode } from ".";
import { GOOGLE_FIT_API } from "../consts";
import { FIT_TYPE } from "../types";

export const fetchFitApi = async (activityType: FIT_TYPE) => {
  try {
    const accessToken = getAccessCode();

    const fetchBody = generateFitBody(activityType);

    const response = await fetch(GOOGLE_FIT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(fetchBody),
    });

    const activityResponse = await response.json();

    const responseValue =
      activityResponse.bucket[0].dataset[0].point[0].value[0].intVal;

    return responseValue;
  } catch (err) {
    throw Error(err as string);
  }
};
