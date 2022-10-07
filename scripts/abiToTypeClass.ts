import thanksPaySecurityABI from "../abis/ThanksSecurity.json";
import thanksPayDataABI from "../abis/ThanksData.json";
import thanksPayMainABI from "../abis/ThanksPayMain.json";
import thanksPayRelayABI from "../abis/ThanksPayRelay.json";
import thanksPayCheckABI from "../abis/ThanksPayCheck.json";

import oldThanksABI from "../abis/oldThanks.json";

import * as fs from "fs";
import path from 'path';

const typeTranslate = (type: string) => {
  //check if type has prefix "uint":
  if (type.startsWith("uint")) {
    //check if it ends with []
    if (type.endsWith("[]")) {
      return "bigint[]";
    } else {
      return "bigint";
    }
  }
  if (type.startsWith("bool")) {
    if (type.endsWith("[]")) {
      return "boolean[]";
    } else {
      return "boolean";
    }
  }
  if (type.startsWith("address")) {
    if (type.endsWith("[]")) {
      return "string[]";
    } else {
      return "string";
    }
  }
  if (type.startsWith("bytes")) {
    if (type.endsWith("[]")) {
      return "string[]";
    } else {
      return "string";
    }
  }

  if (type.startsWith("tuple")) {
    if (type.endsWith("[]")) {
      return "string[]";
    } else {
      return "string";
    }
  }
  return type;
};

const merge = (obj1: any, obj2: any) => {
  for (let i = 0; i < obj1.inputTypes.length; ++i) {
    let name1 = obj1.inputNames[i];
    let match: boolean = false;
    for (let j = 0; j < obj2.inputNames.length; ++j) {
      let name2 = obj2.inputNames[j];
      //check if string name1 is in string name2 or name2 is in name1
      if (name1.includes(name2) || name2.includes(name1)) {
        match = true;
        break;
      }
    }
    if (!match) {
      // add to obj2
      obj2.inputNames.push(name1 + "?");
      obj2.inputTypes.push(obj1.inputTypes[i]);
    }
  }
  return obj2;
};

const getSchema = (abi: any) => {
  // filter abi where "type" is "function"
  const functions = abi.filter((row: any) => row["type"] === "function");

  // make an array where key is functions['name']
  const arrayOfFunctions = functions.map((func: any) => {
    //func["name"] = func["name"].charAt(0).toUpperCase() + func["name"].slice(1);
    return {
      name: func["name"],
      inputTypes: func["inputs"].map((input: any) => input["type"]),
      inputNames: func["inputs"].map((input: any) => input["name"]),
    };
  });
  for (let i = 0; i < arrayOfFunctions.length; i++) {
    while (
      i + 1 < arrayOfFunctions.length &&
      arrayOfFunctions[i].name === arrayOfFunctions[i + 1].name
    ) {
      arrayOfFunctions[i] = merge(arrayOfFunctions[i], arrayOfFunctions[i + 1]);
      arrayOfFunctions.splice(i, 1);
      i--;
    }
  }

  for (let i = 0; i < arrayOfFunctions.length; i++)
  if(arrayOfFunctions[i].inputNames.length) {
    for(let j = 0; j < arrayOfFunctions[i].inputNames.length; j++){
      while(
        j < arrayOfFunctions[i].inputNames.length &&
        arrayOfFunctions[i].inputNames[j] === ""
      ) {
        arrayOfFunctions[i].inputNames.splice(j, 1);
        arrayOfFunctions[i].inputTypes.splice(j, 1);
        j --;
      }
    }
  }
  return arrayOfFunctions;
};

async function createFileIfNotThere1(fileName: string) {
  fs.promises.readdir(path.join(__dirname, "/generatedTypes")).catch(() => {
    fs.mkdirSync(path.join(__dirname, "/generatedTypes"));
  });
  fs.promises
    .readFile(path.join(__dirname, "/generatedTypes/", fileName + ".ts"))
    .catch(() => {
      fs.writeFileSync(path.join(__dirname, "/generatedTypes/", fileName + ".ts"), "");
      console.log(`just made ${fileName}.ts`);
    });
}

async function createFileIfNotThere2(dir: string, fileName: string) {
  fs.promises.readdir(path.join(__dirname, dir)).catch(() => {
    fs.mkdirSync(path.join(__dirname, dir));
  });
  fs.promises
    .readFile(path.join(__dirname, dir, fileName + ".ts"))
    .catch(() => {
      fs.writeFileSync(path.join(__dirname, dir, fileName + ".ts"), "");
      console.log(`just made ${fileName}.ts`);
    });
}

