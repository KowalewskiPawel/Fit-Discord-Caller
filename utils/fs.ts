import { readFileSync, writeFileSync } from "fs";

export const getAccessCode = () => {
  const accessCodeFile = readFileSync("./access_code.json");
  const { code } = JSON.parse(String(accessCodeFile));
  return code;
};

export const writeAccessCode = (accessCode: string) => {
  const accessCodeString = JSON.stringify({ code: accessCode }, null, 2);
  writeFileSync("./access_code.json", accessCodeString);
};

export const getFitGoal = () => {
  const fitGoalFile = readFileSync("./fit_goal.json");
  const { goalAchieved } = JSON.parse(String(fitGoalFile));
  return goalAchieved;
};

export const writeFitGoal = (goal: boolean) => {
  const fitGoalString = JSON.stringify({ goalAchieved:  goal}, null, 2);
  writeFileSync("./fit_goal.json", fitGoalString);
};
