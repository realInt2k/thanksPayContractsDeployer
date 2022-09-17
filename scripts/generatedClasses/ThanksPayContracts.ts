
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
const THANKS_PAY_MAIN_ADDR = contractAddresses["THANKS_PAY_MAIN_ADDR"];
const THANKS_PAY_DATA_ADDR = contractAddresses["THANKS_PAY_DATA_ADDR"];
const THANKS_PAY_SECURITY_ADDR = contractAddresses["THANKS_PAY_SECURITY_ADDR"];
const THANKS_PAY_RELAY_ADDR = contractAddresses["THANKS_PAY_RELAY_ADDR"];
const THANKS_PAY_CHECK_ADDR = contractAddresses["THANKS_PAY_CHECK_ADDR"];

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

export class ThanksPayMain extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_MAIN_ADDR, thanksPayMainABI);
  }
  public method = {

    PartnerAddBalance: async (args: ThanksPaySuperType["thanksPayMain"]["PartnerAddBalance"]):Promise<any> => {
      const receipt = await this.sendTx("PartnerAddBalance", args);
      return receipt;
    },

    PartnerAddBonus: async (args: ThanksPaySuperType["thanksPayMain"]["PartnerAddBonus"]):Promise<any> => {
      const receipt = await this.sendTx("PartnerAddBonus", args);
      return receipt;
    },

    PartnerWithdraw: async (args: ThanksPaySuperType["thanksPayMain"]["PartnerWithdraw"]):Promise<any> => {
      const receipt = await this.sendTx("PartnerWithdraw", args);
      return receipt;
    },

    RevertCheck: async (args: ThanksPaySuperType["thanksPayMain"]["RevertCheck"]):Promise<any> => {
      const receipt = await this.sendTx("RevertCheck", args);
      return receipt;
    },

    SetLatestWagePay: async (args: ThanksPaySuperType["thanksPayMain"]["SetLatestWagePay"]):Promise<any> => {
      const receipt = await this.sendTx("SetLatestWagePay", args);
      return receipt;
    },

    SubtractFromPartner: async (args: ThanksPaySuperType["thanksPayMain"]["SubtractFromPartner"]):Promise<any> => {
      const receipt = await this.sendTx("SubtractFromPartner", args);
      return receipt;
    },

    WorkerGetsThanksPay: async (args: ThanksPaySuperType["thanksPayMain"]["WorkerGetsThanksPay"]):Promise<any> => {
      const receipt = await this.sendTx("WorkerGetsThanksPay", args);
      return receipt;
    },

  }
}

export class ThanksPayData extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_DATA_ADDR, thanksPayDataABI);
  }
  public method = {

    GetPartner: async (args: ThanksPaySuperType["thanksPayData"]["GetPartner"]):Promise<any> => {
      const receipt = await this.sendTx("GetPartner", args);
      return receipt;
    },

    GetPartnerThanksPayableBalance: async (args: ThanksPaySuperType["thanksPayData"]["GetPartnerThanksPayableBalance"]):Promise<any> => {
      const receipt = await this.sendTx("GetPartnerThanksPayableBalance", args);
      return receipt;
    },

    GetPartnerWithdrawableBalance: async (args: ThanksPaySuperType["thanksPayData"]["GetPartnerWithdrawableBalance"]):Promise<any> => {
      const receipt = await this.sendTx("GetPartnerWithdrawableBalance", args);
      return receipt;
    },

    GetWorker: async (args: ThanksPaySuperType["thanksPayData"]["GetWorker"]):Promise<any> => {
      const receipt = await this.sendTx("GetWorker", args);
      return receipt;
    },

    GetWorkerBalance: async (args: ThanksPaySuperType["thanksPayData"]["GetWorkerBalance"]):Promise<any> => {
      const receipt = await this.sendTx("GetWorkerBalance", args);
      return receipt;
    },

    Partners: async (args: ThanksPaySuperType["thanksPayData"]["Partners"]):Promise<any> => {
      const receipt = await this.sendTx("Partners", args);
      return receipt;
    },

    RegisterPartner: async (args: ThanksPaySuperType["thanksPayData"]["RegisterPartner"]):Promise<any> => {
      const receipt = await this.sendTx("RegisterPartner", args);
      return receipt;
    },

    RegisterWorker: async (args: ThanksPaySuperType["thanksPayData"]["RegisterWorker"]):Promise<any> => {
      const receipt = await this.sendTx("RegisterWorker", args);
      return receipt;
    },

    SetLatestRequest: async (args: ThanksPaySuperType["thanksPayData"]["SetLatestRequest"]):Promise<any> => {
      const receipt = await this.sendTx("SetLatestRequest", args);
      return receipt;
    },

    SetLatestWagePay: async (args: ThanksPaySuperType["thanksPayData"]["SetLatestWagePay"]):Promise<any> => {
      const receipt = await this.sendTx("SetLatestWagePay", args);
      return receipt;
    },

    SetPartnerBalance: async (args: ThanksPaySuperType["thanksPayData"]["SetPartnerBalance"]):Promise<any> => {
      const receipt = await this.sendTx("SetPartnerBalance", args);
      return receipt;
    },

    SetPartnerBonus: async (args: ThanksPaySuperType["thanksPayData"]["SetPartnerBonus"]):Promise<any> => {
      const receipt = await this.sendTx("SetPartnerBonus", args);
      return receipt;
    },

    SetWorkerBalance: async (args: ThanksPaySuperType["thanksPayData"]["SetWorkerBalance"]):Promise<any> => {
      const receipt = await this.sendTx("SetWorkerBalance", args);
      return receipt;
    },

    SetWorkerPartner: async (args: ThanksPaySuperType["thanksPayData"]["SetWorkerPartner"]):Promise<any> => {
      const receipt = await this.sendTx("SetWorkerPartner", args);
      return receipt;
    },

    Types: async (args: ThanksPaySuperType["thanksPayData"]["Types"]):Promise<any> => {
      const receipt = await this.sendTx("Types", args);
      return receipt;
    },

    Workers: async (args: ThanksPaySuperType["thanksPayData"]["Workers"]):Promise<any> => {
      const receipt = await this.sendTx("Workers", args);
      return receipt;
    },

  }
}

