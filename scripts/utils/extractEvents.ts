import thanksSecurityABI from "../abis/ThanksSecurity.json";
import thanksPayDataABI from "../abis/ThanksData.json";
import thanksPayMainABI from "../abis/ThanksPayMain.json";
import thanksPayRelayABI from "../abis/ThanksPayRelay.json";
import thanksPayCheckABI from "../abis/ThanksPayCheck.json";

import * as fs from "fs";

const getEvents = (abi: any) => {
    // filter abi where "type" is "type"
    const events = abi.filter((row: any) => row["type"] === "event");
    const arrayOfEvents = events.map((event: any) => {
      return {
        tableName: event["name"],
        fields: event["inputs"].map((input: any) => {
          return {
            type: input["type"],
            name: input["name"]
          }
        }),
      };
    });
    fs.appendFileSync("events.json", JSON.stringify(arrayOfEvents, null, 2));
    console.log(JSON.stringify(arrayOfEvents, null, 2))
    return arrayOfEvents;
  }

//getEvents of all ABIs
getEvents(thanksSecurityABI);
getEvents(thanksPayDataABI);
getEvents(thanksPayMainABI);
getEvents(thanksPayRelayABI);
getEvents(thanksPayCheckABI);