async function generateTyping(fileName: string, schema: any) {
  let typing = "";
  for (let i = 0; i < schema.length; i++) {
    const func = schema[i];
    const funcName = func.name;
    const inputTypes = func.inputTypes;
    const inputNames = func.inputNames;
    typing += `type ${funcName.charAt(0).toUpperCase() + funcName.slice(1)}Type = {`;
    for (let j = 0; j < inputTypes.length; j++) {
      const inputType = inputTypes[j];
      const inputName = inputNames[j];
      typing += `
  ${inputName}: ${typeTranslate(inputType)},`;
    }
    typing += `
}
`;
  }
  //console.log(typing);
  typing += `
export type ${fileName} = {`
  for (let i = 0; i < schema.length; i++) {
    const func = schema[i];
    const funcName = func.name;
    typing += `
  ${funcName}: ${funcName.charAt(0).toUpperCase() + funcName.slice(1)}Type,`;
  }
  typing += `
}`
  fs.writeFileSync(path.join(__dirname, "/generatedTypes/", fileName + ".ts"), typing);
}

async function generateSuperClass() {
  let classStr = 
`
import { Contract } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
export type SignerOrProvider = Provider | Signer | undefined;

import thanksPaySecurityABI from "../../abis/ThanksSecurity.json";
import thanksPayDataABI from "../../abis/ThanksData.json";
import thanksPayMainABI from "../../abis/ThanksPayMain.json";
import thanksPayRelayABI from "../../abis/ThanksPayRelay.json";
import thanksPayCheckABI from "../../abis/ThanksPayCheck.json";

import { ThanksPayRelayType } from "../generatedTypes/ThanksPayRelayType";
import { ThanksPayDataType } from "../generatedTypes/ThanksPayDataType";
import { ThanksPayCheckType } from "../generatedTypes/ThanksPayCheckType";
import { ThanksPayMainType } from "../generatedTypes/ThanksPayMainType";
import { ThanksPaySecurityType } from "../generatedTypes/ThanksPaySecurityType";
import { ThanksPaySuperType } from "../generatedTypes/ThanksPaySuperType";

import contractAddresses from '../contractAddresses.json';
const Web3 = require('web3');
const web3 = new Web3();
import * as fs from 'fs';

export type ContractABIType = any;

// this will be changed with env variable
const THANKS_PAY_MAIN_ADDR = contractAddresses["ganache"]["THANKS_PAY_MAIN_ADDR"];
const THANKS_PAY_DATA_ADDR = contractAddresses["ganache"]["THANKS_PAY_DATA_ADDR"];
const THANKS_PAY_SECURITY_ADDR = contractAddresses["ganache"]["THANKS_PAY_SECURITY_ADDR"];
const THANKS_PAY_RELAY_ADDR = contractAddresses["ganache"]["THANKS_PAY_RELAY_ADDR"];
const THANKS_PAY_CHECK_ADDR = contractAddresses["ganache"]["THANKS_PAY_CHECK_ADDR"];

const getSchema = (abi: ContractABIType) => {
  
  // filter abi where "type" is "function"
  const functions = abi.filter((row: any) => row["type"] === "function");

  // make an array where key is functions['name']
  const arrayOfFunctions = functions.map((func: any) => {
    const funcName = func["name"];
    return {
      name: func["name"],
      inputTypes: func["inputs"].map((input: any) => input["type"]),
      inputNames: func["inputs"].map((input: any) => input["name"]),
    };
  });

  return arrayOfFunctions;
};

const getEvents = (abi: ContractABIType) => {
  
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

const getRequiredTypeOrder = (functionName: string, schema: any) => {
  const func = schema.find((row: any) => row.name === functionName);
  if (func) {
    return func.inputTypes;
  }
  return [];
};

export class ThanksPayContracts extends Contract {
  public schema: any;
  public events: any;
  public getEventTypesArray(eventName: string) {
    const event = this.events.find((row: any) => row.name === eventName);
    if (event) {
      return event.typesArray;
    }
    return [];
  }

  public getRequiredOrder = (functionName: string) => {
    const func = this.schema.find((row: any) => row.name === functionName);
    if (func) {
      return func.inputNames;
    }
    return [];
  };

  public getEventObj = (receipt: any) => {
    if(!receipt.events[0].event) {
      return {};
    }
    const typesArray = this.getEventTypesArray(receipt.events[0].event);
    const decodedParameters = web3.eth.abi.decodeParameters(typesArray, receipt.events[0].data);
    let obj:any = {};
    for (let i = 0; i < typesArray.length; i++) {
      obj[typesArray[i].name] = decodedParameters[typesArray[i].name];
    }
    return {
      decodedParameters, 
      obj
    }
  }
  constructor(
    signerOrProvider: SignerOrProvider,
    contractAddr: string,
    abi: ContractABIType
  ) {
    super(contractAddr, abi, signerOrProvider);
    this.schema = getSchema(abi);
    this.events = getEvents(abi);
  }
  public sendTx = async (name: string, args: any): Promise<any> => {
    try {
      const order = this.getRequiredOrder(name);
      const orderedArgs = order.map((item: string) => {
        return (args as any)[item];
      });
      if ("payableAmt" in args) {
        orderedArgs.push(args.payableAmt);
      }
      // console.log(
      //   "in contractType.ts sendTx: orderedArg is: ",
      //   orderedArgs,
      //   " method: ",
      //   name
      // );
      const tx = await this[name](...orderedArgs);
      const txReceipt = await tx.wait();
      return txReceipt;
    } catch (e: any) {
      //console.log("error is: ", e); // change to alert
      // if (e.data && e.data.message) {
      //   alert(e.data.message);
      // }
      console.log(name, " failed to deliver")
      return -1;
    }
  };
}
`;
// for thanksPayMain:
classStr += 
`
export class ThanksPayMain extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_MAIN_ADDR, thanksPayMainABI);
  }
  public method = {
`; 

  const schema = getSchema(thanksPayMainABI);
  for(let i = 0; i < schema.length; i++) {
    const funcName = schema[i].name;
    classStr+= 
`
    ${funcName}: async (args: ThanksPaySuperType["thanksPayMain"]["${funcName}"]):Promise<any> => {
      const receipt = await this.sendTx("${funcName}", args);
      return receipt;
    },
` 
  }
  classStr += 
`
  }
}
`;
// for thanksPayData:
  classStr +=
`
export class ThanksPayData extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_DATA_ADDR, thanksPayDataABI);
  }
  public method = {
`;
  const schema2 = getSchema(thanksPayDataABI);
  for(let i = 0; i < schema2.length; i++) {
    const funcName = schema2[i].name;
    classStr+=
`
    ${funcName}: async (args: ThanksPaySuperType["thanksPayData"]["${funcName}"]):Promise<any> => {
      const receipt = await this.sendTx("${funcName}", args);
      return receipt;
    },
`
  }
  classStr +=
`
  }
}
`;
// for ThanksPaySecurity:
  classStr +=
`
export class ThanksPaySecurity extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_SECURITY_ADDR, thanksPaySecurityABI);
  }
  public method = {
`;
  const schema3 = getSchema(thanksPaySecurityABI);
  for(let i = 0; i < schema3.length; i++) {
    const funcName = schema3[i].name;
    classStr+=
`
    ${funcName}: async (args: ThanksPaySuperType["thanksPaySecurity"]["${funcName}"]):Promise<any> => {
      const receipt = await this.sendTx("${funcName}", args);
      return receipt;
    },
`
  }
  classStr +=
`
  }
}
`;
// for ThanksPayRelay:
  classStr +=
`
export class ThanksPayRelay extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_RELAY_ADDR, thanksPayRelayABI);
  }
  public method = {
`;
  const schema4 = getSchema(thanksPayRelayABI);
  for(let i = 0; i < schema4.length; i++) {
    const funcName = schema4[i].name;
    classStr+=
`
    ${funcName}: async (args: ThanksPaySuperType["thanksPayRelay"]["${funcName}"]):Promise<any> => {
      const receipt = await this.sendTx("${funcName}", args);
      return receipt;
    },
`
  }
  classStr +=
`
  }
}
`;

// For thanksPayCheck:
  classStr +=
`
export class ThanksPayCheck extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_CHECK_ADDR, thanksPayCheckABI);
  }
  public method = {
`;
  const schema5 = getSchema(thanksPayCheckABI);
  for(let i = 0; i < schema5.length; i++) {
    const funcName = schema5[i].name;
    classStr+=
`
    ${funcName}: async (args: ThanksPaySuperType["thanksPayCheck"]["${funcName}"]):Promise<any> => {
      const receipt = await this.sendTx("${funcName}", args);
      return receipt;
    },
`
  }
  classStr +=
`
  }
}
`;

// for oldThanks
  classStr +=
`
export class OldThanks extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, OLD_THANKS_ADDR, oldThanksABI);
  }
  public method = {
`;
  const schema6 = getSchema(oldThanksABI);
  for(let i = 0; i < schema6.length; i++) {
    const funcName = schema6[i].name;
    classStr+=
`
    ${funcName}: async (args: ThanksPaySuperType["oldThanks"]["${funcName}"]):Promise<any> => {
      const receipt = await this.sendTx("${funcName}", args);
      return receipt;
    },
`
  }
  classStr +=
`
  }
}
`;

  fs.writeFileSync(path.join(__dirname, "/generatedClasses/ThanksPayContracts.ts"), classStr);
}

