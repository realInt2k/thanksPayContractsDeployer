
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

    partnerAddBalance: async (args: ThanksPaySuperType["thanksPayMain"]["partnerAddBalance"]):Promise<any> => {
      const receipt = await this.sendTx("partnerAddBalance", args);
      return receipt;
    },

    partnerAddBonus: async (args: ThanksPaySuperType["thanksPayMain"]["partnerAddBonus"]):Promise<any> => {
      const receipt = await this.sendTx("partnerAddBonus", args);
      return receipt;
    },

    partnerWithdraw: async (args: ThanksPaySuperType["thanksPayMain"]["partnerWithdraw"]):Promise<any> => {
      const receipt = await this.sendTx("partnerWithdraw", args);
      return receipt;
    },

    revertCheck: async (args: ThanksPaySuperType["thanksPayMain"]["revertCheck"]):Promise<any> => {
      const receipt = await this.sendTx("revertCheck", args);
      return receipt;
    },

    setLatestWagePay: async (args: ThanksPaySuperType["thanksPayMain"]["setLatestWagePay"]):Promise<any> => {
      const receipt = await this.sendTx("setLatestWagePay", args);
      return receipt;
    },

    subtractFromPartner: async (args: ThanksPaySuperType["thanksPayMain"]["subtractFromPartner"]):Promise<any> => {
      const receipt = await this.sendTx("subtractFromPartner", args);
      return receipt;
    },

    workerGetsThanksPay: async (args: ThanksPaySuperType["thanksPayMain"]["workerGetsThanksPay"]):Promise<any> => {
      const receipt = await this.sendTx("workerGetsThanksPay", args);
      return receipt;
    },

  }
}

