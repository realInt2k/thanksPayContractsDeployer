import { Contract } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
export type SignerOrProvider = Provider | Signer | undefined;

import thanksSecurityABI from "../../abis/ThanksSecurity.json";
import thanksPayDataABI from "../../abis/ThanksData.json";
import thanksPayMainABI from "../../abis/ThanksPayMain.json";
import thanksPayRelayABI from "../../abis/ThanksPayRelay.json";
import thanksPayCheckABI from "../../abis/ThanksPayCheck.json";
import { networkNameType } from '../deploy';
import { ThanksPayRelayType } from "../generatedTypes/ThanksPayRelayType";
import { ThanksPayDataType } from "../generatedTypes/ThanksPayDataType";
import { ThanksPayCheckType } from "../generatedTypes/ThanksPayCheckType";
import { ThanksPayMainType } from "../generatedTypes/ThanksPayMainType";
import { ThanksPaySuperType } from "../generatedTypes/ThanksPaySuperType";

import contractAddresses from "../contractAddresses.json";
const Web3 = require("web3");
const web3 = new Web3();
import * as fs from "fs";

export type ContractABIType =
  | any
  | typeof thanksSecurityABI
  | typeof thanksPayDataABI
  | typeof thanksPayCheckABI
  | typeof thanksPayMainABI
  | typeof thanksPayRelayABI;


type contractNameType = "THANKS_PAY_MAIN_ADDR" | "THANKS_PAY_DATA_ADDR" | "THANKS_PAY_SECURITY_ADDR" | "THANKS_PAY_RELAY_ADDR" | "THANKS_PAY_CHECK_ADDR";

const getContractAddress = (networkName: networkNameType, contractName: contractNameType) => {
  return contractAddresses[networkName][contractName];
};


type AuthorizeType = {
  addresses: string[];
};

export type ThanksPaySecurityType = {
  authorize: AuthorizeType;
  // not used
};

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
          name: input["name"],
        };
      }),
      inputTypes: event["inputs"].map((input: any) => input["type"]),
      inputNames: event["inputs"].map((input: any) => input["name"]),
    };
  });

  return arrayOfEvents;
};

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
    if (!receipt.events[0].event) {
      return {};
    }
    const typesArray = this.getEventTypesArray(receipt.events[0].event);
    const decodedParameters = web3.eth.abi.decodeParameters(
      typesArray,
      receipt.events[0].data
    );
    let obj: any = {};
    for (let i = 0; i < typesArray.length; i++) {
      obj[typesArray[i].name] = decodedParameters[typesArray[i].name];
    }
    return {
      decodedParameters,
      obj,
    };
  };

  constructor(
    signerOrProvider: SignerOrProvider,
    contractAddr: string,
    abi: ContractABIType
  ) {
    super(contractAddr, abi, signerOrProvider);
    this.schema = getSchema(abi);
    this.events = getEvents(abi);
  }
  public sendTx = async (name: string, args: any, check?: boolean | null, checkErrorString?: string): Promise<any> => {
    try {
      const order = this.getRequiredOrder(name);
      const orderedArgs = order.map((item: string) => {
        return (args as any)[item];
      });
      // if ("payableAmt" in args) {
      //   orderedArgs.push(args.payableAmt);
      // }

      if (check===false) {
        return {
          error: checkErrorString,
        };
      }
      
      const tx = await this[name](...orderedArgs);
      const txReceipt = await tx.wait();
      return txReceipt;
      // Receipt should now contain the logs
      // console.log(receipt.logs)
    } catch (e: any) {
      //console.log("error is: ", e); // change to alert
      // if (e.data && e.data.message) {
      //   alert(e.data.message);
      // }
      console.log(name, " failed to deliver");
      return -1;
    }
  };
}

// up-to-date as of 2022-09-13

export class ThanksPayMain extends ThanksPayContracts {
  private thanksPayCheck: ThanksPayCheck;

  constructor(networkName: networkNameType, signerOrProvider: SignerOrProvider) {
    const address = getContractAddress(networkName, "THANKS_PAY_MAIN_ADDR");
    super(signerOrProvider, address, thanksPayMainABI);
    this.thanksPayCheck = new ThanksPayCheck(networkName, signerOrProvider);
  }

