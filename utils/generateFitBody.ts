import { ONE_DAY_MILLIS, ONE_HOUR_MILLIS } from "../consts";
import {
  DATA_SOURCE_ID_ACTIVITY,
  DATA_SOURCE_ID_STEPS,
  DATA_TYPE_ACTIVITY,
  DATA_TYPE_STEPS,
} from "../consts/googleFit";
import { FIT_TYPE } from "../types";

export const generateFitBody = (activityType: FIT_TYPE) => {
  const nowHours = new Date(Date.now()).getHours();

  const fetchBody = {
    aggregateBy: [
      {
        dataTypeName:
          activityType === FIT_TYPE.ACTIVITY
            ? DATA_TYPE_ACTIVITY
            : DATA_TYPE_STEPS,
        dataSourceId:
          activityType === FIT_TYPE.ACTIVITY
            ? DATA_SOURCE_ID_ACTIVITY
            : DATA_SOURCE_ID_STEPS
      },
    ],
    bucketByTime: { durationMillis: ONE_DAY_MILLIS },
    startTimeMillis: Date.now() - nowHours * ONE_HOUR_MILLIS,
    endTimeMillis: Date.now(),
  };

  return fetchBody;
};
