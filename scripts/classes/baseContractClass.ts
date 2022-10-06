import { Contract } from "@ethersproject/contracts";
import { contractNameType } from "@scripts/types/contractNameType";
import { ContractABIType } from "@scripts/types/contractType";
import { networkNameType } from "@scripts/types/networkNameType";

import { Provider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
export type SignerOrProvider = Provider | Signer | undefined;

import thanksSecurityABI from "../../abis/ThanksSecurity.json";
import thanksPayDataABI from "../../abis/ThanksData.json";
import thanksPayMainABI from "../../abis/ThanksPayMain.json";
import thanksPayRelayABI from "../../abis/ThanksPayRelay.json";
import thanksPayCheckABI from "../../abis/ThanksPayCheck.json";
import thanksPaySecurityWrapperABI from "../../abis/ThanksSecurityWrapper.json";
import contractAddresses from "../contractAddresses.json";

const Web3 = require("web3");
const web3 = new Web3();
import { ethers } from "ethers";

import { getSigner } from "@scripts/utils/getSignerUtil";

import {
  SuccessReturn,
  ErrorReturn,
  ViewReturn,
  CheckReturn,
} from "@scripts/types/returnType";

import {
  writeToTxLog,
  writeReceiptTxLog,
} from "@scripts/utils/writeToTransactionLog";
import { getTxDetails } from "@scripts/utils/getTxDetailsUtil";
import { getContractAddress } from "@scripts/utils/getContractAddressUtil";

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
    } catch (e:any) {
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
