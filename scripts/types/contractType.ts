import { Contract } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
export type SignerOrProvider = Provider | Signer | undefined;
import thanksSecurityABI from "../../abis/ThanksSecurity.json";
import thanksPayDataABI from "../../abis/ThanksData.json";
import thanksPayMainABI from "../../abis/ThanksPayMain.json";
import thanksPayRelayABI from "../../abis/ThanksPayRelay.json";
import thanksPayCheckABI from "../../abis/ThanksPayCheck.json";
import thanksPaySecurityWrapperABI from "../../abis/ThanksSecurityWrapper.json";
import oldThanksABI from "../../abis/oldThanks.json";
import { getSigner } from "../utils/getSigner";
import { networkNameType } from "./networkNameType";
import { ThanksPayRelayType } from "../generatedTypes/ThanksPayRelayType";
import { ThanksPayDataType } from "../generatedTypes/ThanksPayDataType";
import { ThanksPayCheckType } from "../generatedTypes/ThanksPayCheckType";
import { ThanksPayMainType } from "../generatedTypes/ThanksPayMainType";
import { ThanksPaySuperType } from "../generatedTypes/ThanksPaySuperType";
import { oldThanksType } from "../generatedTypes/oldThanksType";
import { ethers } from "ethers";
import {
  SuccessReturn,
  ErrorReturn,
  ViewReturn,
  CheckReturn,
} from "./returnType";
import contractAddresses from "../contractAddresses.json";
import { rawTxDataType } from "./rawTxDataType";
const Web3 = require("web3");
const web3 = new Web3();
import { contractNameType } from "./contractNameType";
import * as fs from "fs";
import * as path from "path";
import {
  writeToTxLog,
  writeReceiptTxLog,
} from "../utils/writeToTransactionLog";
import { getTxDetails } from "../utils/getTxDetails";

export type ContractABIType =
  | any
  | typeof thanksSecurityABI
  | typeof thanksPayDataABI
  | typeof thanksPayCheckABI
  | typeof thanksPayMainABI
  | typeof thanksPayRelayABI
  | typeof oldThanksABI;

const getContractAddress = (
  networkName: networkNameType,
  contractName: contractNameType
) => {
  return contractAddresses[networkName][contractName];
};

type AuthorizeType = {
  contractAddresses: string[];
  humanAddresses: string[];
};

type IsAuthorizedType = {
  account: string;
};

