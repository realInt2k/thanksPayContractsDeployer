import { ThanksPayMainType } from "@scripts/generatedTypes/ThanksPayMainType";
import { networkNameType } from "@scripts/types/networkNameType";
import { ThanksPayContracts } from "./baseContractClass";

import thanksPayMainABI from "@abis/ThanksPayMain.json";
import {ThanksPayCheck} from "./thanksPayCheckClass";


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
