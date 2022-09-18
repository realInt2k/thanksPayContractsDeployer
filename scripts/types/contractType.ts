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

  public method = {
    setLatestWagePay: async (
      args: ThanksPayMainType["setLatestWagePay"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.method.setLatestWagePayCheck(
        args
      );
      if (!check) {
        return {
          error: "setLatestWagePayCheck failed",
        };
      }
      await this.sendTx("setLatestWagePay", args);
    },
    subtractFromPartner: async (
      args: ThanksPayMainType["subtractFromPartner"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.method.subtractFromPartnerCheck(
        args
      );
      if (!check) {
        return {
          error: "subtractFromPartnerCheck failed",
        };
      }
      const res = await this.sendTx("subtractFromPartner", args);
      return res;
    },
    partnerAddBonus: async (
      args: ThanksPayMainType["partnerAddBonus"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.method.partnerAddBonusCheck(args);
      if (!check) {
        return {
          error: "partnerAddBonusCheck failed",
        };
      }
      const res = await this.sendTx("partnerAddBonus", args);
      return res;
    },
    partnerAddBalance: async (
      args: ThanksPayMainType["partnerAddBalance"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.method.partnerAddBalanceCheck(
        args
      );
      if (!check) {
        return {
          error: "partnerAddBalanceCheck failed",
        };
      }
      await this.sendTx("partnerAddBalance", args);
    },
    partnerWithdraw: async (
      args: ThanksPayMainType["partnerWithdraw"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.method.partnerWithdrawCheck(args);
      if (!check) {
        return {
          error: "partnerWithdrawCheck failed",
        };
      }
      await this.sendTx("partnerWithdraw", args);
    },
    workerGetsThanksPay: async (
      args: ThanksPayMainType["workerGetsThanksPay"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.method.workerGetsThanksPayCheck(
        args
      );
      if (!check) {
        return {
          error: "workerGetsThanksPayCheck failed",
        };
      }
      await this.sendTx("workerGetsThanksPay", args);
    },
  };
}

// up-to-date as of 2021-09-12
export class ThanksPayRelay extends ThanksPayContracts {
  constructor(networkName: networkNameType, signerOrProvider: SignerOrProvider) {
    const address = getContractAddress(networkName, "THANKS_PAY_RELAY_ADDR");
    super(signerOrProvider, address, thanksPayRelayABI);
  }
  public method = {
    // setProperty: async (args: ThanksPayRelayType["setProperty"]) => {
    //   await this.sendTx("setProperty", args);
    // },
    // addProperty: async (args: ThanksPayRelayType["addProperty"]) => {
    //   await this.sendTx("addProperty", args);
    // },
    // editProperty: async (args: ThanksPayRelayType["editProperty"]) => {
    //   await this.sendTx("editProperty", args);
    // },
    // getPropertyName: async (args: ThanksPayRelayType["getPropertyName"]) => {
    //   await this.sendTx("getPropertyName", args);
    // },
    setDynamicProperties: async (
      args: ThanksPayRelayType["setDynamicProperties"]
    ) => {
      await this.sendTx("setDynamicProperties", args);
    },
    setStaticProperties: async (
      args: ThanksPayRelayType["setStaticProperties"]
    ) => {
      await this.sendTx("setStaticProperties", args);
    },
    alterEntityNames: async (args: ThanksPayRelayType["alterEntityNames"]) => {
      await this.sendTx("alterEntityNames", args);
    },
    alterPropertyNames: async (
      args: ThanksPayRelayType["alterPropertyNames"]
    ) => {
      await this.sendTx("alterPropertyNames", args);
    },
    getAllEntities: async (args: ThanksPayRelayType["getAllEntities"]) => {
      await this.sendTx("getAllEntities", args);
    },
    getAllProperties: async (args: ThanksPayRelayType["getAllProperties"]) => {
      await this.sendTx("getAllProperties", args);
    },
  };
}

// up-to-date as of 2021-09-13
export class ThanksPayCheck extends ThanksPayContracts {
  constructor(networkName: networkNameType, signerOrProvider: SignerOrProvider) {
    const address = getContractAddress(networkName, "THANKS_PAY_CHECK_ADDR");
    super(signerOrProvider, address, thanksPayCheckABI);
  }
  public method = {
    // workerGetSalaryEarlyCheck: async (
    //   args: ThanksPayCheckType["workerGetSalaryEarlyCheck"]
    // ): Promise<boolean> => {
    //   const res = await this.sendTx("workerGetSalaryEarlyCheck", args);
    //   return res;
    // },
    subtractFromPartnerCheck: async (
      args: ThanksPayCheckType["subtractFromPartnerCheck"]
    ): Promise<boolean> => {
      const res = await this.sendTx("subtractFromPartnerCheck", args);
      return res;
    },
    partnerWithdrawCheck: async (
      args: ThanksPayCheckType["partnerWithdrawCheck"]
    ): Promise<boolean> => {
      const res = await this.sendTx("partnerWithdrawCheck", args);
      return res;
    },
    workerGetsThanksPayCheck: async (
      args: ThanksPayCheckType["workerGetsThanksPayCheck"]
    ): Promise<boolean> => {
      const res = await this.sendTx("workerGetsThanksPayCheck", args);
      return res;
    },
    registerWorkerCheck: async (
      args: ThanksPayCheckType["registerWorkerCheck"]
    ): Promise<boolean> => {
      const res = await this.sendTx("registerWorkerCheck", args);
      return res;
    },
    setWorkerPartnerCheck: async (
      args: ThanksPayCheckType["setWorkerPartnerCheck"]
    ): Promise<boolean> => {
      const res = await this.sendTx("setWorkerPartnerCheck", args);
      return res;
    },
    registerPartnerCheck: async (
      args: ThanksPayCheckType["registerPartnerCheck"]
    ): Promise<boolean> => {
      const res = await this.sendTx("registerPartnerCheck", args);
      return res;
    },
    setPartnerBonusCheck: async (
      args: ThanksPayCheckType["setPartnerBonusCheck"]
    ): Promise<boolean> => {
      const res = await this.sendTx("setPartnerWorkerCheck", args);
      return res;
    },
    setLatestWagePayCheck: async (
      args: ThanksPayCheckType["setLatestWagePayCheck"]
    ): Promise<boolean> => {
      const res = await this.sendTx("setLatestWagePayCheck", args);
      return res;
    },
    setLatestRequestCheck: async (
      args: ThanksPayCheckType["setLatestRequestCheck"]
    ): Promise<boolean> => {
      const res = await this.sendTx("setLatestRequestCheck", args);
      return res;
    },
    setWorkerBalanceCheck: async (
      args: ThanksPayCheckType["setWorkerBalanceCheck"]
    ): Promise<boolean> => {
      const res = await this.sendTx("setWorkerBalanceCheck", args);
      return res;
    },
    setPartnerBalanceCheck: async (
      args: ThanksPayCheckType["setPartnerBalanceCheck"]
    ): Promise<boolean> => {
      const res = await this.sendTx("setPartnerBalanceCheck", args);
      return res;
    },
    partnerAddBonusCheck: async (
      args: ThanksPaySuperType["thanksPayCheck"]["partnerAddBonusCheck"]
    ): Promise<boolean> => {
      const res = await this.sendTx("partnerAddBonusCheck", args);
      return res;
    },
    partnerAddBalanceCheck: async (
      args: ThanksPaySuperType["thanksPayCheck"]["partnerAddBalanceCheck"]
    ): Promise<any> => {
      const res = await this.sendTx("PartnerAddBalanceCheck", args);
      return res;
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

  public method = {
    registerPartner: async (args: ThanksPayDataType["registerPartner"]) => {
      const check: boolean =
        await this.thanksPayCheck.method.registerPartnerCheck(args);
      if (!check) {
        return {
          error: "registerPartnerCheck failed",
        };
      }
      const receipt: any = await this.sendTx("registerPartner", args);
      const eventReturn = this.getEventObj(receipt);
      // now save to db
    },

    registerWorker: async (args: ThanksPayDataType["registerWorker"]) => {
      const check: boolean =
        await this.thanksPayCheck.method.registerWorkerCheck(args);
      if (!check) {
        return {
          error: "registerWorkerCheck failed",
        };
      }
      const receipt = await this.sendTx("registerWorker", args);
    },
    
    setPartnerBonus: async (args: ThanksPayDataType["setPartnerBonus"]) => {
      const check = await this.thanksPayCheck.method.setPartnerBonusCheck(args);
      if (!check) {
        return {
          error: "setPartnerBonusCheck failed",
        };
      }
      this.sendTx("setPartnerBonus", args);
    },
    setPartnerBalance: async (args: ThanksPayDataType["setPartnerBalance"]) => {
      const check = await this.thanksPayCheck.method.setPartnerBalanceCheck(
        args
      );
      if (!check) {
        return {
          error: "setPartnerBalanceCheck failed",
        };
      }
      const receipt = await this.sendTx("setPartnerBalance", args);
      const eventReturn = this.getEventObj(receipt);
      // now save to db
    },
    setLatestRequest: async (args: ThanksPayDataType["setLatestRequest"]) => {
      const check = await this.thanksPayCheck.method.setLatestRequestCheck(
        args
      );
      if (!check) {
        return {
          error: "setLatestRequestCheck (for worker) failed",
        };
      }
      this.sendTx("setLatestRequest", args);
    },
    setWorkerBalance: async (args: ThanksPayDataType["setWorkerBalance"]) => {
      const check = await this.thanksPayCheck.method.setWorkerBalanceCheck(
        args
      );
      if (!check) {
        return {
          error: "setWorkerBalanceCheck failed",
        };
      }

      const receipt = await this.sendTx("setWorkerBalance", args);
      const eventReturn = this.getEventObj(receipt);
    },
    setLatestWagePay: async (args: ThanksPayDataType["setLatestWagePay"]) => {
      const check = await this.thanksPayCheck.method.setLatestWagePayCheck(
        args
      );
      if (!check) {
        return {
          error: "setLatestWagePayCheck failed",
        };
      }
      this.sendTx("setLatestWagePay", args);
    },
    getWorker: async (args: ThanksPayDataType["getWorker"]) => {
      this.sendTx("getWorker", args);
    },
    getWorkerBalance: async (args: ThanksPayDataType["getWorkerBalance"]) => {
      this.sendTx("getWorkerBalance", args);
    },
    getPartnerThanksPayableBalance: async (
      args: ThanksPayDataType["getPartnerThanksPayableBalance"]
    ) => {
      this.sendTx("getPartnerThanksPayableBalance", args);
    },
    getPartnerWithdrawableBalance: async (
      args: ThanksPayDataType["getPartnerWithdrawableBalance"]
    ) => {
      this.sendTx("getPartnerWithdrawableBalance", args);
    },
    getPartner: async (args: ThanksPayDataType["getPartner"]) => {
      this.sendTx("getPartner", args);
    },
  };
}

export class ThanksPaySecurity extends ThanksPayContracts {
  constructor(networkName: networkNameType, signerOrProvider: SignerOrProvider) {
    const address = getContractAddress(networkName, "THANKS_PAY_SECURITY_ADDR");
    super(signerOrProvider, address, thanksSecurityABI);
  }

  public method = {
    authorize: async (args: ThanksPaySecurityType["authorize"]) => {
      await this.sendTx("authorize", args);
    },
  };
}
