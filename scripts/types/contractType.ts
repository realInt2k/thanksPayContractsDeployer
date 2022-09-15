import { Contract } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
export type SignerOrProvider = Provider | Signer | undefined;
import thanksSecurityABI from "../../abis/ThanksSecurity.json";
import thanksPayDataABI from "../../abis/ThanksData.json";
import thanksPayMainABI from "../../abis/ThanksPayMain.json";
import thanksPayRelayABI from "../../abis/ThanksPayRelay.json";
import thanksPayCheckABI from "../../abis/ThanksPayCheck.json";
import oldThanksABI from "../../abis/oldThanks.json";
import { getSigner } from "../utils/getSigner";
import { networkNameType } from './networkNameType';
import { ThanksPayRelayType } from "../generatedTypes/ThanksPayRelayType";
import { ThanksPayDataType } from "../generatedTypes/ThanksPayDataType";
import { ThanksPayCheckType } from "../generatedTypes/ThanksPayCheckType";
import { ThanksPayMainType } from "../generatedTypes/ThanksPayMainType";
import { ThanksPaySuperType } from "../generatedTypes/ThanksPaySuperType";
import { oldThanksType } from "../generatedTypes/oldThanksType";
import { ethers } from 'ethers';
import { SuccessReturn, ErrorReturn, ViewReturn } from "./returnType";
import contractAddresses from "../contractAddresses.json";
import { rawTxDataType } from "./rawTxDataType";
const Web3 = require("web3");
const web3 = new Web3();
import { contractNameType } from "./contractNameType";
import * as fs from "fs";
import * as path from "path";
import { writeToTxLog } from '../utils/writeToTransactionLog';
import { getTxDetails } from "../utils/getTxDetails";



export type ContractABIType =
  | any
  | typeof thanksSecurityABI
  | typeof thanksPayDataABI
  | typeof thanksPayCheckABI
  | typeof thanksPayMainABI
  | typeof thanksPayRelayABI
  | typeof oldThanksABI;


const getContractAddress = (networkName: networkNameType, contractName: contractNameType) => {
  return contractAddresses[networkName][contractName];
};


type AuthorizeType = {
  addresses: string[];
};

type IsAuthorizedType = {
  account: string;
}

export type ThanksPaySecurityType = {
  authorize: AuthorizeType,
  isAuthorized: IsAuthorizedType,
  // not used
};

