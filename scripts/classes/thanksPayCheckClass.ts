import { networkNameType } from "@scripts/types/networkNameType";
import { getContractAddress } from "@scripts/utils/getContractAddressUtil";
import { ThanksPayContracts } from "./baseContractClass";
import thanksPayCheckABI from "@abis/ThanksPayCheck.json";
import { CheckReturn } from "@scripts/types/returnType";
import { ThanksPayCheckType } from "@scripts/generatedTypes/ThanksPayCheckType";
import { ThanksPaySuperType } from "@scripts/generatedTypes/ThanksPaySuperType";

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