  public methods = {
    setLatestWagePay: async (
      args: ThanksPayMainType["setLatestWagePay"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.methods.setLatestWagePayCheck(args);
      const checkErrorString = "setLatestWagePayCheck failed";
      await this.sendTx("setLatestWagePay", args, check, checkErrorString);
    },
    subtractFromPartner: async (
      args: ThanksPayMainType["subtractFromPartner"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.methods.subtractFromPartnerCheck(
        args
      );
      const checkErrorString = "subtractFromPartnerCheck failed";
      return await this.sendTx("subtractFromPartner", args, check, checkErrorString);
    },
    partnerAddBonus: async (
      args: ThanksPayMainType["partnerAddBonus"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.methods.partnerAddBonusCheck(args);
      const checkErrorString = "partnerAddBonusCheck failed";
      return await this.sendTx("partnerAddBonus", args, check, checkErrorString);
      // return res;
    },
    partnerAddBalance: async (
      args: ThanksPayMainType["partnerAddBalance"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.methods.partnerAddBalanceCheck(
        args
      );
      const checkErrorString = "partnerAddBalanceCheck failed";
      return await this.sendTx("partnerAddBalance", args, check, checkErrorString);
    },
    partnerWithdraw: async (
      args: ThanksPayMainType["partnerWithdraw"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.methods.partnerWithdrawCheck(args);
      const checkErrorString = "partnerWithdrawCheck failed";
      return await this.sendTx("partnerWithdraw", args, check, checkErrorString);
    },
    workerGetsThanksPay: async (
      args: ThanksPayMainType["workerGetsThanksPay"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.methods.workerGetsThanksPayCheck(
        args
      );
      const checkErrorString = "workerGetsThanksPayCheck failed";
      return await this.sendTx("workerGetsThanksPay", args, check, checkErrorString);
    },
  };
}

// up-to-date as of 2021-09-12
export class ThanksPayRelay extends ThanksPayContracts {
  constructor(networkName: networkNameType, signerOrProvider: SignerOrProvider) {
    const address = getContractAddress(networkName, "THANKS_PAY_RELAY_ADDR");
    super(signerOrProvider, address, thanksPayRelayABI);
  }
  public methods = {
    setDynamicProperties: async (
      args: ThanksPayRelayType["setDynamicProperties"]
    ) => {
      return await this.sendTx("setDynamicProperties", args);
    },
    setStaticProperties: async (
      args: ThanksPayRelayType["setStaticProperties"]
    ) => {
      return await this.sendTx("setStaticProperties", args);
    },
    alterEntityNames: async (args: ThanksPayRelayType["alterEntityNames"]) => {
      return await this.sendTx("alterEntityNames", args);
    },
    alterPropertyNames: async (
      args: ThanksPayRelayType["alterPropertyNames"]
    ) => {
      return await this.sendTx("alterPropertyNames", args);
    },
    getAllEntities: async (args: ThanksPayRelayType["getAllEntities"]) => {
      return await this.sendTx("getAllEntities", args);
    },
    getAllProperties: async (args: ThanksPayRelayType["getAllProperties"]) => {
      return await this.sendTx("getAllProperties", args);
    },
  };
}

// up-to-date as of 2021-09-13
export class ThanksPayCheck extends ThanksPayContracts {
  constructor(networkName: networkNameType, signerOrProvider: SignerOrProvider) {
    const address = getContractAddress(networkName, "THANKS_PAY_CHECK_ADDR");

    super(signerOrProvider, address, thanksPayCheckABI);
  }
  public methods = {
    // workerGetSalaryEarlyCheck: async (
    //   args: ThanksPayCheckType["workerGetSalaryEarlyCheck"]
    // ): Promise<boolean> => {
    //   const res = await this.sendTx("workerGetSalaryEarlyCheck", args);
    //   return res;
    // },
    subtractFromPartnerCheck: async (
      args: ThanksPayCheckType["subtractFromPartnerCheck"]
    ): Promise<boolean> => {
      return await this.sendTx("subtractFromPartnerCheck", args);
      //return res;
    },
    partnerWithdrawCheck: async (
      args: ThanksPayCheckType["partnerWithdrawCheck"]
    ): Promise<boolean> => {
      return await this.sendTx("partnerWithdrawCheck", args);
      // return res;
    },
    workerGetsThanksPayCheck: async (
      args: ThanksPayCheckType["workerGetsThanksPayCheck"]
    ): Promise<boolean> => {
      return await this.sendTx("workerGetsThanksPayCheck", args);
      // return res;
    },
    registerWorkerCheck: async (
      args: ThanksPayCheckType["registerWorkerCheck"]
    ): Promise<boolean> => {
      return await this.sendTx("registerWorkerCheck", args);
      // return res;
    },
    setWorkerPartnerCheck: async (
      args: ThanksPayCheckType["setWorkerPartnerCheck"]
    ): Promise<boolean> => {
      return await this.sendTx("setWorkerPartnerCheck", args);
      // return res;
    },
    registerPartnerCheck: async (
      args: ThanksPayCheckType["registerPartnerCheck"]
    ): Promise<boolean> => {
      return await this.sendTx("registerPartnerCheck", args);
      // return res;
    },
    setPartnerBonusCheck: async (
      args: ThanksPayCheckType["setPartnerBonusCheck"]
    ): Promise<boolean> => {
      return await this.sendTx("setPartnerWorkerCheck", args);
      // return res;
    },
    setLatestWagePayCheck: async (
      args: ThanksPayCheckType["setLatestWagePayCheck"]
    ): Promise<boolean> => {
      return await this.sendTx("setLatestWagePayCheck", args);
      // return res;
    },
    setLatestRequestCheck: async (
      args: ThanksPayCheckType["setLatestRequestCheck"]
    ): Promise<boolean> => {
      return await this.sendTx("setLatestRequestCheck", args);
      // return res;
    },
    setWorkerBalanceCheck: async (
      args: ThanksPayCheckType["setWorkerBalanceCheck"]
    ): Promise<boolean> => {
      return await this.sendTx("setWorkerBalanceCheck", args);
      // return res;
    },
    setPartnerBalanceCheck: async (
      args: ThanksPayCheckType["setPartnerBalanceCheck"]
    ): Promise<boolean> => {
      return await this.sendTx("setPartnerBalanceCheck", args);
      // return res;
    },
    partnerAddBonusCheck: async (
      args: ThanksPaySuperType["thanksPayCheck"]["partnerAddBonusCheck"]
    ): Promise<boolean> => {
      return await this.sendTx("partnerAddBonusCheck", args);
      // return res;
    },
    partnerAddBalanceCheck: async (
      args: ThanksPaySuperType["thanksPayCheck"]["partnerAddBalanceCheck"]
    ): Promise<any> => {
      return await this.sendTx("PartnerAddBalanceCheck", args);
      // return res;
    },
  };
}

// up-to-date as of 2021-09-13
export class ThanksPayData extends ThanksPayContracts {
  private thanksPayCheck: ThanksPayCheck;
  constructor(networkName: networkNameType, signerOrProvider: SignerOrProvider) {
    const address = getContractAddress(networkName, "THANKS_PAY_DATA_ADDR");
    super(signerOrProvider, address, thanksPayDataABI);
    this.thanksPayCheck = new ThanksPayCheck(networkName, signerOrProvider);
  }

  public methods = {
    registerPartner: async (args: ThanksPayDataType["registerPartner"]) => {
      const check: boolean =
        await this.thanksPayCheck.methods.registerPartnerCheck(args);
      const checkErrorString = "registerPartnerCheck failed";
      return await this.sendTx("registerPartner", args, check, checkErrorString);
    },

    registerWorker: async (args: ThanksPayDataType["registerWorker"]) => {
      const check: boolean =
        await this.thanksPayCheck.methods.registerWorkerCheck(args);
      const checkErrorString = "registerWorkerCheck failed";
      return await this.sendTx("registerWorker", args, check, checkErrorString);
    },
    
    setPartnerBonus: async (args: ThanksPayDataType["setPartnerBonus"]) => {
      const check = await this.thanksPayCheck.methods.setPartnerBonusCheck(args);
      const checkErrorString = "setPartnerBonusCheck failed";
      return await this.sendTx("setPartnerBonus", args, check, checkErrorString);
    },
    setPartnerBalance: async (args: ThanksPayDataType["setPartnerBalance"]) => {
      const check = await this.thanksPayCheck.methods.setPartnerBalanceCheck(
        args
      );
      const checkErrorString = "setPartnerBalanceCheck failed";
      return await this.sendTx("setPartnerBalance", args, check, checkErrorString);
      // const eventReturn = this.getEventObj(receipt);
      // now save to db
    },
    setLatestRequest: async (args: ThanksPayDataType["setLatestRequest"]) => {
      const check = await this.thanksPayCheck.methods.setLatestRequestCheck(
        args
      );
      const checkErrorString = "setLatestRequestCheck (for worker) failed";
      return await this.sendTx("setLatestRequest", args, check, checkErrorString);
    },

    setWorkerBalance: async (args: ThanksPayDataType["setWorkerBalance"]) => {
      const check = await this.thanksPayCheck.methods.setWorkerBalanceCheck(
        args
      );
      const checkErrorString = "setWorkerBalanceCheck failed";
      return await this.sendTx("setWorkerBalance", args, check, checkErrorString);
      // const eventReturn = this.getEventObj(receipt);
    },
    setLatestWagePay: async (args: ThanksPayDataType["setLatestWagePay"]) => {
      const check = await this.thanksPayCheck.methods.setLatestWagePayCheck(
        args
      );
      const checkErrorString = "setLatestWagePayCheck failed";
      await this.sendTx("setLatestWagePay", args, check, checkErrorString);
    },
    getWorker: async (args: ThanksPayDataType["getWorker"]) => {
      await this.sendTx("getWorker", args);
    },
    getWorkerBalance: async (args: ThanksPayDataType["getWorkerBalance"]) => {
      await this.sendTx("getWorkerBalance", args);
    },
    getPartnerThanksPayableBalance: async (
      args: ThanksPayDataType["getPartnerThanksPayableBalance"]
    ) => {
      await this.sendTx("getPartnerThanksPayableBalance", args);
    },
    getPartnerWithdrawableBalance: async (
      args: ThanksPayDataType["getPartnerWithdrawableBalance"]
    ) => {
      await this.sendTx("getPartnerWithdrawableBalance", args);
    },
    getPartner: async (args: ThanksPayDataType["getPartner"]) => {
      await this.sendTx("getPartner", args);
    },
  };
}

export class ThanksPaySecurity extends ThanksPayContracts {
  constructor(networkName: networkNameType, signerOrProvider: SignerOrProvider) {
    const address = getContractAddress(networkName, "THANKS_PAY_SECURITY_ADDR");
    super(signerOrProvider, address, thanksSecurityABI);
  }

  public methods = {
    authorize: async (args: ThanksPaySecurityType["authorize"]) => {
      await this.sendTx("authorize", args);
    },
  };
}