export class ThanksPaySecurity extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_SECURITY_ADDR, thanksPaySecurityABI);
  }
  public method = {

    AUTHORIZED: async (args: ThanksPaySuperType["thanksPaySecurity"]["AUTHORIZED"]):Promise<any> => {
      const receipt = await this.sendTx("AUTHORIZED", args);
      return receipt;
    },

    DEFAULT_ADMIN_ROLE: async (args: ThanksPaySuperType["thanksPaySecurity"]["DEFAULT_ADMIN_ROLE"]):Promise<any> => {
      const receipt = await this.sendTx("DEFAULT_ADMIN_ROLE", args);
      return receipt;
    },

    Authorize: async (args: ThanksPaySuperType["thanksPaySecurity"]["Authorize"]):Promise<any> => {
      const receipt = await this.sendTx("Authorize", args);
      return receipt;
    },

    GetRoleAdmin: async (args: ThanksPaySuperType["thanksPaySecurity"]["GetRoleAdmin"]):Promise<any> => {
      const receipt = await this.sendTx("GetRoleAdmin", args);
      return receipt;
    },

    GetShit: async (args: ThanksPaySuperType["thanksPaySecurity"]["GetShit"]):Promise<any> => {
      const receipt = await this.sendTx("GetShit", args);
      return receipt;
    },

    GrantRole: async (args: ThanksPaySuperType["thanksPaySecurity"]["GrantRole"]):Promise<any> => {
      const receipt = await this.sendTx("GrantRole", args);
      return receipt;
    },

    HasRole: async (args: ThanksPaySuperType["thanksPaySecurity"]["HasRole"]):Promise<any> => {
      const receipt = await this.sendTx("HasRole", args);
      return receipt;
    },

    IsAuthorized: async (args: ThanksPaySuperType["thanksPaySecurity"]["IsAuthorized"]):Promise<any> => {
      const receipt = await this.sendTx("IsAuthorized", args);
      return receipt;
    },

    RenounceRole: async (args: ThanksPaySuperType["thanksPaySecurity"]["RenounceRole"]):Promise<any> => {
      const receipt = await this.sendTx("RenounceRole", args);
      return receipt;
    },

    RevertCheck: async (args: ThanksPaySuperType["thanksPaySecurity"]["RevertCheck"]):Promise<any> => {
      const receipt = await this.sendTx("RevertCheck", args);
      return receipt;
    },

    RevokeRole: async (args: ThanksPaySuperType["thanksPaySecurity"]["RevokeRole"]):Promise<any> => {
      const receipt = await this.sendTx("RevokeRole", args);
      return receipt;
    },

    Shit: async (args: ThanksPaySuperType["thanksPaySecurity"]["Shit"]):Promise<any> => {
      const receipt = await this.sendTx("Shit", args);
      return receipt;
    },

    SupportsInterface: async (args: ThanksPaySuperType["thanksPaySecurity"]["SupportsInterface"]):Promise<any> => {
      const receipt = await this.sendTx("SupportsInterface", args);
      return receipt;
    },

  }
}