const getSchema = (abi: ContractABIType) => {
  const functions = abi.filter((row: any) => row["type"] === "function");

  // make an array where key is functions['name']
  const arrayOfFunctions = functions.map((func: any) => {
    const funcName = func["name"];
    return {
      name: func["name"],
      inputTypes: func["inputs"].map((input: any) => input["type"]),
      inputNames: func["inputs"].map((input: any) => input["name"]),
      stateMutability: func["stateMutability"],
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

const getFunctionStateMutability = (functionName: string, schema: any) => {
  const func = schema.find((row: any) => row.name === functionName);
  return func.stateMutability;
};

export class ThanksPayContracts extends Contract {
  public schema: any;
  public events: any;
  public allEvents: any; // all events in the ThanksPayContracts family. Can be dangerous!
  public iface: any;
  public contractName: string;
  public networkName: networkNameType;

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
    contractName: contractNameType,
    networkName: networkNameType,
    abi: ContractABIType
  ) {
    const thisABI = abi;
    const ABIs = [thanksPayCheckABI, thanksPayDataABI, thanksPayMainABI, thanksPayRelayABI, thanksSecurityABI];


    ABIs.map((abi: any) => {
      const events = abi.filter((row: any) => row["type"] === "event");
      events.map((event: any) => {
        // if thisABI has the same event, do not add it
        const hasEvent = thisABI.find((row: any) => row["name"] === event["name"]);
        if (!hasEvent) {
          thisABI.push(event);
        }
      })
    });

    const contractAddress = getContractAddress(networkName, contractName);
    const signer = getSigner(networkName);
    super(contractAddress, abi, signer);

    this.iface = new ethers.utils.Interface(thisABI);
    this.schema = getSchema(thisABI);
    this.events = getEvents(thisABI);
    this.contractName = contractName;
    this.networkName = networkName;
  }

  public sendTx = async (name: string, args: any, check?: boolean | null, checkErrorString?: string): Promise<SuccessReturn | ErrorReturn | ViewReturn> => {
    try {
      const order = this.getRequiredOrder(name);
      const orderedArgs = order.map((item: string) => {
        return (args as any)[item];
      });

      if (check === false) {
        return {
          type: "error",
          values: {
            reason: checkErrorString ? checkErrorString : "Undefined error",
          }
        };
      }

      const tx = await this[name](...orderedArgs);


      if (getFunctionStateMutability(name, this.schema) === "view") {
        return {
          type: "view",
          values: {
            ok: tx
          }
        };
      } else {
        // if the network is Ganache, then write into the thing. 
        const txReceipt = await tx.wait();
        if (this.networkName == "ganache") {
          writeToTxLog(tx.data, (this.contractName as contractNameType), tx.nonce);
        }
        const txDetails = getTxDetails(txReceipt, this.networkName, this.iface);
        return txDetails;
      }
    } catch (e: any) {
      console.log(e);
      return {
        type: "error",
        values: {
          reason: e.reason ? e.reason : e.code,
        }
      };
    }
  };
}

export class ThanksPayMain extends ThanksPayContracts {
  private thanksPayCheck: ThanksPayCheck;

  constructor(networkName: networkNameType) {
    super("THANKS_PAY_MAIN_ADDR", networkName, thanksPayMainABI);
    this.thanksPayCheck = new ThanksPayCheck(networkName);
  }

  public methods = {
    setLatestWagePay: async (
      args: ThanksPayMainType["setLatestWagePay"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.methods.setLatestWagePayCheck(args);
      const checkErrorString = "setLatestWagePayCheck failed";
      return await this.sendTx("setLatestWagePay", args, check, checkErrorString);
    },
    subtractFromPartner: async (
      args: ThanksPayMainType["subtractFromPartner"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.methods.subtractFromPartnerCheck(
        args
      );
      const checkErrorString = "subtractFromPartnerCheck failed, insufficient partner balance";
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
      const workerCheck = await this.thanksPayCheck.methods.workerGetsThanksPayCheck(
        args
      );
      const pId: number = args.pId;
      const amount: number = args.amount;
      const partnerArgs: ThanksPayMainType["subtractFromPartner"] = {
        pId,
        amount,
      }
      const partnerCheck = await this.thanksPayCheck.methods.subtractFromPartnerCheck(partnerArgs);
      var checkErrorString;
      if (!workerCheck){
        checkErrorString = "workerGetsThanksPayCheck failed, insufficient worker balance";
      } else {
        if (!partnerCheck){
          checkErrorString = "subtractFromPartnerCheck failed, insufficient partner balance";
        }
      }
      const check = workerCheck && partnerCheck;
      return await this.sendTx("workerGetsThanksPay", args, check, checkErrorString);
    },
  };
}

// up-to-date as of 2021-09-12
export class ThanksPayRelay extends ThanksPayContracts {
  constructor(networkName: networkNameType) {
    super("THANKS_PAY_RELAY_ADDR", networkName, thanksPayRelayABI);
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
  constructor(networkName: networkNameType) {
    const address = getContractAddress(networkName, "THANKS_PAY_CHECK_ADDR");
    super("THANKS_PAY_CHECK_ADDR", networkName, thanksPayCheckABI);
  }
  public returnView = async (functionName: string, args: any): Promise<boolean> => {
    const res = await this.sendTx(functionName, args) as ViewReturn;
    return res.values.ok;
  }

  public methods = {
    subtractFromPartnerCheck: async (
      args: ThanksPayCheckType["subtractFromPartnerCheck"]
    ): Promise<boolean> => {
      // const result = (await this.sendTx("subtractFromPartnerCheck", args)) as ViewReturn;
      return await this.returnView("subtractFromPartnerCheck", args);
      //return res;
    },
    partnerWithdrawCheck: async (
      args: ThanksPayCheckType["partnerWithdrawCheck"]
    ): Promise<boolean> => {
      // const result = await this.sendTx("partnerWithdrawCheck", args) as ViewReturn;
      return await this.returnView("partnerWithdrawCheck", args);
      // return res;
    },
    workerGetsThanksPayCheck: async (
      args: ThanksPayCheckType["workerGetsThanksPayCheck"]
    ): Promise<boolean> => {
      return await this.returnView("workerGetsThanksPayCheck", args);
      // return res;
    },
    registerWorkerCheck: async (
      args: ThanksPayCheckType["registerWorkerCheck"]
    ): Promise<boolean> => {
      return await this.returnView("registerWorkerCheck", args);
      // return res;
    },
    setWorkerPartnerCheck: async (
      args: ThanksPayCheckType["setWorkerPartnerCheck"]
    ): Promise<boolean> => {
      return await this.returnView("setWorkerPartnerCheck", args);
      // const result = await this.sendTx("setWorkerPartnerCheck", args) as ViewReturn;
      // return await result.values.ok;
      // return res;
    },
    registerPartnerCheck: async (
      args: ThanksPayCheckType["registerPartnerCheck"]
    ): Promise<boolean> => {
      return await this.returnView("registerPartnerCheck", args);
      // const result = await this.sendTx("registerPartnerCheck", args) as ViewReturn;
      // return await result.values.ok;
      // return res;
    },
    setPartnerBonusCheck: async (
      args: ThanksPayCheckType["setPartnerBonusCheck"]
    ): Promise<boolean> => {
      return await this.returnView("setPartnerWorkerCheck", args);
      // const result = return await this.sendTx("setPartnerWorkerCheck", args) as ViewReturn;
      // return res;
    },
    setLatestWagePayCheck: async (
      args: ThanksPayCheckType["setLatestWagePayCheck"]
    ): Promise<boolean> => {
      return await this.returnView("setLatestWagePayCheck", args);
      // return await this.sendTx("setLatestWagePayCheck", args);
      // return res;
    },
    setLatestRequestCheck: async (
      args: ThanksPayCheckType["setLatestRequestCheck"]
    ): Promise<boolean> => {
      return await this.returnView("setLatestRequestCheck", args);
      //      return await this.sendTx("setLatestRequestCheck", args);
      // return res;
    },
    setWorkerBalanceCheck: async (
      args: ThanksPayCheckType["setWorkerBalanceCheck"]
    ): Promise<boolean> => {
      return await this.returnView("setWorkerBalanceCheck", args);
      //      return await this.sendTx("setWorkerBalanceCheck", args);
      // return res;
    },
    setPartnerBalanceCheck: async (
      args: ThanksPayCheckType["setPartnerBalanceCheck"]
    ): Promise<boolean> => {
      return await this.returnView("setPartnerBalanceCheck", args);
      //      return await this.sendTx("setPartnerBalanceCheck", args);
      // return res;
    },
    partnerAddBonusCheck: async (
      args: ThanksPaySuperType["thanksPayCheck"]["partnerAddBonusCheck"]
    ): Promise<boolean> => {
      return await this.returnView("partnerAddBonusCheck", args);
      //      return await this.sendTx("partnerAddBonusCheck", args);
      // return res;
    },
    partnerAddBalanceCheck: async (
      args: ThanksPaySuperType["thanksPayCheck"]["partnerAddBalanceCheck"]
    ): Promise<any> => {
      return await this.returnView("partnerAddBalanceCheck", args);
      //      return await this.sendTx("PartnerAddBalanceCheck", args);
      // return res;
    },
  };
}

// up-to-date as of 2021-09-13
export class ThanksPayData extends ThanksPayContracts {
  private thanksPayCheck: ThanksPayCheck;
  constructor(networkName: networkNameType) {
    super("THANKS_PAY_DATA_ADDR", networkName, thanksPayDataABI);
    this.thanksPayCheck = new ThanksPayCheck(networkName);
  }

  public methods = {
    registerPartner: async (args: ThanksPayDataType["registerPartner"]) => {
      const check: boolean = await this.thanksPayCheck.methods.registerPartnerCheck(args);
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
  constructor(networkName: networkNameType) {
    super("THANKS_PAY_SECURITY_ADDR", networkName, thanksSecurityABI);
  }

  public methods = {
    authorize: async (args: ThanksPaySecurityType["authorize"]) => {
      await this.sendTx("authorize", args);
    },
    isAuthorized: async (args: ThanksPaySecurityType["isAuthorized"]) => {
      await this.sendTx("isAuthorized", args);
    }
  };
}

export class OldThanks extends ThanksPayContracts {

  constructor(networkName: networkNameType) {
    super("OLD_THANKS_ADDR", networkName, oldThanksABI);
  }

  public methods = {

    cancelPay: async (args: ThanksPaySuperType["oldThanks"]["cancelPay"]): Promise<any> => {
      const receipt = await this.sendTx("cancelPay", args);
      return receipt;
    },

    editPartner: async (args: ThanksPaySuperType["oldThanks"]["editPartner"]): Promise<any> => {
      const receipt = await this.sendTx("editPartner", args);
      return receipt;
    },
    getAllPartner: async (args: ThanksPaySuperType["oldThanks"]["getAllPartner"]): Promise<any> => {
      const receipt = await this.sendTx("getAllPartner", args);
      return receipt;
    },

    getAllWorker: async (args: ThanksPaySuperType["oldThanks"]["getAllWorker"]): Promise<any> => {
      const receipt = await this.sendTx("getAllWorker", args);
      return receipt;
    },

    getPartner: async (args: ThanksPaySuperType["oldThanks"]["getPartner"]): Promise<any> => {
      const receipt = await this.sendTx("getPartner", args);
      return receipt;
    },

    getPayByPartnerAndDate: async (args: ThanksPaySuperType["oldThanks"]["getPayByPartnerAndDate"]): Promise<any> => {
      const receipt = await this.sendTx("getPayByPartnerAndDate", args);
      return receipt;
    },

    getPayByWorker: async (args: ThanksPaySuperType["oldThanks"]["getPayByWorker"]): Promise<any> => {
      const receipt = await this.sendTx("getPayByWorker", args);
      return receipt;
    },

    getPayByWorkerAndDate: async (args: ThanksPaySuperType["oldThanks"]["getPayByWorkerAndDate"]): Promise<any> => {
      const receipt = await this.sendTx("getPayByWorkerAndDate", args);
      return receipt;
    },

    newPartner: async (args: ThanksPaySuperType["oldThanks"]["newPartner"]): Promise<any> => {
      const receipt = await this.sendTx("newPartner", args);
      return receipt;
    },

    newWorker: async (args: ThanksPaySuperType["oldThanks"]["newWorker"]): Promise<any> => {
      const receipt = await this.sendTx("newWorker", args);
      return receipt;
    },

    partnerAddDeposit: async (args: ThanksPaySuperType["oldThanks"]["partnerAddDeposit"]): Promise<any> => {
      const receipt = await this.sendTx("partnerAddDeposit", args);
      return receipt;
    },

    partnerMap: async (args: ThanksPaySuperType["oldThanks"]["partnerMap"]): Promise<any> => {
      const receipt = await this.sendTx("partnerMap", args);
      return receipt;
    },

    partners: async (args: ThanksPaySuperType["oldThanks"]["partners"]): Promise<any> => {
      const receipt = await this.sendTx("partners", args);
      return receipt;
    },

    pay: async (args: ThanksPaySuperType["oldThanks"]["pay"]): Promise<any> => {
      const receipt = await this.sendTx("pay", args);
      return receipt;
    },

    payRequest: async (args: ThanksPaySuperType["oldThanks"]["payRequest"]): Promise<any> => {
      const receipt = await this.sendTx("payRequest", args);
      return receipt;
    },

    thanksAdmin: async (args: ThanksPaySuperType["oldThanks"]["thanksAdmin"]): Promise<any> => {
      const receipt = await this.sendTx("thanksAdmin", args);
      return receipt;
    },

    workerMap: async (args: ThanksPaySuperType["oldThanks"]["workerMap"]): Promise<any> => {
      const receipt = await this.sendTx("workerMap", args);
      return receipt;
    },

    workers: async (args: ThanksPaySuperType["oldThanks"]["workers"]): Promise<any> => {
      const receipt = await this.sendTx("workers", args);
      return receipt;
    },

  }
}