export class ThanksPayData extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_DATA_ADDR, thanksPayDataABI);
  }
  public method = {

    getPartner: async (args: ThanksPaySuperType["thanksPayData"]["getPartner"]):Promise<any> => {
      const receipt = await this.sendTx("getPartner", args);
      return receipt;
    },

    getPartnerThanksPayableBalance: async (args: ThanksPaySuperType["thanksPayData"]["getPartnerThanksPayableBalance"]):Promise<any> => {
      const receipt = await this.sendTx("getPartnerThanksPayableBalance", args);
      return receipt;
    },

    getPartnerWithdrawableBalance: async (args: ThanksPaySuperType["thanksPayData"]["getPartnerWithdrawableBalance"]):Promise<any> => {
      const receipt = await this.sendTx("getPartnerWithdrawableBalance", args);
      return receipt;
    },

    getWorker: async (args: ThanksPaySuperType["thanksPayData"]["getWorker"]):Promise<any> => {
      const receipt = await this.sendTx("getWorker", args);
      return receipt;
    },

    getWorkerBalance: async (args: ThanksPaySuperType["thanksPayData"]["getWorkerBalance"]):Promise<any> => {
      const receipt = await this.sendTx("getWorkerBalance", args);
      return receipt;
    },

    partners: async (args: ThanksPaySuperType["thanksPayData"]["partners"]):Promise<any> => {
      const receipt = await this.sendTx("partners", args);
      return receipt;
    },

    registerPartner: async (args: ThanksPaySuperType["thanksPayData"]["registerPartner"]):Promise<any> => {
      const receipt = await this.sendTx("registerPartner", args);
      return receipt;
    },

    registerWorker: async (args: ThanksPaySuperType["thanksPayData"]["registerWorker"]):Promise<any> => {
      const receipt = await this.sendTx("registerWorker", args);
      return receipt;
    },

    setLatestRequest: async (args: ThanksPaySuperType["thanksPayData"]["setLatestRequest"]):Promise<any> => {
      const receipt = await this.sendTx("setLatestRequest", args);
      return receipt;
    },

    setLatestWagePay: async (args: ThanksPaySuperType["thanksPayData"]["setLatestWagePay"]):Promise<any> => {
      const receipt = await this.sendTx("setLatestWagePay", args);
      return receipt;
    },

    setPartnerBalance: async (args: ThanksPaySuperType["thanksPayData"]["setPartnerBalance"]):Promise<any> => {
      const receipt = await this.sendTx("setPartnerBalance", args);
      return receipt;
    },

    setPartnerBonus: async (args: ThanksPaySuperType["thanksPayData"]["setPartnerBonus"]):Promise<any> => {
      const receipt = await this.sendTx("setPartnerBonus", args);
      return receipt;
    },

    setWorkerBalance: async (args: ThanksPaySuperType["thanksPayData"]["setWorkerBalance"]):Promise<any> => {
      const receipt = await this.sendTx("setWorkerBalance", args);
      return receipt;
    },

    setWorkerPartner: async (args: ThanksPaySuperType["thanksPayData"]["setWorkerPartner"]):Promise<any> => {
      const receipt = await this.sendTx("setWorkerPartner", args);
      return receipt;
    },

    types: async (args: ThanksPaySuperType["thanksPayData"]["types"]):Promise<any> => {
      const receipt = await this.sendTx("types", args);
      return receipt;
    },

    workers: async (args: ThanksPaySuperType["thanksPayData"]["workers"]):Promise<any> => {
      const receipt = await this.sendTx("workers", args);
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

    authorize: async (args: ThanksPaySuperType["thanksPaySecurity"]["authorize"]):Promise<any> => {
      const receipt = await this.sendTx("authorize", args);
      return receipt;
    },

    getRoleAdmin: async (args: ThanksPaySuperType["thanksPaySecurity"]["getRoleAdmin"]):Promise<any> => {
      const receipt = await this.sendTx("getRoleAdmin", args);
      return receipt;
    },

    getShit: async (args: ThanksPaySuperType["thanksPaySecurity"]["getShit"]):Promise<any> => {
      const receipt = await this.sendTx("getShit", args);
      return receipt;
    },

    grantRole: async (args: ThanksPaySuperType["thanksPaySecurity"]["grantRole"]):Promise<any> => {
      const receipt = await this.sendTx("grantRole", args);
      return receipt;
    },

    hasRole: async (args: ThanksPaySuperType["thanksPaySecurity"]["hasRole"]):Promise<any> => {
      const receipt = await this.sendTx("hasRole", args);
      return receipt;
    },

    isAuthorized: async (args: ThanksPaySuperType["thanksPaySecurity"]["isAuthorized"]):Promise<any> => {
      const receipt = await this.sendTx("isAuthorized", args);
      return receipt;
    },

    renounceRole: async (args: ThanksPaySuperType["thanksPaySecurity"]["renounceRole"]):Promise<any> => {
      const receipt = await this.sendTx("renounceRole", args);
      return receipt;
    },

    revertCheck: async (args: ThanksPaySuperType["thanksPaySecurity"]["revertCheck"]):Promise<any> => {
      const receipt = await this.sendTx("revertCheck", args);
      return receipt;
    },

    revokeRole: async (args: ThanksPaySuperType["thanksPaySecurity"]["revokeRole"]):Promise<any> => {
      const receipt = await this.sendTx("revokeRole", args);
      return receipt;
    },

    shit: async (args: ThanksPaySuperType["thanksPaySecurity"]["shit"]):Promise<any> => {
      const receipt = await this.sendTx("shit", args);
      return receipt;
    },

    supportsInterface: async (args: ThanksPaySuperType["thanksPaySecurity"]["supportsInterface"]):Promise<any> => {
      const receipt = await this.sendTx("supportsInterface", args);
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

    alterEntityNames: async (args: ThanksPaySuperType["thanksPayRelay"]["alterEntityNames"]):Promise<any> => {
      const receipt = await this.sendTx("alterEntityNames", args);
      return receipt;
    },

    alterPropertyNames: async (args: ThanksPaySuperType["thanksPayRelay"]["alterPropertyNames"]):Promise<any> => {
      const receipt = await this.sendTx("alterPropertyNames", args);
      return receipt;
    },

    dynamicPropertiesMap: async (args: ThanksPaySuperType["thanksPayRelay"]["dynamicPropertiesMap"]):Promise<any> => {
      const receipt = await this.sendTx("dynamicPropertiesMap", args);
      return receipt;
    },

    entityIDs: async (args: ThanksPaySuperType["thanksPayRelay"]["entityIDs"]):Promise<any> => {
      const receipt = await this.sendTx("entityIDs", args);
      return receipt;
    },

    entityNamesMap: async (args: ThanksPaySuperType["thanksPayRelay"]["entityNamesMap"]):Promise<any> => {
      const receipt = await this.sendTx("entityNamesMap", args);
      return receipt;
    },

    getAllEntities: async (args: ThanksPaySuperType["thanksPayRelay"]["getAllEntities"]):Promise<any> => {
      const receipt = await this.sendTx("getAllEntities", args);
      return receipt;
    },

    getAllProperties: async (args: ThanksPaySuperType["thanksPayRelay"]["getAllProperties"]):Promise<any> => {
      const receipt = await this.sendTx("getAllProperties", args);
      return receipt;
    },

    propertyNamesMap: async (args: ThanksPaySuperType["thanksPayRelay"]["propertyNamesMap"]):Promise<any> => {
      const receipt = await this.sendTx("propertyNamesMap", args);
      return receipt;
    },

    setDynamicProperties: async (args: ThanksPaySuperType["thanksPayRelay"]["setDynamicProperties"]):Promise<any> => {
      const receipt = await this.sendTx("setDynamicProperties", args);
      return receipt;
    },

    setStaticProperties: async (args: ThanksPaySuperType["thanksPayRelay"]["setStaticProperties"]):Promise<any> => {
      const receipt = await this.sendTx("setStaticProperties", args);
      return receipt;
    },

  }
}

export class ThanksPayCheck extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_CHECK_ADDR, thanksPayCheckABI);
  }
  public method = {

    partnerAddBalanceCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["partnerAddBalanceCheck"]):Promise<any> => {
      const receipt = await this.sendTx("partnerAddBalanceCheck", args);
      return receipt;
    },

    partnerAddBonusCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["partnerAddBonusCheck"]):Promise<any> => {
      const receipt = await this.sendTx("partnerAddBonusCheck", args);
      return receipt;
    },

    partnerWithdrawCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["partnerWithdrawCheck"]):Promise<any> => {
      const receipt = await this.sendTx("partnerWithdrawCheck", args);
      return receipt;
    },

    registerPartnerCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["registerPartnerCheck"]):Promise<any> => {
      const receipt = await this.sendTx("registerPartnerCheck", args);
      return receipt;
    },

    registerWorkerCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["registerWorkerCheck"]):Promise<any> => {
      const receipt = await this.sendTx("registerWorkerCheck", args);
      return receipt;
    },

    setLatestRequestCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["setLatestRequestCheck"]):Promise<any> => {
      const receipt = await this.sendTx("setLatestRequestCheck", args);
      return receipt;
    },

    setLatestWagePayCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["setLatestWagePayCheck"]):Promise<any> => {
      const receipt = await this.sendTx("setLatestWagePayCheck", args);
      return receipt;
    },

    setPartnerBalanceCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["setPartnerBalanceCheck"]):Promise<any> => {
      const receipt = await this.sendTx("setPartnerBalanceCheck", args);
      return receipt;
    },

    setPartnerBonusCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["setPartnerBonusCheck"]):Promise<any> => {
      const receipt = await this.sendTx("setPartnerBonusCheck", args);
      return receipt;
    },

    setWorkerBalanceCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["setWorkerBalanceCheck"]):Promise<any> => {
      const receipt = await this.sendTx("setWorkerBalanceCheck", args);
      return receipt;
    },

    setWorkerPartnerCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["setWorkerPartnerCheck"]):Promise<any> => {
      const receipt = await this.sendTx("setWorkerPartnerCheck", args);
      return receipt;
    },

    subtractFromPartnerCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["subtractFromPartnerCheck"]):Promise<any> => {
      const receipt = await this.sendTx("subtractFromPartnerCheck", args);
      return receipt;
    },

    workerGetsThanksPayCheck: async (args: ThanksPaySuperType["thanksPayCheck"]["workerGetsThanksPayCheck"]):Promise<any> => {
      const receipt = await this.sendTx("workerGetsThanksPayCheck", args);
      return receipt;
    },

  }
}