async function generateChildClass(fileName: string, schema: any) {
  let classStr = `
  import { Contract } from "@ethersproject/contracts";
  import { Provider } from "@ethersproject/providers";
  import { Signer } from "@ethersproject/abstract-signer";
  export type SignerOrProvider = Provider | Signer | undefined;

  export class ${fileName} extends ThanksPayContracts {;
    constructor(signerOrProvider: SignerOrProvider) {
      super(signerOrProvider);
    }
  }
`
}

async function main() {
  const thanksPaySecuritySchema = getSchema(thanksPaySecurityABI);
  const thanksPayDataSchema = getSchema(thanksPayDataABI);
  const thanksPayMainSchema = getSchema(thanksPayMainABI);
  const thanksPayRelaySchema = getSchema(thanksPayRelayABI);
  const thanksPayCheckSchema = getSchema(thanksPayCheckABI);
  const oldThanksSchema = getSchema(oldThanksABI);
  await createFileIfNotThere1("ThanksPaySecurityType");
  await createFileIfNotThere1("ThanksPayDataType");
  await createFileIfNotThere1("ThanksPayMainType");
  await createFileIfNotThere1("ThanksPayRelayType");
  await createFileIfNotThere1("ThanksPayCheckType");
  await createFileIfNotThere1("ThanksPaySuperType");
  await createFileIfNotThere1("oldThanksType");

  // await createFileIfNotThere2("/generatedClasses/", "ThanksPaySecurity");
  // await createFileIfNotThere2("/generatedClasses/", "ThanksPayData");
  // await createFileIfNotThere2("/generatedClasses/", "ThanksPayMain");
  // await createFileIfNotThere2("/generatedClasses/", "ThanksPayRelay");
  // await createFileIfNotThere2("/generatedClasses/", "ThanksPayCheck");
  await createFileIfNotThere2("/generatedClasses/", "ThanksPayContracts");

  await generateSuperClass();

  await generateTyping("ThanksPaySecurityType", thanksPaySecuritySchema);
  await generateTyping("ThanksPayDataType", thanksPayDataSchema);
  await generateTyping("ThanksPayMainType", thanksPayMainSchema);
  await generateTyping("ThanksPayRelayType", thanksPayRelaySchema);
  await generateTyping("ThanksPayCheckType", thanksPayCheckSchema);
  await generateTyping("oldThanksType", oldThanksSchema);

  let superType = `
import { ThanksPaySecurityType } from "./ThanksPaySecurityType";
import { ThanksPayDataType } from "./ThanksPayDataType";
import { ThanksPayMainType } from "./ThanksPayMainType";
import { ThanksPayRelayType } from "./ThanksPayRelayType";
import { ThanksPayCheckType } from "./ThanksPayCheckType";
import { oldThanksType } from "./oldThanksType";

export type ThanksPaySuperType = {
  thanksPaySecurity: ThanksPaySecurityType,
  thanksPayData: ThanksPayDataType,
  thanksPayMain: ThanksPayMainType,
  thanksPayRelay: ThanksPayRelayType,
  thanksPayCheck: ThanksPayCheckType,
  oldThanks: oldThanksType,
};`;
  fs.writeFileSync(path.join(__dirname, "/generatedTypes/ThanksPaySuperType.ts"), superType);

}

main().then(() => {
  console.log("");
});
