import { networkNameType } from "@scripts/types/networkNameType";
import { ThanksPayContracts } from "./baseContractClass";
import {ThanksPayCheck} from "./thanksPayCheckClass";
import thanksPayDataABI from "../../abis/ThanksData.json";
import { ThanksPayDataType } from "@scripts/generatedTypes/ThanksPayDataType";
import { ViewReturn } from "@scripts/types/returnType";

export class ThanksPayData extends ThanksPayContracts {
  private thanksPayCheck: ThanksPayCheck;
  constructor(networkName: networkNameType) {
    super("THANKS_PAY_DATA_ADDR", networkName, thanksPayDataABI);
    this.thanksPayCheck = new ThanksPayCheck(networkName);
  }

  public methods = {
    registerPartner: async (args: ThanksPayDataType["registerPartner"]) => {
      const check: boolean = await this.thanksPayCheck.methods.registerPartnerCheck(
        args
      );
      console.log(args, check);
      const checkErrorString = "registerPartnerCheck failed";
      return await this.sendTx(
        "registerPartner",
        args,
        check,
        checkErrorString
      );
    },

    registerWorker: async (args: ThanksPayDataType["registerWorker"]): Promise<any> => {
      const check: boolean = await this.thanksPayCheck.methods.registerWorkerCheck(
        args
      );
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
