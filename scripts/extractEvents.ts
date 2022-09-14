import thanksSecurityABI from "../abis/ThanksSecurity.json";
import thanksPayDataABI from "../abis/ThanksData.json";
import thanksPayMainABI from "../abis/ThanksPayMain.json";
import thanksPayRelayABI from "../abis/ThanksPayRelay.json";
import thanksPayCheckABI from "../abis/ThanksPayCheck.json";

const getEvents = (abi: any) => {
    // filter abi where "type" is "type"
    const events = abi.filter((row: any) => row["type"] === "event");
    const arrayOfEvents = events.map((event: any) => {
      return {
        name: event["name"],
        typesArray: event["inputs"].map((input: any) => {
          return {
            type: input["type"],
            name: input["name"]
          }
        }),
        inputTypes: event["inputs"].map((input: any) => input["type"]),
        inputNames: event["inputs"].map((input: any) => input["name"]),
      };
    });
  
    return arrayOfEvents;
  }