import { ThanksPaySuperType } from "@scripts/generatedTypes/ThanksPaySuperType";
import { networkNameType } from "@scripts/types/networkNameType";
import { ThanksPayContracts } from "./baseContractClass";
import oldThanksABI from "../../abis/oldThanks.json";

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
