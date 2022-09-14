import { Contract } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
export type SignerOrProvider = Provider | Signer | undefined;

import thanksSecurityABI from "../../abis/ThanksSecurity.json";
import thanksPayDataABI from "../../abis/ThanksData.json";
import thanksPayMainABI from "../../abis/ThanksPayMain.json";
import thanksPayRelayABI from "../../abis/ThanksPayRelay.json";
import thanksPayCheckABI from "../../abis/ThanksPayCheck.json";

import { ThanksPayRelayType } from "./ThanksPayRelayTypes";
import { ThanksPayDataType } from "./ThanksPayDataTypes";
import { ThanksPayCheckType } from "./ThanksPayCheckTypes";
import { ThanksPayMainType } from "./ThanksPayMainTypes";

import contractAddresses from '../contractAddresses.json';
const Web3 = require('web3');
const web3 = new Web3();
import * as fs from 'fs';

export type ContractABIType = any
  | typeof thanksSecurityABI
  | typeof thanksPayDataABI 
  | typeof thanksPayCheckABI
  | typeof thanksPayMainABI 
  | typeof thanksPayRelayABI;

// this will be changed with env variable
const THANKS_PAY_MAIN_ADDR = contractAddresses["THANKS_PAY_MAIN_ADDR"];
const THANKS_PAY_DATA_ADDR = contractAddresses["THANKS_PAY_DATA_ADDR"];
const THANKS_PAY_SECURITY_ADDR = contractAddresses["THANKS_PAY_SECURITY_ADDR"];
const THANKS_PAY_RELAY_ADDR = contractAddresses["THANKS_PAY_RELAY_ADDR"];
const THANKS_PAY_CHECK_ADDR = contractAddresses["THANKS_PAY_CHECK_ADDR"];

type AuthorizeType = {
  addresses: string[];
}

export type ThanksPaySecurityType = {
  authorize: AuthorizeType
  // not used
} 


export type ThanksPaySuperType = {
  thanksPaySecurity: ThanksPaySecurityType,
  thanksPayData: ThanksPayDataType,
  thanksPayCheck: ThanksPayCheckType,
  thanksPayMain: ThanksPayMainType,
  thanksPayRelay: ThanksPayRelayType,
}

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

// up-to-date as of 2021-09-13
export class ThanksPayMain extends ThanksPayContracts {
    constructor(signerOrProvider: SignerOrProvider) {
        super(signerOrProvider, THANKS_PAY_MAIN_ADDR, thanksPayMainABI);
    }

    public method = {
        setLatestWagePay: async (args: ThanksPayMainType["setLatestWagePay"]) => {
          await this.sendTx("setLatestWagePay", args);
        },
        subtractFromPartner: async (args: ThanksPayMainType["subtractFromPartner"]) => {
          await  this.sendTx("subtractFromPartner", args);
        },
        partnerAddBonus: async (args: ThanksPayMainType["partnerAddBonus"]) => {
          await  this.sendTx("partnerAddBonus", args);
        },
        partnerAddBalance: async (args: ThanksPayMainType["partnerAddBalance"]) => {
          await  this.sendTx("partnerAddBalance", args);
        },
        partnerWithdraw: async (args: ThanksPayMainType["partnerWithdraw"]) => {
          await this.sendTx("partnerWithdraw", args);
        },
        workerGetsThanksPay: async (args: ThanksPayMainType["workerGetsThanksPay"]) => {
          await  this.sendTx("workerGetsThanksPay", args);
        }
    }
}

// up-to-date as of 2021-09-12
export class ThanksPayRelay extends ThanksPayContracts {
    constructor(signerOrProvider: SignerOrProvider) {
        super(signerOrProvider, THANKS_PAY_RELAY_ADDR, thanksPayRelayABI);
    }
    public method = {
        setProperty: async (args: ThanksPayRelayType["setProperty"]) => {
            await this.sendTx("setProperty", args);
        },
        addProperty: async (args: ThanksPayRelayType["addProperty"]) => {
            await this.sendTx("addProperty", args);
        },
        editProperty: async (args: ThanksPayRelayType["editProperty"]) => {
            await this.sendTx("editProperty", args);
        },
        getPropertyName: async (args: ThanksPayRelayType["getPropertyName"]) => {
            await this.sendTx("getPropertyName", args);
        },
        setDynamicProperties: async (args: ThanksPayRelayType["setDynamicProperties"]) => { 
            await this.sendTx("setDynamicProperties", args);
        },
        setStaticProperties: async (args: ThanksPayRelayType["setStaticProperties"]) => {
            await this.sendTx("setStaticProperties", args);
        },
        alterEntityNames: async (args: ThanksPayRelayType["alterEntityNames"]) => { 
            await this.sendTx("alterEntityNames", args);
        },
        alterPropertyNames: async (args: ThanksPayRelayType["alterPropertyNames"]) => {
            await this.sendTx("alterPropertyNames", args);
        },
        getAllEntities: async (args: ThanksPayRelayType["getAllEntities"]) => {
            await this.sendTx("getAllEntities", args);
        },
        getAllProperties: async (args: ThanksPayRelayType["getAllProperties"]) => {
            await this.sendTx("getAllProperties", args);
        }
      }
}

