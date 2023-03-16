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