export class ThanksPayRelay extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_RELAY_ADDR, thanksPayRelayABI);
  }
  public method = {

    AllpropertyIDs: async (args: ThanksPaySuperType["thanksPayRelay"]["AllpropertyIDs"]):Promise<any> => {
      const receipt = await this.sendTx("AllpropertyIDs", args);
      return receipt;
    },

    AlterEntityNames: async (args: ThanksPaySuperType["thanksPayRelay"]["AlterEntityNames"]):Promise<any> => {
      const receipt = await this.sendTx("AlterEntityNames", args);
      return receipt;
    },

    AlterPropertyNames: async (args: ThanksPaySuperType["thanksPayRelay"]["AlterPropertyNames"]):Promise<any> => {
      const receipt = await this.sendTx("AlterPropertyNames", args);
      return receipt;
    },

    DynamicPropertiesMap: async (args: ThanksPaySuperType["thanksPayRelay"]["DynamicPropertiesMap"]):Promise<any> => {
      const receipt = await this.sendTx("DynamicPropertiesMap", args);
      return receipt;
    },

    EntityIDs: async (args: ThanksPaySuperType["thanksPayRelay"]["EntityIDs"]):Promise<any> => {
      const receipt = await this.sendTx("EntityIDs", args);
      return receipt;
    },

    EntityNamesMap: async (args: ThanksPaySuperType["thanksPayRelay"]["EntityNamesMap"]):Promise<any> => {
      const receipt = await this.sendTx("EntityNamesMap", args);
      return receipt;
    },

    GetAllEntities: async (args: ThanksPaySuperType["thanksPayRelay"]["GetAllEntities"]):Promise<any> => {
      const receipt = await this.sendTx("GetAllEntities", args);
      return receipt;
    },

    GetAllProperties: async (args: ThanksPaySuperType["thanksPayRelay"]["GetAllProperties"]):Promise<any> => {
      const receipt = await this.sendTx("GetAllProperties", args);
      return receipt;
    },

    PropertyNamesMap: async (args: ThanksPaySuperType["thanksPayRelay"]["PropertyNamesMap"]):Promise<any> => {
      const receipt = await this.sendTx("PropertyNamesMap", args);
      return receipt;
    },

    SetDynamicProperties: async (args: ThanksPaySuperType["thanksPayRelay"]["SetDynamicProperties"]):Promise<any> => {
      const receipt = await this.sendTx("SetDynamicProperties", args);
      return receipt;
    },

    SetStaticProperties: async (args: ThanksPaySuperType["thanksPayRelay"]["SetStaticProperties"]):Promise<any> => {
      const receipt = await this.sendTx("SetStaticProperties", args);
      return receipt;
    },

  }
}

export class ThanksPayCheck extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_CHECK_ADDR, thanksPayCheckABI);
  }
  public method = {

    PartnerWithdrawCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["PartnerWithdrawCheck"]):Promise<any> => {
      const receipt = await this.sendTx("PartnerWithdrawCheck", args);
      return receipt;
    },

    RegisterPartnerCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["RegisterPartnerCheck"]):Promise<any> => {
      const receipt = await this.sendTx("RegisterPartnerCheck", args);
      return receipt;
    },

    RegisterWorkerCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["RegisterWorkerCheck"]):Promise<any> => {
      const receipt = await this.sendTx("RegisterWorkerCheck", args);
      return receipt;
    },

    SetLatestRequestCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["SetLatestRequestCheck"]):Promise<any> => {
      const receipt = await this.sendTx("SetLatestRequestCheck", args);
      return receipt;
    },

    SetLatestWagePayCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["SetLatestWagePayCheck"]):Promise<any> => {
      const receipt = await this.sendTx("SetLatestWagePayCheck", args);
      return receipt;
    },

    SetPartnerBalanceCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["SetPartnerBalanceCheck"]):Promise<any> => {
      const receipt = await this.sendTx("SetPartnerBalanceCheck", args);
      return receipt;
    },

    SetWorkerBalanceCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["SetWorkerBalanceCheck"]):Promise<any> => {
      const receipt = await this.sendTx("SetWorkerBalanceCheck", args);
      return receipt;
    },

    SetWorkerPartnerCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["SetWorkerPartnerCheck"]):Promise<any> => {
      const receipt = await this.sendTx("SetWorkerPartnerCheck", args);
      return receipt;
    },

    SubtractFromPartnerCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["SubtractFromPartnerCheck"]):Promise<any> => {
      const receipt = await this.sendTx("SubtractFromPartnerCheck", args);
      return receipt;
    },

    WorkerGetsThanksPayCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["WorkerGetsThanksPayCheck"]):Promise<any> => {
      const receipt = await this.sendTx("WorkerGetsThanksPayCheck", args);
      return receipt;
    },

  }
}