// up-to-date as of 2021-09-13
export class ThanksPayCheck extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_CHECK_ADDR, thanksPayCheckABI);
  }
  public method = {
    workerGetSalaryEarlyCheck: async (
      args: ThanksPayCheckType["workerGetSalaryEarlyCheck"]
    ) => {
      await this.sendTx("workerGetSalaryEarlyCheck", args);
    },
    subtractFromPartnerCheck: async (
      args: ThanksPayCheckType["subtractFromPartnerCheck"]
    ) => {
      await this.sendTx("subtractFromPartnerCheck", args);
    },
    partnerWithdrawCheck: async (
      args: ThanksPayCheckType["partnerWithdrawCheck"]
    ) => {
      await this.sendTx("partnerWithdrawCheck", args);
    },
    workerGetsThanksPayCheck: async (
      args: ThanksPayCheckType["workerGetsThanksPayCheck"]
    ) => {
      await this.sendTx("workerGetsThanksPayCheck", args);
    }
  }
}

// up-to-date as of 2021-09-13
export class ThanksPayData extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_DATA_ADDR, thanksPayDataABI);
  }

  public method = {
    registerPartner: async (args: ThanksPayDataType["registerPartner"]) => {
      const receipt:any =  await this.sendTx("registerPartner", args);
      const eventReturn = this.getEventObj(receipt);
      // now save to db
    },
    registerWorker: async (args: ThanksPayDataType["registerWorker"]) => {
      const receipt = await this.sendTx("registerWorker", args);
    },
    setPartnerBonus: async (args: ThanksPayDataType["setPartnerBonus"]) => {
      this.sendTx("setPartnerBonus", args);
    },
    setPartnerBalance: async (args: ThanksPayDataType["setPartnerBalance"]) => {
      const receipt = await this.sendTx("setPartnerBalance", args);
      const eventReturn = this.getEventObj(receipt);
      // now save to db
    },
    setLatestRequest: async (args: ThanksPayDataType["setLatestRequest"]) => {
      this.sendTx("setLatestRequest", args);
    },
    setWorkerBalance: async (args: ThanksPayDataType["setWorkerBalance"]) => {
      const receipt = await this.sendTx("setWorkerBalance", args);
      const eventReturn = this.getEventObj(receipt);
    },
    setLatestWagePay: async (args: ThanksPayDataType["setLatestWagePay"]) => {
      this.sendTx("setLatestWagePay", args);
    },
    getWorker: async (args: ThanksPayDataType["getWorker"]) => {
      this.sendTx("getWorker", args);
    },
    getWorkerBalance: async (args: ThanksPayDataType["getWorkerBalance"]) => {
      this.sendTx("getWorkerBalance", args);
    },
    getPartnerThanksPayableBalance: async (args: ThanksPayDataType["getPartnerThanksPayableBalance"]) => {
      this.sendTx("getPartnerThanksPayableBalance", args);
    },
    getPartnerWithdrawableBalance: async (args: ThanksPayDataType["getPartnerWithdrawableBalance"]) => {
      this.sendTx("getPartnerWithdrawableBalance", args);
    },
    getPartner: async (args: ThanksPayDataType["getPartner"]) => {
      this.sendTx("getPartner", args);
    }
  }
}

export class ThanksPaySecurity extends ThanksPayContracts {
  constructor(signerOrProvider: SignerOrProvider) {
    super(signerOrProvider, THANKS_PAY_SECURITY_ADDR, thanksSecurityABI);
  }

  public method = {
    authorize: async (args: ThanksPaySecurityType["authorize"]) => {
      await this.sendTx("authorize", args);
    }
  }
}