export type ThanksPaySecurityType = {
  authorize: AuthorizeType;
  isAuthorized: IsAuthorizedType;
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
    const ABIs = [
      thanksPayCheckABI,
      thanksPayDataABI,
      thanksPayMainABI,
      thanksPayRelayABI,
      thanksSecurityABI,
    ];

    ABIs.map((abi: any) => {
      const events = abi.filter((row: any) => row["type"] === "event");
      events.map((event: any) => {
        // if thisABI has the same event, do not add it
        const hasEvent = thisABI.find(
          (row: any) => row["name"] === event["name"]
        );
        if (!hasEvent) {
          thisABI.push(event);
        }
      });
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

  public sendTx = async (
    name: string,
    args: any,
    check?: boolean | null,
    checkErrorString?: string
  ): Promise<SuccessReturn | ErrorReturn | ViewReturn | CheckReturn> => {
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
          },
        };
      }

      const tx = await this[name](...orderedArgs);

      if (getFunctionStateMutability(name, this.schema) === "view") {
        return {
          type: "view",
          values: {
            return: tx,
          },
        };
      } else {
        // if the network is Ganache, then write into the thing.
        const txReceipt = await tx.wait();
        const txDetails = getTxDetails(txReceipt, this.networkName, this.iface);
        if (
          this.networkName == "ganache" &&
          this.contractName !== "OLD_THANKS_ADDR"
        ) {
          await writeToTxLog(
            tx.data,
            this.contractName as contractNameType,
            tx.nonce,
            "polygonTest" as networkNameType,
            name
          );
          await writeToTxLog(
            tx.data,
            this.contractName as contractNameType,
            tx.nonce,
            "klaytn" as networkNameType,
            name
          );
        }

        if (this.contractName == "OLD_THANKS_ADDR") {
          writeReceiptTxLog(
            txReceipt,
            tx.data,
            this.contractName,
            name,
            this.networkName,
            tx.nonce
          );
        }
        return txDetails;
      }
    } catch (e: any) {
      // console.log(e);
      return {
        type: "error",
        values: {
          reason: e.reason ? e.reason : e.code,
        },
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
      const check = await this.thanksPayCheck.methods.setLatestWagePayCheck(
        args
      );
      const checkErrorString = "setLatestWagePayCheck failed";
      return await this.sendTx(
        "setLatestWagePay",
        args,
        check,
        checkErrorString
      );
    },
    // subtractFromPartner: async (
    //   args: ThanksPayMainType["subtractFromPartner"]
    // ): Promise<any> => {
    //   const check = await this.thanksPayCheck.methods.subtractFromPartnerCheck(
    //     args
    //   );
    //   const checkErrorString = "subtractFromPartnerCheck failed, insufficient partner balance";
    //   return await this.sendTx("subtractFromPartner", args, check, checkErrorString);
    // },
    partnerAddBonus: async (
      args: ThanksPayMainType["partnerAddBonus"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.methods.partnerAddBonusCheck(
        args
      );
      const checkErrorString = "partnerAddBonusCheck failed";
      return await this.sendTx(
        "partnerAddBonus",
        args,
        check,
        checkErrorString
      );
      // return res;
    },
    partnerAddBalance: async (
      args: ThanksPayMainType["partnerAddBalance"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.methods.partnerAddBalanceCheck(
        args
      );
      const checkErrorString = "partnerAddBalanceCheck failed";
      return await this.sendTx(
        "partnerAddBalance",
        args,
        check,
        checkErrorString
      );
    },
    partnerWithdraw: async (
      args: ThanksPayMainType["partnerWithdraw"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.methods.partnerWithdrawCheck(
        args
      );
      const checkErrorString = "partnerWithdrawCheck failed";
      return await this.sendTx(
        "partnerWithdraw",
        args,
        check,
        checkErrorString
      );
    },
    workerGetsThanksPay: async (
      args: ThanksPayMainType["workerGetsThanksPay"]
    ): Promise<any> => {
      const check = await this.thanksPayCheck.methods.workerGetsThanksPayCheck(
        args
      );
      const checkErrorString =
        "worker check failed, either the balance is insufficient, or partner doesn't have enough balance";
      return await this.sendTx(
        "workerGetsThanksPay",
        args,
        check,
        checkErrorString
      );
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
  public returnView = async (
    functionName: string,
    args: any
  ): Promise<boolean> => {
    const res = (await this.sendTx(functionName, args)) as CheckReturn;
    return res.values.return;
  };

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
      const check: boolean =
        await this.thanksPayCheck.methods.registerPartnerCheck(args);
      console.log(args, check);
      const checkErrorString = "registerPartnerCheck failed";
      return await this.sendTx(
        "registerPartner",
        args,
        check,
        checkErrorString
      );
    },

    registerWorker: async (args: ThanksPayDataType["registerWorker"]) => {
      const check: boolean =
        await this.thanksPayCheck.methods.registerWorkerCheck(args);
      const checkErrorString = "registerWorkerCheck failed";
      return await this.sendTx("registerWorker", args, check, checkErrorString);
    },

    setPartnerBonus: async (args: ThanksPayDataType["setPartnerBonus"]) => {
      const check = await this.thanksPayCheck.methods.setPartnerBonusCheck(
        args
      );
      const checkErrorString = "setPartnerBonusCheck failed";
      return await this.sendTx(
        "setPartnerBonus",
        args,
        check,
        checkErrorString
      );
    },
    setPartnerBalance: async (args: ThanksPayDataType["setPartnerBalance"]) => {
      const check = await this.thanksPayCheck.methods.setPartnerBalanceCheck(
        args
      );
      const checkErrorString = "setPartnerBalanceCheck failed";
      return await this.sendTx(
        "setPartnerBalance",
        args,
        check,
        checkErrorString
      );
      // const eventReturn = this.getEventObj(receipt);
      // now save to db
    },
    setLatestRequest: async (args: ThanksPayDataType["setLatestRequest"]) => {
      const check = await this.thanksPayCheck.methods.setLatestRequestCheck(
        args
      );
      const checkErrorString = "setLatestRequestCheck (for worker) failed";
      return await this.sendTx(
        "setLatestRequest",
        args,
        check,
        checkErrorString
      );
    },

    setWorkerBalance: async (args: ThanksPayDataType["setWorkerBalance"]) => {
      const check = await this.thanksPayCheck.methods.setWorkerBalanceCheck(
        args
      );
      const checkErrorString = "setWorkerBalanceCheck failed";
      return await this.sendTx(
        "setWorkerBalance",
        args,
        check,
        checkErrorString
      );
      // const eventReturn = this.getEventObj(receipt);
    },
    setLatestWagePay: async (args: ThanksPayDataType["setLatestWagePay"]) => {
      const check = await this.thanksPayCheck.methods.setLatestWagePayCheck(
        args
      );
      const checkErrorString = "setLatestWagePayCheck failed";
      return await this.sendTx(
        "setLatestWagePay",
        args,
        check,
        checkErrorString
      );
    },
    getWorker: async (args: ThanksPayDataType["getWorker"]) => {
      return (await this.sendTx("getWorker", args)) as ViewReturn;
    },
    getWorkerBalance: async (args: ThanksPayDataType["getWorkerBalance"]) => {
      return (await this.sendTx("getWorkerBalance", args)) as ViewReturn;
    },
    getPartnerThanksPayableBalance: async (
      args: ThanksPayDataType["getPartnerThanksPayableBalance"]
    ) => {
      return (await this.sendTx(
        "getPartnerThanksPayableBalance",
        args
      )) as ViewReturn;
    },
    getPartnerWithdrawableBalance: async (
      args: ThanksPayDataType["getPartnerWithdrawableBalance"]
    ) => {
      return (await this.sendTx(
        "getPartnerWithdrawableBalance",
        args
      )) as ViewReturn;
    },
    getPartner: async (args: ThanksPayDataType["getPartner"]) => {
      return (await this.sendTx("getPartner", args)) as ViewReturn;
    },
  };
}

export class ThanksPaySecurity extends ThanksPayContracts {
  constructor(networkName: networkNameType) {
    super("THANKS_PAY_SECURITY_ADDR", networkName, thanksSecurityABI);
  }

  public methods = {
    authorize: async (args: ThanksPaySecurityType["authorize"]) => {
      // first, get the currently authorized addresses
      const getOldAuthorizedContractAddresses = (await this.sendTx(
        "getAuthorizedContracts",
        []
      )) as ViewReturn;

      const getCurAuthorizedHumanaAddresses = (await this.sendTx(
        "getAuthorizedHuman",
        []
      )) as ViewReturn;
      // excluse the address of the signer
      const oldAuthorizedContracts =
        getOldAuthorizedContractAddresses.values.return;
      const oldAuthorizedHuman = getCurAuthorizedHumanaAddresses.values.return;
      // old (aka current) registered contract addresses will authorize new contract addresses
      // and they will authorize all the new human addresses
      if (oldAuthorizedContracts) {
        // change the mapping below to for-loop please:
        for (let i = 0; i < oldAuthorizedContracts.length; i++) {
          const address = oldAuthorizedContracts[i];
          // create an ethers contract instance for each address based on ThanksSecurityWrapper ABI
          const contract = new ethers.Contract(
            address,
            thanksPaySecurityWrapperABI,
            this.signer
          );
          // call the authorize method on each contract
          const tx = await contract.authorize(args.contractAddresses);
          await tx.wait();
          console.log("old autho. new contract addrs ??");
          const tx1 = await contract.authorize(args.humanAddresses);
          await tx1.wait();
          console.log("old autho. new human addrs ??");
        }
      }

      // new addresses that are contract will authorize old contract addresses as well
      // also, the new addresses will authorize themselves
      // also, they will also authorize all the old human addresses, and new human addresses
      for (let i = 0; i < args.contractAddresses.length; i++) {
        const address = args.contractAddresses[i];
        const contract = new ethers.Contract(
          address,
          thanksPaySecurityWrapperABI,
          this.signer
        );
        // call the authorize method on each contract
        const tx = await contract.authorize(args.contractAddresses);
        const receipt = await tx.wait();
        console.log("new autho. new contract addrs ??");
        const tx2 = await contract.authorize(oldAuthorizedContracts);
        const receipt2 = await tx2.wait();
        console.log("new autho. old contract addrs ??");
        const tx3 = await contract.authorize(args.humanAddresses);
        const receipt3 = await tx3.wait();
        console.log("new autho. new human addrrs ??");
        const tx4 = await contract.authorize(oldAuthorizedHuman);
        const receipt4 = await tx4.wait();
        console.log("new autho. old human addrrs ??");
      }
      // finally, add authorization to the old contract
      // return await this.sendTx("authorize", args.contractAddresses);
    },

    isAuthorized: async (args: ThanksPaySecurityType["isAuthorized"]) => {
      return (await this.sendTx("isAuthorized", args)) as CheckReturn;
    },
  };
}

export class OldThanks extends ThanksPayContracts {
  constructor(networkName: networkNameType) {
    super("OLD_THANKS_ADDR", networkName, oldThanksABI);
  }

  public methods = {
    cancelPay: async (
      args: ThanksPaySuperType["oldThanks"]["cancelPay"]
    ): Promise<any> => {
      const receipt = await this.sendTx("cancelPay", args);
      return receipt;
    },

    editPartner: async (
      args: ThanksPaySuperType["oldThanks"]["editPartner"]
    ): Promise<any> => {
      const receipt = await this.sendTx("editPartner", args);
      return receipt;
    },
    getAllPartner: async (
      args: ThanksPaySuperType["oldThanks"]["getAllPartner"]
    ): Promise<any> => {
      const receipt = await this.sendTx("getAllPartner", args);
      return receipt;
    },

    getAllWorker: async (
      args: ThanksPaySuperType["oldThanks"]["getAllWorker"]
    ): Promise<any> => {
      const receipt = await this.sendTx("getAllWorker", args);
      return receipt;
    },

    getPartner: async (
      args: ThanksPaySuperType["oldThanks"]["getPartner"]
    ): Promise<any> => {
      const receipt = await this.sendTx("getPartner", args);
      return receipt;
    },

    getPayByPartnerAndDate: async (
      args: ThanksPaySuperType["oldThanks"]["getPayByPartnerAndDate"]
    ): Promise<any> => {
      const receipt = await this.sendTx("getPayByPartnerAndDate", args);
      return receipt;
    },

    getPayByWorker: async (
      args: ThanksPaySuperType["oldThanks"]["getPayByWorker"]
    ): Promise<any> => {
      const receipt = await this.sendTx("getPayByWorker", args);
      return receipt;
    },

    getPayByWorkerAndDate: async (
      args: ThanksPaySuperType["oldThanks"]["getPayByWorkerAndDate"]
    ): Promise<any> => {
      const receipt = await this.sendTx("getPayByWorkerAndDate", args);
      return receipt;
    },

    newPartner: async (
      args: ThanksPaySuperType["oldThanks"]["newPartner"]
    ): Promise<any> => {
      const receipt = await this.sendTx("newPartner", args);
      return receipt;
    },

    newWorker: async (
      args: ThanksPaySuperType["oldThanks"]["newWorker"]
    ): Promise<any> => {
      const receipt = await this.sendTx("newWorker", args);
      return receipt;
    },

    partnerAddDeposit: async (
      args: ThanksPaySuperType["oldThanks"]["partnerAddDeposit"]
    ): Promise<any> => {
      const receipt = await this.sendTx("partnerAddDeposit", args);
      return receipt;
    },

    partnerMap: async (
      args: ThanksPaySuperType["oldThanks"]["partnerMap"]
    ): Promise<any> => {
      const receipt = await this.sendTx("partnerMap", args);
      return receipt;
    },

    partners: async (
      args: ThanksPaySuperType["oldThanks"]["partners"]
    ): Promise<any> => {
      const receipt = await this.sendTx("partners", args);
      return receipt;
    },

    pay: async (args: ThanksPaySuperType["oldThanks"]["pay"]): Promise<any> => {
      const receipt = await this.sendTx("pay", args);
      return receipt;
    },

    payRequest: async (
      args: ThanksPaySuperType["oldThanks"]["payRequest"]
    ): Promise<any> => {
      const receipt = await this.sendTx("payRequest", args);
      return receipt;
    },

    thanksAdmin: async (
      args: ThanksPaySuperType["oldThanks"]["thanksAdmin"]
    ): Promise<any> => {
      const receipt = await this.sendTx("thanksAdmin", args);
      return receipt;
    },

    workerMap: async (
      args: ThanksPaySuperType["oldThanks"]["workerMap"]
    ): Promise<any> => {
      const receipt = await this.sendTx("workerMap", args);
      return receipt;
    },

    workers: async (
      args: ThanksPaySuperType["oldThanks"]["workers"]
    ): Promise<any> => {
      const receipt = await this.sendTx("workers", args);
      return receipt;
    },
  };
}
